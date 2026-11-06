/**
 * V52: reproducible cinematic variants for the user's local Egyptian posters.
 * A poster is still one question, never a duplicate new question in the bank.
 * Variant/initial regions are planned before choosing its answer options.
 */
import type { QuestionDifficulty } from '../../questions/question-types';

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
  modeUses?: Partial<Record<PosterRevealMode, number>>;
};

export const POSTER_REVEAL_MODES: readonly PosterRevealMode[] = ['blur', 'zoom', 'spotlight', 'puzzle', 'color'];
const MODE_BY_DIFFICULTY: Record<QuestionDifficulty, readonly PosterRevealMode[]> = {
  easy: ['blur', 'zoom', 'color'],
  medium: ['blur', 'zoom', 'spotlight', 'puzzle', 'color'],
  hard: ['zoom', 'spotlight', 'puzzle', 'color'],
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
  const shuffledRegions = shuffled([0, 1, 2, 3, 4, 5, 6, 7, 8], pattern + 193);
  const avoidPrintedTitle = (region: number) => {
    const p = posterRegionCenter(region);
    return !titleMasks.some(mask => p.x >= mask.x - 6 && p.x <= mask.x + mask.w + 6 && p.y >= mask.y - 6 && p.y <= mask.y + mask.h + 6);
  };
  // Zoom in on a meaningful subject neighbourhood, without aligning exactly
  // on the printed title: no ugly rectangle or masking layer is necessary.
  const safeRegions = shuffledRegions.filter(avoidPrintedTitle);
  const regions = safeRegions.length ? safeRegions : shuffledRegions;
  const nearActor = [...regions].sort((a, b) => {
    const centerA = posterRegionCenter(a); const centerB = posterRegionCenter(b);
    const score = (p: { x: number; y: number }) => Math.hypot((p.x - sourceFocus.x) / 100, (p.y - sourceFocus.y) / 100);
    return score(centerA) - score(centerB);
  });
  // Some variation per poster, rather than always zooming the exact same face.
  const zoomRegion = nearActor[Math.floor(random() * Math.min(3, nearActor.length))];
  const mainRegion = mode === 'zoom' ? zoomRegion : regions[0];
  const focus = posterRegionCenter(mainRegion);
  const initialRegions = mode === 'puzzle'
    ? puzzleOrder(pattern).slice(0, 2)
    : mode === 'zoom'
      ? [zoomRegion]
      : mode === 'spotlight'
        ? [mainRegion, ...(regions.filter(r => r !== mainRegion).slice(0, 1))]
        : Array.from({ length: 9 }, (_, n) => n);
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
