import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import type { MiniGameSnapshot } from '../../../../game-core/minigames/minigame-types';
import type { TourPhase } from '../../../../game-core/tours/tour-types';
import { useGame } from '../../../context/GameContext';
import { QuestionScreenShell } from '../shared/question-shell';
import { getPosterBlurPx, getPosterRevealProgress } from './poster-reveal-curve';
import { getSpotlightPoint, puzzleOrder, type PosterRevealMode } from '../../../../game-core/minigames/visual-guess/poster-mystery';
import { visibleQuoteWordCount } from './quote-display-policy';
import movieMediaFallbacks from '../../../../game-core/minigames/visual-guess/media-fallbacks.generated.json';

/** Bundled directly into the renderer, so a stale/copy-incomplete public folder
 * does not turn a valid question into the 'image unavailable' screen.
 * Entries are generated from the user's real local movie images, never invented.
 */
function fallbackMovieImage(url: string): string | null {
  const pathPart = url.split('?')[0]?.split('#')[0] ?? '';
  const key = pathPart.includes('/visual-guess/') ? pathPart.split('/visual-guess/').pop() : null;
  if (!key || !/^(Posters|Frame)\/[\w.-]+\.(jpg|jpeg|png|webp|avif)$/i.test(key)) return null;
  return (movieMediaFallbacks.assets as Record<string, { dataUrl: string }>)[key]?.dataUrl ?? null;
}

const MOVIE_CLUE_LABELS = {
  frame: { ar: 'لقطة من الفيلم', en: 'MOVIE FRAME' },
  quote: { ar: 'جملة من فيلم', en: 'MOVIE QUOTE' },
};

const MODE_LABELS = {
  poster: { ar: 'بوستر', en: 'POSTER' },
  scene: { ar: 'مشهد', en: 'SCENE' },
  eyes: { ar: 'العيون', en: 'EYES' },
  silhouette: { ar: 'الظل', en: 'SHADOW' },
  zoom: { ar: 'تكبير', en: 'ZOOM' },
  reveal: { ar: 'كشف تدريجي', en: 'REVEAL' },
} as const;

