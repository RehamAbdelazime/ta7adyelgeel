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

export function HangmanScreen({ miniGame, tourPhase }: { miniGame: MiniGameSnapshot; tourPhase: TourPhase }) {
  const t = useTranslation();
  const hangman = miniGame.hangman;

  if (!hangman) {
    return <p className="gameplay-empty-round">{t('gameplay.empty.hangman')}</p>;
  }

  const wrongSlots = Array.from({ length: hangman.maxWrongGuesses }, (_, index) => index < hangman.wrongLetters.length);

  return (
    <QuestionScreenShell
      miniGame={miniGame}
      tourPhase={tourPhase}
      helperText={miniGame.acceptsAnswers ? 'Type one letter like !a / !س, or guess word with !word ...' : hangman.correctWord ? `Correct word: ${hangman.correctWord}` : getPhaseHelper(tourPhase, t)}
      bodyClassName="gameplay-question-body-hangman"
    >
      <div className="gameplay-hangman-card">
        <div className="gameplay-hangman-hint"><span>{t('gameplay.hangman.hint')}</span><strong>{hangman.hint}</strong></div>
        <div className="gameplay-hangman-word" dir="auto">{hangman.maskedWord}</div>
        <div className="gameplay-hangman-lives" aria-label="Wrong guesses">{wrongSlots.map((used, index) => <span key={index} className={used ? 'gameplay-hangman-life-used' : ''} />)}</div>
        <div className="gameplay-hangman-letters"><span>Correct letters: {hangman.guessedLetters.length ? hangman.guessedLetters.join(' · ') : '-'}</span><span>Wrong letters: {hangman.wrongLetters.length ? hangman.wrongLetters.join(' · ') : '-'}</span></div>
        {hangman.winnerDisplayName ? <div className="gameplay-hangman-winner">{t('gameplay.hangman.winner', { name: hangman.winnerDisplayName })}</div> : null}
      </div>
    </QuestionScreenShell>
  );
}
