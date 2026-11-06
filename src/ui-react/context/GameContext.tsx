import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from 'react';
import { createGameRuntime, type GameRuntime, type GameSnapshot } from '../../game-core';
import type { MiniGameId } from '../../game-core/minigames/minigame-types';
import type { TwitchChatMessage } from '../../game-core/twitch/twitch-message-types';
import { createDesktopPersistenceAdapter } from '../services/desktop-persistence-adapter';

type GameContextValue = {
  runtime: GameRuntime;
  snapshot: GameSnapshot;
  actions: {
    startTour: (miniGameIds?: MiniGameId[]) => void;
    startQuickMiniGame: (miniGameId?: MiniGameId) => void;
    endTour: () => void;
    backToStage: () => void;
    skipPhase: () => void;
    setLanguage: (locale: 'en' | 'ar') => void;
    submitTwitchMessage: (message: TwitchChatMessage) => void;
    submitPrivateStreamerAnswer: (params: { rawAnswer: string; displayName?: string | null; twitchUserId?: string | null }) => ReturnType<GameRuntime['store']['submitPrivateStreamerAnswer']>;
    registerStreamerPlayer: (params: { twitchUserId?: string | null; displayName?: string | null }) => ReturnType<GameRuntime['store']['registerStreamerPlayer']>;
  };
};

const GameContext = createContext<GameContextValue | null>(null);

/** Freeze only the stage's outgoing view while a curtain closes. Runtime and
 * actions still point to the live game; never rewind the game store itself. */
export function GameViewSnapshotProvider({ snapshot, children }: { snapshot: GameSnapshot; children: ReactNode }) {
  const parent = useGame();
  const view = useMemo(() => ({ ...parent, snapshot }), [parent, snapshot]);
  return <GameContext.Provider value={view}>{children}</GameContext.Provider>;
}


export function GameProvider({ children }: { children: ReactNode }) {
  const runtime = useMemo(() => createGameRuntime({ persistence: createDesktopPersistenceAdapter() }), []);

  const snapshot = useSyncExternalStore(
    (onStoreChange) => runtime.store.subscribe(() => onStoreChange()),
    () => runtime.store.getSnapshot(),
    () => runtime.store.getSnapshot(),
  );

  // FIX: actions only depend on runtime (which is stable), not snapshot.
  // Separating them prevents the entire actions object from being re-created
  // on every game state update (every tick, chat message, phase change, etc.).
  const actions = useMemo<GameContextValue['actions']>(() => ({
    startTour: (miniGameIds?: MiniGameId[]) => runtime.store.startTour(miniGameIds?.length ? miniGameIds.length : undefined, miniGameIds, 'tour'),
    startQuickMiniGame: (miniGameId?: MiniGameId) => runtime.store.startTour(miniGameId ? runtime.store.getSingleMiniGameRoundCount(miniGameId) : 1, miniGameId ? [miniGameId] : undefined, 'mini-game'),
    endTour: () => runtime.store.endTour(),
    backToStage: () => runtime.store.backToStage(),
    skipPhase: () => runtime.store.skipPhase(),
    setLanguage: (locale: 'en' | 'ar') => runtime.store.setLanguage(locale),
    submitTwitchMessage: (message: TwitchChatMessage) => runtime.store.submitTwitchChatMessage(message),
    submitPrivateStreamerAnswer: (params: { rawAnswer: string; displayName?: string | null; twitchUserId?: string | null }) => runtime.store.submitPrivateStreamerAnswer(params),
    registerStreamerPlayer: (params: { twitchUserId?: string | null; displayName?: string | null }) => runtime.store.registerStreamerPlayer(params),
  }), [runtime]);

  const value = useMemo<GameContextValue>(() => ({
    runtime,
    snapshot,
    actions,
  }), [runtime, snapshot, actions]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame(): GameContextValue {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error('useGame must be used inside GameProvider.');
  }

  return context;
}
