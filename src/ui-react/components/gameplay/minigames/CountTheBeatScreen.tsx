import type { CSSProperties } from 'react';
import type { MiniGameSnapshot, CountTheBeatItemSnapshot } from '../../../../game-core/minigames/minigame-types';
import type { TourPhase } from '../../../../game-core/tours/tour-types';
import { useTranslation } from '../../../i18n/useTranslation';
import { getPhaseHelper } from '../shared/overlay-types';
import { QuestionScreenShell } from '../shared/question-shell';
import { ScoringGuide } from '../shared/ScoringGuide';

const TONE_COLOUR: Record<string, string> = {
  cyan: '#22e7ff',
  pink: '#ff4be7',
  yellow: '#ffe246',
  purple: '#a855f7',
  green: '#36e8a0',
};

function BeatItem({ item, revealTargets }: { item: CountTheBeatItemSnapshot; revealTargets: boolean }) {
  const colour = TONE_COLOUR[item.tone] ?? TONE_COLOUR.cyan;
  const style: CSSProperties = {
    position: 'absolute',
    left: `${item.x}%`,
    top: `${item.y}%`,
    fontSize: `${item.size * 2.4}rem`,
    color: colour,
    transform: `rotate(${item.rotate}deg)`,
    animation: `ctb-pop ${item.durationMs}ms ease-in-out ${item.delayMs}ms both`,
    filter: revealTargets && !item.isTarget
      ? 'none'
      : item.isTarget
        ? `drop-shadow(0 0 8px ${colour}) drop-shadow(0 0 14px ${colour}88)`
        : `drop-shadow(0 0 4px ${colour}66)`,
    opacity: 0,
    userSelect: 'none',
    pointerEvents: 'none',
    lineHeight: 1,
    ...(revealTargets && !item.isTarget ? { color: 'rgba(255,255,255,0.18)' } : {}),
  };

  return <span style={style} aria-hidden="true">{item.glyph}</span>;
}

export function CountTheBeatScreen({ miniGame, tourPhase }: { miniGame: MiniGameSnapshot; tourPhase: TourPhase }) {
  const t = useTranslation();
  const beat = miniGame.countTheBeat;

  if (!beat) {
    return <p className="gameplay-empty-round">{t('gameplay.empty.countTheBeat')}</p>;
  }

  const isRevealed = tourPhase === 'scoring' && beat.targetCount !== null;
  const helperText = miniGame.acceptsAnswers
    ? t('gameplay.helper.beat.answerNow')
    : getPhaseHelper(tourPhase, t);

  return (
    <QuestionScreenShell
      miniGame={miniGame}
      tourPhase={tourPhase}
      helperText={helperText}
      choices={[]}
      isAnswerReveal={isRevealed}
      correctAnswerText={beat.targetCount === null ? '-' : String(beat.targetCount)}
      bodyClassName="gameplay-question-body-count-the-beat"
    >
      <div className="ctb-shell">
        <div className="ctb-target-bar" aria-label={`${beat.targetLabel}`}>
          <span className="ctb-target-glyph" aria-hidden="true">{beat.targetGlyph}</span>
          <span className="ctb-target-name">{beat.targetLabel}</span>
        </div>

        <div className="ctb-stage" aria-label={t('gameplay.countTheBeat.countEvery')}>
          {beat.items.map((item) => (
            <BeatItem key={item.id} item={item} revealTargets={isRevealed} />
          ))}
          {isRevealed ? (
            <div className="ctb-reveal-overlay" role="status">
              <span className="ctb-reveal-glyph">{beat.targetGlyph}</span>
              <strong className="ctb-reveal-count">{beat.targetCount}</strong>
            </div>
          ) : null}
        </div>

        <div className="ctb-footer">
          <p className="ctb-instruction">{miniGame.acceptsAnswers ? helperText : t('gameplay.helper.phase.scoring')}</p>
          <ScoringGuide
            exact={beat.scoring.exact}
            partial={beat.scoring.partial}
            partialTolerance={beat.scoring.partialTolerance}
            incorrect={beat.scoring.incorrect}
            exactLabel={t('gameplay.scoring.exact')}
            partialLabel={t('gameplay.scoring.withinMargin')}
            incorrectLabel={t('gameplay.scoring.incorrect')}
          />
        </div>
      </div>
    </QuestionScreenShell>
  );
}
