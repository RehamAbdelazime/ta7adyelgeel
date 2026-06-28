import type { CitizenRuntime } from '../../citizens/citizen-types';
import type { LocaleCode } from '../../localization/locale-types';
import type { QuestionCategory, QuestionDifficulty, QuestionBankStats } from '../../questions/question-types';
import type {
  BeforeOrAfterAnswer,
  BeforeOrAfterChoice,
  MiniGameAnswerRecord,
  MiniGameScoreAward,
  MiniGameSnapshot,
  MiniGameStatus,
  SubmitMiniGameAnswerResult,
} from '../minigame-types';
import beforeOrAfterBank from '../data/before-or-after-questions.json';

const PARTICIPATION_POINTS = 10;
const DIFFICULTY_PATTERN: QuestionDifficulty[] = ['easy', 'medium', 'hard'];

const DIFFICULTY_SCORE: Record<QuestionDifficulty, number> = {
  easy: 60,
  medium: 120,
  hard: 180,
};

type BeforeAfterSide = 'left' | 'right';

type RawBeforeOrAfterQuestion = {
  id: string;
  category: string;
  difficulty: QuestionDifficulty;
  promptKey: string;
  left: { id: string; label: string; year: number };
  right: { id: string; label: string; year: number };
  correctAnswer: BeforeAfterSide;
  answerLabel: string;
  notes?: string;
};

type BeforeOrAfterQuestionBankFile = {
  meta?: Record<string, unknown>;
  questions: RawBeforeOrAfterQuestion[];
};

const BEFORE_OR_AFTER_QUESTIONS = (beforeOrAfterBank as BeforeOrAfterQuestionBankFile).questions;

export class BeforeOrAfterMiniGameService {
  private question: RawBeforeOrAfterQuestion | null = null;
  private activeChoices: BeforeOrAfterChoice[] = [];
  private status: MiniGameStatus = 'idle';
  private roundNumber = 0;
  private readonly answers = new Map<string, MiniGameAnswerRecord>();
  private readonly tourUsedQuestionIds = new Set<string>();
  private readonly sessionUsedQuestionIds = new Set<string>();
  private correctOfficialCount = 0;
  private correctSpectatorCount = 0;
  private scored = false;
  private lastFirstRoundQuestionId: string | null = null;

  beginTour(): void {
    this.tourUsedQuestionIds.clear();
    this.clearActiveRound();
  }

  startRound(roundNumber: number): void {
    const preferredDifficulty = DIFFICULTY_PATTERN[(roundNumber - 1) % DIFFICULTY_PATTERN.length];
    this.roundNumber = roundNumber;
    this.question = this.selectQuestion(roundNumber, preferredDifficulty);
    this.activeChoices = this.buildChoices(this.question, roundNumber);
    this.status = 'intro';
    this.answers.clear();
    this.correctOfficialCount = 0;
    this.correctSpectatorCount = 0;
    this.scored = false;

    this.tourUsedQuestionIds.add(this.question.id);
    this.sessionUsedQuestionIds.add(this.question.id);
    if (roundNumber === 1) {
      this.lastFirstRoundQuestionId = this.question.id;
    }
  }

  setStatus(status: MiniGameStatus): void {
    if (!this.question && status !== 'idle') return;
    this.status = status;
  }

  submitAnswer(citizen: CitizenRuntime, answer: BeforeOrAfterAnswer): SubmitMiniGameAnswerResult {
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
      const isCorrect = this.getSideForAnswer(record.answer as BeforeOrAfterAnswer) === this.question.correctAnswer;
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
      const isCorrect = this.getSideForAnswer(record.answer as BeforeOrAfterAnswer) === this.question.correctAnswer;
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
    this.activeChoices = [];
    this.status = 'idle';
    this.roundNumber = 0;
    this.answers.clear();
    this.correctOfficialCount = 0;
    this.correctSpectatorCount = 0;
    this.scored = false;
  }

  clear(): void {
    this.clearActiveRound();
  }

  getSnapshot(locale: LocaleCode): MiniGameSnapshot {
    const officialAnswerCount = [...this.answers.values()].filter((answer) => answer.role === 'official').length;
    const spectatorAnswerCount = [...this.answers.values()].filter((answer) => answer.role === 'spectator').length;
    const shouldRevealAnswer = this.status === 'resolved' || this.status === 'scored' || this.status === 'leaderboard';

    return {
      id: 'before-after',
      status: this.status,
      roundNumber: this.roundNumber,
      title: locale === 'ar' ? 'إيه قبل إيه؟' : 'BEFORE OR AFTER',
      statement: locale === 'ar' ? 'إيه ظهر الأول؟' : 'Which one came first?',
      instruction: this.question ? this.buildInstruction(locale) : '',
      acceptsAnswers: this.status === 'answering',
      officialAnswerCount,
      spectatorAnswerCount,
      answerRecords: [...this.answers.values()],
      correctAnswer: shouldRevealAnswer && this.question ? this.getCorrectAnswer() : null,
      correctOfficialCount: this.correctOfficialCount,
      correctSpectatorCount: this.correctSpectatorCount,
      hasRound: Boolean(this.question),
      questionId: this.question?.id ?? null,
      questionCategory: this.question ? this.mapCategory(this.question.category) : null,
      questionDifficulty: this.question?.difficulty ?? null,
      questionBankStats: this.getStats(),
      beforeOrAfter: this.question
        ? {
            prompt: locale === 'ar' ? 'اختار اللي ظهر قبل' : 'Pick what came first',
            categoryLabel: this.formatCategoryLabel(this.question.category, locale),
            choices: this.activeChoices,
            correctLabel: shouldRevealAnswer ? this.question.answerLabel : null,
            correctOptionNumber: shouldRevealAnswer ? this.getCorrectOptionNumber() : null,
          }
        : null,
    };
  }

