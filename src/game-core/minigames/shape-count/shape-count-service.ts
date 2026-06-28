import type { CitizenRuntime } from '../../citizens/citizen-types';
import type { LocaleCode } from '../../localization/locale-types';
import type { QuestionCategory, QuestionDifficulty } from '../../questions/question-types';
import type {
  MiniGameAnswerRecord,
  MiniGameScoreAward,
  MiniGameSnapshot,
  MiniGameStatus,
  ShapeCountAnswer,
  ShapeCountCell,
  ShapeCountChoice,
  ShapeCountShapeId,
  SubmitMiniGameAnswerResult,
} from '../minigame-types';

const PARTICIPATION_POINTS = 10;

const DIFFICULTY_SCORE: Record<QuestionDifficulty, number> = {
  easy: 50,
  medium: 100,
  hard: 150,
};

const SHAPES: ShapeCountShapeId[] = ['circle', 'square', 'triangle', 'star', 'diamond', 'hexagon'];

const SHAPE_LABELS: Record<LocaleCode, Record<ShapeCountShapeId, string>> = {
  en: {
    circle: 'Circle',
    square: 'Square',
    triangle: 'Triangle',
    star: 'Star',
    diamond: 'Diamond',
    hexagon: 'Hexagon',
  },
  ar: {
    circle: 'دائرة',
    square: 'مربع',
    triangle: 'مثلث',
    star: 'نجمة',
    diamond: 'ماسة',
    hexagon: 'سداسي',
  },
};

type ShapeCountRound = {
  id: string;
  rows: number;
  columns: number;
  cells: ShapeCountCell[];
  choices: ShapeCountShapeId[];
  counts: Record<ShapeCountShapeId, number>;
  correctAnswer: ShapeCountShapeId;
  difficulty: QuestionDifficulty;
  category: QuestionCategory;
  signature: string;
};

export class ShapeCountMiniGameService {
  private round: ShapeCountRound | null = null;
  private status: MiniGameStatus = 'idle';
  private roundNumber = 0;
  private readonly answers = new Map<string, MiniGameAnswerRecord>();
  private correctOfficialCount = 0;
  private correctSpectatorCount = 0;
  private scored = false;
  private readonly tourSignatures = new Set<string>();
  private readonly sessionSignatures = new Set<string>();

  beginTour(): void {
    this.tourSignatures.clear();
    this.clearActiveRound();
  }

  startRound(roundNumber: number): void {
    this.roundNumber = roundNumber;
    this.round = this.generateUniqueRound(roundNumber);
    this.status = 'intro';
    this.answers.clear();
    this.correctOfficialCount = 0;
    this.correctSpectatorCount = 0;
    this.scored = false;

    this.tourSignatures.add(this.round.signature);
    this.sessionSignatures.add(this.round.signature);
  }

  setStatus(status: MiniGameStatus): void {
    if (!this.round && status !== 'idle') {
      return;
    }

    this.status = status;
  }

