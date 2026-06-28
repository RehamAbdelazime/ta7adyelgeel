import type { CitizenRuntime } from '../../citizens/citizen-types';
import type { LocaleCode } from '../../localization/locale-types';
import { QuestionBankService } from '../../questions/question-bank-service';
import type {
  CoupleOrSiblingsAnswer,
  CoupleOrSiblingsChoice,
  MiniGameAnswerRecord,
  MiniGameScoreAward,
  MiniGameSnapshot,
  MiniGameStatus,
  SubmitMiniGameAnswerResult,
} from '../minigame-types';
import { COUPLE_OR_SIBLINGS_QUESTIONS, type PairGuessAnswerKind, type PairGuessQuestion } from './couple-or-siblings-content';

const PARTICIPATION_POINTS = 10;

const DIFFICULTY_SCORE: Record<PairGuessQuestion['difficulty'], number> = {
  easy: 70,
  medium: 120,
  hard: 180,
};

export class CoupleOrSiblingsMiniGameService {
  private readonly questionBank = new QuestionBankService<PairGuessQuestion>(COUPLE_OR_SIBLINGS_QUESTIONS);
  private question: PairGuessQuestion | null = null;
  private status: MiniGameStatus = 'idle';
  private roundNumber = 0;
  private readonly answers = new Map<string, MiniGameAnswerRecord>();
  private correctOfficialCount = 0;
  private correctSpectatorCount = 0;
  private scored = false;
  private choices: PairGuessAnswerKind[] = ['couple', 'siblings'];
  private choiceSeedCounter = 0;

  beginTour(): void {
    this.questionBank.beginTour();
    this.choiceSeedCounter += 1;
    this.clearActiveRound();
  }

  startRound(roundNumber: number): void {
    const selection = this.questionBank.selectForRound(roundNumber);
    this.roundNumber = roundNumber;
    this.question = selection.question;
    this.choiceSeedCounter += 1;
    this.choices = createChoiceOrder(selection.question.id, roundNumber, this.choiceSeedCounter);
    this.status = 'intro';
    this.answers.clear();
    this.correctOfficialCount = 0;
    this.correctSpectatorCount = 0;
    this.scored = false;
  }

  setStatus(status: MiniGameStatus): void {
    if (!this.question && status !== 'idle') return;
    this.status = status;
  }

  submitAnswer(citizen: CitizenRuntime, answer: CoupleOrSiblingsAnswer): SubmitMiniGameAnswerResult {
    if (!this.question) return { ok: false, reason: 'no_round' };
    if (this.status !== 'answering') return { ok: false, reason: 'closed' };
    if (this.answers.has(citizen.twitchUserId)) return { ok: false, reason: 'already_answered' };

    const record: MiniGameAnswerRecord = {
      twitchUserId: citizen.twitchUserId,
      displayName: citizen.displayName,
      role: citizen.role,
      answer,
      submittedAt: Date.now(),
    };

    this.answers.set(citizen.twitchUserId, record);
    return { ok: true, record };
  }

  resolveRound(): void {
    if (!this.question) return;
    this.correctOfficialCount = 0;
    this.correctSpectatorCount = 0;

    for (const [id, record] of this.answers.entries()) {
      const isCorrect = this.getAnswerKind(record.answer as CoupleOrSiblingsAnswer) === this.question.answer;
      const resolvedRecord = { ...record, isCorrect };
      this.answers.set(id, resolvedRecord);
      if (isCorrect && record.role === 'official') this.correctOfficialCount += 1;
      if (isCorrect && record.role === 'spectator') this.correctSpectatorCount += 1;
    }

    this.status = 'resolved';
  }

  createScoreAwards(): MiniGameScoreAward[] {
    if (!this.question || this.scored) return [];
    const awards: MiniGameScoreAward[] = [];

    for (const record of this.answers.values()) {
      const isCorrect = this.getAnswerKind(record.answer as CoupleOrSiblingsAnswer) === this.question.answer;
      awards.push({
        twitchUserId: record.twitchUserId,
        displayName: record.displayName,
        role: record.role,
        points: isCorrect ? DIFFICULTY_SCORE[this.question.difficulty] : PARTICIPATION_POINTS,
        isCorrect,
        difficulty: this.question.difficulty,
      });
    }

    this.scored = true;
    this.status = 'scored';
    return awards;
  }

