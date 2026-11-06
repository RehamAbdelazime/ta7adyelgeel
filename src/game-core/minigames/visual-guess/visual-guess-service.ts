/**
 * Shared visual-choice engine for Guess the Movie and Guess the Star.
 * The clue may be a poster, movie frame, or dialogue prompt; the four answer options use the same
 * Twitch/host commands, scoring policy and tour phases as the existing games.
 * Media and attribution data are authored outside TS; neither game hardcodes a
 * copyrighted image into its UI or silently substitutes a fake celebrity.
 */
import rawBank from './visual-guess-questions.json';
import rawPosterProfiles from './poster-visual-profiles-v50.json';
import rawMovieClues from './movie-clues.generated.json';
import { planPosterReveal, type PosterRevealPlan } from './poster-mystery';
import { chooseQuoteWrongAnswers, choiceHistoryKey, readQuoteChoiceHistory, rememberQuoteChoice, shuffleQuoteAnswerPositions, type QuoteChoiceHistory } from './quote-choice-rotation';
import { browserPosterStorage, emptyPosterHistory, readPosterHistory, rememberPosterPlay, type PosterHistory, type PosterHistoryStorage } from './poster-history';
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
export type MovieClueKind = 'poster' | 'frame' | 'quote';
export type QuoteChallengeMode = 'movie' | 'complete' | 'speaker';
type QuoteOptionSet = { answer: I18n; wrong: I18n[] };
type MovieClue = {
  id: string; movieId: string; kind: MovieClueKind; asset: string; text: I18n | null;
  completion?: QuoteOptionSet & { prompt: I18n };
  speaker?: QuoteOptionSet & { role: 'actor' | 'character' };
};
type MovieRoundVariant = 'poster' | 'frame' | 'quote-movie' | 'quote-complete' | 'quote-speaker';
function clueVariants(clue: MovieClue): MovieRoundVariant[] {
  if (clue.kind !== 'quote') return [clue.kind];
  const modes: MovieRoundVariant[] = [];
  if (clue.completion) modes.push('quote-complete');
  if (clue.speaker) modes.push('quote-speaker');
  return modes.length ? modes : ['quote-movie'];
}
const variantKind = (variant: MovieRoundVariant): MovieClueKind =>
  variant.startsWith('quote-') ? 'quote' : variant as MovieClueKind;