  submitAnswer(citizen: CitizenRuntime, answer: ShapeCountAnswer): SubmitMiniGameAnswerResult {
    if (!this.round) {
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
    if (!this.round) {
      return;
    }

    this.correctOfficialCount = 0;
    this.correctSpectatorCount = 0;

    for (const [id, record] of this.answers.entries()) {
      const isCorrect = record.answer === this.round.correctAnswer;
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
    if (!this.round || this.scored) {
      return [];
    }

    const awards: MiniGameScoreAward[] = [];

    for (const record of this.answers.values()) {
      const isCorrect = record.answer === this.round.correctAnswer;
      awards.push({
        twitchUserId: record.twitchUserId,
        displayName: record.displayName,
        role: record.role,
        points: isCorrect ? DIFFICULTY_SCORE[this.round.difficulty] : PARTICIPATION_POINTS,
        isCorrect,
        difficulty: this.round.difficulty,
      });
    }

    this.scored = true;
    this.status = 'scored';
    return awards;
  }

  clearActiveRound(): void {
    this.round = null;
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
      id: 'shape-count',
      status: this.status,
      roundNumber: this.roundNumber,
      title: locale === 'ar' ? 'عدّ الأشكال' : 'SHAPE COUNT',
      statement: locale === 'ar' ? 'أي شكل موجود بعدد أكبر؟' : 'Which shape appears the most?',
      instruction: this.round
        ? this.buildInstruction(locale, this.round.choices)
        : '',
      acceptsAnswers: this.status === 'answering',
      officialAnswerCount,
      spectatorAnswerCount,
      answerRecords: [...this.answers.values()],
      correctAnswer: shouldRevealAnswer ? this.round?.correctAnswer ?? null : null,
      correctOfficialCount: this.correctOfficialCount,
      correctSpectatorCount: this.correctSpectatorCount,
      hasRound: Boolean(this.round),
      questionId: this.round?.id ?? null,
      questionCategory: this.round?.category ?? null,
      questionDifficulty: this.round?.difficulty ?? null,
      questionBankStats: {
        totalQuestions: 9999,
        tourUsedQuestions: this.tourSignatures.size,
        tourUsedSimilarityGroups: this.tourSignatures.size,
        sessionUsedQuestions: this.sessionSignatures.size,
        sessionUsedSimilarityGroups: this.sessionSignatures.size,
      },
      shapeGrid: this.round
        ? {
            rows: this.round.rows,
            columns: this.round.columns,
            cells: this.round.cells,
            choices: this.round.choices.map((shape, index) => ({
              shape,
              label: SHAPE_LABELS[locale][shape],
              command: `!${index + 1}`,
              optionNumber: index + 1,
            })),
            counts: this.round.counts,
          }
        : null,
    };
  }

  getAnswerByOptionNumber(optionNumber: number): ShapeCountAnswer | null {
    if (!this.round) {
      return null;
    }

    const optionIndex = optionNumber - 1;
    return this.round.choices[optionIndex] ?? null;
  }

  private buildInstruction(locale: LocaleCode, choices: ShapeCountShapeId[]): string {
    const commands = choices.map((_shape, index) => `!${index + 1}`).join(' / ');
    return locale === 'ar'
      ? `اكتب رقم الإجابة: ${commands}`
      : `Type the answer number: ${commands}`;
  }

  private generateUniqueRound(roundNumber: number): ShapeCountRound {
    for (let attempt = 0; attempt < 60; attempt += 1) {
      const round = this.generateRound(roundNumber, attempt);
      if (!this.tourSignatures.has(round.signature) && !this.sessionSignatures.has(round.signature)) {
        return round;
      }
    }

    for (let attempt = 100; attempt < 160; attempt += 1) {
      const round = this.generateRound(roundNumber, attempt);
      if (!this.tourSignatures.has(round.signature)) {
        return round;
      }
    }

    return this.generateRound(roundNumber, Date.now() % 10_000);
  }

  private generateRound(roundNumber: number, salt: number): ShapeCountRound {
    const random = createSeededRandom(createRoundSeed(roundNumber, salt, this.sessionSignatures.size));
    const difficulty = this.pickDifficulty(roundNumber, random());
    const shapeCount = difficulty === 'easy' ? 3 : random() > 0.34 ? 4 : 3;
    const choices = shuffle([...SHAPES], random).slice(0, shapeCount);
    const rows = difficulty === 'hard' ? 6 : 5;
    const columns = difficulty === 'easy' ? 6 : 7;
    const totalCells = rows * columns;
    const majorityIndex = Math.floor(random() * choices.length);
    const correctAnswer = choices[majorityIndex];
    const counts = this.buildCounts(choices, correctAnswer, totalCells, difficulty, random);
    const cells = shuffle(
      choices.flatMap((shape) => Array.from({ length: counts[shape] ?? 0 }, (_, index) => ({
        id: `${shape}-${index}`,
        shape,
      }))),
      random,
    ).map((cell, index) => ({ ...cell, id: `${cell.id}-${index}` }));
    const signature = choices
      .map((shape) => `${shape}:${counts[shape] ?? 0}`)
      .sort()
      .join('|');

    return {
      id: `shape-count-${roundNumber}-${signature}`,
      rows,
      columns,
      cells,
      choices,
      counts,
      correctAnswer,
      difficulty,
      category: 'games',
      signature,
    };
  }

  private buildCounts(
    choices: ShapeCountShapeId[],
    correctAnswer: ShapeCountShapeId,
    totalCells: number,
    difficulty: QuestionDifficulty,
    random: () => number,
  ): Record<ShapeCountShapeId, number> {
    const counts = Object.fromEntries(SHAPES.map((shape) => [shape, 0])) as Record<ShapeCountShapeId, number>;
    const otherShapes = choices.filter((shape) => shape !== correctAnswer);
    const majorityGap = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 3 : 1;
    const majority = Math.ceil(totalCells / choices.length) + majorityGap;
    counts[correctAnswer] = Math.min(totalCells - otherShapes.length, majority);
    let remaining = totalCells - counts[correctAnswer];

    for (let index = 0; index < otherShapes.length; index += 1) {
      const shape = otherShapes[index];
      const remainingShapes = otherShapes.length - index;
      const maxAllowed = Math.max(1, counts[correctAnswer] - 1);
      const minForRest = remainingShapes - 1;
      const fairShare = Math.floor(remaining / remainingShapes);
      const jitter = Math.floor(random() * 3) - 1;
      const nextCount = index === otherShapes.length - 1
        ? remaining
        : Math.max(1, Math.min(maxAllowed, fairShare + jitter, remaining - minForRest));

      counts[shape] = Math.min(maxAllowed, nextCount);
      remaining -= counts[shape];
    }

    // If rounding left extra cells, distribute without creating a tie with the majority.
    while (remaining > 0) {
      const candidates = otherShapes.filter((shape) => counts[shape] < counts[correctAnswer] - 1);
      if (candidates.length === 0) {
        counts[correctAnswer] += remaining;
        break;
      }
      const target = candidates[Math.floor(random() * candidates.length)];
      counts[target] += 1;
      remaining -= 1;
    }

    return counts;
  }

  private pickDifficulty(roundNumber: number, roll: number): QuestionDifficulty {
    if (roundNumber <= 1) {
      if (roll < 0.68) return 'easy';
      if (roll < 0.93) return 'medium';
      return 'hard';
    }

    if (roundNumber <= 3) {
      if (roll < 0.32) return 'easy';
      if (roll < 0.84) return 'medium';
      return 'hard';
    }

    if (roll < 0.12) return 'easy';
    if (roll < 0.58) return 'medium';
    return 'hard';
  }
}

function createRoundSeed(roundNumber: number, salt: number, usedSignatureCount: number): number {
  let cryptoSeed = 0;

  if (globalThis.crypto?.getRandomValues) {
    const buffer = new Uint32Array(1);
    globalThis.crypto.getRandomValues(buffer);
    cryptoSeed = buffer[0];
  }

  return (
    cryptoSeed
    ^ Math.floor(performance.now() * 1000)
    ^ Date.now()
    ^ (roundNumber * 1009)
    ^ (salt * 9173)
    ^ (usedSignatureCount * 97)
  ) >>> 0;
}

function createSeededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

function shuffle<T>(items: T[], random: () => number): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}
