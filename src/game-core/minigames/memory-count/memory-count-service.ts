import type { CitizenRuntime } from '../../citizens/citizen-types';
import type { LocaleCode } from '../../localization/locale-types';
import type { QuestionCategory, QuestionDifficulty } from '../../questions/question-types';
import type {
  MemoryCountAnswer,
  MemoryCountCell,
  MiniGameAnswerRecord,
  MiniGameScoreAward,
  MiniGameSnapshot,
  MiniGameStatus,
  NumberChoice,
  SubmitMiniGameAnswerResult,
} from '../minigame-types';

const PARTICIPATION_POINTS = 10;

const DIFFICULTY_SCORE: Record<QuestionDifficulty, number> = {
  easy: 60,
  medium: 120,
  hard: 180,
};

const TARGET_KIND_LABELS: Record<LocaleCode, Record<MemoryCountCell['kind'], string>> = {
  en: {
    coin: 'Coins',
    star: 'Stars',
    gem: 'Gems',
    bolt: 'Bolts',
    heart: 'Hearts',
    crown: 'Crowns',
  },
  ar: {
    coin: 'العملات',
    star: 'النجوم',
    gem: 'الجواهر',
    bolt: 'البرق',
    heart: 'القلوب',
    crown: 'التيجان',
  },
};

const TARGET_KINDS: MemoryCountCell['kind'][] = ['coin', 'star', 'gem', 'bolt', 'heart', 'crown'];

type MemoryCountRound = {
  id: string;
  rows: number;
  columns: number;
  cells: MemoryCountCell[];
  targetKind: MemoryCountCell['kind'];
  choices: NumberChoice[];
  correctCount: number;
  difficulty: QuestionDifficulty;
  category: QuestionCategory;
  signature: string;
};

