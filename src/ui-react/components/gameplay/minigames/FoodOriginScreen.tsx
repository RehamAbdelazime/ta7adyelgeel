import { useEffect, useState } from 'react';
import type { MiniGameSnapshot } from '../../../../game-core/minigames/minigame-types';
import type { TourPhase } from '../../../../game-core/tours/tour-types';
import { useTranslation } from '../../../i18n/useTranslation';
import { normalizeRuntimeAssetUrl, getPhaseHelper } from '../shared/overlay-types';
import { QuestionScreenShell, MediaCard } from '../shared/question-shell';

export function FoodOriginScreen({ miniGame, tourPhase }: { miniGame: MiniGameSnapshot; tourPhase: TourPhase }) {
  const t = useTranslation();
  const food = miniGame.foodOrigin;
  const imageUrl = normalizeRuntimeAssetUrl(food?.dishImageUrl);
  const [hintLabelNow, setHintLabelNow] = useState(() => Date.now());

  useEffect(() => {
    if (!miniGame.hint?.isEnabled || miniGame.hint.isRevealed || !miniGame.hint.revealAt) return undefined;
    const interval = window.setInterval(() => setHintLabelNow(Date.now()), 250);
    return () => window.clearInterval(interval);
  }, [miniGame.hint?.isEnabled, miniGame.hint?.isRevealed, miniGame.hint?.revealAt]);

  if (!food) {
    return <p className="gameplay-empty-round">{t('gameplay.empty.foodOrigin')}</p>;
  }

  const isDishHintVisible = Boolean(miniGame.hint?.isRevealed || food.correctCountry);
  const hintRemainingSeconds = miniGame.hint?.revealAt
    ? Math.max(0, Math.ceil((miniGame.hint.revealAt - hintLabelNow) / 1000))
    : 0;
  const dishHintLabel = isDishHintVisible
    ? food.dishName
    : t('gameplay.hint.food.countdown', { seconds: String(hintRemainingSeconds) });

  const helperText = miniGame.acceptsAnswers
    ? t('gameplay.helper.food.answerNow')
    : food.correctCountry
    ? t('gameplay.food.correctCountry', { answer: food.correctCountry })
    : getPhaseHelper(tourPhase, t);

  // Choice numbers are assigned and randomized by the game service ONCE per round.
  // Never shuffle them in React: !1 must always mean the option displayed as #1.
  const choices = [...food.choices].sort((a, b) => a.optionNumber - b.optionNumber).map((choice) => ({
    command: choice.command,
    label: choice.label,
    tone: (['cyan', 'pink', 'yellow', 'purple'] as const)[choice.optionNumber - 1] ?? 'cyan',
  }));

  return (
    <QuestionScreenShell
      miniGame={miniGame}
      tourPhase={tourPhase}
      helperText={helperText}
      choices={choices}
      layout="choice"
      bodyClassName="gameplay-question-body-food"
    >
      <MediaCard
        imageUrl={imageUrl}
        altText={food.dishName}
        fallbackIcon="🍽️"
        objectFit="cover"
        caption={
          <div className="gameplay-food-hint-slot" aria-live="polite">
            <strong className={isDishHintVisible ? 'gameplay-dish-hint-revealed' : 'gameplay-dish-hint-countdown'}>
              {dishHintLabel}
            </strong>
          </div>
        }
      />
    </QuestionScreenShell>
  );
}
