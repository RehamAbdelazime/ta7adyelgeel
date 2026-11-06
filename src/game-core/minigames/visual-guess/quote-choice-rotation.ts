/**
 * V63: rotating, editorially constrained wrong-answer pools for movie quotes.
 * Never fabricate a TRUE line, actor, or movie attribution. We only select from
 * the author-provided wrong answers and vetted-as-decoys editorial additions.
 * Saved history contains clue IDs and normalized decoy sets, no viewer data.
 */
import editorialPools from './quote-choice-pools-v63.json';
import type { PosterHistoryStorage } from './poster-history';

type I18n = { ar: string; en: string };
export type QuoteChoiceMode = 'complete' | 'speaker';
export type QuoteChoiceContext = {
  clueId: string;
  movieId: string;
  mode: QuoteChoiceMode;
  role?: 'actor' | 'character';
  difficulty?: 'easy' | 'medium' | 'hard';
  correct: I18n;
  authoredWrong: readonly I18n[];
};

const HISTORY_KEY = 'ta7ady:quote-choice-rotation:v1';
const RECENT_GROUPS = 4;
const MAX_HISTORY_ENTRIES = 300;
export type ChoiceRotationRecord = { recent: string[]; lastCorrectSlot?: number };
export type QuoteChoiceHistory = Record<string, ChoiceRotationRecord>;

