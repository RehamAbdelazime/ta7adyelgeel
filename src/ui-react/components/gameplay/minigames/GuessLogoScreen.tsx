import type { MiniGameSnapshot } from '../../../../game-core/minigames/minigame-types';
import type { TourPhase } from '../../../../game-core/tours/tour-types';
import { useState, useEffect } from 'react';
import { useGame } from '../../../context/GameContext';
import { useTranslation } from '../../../i18n/useTranslation';
import {
  SHAPE_COLORS, MEMORY_ITEM_EMOJI, normalizeRuntimeAssetUrl,
  getShapeLabel, getShapeIcon, getChoiceTone, getPairChoiceTone,
  getPhaseHelper, type TranslateFn, type ChoiceTone,
} from '../shared/overlay-types';
import { type ShapeCountShapeId } from '../../../../game-core/minigames/minigame-types';
import { QuestionScreenShell, type QuestionChoiceItem, ShapeMark } from '../shared/question-shell';

export function GuessLogoScreen({ miniGame, tourPhase }: { miniGame: MiniGameSnapshot; tourPhase: TourPhase }) {
  const t = useTranslation();
  const guessLogo = miniGame.guessLogo;

  if (!guessLogo) {
    return <p className="gameplay-empty-round">{t('gameplay.empty.guessLogo')}</p>;
  }

  return (
    <QuestionScreenShell
      miniGame={miniGame}
      tourPhase={tourPhase}
      helperText={miniGame.acceptsAnswers ? t('gameplay.helper.logo.answerNow') : guessLogo.correctLogo ? t('gameplay.logo.correctLogo', { answer: guessLogo.correctLogo }) : getPhaseHelper(tourPhase, t)}
      choices={guessLogo.choices.map((choice, index) => ({ command: choice.command, label: choice.label, tone: (['cyan', 'pink', 'purple', 'orange'] as ChoiceTone[])[index] ?? 'cyan' }))}
      bodyClassName="gameplay-question-body-logo"
    >
      <div className="gameplay-logo-guess-card">
        <span className="gameplay-logo-guess-mark">{guessLogo.logoMark}</span>
        <strong>{guessLogo.correctLogo ? guessLogo.correctLogo : t('minigame.guessLogo.title')}</strong>
      </div>
    </QuestionScreenShell>
  );
}
