import type { MiniGameSnapshot, ShapeCountShapeId } from '../../../../game-core/minigames/minigame-types';
import type { TourPhase } from '../../../../game-core/tours/tour-types';
import { SHAPE_COLORS, type ChoiceTone, type ChoiceSpotlightDefinition } from '../shared/overlay-types';
import { buildChoiceSpotlights, getAnswerCountsByOption, getCorrectOptionNumber } from '../shared/answer-helpers';

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
          ? choice.optionNumber === correctOption ? 'correct' : 'wrong'
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

export function ChoiceCard({
  command,
  label,
  tone,
  shape,
  isOpen,
  resultState = 'pending',
}: {
  command: string;
  label: string;
  tone: 'cyan' | 'pink' | 'yellow' | 'green' | 'purple' | 'orange';
  shape?: ShapeCountShapeId;
  isOpen?: boolean;
  resultState?: 'pending' | 'correct' | 'disabled';
}) {
  return (
    <div className={`gameplay-choice-card gameplay-choice-${tone} ${shape ? 'gameplay-choice-card-shape' : ''} ${isOpen ? 'gameplay-choice-open' : ''} gameplay-choice-result-${resultState}`} aria-disabled={resultState === 'disabled'}>
      <strong>{command}</strong>
      {shape ? (
        <span className="gameplay-choice-shape-answer" aria-label={label} title={label}>
          <svg className="gameplay-choice-shape-svg" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
            {shape === 'circle' ? <circle cx="50" cy="50" r="26" fill={SHAPE_COLORS[shape]} /> : null}
            {shape === 'square' ? <rect x="27" y="27" width="46" height="46" rx="7" fill={SHAPE_COLORS[shape]} /> : null}
            {shape === 'triangle' ? <polygon points="50 20 78 76 22 76" fill={SHAPE_COLORS[shape]} /> : null}
            {shape === 'diamond' ? <rect x="29" y="29" width="42" height="42" rx="6" transform="rotate(45 50 50)" fill={SHAPE_COLORS[shape]} /> : null}
            {shape === 'star' ? <polygon points="50 16 59 39 84 39 64 55 72 80 50 66 28 80 36 55 16 39 41 39" fill={SHAPE_COLORS[shape]} /> : null}
            {shape === 'hexagon' ? <polygon points="31 18 69 18 88 50 69 82 31 82 12 50" fill={SHAPE_COLORS[shape]} /> : null}
          </svg>
        </span>
      ) : (
        <span>{label}</span>
      )}
    </div>
  );
}

export function ShapeMark({ shape }: { shape: ShapeCountShapeId }) {
  return <span className={`gameplay-shape-mark gameplay-shape-${shape}`} style={{ '--shape-color': SHAPE_COLORS[shape] } as never} />;
}
