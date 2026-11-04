/**
 * Shared visual-choice engine for Guess the Movie and Guess the Star.
 * The clue is always an image, while the four answer options use the same
 * Twitch/host commands, scoring policy and tour phases as the existing games.
 * Media and attribution data are authored outside TS; neither game hardcodes a
 * copyrighted image into its UI or silently substitutes a fake celebrity.
 */
import rawBank from './visual-guess-questions.json';
import type { CitizenRuntime } from '../../citizens/citizen-types';
import type { LocaleCode } from '../../localization/locale-types';
import type { QuestionDifficulty } from '../../questions/question-types';
import type {
  MiniGameAnswerRecord, MiniGameScoreAward, MiniGameSnapshot, MiniGameStatus,
  SubmitMiniGameAnswerResult, VisualGuessChoice,
} from '../minigame-types';
import type { MiniGameId } from '../minigame-registry';
import { calculateExactAnswerScore } from '../scoring-policy';

export type VisualGuessMode = 'scene' | 'poster' | 'eyes' | 'silhouette' | 'zoom' | 'reveal';
export type VisualGuessGameId = Extract<MiniGameId, 'guess-movie' | 'guess-star'>;
type I18n = { en: string; ar: string };
type ImageItem = {
  id: string;
  name: I18n;
  imageUrl: string;
  mode: VisualGuessMode;
  difficulty: QuestionDifficulty;
  category: string;
  focus?: { x: number; y: number };
  titleMask?: { x: number; y: number; w: number; h: number };
  attribution: { source: string; license: string };
};
type ActiveRound = { item: ImageItem; choices: VisualGuessChoice[]; correctOptionNumber: number };
const BANK = rawBank as { movies: ImageItem[]; stars: ImageItem[] };
const MODES: Record<VisualGuessGameId, VisualGuessMode[]> = {
  'guess-movie': ['scene', 'poster'],
  'guess-star': ['eyes', 'silhouette', 'zoom', 'reveal'],
};
const ROUND_MODES: Record<VisualGuessGameId, VisualGuessMode[]> = {
  'guess-movie': ['scene', 'poster', 'scene', 'poster'],
  'guess-star': ['eyes', 'silhouette', 'zoom', 'reveal'],
};

export function getVisualGuessBank(gameId: VisualGuessGameId): readonly ImageItem[] {
  return gameId === 'guess-movie' ? BANK.movies : BANK.stars;
}

export class VisualGuessMiniGameService {
  private status: MiniGameStatus = 'idle';
  private round: ActiveRound | null = null;
  private roundNumber = 0;
  private readonly answers = new Map<string, MiniGameAnswerRecord>();
  private readonly tourUsedIds = new Set<string>();
  private readonly sessionUsedIds = new Set<string>();
  private correctOfficialCount = 0;
  private correctSpectatorCount = 0;
  private scored = false;

  constructor(readonly gameId: VisualGuessGameId) {}

