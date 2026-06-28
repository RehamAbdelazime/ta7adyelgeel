import type { MiniGameSnapshot, ShapeCountShapeId } from '../../../../game-core/minigames/minigame-types';
import type { TranslationKey } from '../../../../game-core/localization/locale-types';
import { type ChoiceTone, type ChoiceSpotlightDefinition, type TranslateFn, getChoiceTone, getShapeIcon } from './overlay-types';

// ─── Participation formatters ─────────────────────────────────────────────────

export function formatAnswerParticipation(
  t: TranslateFn,
  playerAnswers: number,
  spectatorAnswers: number,
  spectatorCount: number,
): string {
  if (spectatorCount >= 1 || spectatorAnswers >= 1) {
    return t('gameplay.answer.playersSpectators', { players: String(playerAnswers), spectators: String(spectatorAnswers) });
  }
  return t('gameplay.answer.players', { players: String(playerAnswers) });
}

export function formatCorrectParticipation(t: TranslateFn, playerCorrect: number, spectatorCorrect: number): string {
  if (spectatorCorrect >= 1) {
    return t('gameplay.correct.playersSpectators', { players: String(playerCorrect), spectators: String(spectatorCorrect) });
  }
  return t('gameplay.correct.players', { players: String(playerCorrect) });
}

// ─── Option number helpers ────────────────────────────────────────────────────

export function getCommandOptionNumber(command: string): number | null {
  const match = command.match(/\d+/);
  if (!match) return null;
  const optionNumber = Number(match[0]);
  return Number.isFinite(optionNumber) ? optionNumber : null;
}

export function getOptionNumberForAnswer(
  miniGame: MiniGameSnapshot,
  answer: MiniGameSnapshot['answerRecords'][number]['answer'],
): number | null {
  if (miniGame.id === 'true-fake') {
    if (answer === 'true') return 1;
    if (answer === 'fake') return 2;
    return null;
  }

  if (miniGame.id === 'shape-count') {
    return miniGame.shapeGrid?.choices.find((c) => c.shape === (answer as ShapeCountShapeId))?.optionNumber ?? null;
  }

  if (typeof answer === 'string' && answer.startsWith('option-')) {
    const n = Number(answer.replace('option-', ''));
    return Number.isFinite(n) ? n : null;
  }

  return null;
}

export function getAnswerCountsByOption(miniGame: MiniGameSnapshot): Map<number, number> {
  const counts = new Map<number, number>();
  for (const record of miniGame.answerRecords) {
    const optionNumber = getOptionNumberForAnswer(miniGame, record.answer);
    if (!optionNumber) continue;
    counts.set(optionNumber, (counts.get(optionNumber) ?? 0) + 1);
  }
  return counts;
}

export function getCorrectOptionNumber(miniGame: MiniGameSnapshot): number | null {
  if (!miniGame.correctAnswer) return null;

  if (miniGame.id === 'true-fake') {
    return miniGame.correctAnswer === 'true' ? 1 : miniGame.correctAnswer === 'fake' ? 2 : null;
  }
  if (miniGame.id === 'shape-count') {
    return miniGame.shapeGrid?.choices.find((c) => c.shape === (miniGame.correctAnswer as ShapeCountShapeId))?.optionNumber ?? null;
  }
  if (miniGame.id === 'memory-count') {
    return miniGame.memoryCount?.choices.find((c) => c.value === miniGame.memoryCount?.correctCount)?.optionNumber ?? null;
  }
  if (miniGame.id === 'food-origin') {
    return miniGame.foodOrigin?.choices.find((c) => c.countryCode === miniGame.foodOrigin?.correctCountryCode)?.optionNumber ?? null;
  }
  if (miniGame.id === 'couple-or-siblings') {
    return miniGame.coupleOrSiblings?.choices.find((c) => c.value === miniGame.coupleOrSiblings?.correctAnswer)?.optionNumber ?? null;
  }
  if (miniGame.id === 'guess-logo') {
    return miniGame.guessLogo?.correctOptionNumber ?? null;
  }
  if (miniGame.id === 'maze-gates') {
    return miniGame.mazeGates?.correctOptionNumber ?? null;
  }
  return null;
}

export function getCitizenChoiceResultState(
  miniGame: MiniGameSnapshot,
  answerOption: number | null,
): 'pending' | 'correct' | 'wrong' {
  const correctOption = getCorrectOptionNumber(miniGame);
  if (!answerOption || correctOption === null || !miniGame.correctAnswer) return 'pending';
  return answerOption === correctOption ? 'correct' : 'wrong';
}

export function getAnswerOptionByUserId(miniGame: MiniGameSnapshot): Map<string, number> {
  const map = new Map<string, number>();
  for (const record of miniGame.answerRecords) {
    const optionNumber = getOptionNumberForAnswer(miniGame, record.answer);
    if (!optionNumber) continue;
    map.set(record.twitchUserId, optionNumber);
  }
  return map;
}

// ─── Choice spotlight builder ─────────────────────────────────────────────────

export function buildChoiceSpotlights(miniGame: MiniGameSnapshot): ChoiceSpotlightDefinition[] {
  if (!miniGame.hasRound) return [];

  if (miniGame.id === 'true-fake') {
    return [
      { optionNumber: 1, command: '!1', label: 'TRUE', tone: 'cyan', icon: '✓' },
      { optionNumber: 2, command: '!2', label: 'FAKE', tone: 'pink', icon: '✕' },
    ];
  }
  if (miniGame.id === 'shape-count' && miniGame.shapeGrid) {
    return miniGame.shapeGrid.choices.map((c) => ({
      optionNumber: c.optionNumber, command: c.command, label: c.label,
      tone: getChoiceTone(c.shape), icon: getShapeIcon(c.shape),
    }));
  }
  if (miniGame.id === 'memory-count' && miniGame.memoryCount) {
    return miniGame.memoryCount.choices.map((c, i) => ({
      optionNumber: c.optionNumber, command: c.command, label: c.label,
      tone: (i % 2 === 0 ? 'yellow' : 'orange') as ChoiceTone, icon: '#',
    }));
  }
  if (miniGame.id === 'food-origin' && miniGame.foodOrigin) {
    return miniGame.foodOrigin.choices.map((c, i) => ({
      optionNumber: c.optionNumber, command: c.command, label: c.label,
      tone: (['green', 'cyan', 'purple', 'orange'] as ChoiceTone[])[i] ?? 'green', icon: '🌍',
    }));
  }
  if (miniGame.id === 'guess-logo' && miniGame.guessLogo) {
    return miniGame.guessLogo.choices.map((c, i) => ({
      optionNumber: c.optionNumber, command: c.command, label: c.label,
      tone: (['cyan', 'pink', 'purple', 'orange'] as ChoiceTone[])[i] ?? 'cyan', icon: '★',
    }));
  }
  if (miniGame.id === 'maze-gates' && miniGame.mazeGates) {
    return miniGame.mazeGates.choices.map((c, i) => ({
      optionNumber: c.optionNumber, command: c.command, label: c.label,
      tone: (['cyan', 'purple', 'green', 'orange'] as ChoiceTone[])[i] ?? 'cyan', icon: '→',
    }));
  }
  return [];
}
