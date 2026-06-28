import type { MiniGameSnapshot } from '../../../../game-core/minigames/minigame-types';
import type { TourPhase } from '../../../../game-core/tours/tour-types';
import { useTranslation } from '../../../i18n/useTranslation';
import { getPairChoiceTone, getPhaseHelper } from '../shared/overlay-types';
import { QuestionScreenShell, MediaCard } from '../shared/question-shell';

export function CoupleOrSiblingsScreen({ miniGame, tourPhase }: { miniGame: MiniGameSnapshot; tourPhase: TourPhase }) {
  const t = useTranslation();
  const pair = miniGame.coupleOrSiblings;

  if (!pair) {
    return <p className="gameplay-empty-round">{t('gameplay.empty.pairGuess')}</p>;
  }

  const resultText = pair.correctAnswer
    ? pair.correctAnswer === 'couple' ? t('pair.answer.couple') : t('pair.answer.siblings')
    : '';

  const helperText = miniGame.acceptsAnswers
    ? t('gameplay.helper.pair.answerNow')
    : resultText || getPhaseHelper(tourPhase, t);

  const choices = pair.choices.map((choice) => ({
    command: choice.command,
    label: choice.label,
    tone: getPairChoiceTone(choice),
  }));

  return (
    <QuestionScreenShell
      miniGame={miniGame}
      tourPhase={tourPhase}
      helperText={helperText}
      choices={choices}
      bodyClassName="gameplay-question-body-pairguess"
    >
      {/* SVG pair image — use contain so both characters are always visible */}
      <MediaCard
        imageUrl={pair.imageUrl}
        altText={pair.imageAlt}
        fallbackIcon="👥"
        objectFit="contain"
      />
    </QuestionScreenShell>
  );
}
