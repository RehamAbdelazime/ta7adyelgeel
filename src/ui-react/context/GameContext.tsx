import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from 'react';
import { createGameRuntime, type GameRuntime, type GameSnapshot } from '../../game-core';
import type { MiniGameId } from '../../game-core/minigames/minigame-types';
import type { HostChaosMode } from '../../game-core/app/game-snapshot';
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
    pauseTour: () => void;
    resumeTour: () => void;
    skipPhase: () => void;
    skipRound: () => void;
    restartRound: () => void;
    setTourRoundCount: (roundCount: number) => void;
    setMiniGameEnabled: (miniGameId: MiniGameId, enabled: boolean) => void;
    setForcedNextMiniGame: (miniGameId: MiniGameId | null) => void;
    setChaosMode: (mode: HostChaosMode) => void;
    forceNextChaosEvent: (eventId: string | null) => void;
    clearSpectators: () => void;
    clearRuntimePlayers: () => void;
    resetRuntimeScores: () => void;
    triggerLevel10ChampionCelebrationTest: () => void;
    setLanguage: (locale: 'en' | 'ar') => void;
    switchLanguage: () => void;
    submitTwitchMessage: (message: TwitchChatMessage) => void;
    submitPrivateStreamerAnswer: (params: { rawAnswer: string; displayName?: string | null; twitchUserId?: string | null }) => ReturnType<GameRuntime['store']['submitPrivateStreamerAnswer']>;
    registerStreamerPlayer: (params: { twitchUserId?: string | null; displayName?: string | null }) => ReturnType<GameRuntime['store']['registerStreamerPlayer']>;
  };
};

const GameContext = createContext<GameContextValue | null>(null);

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
    pauseTour: () => runtime.store.pauseTour(),
    resumeTour: () => runtime.store.resumeTour(),
    skipPhase: () => runtime.store.skipPhase(),
    skipRound: () => runtime.store.skipRound(),
    restartRound: () => runtime.store.restartRound(),
    setTourRoundCount: (roundCount: number) => runtime.store.setTourRoundCount(roundCount),
    setMiniGameEnabled: (miniGameId: MiniGameId, enabled: boolean) => runtime.store.setMiniGameEnabled(miniGameId, enabled),
    setForcedNextMiniGame: (miniGameId: MiniGameId | null) => runtime.store.setForcedNextMiniGame(miniGameId),
    setChaosMode: (mode: HostChaosMode) => runtime.store.setChaosMode(mode),
    forceNextChaosEvent: (eventId: string | null) => runtime.store.forceNextChaosEvent(eventId),
    clearSpectators: () => runtime.store.clearSpectators(),
    clearRuntimePlayers: () => runtime.store.clearRuntimePlayers(),
    resetRuntimeScores: () => runtime.store.resetRuntimeScores(),
    triggerLevel10ChampionCelebrationTest: () => runtime.store.triggerLevel10ChampionCelebrationTest(),
    setLanguage: (locale: 'en' | 'ar') => runtime.store.setLanguage(locale),
    switchLanguage: () => runtime.store.switchLanguage(),
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