  clearActiveRound(): void {
    this.question = null;
    this.status = 'idle';
    this.roundNumber = 0;
    this.answers.clear();
    this.correctOfficialCount = 0;
    this.correctSpectatorCount = 0;
    this.scored = false;
    this.choices = ['couple', 'siblings'];
  }

  clear(): void {
    this.clearActiveRound();
  }

  getSnapshot(locale: LocaleCode): MiniGameSnapshot {
    const officialAnswerCount = [...this.answers.values()].filter((answer) => answer.role === 'official').length;
    const spectatorAnswerCount = [...this.answers.values()].filter((answer) => answer.role === 'spectator').length;
    const shouldRevealAnswer = this.status === 'resolved' || this.status === 'scored' || this.status === 'leaderboard';
    const stats = this.questionBank.getStats();

    return {
      id: 'couple-or-siblings',
      status: this.status,
      roundNumber: this.roundNumber,
      title: locale === 'ar' ? 'مرتبطين ولا إخوات؟' : 'COUPLE OR SIBLINGS',
      statement: this.question ? this.question.statement[locale] : '',
      instruction: this.question ? this.buildInstruction(locale) : '',
      acceptsAnswers: this.status === 'answering',
      officialAnswerCount,
      spectatorAnswerCount,
      answerRecords: [...this.answers.values()],
      correctAnswer: shouldRevealAnswer && this.question ? `option-${this.getCorrectOptionNumber()}` as CoupleOrSiblingsAnswer : null,
      correctOfficialCount: this.correctOfficialCount,
      correctSpectatorCount: this.correctSpectatorCount,
      hasRound: Boolean(this.question),
      questionId: this.question?.id ?? null,
      questionCategory: this.question?.category ?? null,
      questionDifficulty: this.question?.difficulty ?? null,
      questionBankStats: stats,
      coupleOrSiblings: this.question
        ? {
            imageUrl: this.question.imageUrl,
            imageAlt: this.question.imageAlt[locale],
            choices: this.buildChoices(locale),
            correctAnswer: shouldRevealAnswer ? this.question.answer : null,
          }
        : null,
    };
  }

  getAnswerByOptionNumber(optionNumber: number): CoupleOrSiblingsAnswer | null {
    if (!this.question || optionNumber < 1 || optionNumber > this.choices.length) return null;
    return `option-${optionNumber}` as CoupleOrSiblingsAnswer;
  }

  private getAnswerKind(answer: CoupleOrSiblingsAnswer): PairGuessAnswerKind | null {
    const optionNumber = Number.parseInt(answer.replace('option-', ''), 10);
    return this.choices[optionNumber - 1] ?? null;
  }

  private getCorrectOptionNumber(): number {
    if (!this.question) return 1;
    return this.choices.findIndex((choice) => choice === this.question?.answer) + 1 || 1;
  }

  private buildChoices(locale: LocaleCode): CoupleOrSiblingsChoice[] {
    return this.choices.map((choice, index) => ({
      optionNumber: index + 1,
      command: `!${index + 1}`,
      label: getChoiceLabel(choice, locale),
      value: choice,
    }));
  }

  private buildInstruction(locale: LocaleCode): string {
    return locale === 'ar' ? 'اختار: مرتبطين ولا إخوات؟ !1 أو !2' : 'Choose: Couple or siblings? !1 or !2';
  }
}

function getChoiceLabel(choice: PairGuessAnswerKind, locale: LocaleCode): string {
  if (choice === 'couple') return locale === 'ar' ? 'مرتبطين' : 'Couple';
  return locale === 'ar' ? 'إخوات' : 'Siblings';
}

function createChoiceOrder(questionId: string, roundNumber: number, counter: number): PairGuessAnswerKind[] {
  let hash = 2166136261;
  const input = `${questionId}:${roundNumber}:${counter}:${Date.now()}`;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) % 2 === 0 ? ['couple', 'siblings'] : ['siblings', 'couple'];
}
