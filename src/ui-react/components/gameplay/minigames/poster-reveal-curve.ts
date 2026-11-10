/** Poster reveal clock: safe puzzle cells open by the last second, but title cells stay closed.
 * Legacy getPosterBlurPx is retained only for text-image quote compatibility. */
export type PosterDifficulty = 'easy' | 'medium' | 'hard' | null;

/** The puzzle reaches full *safe-cell* reveal for the final 1000ms. */
export function getPosterRevealProgress(durationMs: number, remainingMs: number, difficulty: PosterDifficulty): number {
  const duration = Math.max(1, durationMs);
  if (remainingMs <= 1000 || duration <= 1000) return 1;
  const linear = Math.max(0, Math.min(1, (duration - Math.max(0, remainingMs)) / (duration - 1000)));
  return Math.pow(linear, difficulty === 'easy' ? .78 : difficulty === 'hard' ? 1.3 : 1);
}

const LAST_SECOND_MS = 1_000;

export function getPosterBlurPx(
  durationMs: number,
  remainingMs: number,
  difficulty: PosterDifficulty,
): number {
  const duration = Math.max(0, Number.isFinite(durationMs) ? durationMs : 0);
  const remaining = Math.max(0, Number.isFinite(remainingMs) ? remainingMs : duration);
  if (duration <= LAST_SECOND_MS || remaining <= LAST_SECOND_MS) return 0;

  const blurStart = difficulty === 'easy' ? 16 : difficulty === 'hard' ? 30 : 23;
  // Easy clears early; hard protects the shapes/text considerably longer.
  const ease = difficulty === 'easy' ? 1.15 : difficulty === 'hard' ? 0.57 : 0.82;
  const progress = Math.max(0, Math.min(1, (duration - remaining) / (duration - LAST_SECOND_MS)));
  return Math.max(0, blurStart * Math.pow(1 - progress, ease));
}
