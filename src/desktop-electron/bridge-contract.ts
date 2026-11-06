/**
 * Shared, type-only contract between the Electron preload and React renderer.
 * The renderer must NEVER import the executable preload.cts module: that file
 * depends on Electron IPC and is emitted as preload.cjs by the desktop build.
 */
import type { TwitchAuthStatus } from './twitch/TwitchAuthService.js';
import type { TwitchIrcChatMessage } from './twitch/TwitchIrcClient.js';

export type DisplayMode = 'fullscreen' | 'windowed' | 'borderless';
export type ResolutionPreset = '1920x1080' | '1600x900' | '1366x768' | '1280x720';
export type DisplaySettings = { displayMode: DisplayMode; resolution: ResolutionPreset };

export type ElGeelTwitchApi = {
  startAuth: () => Promise<TwitchAuthStatus>;
  reconnect: () => Promise<TwitchAuthStatus>;
  disconnect: () => Promise<TwitchAuthStatus>;
  getStatus: () => Promise<TwitchAuthStatus>;
  onStatus: (listener: (status: TwitchAuthStatus) => void) => () => void;
  onChatMessage: (listener: (message: TwitchIrcChatMessage) => void) => () => void;
};

export type ElGeelDesktopApi = {
  window: { minimize: () => void; close: () => void };
  storage: {
    readJson: <T>(fileName: string) => Promise<T | null>;
    writeJson: (fileName: string, data: unknown) => Promise<boolean>;
  };
  display: {
    getSettings: () => Promise<DisplaySettings>;
    setSettings: (settings: Partial<DisplaySettings>) => Promise<DisplaySettings>;
    onSettingsChanged: (listener: (settings: DisplaySettings) => void) => () => void;
  };
  twitch: ElGeelTwitchApi;
};
