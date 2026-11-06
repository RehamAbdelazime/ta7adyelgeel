/**
 * QA ONLY — synthetic Twitch messages go through the *actual* game router.
 * This helper is imported by Node regression tests only. It is not bundled into
 * the release renderer. IDs are namespaced and excluded from persistence by GameStore.
 */
import type { GameRuntime, GameSnapshot, TwitchChatMessage } from '../../src/game-core';

export const QA_BOT_PREFIX = '__ta7ady_qa_bot__';
export type QaBotBehavior = 'mixed' | 'random' | 'one';
const MAX_QA_BOTS = 500;

export function makeQaBotMessage(twitchUserId: string, displayName: string, command: string): TwitchChatMessage {
  return { twitchUserId, displayName, message: command, isBroadcaster: false, isMod: false, badges: ['qa'], timestamp: Date.now() };
}

export function qaAnswerOptions(snapshot: GameSnapshot): string[] {
  const game = snapshot.miniGame;
  if (game.id === 'count-the-beat') {
    // Numeric answers 0–99; provide a spread of plausible guesses for testing.
    const number = Math.max(1, Math.min(18, 3 + game.roundNumber * 2));
    return [String(number - 2), String(number), String(number + 1), String(number + 3)].map(value => `!${value}`);
  }
  if (game.id === 'lucky-cup') return ['!1', '!2', '!3'];
  if (game.id === 'couple-or-siblings') return ['!1', '!2'];
  const data = game.shapeGrid?.choices ?? game.foodOrigin?.choices ?? game.mazeGates?.choices ?? game.memoryCount?.choices;
  return data?.length ? data.map(item => item.command) : ['!1', '!2', '!3', '!4'];
}

export class QaBotController {
  private readonly ids: { id: string; display: string }[] = [];
  private readonly batchId = `${Date.now().toString(36)}_${Math.floor(Math.random() * 100000).toString(36)}`;
  private generation = 0; // Every clear/re-add must use NEW IDs (Twitch cooldowns persist).
  private auto = false;
  private behavior: QaBotBehavior = 'mixed';
  private lastQuestionKey = '';
  private answerTimers = new Set<ReturnType<typeof setTimeout>>();
  private joinTimers = new Set<ReturnType<typeof setTimeout>>();
  private destroyed = false;
  private unsubscribe: (() => void) | null = null;
  private readonly listeners = new Set<() => void>();

  constructor(private readonly runtime: GameRuntime) {
    this.activate();
  }

  /**
   * React StrictMode intentionally replays useEffect setup -> cleanup -> setup
   * in development. Reopen the controller after that simulated cleanup, so
   * HOST/QA buttons and the automated visual runner can still add bots.
   * This is also safe for an actual mount/unmount cycle.
   */
  activate(): void {
    if (!this.destroyed && this.unsubscribe) return;
    this.destroyed = false;
    this.unsubscribe = this.runtime.store.subscribe(() => this.onStoreChanged());
    this.onStoreChanged();
  }
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
  getSnapshot() { return { count: this.ids.length, auto: this.auto, behavior: this.behavior, active: !this.destroyed }; }
  private notify() { for (const listener of this.listeners) listener(); }

  /** Chunk joins to avoid freezing React when testing 100–500 viewers. */
  add(count: number): void {
    const remaining = Math.min(Math.max(0, Math.floor(count)), MAX_QA_BOTS - this.ids.length);
    if (!remaining || this.destroyed) return;
    const start = this.ids.length;
    for (let i = 0; i < remaining; i++) {
      const n = start + i + 1;
      this.ids.push({ id: `${QA_BOT_PREFIX}${this.batchId}_g${this.generation}_${n}`, display: `BOT_${String(n).padStart(3, '0')}` });
    }
    const joinChunk = (offset: number) => {
      if (this.destroyed) return;
      const end = Math.min(remaining, offset + 20);
      for (let i = offset; i < end; i++) {
        const bot = this.ids[start + i];
        if (!bot) continue;
        this.runtime.store.submitTwitchChatMessage(makeQaBotMessage(bot.id, bot.display, '!join'));
      }
      if (end < remaining) this.schedule(() => joinChunk(end), 8, 'join');
      else this.onStoreChanged();
    };
    joinChunk(0);
    this.notify();
  }

