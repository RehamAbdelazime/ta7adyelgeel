import { app, BrowserWindow, ipcMain, screen, session } from 'electron';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs/promises';
import path from 'node:path';
import { TwitchIrcClient } from './twitch/TwitchIrcClient.js';
import { TwitchAuthService } from './twitch/TwitchAuthService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function resolveElectronPreloadPath(): string {
  const candidates = [
    path.join(__dirname, 'preload.cjs'),
    path.join(process.cwd(), 'dist-electron', 'preload.cjs'),
  ];

  const found = candidates.find((candidate) => existsSync(candidate));

  if (!found) {
    console.warn('[desktop] Electron preload not found. Tried:', candidates);
    return path.join(__dirname, 'preload.cjs');
  }

  return found;
}


const SAFE_STORAGE_FILES = new Set(['profiles.json', 'settings.json', 'tour-history.json']);
const MAX_STORAGE_JSON_BYTES = 1_500_000;
const ENABLE_DEVTOOLS = !app.isPackaged || process.env.ELGEEL_ENABLE_DEVTOOLS === '1';

type DisplayMode = 'fullscreen' | 'windowed' | 'borderless';
type ResolutionPreset = '1920x1080' | '1600x900' | '1366x768' | '1280x720';

type DisplaySettings = {
  displayMode: DisplayMode;
  resolution: ResolutionPreset;
};

const DISPLAY_SETTINGS_FILE = 'display-settings.json';
const DEFAULT_DISPLAY_SETTINGS: DisplaySettings = {
  displayMode: 'borderless',
  resolution: '1920x1080',
};

const RESOLUTION_SIZES: Record<ResolutionPreset, { width: number; height: number }> = {
  '1920x1080': { width: 1920, height: 1080 },
  '1600x900': { width: 1600, height: 900 },
  '1366x768': { width: 1366, height: 768 },
  '1280x720': { width: 1280, height: 720 },
};

let mainWindow: BrowserWindow | null = null;

function broadcastToRenderer(channel: string, payload: unknown): void {
  for (const window of BrowserWindow.getAllWindows()) {
    window.webContents.send(channel, payload);
  }
}

const twitchClient = new TwitchIrcClient({
  onStatus: (status) => {
    twitchAuthService.handleIrcStatus(status);
  },
  onMessage: (message) => {
    broadcastToRenderer('twitch:chatMessage', message);
  },
});

const twitchAuthService = new TwitchAuthService({
  getStorageDirectory,
  ircClient: twitchClient,
  onStatus: (status) => {
    broadcastToRenderer('twitch:status', status);
  },
});


function getRendererEntry(): string {
  return path.join(__dirname, '..', 'dist', 'index.html');
}

function getAppIconPath(): string {
  return path.join(__dirname, '..', 'dist', 'assets', 'app', 'app-icon.png');
}

function getStorageDirectory(): string {
  return path.join(app.getPath('userData'), 'el-geel-city');
}

function getStoragePath(fileName: string): string {
  if (typeof fileName !== 'string' || !SAFE_STORAGE_FILES.has(fileName)) {
    throw new Error(`Blocked unsafe storage file request: ${String(fileName)}`);
  }

  return path.join(getStorageDirectory(), fileName);
}

function assertTrustedIpcSender(event: Electron.IpcMainEvent | Electron.IpcMainInvokeEvent): void {
  if (!mainWindow || event.sender.id !== mainWindow.webContents.id) {
    throw new Error('Blocked IPC request from an unknown renderer.');
  }
}

function serializeSafeStorageJson(data: unknown): string {
  const serialized = JSON.stringify(data, null, 2);
  const byteLength = Buffer.byteLength(serialized, 'utf-8');

  if (byteLength > MAX_STORAGE_JSON_BYTES) {
    throw new Error(`Storage payload is too large (${byteLength} bytes).`);
  }

  return serialized;
}

function configureSessionSecurity(): void {
  session.defaultSession.setPermissionRequestHandler((_webContents, _permission, callback) => {
    callback(false);
  });
  session.defaultSession.setPermissionCheckHandler(() => false);
}

function createCorruptBackupPath(storagePath: string): string {
  const parsed = path.parse(storagePath);
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  return path.join(parsed.dir, `${parsed.name}.corrupt-${timestamp}${parsed.ext}.bak`);
}

async function ensureStorageDirectory(): Promise<void> {
  await fs.mkdir(getStorageDirectory(), { recursive: true });
}

