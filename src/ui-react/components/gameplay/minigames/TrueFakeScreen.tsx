import type { MiniGameSnapshot } from '../../../../game-core/minigames/minigame-types';
import type { TourPhase } from '../../../../game-core/tours/tour-types';
import { useTranslation } from '../../../i18n/useTranslation';
import { getPhaseHelper } from '../shared/overlay-types';
import { QuestionScreenShell } from '../shared/question-shell';

export function TrueFakeScreen({ miniGame, tourPhase }: { miniGame: MiniGameSnapshot; tourPhase: TourPhase }) {
  const t = useTranslation();
  return (
    <QuestionScreenShell
      miniGame={miniGame}
      tourPhase={tourPhase}
      helperText={miniGame.acceptsAnswers ? t('gameplay.helper.trueFake.answerNow') : getPhaseHelper(tourPhase, t)}
      choices={[
        { command: '!1', label: t('trueFake.true'), tone: 'cyan' },
        { command: '!2', label: t('trueFake.fake'), tone: 'pink' },
      ]}
      bodyClassName="gameplay-question-body-text"
    >
      <div className="gameplay-question-statement-card">TRUE OR FAKE?</div>
    </QuestionScreenShell>
  );
}
