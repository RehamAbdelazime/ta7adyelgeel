import type { GameQuestionBase, QuestionBankStats, QuestionCategory, QuestionDifficulty } from './question-types';

const MAX_RECENT_CATEGORIES = 4;
const MAX_RECENT_DIFFICULTIES = 4;

export class QuestionMemory<TQuestion extends GameQuestionBase<string>> {
  private readonly tourUsedQuestionIds = new Set<string>();
  private readonly tourUsedSimilarityGroups = new Set<string>();
  private readonly sessionUsedQuestionIds = new Set<string>();
  private readonly sessionUsedSimilarityGroups = new Set<string>();
  private recentCategories: QuestionCategory[] = [];
  private recentDifficulties: QuestionDifficulty[] = [];

  beginTour(): void {
    this.tourUsedQuestionIds.clear();
    this.tourUsedSimilarityGroups.clear();
    this.recentCategories = [];
    this.recentDifficulties = [];
  }

  record(question: TQuestion): void {
    this.tourUsedQuestionIds.add(question.id);
    this.tourUsedSimilarityGroups.add(question.similarityGroup);
    this.sessionUsedQuestionIds.add(question.id);
    this.sessionUsedSimilarityGroups.add(question.similarityGroup);
    this.recentCategories = [question.category, ...this.recentCategories].slice(0, MAX_RECENT_CATEGORIES);
    this.recentDifficulties = [question.difficulty, ...this.recentDifficulties].slice(0, MAX_RECENT_DIFFICULTIES);
  }

  isUsedInTour(question: TQuestion): boolean {
    return this.tourUsedQuestionIds.has(question.id) || this.tourUsedSimilarityGroups.has(question.similarityGroup);
  }

  isUsedInSession(question: TQuestion): boolean {
    return this.sessionUsedQuestionIds.has(question.id) || this.sessionUsedSimilarityGroups.has(question.similarityGroup);
  }

  getRecentCategories(): readonly QuestionCategory[] {
    return this.recentCategories;
  }

  getRecentDifficulties(): readonly QuestionDifficulty[] {
    return this.recentDifficulties;
  }

  createStats(totalQuestions: number): QuestionBankStats {
    return {
      totalQuestions,
      tourUsedQuestions: this.tourUsedQuestionIds.size,
      tourUsedSimilarityGroups: this.tourUsedSimilarityGroups.size,
      sessionUsedQuestions: this.sessionUsedQuestionIds.size,
      sessionUsedSimilarityGroups: this.sessionUsedSimilarityGroups.size,
    };
  }
}
