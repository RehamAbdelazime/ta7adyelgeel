import type { CSSProperties } from 'react';
import { useGame } from '../../../context/GameContext';
import type { MiniGameSnapshot, CountTheBeatItemSnapshot } from '../../../../game-core/minigames/minigame-types';
import type { TourPhase } from '../../../../game-core/tours/tour-types';
import { useTranslation } from '../../../i18n/useTranslation';
import { getPhaseHelper } from '../shared/overlay-types';
import { QuestionScreenShell } from '../shared/question-shell';

const TONE_COLOUR: Record<string, string> = {
  cyan: '#22e7ff',
  pink: '#ff4be7',
  yellow: '#ffe246',
  purple: '#a855f7',
  green: '#36e8a0',
};

function BeatItem({ item }: { item: CountTheBeatItemSnapshot }) {
  const colour = TONE_COLOUR[item.tone] ?? TONE_COLOUR.cyan;
  const style: CSSProperties & { '--ctb-rotate': string } = {
    position: 'absolute',
    left: `${item.x}%`,
    top: `${item.y}%`,
    fontSize: `${item.size * 2.4}rem`,
    color: colour,
    '--ctb-rotate': `${item.rotate}deg`,
    animation: `ctb-pop ${item.durationMs}ms ease-in-out ${item.delayMs}ms both`,
    filter: item.isTarget
      ? `drop-shadow(0 0 8px ${colour}) drop-shadow(0 0 14px ${colour}88)`
      : `drop-shadow(0 0 4px ${colour}66)`,
    opacity: 0, // Keyframes explicitly animate from/to 0; no flashing before delay.
    userSelect: 'none',
    pointerEvents: 'none',
    lineHeight: 1,
  };

  return <span style={style} aria-hidden="true">{item.glyph}</span>;
}

export function CountTheBeatScreen({ miniGame, tourPhase }: { miniGame: MiniGameSnapshot; tourPhase: TourPhase }) {
  const t = useTranslation();
  const { snapshot } = useGame();
  const beat = miniGame.countTheBeat;

  if (!beat) {
    return <p className="gameplay-empty-round">{t('gameplay.empty.countTheBeat')}</p>;
  }

  const isRevealed = tourPhase === 'scoring' && beat.targetCount !== null;
  const helperText = getPhaseHelper(tourPhase, t);
  // A single short prompt. The target symbol is displayed on the playfield;
  // don't repeat scoring rules, chat syntax and question text in three places.
  const displayedMiniGame = {
    ...miniGame,
    statement: snapshot.locale === 'ar' ? 'عدّ الرمز ده' : 'Count this symbol',
  };

  return (
    <QuestionScreenShell
      miniGame={displayedMiniGame}
      tourPhase={tourPhase}
      layout="focus"
      helperText={helperText}
      choices={[]}
      isAnswerReveal={isRevealed}
      correctAnswerText={beat.targetCount === null ? '-' : String(beat.targetCount)}
      bodyClassName="gameplay-question-body-count-the-beat"
    >
      <div className="ctb-shell">
        <div className="ctb-target-bar" aria-label={beat.targetLabel}>
          <span className="ctb-target-glyph" aria-hidden="true">{beat.targetGlyph}</span>
          <span className="ctb-target-name">{beat.targetLabel}</span>
        </div>

        <div className="ctb-stage" aria-label={t('gameplay.countTheBeat.countEvery')}>
          {!isRevealed ? beat.items.map((item) => (
            <BeatItem key={item.id} item={item} />
          )) : null}
          {isRevealed ? (
            <div className="ctb-reveal-overlay" role="status">
              <span className="ctb-reveal-glyph">{beat.targetGlyph}</span>
              <strong className="ctb-reveal-count">{beat.targetCount}</strong>
            </div>
          ) : null}
        </div>

      </div>
    </QuestionScreenShell>
  );
}
