import { GameEventBus } from '../events/game-event-bus';
import type { RuntimeGameConfig } from '../config/runtime-game-config';
import type { GamePersistencePort } from '../persistence/persistence-types';
import { GameStore } from './game-store';

export type GameRuntime = {
  eventBus: GameEventBus;
  store: GameStore;
};

export type GameRuntimeOptions = {
  persistence?: GamePersistencePort | null;
  runtimeConfig?: RuntimeGameConfig;
};

export function createGameRuntime(options: GameRuntimeOptions = {}): GameRuntime {
  const eventBus = new GameEventBus();
  const store = new GameStore(eventBus, { persistence: options.persistence ?? null, runtimeConfig: options.runtimeConfig });

  return {
    eventBus,
    store,
  };
}
