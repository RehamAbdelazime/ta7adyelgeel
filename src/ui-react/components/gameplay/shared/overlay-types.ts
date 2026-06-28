import type { ShapeCountShapeId, MemoryCountCell, MiniGameSnapshot, MiniGameId } from '../../../../game-core/minigames/minigame-types';
import type { QuestionDifficulty } from '../../../../game-core/questions/question-types';
import type { TranslationKey } from '../../../../game-core/localization/locale-types';
import type { TourPhase } from '../../../../game-core/tours/tour-types';
import { translations as translationsForLookup } from '../../../../game-core/localization/translations';

export const CHARACTER_IDS = ['cat', 'dog', 'cute_girl', 'flat_boy', 'female_person', 'male_person', 'red_hat', 'temple_runner', 'robot', 'stage_office', 'stage_chef'] as const;
export const CHARACTER_FRAME_COUNT = 10;
export const CHARACTER_IDLE_FRAME_MS = 155;
export const CHARACTER_SESSION_SEED = Math.floor(Math.random() * 1_000_000_000);

export type CharacterId = (typeof CHARACTER_IDS)[number];
export type CharacterAnimationName = 'idle' | 'walk' | 'run' | 'jump' | 'slide' | 'dead';
export const STATIC_NEUTRAL_IDLE_CHARACTERS = new Set<CharacterId>(['female_person', 'male_person', 'robot']);

export const SHAPE_COLORS: Record<ShapeCountShapeId, string> = {
  circle: '#36e8ff',
  square: '#ff5edb',
  triangle: '#ffe66d',
  star: '#5cffb1',
  diamond: '#9b5cff',
  hexagon: '#ffb53d',
};

export const MEMORY_ITEM_EMOJI: Record<MemoryCountCell['kind'], string> = {
  coin: '\u{1F7E1}',
  star: '\u{2B50}',
  gem: '\u{1F48E}',
  bolt: '\u{26A1}',
  heart: '\u{1F49C}',
  crown: '\u{1F451}',
};

export const DIFFICULTY_LABEL: Record<QuestionDifficulty, string> = {
  easy: 'EASY',
  medium: 'MEDIUM',
  hard: 'HARD',
};

export type ChoiceTone = 'cyan' | 'pink' | 'yellow' | 'green' | 'purple' | 'orange';
export type TranslateFn = (key: TranslationKey, params?: Record<string, string>) => string;

export type ChoiceSpotlightDefinition = {
  optionNumber: number;
  command: string;
  label: string;
  tone: ChoiceTone;
  icon: string;
};

export type CitizenSpotlightPlacement = {
  kind: 'choice';
  optionNumber: number;
  optionCount: number;
  groupIndex: number;
  tone: ChoiceTone;
  resultState: 'pending' | 'correct' | 'wrong';
};

export type CitizenSidePlacement = {
  kind: 'side';
  side: 'left' | 'right';
  groupIndex: number;
};

export type CitizenChampionPlacement = {
  kind: 'champion';
};

export type CitizenPlacement = CitizenSpotlightPlacement | CitizenSidePlacement | CitizenChampionPlacement;

export const PHASE_LABEL_KEY: Partial<Record<TourPhase, TranslationKey>> = {
  mini_game_intro: 'gameplay.phase.howToPlay',
  tour_starting: 'gameplay.phase.starting',
  answer_window_open: 'gameplay.phase.answerNow',
  scoring: 'gameplay.phase.roundScore',
  tour_complete: 'gameplay.phase.finalScore',
};

export function normalizeRuntimeAssetUrl(url: string | null | undefined): string {
  if (!url) return '';
  if (/^(https?:|data:|blob:|file:)/i.test(url)) return url;
  if (url.startsWith('./')) return url;
  if (url.startsWith('/')) return `.${url}`;
  return `./${url.replace(/^\/+/, '')}`;
}

export function getPairChoiceTone(choice: { value: string }): ChoiceTone {
  return choice.value === 'couple' ? 'pink' : 'cyan';
}

