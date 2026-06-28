import type { GameEvent, GameEventListener } from './game-events';

export class GameEventBus {
  private readonly listeners = new Set<GameEventListener>();

  emit(event: GameEvent): void {
    for (const listener of this.listeners) {
      listener(event);
    }
  }

  subscribe(listener: GameEventListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}