async function readDisplaySettings(): Promise<DisplaySettings> {
  await ensureStorageDirectory();
  const filePath = path.join(getStorageDirectory(), DISPLAY_SETTINGS_FILE);

  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return sanitizeDisplaySettings(JSON.parse(content) as Partial<DisplaySettings>);
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;

    if (nodeError.code === 'ENOENT') {
      return DEFAULT_DISPLAY_SETTINGS;
    }

    if (error instanceof SyntaxError) {
      const backupPath = createCorruptBackupPath(filePath);
      await fs.rename(filePath, backupPath);
      return DEFAULT_DISPLAY_SETTINGS;
    }

    throw error;
  }
}

async function writeDisplaySettings(settings: DisplaySettings): Promise<void> {
  await ensureStorageDirectory();
  const filePath = path.join(getStorageDirectory(), DISPLAY_SETTINGS_FILE);
  const tempPath = `${filePath}.tmp`;
  await fs.writeFile(tempPath, JSON.stringify(settings, null, 2), 'utf-8');
  await fs.rename(tempPath, filePath);
}

function sanitizeDisplaySettings(value: Partial<DisplaySettings> | null | undefined): DisplaySettings {
  const displayMode = value?.displayMode === 'fullscreen' || value?.displayMode === 'windowed' || value?.displayMode === 'borderless'
    ? value.displayMode
    : DEFAULT_DISPLAY_SETTINGS.displayMode;
  const resolution = value?.resolution && value.resolution in RESOLUTION_SIZES
    ? value.resolution
    : DEFAULT_DISPLAY_SETTINGS.resolution;

  return { displayMode, resolution };
}

function getDisplayForWindow(win?: BrowserWindow | null) {
  return win ? screen.getDisplayMatching(win.getBounds()) : screen.getPrimaryDisplay();
}

function getCenteredWindowedBounds(width: number, height: number, win?: BrowserWindow | null) {
  const currentDisplay = getDisplayForWindow(win);
  const workArea = currentDisplay.workArea;
  const safeWidth = Math.min(width, workArea.width);
  const safeHeight = Math.min(height, workArea.height);

  return {
    x: Math.round(workArea.x + (workArea.width - safeWidth) / 2),
    y: Math.round(workArea.y + (workArea.height - safeHeight) / 2),
    width: safeWidth,
    height: safeHeight,
  };
}

function getFullDisplayBounds(win?: BrowserWindow | null) {
  const currentDisplay = getDisplayForWindow(win);
  return { ...currentDisplay.bounds };
}

function getInitialWindowBounds(settings: DisplaySettings) {
  if (settings.displayMode === 'windowed') {
    const { width, height } = RESOLUTION_SIZES[settings.resolution];
    return getCenteredWindowedBounds(width, height, null);
  }

  return getFullDisplayBounds(null);
}

function enterRealFullscreen(win: BrowserWindow): void {
  const bounds = getFullDisplayBounds(win);

  // Leave every previous state first. This makes switching from windowed/borderless
  // into fullscreen deterministic on Windows instead of preserving the old small bounds.
  win.setResizable(true);
  if (win.isMaximized()) {
    win.unmaximize();
  }
  if (!win.isVisible()) {
    win.show();
  }

  win.setBounds(bounds, false);
  win.setFullScreen(true);
  win.setResizable(false);
}

function enterBorderlessFullscreen(win: BrowserWindow): void {
  const bounds = getFullDisplayBounds(win);

  // Borderless/windowed fullscreen is NOT OS fullscreen. It is a frameless window
  // covering the monitor, so alt-tab/mouse-out behavior stays normal.
  win.setResizable(true);
  win.setFullScreen(false);
  if (win.isMaximized()) {
    win.unmaximize();
  }
  win.setAlwaysOnTop(false);
  win.setBounds(bounds, false);
  win.setResizable(false);
  if (!win.isVisible()) {
    win.show();
  }
}

function enterWindowed(win: BrowserWindow, settings: DisplaySettings): void {
  const { width, height } = RESOLUTION_SIZES[settings.resolution];

  win.setResizable(true);
  win.setFullScreen(false);
  if (win.isMaximized()) {
    win.unmaximize();
  }
  win.setAlwaysOnTop(false);
  win.setBounds(getCenteredWindowedBounds(width, height, win), false);
  if (!win.isVisible()) {
    win.show();
  }
}

function applyDisplaySettings(win: BrowserWindow, settings: DisplaySettings): void {
  if (settings.displayMode === 'fullscreen') {
    enterRealFullscreen(win);
    return;
  }

  if (settings.displayMode === 'borderless') {
    enterBorderlessFullscreen(win);
    return;
  }

  enterWindowed(win, settings);
}

function broadcastDisplaySettings(settings: DisplaySettings): void {
  broadcastToRenderer('display:settingsChanged', settings);
}

