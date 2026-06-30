import type { MiniGameSnapshot, CountTheBeatItemSnapshot } from '../../../../game-core/minigames/minigame-types';
import type { TourPhase } from '../../../../game-core/tours/tour-types';
import { useTranslation } from '../../../i18n/useTranslation';
import { getPhaseHelper } from '../shared/overlay-types';

// ─── Tone → CSS colour map ────────────────────────────────────────────────────
const TONE_COLOUR: Record<string, string> = {
  cyan:   '#22e7ff',
  pink:   '#ff4be7',
  yellow: '#ffe246',
  purple: '#a855f7',
  green:  '#36e8a0',
};

// ─── Single animated icon ─────────────────────────────────────────────────────
function BeatItem({ item, revealTargets }: { item: CountTheBeatItemSnapshot; revealTargets: boolean }) {
  const colour = TONE_COLOUR[item.tone] ?? TONE_COLOUR.cyan;
  const isTarget = item.isTarget;

  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${item.x}%`,
    top: `${item.y}%`,
    fontSize: `${item.size * 2.4}rem`,
    color: colour,
    transform: `rotate(${item.rotate}deg)`,
    animation: `ctb-pop ${item.durationMs}ms ease-in-out ${item.delayMs}ms both`,
    filter: isTarget
      ? `drop-shadow(0 0 8px ${colour}) drop-shadow(0 0 14px ${colour}88)`
      : `drop-shadow(0 0 4px ${colour}66)`,
    opacity: 0,
    userSelect: 'none',
    pointerEvents: 'none',
    lineHeight: 1,
    // After reveal, dim distractors so the target stands out
    ...(revealTargets && !isTarget ? { filter: 'none', color: 'rgba(255,255,255,0.18)' } : {}),
  };

  return <span style={style}>{item.glyph}</span>;
}

// ─── Scoring badge ────────────────────────────────────────────────────────────
function ScoringGuide({ exact, marginOne, marginTwo }: { exact: number; marginOne: number; marginTwo: number }) {
  return (
    <div className="ctb-scoring">
      <div className="ctb-scoring-row ctb-scoring-exact">
        <span>✓ Exact</span><strong>+{exact}</strong>
      </div>
      <div className="ctb-scoring-row">
        <span>±1</span><strong>+{marginOne}</strong>
      </div>
      <div className="ctb-scoring-row">
        <span>±2</span><strong>+{marginTwo}</strong>
      </div>
    </div>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────
export function CountTheBeatScreen({ miniGame, tourPhase }: { miniGame: MiniGameSnapshot; tourPhase: TourPhase }) {
  const t = useTranslation();
  const beat = miniGame.countTheBeat;

  if (!beat) {
    return <p className="gameplay-empty-round">{t('gameplay.empty.countTheBeat')}</p>;
  }

  const isRevealed = beat.targetCount !== null;
  const helperText = miniGame.acceptsAnswers
    ? t('gameplay.helper.beat.answerNow')
    : isRevealed
      ? null
      : getPhaseHelper(tourPhase, t);

  return (
    <div className="ctb-shell">

      {/* ── Target label ── */}
      <div className="ctb-target-bar">
        <span className="ctb-target-label">
          {t('gameplay.countTheBeat.countEvery')}
        </span>
        <span className="ctb-target-glyph">{beat.targetGlyph}</span>
        <span className="ctb-target-name">{beat.targetLabel}</span>

        {isRevealed && (
          <span className="ctb-answer-reveal">
            = <strong>{beat.targetCount}</strong>
          </span>
        )}
      </div>

      {/* ── Stage: flying icons ── */}
      <div className="ctb-stage">
        {beat.items.map((item) => (
          <BeatItem key={item.id} item={item} revealTargets={isRevealed} />
        ))}

        {/* Overlay when revealed */}
        {isRevealed && (
          <div className="ctb-reveal-overlay">
            <span className="ctb-reveal-glyph">{beat.targetGlyph}</span>
            <strong className="ctb-reveal-count">{beat.targetCount}</strong>
          </div>
        )}
      </div>

      {/* ── Footer: instruction + scoring ── */}
      <div className="ctb-footer">
        {helperText ? (
          <p className="ctb-instruction">{helperText}</p>
        ) : (
          <p className="ctb-instruction">{t('gameplay.helper.beat.answerNow')}</p>
        )}
        <ScoringGuide
          exact={beat.scoring.exact}
          marginOne={beat.scoring.marginOne}
          marginTwo={beat.scoring.marginTwo}
        />
      </div>

    </div>
  );
}
