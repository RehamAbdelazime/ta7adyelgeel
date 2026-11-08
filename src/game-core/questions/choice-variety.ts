/**
 * V64: shared, bounded, offline-only memory for multiple-choice games.
 * Choices are authored/verified by each game's own domain selector; this layer
 * only prefers genuinely new sets of wrong answers and rotates answer slots.
 * No personal/viewer data is stored and storage failure never stops a round.
 */
export type ChoiceStorage = Pick<Storage, 'getItem' | 'setItem'>;
export type ChoiceHistoryEntry = { recent: string[]; lastSlot?: number; plays?: number };
const MAX_ENTRIES = 550;
const MAX_RECENT = 6;
const KEY_PREFIX = 'ta7ady:choice-variety:v1:';
const MAX_STORAGE_LENGTH = 180_000;

export function defaultChoiceStorage(): ChoiceStorage | null {
  try { return typeof localStorage === 'undefined' ? null : localStorage; }
  catch { return null; }
}

function safeRecord(value: unknown): ChoiceHistoryEntry | null {
  if (!value || typeof value !== 'object') return null;
  const record = value as Partial<ChoiceHistoryEntry>;
  return {
    recent: Array.isArray(record.recent) ? record.recent.filter((item): item is string =>
      typeof item === 'string' && item.length <= 300).slice(-MAX_RECENT) : [],
    lastSlot: Number.isInteger(record.lastSlot) && (record.lastSlot ?? 0) >= 1 && (record.lastSlot ?? 0) <= 4
      ? record.lastSlot : undefined,
    plays: Number.isInteger(record.plays) && (record.plays ?? 0) >= 0
      ? Math.min(record.plays!, 100_000) : 0,
  };
}

function shuffle<T>(items: readonly T[], rng: () => number): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(rng() * (index + 1));
    [result[index], result[swap]] = [result[swap], result[index]];
  }
  return result;
}

function signature<T extends { id: string }>(wrong: readonly T[]): string {
  return wrong.map(item => item.id).sort().join('~');
}

export class ChoiceVariety {
  private readonly entries: Record<string, ChoiceHistoryEntry> = {};
  private readonly storage: ChoiceStorage | null;
  private readonly storageKey: string;

  constructor(gameId: string, storage: ChoiceStorage | null = defaultChoiceStorage()) {
    this.storage = storage;
    this.storageKey = `${KEY_PREFIX}${gameId}`;
    try {
      const raw = storage?.getItem(this.storageKey);
      if (!raw || raw.length > MAX_STORAGE_LENGTH) return;
      const parsed: unknown = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return;
      for (const [id, value] of Object.entries(parsed).slice(-MAX_ENTRIES)) {
        if (!/^[\w:#-]{1,140}$/.test(id)) continue;
        const safe = safeRecord(value);
        if (safe) this.entries[id] = safe;
      }
    } catch { /* Private browsing or damaged saved history must never break gameplay. */ }
  }

  getPlays(questionId: string): number {
    return this.entries[`q:${questionId}`]?.plays ?? 0;
  }

  rememberQuestion(questionId: string): void {
    const key = `q:${questionId}`;
    const previous = this.entries[key];
    this.entries[key] = { recent: [], plays: Math.min(100_000, (previous?.plays ?? 0) + 1) };
    this.save();
  }

  /** Operates *after* difficulty/mode eligibility so history never overrides game rules. */
  leastPlayed<T extends { id: string }>(candidates: readonly T[]): T[] {
    if (candidates.length < 2) return [...candidates];
    const smallest = Math.min(...candidates.map(question => this.getPlays(question.id)));
    return candidates.filter(question => this.getPlays(question.id) === smallest);
  }

  /**
   * Domain factory returns exactly three factual, distinct WRONG options. It is
   * free to apply whatever actor/region/visual checks the game requires. This
   * shared layer cannot invent or reattribute anything.
   */
  chooseFour<T extends { id: string }>(params: {
    questionId: string;
    correct: T;
    generateWrong: () => readonly T[];
    rng: () => number;
    attempts?: number;
  }): T[] {
    const key = `c:${params.questionId}`;
    const prior = this.entries[key] ?? { recent: [] };
    let best: T[] | null = null;
    let bestSignature = '';
    let bestScore = -Infinity;
    const tries = Math.max(1, Math.min(params.attempts ?? 14, 40));

    for (let attempt = 0; attempt < tries; attempt += 1) {
      const wrong = [...params.generateWrong()];
      if (wrong.length !== 3 || new Set(wrong.map(c => c.id)).size !== 3 || wrong.some(c => c.id === params.correct.id)) {
        throw new Error(`${params.questionId}: expected three unique wrong answers, never the correct answer`);
      }
      const currentSignature = signature(wrong);
      const last = prior.recent[prior.recent.length - 1];
      // A fresh set matters more than swapping the 1–4 answer order.
      const score = (prior.recent.includes(currentSignature) ? -150 : 120)
        + (currentSignature === last ? -250 : 0)
        - Math.max(0, prior.recent.indexOf(currentSignature) + 1) * 2
        + params.rng() * 0.01;
      if (score > bestScore) {
        best = wrong;
        bestSignature = currentSignature;
        bestScore = score;
      }
      if (bestScore >= 120 && attempt >= 4) break;
    }
    if (!best) throw new Error(`${params.questionId}: no valid answer group`);

    const result = shuffle([params.correct, ...best], params.rng);
    const correctSlot = result.findIndex(item => item.id === params.correct.id) + 1;
    if (correctSlot === prior.lastSlot) {
      const alternatives = [0, 1, 2, 3].filter(index => index !== correctSlot - 1);
      const destination = alternatives[Math.floor(params.rng() * alternatives.length)];
      [result[correctSlot - 1], result[destination]] = [result[destination], result[correctSlot - 1]];
    }
    const finalSlot = result.findIndex(item => item.id === params.correct.id) + 1;
    this.entries[key] = {
      recent: [...prior.recent.filter(value => value !== bestSignature), bestSignature].slice(-MAX_RECENT),
      lastSlot: finalSlot,
    };
    this.save();
    return result;
  }

  private save(): void {
    try {
      const keys = Object.keys(this.entries);
      if (keys.length > MAX_ENTRIES) {
        for (const key of keys.slice(0, keys.length - MAX_ENTRIES)) delete this.entries[key];
      }
      this.storage?.setItem(this.storageKey, JSON.stringify(this.entries));
    } catch { /* Data stays in memory if saving is denied. */ }
  }
}
