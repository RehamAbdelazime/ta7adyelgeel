import type { CitizenRuntime } from '../../citizens/citizen-types';
import { calculateExactAnswerScore } from '../scoring-policy';
import { LUCKY_CUP_SHUFFLE_START_MS, LUCKY_CUP_SETTLE_MS } from './lucky-cup-motion';
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

/**
 * Lucky Cup V30: the hard round has an intentionally brutal five-swap finale.
 * The duration/gap helpers are the single source of truth for both the plan
 * and the tour phase timer; the ball always stays under one tracked cup.
 */
type LuckyCupTempo = {
  swapCount: number;
  firstSwapMs: number;
  lastSwapMs: number;
  interSwapGapMs: number;
  /** Optional per-swap speed override for the very last exchanges. */
  finaleDurationsMs?: readonly number[];
  /** Gap entering and during the finale; the earlier swaps use the regular gap. */
  finaleGapMs?: number;
  revealMs: number;
};

const DIFFICULTY_CONFIG: Record<QuestionDifficulty, LuckyCupTempo> = {
  easy:   { swapCount: 5,  firstSwapMs: 630, lastSwapMs: 600, interSwapGapMs: 120, revealMs: 2300 },
  medium: { swapCount: 10, firstSwapMs: 480, lastSwapMs: 360, interSwapGapMs: 95,  revealMs: 2050 },
  hard:   {
    swapCount: 18, firstSwapMs: 300, lastSwapMs: 220,
    interSwapGapMs: 55,
    // Last five switches happen back-to-back in ~0.7s — intentionally extreme.
    finaleDurationsMs: [175, 145, 120, 100, 85], finaleGapMs: 12,
    revealMs: 1750,
  },
};

const CUP_IDS = [0, 1, 2] as const;
const SLOT_PAIRS = [[0, 1], [0, 2], [1, 2]] as const;

function getFinaleStartIndex(config: LuckyCupTempo): number {
  return config.swapCount - (config.finaleDurationsMs?.length ?? 0);
}

function getSwapDurationMs(config: LuckyCupTempo, index: number): number {
  const finaleStart = getFinaleStartIndex(config);
  if (config.finaleDurationsMs && index >= finaleStart) {
    return config.finaleDurationsMs[index - finaleStart];
  }
  const progress = finaleStart > 1 ? index / (finaleStart - 1) : 0;
  return Math.round(config.firstSwapMs + (config.lastSwapMs - config.firstSwapMs) * progress);
}

/** A short lead-in gap is part of the finale, not just the gaps within it. */
function getSwapGapMs(config: LuckyCupTempo, index: number): number {
  const nextSwapIsFinale = index + 1 >= getFinaleStartIndex(config);
  return nextSwapIsFinale ? (config.finaleGapMs ?? config.interSwapGapMs) : config.interSwapGapMs;
}

/** The FSM asks for this duration before the service creates its swap plan. */
export function getLuckyCupPreparationMsForRound(roundNumber: number): number {
  const config = DIFFICULTY_CONFIG[getDifficulty(roundNumber)];
  let shuffleDurationMs = 0;
  for (let index = 0; index < config.swapCount; index += 1) {
    shuffleDurationMs += getSwapDurationMs(config, index);
    if (index < config.swapCount - 1) shuffleDurationMs += getSwapGapMs(config, index);
  }
  return LUCKY_CUP_SHUFFLE_START_MS + shuffleDurationMs + LUCKY_CUP_SETTLE_MS;
}

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
      const isCorrect = Number.isFinite(numericAnswer) && numericAnswer === this.round!.correctCupNumber;
      const scoring = calculateExactAnswerScore('lucky-cup', this.round!.difficulty, isCorrect);

      return {
        twitchUserId: record.twitchUserId,
        displayName: record.displayName,
        role: record.role,
        ...scoring,
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

    let nextSwapStartMs = 0;
    let lastPairIndex = -1;
    let trackedBallSlot: number = initialBallCupId;
    for (let index = 0; index < config.swapCount; index += 1) {
      // No instant reversal of the same pair (too easy to cancel mentally).
      // During the hard finale, EVERY exchange moves the ball's cup; a decoy-
      // only exchange would give players a free chance to catch up.
      const isFinale = difficulty === 'hard' && index >= getFinaleStartIndex(config);
      const allowedPairs = SLOT_PAIRS.map((_, pairIndex) => pairIndex)
        .filter((pairIndex) => pairIndex !== lastPairIndex)
        .filter((pairIndex) => !isFinale || SLOT_PAIRS[pairIndex].some((slot) => slot === trackedBallSlot));
      const pairIndex = allowedPairs[Math.floor(random() * allowedPairs.length)];
      const [a, b] = SLOT_PAIRS[pairIndex];
      const durationMs = getSwapDurationMs(config, index);
      swaps.push({
        id: `swap-${index}`,
        a,
        b,
        delayMs: nextSwapStartMs,
        durationMs,
      });
      [cupsBySlot[a], cupsBySlot[b]] = [cupsBySlot[b], cupsBySlot[a]];
      if (trackedBallSlot === a) trackedBallSlot = b;
      else if (trackedBallSlot === b) trackedBallSlot = a;
      lastPairIndex = pairIndex;
      nextSwapStartMs += durationMs + getSwapGapMs(config, index);
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
