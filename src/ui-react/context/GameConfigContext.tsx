import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { normalizeRuntimeGameConfig, DEFAULT_RUNTIME_GAME_CONFIG, type RuntimeGameConfig } from '../../game-core/config/runtime-game-config';
import { useGame } from './GameContext';

type GameConfigContextValue = {
  config: RuntimeGameConfig;
  configPath: string;
  loadedAt: number | null;
  lastError: string | null;
  reloadGameConfig: () => Promise<{ ok: boolean; error?: string }>;
};

const GAMEPLAY_CONFIG_PATH = './assets/game/runtime/config/gameplay-config.json';
const GameConfigContext = createContext<GameConfigContextValue | null>(null);

export function GameConfigProvider({ children }: { children: ReactNode }) {
  const { runtime } = useGame();
  const [config, setConfig] = useState<RuntimeGameConfig>(DEFAULT_RUNTIME_GAME_CONFIG);
  const [loadedAt, setLoadedAt] = useState<number | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);

  const reloadGameConfig = useCallback(async () => {
    try {
      const response = await fetch(`${GAMEPLAY_CONFIG_PATH}?v=${Date.now()}`, { cache: 'no-store' });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const rawConfig = await response.json();
      const normalized = normalizeRuntimeGameConfig(rawConfig);
      runtime.store.applyRuntimeConfig(normalized);
      setConfig(normalized);
      setLoadedAt(Date.now());
      setLastError(null);
      return { ok: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown gameplay config error';
      runtime.store.applyRuntimeConfig(DEFAULT_RUNTIME_GAME_CONFIG);
      setConfig(DEFAULT_RUNTIME_GAME_CONFIG);
      setLastError(message);
      return { ok: false, error: message };
    }
  }, [runtime.store]);

  useEffect(() => {
    void reloadGameConfig();
  }, [reloadGameConfig]);

  const value = useMemo<GameConfigContextValue>(() => ({
    config,
    configPath: GAMEPLAY_CONFIG_PATH,
    loadedAt,
    lastError,
    reloadGameConfig,
  }), [config, lastError, loadedAt, reloadGameConfig]);

  return <GameConfigContext.Provider value={value}>{children}</GameConfigContext.Provider>;
}

export function useGameConfig(): GameConfigContextValue {
  const context = useContext(GameConfigContext);

  if (!context) {
    throw new Error('useGameConfig must be used inside GameConfigProvider.');
  }

  return context;
}
