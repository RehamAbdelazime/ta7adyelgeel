import { translate } from '../../localization/translations';
import { getBeatLanePositions } from './count-the-beat-layout';
export { getBeatLanePositions } from './count-the-beat-layout';
import type { TranslationKey } from '../../localization/locale-types';
import type { CitizenRuntime } from '../../citizens/citizen-types';
import { calculateNumericEstimateScore, getNumericEstimateScoringGuide } from '../scoring-policy';
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

type CountTheBeatRound = {
  id: string;
  difficulty: QuestionDifficulty;
  targetIcon: CountTheBeatIconId;
  targetCount: number;
  items: CountTheBeatItemSnapshot[];
  lanes: 1 | 2 | 4;
  bpm: number;
};

const DIFFICULTY_ORDER: QuestionDifficulty[] = ['easy', 'medium', 'hard'];

/** One symbol per pulse, arranged on illuminated horizontal lanes.
 * Tempo ramps inside a question; later questions also start slightly faster.
 * A small dark gap between every symbol guarantees countability on stream. */
const DIFFICULTY_CONFIG: Record<QuestionDifficulty, {
  targetMin: number;
  targetRange: number;
  totalBeats: number;
  startBpm: number;
  endBpm: number;
  distractorKinds: number;
  lanes: 1 | 2 | 4;
}> = {
  easy:   { targetMin: 5, targetRange: 2, totalBeats: 12, startBpm: 54, endBpm: 63, distractorKinds: 2, lanes: 1 },
  medium: { targetMin: 6, targetRange: 2, totalBeats: 14, startBpm: 60, endBpm: 81, distractorKinds: 3, lanes: 2 },
  hard:   { targetMin: 7, targetRange: 2, totalBeats: 16, startBpm: 66, endBpm: 99, distractorKinds: 4, lanes: 4 },
};

/** Both the visual symbols and the audio cues use this precise timeline.
 * Never approximate accelerating beats by a fixed BPM in another layer. */
export function getCountTheBeatSchedule(roundNumber: number): ReadonlyArray<{ delayMs: number; durationMs: number }> {
  const config = DIFFICULTY_CONFIG[getDifficulty(roundNumber)];
  const beats: { delayMs: number; durationMs: number }[] = [];
  let clock = 0;
  for (let index = 0; index < config.totalBeats; index += 1) {
    const progress = index / Math.max(1, config.totalBeats - 1);
    const bpm = config.startBpm + (config.endBpm - config.startBpm) * progress;
    const intervalMs = 60_000 / bpm;
    beats.push({ delayMs: Math.round(clock), durationMs: Math.round(intervalMs * .83) });
    clock += intervalMs;
  }
  return beats;
}

/** The answer timer is a separate phase, starting after the last icon goes dark. */
export function getCountTheBeatPreparationMsForRound(roundNumber: number): number {
  const beats = getCountTheBeatSchedule(roundNumber);
  const last = beats[beats.length - 1];
  return last ? last.delayMs + last.durationMs + 280 : 0;
}

/** Store translation keys, not resolved text: runtime locale changes stay live. */
const BEAT_ICON_LABEL_KEYS: Record<CountTheBeatIconId, TranslationKey> = {
  note: 'countBeat.icon.note',
  'double-note': 'countBeat.icon.doubleNote',
  wave: 'countBeat.icon.wave',
  mic: 'countBeat.icon.mic',
  headphones: 'countBeat.icon.headphones',
  speaker: 'countBeat.icon.speaker',
  disc: 'countBeat.icon.disc',
};

const BEAT_ICON_GLYPHS: Record<CountTheBeatIconId, string> = {
  note: '♪',
  'double-note': '♫',
  wave: '〰',
  mic: '🎤',
  headphones: '🎧',
  speaker: '🔊',
  disc: '💿',
};

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

function getDifficulty(roundNumber: number): QuestionDifficulty {
  return DIFFICULTY_ORDER[(roundNumber - 1) % DIFFICULTY_ORDER.length] ?? 'hard';
}