  setAuto(on: boolean, behavior: QaBotBehavior = this.behavior): void {
    this.auto = on;
    this.behavior = behavior;
    this.lastQuestionKey = '';
    if (!on) this.cancelAnswerTimers();
    this.notify();
    if (on) this.onStoreChanged();
  }
  /** Do not delete real viewers; require Lobby/final state before clearing bots. */
  clear(): void {
    if (this.runtime.store.getSnapshot().tour.isTourActive) return;
    this.setAuto(false);
    this.cancelAnswerTimers();
    this.cancelJoinTimers();
    this.runtime.store.clearQaTestBots();
    this.ids.length = 0;
    this.generation += 1;
    this.lastQuestionKey = '';
    this.notify();
  }
  /** Manual one-shot for current question, independent of auto mode. */
  answerNow(behavior: QaBotBehavior = this.behavior): void {
    const snapshot = this.runtime.store.getSnapshot();
    if (!snapshot.tour.acceptsAnswers || snapshot.tour.isPaused) return;
    this.answerChunk(snapshot, behavior, 0);
  }

  private onStoreChanged(): void {
    if (!this.auto || !this.ids.length || this.destroyed) return;
    const s = this.runtime.store.getSnapshot();
    if (!s.tour.acceptsAnswers || s.tour.isPaused) {
      // Pause must not permanently consume this question's auto-answer attempt.
      this.cancelAnswerTimers();
      this.lastQuestionKey = '';
      return;
    }
    const key = `${s.tour.tourId}/${s.tour.roundNumber}/${s.miniGame.id}/${s.miniGame.questionId}`;
    if (key === this.lastQuestionKey) return;
    this.lastQuestionKey = key;
    // Give real players a moment to see the question; don't delay until reveal.
    this.schedule(() => this.answerChunk(s, this.behavior, 0), 650, 'answer');
  }

  private answerChunk(initial: GameSnapshot, behavior: QaBotBehavior, offset: number) {
    const s = this.runtime.store.getSnapshot();
    if (this.destroyed || !s.tour.acceptsAnswers || s.tour.isPaused ||
      s.tour.tourId !== initial.tour.tourId || s.tour.roundNumber !== initial.tour.roundNumber ||
      s.miniGame.questionId !== initial.miniGame.questionId) return;
    const options = qaAnswerOptions(s);
    const n = Math.min(offset + 25, this.ids.length);
    for (let i = offset; i < n; i++) {
      const bot = this.ids[i];
      if (!bot || !s.citizens.some(c => c.twitchUserId === bot.id)) continue;
      const index = behavior === 'one' ? 0 : behavior === 'random' ? Math.floor(Math.random() * options.length) : i % options.length;
      const choice = options[index] ?? '!1';
      this.runtime.store.submitTwitchChatMessage(makeQaBotMessage(bot.id, bot.display, choice));
    }
    if (n < this.ids.length) this.schedule(() => this.answerChunk(initial, behavior, n), 12, 'answer');
  }
  private schedule(fn: () => void, delay: number, kind: 'join' | 'answer') {
    const group = kind === 'join' ? this.joinTimers : this.answerTimers;
    const id = setTimeout(() => { group.delete(id); fn(); }, delay);
    group.add(id);
  }
  private cancelAnswerTimers() { for (const t of this.answerTimers) clearTimeout(t); this.answerTimers.clear(); }
  private cancelJoinTimers() { for (const t of this.joinTimers) clearTimeout(t); this.joinTimers.clear(); }
  destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    this.auto = false;
    this.cancelAnswerTimers();
    this.cancelJoinTimers();
    this.unsubscribe?.();
    this.unsubscribe = null;
    this.listeners.clear();
  }
}
