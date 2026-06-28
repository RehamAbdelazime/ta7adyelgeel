import type { CitizenRuntime } from '../../citizens/citizen-types';
import type { LocaleCode } from '../../localization/locale-types';
import { QuestionBankService } from '../../questions/question-bank-service';
import type {
  CountryChoice,
  FoodOriginAnswer,
  MiniGameAnswerRecord,
  MiniGameScoreAward,
  MiniGameSnapshot,
  MiniGameStatus,
  SubmitMiniGameAnswerResult,
} from '../minigame-types';
import { FOOD_ORIGIN_QUESTIONS, type FoodOriginQuestion } from './food-origin-content';
import { buildDynamicFoodOriginChoices } from './food-origin-distractors';
import {
  buildTimedAnswerHintSnapshot,
  configureTimedAnswerHint,
  createInactiveTimedAnswerHintState,
  wasSubmittedAfterTimedAnswerHint,
  type TimedAnswerHintState,
} from '../hints/timed-answer-hint';

const PARTICIPATION_POINTS = 10;
const FOOD_ORIGIN_DIFFICULTY_PATTERN: Array<FoodOriginQuestion['difficulty']> = ['easy', 'easy', 'medium', 'medium', 'hard'];
const FOOD_ORIGIN_HINT_SCORE_MULTIPLIER = 0.5;

const DIFFICULTY_SCORE: Record<FoodOriginQuestion['difficulty'], number> = {
  easy: 60,
  medium: 120,
  hard: 180,
};

export class FoodOriginMiniGameService {
  private readonly questionBank = new QuestionBankService<FoodOriginQuestion>(FOOD_ORIGIN_QUESTIONS);
  private question: FoodOriginQuestion | null = null;
  private activeChoices: FoodOriginQuestion['choices'] = [];
  private status: MiniGameStatus = 'idle';
  private roundNumber = 0;
  private readonly answers = new Map<string, MiniGameAnswerRecord>();
  private correctOfficialCount = 0;
  private correctSpectatorCount = 0;
  private scored = false;
  private choiceGenerationCounter = 0;
  private hintState: TimedAnswerHintState = createInactiveTimedAnswerHintState(FOOD_ORIGIN_HINT_SCORE_MULTIPLIER);

  beginTour(): void {
    this.questionBank.beginTour();
    this.choiceGenerationCounter += 1;
    this.clearActiveRound();
  }

  startRound(roundNumber: number): void {
    const preferredDifficulty = FOOD_ORIGIN_DIFFICULTY_PATTERN[(roundNumber - 1) % FOOD_ORIGIN_DIFFICULTY_PATTERN.length];
    const selection = this.questionBank.selectForRound(roundNumber, preferredDifficulty);
    this.roundNumber = roundNumber;
    this.question = selection.question;
    this.choiceGenerationCounter += 1;
    this.activeChoices = buildDynamicFoodOriginChoices({
      question: selection.question,
      allQuestions: FOOD_ORIGIN_QUESTIONS,
      seed: createFoodOriginChoiceSeed(selection.question.id, roundNumber, this.choiceGenerationCounter),
      targetCount: 4,
    });
    this.status = 'intro';
    this.answers.clear();
    this.correctOfficialCount = 0;
    this.correctSpectatorCount = 0;
    this.scored = false;
    this.hintState = createInactiveTimedAnswerHintState(FOOD_ORIGIN_HINT_SCORE_MULTIPLIER);
  }

  setStatus(status: MiniGameStatus): void {
    if (!this.question && status !== 'idle') return;
    this.status = status;
  }

  configureAnswerWindow(params: { startedAt: number; durationMs: number }): void {
    if (!this.question) return;

    this.hintState = configureTimedAnswerHint({
      startedAt: params.startedAt,
      durationMs: params.durationMs,
      revealDelayRatio: 0.5,
      scoreMultiplierAfterReveal: FOOD_ORIGIN_HINT_SCORE_MULTIPLIER,
    });
  }

  submitAnswer(citizen: CitizenRuntime, answer: FoodOriginAnswer): SubmitMiniGameAnswerResult {
    if (!this.question) return { ok: false, reason: 'no_round' };
    if (this.status !== 'answering') return { ok: false, reason: 'closed' };
    if (this.answers.has(citizen.twitchUserId)) return { ok: false, reason: 'already_answered' };

    const submittedAt = Date.now();
    const usedHint = wasSubmittedAfterTimedAnswerHint(this.hintState, submittedAt);
    const record: MiniGameAnswerRecord = {
      twitchUserId: citizen.twitchUserId,
      displayName: citizen.displayName,
      role: citizen.role,
      answer,
      submittedAt,
      usedHint,
      scoreMultiplier: usedHint ? FOOD_ORIGIN_HINT_SCORE_MULTIPLIER : 1,
    };

    this.answers.set(citizen.twitchUserId, record);
    return { ok: true, record };
  }

  resolveRound(): void {
    if (!this.question) return;
    this.correctOfficialCount = 0;
    this.correctSpectatorCount = 0;

    for (const [id, record] of this.answers.entries()) {
      const isCorrect = this.getCountryCode(record.answer as FoodOriginAnswer) === this.question.answer;
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
      const isCorrect = this.getCountryCode(record.answer as FoodOriginAnswer) === this.question.answer;
      const scoreMultiplier = record.usedHint ? FOOD_ORIGIN_HINT_SCORE_MULTIPLIER : 1;
      awards.push({
        twitchUserId: record.twitchUserId,
        displayName: record.displayName,
        role: record.role,
        points: isCorrect ? Math.round(DIFFICULTY_SCORE[this.question.difficulty] * scoreMultiplier) : PARTICIPATION_POINTS,
        isCorrect,
        difficulty: this.question.difficulty,
        usedHint: record.usedHint ?? false,
        scoreMultiplier,
      });
    }

    this.scored = true;
    this.status = 'scored';
    return awards;
  }

