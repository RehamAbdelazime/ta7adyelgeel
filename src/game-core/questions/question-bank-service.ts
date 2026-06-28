import { QuestionMemory } from './question-memory';
import { QuestionSelector } from './question-selector';
import type { GameQuestionBase, QuestionBankStats, QuestionDifficulty, QuestionSelectionResult } from './question-types';

export class QuestionBankService<TQuestion extends GameQuestionBase<string>> {
  private readonly memory = new QuestionMemory<TQuestion>();
  private readonly selector = new QuestionSelector<TQuestion>();
  private lastFirstRoundQuestionId: string | null = null;

  constructor(private readonly questions: readonly TQuestion[]) {
    if (questions.length === 0) {
      throw new Error('QuestionBankService requires at least one question.');
    }
  }

  beginTour(): void {
    this.memory.beginTour();
  }

  selectForRound(roundNumber: number, preferredDifficulty?: QuestionDifficulty): QuestionSelectionResult<TQuestion> {
    let result = this.selector.select({
      questions: this.questions,
      memory: this.memory,
      roundNumber,
      preferredDifficulty,
    });

    // First impressions matter on stream: avoid opening a fresh run with the exact same
    // first question when the bank has alternatives. This is intentionally per mini-game
    // service instance, so repeated lobby tests feel fresh without weakening no-repeat rules.
    if (roundNumber === 1 && this.lastFirstRoundQuestionId === result.question.id && this.questions.length > 1) {
      const reroll = this.selector.select({
        questions: this.questions,
        memory: this.memory,
        roundNumber,
        preferredDifficulty,
        excludedQuestionIds: new Set([this.lastFirstRoundQuestionId]),
      });

      if (reroll.question.id !== result.question.id) {
        result = reroll;
      }
    }

    this.memory.record(result.question);
    if (roundNumber === 1) {
      this.lastFirstRoundQuestionId = result.question.id;
    }

    return result;
  }

  getStats(): QuestionBankStats {
    return this.memory.createStats(this.questions.length);
  }
}