function getIconLabel(icon: CountTheBeatIconId, locale: LocaleCode): string {
  return translate(locale, BEAT_ICON_LABEL_KEYS[icon]);
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
      const scoring = calculateNumericEstimateScore(
        'count-the-beat',
        this.round!.difficulty,
        this.round!.targetCount,
        numericAnswer,
      );

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

  getSnapshot(locale: LocaleCode): MiniGameSnapshot {
    const answerRecords = [...this.answers.values()];
    const shouldRevealAnswer = this.status === 'resolved' || this.status === 'scored' || this.status === 'leaderboard';
    const difficulty = this.round?.difficulty ?? 'easy';

    return {
      id: 'count-the-beat',
      status: this.status,
      roundNumber: this.roundNumber,
      title: translate(locale, 'minigame.countTheBeat.title'),
      statement: this.round
        ? translate(locale, 'ui.countTheBeatScreen.countEveryIcon', {
            icon: getIconLabel(this.round.targetIcon, locale),
          })
        : '',
      instruction: this.round
        ? translate(locale, 'ui.countTheBeatScreen.typeNumericChat')
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
            lanes: this.round.lanes,
            targetIcon: this.round.targetIcon,
            targetLabel: getIconLabel(this.round.targetIcon, locale),
            targetGlyph: BEAT_ICON_GLYPHS[this.round.targetIcon],
            targetCount: shouldRevealAnswer ? this.round.targetCount : null,
            items: this.round.items,
            bpm: this.round.bpm,
            scoring: getNumericEstimateScoringGuide('count-the-beat', difficulty),
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
    const distractors = icons.slice(1, config.distractorKinds + 1);
    const targetCount = config.targetMin + Math.floor(random() * config.targetRange);
    const distractorCount = config.totalBeats - targetCount;
    const items: CountTheBeatItemSnapshot[] = [];

    for (let index = 0; index < targetCount; index += 1) {
      items.push(this.createItem(`target-${index}`, targetIcon, true));
    }
    for (let index = 0; index < distractorCount; index += 1) {
      const icon = distractors[index % distractors.length] ?? distractors[0] ?? targetIcon;
      items.push(this.createItem(`distractor-${index}`, icon, false));
    }

    // Stop clumps of three identical symbols. A randomized sequence should be
    // difficult because of observation, not because six items flash at once.
    let orderedItems = shuffle(items, random);
    for (let attempt = 0; attempt < 128; attempt += 1) {
      const hasTriple = orderedItems.some((item, index) => index >= 2
        && item.icon === orderedItems[index - 1].icon
        && item.icon === orderedItems[index - 2].icon);
      if (!hasTriple) break;
      orderedItems = shuffle(items, random);
    }

    const laneYs = getBeatLanePositions(config.lanes);
    const schedule = getCountTheBeatSchedule(roundNumber);
    let lastLane = -1;
    let lastSlot = -1;
    // EASY: a stable left-to-right line with a slight restart offset.
    // MEDIUM: two lines; the first third alternates predictably, then drifts.
    // HARD: four lines; jumps become less predictable as the pace increases.
    orderedItems.forEach((item, index) => {
      const progress = index / Math.max(1, orderedItems.length - 1);
      let lane: number;
      if (config.lanes === 1) {
        lane = 0;
      } else if (config.lanes === 2 && progress < .35) {
        lane = index % 2;
      } else if (config.lanes === 4 && progress < .3) {
        lane = index % 4;
      } else {
        lane = Math.floor(random() * config.lanes);
        // Avoid repetitive positions; difficulty is a visual tracking challenge.
        if (config.lanes > 1 && lane === lastLane && random() < .76) {
          lane = (lane + 1 + Math.floor(random() * (config.lanes - 1))) % config.lanes;
        }
      }
      let slot: number;
      if (config.lanes === 1) {
        slot = index % 5;
      } else if (progress < .3) {
        slot = (index + lane) % 5;
      } else {
        slot = Math.floor(random() * 5);
        if (slot === lastSlot && lane === lastLane) slot = (slot + 1 + Math.floor(random() * 4)) % 5;
      }
      lastLane = lane;
      lastSlot = slot;
      item.x = [18, 34, 50, 66, 82][slot];
      item.y = laneYs[lane];
      item.delayMs = schedule[index].delayMs;
      item.durationMs = schedule[index].durationMs;
      item.rotate = 0;
    });

    return {
      id: `count-the-beat-${roundNumber}-${seed}-${targetIcon}-${targetCount}`,
      difficulty,
      targetIcon,
      targetCount,
      items: orderedItems,
      lanes: config.lanes,
      bpm: config.startBpm,
    };
  }

  private createItem(id: string, icon: CountTheBeatIconId, isTarget: boolean): CountTheBeatItemSnapshot {
    return {
      id,
      icon,
      glyph: BEAT_ICON_GLYPHS[icon],
      isTarget,
      x: 50,
      y: 50,
      // Every symbol looks EXACTLY the same aside from its silhouette.
      // No color, size, rotation, glow or position reveals the target.
      size: 1,
      delayMs: 0,
      durationMs: 0,
      rotate: 0,
      tone: 'cyan',
    };
  }

}

export { CountTheBeatMiniGameService as CountTheBeatMiniGame };
