/**
 * V52: reproducible cinematic variants for the user's local Egyptian posters.
 * A poster is still one question, never a duplicate new question in the bank.
 * Variant/initial regions are planned before choosing its answer options.
 */
import type { QuestionDifficulty } from '../../questions/question-types';
import { initialPuzzleRegions } from './poster-puzzle';

export type PosterRevealMode = 'blur' | 'zoom' | 'spotlight' | 'puzzle' | 'color';
export type PosterRevealPlan = {
  mode: PosterRevealMode;
  pattern: number;
  focus: { x: number; y: number };
  /** Index 0..8 into the poster's 3x3 colour-profile grid. */
  initialRegions: number[];
};
export type PosterPlayEntry = {
  plays: number;
  lastPlayedSeq: number;
  lastMode?: PosterRevealMode;
  lastPattern?: number;
  lastKind?: 'poster' | 'frame' | 'quote';
  lastClueId?: string;
  kindUses?: Partial<Record<'poster' | 'frame' | 'quote', number>>;
  modeUses?: Partial<Record<PosterRevealMode, number>>;
};

// Only puzzle is eligible. Keep historic mode names in the type so old saved
// localStorage entries deserialize safely, but never select them again.
export const POSTER_REVEAL_MODES: readonly PosterRevealMode[] = ['puzzle'];
const MODE_BY_DIFFICULTY: Record<QuestionDifficulty, readonly PosterRevealMode[]> = {
  easy: ['puzzle'], medium: ['puzzle'], hard: ['puzzle'],
};
export function availablePosterModes(difficulty: QuestionDifficulty): readonly PosterRevealMode[] {
  return MODE_BY_DIFFICULTY[difficulty];
}
export function posterRegionCenter(region: number): { x: number; y: number } {
  return { x: (region % 3 + .5) * (100 / 3), y: (Math.floor(region / 3) + .5) * (100 / 3) };
}
function makeRng(seed: number): () => number {
  let state = seed >>> 0;
  return () => ((state = (Math.imul(state, 1664525) + 1013904223) >>> 0) / 2 ** 32);
}
function shuffled<T>(source: readonly T[], seed: number): T[] {
  const result = [...source]; const rng = makeRng(seed);
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
export function puzzleOrder(pattern: number): number[] {
  // 3x3 distinct order; no stale tile locations from the last showing.
  return shuffled(Array.from({ length: 9 }, (_, n) => n), pattern + 7113);
}

export function planPosterReveal(
  difficulty: QuestionDifficulty,
  seed: number,
  prior: PosterPlayEntry | undefined,
  sourceFocus: { x: number; y: number },
  titleMasks: readonly { x: number; y: number; w: number; h: number }[] = [],
): PosterRevealPlan {
  const random = makeRng(seed);
  const allowed = availablePosterModes(difficulty);
  const uses = prior?.modeUses ?? {};
  const minUses = Math.min(...allowed.map(mode => uses[mode] ?? 0));
  const freshModes = allowed.filter(mode => (uses[mode] ?? 0) === minUses && mode !== prior?.lastMode);
  const choices = freshModes.length ? freshModes : allowed.filter(mode => (uses[mode] ?? 0) === minUses);
  const mode = choices[Math.floor(random() * choices.length)];
  // Pattern changes even when the same mode eventually returns.
  let pattern = Math.floor(random() * 1_000_000);
  if (pattern === prior?.lastPattern) pattern++;
  // Plan only the visible (non-title) areas for the choice engine too.
  // The actual 6x9 tile pattern changes on repeated plays.
  const initialRegions = initialPuzzleRegions(pattern, titleMasks, difficulty);
  const focus = sourceFocus;
  return { mode, pattern, focus, initialRegions };
}

/** Plans are public gameplay clues; NEVER include the actual title/answer. */
export function getSpotlightPoint(plan: PosterRevealPlan, progress: number): { x: number; y: number } {
  const curve = Math.max(0, Math.min(.999999, progress));
  const route = shuffled([0, 1, 2, 3, 4, 5, 6, 7, 8], plan.pattern + 193);
  const sections = 3;
  const phase = curve * sections;
  const from = phase < 1 ? plan.focus : posterRegionCenter(route[Math.floor(phase) % route.length]);
  const to = posterRegionCenter(route[(Math.floor(phase) + 1) % route.length]);
  const t = phase % 1;
  return { x: from.x + (to.x - from.x) * t, y: from.y + (to.y - from.y) * t };
}
