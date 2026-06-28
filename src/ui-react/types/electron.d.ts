import type { ElGeelDesktopApi, ElGeelTwitchApi } from '../../desktop-electron/preload';

declare global {
  interface Window {
    elGeel?: ElGeelDesktopApi;
    electronAPI?: {
      isDesktop: true;
      bridgeReady: true;
      twitch: ElGeelTwitchApi;
      elGeel: ElGeelDesktopApi;
    };
    desktopTwitchBridge?: ElGeelTwitchApi;
    desktopTwitch?: ElGeelTwitchApi;
    twitchBridge?: ElGeelTwitchApi;
    __TA7ADY_PRELOAD_READY__?: true;
  }
}

export {};
