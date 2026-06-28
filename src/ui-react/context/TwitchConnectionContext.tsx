import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useGame } from './GameContext';
import type { ElGeelTwitchApi } from '../../desktop-electron/preload';

type DesktopTwitchApi = ElGeelTwitchApi;
type TwitchStatus = Awaited<ReturnType<DesktopTwitchApi['getStatus']>>;

function getDesktopTwitchApi(): DesktopTwitchApi | null {
  if (typeof window === 'undefined') return null;

  const desktopWindow = window as unknown as {
    elGeel?: { twitch?: DesktopTwitchApi };
    electronAPI?: { twitch?: DesktopTwitchApi };
    desktopTwitchBridge?: DesktopTwitchApi;
    desktopTwitch?: DesktopTwitchApi;
    twitchBridge?: DesktopTwitchApi;
  };

  return desktopWindow.elGeel?.twitch
    ?? desktopWindow.electronAPI?.twitch
    ?? desktopWindow.desktopTwitchBridge
    ?? desktopWindow.desktopTwitch
    ?? desktopWindow.twitchBridge
    ?? null;
}

type TwitchConnectionContextValue = {
  status: TwitchStatus;
  error: string | null;
  isBootstrapping: boolean;
  isConnected: boolean;
  isBusy: boolean;
  canUseDesktopBridge: boolean;
  connect: () => Promise<void>;
  reconnect: () => Promise<void>;
  disconnect: () => Promise<void>;
  refreshStatus: () => Promise<void>;
};

const fallbackStatus: TwitchStatus = {
  state: 'idle',
  channelName: null,
  ircLogin: null,
  message: 'Twitch is idle.',
  connectedAt: null,
  lastError: null,
  userCode: null,
  verificationUri: null,
  expiresAt: null,
  accountDisplayName: null,
  accountLogin: null,
  accountUserId: null,
  clientConfigured: false,
};

const TwitchConnectionContext = createContext<TwitchConnectionContextValue | null>(null);

export function TwitchConnectionProvider({ children }: { children: ReactNode }) {
  const { actions } = useGame();
  const actionsRef = useRef(actions);
  const [status, setStatus] = useState<TwitchStatus>(fallbackStatus);
  const [error, setError] = useState<string | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const registeredStreamerUserIdRef = useRef<string | null>(null);

  actionsRef.current = actions;

  const registerConnectedStreamer = useCallback((nextStatus: TwitchStatus) => {
    if (nextStatus.state !== 'connected' || !nextStatus.accountUserId) {
      return;
    }

    const displayName = nextStatus.accountDisplayName || nextStatus.channelName || nextStatus.accountLogin || 'STREAMER';
    const registrationKey = `${nextStatus.accountUserId}:${displayName}`;

    if (registeredStreamerUserIdRef.current === registrationKey) {
      return;
    }

    registeredStreamerUserIdRef.current = registrationKey;
    actionsRef.current.registerStreamerPlayer({
      twitchUserId: nextStatus.accountUserId,
      displayName,
    });
  }, []);

  const refreshStatus = useCallback(async () => {
    const api = getDesktopTwitchApi();

    if (!api) {
      setStatus(fallbackStatus);
      setError('Desktop Twitch bridge is unavailable.');
      return;
    }

    const nextStatus = await api.getStatus();
    setStatus(nextStatus);
    setError(nextStatus.lastError);
    registerConnectedStreamer(nextStatus);
  }, [registerConnectedStreamer]);

  const connect = useCallback(async () => {
    const api = getDesktopTwitchApi();

    if (!api) {
      setError('Desktop Twitch bridge is unavailable.');
      return;
    }

    setError(null);

    try {
      const nextStatus = await api.startAuth();
      setStatus(nextStatus);
      setError(nextStatus.lastError);
      registerConnectedStreamer(nextStatus);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }, [registerConnectedStreamer]);

  const reconnect = useCallback(async () => {
    const api = getDesktopTwitchApi();

    if (!api) {
      setError('Desktop Twitch bridge is unavailable.');
      return;
    }

    setError(null);

    try {
      const nextStatus = await api.reconnect();
      setStatus(nextStatus);
      setError(nextStatus.lastError);
      registerConnectedStreamer(nextStatus);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }, [registerConnectedStreamer]);

  const disconnect = useCallback(async () => {
    const api = getDesktopTwitchApi();

    if (!api) {
      setError('Desktop Twitch bridge is unavailable.');
      return;
    }

    setError(null);

    try {
      const nextStatus = await api.disconnect();
      setStatus(nextStatus);
      setError(nextStatus.lastError);
      registeredStreamerUserIdRef.current = null;
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }, []);

  useEffect(() => {
    const api = getDesktopTwitchApi();

    if (!api) {
      setStatus(fallbackStatus);
      setError('Desktop Twitch bridge is unavailable.');
      setIsBootstrapping(false);
      return;
    }

    let disposed = false;

    const removeStatusListener = api.onStatus((nextStatus) => {
      if (disposed) {
        return;
      }

      setStatus(nextStatus);
      setError(nextStatus.lastError);
      registerConnectedStreamer(nextStatus);
      setIsBootstrapping(false);
    });

    const removeMessageListener = api.onChatMessage((message) => {
      actionsRef.current.submitTwitchMessage(message);
    });

    void (async () => {
      try {
        const initialStatus = await api.getStatus();

        if (disposed) {
          return;
        }

        setStatus(initialStatus);
        setError(initialStatus.lastError);
        registerConnectedStreamer(initialStatus);

        if (initialStatus.state === 'connected' || initialStatus.state === 'connecting' || initialStatus.state === 'reconnecting') {
          setIsBootstrapping(false);
          return;
        }

        const reconnectedStatus = await api.reconnect();

        if (disposed) {
          return;
        }

        setStatus(reconnectedStatus);
        setError(reconnectedStatus.lastError);
        registerConnectedStreamer(reconnectedStatus);
      } catch (err) {
        if (!disposed) {
          setError(getErrorMessage(err));
        }
      } finally {
        if (!disposed) {
          setIsBootstrapping(false);
        }
      }
    })();

    return () => {
      disposed = true;
      removeStatusListener();
      removeMessageListener();
    };
  }, [registerConnectedStreamer]);

  const value = useMemo<TwitchConnectionContextValue>(() => {
    const isConnected = status.state === 'connected';
    const isBusy = status.state === 'connecting' || status.state === 'reconnecting' || status.state === 'awaitingAuthorization';

    return {
      status,
      error,
      isBootstrapping,
      isConnected,
      isBusy,
      canUseDesktopBridge: Boolean(getDesktopTwitchApi()),
      connect,
      reconnect,
      disconnect,
      refreshStatus,
    };
  }, [connect, disconnect, error, isBootstrapping, reconnect, refreshStatus, status]);

  return <TwitchConnectionContext.Provider value={value}>{children}</TwitchConnectionContext.Provider>;
}

export function useTwitchConnection(): TwitchConnectionContextValue {
  const context = useContext(TwitchConnectionContext);

  if (!context) {
    throw new Error('useTwitchConnection must be used inside TwitchConnectionProvider.');
  }

  return context;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}
