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

export function ShapeCountScreen({ miniGame, tourPhase }: { miniGame: MiniGameSnapshot; tourPhase: TourPhase }) {
  const t = useTranslation();
  const grid = miniGame.shapeGrid;

  if (!grid) {
    return <p className="gameplay-empty-round">{t('gameplay.empty.shapes')}</p>;
  }

  const compact = grid.cells.length > 45;

  return (
    <QuestionScreenShell
      miniGame={miniGame}
      tourPhase={tourPhase}
      helperText={miniGame.acceptsAnswers ? t('gameplay.helper.shape.answerNow') : miniGame.correctAnswer ? t('gameplay.shape.mostCommon', { answer: getShapeLabel(miniGame.correctAnswer as ShapeCountShapeId, t) }) : getPhaseHelper(tourPhase, t)}
      choices={grid.choices.map((choice) => ({ command: choice.command, label: choice.label, tone: getChoiceTone(choice.shape), shape: choice.shape }))}
      bodyClassName="gameplay-question-body-shapes"
    >
      <div className="gameplay-shape-stage">
        <div
          className={`gameplay-shape-grid ${compact ? 'gameplay-shape-grid-compact' : ''}`}
          style={{ gridTemplateColumns: `repeat(${grid.columns}, minmax(0, 1fr))` }}
        >
          {grid.cells.map((cell) => (
            <ShapeMark key={cell.id} shape={cell.shape} />
          ))}
        </div>
      </div>
    </QuestionScreenShell>
  );
}
