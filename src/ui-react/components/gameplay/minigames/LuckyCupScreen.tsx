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

export function LuckyCupScreen({ miniGame, tourPhase }: { miniGame: MiniGameSnapshot; tourPhase: TourPhase }) {
  const t = useTranslation();
  const luckyCup = (miniGame as MiniGameSnapshot & { luckyCup?: any }).luckyCup;

  if (!luckyCup) {
    return <p className="gameplay-empty-round">Preparing Kobaya w Shakawa...</p>;
  }

  const isReveal = tourPhase === 'scoring';
  const helper = miniGame.acceptsAnswers
    ? miniGame.instruction
    : luckyCup.correctCupNumber !== null
      ? 'Correct cup: !' + luckyCup.correctCupNumber
      : getPhaseHelper(tourPhase, t);

  return (
    <QuestionScreenShell
      miniGame={miniGame}
      tourPhase={tourPhase}
      helperText={helper}
      choices={[]}
      bodyClassName="gameplay-question-body-lucky-cup"
    >
      <div className={`gameplay-lucky-cup-stage ${isReveal ? 'gameplay-lucky-cup-stage-reveal' : ''}`}>
        <div className="gameplay-lucky-cup-message">
          <strong>{isReveal ? 'KASHF EL KOBAIA' : 'FOLLOW THE BALL'}</strong>
          <span>{miniGame.instruction}</span>
        </div>
        <div className="gameplay-lucky-cup-playfield">
          <div className="gameplay-lucky-cup-ball" />
          <div className="gameplay-lucky-cup-cups">
            {luckyCup.cups.map((cup: { cupId: number; label: string }, index: number) => (
              <div
                key={cup.cupId}
                className={`gameplay-lucky-cup-cup gameplay-lucky-cup-cup-${index + 1} ${isReveal && luckyCup.correctCupNumber === index + 1 ? 'gameplay-lucky-cup-cup-correct' : ''}`}
              >
                <span className="gameplay-lucky-cup-cup-number">!{index + 1}</span>
                <svg viewBox="0 0 180 230" aria-hidden="true">
                  <ellipse className="gameplay-lucky-cup-rim" cx="90" cy="34" rx="67" ry="20" />
                  <path className="gameplay-lucky-cup-body" d="M30 34 C37 89 43 155 57 202 C67 220 113 220 123 202 C137 155 143 89 150 34 C126 53 54 53 30 34Z" />
                  <path className="gameplay-lucky-cup-shine" d="M58 55 C53 92 55 145 66 188 C70 199 78 197 76 185 C69 139 68 91 73 58 C75 44 61 44 58 55Z" />
                  <ellipse className="gameplay-lucky-cup-base" cx="90" cy="202" rx="35" ry="10" />
                </svg>
              </div>
            ))}
          </div>
          <div className="gameplay-lucky-cup-answer-rings">
            <span>!1</span>
            <span>!2</span>
            <span>!3</span>
          </div>
        </div>
      </div>
    </QuestionScreenShell>
  );
}
