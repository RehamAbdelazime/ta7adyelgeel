import type { MiniGameSnapshot, ShapeCountShapeId } from '../../../../game-core/minigames/minigame-types';
import type { TourPhase } from '../../../../game-core/tours/tour-types';
import { SHAPE_COLORS, type ChoiceTone, type ChoiceSpotlightDefinition } from '../shared/overlay-types';
import { buildChoiceSpotlights, getAnswerCountsByOption, getChoiceOptionResultState, getCorrectOptionNumber } from '../shared/answer-helpers';

export function ChoiceSpotlights({ miniGame, phase }: { miniGame: MiniGameSnapshot; phase: TourPhase }) {
  const choices = buildChoiceSpotlights(miniGame);
  const visiblePhases: TourPhase[] = ['answer_window_open', 'scoring'];

  if (!miniGame.hasRound || choices.length === 0 || !visiblePhases.includes(phase)) {
    return null;
  }

  const counts = getAnswerCountsByOption(miniGame);
  const correctOption = getCorrectOptionNumber(miniGame);
  const shouldShowResultFeedback = phase === 'scoring' && correctOption !== null;

  return (
    <section className={`gameplay-choice-spotlights gameplay-choice-spotlights-${choices.length}`} aria-label="Answer spotlights">
      {choices.map((choice) => {
        const answerCount = counts.get(choice.optionNumber) ?? 0;

        const resultState = shouldShowResultFeedback
          ? getChoiceOptionResultState(miniGame, choice.optionNumber)
          : 'pending';

        return (
          <article key={choice.optionNumber} className={`gameplay-choice-spotlight gameplay-choice-spotlight-${choice.tone} gameplay-choice-spotlight-${resultState}`}>
            <div className="gameplay-choice-spotlight-beam" />
            <div className="gameplay-choice-spotlight-asset-wrap">
              <img
                className="gameplay-choice-spotlight-asset"
                src={`./assets/game/runtime/ui/choice_spotlight_${choice.optionNumber}.png`}
                alt=""
                draggable={false}
              />
              <small className="gameplay-choice-spotlight-count">{answerCount}</small>
            </div>
            <strong>{choice.command}</strong>
            <span>{choice.label}</span>
          </article>
        );
      })}
    </section>
  );
}
