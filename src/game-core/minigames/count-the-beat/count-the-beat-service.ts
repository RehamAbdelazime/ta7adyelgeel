import type { CitizenRuntime } from '../../citizens/citizen-types';
import type { LocaleCode } from '../../localization/locale-types';
import type { QuestionDifficulty } from '../../questions/question-types';
import type {
  CountTheBeatAnswer,
  CountTheBeatItemSnapshot,
  MiniGameAnswerRecord,
  MiniGameScoreAward,
  MiniGameSnapshot,
  MiniGameStatus,
  SubmitMiniGameAnswerResult,
} from '../minigame-types';

type CountTheBeatIconId = 'note' | 'double-note' | 'wave' | 'mic' | 'headphones' | 'speaker' | 'disc';
type CountTheBeatTone = 'cyan' | 'pink' | 'yellow' | 'purple' | 'green';

type CountTheBeatRound = {
  id: string;
  difficulty: QuestionDifficulty;
  targetIcon: CountTheBeatIconId;
  targetCount: number;
  items: CountTheBeatItemSnapshot[];
};

const DIFFICULTY_ORDER: QuestionDifficulty[] = ['easy', 'medium', 'hard'];

const DIFFICULTY_CONFIG: Record<QuestionDifficulty, {
  targetMin: number;
  targetRange: number;
  distractorMin: number;
  distractorRange: number;
  maxDelayMs: number;
  durationMinMs: number;
  durationRangeMs: number;
  exactScore: number;
  marginOneScore: number;
  marginTwoScore: number;
}> = {
  easy: {
    targetMin: 8,
    targetRange: 5,
    distractorMin: 14,
    distractorRange: 5,
    maxDelayMs: 5_400,
    durationMinMs: 980,
    durationRangeMs: 420,
    exactScore: 120,
    marginOneScore: 70,
    marginTwoScore: 35,
  },
  medium: {
    targetMin: 11,
    targetRange: 6,
    distractorMin: 20,
    distractorRange: 7,
    maxDelayMs: 6_200,
    durationMinMs: 760,
    durationRangeMs: 360,
    exactScore: 180,
    marginOneScore: 105,
    marginTwoScore: 55,
  },
  hard: {
    targetMin: 15,
    targetRange: 8,
    distractorMin: 28,
    distractorRange: 10,
    maxDelayMs: 7_200,
    durationMinMs: 560,
    durationRangeMs: 320,
    exactScore: 240,
    marginOneScore: 140,
    marginTwoScore: 80,
  },
};

const BEAT_ICON_LABELS: Record<CountTheBeatIconId, Record<LocaleCode, string>> = {
  note: { en: 'Music Note', ar: 'نوتة' },
  'double-note': { en: 'Double Note', ar: 'نوتتين' },
  wave: { en: 'Sound Wave', ar: 'موجة صوت' },
  mic: { en: 'Microphone', ar: 'مايك' },
  headphones: { en: 'Headphones', ar: 'سماعة' },
  speaker: { en: 'Speaker', ar: 'سبيكر' },
  disc: { en: 'Disc', ar: 'أسطوانة' },
};

const BEAT_ICON_GLYPHS: Record<CountTheBeatIconId, string> = {
  note: '♪',
  'double-note': '♫',
  wave: '≋',
  mic: '◉',
  headphones: 'Ω',
  speaker: '▶',
  disc: '◎',
};

const BEAT_TONES: CountTheBeatTone[] = ['cyan', 'pink', 'yellow', 'purple', 'green'];
const PARTICIPATION_POINTS = 0;
const MAX_NUMERIC_ANSWER = 99;

