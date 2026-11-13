import type { MiniGameSnapshot } from '../../../../game-core/minigames/minigame-types';
import type { TourPhase } from '../../../../game-core/tours/tour-types';
import { QuestionScreenShell } from '../shared/question-shell';
import { useGame } from '../../../context/GameContext';
import { LaserBoard } from './LaserBoard';

export function LaserChallengeScreen({ miniGame, tourPhase }: { miniGame: MiniGameSnapshot; tourPhase: TourPhase }) {
  const { snapshot } = useGame();
  const plan = miniGame.laserChallenge;
  if (!plan) return null;
  // The true ray only exists in the snapshot AFTER the host has revealed.
  // No client-side solving, answer data, or hidden animation during voting.
  return <QuestionScreenShell miniGame={miniGame} tourPhase={tourPhase} helperText={miniGame.instruction}
    layout="focus" choices={[]} shellClassName="laser-v75-shell" bodyClassName="laser-v75-question-body">
    <LaserBoard plan={plan} locale={snapshot.locale} />
  </QuestionScreenShell>;
}
