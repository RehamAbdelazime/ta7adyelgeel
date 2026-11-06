/**
 * Shared visual-choice engine for Guess the Movie and Guess the Star.
 * The clue is always an image, while the four answer options use the same
 * Twitch/host commands, scoring policy and tour phases as the existing games.
 * Media and attribution data are authored outside TS; neither game hardcodes a
 * copyrighted image into its UI or silently substitutes a fake celebrity.
 */
import rawBank from './visual-guess-questions.json';
import rawPosterProfiles from './poster-visual-profiles-v50.json';
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
  asset?: string;
  mode: VisualGuessMode;
  difficulty: QuestionDifficulty;
  category: string;
  focus?: { x: number; y: number };
  titleMask?: { x: number; y: number; w: number; h: number };
  titleMasks?: { x: number; y: number; w: number; h: number }[];
  posterAspectRatio?: number;
  distractorIds?: string[];
  mediaApproval?: string;
  attribution: { source: string; license: string };
};
type ActiveRound = { item: ImageItem; choices: VisualGuessChoice[]; correctOptionNumber: number };
const BANK = rawBank as { movies: ImageItem[]; stars: ImageItem[]; movieChoiceCatalog?: Record<string, I18n> };
const MODES: Record<VisualGuessGameId, VisualGuessMode[]> = {
  'guess-movie': ['poster'],
  'guess-star': ['eyes', 'silhouette', 'zoom', 'reveal'],
};
const ROUND_DIFFICULTIES: QuestionDifficulty[] = ['easy', 'medium', 'hard', 'hard'];
const ROUND_MODES: Record<VisualGuessGameId, VisualGuessMode[]> = {
  'guess-movie': ['poster', 'poster', 'poster', 'poster'],
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
    // A locally imported, permission-cleared photo is playable even if it had no remote URL.
    const bank = getVisualGuessBank(this.gameId).filter(item => item.imageUrl.length > 0 || item.mediaApproval === 'user_supplied_local_rights_unverified' || item.mediaApproval === 'user_supplied_with_permission');
    if (bank.length < 4) throw new Error(`${this.gameId} needs at least four valid image entries`);

    // A predictable mode cadence guarantees that each variant actually gets played.
    // Avoid repeated photos across a tour, then a session, until the pack is exhausted.
    const scheduledMode = ROUND_MODES[this.gameId][(roundNumber - 1) % ROUND_MODES[this.gameId].length];
    const targetDifficulty = ROUND_DIFFICULTIES[(roundNumber - 1) % ROUND_DIFFICULTIES.length];
    const eligible = bank.filter(item => item.mode === scheduledMode && item.difficulty === targetDifficulty);
    const difficultyOnly = bank.filter(item => item.difficulty === targetDifficulty);
    // Difficulty cannot be reduced just because a mode had fewer available photos.
    // Only reset the non-repeating pools when a complete pack has been exhausted.
    const selectFresh = (candidates: readonly ImageItem[]) =>
      candidates.filter(item => !this.tourUsedIds.has(item.id) && !this.sessionUsedIds.has(item.id));
    const selectTourFresh = (candidates: readonly ImageItem[]) =>
      candidates.filter(item => !this.tourUsedIds.has(item.id));
    const groups = [
      selectFresh(eligible), selectTourFresh(eligible),
      selectFresh(difficultyOnly), selectTourFresh(difficultyOnly),
      eligible, difficultyOnly,
    ];
    const pool = groups.find(items => items.length > 0) ?? bank;
    const rng = seededRandom(seed + roundNumber * 811 + this.sessionUsedIds.size * 2713);
    const item = pool[Math.floor(rng() * pool.length)];
    if (!item) throw new Error(`${this.gameId} has no playable media content`);

    // V50: choose cinematic lookalikes using real local-poster color samples,
    // actor composition and editorial Egyptian-audience familiarity. Difficulty
    // controls HOW misleading the three options are, not just the poster.
    // The separate Guess the Star generator stays untouched.
    const distractors = this.gameId === 'guess-movie'
      ? selectEgyptianMovieDistractors(item, bank, rng)
      : pickGenericDistractors(item, bank, rng);
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
        imageUrl: `./assets/game/runtime/minigames/visual-guess/${item!.asset ?? `${item!.id}.jpg`}`,
        fallbackImageUrl: item!.imageUrl,
        focus: item!.focus ?? { x: 50, y: 40 },
        titleMask: item!.titleMask ?? null,
        titleMasks: item!.titleMasks ?? (item!.titleMask ? [item!.titleMask] : []),
        posterAspectRatio: item!.posterAspectRatio ?? null,
        choices: this.round.choices.map(choice => ({
          ...choice,
          label: bank.find(q => q.id === choice.value)?.name[locale]
            ?? BANK.movieChoiceCatalog?.[choice.value]?.[locale]
            ?? choice.label,
        })),
        correctOptionNumber: reveal ? this.round.correctOptionNumber : null,
        correctLabel: reveal ? item!.name[locale] : null,
      } : null,
    };
  }
}
type ChoiceCandidate = { id: string; name: I18n };
function pickGenericDistractors(item: ImageItem, bank: readonly ImageItem[], rng: () => number): ChoiceCandidate[] {
  const other = bank.filter(q => q.id !== item.id);
  return [
    ...shuffle(other.filter(q => q.category === item.category), rng),
    ...shuffle(other.filter(q => q.category !== item.category), rng),
  ].slice(0, 3);
}
/**
 * Poster similarity never comes from generic movie genres alone: the 50-image
 * visual pack was reviewed for the number/placement of actors. Its 3x3 spatial
 * colors were calculated from the user's actual local images, not internet art.
 *
 * Difficulty strategy:
 *   easy   = 2 culturally plausible + 1 modest visual lookalike;
 *   medium = 2 strong visual lookalikes + 1 familiar cinematic association;
 *   hard   = 3 close visual lookalikes (colors/actor layout), with shuffled order.
 * Only the image serving as the question needs a poster; written options may
 * include famous catalog titles for which no image has been supplied.
 */