async function createMainWindow(): Promise<void> {
  const initialDisplaySettings = await readDisplaySettings();
  const initialBounds = getInitialWindowBounds(initialDisplaySettings);

  const win = new BrowserWindow({
    x: initialBounds.x,
    y: initialBounds.y,
    width: initialBounds.width,
    height: initialBounds.height,
    minWidth: 1280,
    minHeight: 720,
    frame: false,
    resizable: initialDisplaySettings.displayMode === 'windowed',
    fullscreenable: true,
    fullscreen: initialDisplaySettings.displayMode === 'fullscreen',
    autoHideMenuBar: true,
    backgroundColor: '#050017',
    title: 'Ta7ady ElGeel',
    icon: getAppIconPath(),
    webPreferences: {
      preload: resolveElectronPreloadPath(),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      webSecurity: true,
      allowRunningInsecureContent: false,
      experimentalFeatures: false,
      spellcheck: false,
      devTools: ENABLE_DEVTOOLS,
    },
  });

  mainWindow = win;
  applyDisplaySettings(win, initialDisplaySettings);

  const devServerUrl = process.env.VITE_DEV_SERVER_URL;

  win.on('closed', () => {
    if (mainWindow === win) {
      mainWindow = null;
    }
  });

  win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));

  if (!ENABLE_DEVTOOLS) {
    win.webContents.on('devtools-opened', () => {
      win.webContents.closeDevTools();
    });
    win.webContents.on('before-input-event', (event, input) => {
      const key = input.key.toLowerCase();
      const modifierPressed = input.control || input.meta;
      const opensDevTools = input.key === 'F12' || (modifierPressed && input.shift && ['i', 'j', 'c'].includes(key));

      if (opensDevTools) {
        event.preventDefault();
      }
    });
  }

  win.webContents.on('will-navigate', (event, targetUrl) => {
    const allowedUrl = devServerUrl ?? `file://${getRendererEntry()}`;

    if (!targetUrl.startsWith(allowedUrl)) {
      event.preventDefault();
    }
  });

  if (devServerUrl) {
    await win.loadURL(devServerUrl);
    return;
  }

  await win.loadFile(getRendererEntry());
}

app.whenReady().then(async () => {
  configureSessionSecurity();
  await ensureStorageDirectory();
  await createMainWindow();

  app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      await createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.on('window:minimize', (event) => {
  assertTrustedIpcSender(event);
  BrowserWindow.fromWebContents(event.sender)?.minimize();
});

ipcMain.on('window:close', (event) => {
  assertTrustedIpcSender(event);
  BrowserWindow.fromWebContents(event.sender)?.close();
});

ipcMain.handle('storage:readJson', async (event, fileName: string) => {
  assertTrustedIpcSender(event);
  await ensureStorageDirectory();
  const storagePath = getStoragePath(fileName);

  try {
    const content = await fs.readFile(storagePath, 'utf-8');
    return JSON.parse(content) as unknown;
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;

    if (nodeError.code === 'ENOENT') {
      return null;
    }

    if (error instanceof SyntaxError) {
      const backupPath = createCorruptBackupPath(storagePath);
      await fs.rename(storagePath, backupPath);
      return null;
    }

    throw error;
  }
});

ipcMain.handle('storage:writeJson', async (event, fileName: string, data: unknown) => {
  assertTrustedIpcSender(event);
  await ensureStorageDirectory();
  const storagePath = getStoragePath(fileName);
  const tempPath = `${storagePath}.tmp`;

  await fs.writeFile(tempPath, serializeSafeStorageJson(data), 'utf-8');
  await fs.rename(tempPath, storagePath);
  return true;
});

ipcMain.handle('twitch:startAuth', (event) => {
  assertTrustedIpcSender(event);
  return twitchAuthService.startConnect();
});

ipcMain.handle('twitch:reconnect', (event) => {
  assertTrustedIpcSender(event);
  return twitchAuthService.reconnect();
});

ipcMain.handle('twitch:disconnect', (event) => {
  assertTrustedIpcSender(event);
  return twitchAuthService.disconnect();
});

ipcMain.handle('twitch:getStatus', (event) => {
  assertTrustedIpcSender(event);
  return twitchAuthService.getStatus();
});


ipcMain.handle('display:getSettings', (event) => {
  assertTrustedIpcSender(event);
  return readDisplaySettings();
});

ipcMain.handle('display:setSettings', async (event, requestedSettings: Partial<DisplaySettings>) => {
  assertTrustedIpcSender(event);
  const settings = sanitizeDisplaySettings(requestedSettings);
  await writeDisplaySettings(settings);

  if (mainWindow) {
    applyDisplaySettings(mainWindow, settings);
  }

  broadcastDisplaySettings(settings);
  return settings;
});
