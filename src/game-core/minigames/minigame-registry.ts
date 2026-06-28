import type { MiniGameDefinition, MiniGameId } from './minigame-types';

export const MINI_GAME_MODULES: Record<MiniGameId, MiniGameDefinition> = {
  'true-fake': {
    id: 'true-fake',
    titleKey: 'minigame.trueFake.title',
    descriptionKey: 'minigame.trueFake.description',
    modulePath: './true-fake/true-fake-service',
  },
  'shape-count': {
    id: 'shape-count',
    titleKey: 'minigame.shapeCount.title',
    descriptionKey: 'minigame.shapeCount.description',
    modulePath: './shape-count/shape-count-service',
  },
  'memory-count': {
    id: 'memory-count',
    titleKey: 'minigame.memoryCount.title',
    descriptionKey: 'minigame.memoryCount.description',
    modulePath: './memory-count/memory-count-service',
  },
  'food-origin': {
    id: 'food-origin',
    titleKey: 'minigame.foodOrigin.title',
    descriptionKey: 'minigame.foodOrigin.description',
    modulePath: './food-origin/food-origin-service',
  },
  'before-after': {
    id: 'before-after',
    titleKey: 'minigame.beforeAfter.title',
    descriptionKey: 'minigame.beforeAfter.note',
    modulePath: './before-or-after/before-or-after-service',
  },
  'guess-logo': {
    id: 'guess-logo',
    titleKey: 'minigame.guessLogo.title',
    descriptionKey: 'minigame.guessLogo.description',
    modulePath: './guess-logo/guess-logo-service',
  },
  'maze-gates': {
    id: 'maze-gates',
    titleKey: 'minigame.mazeGates.title',
    descriptionKey: 'minigame.mazeGates.description',
    modulePath: './maze-gates/maze-gates-service',
  },
  hangman: {
    id: 'hangman',
    titleKey: 'minigame.hangman.title',
    descriptionKey: 'minigame.hangman.description',
    modulePath: './hangman/hangman-service',
  },
  'couple-or-siblings': {
    id: 'couple-or-siblings',
    titleKey: 'minigame.coupleOrSiblings.title',
    descriptionKey: 'minigame.coupleOrSiblings.description',
    modulePath: './couple-or-siblings/couple-or-siblings-service',
  },
  'count-the-beat': {
    id: 'count-the-beat',
    titleKey: 'minigame.countTheBeat.title',
    descriptionKey: 'minigame.countTheBeat.description',
    modulePath: './count-the-beat/count-the-beat-service',
  },
  'lucky-cup': {
    id: 'lucky-cup',
    titleKey: 'minigame.luckyCup.title',
    descriptionKey: 'minigame.luckyCup.description',
    modulePath: './lucky-cup/lucky-cup-service',
  },
};