  getAnswerByOptionNumber(optionNumber: number): BeforeOrAfterAnswer | null {
    if (!this.question || optionNumber < 1 || optionNumber > this.activeChoices.length) return null;
    return `option-${optionNumber}` as BeforeOrAfterAnswer;
  }

  private selectQuestion(roundNumber: number, preferredDifficulty: QuestionDifficulty): RawBeforeOrAfterQuestion {
    const strictCandidates = BEFORE_OR_AFTER_QUESTIONS.filter((question) =>
      question.difficulty === preferredDifficulty &&
      !this.tourUsedQuestionIds.has(question.id) &&
      !(roundNumber === 1 && question.id === this.lastFirstRoundQuestionId)
    );
    const relaxedCandidates = BEFORE_OR_AFTER_QUESTIONS.filter((question) =>
      !this.tourUsedQuestionIds.has(question.id) &&
      !(roundNumber === 1 && question.id === this.lastFirstRoundQuestionId)
    );
    const candidates = strictCandidates.length > 0
      ? strictCandidates
      : relaxedCandidates.length > 0
        ? relaxedCandidates
        : BEFORE_OR_AFTER_QUESTIONS;

    return candidates[Math.floor(Math.random() * candidates.length)] ?? BEFORE_OR_AFTER_QUESTIONS[0];
  }

  private buildChoices(question: RawBeforeOrAfterQuestion, roundNumber: number): BeforeOrAfterChoice[] {
    const choices: Array<Omit<BeforeOrAfterChoice, 'optionNumber' | 'command'>> = [
      { label: question.left.label, value: 'left' },
      { label: question.right.label, value: 'right' },
    ];

    const shouldReverse = this.hash(`${question.id}:${roundNumber}`) % 2 === 0;
    const displayChoices = shouldReverse ? [...choices].reverse() : choices;

    return displayChoices.map((choice, index) => ({
      optionNumber: index + 1,
      command: `!${index + 1}`,
      label: choice.label,
      value: choice.value,
    }));
  }

  private getSideForAnswer(answer: BeforeOrAfterAnswer): BeforeAfterSide | null {
    const optionNumber = Number.parseInt(answer.replace('option-', ''), 10);
    return this.activeChoices[optionNumber - 1]?.value ?? null;
  }

  private getCorrectAnswer(): BeforeOrAfterAnswer {
    return `option-${this.getCorrectOptionNumber()}` as BeforeOrAfterAnswer;
  }

  private getCorrectOptionNumber(): number {
    return this.activeChoices.find((choice) => choice.value === this.question?.correctAnswer)?.optionNumber ?? 1;
  }

  private buildInstruction(locale: LocaleCode): string {
    return locale === 'ar'
      ? 'اكتب !1 أو !2 وقت فتح الإجابة. اختار الحاجة اللي ظهرت أو نزلت قبل التانية.'
      : 'Type !1 or !2 when answers open. Pick the one that came first.';
  }

  private getStats(): QuestionBankStats {
    return {
      totalQuestions: BEFORE_OR_AFTER_QUESTIONS.length,
      tourUsedQuestions: this.tourUsedQuestionIds.size,
      tourUsedSimilarityGroups: this.tourUsedQuestionIds.size,
      sessionUsedQuestions: this.sessionUsedQuestionIds.size,
      sessionUsedSimilarityGroups: this.sessionUsedQuestionIds.size,
    };
  }

  private mapCategory(category: string): QuestionCategory {
    if (category === 'games') return 'games';
    if (category === 'songs' || category === 'movies' || category === 'series' || category === 'programs' || category === 'culture') return 'internet';
    if (category === 'apps' || category === 'products' || category === 'trends') return 'internet';
    return 'history';
  }

  private formatCategoryLabel(category: string, locale: LocaleCode): string {
    const arLabels: Record<string, string> = {
      songs: 'أغاني',
      movies: 'أفلام',
      series: 'مسلسلات',
      apps: 'تطبيقات',
      games: 'ألعاب',
      programs: 'برامج',
      products: 'منتجات',
      trends: 'تريندات',
      culture: 'ثقافة',
    };
    const enLabels: Record<string, string> = {
      songs: 'Songs',
      movies: 'Movies',
      series: 'Series',
      apps: 'Apps',
      games: 'Games',
      programs: 'Programs',
      products: 'Products',
      trends: 'Trends',
      culture: 'Culture',
    };
    return locale === 'ar' ? arLabels[category] ?? category : enLabels[category] ?? category;
  }

  private hash(value: string): number {
    let hash = 0;
    for (let index = 0; index < value.length; index += 1) {
      hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
    }
    return hash;
  }
}
