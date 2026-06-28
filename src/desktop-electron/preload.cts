import { contextBridge, ipcRenderer } from 'electron';
import type { TwitchAuthStatus } from './twitch/TwitchAuthService.js';
import type { TwitchIrcChatMessage } from './twitch/TwitchIrcClient.js';

export type DisplayMode = 'fullscreen' | 'windowed' | 'borderless';
export type ResolutionPreset = '1920x1080' | '1600x900' | '1366x768' | '1280x720';

export type DisplaySettings = {
  displayMode: DisplayMode;
  resolution: ResolutionPreset;
};

const twitchApi = {
  startAuth: () => ipcRenderer.invoke('twitch:startAuth') as Promise<TwitchAuthStatus>,
  reconnect: () => ipcRenderer.invoke('twitch:reconnect') as Promise<TwitchAuthStatus>,
  disconnect: () => ipcRenderer.invoke('twitch:disconnect') as Promise<TwitchAuthStatus>,
  getStatus: () => ipcRenderer.invoke('twitch:getStatus') as Promise<TwitchAuthStatus>,
  onStatus: (listener: (status: TwitchAuthStatus) => void) => {
    const wrapped = (_event: Electron.IpcRendererEvent, status: TwitchAuthStatus) => listener(status);
    ipcRenderer.on('twitch:status', wrapped);
    return () => ipcRenderer.removeListener('twitch:status', wrapped);
  },
  onChatMessage: (listener: (message: TwitchIrcChatMessage) => void) => {
    const wrapped = (_event: Electron.IpcRendererEvent, message: TwitchIrcChatMessage) => listener(message);
    ipcRenderer.on('twitch:chatMessage', wrapped);
    return () => ipcRenderer.removeListener('twitch:chatMessage', wrapped);
  },
};

const api = {
  window: {
    minimize: () => ipcRenderer.send('window:minimize'),
    close: () => ipcRenderer.send('window:close'),
  },
  storage: {
    readJson: <T,>(fileName: string) => ipcRenderer.invoke('storage:readJson', fileName) as Promise<T | null>,
    writeJson: (fileName: string, data: unknown) => ipcRenderer.invoke('storage:writeJson', fileName, data) as Promise<boolean>,
  },
  display: {
    getSettings: () => ipcRenderer.invoke('display:getSettings') as Promise<DisplaySettings>,
    setSettings: (settings: Partial<DisplaySettings>) => ipcRenderer.invoke('display:setSettings', settings) as Promise<DisplaySettings>,
    onSettingsChanged: (listener: (settings: DisplaySettings) => void) => {
      const wrapped = (_event: Electron.IpcRendererEvent, settings: DisplaySettings) => listener(settings);
      ipcRenderer.on('display:settingsChanged', wrapped);
      return () => ipcRenderer.removeListener('display:settingsChanged', wrapped);
    },
  },
  twitch: twitchApi,
};

const electronAPI = {
  isDesktop: true,
  bridgeReady: true,
  twitch: twitchApi,
  elGeel: api,
};

contextBridge.exposeInMainWorld('elGeel', api);
contextBridge.exposeInMainWorld('electronAPI', electronAPI);
contextBridge.exposeInMainWorld('desktopTwitchBridge', twitchApi);
contextBridge.exposeInMainWorld('desktopTwitch', twitchApi);
contextBridge.exposeInMainWorld('twitchBridge', twitchApi);
contextBridge.exposeInMainWorld('__TA7ADY_PRELOAD_READY__', true);

export type ElGeelDesktopApi = typeof api;
export type ElGeelTwitchApi = typeof twitchApi;