  clearActiveRound(): void {
    this.question = null;
    this.activeChoices = [];
    this.status = 'idle';
    this.roundNumber = 0;
    this.answers.clear();
    this.correctOfficialCount = 0;
    this.correctSpectatorCount = 0;
    this.scored = false;
    this.hintState = createInactiveTimedAnswerHintState(FOOD_ORIGIN_HINT_SCORE_MULTIPLIER);
  }

  clear(): void {
    this.clearActiveRound();
  }

  getSnapshot(locale: LocaleCode): MiniGameSnapshot {
    const officialAnswerCount = [...this.answers.values()].filter((answer) => answer.role === 'official').length;
    const spectatorAnswerCount = [...this.answers.values()].filter((answer) => answer.role === 'spectator').length;
    const shouldRevealAnswer = this.status === 'resolved' || this.status === 'scored' || this.status === 'leaderboard';
    const stats = this.questionBank.getStats();

    const hint = this.question
      ? buildTimedAnswerHintSnapshot({
          state: this.hintState,
          label: locale === 'ar' ? 'مساعدة التوقيت' : 'TIMED HINT',
          hiddenValueLabel: locale === 'ar' ? 'اسم الطبق يظهر في منتصف الوقت' : 'Dish name unlocks halfway',
          revealedValueLabel: locale === 'ar' ? 'اسم الطبق' : 'Dish name',
          value: this.question.dishName[locale],
          forceRevealed: shouldRevealAnswer,
        })
      : null;

    return {
      id: 'food-origin',
      status: this.status,
      roundNumber: this.roundNumber,
      title: locale === 'ar' ? 'أصل الأكلة' : 'FOOD ORIGIN',
      statement: this.question ? this.question.statement[locale] : '',
      instruction: this.question ? this.buildInstruction(locale, this.buildChoices(locale)) : '',
      acceptsAnswers: this.status === 'answering',
      officialAnswerCount,
      spectatorAnswerCount,
      answerRecords: [...this.answers.values()],
      correctAnswer: shouldRevealAnswer && this.question ? `option-${this.getCorrectOptionNumber(locale)}` as FoodOriginAnswer : null,
      correctOfficialCount: this.correctOfficialCount,
      correctSpectatorCount: this.correctSpectatorCount,
      hasRound: Boolean(this.question),
      questionId: this.question?.id ?? null,
      questionCategory: this.question?.category ?? null,
      questionDifficulty: this.question?.difficulty ?? null,
      questionBankStats: stats,
      hint,
      foodOrigin: this.question
        ? {
            dishName: this.question.dishName[locale],
            dishImageLabel: this.question.imageLabel,
            dishImageUrl: this.getDisplayImageUrl(this.question),
            choices: this.buildChoices(locale),
            correctCountry: shouldRevealAnswer ? this.activeChoices.find((choice) => choice.countryCode === this.question?.answer)?.label[locale] ?? null : null,
            correctCountryCode: shouldRevealAnswer ? this.question.answer : null,
          }
        : null,
    };
  }

  getAnswerByOptionNumber(optionNumber: number): FoodOriginAnswer | null {
    if (!this.question || optionNumber < 1 || optionNumber > this.activeChoices.length) return null;
    return `option-${optionNumber}` as FoodOriginAnswer;
  }



  private getDisplayImageUrl(question: FoodOriginQuestion): string {
    if (question.imageUrl && !question.imageUrl.includes('source.unsplash.com')) {
      return question.imageUrl;
    }

    const dishQuery = encodeURIComponent(question.dishName.en.toLowerCase().replace(/[^a-z0-9]+/g, ','));
    const lock = Array.from(question.similarityGroup).reduce((total, char) => total + char.charCodeAt(0), 0) % 9999;
    return `https://loremflickr.com/960/720/${dishQuery},food,dish/all?lock=${lock}`;
  }

  private getCountryCode(answer: FoodOriginAnswer): string | null {
    if (!this.question) return null;
    const optionNumber = Number.parseInt(answer.replace('option-', ''), 10);
    return this.activeChoices[optionNumber - 1]?.countryCode ?? null;
  }

  private getCorrectOptionNumber(_locale: LocaleCode): number {
    if (!this.question) return 1;
    return this.activeChoices.findIndex((choice) => choice.countryCode === this.question?.answer) + 1 || 1;
  }

  private buildChoices(locale: LocaleCode): CountryChoice[] {
    if (!this.question) return [];
    return this.activeChoices.map((choice, index) => ({
      optionNumber: index + 1,
      command: `!${index + 1}`,
      label: choice.label[locale],
      countryCode: choice.countryCode,
    }));
  }

  private buildInstruction(locale: LocaleCode, choices: CountryChoice[]): string {
    const commands = choices.map((choice) => `${choice.command} ${choice.label}`).join(' / ');
    return locale === 'ar' ? `اختار بلد الأصل: ${commands}` : `Pick the origin country: ${commands}`;
  }
}


function createFoodOriginChoiceSeed(questionId: string, roundNumber: number, counter: number): number {
  let hash = 2166136261;
  const input = `${questionId}:${roundNumber}:${counter}:${Date.now()}`;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}


function createSafeFoodOriginImageName(similarityGroup: string): string {
  return similarityGroup.replace(/[^a-zA-Z0-9_-]+/g, '_').replace(/^_+|_+$/g, '') || 'food_origin';
}
