import type { CitizenRuntime } from '../../citizens/citizen-types';
import type { LocaleCode } from '../../localization/locale-types';
import { QuestionBankService } from '../../questions/question-bank-service';
import type {
  MiniGameAnswerRecord,
  MiniGameScoreAward,
  MiniGameSnapshot,
  MiniGameStatus,
  SubmitMiniGameAnswerResult,
  TrueFakeAnswer,
} from '../minigame-types';
import { TRUE_FAKE_QUESTIONS, type TrueFakeQuestion } from './true-fake-content';

const PARTICIPATION_POINTS = 10;

const DIFFICULTY_SCORE: Record<TrueFakeQuestion['difficulty'], number> = {
  easy: 50,
  medium: 100,
  hard: 150,
};

export class TrueFakeMiniGameService {
  private readonly questionBank = new QuestionBankService<TrueFakeQuestion>(TRUE_FAKE_QUESTIONS);
  private question: TrueFakeQuestion | null = null;
  private status: MiniGameStatus = 'idle';
  private roundNumber = 0;
  private readonly answers = new Map<string, MiniGameAnswerRecord>();
  private correctOfficialCount = 0;
  private correctSpectatorCount = 0;
  private scored = false;

  beginTour(): void {
    this.questionBank.beginTour();
    this.clearActiveRound();
  }

  startRound(roundNumber: number): void {
    const selection = this.questionBank.selectForRound(roundNumber);

    this.roundNumber = roundNumber;
    this.question = selection.question;
    this.status = 'intro';
    this.answers.clear();
    this.correctOfficialCount = 0;
    this.correctSpectatorCount = 0;
    this.scored = false;

    if (selection.relaxation !== 'none') {
      console.warn('[TrueFakeMiniGame] Question selector used relaxed fallback:', {
        relaxation: selection.relaxation,
        questionId: selection.question.id,
        similarityGroup: selection.question.similarityGroup,
        candidateCount: selection.candidateCount,
      });
    }
  }

  setStatus(status: MiniGameStatus): void {
    if (!this.question && status !== 'idle') {
      return;
    }

    this.status = status;
  }

  submitAnswer(citizen: CitizenRuntime, answer: TrueFakeAnswer): SubmitMiniGameAnswerResult {
    if (!this.question) {
      return { ok: false, reason: 'no_round' };
    }

    if (this.status !== 'answering') {
      return { ok: false, reason: 'closed' };
    }

    if (this.answers.has(citizen.twitchUserId)) {
      return { ok: false, reason: 'already_answered' };
    }

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
    if (!this.question) {
      return;
    }

    this.correctOfficialCount = 0;
    this.correctSpectatorCount = 0;

    for (const [id, record] of this.answers.entries()) {
      const isCorrect = record.answer === this.question.answer;
      const resolvedRecord = { ...record, isCorrect };
      this.answers.set(id, resolvedRecord);

      if (!isCorrect) {
        continue;
      }

      if (record.role === 'official') {
        this.correctOfficialCount += 1;
      } else {
        this.correctSpectatorCount += 1;
      }
    }

    this.status = 'resolved';
  }

  createScoreAwards(): MiniGameScoreAward[] {
    if (!this.question || this.scored) {
      return [];
    }

    const awards: MiniGameScoreAward[] = [];

    for (const record of this.answers.values()) {
      const isCorrect = record.answer === this.question.answer;
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
  }

  clear(): void {
    this.clearActiveRound();
  }

  getSnapshot(locale: LocaleCode): MiniGameSnapshot {
    const officialAnswerCount = [...this.answers.values()].filter((answer) => answer.role === 'official').length;
    const spectatorAnswerCount = [...this.answers.values()].filter((answer) => answer.role === 'spectator').length;
    const stats = this.questionBank.getStats();

    return {
      id: 'true-fake',
      status: this.status,
      roundNumber: this.roundNumber,
      title: locale === 'ar' ? 'حقيقة ولا مزيفة؟' : 'TRUE OR FAKE?',
      statement: this.question ? this.question.statement[locale] : '',
      instruction: locale === 'ar' ? 'اكتب !1 للصح أو !2 للغلط وقت فتح نافذة الإجابة' : 'Type !1 for TRUE or !2 for FAKE when the answer window opens',
      acceptsAnswers: this.status === 'answering',
      officialAnswerCount,
      spectatorAnswerCount,
      answerRecords: [...this.answers.values()],
      correctAnswer: this.status === 'resolved' || this.status === 'scored' || this.status === 'leaderboard' ? this.question?.answer ?? null : null,
      correctOfficialCount: this.correctOfficialCount,
      correctSpectatorCount: this.correctSpectatorCount,
      hasRound: Boolean(this.question),
      questionId: this.question?.id ?? null,
      questionCategory: this.question?.category ?? null,
      questionDifficulty: this.question?.difficulty ?? null,
      questionBankStats: stats,
    };
  }
}
