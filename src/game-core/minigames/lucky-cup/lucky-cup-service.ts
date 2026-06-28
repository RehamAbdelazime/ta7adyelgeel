import type { CitizenRuntime } from '../../citizens/citizen-types';
import type { LocaleCode } from '../../localization/locale-types';
import type { QuestionDifficulty } from '../../questions/question-types';
import type {
  LuckyCupAnswer,
  MiniGameAnswerRecord,
  MiniGameScoreAward,
  MiniGameSnapshot,
  MiniGameStatus,
  SubmitMiniGameAnswerResult,
} from '../minigame-types';

type LuckyCupSwap = {
  id: string;
  a: number;
  b: number;
  delayMs: number;
  durationMs: number;
};

type LuckyCupRound = {
  id: string;
  difficulty: QuestionDifficulty;
  initialBallCupId: number;
  finalBallCupId: number;
  correctCupNumber: number;
  swaps: LuckyCupSwap[];
  revealMs: number;
};

const DIFFICULTY_ORDER: QuestionDifficulty[] = ['easy', 'medium', 'hard'];

const DIFFICULTY_CONFIG: Record<QuestionDifficulty, {
  swapCount: number;
  swapDurationMs: number;
  revealMs: number;
  score: number;
}> = {
  easy: { swapCount: 5, swapDurationMs: 620, revealMs: 2300, score: 120 },
  medium: { swapCount: 8, swapDurationMs: 490, revealMs: 2050, score: 180 },
  hard: { swapCount: 12, swapDurationMs: 370, revealMs: 1750, score: 240 },
};

const CUP_IDS = [0, 1, 2] as const;
const PARTICIPATION_POINTS = 0;

