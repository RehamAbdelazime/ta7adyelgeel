import { QuestionMemory } from './question-memory';
import { randomIntExclusive, randomUnit } from './question-random';
import type {
  GameQuestionBase,
  QuestionDifficulty,
  QuestionSelectionResult,
} from './question-types';

export type QuestionSelectorOptions<TQuestion extends GameQuestionBase<string>> = {
  questions: readonly TQuestion[];
  memory: QuestionMemory<TQuestion>;
  roundNumber: number;
  preferredDifficulty?: QuestionDifficulty;
  excludedQuestionIds?: ReadonlySet<string>;
};

type DifficultyWeight = {
  difficulty: QuestionDifficulty;
  weight: number;
};

const DIFFICULTY_ORDER: QuestionDifficulty[] = ['easy', 'medium', 'hard'];

export class QuestionSelector<TQuestion extends GameQuestionBase<string>> {
  select(options: QuestionSelectorOptions<TQuestion>): QuestionSelectionResult<TQuestion> {
    const excludedQuestionIds = options.excludedQuestionIds ?? new Set<string>();
    const eligibleQuestions = options.questions.filter((question) => !excludedQuestionIds.has(question.id));
    const baseCandidates = eligibleQuestions.filter((question) => !options.memory.isUsedInTour(question));
    const strictCandidates = this.applyDifficultyAndCategoryPreference(
      baseCandidates.filter((question) => !options.memory.isUsedInSession(question)),
      options,
    );

    const strict = this.pickRandom(strictCandidates);
    if (strict) {
      return {
        question: strict,
        relaxation: 'none',
        candidateCount: strictCandidates.length,
        strictCandidateCount: strictCandidates.length,
      };
    }

    const sessionRelaxedCandidates = this.applyDifficultyAndCategoryPreference(baseCandidates, options);
    const sessionRelaxed = this.pickRandom(sessionRelaxedCandidates);
    if (sessionRelaxed) {
      return {
        question: sessionRelaxed,
        relaxation: 'session',
        candidateCount: sessionRelaxedCandidates.length,
        strictCandidateCount: 0,
      };
    }

    const categoryRelaxed = this.pickRandom(this.applyDifficultyPreference(baseCandidates, options));
    if (categoryRelaxed) {
      return {
        question: categoryRelaxed,
        relaxation: 'category',
        candidateCount: baseCandidates.length,
        strictCandidateCount: 0,
      };
    }

    const exhaustedFallback = this.pickRandom(eligibleQuestions.length > 0 ? [...eligibleQuestions] : [...options.questions]);
    if (!exhaustedFallback) {
      throw new Error('Question bank is empty.');
    }

    return {
      question: exhaustedFallback,
      relaxation: 'exhausted',
      candidateCount: options.questions.length,
      strictCandidateCount: 0,
    };
  }

  private applyDifficultyAndCategoryPreference(
    candidates: TQuestion[],
    options: QuestionSelectorOptions<TQuestion>,
  ): TQuestion[] {
    if (candidates.length <= 1) {
      return candidates;
    }

    const withDifficulty = this.applyDifficultyPreference(candidates, options);
    const recentCategories = options.memory.getRecentCategories();
    const latestCategory = recentCategories[0];
    const previousCategory = recentCategories[1];

    // Avoid the same category three times in a row, but never break the game if the bank is filtered down.
    if (latestCategory && previousCategory && latestCategory === previousCategory) {
      const categoryCandidates = withDifficulty.filter((question) => question.category !== latestCategory);
      if (categoryCandidates.length > 0) {
        return categoryCandidates;
      }
    }

    return withDifficulty;
  }

  private applyDifficultyPreference(candidates: TQuestion[], options: QuestionSelectorOptions<TQuestion>): TQuestion[] {
    if (candidates.length <= 1) {
      return candidates;
    }

    const recentDifficulties = options.memory.getRecentDifficulties();
    const latestDifficulty = recentDifficulties[0];
    const previousDifficulty = recentDifficulties[1];
    let available = candidates;

    // Avoid the same difficulty three times in a row when alternatives exist.
    if (latestDifficulty && previousDifficulty && latestDifficulty === previousDifficulty) {
      const difficultyRotationCandidates = available.filter((question) => question.difficulty !== latestDifficulty);
      if (difficultyRotationCandidates.length > 0) {
        available = difficultyRotationCandidates;
      }
    }

    const preferredDifficulty = options.preferredDifficulty ?? this.pickDifficultyForRound(options.roundNumber);
    const preferred = available.filter((question) => question.difficulty === preferredDifficulty);
    if (preferred.length > 0) {
      return preferred;
    }

    const fallbackOrder = this.getDifficultyFallbackOrder(preferredDifficulty);
    for (const fallbackDifficulty of fallbackOrder) {
      const fallback = available.filter((question) => question.difficulty === fallbackDifficulty);
      if (fallback.length > 0) {
        return fallback;
      }
    }

    return available;
  }

  private pickDifficultyForRound(roundNumber: number): QuestionDifficulty {
    return this.pickWeightedDifficulty(this.getDifficultyWeights(roundNumber));
  }

  private getDifficultyWeights(roundNumber: number): DifficultyWeight[] {
    if (roundNumber <= 1) {
      return [
        { difficulty: 'easy', weight: 70 },
        { difficulty: 'medium', weight: 25 },
        { difficulty: 'hard', weight: 5 },
      ];
    }

    if (roundNumber <= 3) {
      return [
        { difficulty: 'easy', weight: 35 },
        { difficulty: 'medium', weight: 50 },
        { difficulty: 'hard', weight: 15 },
      ];
    }

    return [
      { difficulty: 'easy', weight: 15 },
      { difficulty: 'medium', weight: 45 },
      { difficulty: 'hard', weight: 40 },
    ];
  }

  private pickWeightedDifficulty(weights: DifficultyWeight[]): QuestionDifficulty {
    const total = weights.reduce((sum, item) => sum + item.weight, 0);
    let roll = randomUnit() * total;

    for (const item of weights) {
      roll -= item.weight;
      if (roll <= 0) {
        return item.difficulty;
      }
    }

    return weights[weights.length - 1]?.difficulty ?? 'medium';
  }

  private getDifficultyFallbackOrder(preferredDifficulty: QuestionDifficulty): QuestionDifficulty[] {
    if (preferredDifficulty === 'easy') {
      return ['medium', 'hard'];
    }

    if (preferredDifficulty === 'hard') {
      return ['medium', 'easy'];
    }

    return DIFFICULTY_ORDER.filter((difficulty) => difficulty !== preferredDifficulty);
  }

  private pickRandom(candidates: TQuestion[]): TQuestion | null {
    if (candidates.length === 0) {
      return null;
    }

    return candidates[randomIntExclusive(candidates.length)];
  }
}
