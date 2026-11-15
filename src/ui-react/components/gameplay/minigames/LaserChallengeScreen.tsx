import type { MiniGameSnapshot } from '../../../../game-core/minigames/minigame-types';
import type { TourPhase } from '../../../../game-core/tours/tour-types';
import { QuestionScreenShell } from '../shared/question-shell';
import { useGame } from '../../../context/GameContext';
import { LaserBoard } from './LaserBoard';

/**
 * Laser Challenge uses the SAME QuestionScreenShell and bottom ChoiceCard row
 * as the other mini-games. The laser artwork never renders its own answers.
 * Option 1..4 is always mapped left-to-right to the corresponding receiver.
 */
export function LaserChallengeScreen({ miniGame, tourPhase }: {
  miniGame: MiniGameSnapshot;
  tourPhase: TourPhase;
}) {
  const { snapshot } = useGame();
  const plan = miniGame.laserChallenge;
  if (!plan) return null;

  const choices = plan.targetYs.map((_, index) => ({
    command: `!${index + 1}`,
    label: String(index + 1),
    tone: 'cyan' as const, // Neutral until the SHARED shell marks the correct one.
  }));

  return (
    <QuestionScreenShell
      miniGame={miniGame}
      tourPhase={tourPhase}
      layout="choice"
      helperText={miniGame.instruction}
      choices={choices}
      shellClassName="laser-v80-shell"
      bodyClassName="laser-v80-question-body"
    >
      <LaserBoard plan={plan} locale={snapshot.locale} />
    </QuestionScreenShell>
  );
}
