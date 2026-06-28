import type { MiniGameSnapshot, BeforeOrAfterChoice } from '../../../../game-core/minigames/minigame-types';
import type { TourPhase } from '../../../../game-core/tours/tour-types';
import { useTranslation } from '../../../i18n/useTranslation';
import { getPhaseHelper } from '../shared/overlay-types';

export function BeforeOrAfterScreen({ miniGame, tourPhase }: { miniGame: MiniGameSnapshot; tourPhase: TourPhase }) {
  const t = useTranslation();
  const data = miniGame.beforeOrAfter;

  if (!data) {
    return <p className="gameplay-empty-round">{t('gameplay.empty.beforeAfter')}</p>;
  }

  const correctNum = data.correctOptionNumber;
  const isRevealed = correctNum !== null;

  const helperText = miniGame.acceptsAnswers
    ? t('gameplay.helper.beforeAfter.answerNow')
    : isRevealed
      ? (miniGame.id === 'before-after' && data.correctLabel ? data.correctLabel : '')
      : getPhaseHelper(tourPhase, t);

  return (
    <div className="gameplay-question-shell gameplay-before-after-shell">
      {/* Header */}
      <div className="gameplay-before-after-header">
        <div className="gameplay-question-meta">
          <span>{data.categoryLabel}</span>
        </div>
        <h2 className="gameplay-before-after-question">{miniGame.statement}</h2>
        {helperText ? <p className="gameplay-before-after-helper">{helperText}</p> : null}
      </div>

      {/* Two cards side by side */}
      <div className="gameplay-before-after-cards">
        {data.choices.map((choice) => {
          const isCorrect = isRevealed && choice.optionNumber === correctNum;
          const isWrong = isRevealed && choice.optionNumber !== correctNum;
          return (
            <div
              key={choice.optionNumber}
              className={[
                'gameplay-before-after-card',
                isCorrect ? 'gameplay-before-after-card--correct' : '',
                isWrong ? 'gameplay-before-after-card--wrong' : '',
              ].join(' ')}
            >
              <span className="gameplay-before-after-cmd">{choice.command}</span>
              <span className="gameplay-before-after-label">{choice.label}</span>
              {isCorrect && (
                <span className="gameplay-before-after-badge">✓ قبل</span>
              )}
            </div>
          );
        })}
      </div>

      {/* VS divider */}
      <div className="gameplay-before-after-vs" aria-hidden="true">VS</div>
    </div>
  );
}
