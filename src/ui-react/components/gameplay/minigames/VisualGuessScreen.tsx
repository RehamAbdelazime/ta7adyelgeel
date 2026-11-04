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
    if (!data || data.mode !== 'reveal' || tourPhase !== 'answer_window_open') return undefined;
    const id = window.setInterval(() => setClock(Date.now()), 180);
    return () => window.clearInterval(id);
  }, [data?.imageUrl, data?.mode, tourPhase]);

  const revealDuration = Math.max(1, snapshot.tour.phaseDurationMs);
  const revealProgress = showingResult ? 1
    : tourPhase === 'answer_window_open' && snapshot.tour.phaseStartedAt !== null
      ? Math.min(1, Math.max(0, (clock - snapshot.tour.phaseStartedAt) / revealDuration))
      : 0;
  const revealedTiles = Math.floor(revealProgress * 24);
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
  const isZoom = data.mode === 'eyes' || data.mode === 'zoom';
  const imageClass = `v36-visual-image v36-visual-image-${data.mode}`;
  const imageStyle: CSSProperties = isZoom
    ? { objectPosition: `${focus.x}% ${focus.y}%`, transform: `scale(${data.mode === 'eyes' ? 2.55 : 2.15})`, transformOrigin: `${focus.x}% ${focus.y}%` }
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
      <div className={`v36-visual-frame ${isPoster ? 'v36-visual-frame-poster' : ''} ${isPortrait ? 'v36-visual-frame-portrait' : ''}`}>
        <div className="v36-visual-canvas">
          {!imageError ? <img
            src={useRemoteMedia ? data.fallbackImageUrl : data.imageUrl}
            className={imageClass}
            alt={isAr ? 'صورة تحدي من غير الكشف عن الإجابة' : 'Mystery picture clue'}
            draggable={false}
            loading="eager"
            style={showingResult && isZoom ? { objectPosition: `${focus.x}% ${focus.y}%` } : imageStyle}
            onError={() => { if (!useRemoteMedia) setUseRemoteMedia(true); else setImageError(true); }}
          /> : <div role="status" className="v36-visual-media-error">
            <b aria-hidden="true">⚠</b>
            <span>{isAr ? 'الصورة غير متاحة — اتأكدي من اتصال الإنترنت' : 'Image unavailable — check internet access'}</span>
          </div>}
          {isPoster && data.titleMask && !showingResult && !imageError ? (
            <div className="v36-visual-poster-mask" style={{
              left: `${data.titleMask.x}%`, top: `${data.titleMask.y}%`,
              width: `${data.titleMask.w}%`, height: `${data.titleMask.h}%`,
            }} aria-hidden="true"><span>✦ ✦ ✦</span></div>
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
