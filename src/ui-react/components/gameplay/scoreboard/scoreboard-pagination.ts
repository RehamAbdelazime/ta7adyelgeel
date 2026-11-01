export const SCOREBOARD_PAGE_SIZE = 8;

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
