import type { MiniGameSnapshot } from '../../../../game-core/minigames/minigame-types';
import type { TourPhase } from '../../../../game-core/tours/tour-types';
import { useTranslation } from '../../../i18n/useTranslation';
import { getPhaseHelper } from '../shared/overlay-types';
import { QuestionScreenShell } from '../shared/question-shell';

export function BeforeOrAfterScreen({ miniGame, tourPhase }: { miniGame: MiniGameSnapshot; tourPhase: TourPhase }) {
  const t = useTranslation();
  const data = miniGame.beforeOrAfter;

  if (!data) {
    return <p className="gameplay-empty-round">{t('gameplay.empty.beforeAfter')}</p>;
  }

  const correctOptionNumber = data.correctOptionNumber;
  const isRevealed = tourPhase === 'scoring' && correctOptionNumber !== null;
  const helperText = miniGame.acceptsAnswers
    ? t('gameplay.helper.beforeAfter.answerNow')
    : isRevealed
      ? (data.correctLabel ?? getPhaseHelper(tourPhase, t))
      : getPhaseHelper(tourPhase, t);

  return (
    <QuestionScreenShell
      miniGame={miniGame}
      tourPhase={tourPhase}
      helperText={helperText}
      choices={[]}
      eyebrow={data.categoryLabel}
      showHeaderHelperText
      isAnswerReveal={isRevealed}
      correctAnswerText={data.correctLabel ?? (correctOptionNumber ? `!${correctOptionNumber}` : '-')}
      bodyClassName="gameplay-question-body-before-after"
    >
      <div className="gameplay-before-after-stage">
        <div className="gameplay-before-after-cards">
          {data.choices.map((choice) => {
            const isCorrect = isRevealed && choice.optionNumber === correctOptionNumber;
            const isWrong = isRevealed && choice.optionNumber !== correctOptionNumber;

            return (
              <div
                key={choice.optionNumber}
                className={[
                  'gameplay-before-after-card',
                  isCorrect ? 'gameplay-before-after-card--correct' : '',
                  isWrong ? 'gameplay-before-after-card--wrong' : '',
                ].filter(Boolean).join(' ')}
              >
                <span className="gameplay-before-after-cmd">{choice.command}</span>
                <span className="gameplay-before-after-label">{choice.label}</span>
                {isCorrect ? (
                  <span className="gameplay-before-after-badge" aria-label={t('gameplay.answer.correct')}>
                    ✓
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>
        <div className="gameplay-before-after-vs" aria-hidden="true">VS</div>
      </div>
    </QuestionScreenShell>
  );
}
