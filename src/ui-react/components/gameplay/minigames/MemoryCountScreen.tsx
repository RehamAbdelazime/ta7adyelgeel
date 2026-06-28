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

export function MemoryCountScreen({ miniGame, tourPhase }: { miniGame: MiniGameSnapshot; tourPhase: TourPhase }) {
  const t = useTranslation();
  const memory = miniGame.memoryCount;

  if (!memory) {
    return <p className="gameplay-empty-round">{t('gameplay.empty.memory')}</p>;
  }

  return (
    <QuestionScreenShell
      miniGame={miniGame}
      tourPhase={tourPhase}
      helperText={miniGame.acceptsAnswers ? t('gameplay.helper.memory.answerNow') : memory.correctCount !== null ? t('gameplay.memory.correctCount', { answer: String(memory.correctCount) }) : getPhaseHelper(tourPhase, t)}
      choices={memory.choices.map((choice) => ({ command: choice.command, label: choice.label, tone: 'yellow' }))}
      bodyClassName="gameplay-question-body-memory"
    >
      <div className={`gameplay-memory-stage ${memory.showItems ? '' : 'gameplay-memory-hidden'}`}>
        {memory.showItems ? (
          <div className="gameplay-memory-grid" style={{ gridTemplateColumns: `repeat(${memory.columns}, minmax(0, 1fr))` }}>
            {memory.cells.map((cell) => (
              <span key={cell.id} className="gameplay-memory-item">{MEMORY_ITEM_EMOJI[cell.kind]}</span>
            ))}
          </div>
        ) : (
          <div className="gameplay-memory-blank">
            <strong>ITEMS HIDDEN</strong>
            <span>How many {memory.targetLabel} did you see?</span>
          </div>
        )}
      </div>
    </QuestionScreenShell>
  );
}