  beginTour(): void { this.tourUsedIds.clear(); this.clearActiveRound(); }
  startRound(roundNumber: number, seed = Date.now()): void {
    this.roundNumber = roundNumber;
    this.answers.clear();
    this.correctOfficialCount = 0;
    this.correctSpectatorCount = 0;
    this.scored = false;
    const bank = getVisualGuessBank(this.gameId);
    if (bank.length < 4) throw new Error(`${this.gameId} needs at least four valid image entries`);

    // A predictable mode cadence guarantees that each variant actually gets played.
    // Avoid repeated photos across a tour, then a session, until the pack is exhausted.
    const scheduledMode = ROUND_MODES[this.gameId][(roundNumber - 1) % ROUND_MODES[this.gameId].length];
    const eligible = bank.filter(item => item.mode === scheduledMode);
    const pool = eligible.filter(item => !this.tourUsedIds.has(item.id) && !this.sessionUsedIds.has(item.id));
    const tourPool = eligible.filter(item => !this.tourUsedIds.has(item.id));
    const fallback = pool.length ? pool : tourPool.length ? tourPool : eligible.length ? eligible : bank;
    const rng = seededRandom(seed + roundNumber * 811 + this.sessionUsedIds.size * 2713);
    const item = fallback[Math.floor(rng() * fallback.length)];
    if (!item) throw new Error(`${this.gameId} has no playable media content`);

    // Distinct distractors, never reveal the real answer until the scoring phase.
    const distractors = shuffle(bank.filter(q => q.id !== item.id), rng).slice(0, 3);
    const choices = shuffle([item, ...distractors], rng).map((entry, index) => ({
      optionNumber: index + 1,
      command: `!${index + 1}`,
      label: entry.name.en,
      value: entry.id,
    }));
    const correctOptionNumber = choices.find(choice => choice.value === item.id)?.optionNumber ?? 1;
    this.round = { item, choices, correctOptionNumber };
    this.status = 'intro';
    this.tourUsedIds.add(item.id);
    this.sessionUsedIds.add(item.id);
  }
  setStatus(status: MiniGameStatus): void { if (this.round || status === 'idle') this.status = status; }
  getAnswerByOptionNumber(number: number): `option-${1|2|3|4}` | null {
    if (!this.round || !Number.isInteger(number) || number < 1 || number > 4) return null;
    return `option-${number}` as `option-${1|2|3|4}`;
  }
  submitAnswer(citizen: CitizenRuntime, answer: `option-${1|2|3|4}`): SubmitMiniGameAnswerResult {
    if (!this.round) return { ok: false, reason: 'no_round' };
    if (this.status !== 'answering') return { ok: false, reason: 'closed' };
    if (this.answers.has(citizen.twitchUserId)) return { ok: false, reason: 'already_answered' };
    const choice = this.round.choices.find(c => `option-${c.optionNumber}` === answer);
    if (!choice) return { ok: false, reason: 'closed' };
    const record: MiniGameAnswerRecord = {
      twitchUserId: citizen.twitchUserId, displayName: citizen.displayName,
      role: citizen.role, answer, submittedAt: Date.now(), isCorrect: choice.value === this.round.item.id,
    };
    this.answers.set(citizen.twitchUserId, record);
    return { ok: true, record };
  }
  resolveRound(): void {
    if (!this.round) return;
    this.correctOfficialCount = 0;
    this.correctSpectatorCount = 0;
    for (const [id, record] of this.answers) {
      const correct = this.round.choices.find(c => `option-${c.optionNumber}` === record.answer)?.value === this.round.item.id;
      const updated = { ...record, isCorrect: correct };
      this.answers.set(id, updated);
      if (correct && record.role === 'official') this.correctOfficialCount++;
      if (correct && record.role === 'spectator') this.correctSpectatorCount++;
    }
    this.status = 'resolved';
  }
  createScoreAwards(): MiniGameScoreAward[] {
    if (!this.round || this.scored) return [];
    this.scored = true;
    const awards = [...this.answers.values()].map(record => ({
      twitchUserId: record.twitchUserId,
      displayName: record.displayName,
      role: record.role,
      difficulty: this.round!.item.difficulty,
      ...calculateExactAnswerScore(this.gameId, this.round!.item.difficulty, Boolean(record.isCorrect)),
    }));
    this.status = 'scored';
    return awards;
  }
  clearActiveRound(): void {
    this.round = null; this.status = 'idle'; this.roundNumber = 0; this.answers.clear();
    this.correctOfficialCount = 0; this.correctSpectatorCount = 0; this.scored = false;
  }
  clear(): void { this.clearActiveRound(); this.tourUsedIds.clear(); this.sessionUsedIds.clear(); }
  getSnapshot(locale: LocaleCode): MiniGameSnapshot {
    const item = this.round?.item;
    const reveal = this.status === 'resolved' || this.status === 'scored' || this.status === 'leaderboard';
    const bank = getVisualGuessBank(this.gameId);
    return {
      id: this.gameId, status: this.status, roundNumber: this.roundNumber,
      title: this.gameId === 'guess-movie'
        ? (locale === 'ar' ? 'اعرف الفيلم' : 'GUESS THE MOVIE')
        : (locale === 'ar' ? 'اعرف النجم' : 'GUESS THE STAR'),
      statement: item ? (this.gameId === 'guess-movie'
        ? (locale === 'ar' ? 'الفيلم ده إيه؟' : 'WHICH MOVIE?')
        : (locale === 'ar' ? 'مين النجم؟' : 'WHO IS THE STAR?')) : '',
      instruction: locale === 'ar' ? 'اختار من 1 إلى 4' : 'Pick 1–4',
      acceptsAnswers: this.status === 'answering',
      officialAnswerCount: [...this.answers.values()].filter(a => a.role === 'official').length,
      spectatorAnswerCount: [...this.answers.values()].filter(a => a.role === 'spectator').length,
      answerRecords: [...this.answers.values()],
      correctAnswer: reveal && this.round ? `option-${this.round.correctOptionNumber}` as `option-${1|2|3|4}` : null,
      correctOfficialCount: this.correctOfficialCount,
      correctSpectatorCount: this.correctSpectatorCount,
      hasRound: Boolean(this.round),
      questionId: item?.id ?? null,
      questionCategory: 'games',
      questionDifficulty: item?.difficulty ?? null,
      questionBankStats: {
        totalQuestions: bank.length,
        tourUsedQuestions: this.tourUsedIds.size,
        tourUsedSimilarityGroups: this.tourUsedIds.size,
        sessionUsedQuestions: this.sessionUsedIds.size,
        sessionUsedSimilarityGroups: this.sessionUsedIds.size,
      },
      visualGuess: this.round ? {
        mode: item!.mode,
        imageUrl: `./assets/game/runtime/minigames/visual-guess/${item!.id}.jpg`,
        fallbackImageUrl: item!.imageUrl,
        focus: item!.focus ?? { x: 50, y: 40 },
        titleMask: item!.titleMask ?? null,
        choices: this.round.choices.map(choice => ({
          ...choice, label: bank.find(q => q.id === choice.value)?.name[locale] ?? choice.label,
        })),
        correctOptionNumber: reveal ? this.round.correctOptionNumber : null,
        correctLabel: reveal ? item!.name[locale] : null,
      } : null,
    };
  }
}
function seededRandom(seed: number) {
  let state = seed >>> 0;
  return () => ((state = (Math.imul(state, 1664525) + 1013904223) >>> 0) / 0x1_0000_0000);
}
function shuffle<T>(items: readonly T[], random: () => number): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function getVisualGuessModes(gameId: VisualGuessGameId): readonly VisualGuessMode[] { return MODES[gameId]; }
