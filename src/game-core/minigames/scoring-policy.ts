import type { QuestionDifficulty } from '../questions/question-types';
import type { MiniGameScoreAward, MiniGameId } from './minigame-types';

export type ScoreOutcome = 'correct' | 'partial' | 'incorrect';

export type ScoreCalculation = {
  points: number;
  maxPoints: number;
  isCorrect: boolean;
  scoreOutcome: ScoreOutcome;
};

/**
 * Runtime leaderboard points live in one place. The values below intentionally
 * preserve the existing per-game balance; this refactor centralizes the rules
 * rather than silently rebalancing games.
 */
export const MINI_GAME_BASE_POINTS: Record<MiniGameId, Record<QuestionDifficulty, number>> = {
  'food-origin': { easy: 60, medium: 120, hard: 180 },
  'shape-count': { easy: 50, medium: 100, hard: 150 },
  'maze-gates': { easy: 90, medium: 140, hard: 200 },
  'guess-movie': { easy: 60, medium: 110, hard: 170 },
  'guess-star': { easy: 60, medium: 110, hard: 170 },
  'count-the-beat': { easy: 120, medium: 180, hard: 240 },
  'lucky-cup': { easy: 120, medium: 180, hard: 240 },
  'memory-count': { easy: 60, medium: 120, hard: 180 },
  'couple-or-siblings': { easy: 70, medium: 120, hard: 180 },
};

/** A close numeric estimate earns one quarter of the question's full points. */
export const NUMERIC_PARTIAL_CREDIT_RATIO = 0.25;

/** Numeric counting games allow a one-count miss for quarter credit. */
export const NUMERIC_ESTIMATE_RULES = {
  'count-the-beat': { partialTolerance: 1, partialCreditRatio: NUMERIC_PARTIAL_CREDIT_RATIO },
  'memory-count': { partialTolerance: 1, partialCreditRatio: NUMERIC_PARTIAL_CREDIT_RATIO },
} as const satisfies Partial<Record<MiniGameId, {
  partialTolerance: number;
  partialCreditRatio: number;
}>>;

export const FOOD_ORIGIN_HINT_SCORE_MULTIPLIER = 0.5;

export function getMiniGameBasePoints(gameId: MiniGameId, difficulty: QuestionDifficulty): number {
  return MINI_GAME_BASE_POINTS[gameId][difficulty];
}

/** Runtime display model for the two count/estimate games. */
export function getNumericEstimateScoringGuide(gameId: MiniGameId, difficulty: QuestionDifficulty) {
  const rule = getNumericEstimateRule(gameId);
  const exact = getMiniGameBasePoints(gameId, difficulty);

  return {
    exact,
    partial: rule ? getPartialCreditPoints(exact, rule.partialCreditRatio) : 0,
    partialTolerance: rule?.partialTolerance ?? 0,
    incorrect: 0,
  };
}

export function getNumericEstimateRule(gameId: MiniGameId) {
  return NUMERIC_ESTIMATE_RULES[gameId as keyof typeof NUMERIC_ESTIMATE_RULES] ?? null;
}

export function getPartialCreditPoints(maxPoints: number, ratio = NUMERIC_PARTIAL_CREDIT_RATIO): number {
  if (!Number.isFinite(maxPoints) || !Number.isFinite(ratio)) return 0;
  const safeRatio = Math.max(0, Math.min(1, ratio));
  return Math.max(0, Math.round(Math.max(0, maxPoints) * safeRatio));
}

/** Strict scoring for categorical / multiple-choice games. */
export function calculateExactAnswerScore(
  gameId: MiniGameId,
  difficulty: QuestionDifficulty,
  isCorrect: boolean,
  multiplier = 1,
): ScoreCalculation {
  const basePoints = getMiniGameBasePoints(gameId, difficulty);
  const safeMultiplier = Number.isFinite(multiplier) ? Math.max(0, multiplier) : 0;
  const maxPoints = Math.max(0, Math.round(basePoints * safeMultiplier));

  return {
    points: isCorrect ? maxPoints : 0,
    maxPoints,
    isCorrect,
    scoreOutcome: isCorrect ? 'correct' : 'incorrect',
  };
}

