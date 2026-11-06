import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import type { MiniGameSnapshot } from '../../../../game-core/minigames/minigame-types';
import type { TourPhase } from '../../../../game-core/tours/tour-types';
import { useGame } from '../../../context/GameContext';
import { QuestionScreenShell } from '../shared/question-shell';
import { getPosterBlurPx, getPosterRevealProgress } from './poster-reveal-curve';
import { getSpotlightPoint, puzzleOrder, type PosterRevealMode } from '../../../../game-core/minigames/visual-guess/poster-mystery';

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
  const [clock, setClock] = useState(() => Date.now());
  const showingResult = tourPhase === 'scoring';

  useEffect(() => { setImageError(false); setUseRemoteMedia(false); }, [data?.imageUrl]);
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
  const modeText = (miniGame.id === 'guess-movie'
    ? POSTER_VARIANT_LABELS[data.posterReveal?.mode ?? 'blur']
    : MODE_LABELS[data.mode])[isAr ? 'ar' : 'en'];
  const focus = data.focus;
  const isPortrait = miniGame.id === 'guess-star';
  const isPoster = data.mode === 'poster';
  const isEyes = data.mode === 'eyes';
  const isZoom = data.mode === 'zoom';
  const posterPlan = isPoster ? data.posterReveal : null;
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

  return <QuestionScreenShell
    miniGame={miniGame}
    tourPhase={tourPhase}
    helperText=""
    choices={data.choices.map(c => ({ command: c.command, label: c.label, tone: 'cyan' as const }))}
    layout="choice"
    shellClassName="v36-visual-shell"
    bodyClassName="v36-visual-body"
  >
    <div className={`v36-visual-stage v36-visual-stage-${data.mode} ${showingResult ? 'v36-visual-revealed' : ''}`}>
      <div className={`v36-visual-frame ${isPoster ? 'v36-visual-frame-poster' : ''} ${isPortrait ? 'v36-visual-frame-portrait' : ''}`}
        style={isPoster && (data.posterAspectRatio ?? 0) > 1 ? { width: 'min(100%, 850px)' } : undefined}>
        <div className={`v36-visual-canvas ${isEyes && !showingResult ? 'v44-eyes-crop' : ''} ${isPoster ? 'v49-poster-canvas' : ''}`}
          style={isPoster ? { '--poster-aspect': String(data.posterAspectRatio ?? 2 / 3) } as CSSProperties : undefined}>
          {!imageError ? <img
            src={useRemoteMedia ? data.fallbackImageUrl : data.imageUrl}
            className={imageClass}
            alt={isAr ? 'صورة تحدي من غير الكشف عن الإجابة' : 'Mystery picture clue'}
            draggable={false}
            loading="eager"
            style={isPoster ? posterImageStyle : showingResult && isZoom
              ? { objectPosition: `${focus.x}% ${focus.y}%` } : imageStyle}
            onError={() => { if (!useRemoteMedia && data.fallbackImageUrl) setUseRemoteMedia(true); else setImageError(true); }}
          /> : <div role="status" className="v36-visual-media-error">
            <b aria-hidden="true">⚠</b>
            <span>{isAr ? 'الصورة مش متاحة في ملفات اللعبة' : 'Local image is unavailable'}</span>
          </div>}
          {posterMysteryActive && posterMode === 'spotlight' && !imageError && posterPlan ? (
            <img src={useRemoteMedia ? data.fallbackImageUrl : data.imageUrl}
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
          {data.mode === 'reveal' && !showingResult && !imageError ? (
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