export class MemoryCountMiniGameService {
  private round: MemoryCountRound | null = null;
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
    if (!this.round && status !== 'idle') return;
    this.status = status;
  }

  submitAnswer(citizen: CitizenRuntime, answer: MemoryCountAnswer): SubmitMiniGameAnswerResult {
    if (!this.round) return { ok: false, reason: 'no_round' };
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
    if (!this.round) return;

    this.correctOfficialCount = 0;
    this.correctSpectatorCount = 0;

    for (const [id, record] of this.answers.entries()) {
      const isCorrect = this.getChoiceValue(record.answer as MemoryCountAnswer) === this.round.correctCount;
      const resolvedRecord = { ...record, isCorrect };
      this.answers.set(id, resolvedRecord);

      if (isCorrect && record.role === 'official') this.correctOfficialCount += 1;
      if (isCorrect && record.role === 'spectator') this.correctSpectatorCount += 1;
    }

    this.status = 'resolved';
  }

  createScoreAwards(): MiniGameScoreAward[] {
    if (!this.round || this.scored) return [];

    const awards: MiniGameScoreAward[] = [];

    for (const record of this.answers.values()) {
      const chosenValue = this.getChoiceValue(record.answer as MemoryCountAnswer);
      const diff = chosenValue === null ? Number.POSITIVE_INFINITY : Math.abs(chosenValue - this.round.correctCount);
      const maxPoints = DIFFICULTY_SCORE[this.round.difficulty];
      const points = diff === 0
        ? maxPoints
        : diff === 1
          ? Math.round(maxPoints * 0.65)
          : diff === 2
            ? Math.round(maxPoints * 0.35)
            : PARTICIPATION_POINTS;

      awards.push({
        twitchUserId: record.twitchUserId,
        displayName: record.displayName,
        role: record.role,
        points,
        isCorrect: diff === 0,
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
      id: 'memory-count',
      status: this.status,
      roundNumber: this.roundNumber,
      title: locale === 'ar' ? 'عدّ بسرعة' : 'FLASH COUNT',
      statement: this.round
        ? locale === 'ar'
          ? `عدّ ${TARGET_KIND_LABELS.ar[this.round.targetKind]} قبل ما تختفي!`
          : `Count the ${TARGET_KIND_LABELS.en[this.round.targetKind]} before they disappear!`
        : '',
      instruction: this.round ? this.buildInstruction(locale, this.round.choices) : '',
      acceptsAnswers: this.status === 'answering',
      officialAnswerCount,
      spectatorAnswerCount,
      answerRecords: [...this.answers.values()],
      correctAnswer: shouldRevealAnswer ? this.round ? `option-${this.round.choices.find((choice) => choice.value === this.round?.correctCount)?.optionNumber ?? 1}` as MemoryCountAnswer : null : null,
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
      memoryCount: this.round
        ? {
            rows: this.round.rows,
            columns: this.round.columns,
            cells: this.round.cells,
            targetKind: this.round.targetKind,
            targetLabel: TARGET_KIND_LABELS[locale][this.round.targetKind],
            choices: this.round.choices,
            correctCount: shouldRevealAnswer ? this.round.correctCount : null,
            showItems: this.status === 'intro' || this.status === 'prepare',
          }
        : null,
    };
  }

  getAnswerByOptionNumber(optionNumber: number): MemoryCountAnswer | null {
    if (!this.round || optionNumber < 1 || optionNumber > this.round.choices.length) return null;
    return `option-${optionNumber}` as MemoryCountAnswer;
  }

  private getChoiceValue(answer: MemoryCountAnswer): number | null {
    if (!this.round) return null;
    const optionNumber = Number.parseInt(answer.replace('option-', ''), 10);
    return this.round.choices.find((choice) => choice.optionNumber === optionNumber)?.value ?? null;
  }

  private buildInstruction(locale: LocaleCode, choices: NumberChoice[]): string {
    const commands = choices.map((choice) => `${choice.command}=${choice.value}`).join(' / ');
    return locale === 'ar' ? `اختار أقرب رقم: ${commands}` : `Pick the closest count: ${commands}`;
  }

  private generateUniqueRound(roundNumber: number): MemoryCountRound {
    for (let attempt = 0; attempt < 80; attempt += 1) {
      const round = this.generateRound(roundNumber, attempt);
      if (!this.tourSignatures.has(round.signature) && !this.sessionSignatures.has(round.signature)) return round;
    }

    for (let attempt = 120; attempt < 200; attempt += 1) {
      const round = this.generateRound(roundNumber, attempt);
      if (!this.tourSignatures.has(round.signature)) return round;
    }

    return this.generateRound(roundNumber, Date.now() % 10_000);
  }

  private generateRound(roundNumber: number, salt: number): MemoryCountRound {
    const random = createSeededRandom(roundNumber * 1709 + salt * 9157 + this.sessionSignatures.size * 131 + Date.now());
    const difficulty = this.pickDifficulty(roundNumber, random());
    const rows = difficulty === 'hard' ? 5 : 4;
    const columns = difficulty === 'easy' ? 6 : difficulty === 'medium' ? 7 : 8;
    const totalCells = rows * columns;
    const targetKind = TARGET_KINDS[Math.floor(random() * TARGET_KINDS.length)];
    const distractors = shuffle(TARGET_KINDS.filter((kind) => kind !== targetKind), random).slice(0, difficulty === 'easy' ? 2 : 3);
    const kinds = [targetKind, ...distractors];
    const correctCount = difficulty === 'easy'
      ? 7 + Math.floor(random() * 5)
      : difficulty === 'medium'
        ? 8 + Math.floor(random() * 8)
        : 10 + Math.floor(random() * 11);
    const cells: MemoryCountCell[] = [];

    for (let i = 0; i < correctCount; i += 1) {
      cells.push({ id: `${targetKind}-${i}`, kind: targetKind });
    }

    let remaining = totalCells - correctCount;
    for (const kind of distractors) {
      const nextCount = Math.max(2, Math.floor(remaining / distractors.length) + Math.floor(random() * 4) - 1);
      const count = kind === distractors[distractors.length - 1] ? remaining : Math.min(remaining, nextCount);
      for (let i = 0; i < count; i += 1) {
        cells.push({ id: `${kind}-${i}`, kind });
      }
      remaining -= count;
    }

    while (cells.length < totalCells) {
      const kind = kinds[Math.floor(random() * kinds.length)];
      cells.push({ id: `${kind}-extra-${cells.length}`, kind });
    }

    const shuffledCells = shuffle(cells.slice(0, totalCells), random).map((cell, index) => ({ ...cell, id: `${cell.id}-${index}` }));
    const choices = this.buildChoices(correctCount, difficulty, random);
    const signature = `${targetKind}:${correctCount}:${rows}x${columns}:${choices.map((choice) => choice.value).join(',')}`;

    return {
      id: `memory-count-${roundNumber}-${signature}`,
      rows,
      columns,
      cells: shuffledCells,
      targetKind,
      choices,
      correctCount,
      difficulty,
      category: 'games',
      signature,
    };
  }

  private buildChoices(correctCount: number, difficulty: QuestionDifficulty, random: () => number): NumberChoice[] {
    const spread = difficulty === 'easy' ? [0, -2, 2, 4] : difficulty === 'medium' ? [0, -1, 2, -3] : [0, -1, 1, 2];
    const values = new Set<number>();
    for (const offset of shuffle(spread, random)) values.add(Math.max(1, correctCount + offset));
    while (values.size < 4) values.add(Math.max(1, correctCount + Math.floor(random() * 7) - 3));
    return shuffle([...values], random).slice(0, 4).map((value, index) => ({
      optionNumber: index + 1,
      command: `!${index + 1}`,
      label: String(value),
      value,
    }));
  }

  private pickDifficulty(roundNumber: number, roll: number): QuestionDifficulty {
    if (roundNumber <= 1) {
      if (roll < 0.62) return 'easy';
      if (roll < 0.92) return 'medium';
      return 'hard';
    }
    if (roundNumber <= 3) {
      if (roll < 0.30) return 'easy';
      if (roll < 0.80) return 'medium';
      return 'hard';
    }
    if (roll < 0.15) return 'easy';
    if (roll < 0.58) return 'medium';
    return 'hard';
  }
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
