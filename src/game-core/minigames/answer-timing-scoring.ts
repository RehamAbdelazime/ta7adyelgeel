import type { MiniGameId, MiniGameScoreAward } from './minigame-types';
import { getMiniGameBasePoints, getPartialCreditPoints, NUMERIC_PARTIAL_CREDIT_RATIO } from './scoring-policy';

/** Before the exact half-way point = full credit; at/after half-way = 50%.
 * The policy is applied ONCE, after the service calculates correctness and
 * before Chaos and Golden bonuses. Food Origin's existing hint reduction is
 * re-based here, not multiplied a second time. */
export const LATE_ANSWER_MULTIPLIER = 0.5;

export function applyAnswerTimingScore(
  award: MiniGameScoreAward,
  gameId: MiniGameId,
  beforeHalfTime: boolean,
): MiniGameScoreAward {
  // Wrong answers, penalties and zero-credit awards must stay untouched.
  if (award.points <= 0) return award;

  const base = getMiniGameBasePoints(gameId, award.difficulty);
  const unmodifiedPoints = award.isCorrect
    ? base
    : award.scoreOutcome === 'partial'
      ? getPartialCreditPoints(base, NUMERIC_PARTIAL_CREDIT_RATIO)
      : award.points;
  const multiplier = beforeHalfTime ? 1 : LATE_ANSWER_MULTIPLIER;
  return {
    ...award,
    points: Math.round(unmodifiedPoints * multiplier),
    maxPoints: base,
    scoreMultiplier: multiplier,
  };
}