function createSeededRandom(seed: number): () => number {
  let value = Math.max(1, seed >>> 0);

  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function getDifficulty(roundNumber: number): QuestionDifficulty {
  return DIFFICULTY_ORDER[(roundNumber - 1) % DIFFICULTY_ORDER.length] ?? 'hard';
}

function scoreAnswer(difficulty: QuestionDifficulty, correctCupNumber: number, submittedAnswer: number): number {
  return submittedAnswer === correctCupNumber ? DIFFICULTY_CONFIG[difficulty].score : PARTICIPATION_POINTS;
}

export class LuckyCupMiniGameService {
  private status: MiniGameStatus = 'idle';
  private round: LuckyCupRound | null = null;
  private roundNumber = 0;
  private readonly answers = new Map<string, MiniGameAnswerRecord>();
  private correctOfficialCount = 0;
  private correctSpectatorCount = 0;
  private scored = false;

  beginTour(): void {
    this.clearActiveRound();
  }

  startRound(roundNumber: number, seed = Date.now()): void {
    this.roundNumber = roundNumber;
    this.round = this.generateRound(roundNumber, seed);
    this.status = 'intro';
    this.answers.clear();
    this.correctOfficialCount = 0;
    this.correctSpectatorCount = 0;
    this.scored = false;
  }

  setStatus(status: MiniGameStatus): void {
    if (!this.round && status !== 'idle') {
      return;
    }

    this.status = status;
  }

  submitAnswer(citizen: CitizenRuntime, answer: LuckyCupAnswer): SubmitMiniGameAnswerResult {
    if (!this.round) return { ok: false, reason: 'no_round' };
    if (this.status !== 'answering') return { ok: false, reason: 'closed' };
    if (this.answers.has(citizen.twitchUserId)) return { ok: false, reason: 'already_answered' };

    const numericAnswer = Number(answer);
    if (!Number.isInteger(numericAnswer) || numericAnswer < 1 || numericAnswer > 3) {
      return { ok: false, reason: 'closed' };
    }

    const record: MiniGameAnswerRecord = {
      twitchUserId: citizen.twitchUserId,
      displayName: citizen.displayName,
      role: citizen.role,
      answer: numericAnswer,
      submittedAt: Date.now(),
    };

    this.answers.set(citizen.twitchUserId, record);
    return { ok: true, record };
  }

  resolveRound(): void {
    if (!this.round) return;

    this.correctOfficialCount = 0;
    this.correctSpectatorCount = 0;

    for (const [id, record] of this.answers.entries()) {
      const numericAnswer = Number(record.answer);
      const isCorrect = Number.isFinite(numericAnswer) && numericAnswer === this.round.correctCupNumber;
      const resolvedRecord: MiniGameAnswerRecord = { ...record, isCorrect };

      this.answers.set(id, resolvedRecord);

      if (isCorrect && record.role === 'official') this.correctOfficialCount += 1;
      if (isCorrect && record.role === 'spectator') this.correctSpectatorCount += 1;
    }

    this.status = 'resolved';
  }

  createScoreAwards(): MiniGameScoreAward[] {
    if (!this.round || this.scored) return [];

    const awards = [...this.answers.values()].map((record): MiniGameScoreAward => {
      const numericAnswer = Number(record.answer);
      const points = Number.isFinite(numericAnswer)
        ? scoreAnswer(this.round!.difficulty, this.round!.correctCupNumber, numericAnswer)
        : PARTICIPATION_POINTS;

      return {
        twitchUserId: record.twitchUserId,
        displayName: record.displayName,
        role: record.role,
        points,
        isCorrect: points > PARTICIPATION_POINTS,
        difficulty: this.round!.difficulty,
      };
    });

    this.scored = true;
    this.status = 'scored';
    return awards;
  }

  clearActiveRound(): void {
    this.status = 'idle';
    this.round = null;
    this.roundNumber = 0;
    this.answers.clear();
    this.correctOfficialCount = 0;
    this.correctSpectatorCount = 0;
    this.scored = false;
  }

  clear(): void {
    this.clearActiveRound();
  }

  getAnswerByOptionNumber(optionNumber: number): LuckyCupAnswer | null {
    return optionNumber >= 1 && optionNumber <= 3 ? optionNumber : null;
  }

  getSnapshot(locale: LocaleCode): MiniGameSnapshot {
    const answerRecords = [...this.answers.values()];
    const shouldRevealAnswer = this.status === 'resolved' || this.status === 'scored' || this.status === 'leaderboard';

    return {
      id: 'lucky-cup',
      status: this.status,
      roundNumber: this.roundNumber,
      title: locale === 'ar' ? 'كوباية وشقاوة' : 'KOBAYA W SHAKAWA',
      statement: locale === 'ar' ? 'فين الكورة؟' : 'Where is the ball?',
      instruction: locale === 'ar' ? 'تابع الكوباية واكتب !1 أو !2 أو !3' : 'Follow the cup and type !1, !2, or !3',
      acceptsAnswers: this.status === 'answering',
      officialAnswerCount: answerRecords.filter((answer) => answer.role === 'official').length,
      spectatorAnswerCount: answerRecords.filter((answer) => answer.role === 'spectator').length,
      answerRecords,
      correctAnswer: shouldRevealAnswer && this.round ? this.round.correctCupNumber : null,
      correctOfficialCount: this.correctOfficialCount,
      correctSpectatorCount: this.correctSpectatorCount,
      hasRound: Boolean(this.round),
      questionId: this.round?.id ?? null,
      questionCategory: null,
      questionDifficulty: this.round?.difficulty ?? null,
      questionBankStats: {
        totalQuestions: 9999,
        tourUsedQuestions: this.roundNumber,
        tourUsedSimilarityGroups: this.roundNumber,
        sessionUsedQuestions: this.roundNumber,
        sessionUsedSimilarityGroups: this.roundNumber,
      },
      luckyCup: this.round
        ? {
            initialBallCupId: this.round.initialBallCupId,
            finalBallCupId: this.round.finalBallCupId,
            correctCupNumber: shouldRevealAnswer ? this.round.correctCupNumber : null,
            cups: CUP_IDS.map((cupId) => ({ cupId, label: String(cupId + 1) })),
            swaps: this.round.swaps,
            revealMs: this.round.revealMs,
          }
        : null,
    };
  }

  private generateRound(roundNumber: number, seed: number): LuckyCupRound {
    const random = createSeededRandom(seed + roundNumber * 733);
    const difficulty = getDifficulty(roundNumber);
    const config = DIFFICULTY_CONFIG[difficulty];

    const initialBallCupId = Math.floor(random() * CUP_IDS.length);
    const swaps: LuckyCupSwap[] = [];
    const cupsBySlot = [...CUP_IDS];

    for (let index = 0; index < config.swapCount; index += 1) {
      let a = Math.floor(random() * CUP_IDS.length);
      let b = Math.floor(random() * CUP_IDS.length);

      while (b === a) {
        b = Math.floor(random() * CUP_IDS.length);
      }

      swaps.push({
        id: `swap-${index}`,
        a,
        b,
        delayMs: index * (config.swapDurationMs + 120),
        durationMs: config.swapDurationMs,
      });

      [cupsBySlot[a], cupsBySlot[b]] = [cupsBySlot[b], cupsBySlot[a]];
    }

    const finalBallSlot = cupsBySlot.indexOf(initialBallCupId as (typeof CUP_IDS)[number]);
    const correctCupNumber = finalBallSlot + 1;

    return {
      id: `lucky-cup-${roundNumber}-${initialBallCupId}-${correctCupNumber}`,
      difficulty,
      initialBallCupId,
      finalBallCupId: initialBallCupId,
      correctCupNumber,
      swaps,
      revealMs: config.revealMs,
    };
  }
}

export { LuckyCupMiniGameService as LuckyCupMiniGame };