function createSeededRandom(seed: number): () => number {
  let value = Math.max(1, seed >>> 0);

  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
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

function clampNumber(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function getDifficulty(roundNumber: number): QuestionDifficulty {
  return DIFFICULTY_ORDER[(roundNumber - 1) % DIFFICULTY_ORDER.length] ?? 'hard';
}

function getIconLabel(icon: CountTheBeatIconId, locale: LocaleCode): string {
  return BEAT_ICON_LABELS[icon]?.[locale] ?? BEAT_ICON_LABELS[icon].en;
}

function scoreAnswer(difficulty: QuestionDifficulty, correctAnswer: number, submittedAnswer: number): number {
  const difference = Math.abs(correctAnswer - submittedAnswer);
  const config = DIFFICULTY_CONFIG[difficulty];

  if (difference === 0) return config.exactScore;
  if (difference === 1) return config.marginOneScore;
  if (difference === 2) return config.marginTwoScore;

  return PARTICIPATION_POINTS;
}

export class CountTheBeatMiniGameService {
  private status: MiniGameStatus = 'idle';
  private round: CountTheBeatRound | null = null;
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

  submitAnswer(citizen: CitizenRuntime, answer: CountTheBeatAnswer): SubmitMiniGameAnswerResult {
    if (!this.round) return { ok: false, reason: 'no_round' };
    if (this.status !== 'answering') return { ok: false, reason: 'closed' };
    if (this.answers.has(citizen.twitchUserId)) return { ok: false, reason: 'already_answered' };

    const numericAnswer = Number(answer);
    if (!Number.isInteger(numericAnswer) || numericAnswer < 0 || numericAnswer > MAX_NUMERIC_ANSWER) {
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
      const isCorrect = Number.isFinite(numericAnswer) && numericAnswer === this.round.targetCount;
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
        ? scoreAnswer(this.round!.difficulty, this.round!.targetCount, numericAnswer)
        : PARTICIPATION_POINTS;

      return {
        twitchUserId: record.twitchUserId,
        displayName: record.displayName,
        role: record.role,
        points,
        isCorrect: points === DIFFICULTY_CONFIG[this.round!.difficulty].exactScore,
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

  getSnapshot(locale: LocaleCode): MiniGameSnapshot {
    const answerRecords = [...this.answers.values()];
    const shouldRevealAnswer = this.status === 'resolved' || this.status === 'scored' || this.status === 'leaderboard';
    const difficulty = this.round?.difficulty ?? 'easy';

    return {
      id: 'count-the-beat',
      status: this.status,
      roundNumber: this.roundNumber,
      title: locale === 'ar' ? 'عدّ الإيقاع' : 'COUNT THE BEAT',
      statement: this.round
        ? (locale === 'ar'
          ? `عدّ عدد ${getIconLabel(this.round.targetIcon, locale)}`
          : `Count every ${getIconLabel(this.round.targetIcon, locale)}`)
        : '',
      instruction: this.round
        ? (locale === 'ar' ? 'اكتب العدد في الشات مثل !15' : 'Type the count in chat, for example !15')
        : '',
      acceptsAnswers: this.status === 'answering',
      officialAnswerCount: answerRecords.filter((answer) => answer.role === 'official').length,
      spectatorAnswerCount: answerRecords.filter((answer) => answer.role === 'spectator').length,
      answerRecords,
      correctAnswer: shouldRevealAnswer && this.round ? this.round.targetCount : null,
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
      countTheBeat: this.round
        ? {
            targetIcon: this.round.targetIcon,
            targetLabel: getIconLabel(this.round.targetIcon, locale),
            targetGlyph: BEAT_ICON_GLYPHS[this.round.targetIcon],
            targetCount: shouldRevealAnswer ? this.round.targetCount : null,
            items: this.round.items,
            answerMargin: 2,
            scoring: {
              exact: DIFFICULTY_CONFIG[difficulty].exactScore,
              marginOne: DIFFICULTY_CONFIG[difficulty].marginOneScore,
              marginTwo: DIFFICULTY_CONFIG[difficulty].marginTwoScore,
            },
          }
        : null,
    };
  }

  private generateRound(roundNumber: number, seed: number): CountTheBeatRound {
    const random = createSeededRandom(seed + roundNumber * 997);
    const difficulty = getDifficulty(roundNumber);
    const config = DIFFICULTY_CONFIG[difficulty];
    const icons = shuffle(Object.keys(BEAT_ICON_GLYPHS) as CountTheBeatIconId[], random);
    const targetIcon = icons[0];
    const distractors = icons.slice(1, difficulty === 'easy' ? 4 : difficulty === 'medium' ? 5 : 6);
    const targetCount = config.targetMin + Math.floor(random() * config.targetRange);
    const distractorCount = config.distractorMin + Math.floor(random() * config.distractorRange);
    const items: CountTheBeatItemSnapshot[] = [];

    for (let index = 0; index < targetCount; index += 1) {
      items.push(this.createItem(`target-${index}`, targetIcon, true, index, random, difficulty));
    }

    for (let index = 0; index < distractorCount; index += 1) {
      const icon = distractors[index % distractors.length] ?? distractors[0] ?? targetIcon;
      items.push(this.createItem(`distractor-${index}`, icon, false, index + targetCount, random, difficulty));
    }

    return {
      id: `count-the-beat-${roundNumber}-${targetIcon}-${targetCount}`,
      difficulty,
      targetIcon,
      targetCount,
      items: shuffle(items, random),
    };
  }

  private createItem(
    id: string,
    icon: CountTheBeatIconId,
    isTarget: boolean,
    index: number,
    random: () => number,
    difficulty: QuestionDifficulty,
  ): CountTheBeatItemSnapshot {
    const config = DIFFICULTY_CONFIG[difficulty];
    const durationMs = config.durationMinMs + Math.floor(random() * config.durationRangeMs);
    const tone = BEAT_TONES[(index + Math.floor(random() * BEAT_TONES.length)) % BEAT_TONES.length];

    return {
      id,
      icon,
      glyph: BEAT_ICON_GLYPHS[icon],
      isTarget,
      x: clampNumber(8 + random() * 84, 6, 94),
      y: clampNumber(12 + random() * 74, 8, 88),
      size: isTarget ? 1.04 + random() * 0.36 : 0.82 + random() * 0.32,
      delayMs: Math.floor(random() * config.maxDelayMs),
      durationMs,
      rotate: Math.floor(-18 + random() * 36),
      tone,
    };
  }
}

export { CountTheBeatMiniGameService as CountTheBeatMiniGame };
