/** V73: safe tile plan — never uncover tiles that overlap an authored film title.
 * Coordinates are percentages of the actual poster (not the stage). No OCR,
 * remote images, or dynamic image analysis is involved at runtime. */
import type { QuestionDifficulty } from '../../questions/question-types';
export type PosterTitleRegion = { x: number; y: number; w: number; h: number };
export const PUZZLE_COLUMNS = 6;
export const PUZZLE_ROWS = 9;
export const PUZZLE_TOTAL = PUZZLE_COLUMNS * PUZZLE_ROWS;
export function isTitleTile(index: number, regions: readonly PosterTitleRegion[]): boolean {
  // Missing masks must fail closed; do NOT ever expose an unreviewed poster.
  if (!regions.length) return true;
  const col = index % PUZZLE_COLUMNS;
  const row = Math.floor(index / PUZZLE_COLUMNS);
  const x0 = col * 100 / PUZZLE_COLUMNS;
  const y0 = row * 100 / PUZZLE_ROWS;
  const x1 = (col + 1) * 100 / PUZZLE_COLUMNS;
  const y1 = (row + 1) * 100 / PUZZLE_ROWS;
  return regions.some(b => x0 < b.x + b.w + 1.5 && x1 > b.x - 1.5 && y0 < b.y + b.h + 1.5 && y1 > b.y - 1.5);
}
export function tileRevealOrder(seed: number, regions: readonly PosterTitleRegion[]): number[] {
  let state = (seed + 7113) >>> 0;
  const random = () => ((state = (Math.imul(state, 1664525) + 1013904223) >>> 0) / 2 ** 32);
  const safe = Array.from({ length: PUZZLE_TOTAL }, (_, i) => i).filter(i => !isTitleTile(i, regions));
  for (let i = safe.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [safe[i], safe[j]] = [safe[j], safe[i]];
  }
  return safe;
}
export function visibleSafeTiles(progress: number, difficulty: QuestionDifficulty, safeCount: number): number {
  const initiallyVisible = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 6 : 3;
  return Math.min(safeCount, Math.min(initiallyVisible, safeCount) +
    Math.floor(Math.max(0, Math.min(1, progress)) * Math.max(0, safeCount - initiallyVisible)));
}
/** 3x3 regions initially revealed — the same visual sample the distractor engine sees. */
export function initialPuzzleRegions(pattern: number, regions: readonly PosterTitleRegion[], difficulty: QuestionDifficulty): number[] {
  const ordered = tileRevealOrder(pattern, regions);
  const first = ordered.slice(0, visibleSafeTiles(0, difficulty, ordered.length));
  return Array.from(new Set(first.map(i =>
    Math.floor(Math.floor(i / PUZZLE_COLUMNS) * 3 / PUZZLE_ROWS) * 3 +
    Math.floor((i % PUZZLE_COLUMNS) * 3 / PUZZLE_COLUMNS))));
}
