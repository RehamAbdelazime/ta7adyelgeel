import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import type { MiniGameSnapshot } from '../../../../game-core/minigames/minigame-types';
import type { TourPhase } from '../../../../game-core/tours/tour-types';
import { useGame } from '../../../context/GameContext';
import { QuestionScreenShell } from '../shared/question-shell';

const MODE_LABELS = {
  poster: { ar: 'بوستر', en: 'POSTER' },
  scene: { ar: 'مشهد', en: 'SCENE' },
  eyes: { ar: 'العيون', en: 'EYES' },
  silhouette: { ar: 'الظل', en: 'SHADOW' },
  zoom: { ar: 'تكبير', en: 'ZOOM' },
  reveal: { ar: 'كشف تدريجي', en: 'REVEAL' },
} as const;

/** Two public minigames, one shared UI. Never show answer in alt text or overlays before reveal. */
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
    const id = window.setInterval(() => setClock(Date.now()), 180);
    return () => window.clearInterval(id);
  }, [data?.imageUrl, data?.mode, tourPhase]);

  const revealDuration = Math.max(1, snapshot.tour.phaseDurationMs);
  const revealProgress = showingResult ? 1
    : tourPhase === 'answer_window_open' && snapshot.tour.phaseStartedAt !== null
      ? Math.min(1, Math.max(0, (clock - snapshot.tour.phaseStartedAt) / revealDuration))
      : 0;
  const revealedTiles = Math.floor(revealProgress * 24);
  // Reveal faces and poster details gradually, but never give away the printed
  // movie title. Its per-poster masks remain heavily obscured until scoring.
  // V50: harder questions keep color/composition hidden longer; easy posters
  // become readable sooner. Printed titles remain covered until manual reveal.
  const posterDifficulty = miniGame.id === 'guess-movie' ? miniGame.questionDifficulty : null;
  const revealExponent = posterDifficulty === 'easy' ? 0.7 : posterDifficulty === 'hard' ? 1.45 : 1;
  const effectiveReveal = Math.pow(revealProgress, revealExponent);
  const basePosterBlur = posterDifficulty === 'easy' ? 13 : posterDifficulty === 'hard' ? 24 : 19;
  const baseFaceBlur = posterDifficulty === 'easy' ? 10 : posterDifficulty === 'hard' ? 20 : 15;
  const posterBlur = Math.max(0.75, basePosterBlur * Math.pow(1 - effectiveReveal, 1.2));
  const faceBlur = Math.max(0, baseFaceBlur * Math.pow(1 - effectiveReveal, 1.4));
  const tileOrder = useMemo(() => {
    // Deterministic across renders, no flicker whenever the scoreboard snapshot updates.
    const keyed = Array.from({ length: 24 }, (_, index) => index);
    return keyed.map((index) => ({ index, order: (index * 13 + 7) % 24 }));
  }, []);

  if (!data) return null;
  const isAr = snapshot.locale === 'ar';
  const modeText = MODE_LABELS[data.mode][isAr ? 'ar' : 'en'];
  const focus = data.focus;
  const isPortrait = miniGame.id === 'guess-star';
  const isPoster = data.mode === 'poster';
  const isEyes = data.mode === 'eyes';
  const isZoom = data.mode === 'zoom';
  const imageClass = `v36-visual-image v36-visual-image-${data.mode}`;
  const imageStyle: CSSProperties = isZoom
    ? { objectPosition: `${focus.x}% ${focus.y}%`, transform: `scale(2.15)`, transformOrigin: `${focus.x}% ${focus.y}%` }
    : { objectPosition: `${focus.x}% ${focus.y}%` };

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
            style={showingResult && isZoom
              ? { objectPosition: `${focus.x}% ${focus.y}%` }
              : isPoster && !showingResult
                ? { ...imageStyle, filter: `blur(${posterBlur.toFixed(2)}px)` }
                : imageStyle}
            onError={() => { if (!useRemoteMedia && data.fallbackImageUrl) setUseRemoteMedia(true); else setImageError(true); }}
          /> : <div role="status" className="v36-visual-media-error">
            <b aria-hidden="true">⚠</b>
            <span>{isAr ? 'الصورة مش متاحة في ملفات اللعبة' : 'Local image is unavailable'}</span>
          </div>}
          {isPoster && !showingResult && !imageError ? (
            <>
              <div className="v49-poster-face-blur" aria-hidden="true"
                style={{ '--face-blur': `${faceBlur.toFixed(2)}px` } as CSSProperties} />
              {(data.titleMasks.length ? data.titleMasks : data.titleMask ? [data.titleMask] : [])
                .map((mask, index) => <div key={index} className="v36-visual-poster-mask v49-poster-title-secret"
                  style={{ left: `${mask.x}%`, top: `${mask.y}%`,
                    width: `${mask.w}%`, height: `${mask.h}%` }} aria-hidden="true" />)}
            </>
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
