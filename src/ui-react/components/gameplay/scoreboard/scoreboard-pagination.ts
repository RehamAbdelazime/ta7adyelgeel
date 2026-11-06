export const SCOREBOARD_PAGE_SIZE = 16;

type ScoreboardParticipant = {
  twitchUserId: string;
};

/**
 * Stable identity for the displayed participant set.
 * Sorting makes rank changes irrelevant, while joins/leaves still trigger reset.
 */
export function getScoreboardParticipantSignature(
  rows: readonly ScoreboardParticipant[],
): string {
  return rows.map((row) => row.twitchUserId).sort().join('|');
}

export function getScoreboardPageCount(rowCount: number, pageSize = SCOREBOARD_PAGE_SIZE): number {
  const safeRowCount = Math.max(0, Math.trunc(rowCount));
  const safePageSize = Math.max(1, Math.trunc(pageSize));
  return Math.max(1, Math.ceil(safeRowCount / safePageSize));
}

export function clampScoreboardPage(page: number, pageCount: number): number {
  const safePageCount = Math.max(1, Math.trunc(pageCount));
  return Math.max(0, Math.min(Math.trunc(page), safePageCount - 1));
}

export function getScoreboardPageRows<T>(
  rows: readonly T[],
  page: number,
  pageSize = SCOREBOARD_PAGE_SIZE,
): T[] {
  const safePageSize = Math.max(1, Math.trunc(pageSize));
  const pageStart = clampScoreboardPage(page, getScoreboardPageCount(rows.length, safePageSize)) * safePageSize;
  return rows.slice(pageStart, pageStart + safePageSize);
}

/** Show the most recent round columns, preserving their actual round numbers.
 * Tours can contain up to ten rounds, while the desktop scoreboard has space
 * for only five round columns. Older rounds remain included in Total.
 */
export function getVisibleScoreboardRoundIndexes(
  totalRounds: number,
  currentRound: number,
  maxVisibleRounds = 5,
): number[] {
  const total = Math.max(1, Math.trunc(totalRounds || currentRound || 1));
  const current = Math.max(1, Math.min(total, Math.trunc(currentRound || total)));
  const visible = Math.max(1, Math.min(total, Math.trunc(maxVisibleRounds)));
  const start = Math.max(0, current - visible);
  return Array.from({ length: visible }, (_, index) => start + index);
}