const MOVIE_EXTRA_CLUES = (rawMovieClues as { clues: MovieClue[] }).clues;
// Index the generated catalog once. Refiltering every clue for every candidate
// grew quadratically as the user added real Quotes and Frames.
const MOVIE_EXTRA_CLUES_BY_FILM = new Map<string, MovieClue[]>();
for (const clue of MOVIE_EXTRA_CLUES) {
  const forFilm = MOVIE_EXTRA_CLUES_BY_FILM.get(clue.movieId);
  if (forFilm) forFilm.push(clue);
  else MOVIE_EXTRA_CLUES_BY_FILM.set(clue.movieId, [clue]);
}
const MOVIE_CLUES_CACHE = new Map<string, readonly MovieClue[]>();
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
type ActiveRound = {
  item: ImageItem; choices: VisualGuessChoice[]; correctOptionNumber: number; correctValue: string;
  posterReveal?: PosterRevealPlan; movieClue?: MovieClue;
  quoteMode?: QuoteChallengeMode; localizedChoiceLabels?: Record<string, I18n>;
};
function movieCluesFor(item: ImageItem): readonly MovieClue[] {
  const existing = MOVIE_CLUES_CACHE.get(item.id);
  if (existing) return existing;
  const clues: MovieClue[] = [
    ...(item.asset?.startsWith('Posters/') ? [{ id: `poster:${item.id}`, movieId: item.id, kind: 'poster' as const, asset: item.asset, text: null }] : []),
    ...(MOVIE_EXTRA_CLUES_BY_FILM.get(item.id) ?? []),
  ];
  MOVIE_CLUES_CACHE.set(item.id, clues);
  return clues;
}
function pickMovieClue(item: ImageItem, variant: MovieRoundVariant, priorId: string | undefined, rng: () => number): MovieClue {
  const clues = movieCluesFor(item).filter(clue => clueVariants(clue).includes(variant));
  const fresh = clues.filter(clue => `${clue.id}#${variant}` !== priorId);
  const pool = fresh.length ? fresh : clues;
  return pool[Math.floor(rng() * pool.length)];
}

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
  private readonly tourClueKindCounts: Record<MovieClueKind, number> = { poster: 0, frame: 0, quote: 0 };
  private lastMovieVariant: MovieRoundVariant | null = null;
  private readonly tourVariantCounts: Record<MovieRoundVariant, number> = {
    poster: 0, frame: 0, 'quote-movie': 0, 'quote-complete': 0, 'quote-speaker': 0,
  };
  private correctOfficialCount = 0;
  private correctSpectatorCount = 0;
  private scored = false;
  private readonly posterHistory: PosterHistory;
  private readonly quoteChoiceHistory: QuoteChoiceHistory;

  constructor(readonly gameId: VisualGuessGameId, private readonly historyStorage: PosterHistoryStorage | null = browserPosterStorage()) {
    this.posterHistory = gameId === 'guess-movie' ? readPosterHistory(historyStorage) : emptyPosterHistory();
    this.quoteChoiceHistory = gameId === 'guess-movie' ? readQuoteChoiceHistory(historyStorage) : {};
  }

  beginTour(): void { this.tourUsedIds.clear(); this.tourClueKindCounts.poster = 0; this.tourClueKindCounts.frame = 0; this.tourClueKindCounts.quote = 0; this.lastMovieVariant = null; for (const key of Object.keys(this.tourVariantCounts) as MovieRoundVariant[]) this.tourVariantCounts[key] = 0; this.clearActiveRound(); }
  startRound(roundNumber: number, seed = Date.now()): void {
    this.roundNumber = roundNumber;
    this.answers.clear();
    this.correctOfficialCount = 0;
    this.correctSpectatorCount = 0;
    this.scored = false;
    // A locally imported, permission-cleared photo is playable even if it had no remote URL.
    const bank = getVisualGuessBank(this.gameId).filter(item => this.gameId === 'guess-movie'
      ? movieCluesFor(item).length > 0
      : item.imageUrl.length > 0 || item.mediaApproval === 'user_supplied_local_rights_unverified' || item.mediaApproval === 'user_supplied_with_permission');
    if (bank.length < 4) throw new Error(`${this.gameId} needs at least four valid image entries`);

    // A predictable mode cadence guarantees that each variant actually gets played.
    // Avoid repeated photos across a tour, then a session, until the pack is exhausted.
    const scheduledMode = ROUND_MODES[this.gameId][(roundNumber - 1) % ROUND_MODES[this.gameId].length];
    const targetDifficulty = ROUND_DIFFICULTIES[(roundNumber - 1) % ROUND_DIFFICULTIES.length];
    const rng = seededRandom(seed + roundNumber * 811 + this.sessionUsedIds.size * 2713);
    let item: ImageItem;
    let chosenVariant: MovieRoundVariant = 'poster';
    let chosenClueKind: MovieClueKind = 'poster';
    if (this.gameId === 'guess-movie') {
      // V52: preserve each difficulty while prioritizing never-seen titles, even
      // after restarting Electron. Do not reuse any title within this tour until
      // its difficulty pack is completely exhausted.
      const candidates = bank.filter(q => q.difficulty === targetDifficulty);
      const tourFresh = candidates.filter(q => !this.tourUsedIds.has(q.id));
      const withoutTourRepeats = tourFresh.length ? tourFresh : candidates;
      const minPlays = Math.min(...withoutTourRepeats.map(q => this.posterHistory.entries[q.id]?.plays ?? 0));
      let fairPool = withoutTourRepeats.filter(q => (this.posterHistory.entries[q.id]?.plays ?? 0) === minPlays);
      // V54: treat Complete the Quote and Who Said It as two REAL random
      // question formats, alongside Poster, Frame, and legacy Movie Quote.
      // Only offer variants backed by user-supplied verified metadata.
      const availableVariants = (['poster','frame','quote-complete','quote-speaker','quote-movie'] as MovieRoundVariant[])
        .filter(variant => fairPool.some(film => movieCluesFor(film).some(clue => clueVariants(clue).includes(variant))));
      const weights = availableVariants.map(variant => {
        const kind = variantKind(variant);
        // A previously played movie should prefer a different clue format on replay.
        const repeatedInPool = fairPool.filter(film => this.posterHistory.entries[film.id]?.lastClueId?.endsWith(`#${variant}`)).length;
        const novelty = 1 - (repeatedInPool / fairPool.length) * .7;
        return novelty * (variant === this.lastMovieVariant ? .48 : 1)
          / (1 + this.tourVariantCounts[variant] * .7)
          / (1 + this.tourClueKindCounts[kind] * .25);
      });
      const randomWeight = rng() * weights.reduce((sum, weight) => sum + weight, 0);
      let cumulative = 0;
      chosenVariant = availableVariants.find((variant, index) => (cumulative += weights[index]) >= randomWeight)
        ?? availableVariants[availableVariants.length - 1];
      chosenClueKind = variantKind(chosenVariant);
      fairPool = fairPool.filter(film => movieCluesFor(film).some(clue => clueVariants(clue).includes(chosenVariant)));
      if (minPlays > 0) {
        const freshFormat = fairPool.filter(film => !this.posterHistory.entries[film.id]?.lastClueId?.endsWith(`#${chosenVariant}`));
        if (freshFormat.length) fairPool = freshFormat;
        // The oldest eligible films first, with varied order inside the oldest four.
        const recency = (q: ImageItem) => this.posterHistory.entries[q.id]?.lastPlayedSeq ?? 0;
        fairPool = fairPool.sort((a, b) => recency(a) - recency(b))
          .slice(0, Math.min(4, fairPool.length));
      }
      item = fairPool[Math.floor(rng() * fairPool.length)];
    } else {
      // Preserve Guess the Star's original mode cadence and session rotation.
      const eligible = bank.filter(q => q.mode === scheduledMode && q.difficulty === targetDifficulty);
      const difficultyOnly = bank.filter(q => q.difficulty === targetDifficulty);
      const selectFresh = (candidates: readonly ImageItem[]) =>
        candidates.filter(q => !this.tourUsedIds.has(q.id) && !this.sessionUsedIds.has(q.id));
      const selectTourFresh = (candidates: readonly ImageItem[]) =>
        candidates.filter(q => !this.tourUsedIds.has(q.id));
      const groups = [selectFresh(eligible), selectTourFresh(eligible),
        selectFresh(difficultyOnly), selectTourFresh(difficultyOnly), eligible, difficultyOnly];
      const pool = groups.find(items => items.length > 0) ?? bank;
      item = pool[Math.floor(rng() * pool.length)];
    }
    if (!item) throw new Error(`${this.gameId} has no playable media content`);

    // Pick the reveal variant BEFORE the distractors, so wrong answers can
    // resemble the first visible poster area (zoom, spotlight, puzzle, colour).
    const movieClue = this.gameId === 'guess-movie'
      ? pickMovieClue(item, chosenVariant, this.posterHistory.entries[item.id]?.lastClueId, rng) : undefined;
    const posterReveal = movieClue?.kind === 'poster'
      ? planPosterReveal(item.difficulty, seed + roundNumber * 911 + this.posterHistory.sequence * 41,
          this.posterHistory.entries[item.id], item.focus ?? { x: 50, y: 40 },
          item.titleMasks ?? (item.titleMask ? [item.titleMask] : []))
      : undefined;
    // V50: choose cinematic lookalikes using real local-poster color samples,
    // actor composition and editorial Egyptian-audience familiarity. Difficulty
    // controls HOW misleading the three options are, not just the poster.
    // The separate Guess the Star generator stays untouched.
    const quoteMode: QuoteChallengeMode | undefined = chosenClueKind !== 'quote' ? undefined
      : chosenVariant === 'quote-complete' ? 'complete'
      : chosenVariant === 'quote-speaker' ? 'speaker' : 'movie';
    const quoteAnswers = quoteMode === 'complete' ? movieClue?.completion
      : quoteMode === 'speaker' ? movieClue?.speaker : undefined;
    let correctValue = item.id;
    let localizedChoiceLabels: Record<string, I18n> | undefined;
    let choices: VisualGuessChoice[];
    if (quoteAnswers) {
      // V63: rotate the *actual wrong answers*, not merely their 1–4 positions.
      // Prefer plausible film/era peers for actors and hand-edited endings for
      // completions. The true speaker/ending always comes from the original
      // user quote; no invented attribution ever becomes the correct choice.
      correctValue = 'quote:correct';
      const context = {
        clueId: movieClue!.id, movieId: item.id,
        mode: quoteMode! as 'speaker' | 'complete',
        role: movieClue?.speaker?.role,
        difficulty: item.difficulty,
        correct: quoteAnswers.answer, authoredWrong: quoteAnswers.wrong,
      };
      const historyKey = choiceHistoryKey(context);
      const recent = this.quoteChoiceHistory[historyKey];
      const wrong = chooseQuoteWrongAnswers(context, rng, recent?.recent);
      localizedChoiceLabels = Object.fromEntries([quoteAnswers.answer, ...wrong]
        .map((name, index) => [index === 0 ? correctValue : `quote:wrong:${index}`, name]));
      choices = shuffleQuoteAnswerPositions(Object.entries(localizedChoiceLabels)
        .map(([value, name]) => ({ value, name })), rng, recent?.lastCorrectSlot)
        .map(({value, name}, index) => ({
          optionNumber: index + 1, command: `!${index + 1}`, label: name.en, value,
        }));
      rememberQuoteChoice(this.quoteChoiceHistory, this.historyStorage, historyKey,
        wrong, choices.find(choice => choice.value === correctValue)!.optionNumber);
    } else {
      const distractors = this.gameId === 'guess-movie'
        ? selectEgyptianMovieDistractors(item, bank, rng, posterReveal, chosenClueKind)
        : pickGenericDistractors(item, bank, rng);
      choices = shuffle([item, ...distractors], rng).map((entry, index) => ({
        optionNumber: index + 1, command: `!${index + 1}`, label: entry.name.en, value: entry.id,
      }));
    }
    const correctOptionNumber = choices.find(choice => choice.value === correctValue)?.optionNumber ?? 1;
    this.round = { item, choices, correctOptionNumber, correctValue, posterReveal, movieClue, quoteMode, localizedChoiceLabels };
    if (movieClue) {
      rememberPosterPlay(this.posterHistory, item.id, posterReveal ?? null, this.historyStorage, chosenClueKind, `${movieClue.id}#${chosenVariant}`);
      this.tourClueKindCounts[chosenClueKind]++;
      this.tourVariantCounts[chosenVariant]++;
      this.lastMovieVariant = chosenVariant;
    }
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
      role: citizen.role, answer, submittedAt: Date.now(), isCorrect: choice.value === this.round.correctValue,
    };
    this.answers.set(citizen.twitchUserId, record);
    return { ok: true, record };
  }
  resolveRound(): void {
    if (!this.round) return;
    this.correctOfficialCount = 0;
    this.correctSpectatorCount = 0;
    for (const [id, record] of this.answers) {
      const correct = this.round.choices.find(c => `option-${c.optionNumber}` === record.answer)?.value === this.round.correctValue;
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
  // Intentionally does NOT erase persistent poster history. Clear only this
  // runtime session; the player gets a fresher poster after relaunch too.
  clear(): void { this.clearActiveRound(); this.tourUsedIds.clear(); this.sessionUsedIds.clear(); this.lastMovieVariant = null; for (const key of Object.keys(this.tourVariantCounts) as MovieRoundVariant[]) this.tourVariantCounts[key] = 0; this.tourClueKindCounts.poster = 0; this.tourClueKindCounts.frame = 0; this.tourClueKindCounts.quote = 0; }
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
        ? (this.round?.quoteMode === 'complete'
            ? (locale === 'ar' ? 'كمّل الجملة' : 'COMPLETE THE LINE')
            : this.round?.quoteMode === 'speaker'
              ? this.round.movieClue?.speaker?.role === 'character'
                ? (locale === 'ar' ? 'أنهي شخصية قالت الجملة دي؟' : 'WHICH CHARACTER SAID THIS?')
                : (locale === 'ar' ? 'مين الممثل اللي قال الجملة دي؟' : 'WHICH ACTOR SAID THIS?')
              : this.round?.movieClue?.kind === 'quote'
                ? (locale === 'ar' ? 'الجملة دي من فيلم إيه؟' : 'WHICH MOVIE IS THIS LINE FROM?')
            : this.round?.movieClue?.kind === 'frame'
              ? (locale === 'ar' ? 'المشهد ده من فيلم إيه؟' : 'WHICH MOVIE IS THIS SCENE FROM?')
              : (locale === 'ar' ? 'الفيلم ده إيه؟' : 'WHICH MOVIE?'))
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
        imageUrl: this.round.movieClue
          ? (this.round.movieClue.asset ? `./assets/game/runtime/minigames/visual-guess/${this.round.movieClue.asset}` : '')
          : `./assets/game/runtime/minigames/visual-guess/${item!.asset ?? `${item!.id}.jpg`}`,
        movieClueKind: this.round.movieClue?.kind ?? null,
        movieQuoteMode: this.round.quoteMode ?? null,
        // Completion must not reveal its answer while the timer is running.
        movieQuoteText: this.round.quoteMode === 'complete'
          ? this.round.movieClue?.completion?.prompt[locale] ?? null
          : this.round.movieClue?.text?.[locale] ?? null,
        movieQuoteCompletionAnswer: reveal && this.round.quoteMode === 'complete'
          ? this.round.movieClue?.completion?.answer[locale] ?? null : null,
        // V56 compatibility: older installs kept posters at visual-guess/ root.
        // Prefer the V53 Posters/ layout, but still load the old local location
        // if the user moved photos before applying the matching source update.
        fallbackImageUrl: this.round.movieClue?.kind === 'poster'
          ? `./assets/game/runtime/minigames/visual-guess/${item!.id}.${(item!.asset ?? '').split('.').pop() || 'jpg'}`
          : this.round.movieClue ? '' : item!.imageUrl,
        focus: item!.focus ?? { x: 50, y: 40 },
        titleMask: item!.titleMask ?? null,
        titleMasks: item!.titleMasks ?? (item!.titleMask ? [item!.titleMask] : []),
        posterAspectRatio: item!.posterAspectRatio ?? null,
        posterReveal: this.round.posterReveal ?? null,
        choices: this.round.choices.map(choice => ({
          ...choice,
          label: this.round?.localizedChoiceLabels?.[choice.value]?.[locale]
            ?? bank.find(q => q.id === choice.value)?.name[locale]
            ?? BANK.movieChoiceCatalog?.[choice.value]?.[locale]
            ?? choice.label,
        })),
        correctOptionNumber: reveal ? this.round.correctOptionNumber : null,
        correctLabel: reveal ? this.round.localizedChoiceLabels?.[this.round.correctValue]?.[locale] ?? item!.name[locale] : null,
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
 * Poster similarity never comes from generic movie genres alone: the initial 50-image
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

function spatialPaletteSimilarity(a: PosterVisualProfile, b: PosterVisualProfile, regions: readonly number[], gray = false): number {
  let similarity = 0;
  // Same-position colors matter: a blue sky above two figures is a stronger
  // visual match than an unrelated blue detail in the bottom-left corner.
  for (const region of regions) {
    const left = a.spatialPaletteRGB[region];
    const right = b.spatialPaletteRGB[region];
    if (!left || !right) continue;
    // Grayscale clues should compare luminance, not colours players cannot see.
    const luminance = (rgb: number[]) => rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
    const difference = gray
      ? Math.abs(luminance(left) - luminance(right)) / 255
      : Math.hypot(left[0] - right[0], left[1] - right[1], left[2] - right[2]) / (Math.sqrt(3) * 255);
    similarity += Math.max(0, 1 - difference);
  }
  return similarity / Math.max(1, regions.length);
}

function selectEgyptianMovieDistractors(item: ImageItem, bank: readonly ImageItem[], rng: () => number, plan?: PosterRevealPlan, kind: MovieClueKind = 'poster'): ChoiceCandidate[] {
  const catalog = new Map<string, ChoiceCandidate>(bank.map(({ id, name }) => [id, { id, name }]));
  for (const [id, name] of Object.entries(BANK.movieChoiceCatalog ?? {})) catalog.set(id, { id, name });
  const profile = POSTER_VISUAL_PROFILES[item.id];
  if (!profile && kind === 'poster') throw new Error(`Poster ${item.id} is missing its verified visual profile`);

  const culturalIds = item.distractorIds ?? [];
  // A movie frame or a dialogue quote is NOT the movie's poster. Don't rank
  // distractors by unrelated poster colors; use the reviewed Egyptian-film
  // editorial relationships until actual frame metadata is supplied.
  if (kind !== 'poster') {
    const choices = culturalIds.map(id => catalog.get(id)).filter((c): c is ChoiceCandidate => Boolean(c));
    const unique = choices.filter((c, index) => choices.findIndex(x => normalizeMovieTitle(x.name.ar) === normalizeMovieTitle(c.name.ar)) === index);
    const sampled = kind === 'frame' && item.difficulty === 'hard' ? unique.slice(0, 4) : unique;
    return shuffle(sampled, rng).slice(0, 3);
  }
  if (!profile) throw new Error(`Poster ${item.id} is missing its verified visual profile`);
  const visualIds = profile.visualNearIds;
  const visualScores = visualIds.map((id, index) => {
    const near = POSTER_VISUAL_PROFILES[id];
    if (!near || !catalog.has(id)) throw new Error(`Poster ${item.id}: unknown visual match ${id}`);
    const regionClue = spatialPaletteSimilarity(profile, near, plan?.initialRegions ?? [0, 1, 2, 3, 4, 5, 6, 7, 8], plan?.mode === 'color');
    const wholePoster = spatialPaletteSimilarity(profile, near, [0, 1, 2, 3, 4, 5, 6, 7, 8]);
    const composition = near.castLayout === profile.castLayout ? 1 : 0;
    const placement = near.heroPlacement === profile.heroPlacement ? 1 : 0;
    const culturalIndex = culturalIds.indexOf(id);
    // Manual visual-neighbor shortlist is a gate, not an autopicked 50-film
    // color sort. It ensures options are recognizable and plausibly related.
    // The poster's FIRST visible clue is weighted more heavily than its
    // eventual full-poster palette, especially on Hard. An early zoom on a
    // turquoise corner should prefer other posters with turquoise THERE.
    const clueWeight = item.difficulty === 'hard' ? 8 : item.difficulty === 'medium' ? 6 : 3.5;
    const score = (5 - index) * .9 + regionClue * clueWeight + wholePoster * 1.5
      + composition * 2 + placement
      + (culturalIndex >= 0 ? (5 - culturalIndex) * .35 : 0);
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
