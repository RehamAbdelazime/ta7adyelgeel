import { useState, useEffect, type CSSProperties, type ReactNode } from 'react';
import type { MiniGameSnapshot, ShapeCountShapeId } from '../../../../game-core/minigames/minigame-types';
import type { TourPhase } from '../../../../game-core/tours/tour-types';
import { useGame } from '../../../context/GameContext';
import { useTranslation } from '../../../i18n/useTranslation';
import { SHAPE_COLORS, type ChoiceTone, getCorrectAnswerText } from './overlay-types';
import { getCorrectOptionNumber, getCommandOptionNumber } from './answer-helpers';

export type QuestionChoiceItem = {
  command: string;
  label: string;
  tone: ChoiceTone;
  shape?: ShapeCountShapeId;
  resultState?: 'pending' | 'correct' | 'disabled';
};

// ─── QuestionScreenShell ──────────────────────────────────────────────────────
// Layout uses new `qshell-*` class names to avoid conflicts with the
// thousands of !important rules targeting .gameplay-question-body /
// .gameplay-question-choices in the legacy CSS.
// Visual styling (colours, borders, shadows) still comes from CSS classes;
// structural layout (flex/grid, height distribution) is controlled here.

export function QuestionScreenShell({
  miniGame,
  tourPhase,
  helperText,
  choices = [],
  bodyClassName = '',
  children,
}: {
  miniGame: MiniGameSnapshot;
  tourPhase: TourPhase;
  helperText: string;
  choices?: QuestionChoiceItem[];
  bodyClassName?: string;
  children: ReactNode;
}) {
  const { actions, snapshot } = useGame();
  const t = useTranslation();
  const [timerNow, setTimerNow] = useState(() => Date.now());

  useEffect(() => {
    if (tourPhase !== 'answer_window_open' || snapshot.tour.phaseDurationMs <= 0 || !snapshot.tour.phaseStartedAt) {
      setTimerNow(Date.now());
      return undefined;
    }
    let frameId = 0;
    const tick = () => { setTimerNow(Date.now()); frameId = window.requestAnimationFrame(tick); };
    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, [tourPhase, snapshot.tour.phaseStartedAt, snapshot.tour.phaseDurationMs]);

  const smoothElapsedMs = tourPhase === 'answer_window_open' && snapshot.tour.phaseStartedAt
    ? Math.max(0, timerNow - snapshot.tour.phaseStartedAt)
    : Math.max(0, snapshot.tour.phaseDurationMs - snapshot.tour.phaseRemainingMs);
  const smoothRemainingMs = snapshot.tour.phaseDurationMs > 0
    ? Math.max(0, snapshot.tour.phaseDurationMs - smoothElapsedMs)
    : snapshot.tour.phaseRemainingMs;
  const remainingSeconds = Math.max(0, Math.ceil(smoothRemainingMs / 1000));
  const remainingProgress = tourPhase === 'answer_window_open' && snapshot.tour.phaseDurationMs > 0
    ? Math.max(0, Math.min(1, smoothRemainingMs / snapshot.tour.phaseDurationMs))
    : 1;

  const isTourMode = snapshot.activeSessionMode === 'tour';
  const roundLabel = isTourMode && snapshot.tour.totalRounds > 0
    ? `${t('gameplay.round.label')} ${snapshot.tour.roundNumber}/${snapshot.tour.totalRounds}`
    : '';
  const questionLabel = snapshot.tour.roundNumber > 0
    ? `${t('gameplay.question.label')} ${snapshot.tour.roundNumber}`
    : t('gameplay.question.label');

  const correctOptionNumber = getCorrectOptionNumber(miniGame);
  const isAnswerReveal = tourPhase === 'scoring' && correctOptionNumber !== null;
  const choiceCount = Math.min(choices.length, 4);
  const hasChoices = choiceCount > 0;

  // ── SHELL: flex column, fills its container ─────────────────────────────────
  const shellStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    position: 'relative',
    gap: 0,
    padding: 0,
  };

  // ── HEADER: shrinks to its natural height ───────────────────────────────────
  const headerStyle: CSSProperties = {
    flexShrink: 0,
    flexGrow: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 'clamp(4px, 0.5vh, 8px)',
    padding: 'clamp(10px, 1vh, 16px) clamp(18px, 1.5vw, 32px) 0',
    zIndex: 2,
  };

  // ── CONTENT: fills remaining height, side-by-side layout ───────────────────
  const contentStyle: CSSProperties = {
    flex: '1 1 auto',
    minHeight: 0,
    display: 'grid',
    gridTemplateColumns: hasChoices ? '1fr 320px' : '1fr',
    gridTemplateRows: '1fr',
    gap: 'clamp(14px, 1.2vw, 26px)',
    padding: 'clamp(8px, 0.8vh, 14px) clamp(16px, 1.5vw, 28px) clamp(10px, 1vh, 16px)',
    alignItems: 'stretch',
    zIndex: 1,
  };

  // ── BODY (left column): grid so single child fills it exactly ───────────────
  const bodyStyle: CSSProperties = {
    minHeight: 0,
    minWidth: 0,
    display: 'grid',
    gridTemplateRows: '1fr',
    gridTemplateColumns: '1fr',
    overflow: 'hidden',
    position: 'static', // prevent legacy CSS absolute-positioning from winning
  };

  // ── CHOICES (right column): each card fills equal row ──────────────────────
  const choicesStyle: CSSProperties = {
    minHeight: 0,
    display: 'grid',
    gridTemplateRows: `repeat(${choiceCount}, 1fr)`,
    gap: 'clamp(12px, 1.2vh, 20px)',
  };

  return (
    <div
      className={`gameplay-question-shell gameplay-question-${miniGame.id} gameplay-session-${snapshot.activeSessionMode} ${isAnswerReveal ? 'gameplay-question-shell-reveal' : ''}`}
      style={shellStyle}
    >
      {/* NEXT button — absolute in shell, styled via CSS */}
      {isAnswerReveal ? (
        <button
          className="gameplay-global-next-button gameplay-question-next-button"
          type="button"
          onClick={actions.skipPhase}
          aria-label={t('gameplay.next')}
        >
          {t('gameplay.next')}
        </button>
      ) : null}

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="qshell-header" style={headerStyle}>
        {/* Meta badge + timer on the same line */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(10px, 1vw, 20px)', width: '100%', justifyContent: 'center' }}>

          <div className="gameplay-question-meta" aria-label={`${questionLabel} ${roundLabel}`}
               style={{ flexShrink: 0 }}>
            <span>{questionLabel}</span>
            {roundLabel ? <b>{roundLabel}</b> : null}
          </div>

          <div className="gameplay-question-timer" aria-label={`${remainingSeconds} seconds remaining`}
               style={{ flex: '1 1 auto', minWidth: 0, maxWidth: 'clamp(200px, 28vw, 420px)', display: 'flex', alignItems: 'center', gap: 'clamp(8px,.7vw,12px)', background: 'transparent', border: 0, padding: 0, boxShadow: 'none' }}>
            <i className="gameplay-question-timer-icon" aria-hidden="true" />
            <div className="gameplay-question-timer-track" style={{ flex: '1 1 auto', minWidth: 0 }}>
              <span
                className="gameplay-question-timer-fill"
                style={{ '--timer-progress': `${remainingProgress * 100}%`, '--timer-scale': String(remainingProgress) } as CSSProperties}
              />
            </div>
            <strong style={{ minWidth: '3.5ch', color: '#9ff8ff', fontSize: 'clamp(15px,1.1vw,22px)', lineHeight: 1, whiteSpace: 'nowrap' }}>
              {tourPhase === 'answer_window_open' ? `${remainingSeconds}s` : t('gameplay.timer.ready')}
            </strong>
          </div>

        </div>

        {/* Question text — full width below */}
        <h2 style={{ margin: 0, textAlign: 'center', color: '#ffffff', fontSize: 'clamp(20px,1.6vw,34px)', lineHeight: 1.18, fontFamily: "'Luckiest Guy', Impact, 'Arial Black', sans-serif", textShadow: '0 4px 0 rgba(0,0,0,.52), 0 0 18px rgba(255,255,255,.28)', textTransform: 'uppercase', letterSpacing: '.04em', width: '100%' }}>
          {miniGame.statement}
        </h2>

        {isAnswerReveal ? (
          <div className="gameplay-answer-reveal-banner" role="status">
            <span>{t('gameplay.answer.correct')}</span>
            <strong>{getCorrectAnswerText(miniGame, t)}</strong>
          </div>
        ) : null}
      </div>

      {/* ── Content: body left | choices right ────────────────────────── */}
      <div style={contentStyle}>

        {/* Body — left column, fills first grid cell */}
        <div
          className={`qshell-body ${bodyClassName}`}
          style={bodyStyle}
        >
          {children}
        </div>

        {/* Choices — right column */}
        {hasChoices ? (
          <div
            className={`gameplay-question-choices gameplay-question-choices-${choiceCount}`}
            style={choicesStyle}
          >
            {choices.map((choice) => {
              const optionNumber = getCommandOptionNumber(choice.command);
              const resultState = isAnswerReveal
                ? optionNumber === correctOptionNumber ? 'correct' : 'disabled'
                : 'pending';
              return (
                <ChoiceCard
                  key={`${choice.command}-${choice.label}-${choice.shape ?? 'text'}`}
                  command={choice.command}
                  label={choice.label}
                  tone={isAnswerReveal && resultState === 'correct' ? 'green' : choice.tone}
                  shape={choice.shape}
                  isOpen={miniGame.acceptsAnswers && !isAnswerReveal}
                  resultState={resultState}
                />
              );
            })}
          </div>
        ) : null}
      </div>

      {/* ── Side hints ─────────────────────────────────────────────────── */}
      <div className="gameplay-question-side-hints" style={{ flexShrink: 0 }} aria-live="polite">
        <aside className="gameplay-question-side-hint gameplay-question-side-hint-left">
          <small>{t('gameplay.chat.command')}</small>
          <span>{helperText}</span>
        </aside>
        <aside className="gameplay-question-side-hint gameplay-question-side-hint-right">
          <small>{t('gameplay.liveAnswers')}</small>
          <b>{miniGame.officialAnswerCount}</b>
        </aside>
      </div>
    </div>
  );
}

// ─── MediaCard ────────────────────────────────────────────────────────────────
// Fully inline-styled so no CSS cascade can break the layout.
// Image fills row 1, caption is row 2 (optional).

export function MediaCard({
  imageUrl,
  altText = '',
  fallbackIcon = '🖼️',
  objectFit = 'cover',
  caption,
}: {
  imageUrl?: string | null;
  altText?: string;
  fallbackIcon?: string;
  objectFit?: 'cover' | 'contain';
  caption?: ReactNode;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  useEffect(() => { setImageFailed(false); }, [imageUrl]);
  const showImage = Boolean(imageUrl) && !imageFailed;

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'grid',
      gridTemplateRows: caption ? '1fr auto' : '1fr',
      gridTemplateColumns: '1fr',
      gap: caption ? 'clamp(10px,1vh,16px)' : 0,
    }}>
      {/* Image card */}
      <div style={{
        minHeight: 0,
        width: '100%',
        height: '100%',
        alignSelf: 'stretch',
        justifySelf: 'stretch',
        borderRadius: 'clamp(14px,1.1vw,22px)',
        overflow: 'hidden',
        background: 'rgba(0,5,18,0.85)',
        border: '1px solid rgba(34,231,255,0.30)',
        boxShadow: '0 0 32px rgba(0,0,0,0.60),0 0 18px rgba(34,231,255,0.08),inset 0 0 22px rgba(0,0,0,0.42)',
      }}>
        {showImage ? (
          <img
            src={imageUrl!}
            alt={altText}
            loading="eager"
            draggable={false}
            onError={() => setImageFailed(true)}
            className="qshell-media-img"
            style={{ width: '100%', height: '100%', display: 'block', objectFit, objectPosition: 'center' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', background: 'radial-gradient(circle at 50% 38%,rgba(45,244,255,.06),transparent 56%)' }}>
            <span style={{ fontSize: 'clamp(52px,4.8vw,90px)', lineHeight: 1, filter: 'drop-shadow(0 0 18px rgba(45,244,255,.22))' }}>
              {fallbackIcon}
            </span>
          </div>
        )}
      </div>

      {/* Caption row */}
      {caption ? (
        <div className="qshell-media-caption" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'visible' }}>
          {caption}
        </div>
      ) : null}
    </div>
  );
}

