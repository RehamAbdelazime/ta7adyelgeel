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

export function TrueFakeScreen({ miniGame, tourPhase }: { miniGame: MiniGameSnapshot; tourPhase: TourPhase }) {
  const t = useTranslation();
  const resultText = miniGame.correctAnswer
    ? `Correct answer: ${miniGame.correctAnswer === 'true' ? '!1 TRUE' : '!2 FAKE'}`
    : '';

  return (
    <QuestionScreenShell
      miniGame={miniGame}
      tourPhase={tourPhase}
      helperText={miniGame.acceptsAnswers ? t('gameplay.helper.trueFake.answerNow') : resultText || getPhaseHelper(tourPhase, t)}
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