/** Arabic display-normalization used only to deduplicate, never to rewrite text. */
export function normalizeChoice(value: string): string {
  return value.normalize('NFKC').replace(/[\u064B-\u065F\u0670]/g, '')
    .replace(/[إأآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه')
    .replace(/[^\p{L}\p{N}]/gu, '').toLocaleLowerCase();
}
const labelKey = (choice: I18n): string => normalizeChoice(choice.ar);
const groupSignature = (choices: readonly I18n[]): string => choices.map(labelKey).sort().join('~');
function freshUnique(values: readonly I18n[], correct: I18n): I18n[] {
  const ar = new Set<string>([normalizeChoice(correct.ar)]);
  const en = new Set<string>([normalizeChoice(correct.en)]);
  const result: I18n[] = [];
  for (const value of values) {
    if (!value || typeof value.ar !== 'string' || typeof value.en !== 'string') continue;
    const a = normalizeChoice(value.ar);
    const e = normalizeChoice(value.en);
    if (!a || !e || ar.has(a) || en.has(e)) continue;
    ar.add(a); en.add(e); result.push(value);
  }
  return result;
}
function shuffle<T>(values: readonly T[], rng: () => number): T[] {
  const out = [...values];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
function editorialExtras(context: QuoteChoiceContext): I18n[] {
  if (context.mode === 'complete') {
    const entry = (editorialPools.completionByClue as Record<string, { expectedAnswer: string; extraWrong: string[] }>)[context.clueId];
    // Do not silently pair the edited quote with wrong endings from an old line.
    if (!entry || normalizeChoice(entry.expectedAnswer) !== normalizeChoice(context.correct.ar)) return [];
    return entry.extraWrong.map(ar => ({ ar, en: ar }));
  }
  if (context.role === 'character') {
    // These are editorially written fake nickname *options*, never character attributions.
    const names = (editorialPools.characterByFilm as Record<string, string[]>)[context.movieId] ?? [];
    return names.map(ar => ({ ar, en: ar }));
  }
  if (context.role !== 'actor') return [];
  const byAnswer = (editorialPools.actorByCorrect as Record<string, string[]>)[context.correct.ar];
  const byMovie = (editorialPools.actorByFilm as Record<string, string[]>)[context.movieId];
  return (byAnswer ?? byMovie ?? []).map(ar => ({ ar, en: ar }));
}

export function choiceHistoryKey(context: Pick<QuoteChoiceContext, 'clueId' | 'mode'>): string {
  return `${context.clueId}#${context.mode}`;
}
export function readQuoteChoiceHistory(storage: PosterHistoryStorage | null): QuoteChoiceHistory {
  try {
    const raw = storage?.getItem(HISTORY_KEY);
    if (!raw || raw.length > 120_000) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    const history: QuoteChoiceHistory = {};
    for (const [key, entry] of Object.entries(parsed).slice(-MAX_HISTORY_ENTRIES)) {
      if (!/^quote:[\w-]{1,110}#(complete|speaker)$/.test(key) || !entry || typeof entry !== 'object') continue;
      const record = entry as Partial<ChoiceRotationRecord>;
      const recent = Array.isArray(record.recent)
        ? record.recent.filter((value): value is string => typeof value === 'string' && value.length <= 400).slice(-RECENT_GROUPS)
        : [];
      const slot = Number.isInteger(record.lastCorrectSlot) && (record.lastCorrectSlot ?? 0) >= 1 && (record.lastCorrectSlot ?? 0) <= 4
        ? record.lastCorrectSlot : undefined;
      history[key] = { recent, lastCorrectSlot: slot };
    }
    return history;
  } catch { return {}; }
}
export function rememberQuoteChoice(
  history: QuoteChoiceHistory,
  storage: PosterHistoryStorage | null,
  key: string,
  wrong: readonly I18n[],
  correctSlot: number,
): void {
  const previous = history[key];
  const signature = groupSignature(wrong);
  history[key] = {
    recent: [...(previous?.recent ?? []).filter(x => x !== signature), signature].slice(-RECENT_GROUPS),
    lastCorrectSlot: correctSlot,
  };
  const keys = Object.keys(history);
  if (keys.length > MAX_HISTORY_ENTRIES) {
    // Keep the newest selections so the history stays bounded even with 1000+ quotes.
    for (const old of keys.slice(0, keys.length - MAX_HISTORY_ENTRIES)) delete history[old];
  }
  try { storage?.setItem(HISTORY_KEY, JSON.stringify(history)); } catch { /* private browsing / storage quota */ }
}

/**
 * Pick three wrong answers. Always keep at least one of the author's original
 * choices, so additional decoys remain relevant and don't become random noise.
 * Avoid the last four *sets*, not merely the order inside a fixed set.
 */
export function chooseQuoteWrongAnswers(
  context: QuoteChoiceContext,
  rng: () => number,
  recentGroups: readonly string[] = [],
): I18n[] {
  const original = freshUnique(context.authoredWrong, context.correct);
  if (original.length < 3) throw new Error(`${context.clueId}: at least 3 distinct curated wrong options required`);
  const extras = freshUnique(editorialExtras(context), context.correct)
    .filter(x => !original.some(y => labelKey(x) === labelKey(y) || normalizeChoice(x.en) === normalizeChoice(y.en)));
  if (!extras.length) return shuffle(original, rng).slice(0, 3);

  let best: I18n[] = [];
  let bestScore = -Infinity;
  for (let tryIndex = 0; tryIndex < 40; tryIndex++) {
    // 1–2 original decoys + 1–2 alternative decoys, weighted so at least
    // one option continues to reflect the game's existing editorial set.
    const originalPreference = context.difficulty === 'hard' ? .80
      : context.difficulty === 'medium' ? .57 : .33;
    const originalCount = rng() < originalPreference ? 2 : 1;
    const candidate = [
      ...shuffle(original, rng).slice(0, originalCount),
      ...shuffle(extras, rng).slice(0, 3 - originalCount),
    ];
    if (candidate.length !== 3) continue;
    const signature = groupSignature(candidate);
    const score = (recentGroups.includes(signature) ? -100 : 100)
      + rng() * 2
      + (recentGroups.length && signature === recentGroups[recentGroups.length - 1] ? -100 : 0);
    if (score > bestScore) { best = candidate; bestScore = score; }
    if (score > 100 && tryIndex > 5) break;
  }
  return shuffle(best.length === 3 ? best : original.slice(0, 3), rng);
}

/** Same actor/phrase should not always occupy the same number on repeat. */
export function shuffleQuoteAnswerPositions<T extends { value: string }>(
  values: readonly T[], rng: () => number, lastCorrectSlot?: number,
): T[] {
  const order = shuffle(values, rng);
  if (!lastCorrectSlot || order.findIndex(x => x.value === 'quote:correct') + 1 !== lastCorrectSlot) return order;
  // Keep all four slots fair and avoid teaching a stable correct number.
  const from = lastCorrectSlot - 1;
  const otherSlots = [0, 1, 2, 3].filter(x => x !== from);
  const to = otherSlots[Math.floor(rng() * otherSlots.length)];
  [order[from], order[to]] = [order[to], order[from]];
  return order;
}