const POSTER_VARIANT_LABELS: Record<PosterRevealMode, { ar: string; en: string }> = {
  blur: { ar: 'بوستر غامض', en: 'MYSTERY POSTER' },
  zoom: { ar: 'جزء من الصورة', en: 'MYSTERY ZOOM' },
  spotlight: { ar: 'كشاف', en: 'SPOTLIGHT' },
  puzzle: { ar: 'قطع البوستر', en: 'PUZZLE' },
  color: { ar: 'اللون المخفي', en: 'COLOR MYSTERY' },
};
/** Two public minigames, one shared UI. Never put the answer in alt text or UI captions. */
export function VisualGuessScreen({ miniGame, tourPhase }: { miniGame: MiniGameSnapshot; tourPhase: TourPhase }) {
  const { snapshot } = useGame();
  const data = miniGame.visualGuess;
  const [imageError, setImageError] = useState(false);
  const [useRemoteMedia, setUseRemoteMedia] = useState(false);
  const [useBundledFallback, setUseBundledFallback] = useState(false);
  const [clock, setClock] = useState(() => Date.now());
  const showingResult = tourPhase === 'scoring';

  useEffect(() => { setImageError(false); setUseRemoteMedia(false); setUseBundledFallback(false); }, [data?.imageUrl]);
  useEffect(() => {
    if (!data || !['reveal', 'poster'].includes(data.mode) || tourPhase !== 'answer_window_open') return undefined;
    const id = window.setInterval(() => setClock(Date.now()), 100);
    return () => window.clearInterval(id);
  }, [data?.imageUrl, data?.mode, tourPhase]);

  const revealDuration = Math.max(1, snapshot.tour.phaseDurationMs);
  // phaseEndsAt (rather than phaseStartedAt) honors pause/resume without the
  // poster continuing to unblur while the host pauses the round.
  const remainingMs = snapshot.tour.isPaused
    ? snapshot.tour.phaseRemainingMs
    : snapshot.tour.phaseEndsAt !== null
      ? Math.max(0, snapshot.tour.phaseEndsAt - clock)
      : revealDuration;
  const revealProgress = showingResult ? 1
    : tourPhase === 'answer_window_open'
      ? Math.min(1, Math.max(0, 1 - remainingMs / revealDuration))
      : 0;
  const revealedTiles = Math.floor(revealProgress * 24);
  const posterBlur = getPosterBlurPx(
    revealDuration,
    remainingMs,
    miniGame.id === 'guess-movie' ? miniGame.questionDifficulty : null,
  );
  const posterProgress = showingResult ? 1
    : tourPhase === 'answer_window_open'
      ? getPosterRevealProgress(revealDuration, remainingMs, miniGame.questionDifficulty)
      : 0;
  const tileOrder = useMemo(() => {
    // Deterministic across renders, no flicker whenever the scoreboard snapshot updates.
    const keyed = Array.from({ length: 24 }, (_, index) => index);
    return keyed.map((index) => ({ index, order: (index * 13 + 7) % 24 }));
  }, []);

  if (!data) return null;
  const isAr = snapshot.locale === 'ar';
  const movieKind = miniGame.id === 'guess-movie' ? data.movieClueKind ?? 'poster' : null;
  const embeddedImage = miniGame.id === 'guess-movie' && data.imageUrl
    ? fallbackMovieImage(data.imageUrl) : null;
  const displayedImageUrl = useBundledFallback && embeddedImage ? embeddedImage
    : useRemoteMedia ? data.fallbackImageUrl : data.imageUrl;
  const modeText = (movieKind === 'quote' && data.movieQuoteMode === 'complete'
    ? { ar: 'كمّل الجملة', en: 'COMPLETE THE LINE' }
    : movieKind === 'quote' && data.movieQuoteMode === 'speaker'
      ? { ar: 'مين قالها؟', en: 'WHO SAID IT?' }
      : movieKind === 'frame' || movieKind === 'quote'
    ? MOVIE_CLUE_LABELS[movieKind]
    : miniGame.id === 'guess-movie' ? POSTER_VARIANT_LABELS[data.posterReveal?.mode ?? 'blur']
    : MODE_LABELS[data.mode])[isAr ? 'ar' : 'en'];
  const focus = data.focus;
  const isPortrait = miniGame.id === 'guess-star';
  const isPoster = data.mode === 'poster' && movieKind === 'poster';
  const isFrame = movieKind === 'frame';
  const isMovieQuote = movieKind === 'quote';
  const isQuoteText = isMovieQuote && Boolean(data.movieQuoteText) && !data.imageUrl;
  const isEyes = data.mode === 'eyes';
  const isZoom = data.mode === 'zoom';
  const posterPlan = isPoster ? data.posterReveal : null;
  const quoteWords = isQuoteText ? (data.movieQuoteText ?? '').trim().split(/\s+/) : [];
  const startingShare = miniGame.questionDifficulty === 'easy' ? .35 : miniGame.questionDifficulty === 'hard' ? .13 : .24;
  // A quote used to identify a speaker or complete an ending is fully readable
  // immediately; only "Which film?" keeps the gradual word reveal.
  const quoteVisibleWords = visibleQuoteWordCount(
    data.movieQuoteMode, quoteWords.length, startingShare, posterProgress, showingResult, remainingMs, tourPhase,
  );
  const visibleQuote = quoteWords.slice(0, quoteVisibleWords).join(' ');
  // Quotes may reveal gradually only in movie-identification mode; frames stay crisp.
  const quoteImageBlur = showingResult || (tourPhase === 'answer_window_open' && remainingMs <= 1000)
    ? 0 : getPosterBlurPx(revealDuration, remainingMs, miniGame.questionDifficulty);
  const posterMode = posterPlan?.mode ?? 'blur';
  const posterFinished = showingResult || (tourPhase === 'answer_window_open' && remainingMs <= 1000);
  const posterMysteryActive = isPoster && !posterFinished;
  const spotlightPoint = posterPlan ? getSpotlightPoint(posterPlan, posterProgress) : { x: 50, y: 50 };
  const order = posterPlan ? puzzleOrder(posterPlan.pattern) : [];
  const puzzleVisibleCount = Math.min(9, 2 + Math.floor(posterProgress * 7));
  const posterStartScale = miniGame.questionDifficulty === 'easy' ? 2.3 : miniGame.questionDifficulty === 'hard' ? 3.15 : 2.75;
  const imageClass = `v36-visual-image v36-visual-image-${data.mode}`;
  const imageStyle: CSSProperties = isZoom
    ? { objectPosition: `${focus.x}% ${focus.y}%`, transform: `scale(2.15)`, transformOrigin: `${focus.x}% ${focus.y}%` }
    : { objectPosition: `${focus.x}% ${focus.y}%` };
  let posterImageStyle: CSSProperties = { objectPosition: 'center' };
  if (posterMysteryActive) {
    if (posterMode === 'blur') {
      posterImageStyle = { filter: posterBlur > 0 ? `blur(${posterBlur.toFixed(2)}px)` : 'none' };
    } else if (posterMode === 'zoom') {
      const scale = 1 + (posterStartScale - 1) * (1 - posterProgress);
      posterImageStyle = {
        transform: `scale(${scale.toFixed(3)})`, transformOrigin: `${posterPlan?.focus.x ?? 50}% ${posterPlan?.focus.y ?? 50}%`,
        filter: `blur(${(3 * (1 - posterProgress)).toFixed(2)}px)`,
      };
    } else if (posterMode === 'spotlight') {
      posterImageStyle = {
        filter: `brightness(${(.32 + .55 * posterProgress).toFixed(3)}) blur(${(16 * (1 - posterProgress)).toFixed(2)}px)`,
      };
    } else if (posterMode === 'color') {
      posterImageStyle = {
        filter: `grayscale(${(1 - posterProgress).toFixed(3)}) blur(${(15 * (1 - posterProgress)).toFixed(2)}px) contrast(1.1)`,
      };
    }
  }

  // Long Egyptian movie titles and dialogue endings need larger cards and
  // smaller type, without truncating their answer text.
  const longestChoice = Math.max(0, ...data.choices.map(choice => Array.from(choice.label).length));
  const answerSizeClass = longestChoice > 45 ? 'v61-visual-answers-xl'
    : longestChoice > 25 ? 'v61-visual-answers-long' : 'v61-visual-answers-normal';

  return <QuestionScreenShell
    miniGame={miniGame}
    tourPhase={tourPhase}
    helperText=""
    choices={data.choices.map(c => ({ command: c.command, label: c.label, tone: 'cyan' as const }))}
    layout="choice"
    shellClassName={`v36-visual-shell ${answerSizeClass} ${data.movieQuoteMode === 'complete' ? 'v54-quote-complete-shell' : ''}`}
    bodyClassName="v36-visual-body"
  >
    <div className={`v36-visual-stage v36-visual-stage-${data.mode} ${showingResult ? 'v36-visual-revealed' : ''}`}>
      <div className={`v36-visual-frame ${isPoster ? 'v36-visual-frame-poster' : ''} ${isPortrait ? 'v36-visual-frame-portrait' : ''} ${isFrame || isMovieQuote ? 'v53-movie-wide-frame' : ''} ${isQuoteText ? 'v53-movie-text-frame' : ''}`}
        style={isPoster && (data.posterAspectRatio ?? 0) > 1 ? { width: 'min(100%, 850px)' } : undefined}>
        <div className={`v36-visual-canvas ${isEyes && !showingResult ? 'v44-eyes-crop' : ''} ${isPoster ? 'v49-poster-canvas' : ''} ${isQuoteText ? 'v53-movie-quote-canvas' : ''}`}
          style={isPoster ? { '--poster-aspect': String(data.posterAspectRatio ?? 2 / 3) } as CSSProperties : undefined}>
          {isQuoteText ? <div className="v53-movie-quote" lang={isAr ? 'ar' : 'en'} dir={isAr ? 'rtl' : 'ltr'}>
            <span className="v53-movie-quote-glyph" aria-hidden="true">❝</span>
            <p>{visibleQuote}{quoteVisibleWords < quoteWords.length ? <span className="v53-movie-quote-cursor" aria-hidden="true">…</span> : null}
              {data.movieQuoteMode === 'complete' ? <span className="v54-quote-missing" aria-label={isAr ? 'الجزء الناقص' : 'Missing ending'}>
                {showingResult && data.movieQuoteCompletionAnswer ? ` ${data.movieQuoteCompletionAnswer}` : ' ____'}
              </span> : null}
            </p>
          </div> : !imageError ? <img
            src={displayedImageUrl}
            className={imageClass}
            alt={isAr ? 'صورة تحدي من غير الكشف عن الإجابة' : 'Mystery picture clue'}
            draggable={false}
            loading="eager"
            style={isPoster ? posterImageStyle : isFrame ? { filter: 'none' }
              : isMovieQuote ? { filter: quoteImageBlur > 0 ? `blur(${quoteImageBlur.toFixed(2)}px)` : 'none' } : showingResult && isZoom
              ? { objectPosition: `${focus.x}% ${focus.y}%` } : imageStyle}
            onError={() => {
              // A missing dist/ asset or old build must never spoil a movie round:
              // first recover the exact same poster/frame from the renderer bundle.
              console.warn('[VisualGuess] Image failed:', { gameId: miniGame.id, clueKind: movieKind,
                url: useBundledFallback ? '[embedded offline fallback]' : displayedImageUrl });
              if (!useBundledFallback && embeddedImage) setUseBundledFallback(true);
              else if (!useRemoteMedia && !useBundledFallback && data.fallbackImageUrl && data.fallbackImageUrl !== data.imageUrl) setUseRemoteMedia(true);
              else setImageError(true);
            }}
          /> : <div role="status" className="v36-visual-media-error">
            <b aria-hidden="true">⚠</b>
            <span>{isAr ? (miniGame.id === 'guess-star' ? 'صورة النجم مش متاحة — محتاجة صورة محلية أو إنترنت' : 'صورة الفيلم مش موجودة في نسخة اللعبة') : (miniGame.id === 'guess-star' ? 'Star photo unavailable (local file / internet)' : 'Movie image missing from this game build')}</span>
          </div>}
          {posterMysteryActive && posterMode === 'spotlight' && !imageError && posterPlan ? (
            <img src={displayedImageUrl}
              alt="" aria-hidden="true" draggable={false}
              className="v36-visual-image v52-poster-spotlight-image"
              style={{ clipPath: `circle(${(17 + 128 * posterProgress).toFixed(2)}% at ${spotlightPoint.x.toFixed(2)}% ${spotlightPoint.y.toFixed(2)}%)` }} />
          ) : null}
          {posterMysteryActive && posterMode === 'puzzle' && !imageError && posterPlan ? (
            <div className="v52-poster-puzzle-tiles" aria-hidden="true">
              {Array.from({ length: 9 }, (_, region) => <span key={region}
                className={order.indexOf(region) < puzzleVisibleCount ? 'v52-poster-puzzle-tile-clear' : ''} />)}
            </div>
          ) : null}
          {data.mode === 'reveal' && !isFrame && !showingResult && !imageError ? (
            <div className="v36-visual-reveal-grid" aria-hidden="true">
              {tileOrder.map(({ index, order }) => <span
                key={index}
                className={order < revealedTiles ? 'v36-visual-tile-gone' : ''}
              />)}
            </div>
          ) : null}
        </div>
      </div>
      <span className="v36-visual-mode-badge">{modeText}</span>
    </div>
  </QuestionScreenShell>;
}

