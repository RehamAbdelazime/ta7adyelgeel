import type { CSSProperties } from 'react';
import { ANSWER_STAGE_LAYOUT } from '../shared/answer-stage-layout';
import { useGame } from '../../../context/GameContext';
import type { MiniGameSnapshot } from '../../../../game-core/minigames/minigame-types';
import type { TourPhase } from '../../../../game-core/tours/tour-types';
import { buildChoiceSpotlights, getAnswerCountsByOption, getChoiceOptionResultState, getCorrectOptionNumber } from '../shared/answer-helpers';

export function ChoiceSpotlights({ miniGame, phase }: { miniGame: MiniGameSnapshot; phase: TourPhase }) {
  const { snapshot } = useGame();
  const isArabic = snapshot.locale === 'ar';
  const choices = [...buildChoiceSpotlights(miniGame)].sort((a, b) => a.optionNumber - b.optionNumber);
  const visiblePhases: TourPhase[] = ['answer_window_open', 'scoring'];

  if (!miniGame.hasRound || choices.length === 0 || !visiblePhases.includes(phase)) {
    return null;
  }

  const counts = getAnswerCountsByOption(miniGame);
  const correctOption = getCorrectOptionNumber(miniGame);
  const shouldShowResultFeedback = phase === 'scoring' && correctOption !== null;

  return (
    <section className={`gameplay-choice-spotlights gameplay-choice-spotlights-v18 gameplay-choice-spotlights-${choices.length}`}
      style={{
        '--answer-zone-left': `${ANSWER_STAGE_LAYOUT.leftPercent}%`,
        '--answer-zone-width': `${ANSWER_STAGE_LAYOUT.widthPercent}%`,
        '--answer-zone-top': `${ANSWER_STAGE_LAYOUT.topPercent}%`,
        '--answer-zone-height': `${ANSWER_STAGE_LAYOUT.heightPercent}%`,
      } as CSSProperties}
      aria-label={isArabic ? 'اختيارات الإجابة على المسرح' : 'Answer options on stage'}>
      {choices.map((choice) => {
        const answerCount = counts.get(choice.optionNumber) ?? 0;

        const resultState = shouldShowResultFeedback
          ? getChoiceOptionResultState(miniGame, choice.optionNumber)
          : 'pending';

        return (
          <article key={choice.optionNumber}
            data-option-number={choice.optionNumber}
            className={`gameplay-choice-spotlight gameplay-choice-spotlight-${choice.tone} gameplay-choice-spotlight-${resultState}`}
            aria-label={isArabic
              ? `الاختيار ${choice.optionNumber}: ${answerCount} إجابة`
              : `Option ${choice.optionNumber}: ${answerCount} answers`}>
            <div className="floor-answer-pad" aria-hidden="true">
              <span className="floor-answer-number">{choice.optionNumber}</span>
              <span className="floor-answer-tally">{answerCount}</span>
            </div>
          </article>
        );
      })}
    </section>
  );
}