export function getChoiceTone(shape: ShapeCountShapeId): ChoiceTone {
  const tones: Record<ShapeCountShapeId, ChoiceTone> = {
    circle: 'cyan', square: 'pink', triangle: 'yellow',
    star: 'green', diamond: 'purple', hexagon: 'orange',
  };
  return tones[shape];
}

export function getShapeLabel(shape: ShapeCountShapeId, t?: TranslateFn): string {
  const keys: Record<ShapeCountShapeId, TranslationKey> = {
    circle: 'shape.label.circle', square: 'shape.label.square',
    triangle: 'shape.label.triangle', star: 'shape.label.star',
    diamond: 'shape.label.diamond', hexagon: 'shape.label.hexagon',
  };
  if (t) return t(keys[shape]);
  return ({ circle: 'Circle', square: 'Square', triangle: 'Triangle', star: 'Star', diamond: 'Diamond', hexagon: 'Hexagon' } as Record<ShapeCountShapeId, string>)[shape] ?? shape;
}

export function getShapeIcon(shape: ShapeCountShapeId): string {
  const icons: Record<ShapeCountShapeId, string> = {
    circle: '\u25CF', square: '\u25A0', triangle: '\u25B2',
    star: '\u2605', diamond: '\u25C6', hexagon: '\u2B22',
  };
  return icons[shape];
}

export function getMiniGameTitle(miniGameId: MiniGameId | null, locale: 'en' | 'ar'): string | null {
  if (!miniGameId) return null;
  const entry = MINI_GAME_BY_ID[miniGameId];
  if (!entry) return miniGameId;
  return translationsForLookup[locale]?.[entry.titleKey] ?? translationsForLookup.en[entry.titleKey] ?? miniGameId;
}

export function getCorrectAnswerText(miniGame: MiniGameSnapshot, t?: TranslateFn): string {
  if (miniGame.id === 'shape-count') {
    const answer = miniGame.correctAnswer as ShapeCountShapeId | null;
    const choice = answer ? miniGame.shapeGrid?.choices.find((c) => c.shape === answer) : null;
    return answer ? `${choice?.command ?? ''} ${getShapeLabel(answer)}`.trim() : '-';
  }
  if (miniGame.id === 'memory-count') return miniGame.memoryCount?.correctCount !== null && miniGame.memoryCount?.correctCount !== undefined ? String(miniGame.memoryCount.correctCount) : '-';
  if (miniGame.id === 'food-origin') return miniGame.foodOrigin?.correctCountry ?? '-';
  if (miniGame.id === 'couple-or-siblings') return miniGame.coupleOrSiblings?.correctAnswer === 'couple' ? 'Couple' : miniGame.coupleOrSiblings?.correctAnswer === 'siblings' ? 'Siblings' : '-';
  if (miniGame.id === 'guess-logo') return miniGame.guessLogo?.correctLogo ?? '-';
  if (miniGame.id === 'maze-gates') return miniGame.mazeGates?.correctOptionNumber ? (t ? t('gameplay.maze.correctGate', { answer: String(miniGame.mazeGates.correctOptionNumber) }) : `!${miniGame.mazeGates.correctOptionNumber}`) : '-';
  if (miniGame.id === 'hangman') return miniGame.hangman?.correctWord ?? '-';
  return miniGame.correctAnswer === 'true' ? `!1 ${t ? t('trueFake.true') : 'TRUE'}` : `!2 ${t ? t('trueFake.fake') : 'FAKE'}`;
}

export function getBottomStatus(phase: TourPhase, miniGame: MiniGameSnapshot): string {
  if (phase === 'answer_window_open') return 'TYPE YOUR ANSWER NOW';
  if (phase === 'tour_starting') return 'STARTING SOON';
  if (phase === 'scoring') return 'ROUND SCORE';
  return miniGame.instruction || 'GET READY';
}

export function getPhaseHelper(phase: TourPhase, t: TranslateFn): string {
  if (phase === 'tour_starting') return t('gameplay.helper.phase.tourStarting');
  if (phase === 'scoring') return t('gameplay.helper.phase.scoring');
  return t('gameplay.helper.phase.wait');
}import { MINI_GAME_BY_ID } from '../../../../game-core/minigames/minigame-registry';