type PosterVisualProfile = {
  castLayout: string;
  heroPlacement: string;
  paletteLabel: string;
  posterPaletteRGB: number[];
  spatialPaletteRGB: number[][];
  visualNearIds: string[];
};
const POSTER_VISUAL_PROFILES = (rawPosterProfiles as { profiles: Record<string, PosterVisualProfile> }).profiles;

function spatialPaletteSimilarity(a: PosterVisualProfile, b: PosterVisualProfile): number {
  let similarity = 0;
  // Same-position colors matter: a blue sky above two figures is a stronger
  // visual match than an unrelated blue detail in the bottom-left corner.
  for (let region = 0; region < 9; region++) {
    const left = a.spatialPaletteRGB[region];
    const right = b.spatialPaletteRGB[region];
    if (!left || !right) continue;
    const channelDiff = Math.hypot(left[0] - right[0], left[1] - right[1], left[2] - right[2]);
    similarity += Math.max(0, 1 - channelDiff / (Math.sqrt(3) * 255));
  }
  return similarity / 9;
}

function selectEgyptianMovieDistractors(item: ImageItem, bank: readonly ImageItem[], rng: () => number): ChoiceCandidate[] {
  const catalog = new Map<string, ChoiceCandidate>(bank.map(({ id, name }) => [id, { id, name }]));
  for (const [id, name] of Object.entries(BANK.movieChoiceCatalog ?? {})) catalog.set(id, { id, name });
  const profile = POSTER_VISUAL_PROFILES[item.id];
  if (!profile) throw new Error(`Poster ${item.id} is missing its verified visual profile`);

  const culturalIds = item.distractorIds ?? [];
  const visualIds = profile.visualNearIds;
  const visualScores = visualIds.map((id, index) => {
    const near = POSTER_VISUAL_PROFILES[id];
    if (!near || !catalog.has(id)) throw new Error(`Poster ${item.id}: unknown visual match ${id}`);
    const color = spatialPaletteSimilarity(profile, near);
    const composition = near.castLayout === profile.castLayout ? 1 : 0;
    const placement = near.heroPlacement === profile.heroPlacement ? 1 : 0;
    const culturalIndex = culturalIds.indexOf(id);
    // Manual visual-neighbor shortlist is a gate, not an autopicked 50-film
    // color sort. It ensures options are recognizable and plausibly related.
    const score = (5 - index) * 1.5 + color * 3 + composition * 2 + placement
      + (culturalIndex >= 0 ? (5 - culturalIndex) * 0.35 : 0);
    return { id, score };
  }).sort((a, b) => b.score - a.score);

  const used = new Set<string>([item.id]);
  const labels = new Set<string>([normalizeMovieTitle(item.name.ar)]);
  const result: ChoiceCandidate[] = [];
  const useCandidate = (id: string): boolean => {
    const candidate = catalog.get(id);
    if (!candidate) return false;
    const normalized = normalizeMovieTitle(candidate.name.ar);
    if (used.has(id) || labels.has(normalized)) return false;
    used.add(id); labels.add(normalized); result.push(candidate);
    return true;
  };

  // Rank weights are intentionally probabilistic: seeded gameplay varies, but
  // easy still favors accessible recognition and hard stays genuinely visual.
  const pickOne = (candidates: { id: string; weight: number }[]) => {
    const possible = candidates.filter(c => !used.has(c.id) && catalog.has(c.id));
    if (!possible.length) return false;
    const total = possible.reduce((sum, c) => sum + Math.max(0.01, c.weight), 0);
    let sample = rng() * total;
    for (const c of possible) {
      sample -= Math.max(0.01, c.weight);
      if (sample < 0) return useCandidate(c.id);
    }
    return useCandidate(possible[possible.length - 1].id);
  };
  const cultural = culturalIds.map((id, index) => ({ id, weight: 6 - index }));
  const visual = visualScores.map(({ id, score }, index) => ({ id, weight: Math.max(0.5, score) ** 2 / (1 + index * 0.25) }));

  if (item.difficulty === 'easy') {
    // One color/layout-based decoy, but the other two are familiar cinematic
    // associations; intentionally avoid stacking three near-identical posters.
    pickOne(visual.filter(c => visualScores.findIndex(v => v.id === c.id) >= 2));
    pickOne(cultural);
    pickOne(cultural);
  } else if (item.difficulty === 'medium') {
    pickOne(visual);
    pickOne(visual);
    pickOne(cultural);
  } else {
    // Hard: at least three visually grounded (color AND actor positioning)
    // decoys, with one rank-weighted random combination per game seed.
    pickOne(visual);
    pickOne(visual);
    pickOne(visual);
  }

  // Closed editorial pool fallback, never generic Egyptian random movie names.
  for (const id of [...visualScores.map(c => c.id), ...culturalIds]) {
    if (result.length === 3) break;
    useCandidate(id);
  }
  if (result.length !== 3) throw new Error(`Poster ${item.id} is missing three high-quality movie distractors`);
  return result;
}
function normalizeMovieTitle(value: string): string {
  return value.normalize('NFKC').replace(/[\u064B-\u065F\u0670]/g, '')
    .replace(/[إأآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه')
    .replace(/[^\p{L}\p{N}]/gu, '').toLocaleLowerCase();
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
