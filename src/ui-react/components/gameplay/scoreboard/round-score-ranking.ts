/** One-round scoreboard: show THIS question's net points, never cumulative Tour score.
 * Equal scores are settled by the order of accepted answers, not by name. */
export function getRoundScoreboardRows<T extends {
  total: number;
  roundPoints: number[];
  displayName: string;
  twitchUserId: string;
  roundAnswerOrder?: number;
  firstAnswerOrder?: number;
  answerOrders?: number[];
}>(rows: T[], currentRound: number): T[] {
  const index = Math.max(0, Math.round(currentRound) - 1);
  const roundOrder = (row: T): number => {
    const order = row.answerOrders?.[index] ?? row.roundAnswerOrder;
    return order !== undefined && order > 0 ? order : Infinity;
  };
  const firstOrder = (row: T): number => {
    const orders = row.answerOrders?.filter(value => Number.isFinite(value) && value > 0) ?? [];
    return orders.length > 0 ? Math.min(...orders) : (row.firstAnswerOrder ?? Infinity);
  };
  return rows.map((row) => ({ ...row, total: row.roundPoints[index] ?? 0 }))
    .sort((a, b) => b.total - a.total
      || roundOrder(a) - roundOrder(b)
      || firstOrder(a) - firstOrder(b)
      || a.displayName.localeCompare(b.displayName)
      || a.twitchUserId.localeCompare(b.twitchUserId));
}