/**
 * Scoring for count/estimate games: exact = full points, one away = 25%,
 * anything farther away = zero. Values must be finite integers.
 */
export function calculateNumericEstimateScore(
  gameId: MiniGameId,
  difficulty: QuestionDifficulty,
  correctValue: number,
  submittedValue: number,
): ScoreCalculation {
  const maxPoints = getMiniGameBasePoints(gameId, difficulty);
  const rule = getNumericEstimateRule(gameId);
  const validNumbers = Number.isFinite(correctValue)
    && Number.isInteger(correctValue)
    && Number.isFinite(submittedValue)
    && Number.isInteger(submittedValue);

  if (!validNumbers || !rule) {
    return { points: 0, maxPoints, isCorrect: false, scoreOutcome: 'incorrect' };
  }

  const difference = Math.abs(correctValue - submittedValue);
  if (difference === 0) {
    return { points: maxPoints, maxPoints, isCorrect: true, scoreOutcome: 'correct' };
  }

  if (difference <= rule.partialTolerance) {
    return {
      points: getPartialCreditPoints(maxPoints, rule.partialCreditRatio),
      maxPoints,
      isCorrect: false,
      scoreOutcome: 'partial',
    };
  }

  return { points: 0, maxPoints, isCorrect: false, scoreOutcome: 'incorrect' };
}

export function getAwardScoreOutcome(award: MiniGameScoreAward): ScoreOutcome {
  if (award.isCorrect) return 'correct';
  if (award.scoreOutcome === 'partial' && award.points > 0) return 'partial';
  return 'incorrect';
}

/**
 * Shared safety boundary. A wrong answer cannot earn a positive score unless
 * the active game is one of the centrally-approved numeric estimate games;
 * partial rewards are capped at 25% of canonical base points. A negative award
 * survives only when it exactly matches the active Chaos event's configured
 * wrong-answer penalty.
 */
export function enforceMiniGameScoreAwardPolicy(
  awards: MiniGameScoreAward[],
  gameId: MiniGameId,
  options: { allowedWrongAnswerPenalty?: number | null } = {},
): MiniGameScoreAward[] {
  return awards.map((award) => {
    const points = Number.isFinite(award.points) ? Math.round(award.points) : 0;

    if (points < 0) {
      const isFullyIncorrect = !award.isCorrect && award.scoreOutcome !== 'partial';
      const configuredPenalty = options.allowedWrongAnswerPenalty;
      const isConfiguredPenalty = Number.isFinite(configuredPenalty)
        && Number(configuredPenalty) < 0
        && points === Math.round(Number(configuredPenalty));
      if (isFullyIncorrect && isConfiguredPenalty) {
        return { ...award, points, scoreOutcome: 'incorrect' };
      }

      return {
        ...award,
        points: 0,
        scoreOutcome: award.isCorrect ? 'correct' : 'incorrect',
      };
    }

    if (award.isCorrect) {
      return { ...award, points: Math.max(0, points), scoreOutcome: 'correct' };
    }

    const numericRule = getNumericEstimateRule(gameId);
    if (award.scoreOutcome === 'partial' && numericRule && Number.isFinite(award.maxPoints) && award.maxPoints! > 0) {
      // The active game ID and canonical base-points table are authoritative.
      // A service cannot opt a choice game into partial credit or inflate maxPoints.
      const canonicalMaxPoints = getMiniGameBasePoints(gameId, award.difficulty);
      const maxPartialPoints = getPartialCreditPoints(canonicalMaxPoints, numericRule.partialCreditRatio);
      const safePoints = Math.min(Math.max(0, points), maxPartialPoints);
      return {
        ...award,
        points: safePoints,
        maxPoints: canonicalMaxPoints,
        scoreOutcome: safePoints > 0 ? 'partial' : 'incorrect',
      };
    }

    return { ...award, points: 0, scoreOutcome: 'incorrect' };
  });
}
