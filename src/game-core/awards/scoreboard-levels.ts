/** Shared, presentation-only score projection. Internal Tour scores stay untouched. */
import type { MiniGameId } from '../minigames/minigame-types';

export type MiniGameSegment = {
  gameId: MiniGameId;
  firstRound: number; // inclusive, 1-based
  lastRound: number;  // inclusive, 1-based
  questionNumber: number;
  questionCount: number;
};
export type Scope = { kind: 'question'; round: number } |
  { kind: 'mini-game'; firstRound: number; lastRound: number } |
  { kind: 'tour' };

export function segmentForRound(queue: readonly MiniGameId[], round: number): MiniGameSegment | null {
  if (!queue.length || round < 1 || round > queue.length) return null;
  const gameId = queue[round - 1]!;
  let firstRound = round;
  let lastRound = round;
  while (firstRound > 1 && queue[firstRound - 2] === gameId) firstRound--;
  while (lastRound < queue.length && queue[lastRound] === gameId) lastRound++;
  return { gameId, firstRound, lastRound,
    questionNumber: round - firstRound + 1, questionCount: lastRound - firstRound + 1 };
}

export function scopeScoreboardRows<T extends { roundPoints: number[]; total: number; displayName: string; answerOrders?: number[] }>(rows: readonly T[], scope: Scope): T[] {
  return rows.map(row => {
    const start = scope.kind === 'tour' ? 0 : scope.kind === 'question' ? scope.round - 1 : scope.firstRound - 1;
    const end = scope.kind === 'tour' ? row.roundPoints.length : scope.kind === 'question' ? scope.round : scope.lastRound;
    const roundPoints = row.roundPoints.slice(start, end);
    const answerOrders = (row.answerOrders ?? []).slice(start, end);
    return { ...row, roundPoints, answerOrders,
      total: roundPoints.reduce((sum, points) => sum + points, 0) };
  }).sort((a, b) => b.total - a.total
    || earliestAnswer(a) - earliestAnswer(b)
    || a.displayName.localeCompare(b.displayName));
}

export function earliestAnswer(row: { answerOrders?: number[] }): number {
  return Math.min(...(row.answerOrders ?? []).filter(n => Number.isFinite(n) && n > 0), Infinity);
}
