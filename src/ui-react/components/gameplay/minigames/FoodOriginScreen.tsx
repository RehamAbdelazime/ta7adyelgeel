import { useState, useEffect } from 'react';
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

  // Shuffle choices dynamically with Math.random() for true randomization
  const [shuffledChoices] = useState(() => {
    if (!food?.choices) return [];
    const arr = [...food.choices];
    // Fisher-Yates shuffle with Math.random() for non-deterministic ordering
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  });

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

  const choices = shuffledChoices.map((choice) => ({
    command: choice.command,
    label: choice.label,
    tone: 'cyan' as const,
  }));

  return (
    <QuestionScreenShell
      miniGame={miniGame}
      tourPhase={tourPhase}
      helperText={helperText}
      choices={choices}
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