// ─── ChoiceCard ───────────────────────────────────────────────────────────────

export function ChoiceCard({
  command, label, tone, shape, isOpen, resultState = 'pending',
}: {
  command: string; label: string;
  tone: 'cyan' | 'pink' | 'yellow' | 'green' | 'purple' | 'orange';
  shape?: ShapeCountShapeId; isOpen?: boolean;
  resultState?: 'pending' | 'correct' | 'disabled';
}) {
  return (
    <div
      className={`gameplay-choice-card gameplay-choice-${tone} ${shape ? 'gameplay-choice-card-shape' : ''} ${isOpen ? 'gameplay-choice-open' : ''} gameplay-choice-result-${resultState}`}
      style={{ width: '100%', height: '100%', minHeight: 0 }}
      aria-disabled={resultState === 'disabled'}
    >
      <strong>{command}</strong>
      {shape ? (
        <span className="gameplay-choice-shape-answer" aria-label={label} title={label}>
          <svg className="gameplay-choice-shape-svg" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
            {shape === 'circle'   ? <circle cx="50" cy="50" r="26" fill={SHAPE_COLORS[shape]} /> : null}
            {shape === 'square'   ? <rect x="27" y="27" width="46" height="46" rx="7" fill={SHAPE_COLORS[shape]} /> : null}
            {shape === 'triangle' ? <polygon points="50 20 78 76 22 76" fill={SHAPE_COLORS[shape]} /> : null}
            {shape === 'diamond'  ? <rect x="29" y="29" width="42" height="42" rx="6" transform="rotate(45 50 50)" fill={SHAPE_COLORS[shape]} /> : null}
            {shape === 'star'     ? <polygon points="50 16 59 39 84 39 64 55 72 80 50 66 28 80 36 55 16 39 41 39" fill={SHAPE_COLORS[shape]} /> : null}
            {shape === 'hexagon'  ? <polygon points="31 18 69 18 88 50 69 82 31 82 12 50" fill={SHAPE_COLORS[shape]} /> : null}
          </svg>
        </span>
      ) : (
        <span>{label}</span>
      )}
    </div>
  );
}

// ─── ShapeMark ────────────────────────────────────────────────────────────────

export function ShapeMark({ shape }: { shape: ShapeCountShapeId }) {
  return (
    <span
      className={`gameplay-shape-mark gameplay-shape-${shape}`}
      style={{ '--shape-color': SHAPE_COLORS[shape] } as never}
    />
  );
}
