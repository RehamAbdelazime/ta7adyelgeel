/**
 * MINI-GAME REGISTRY — Single Source of Truth
 *
 * This is the ONE place to define a mini-game.
 * Adding a new mini-game means adding ONE entry here.
 * Everything else (picker UI, game-store, config) derives from this.
 *
 * SOLID adherence:
 *  - S: This file's only job is to describe what mini-games exist.
 *  - O: Add a game by adding an entry here — no other file needs changing
 *       (except wiring the screen component in minigame-screen-registry.tsx
 *        and the service in minigame-service-registry.ts, which are also
 *        the only places that NEED to know about concrete implementations).
 *  - D: Consumers depend on MiniGameRegistryEntry[], not on concrete games.
 */

import type { MiniGameId } from './minigame-types';
import type { TranslationKey } from '../localization/locale-types';

export type MiniGameSpeed = 'Fast' | 'Normal';

export type MiniGameRegistryEntry = {
  /** Unique identifier — must match MiniGameId */
  readonly id: MiniGameId;
  /** Emoji icon shown in the picker */
  readonly icon: string;
  /** Translation key for the game title */
  readonly titleKey: TranslationKey;
  /** Translation key for the short picker description */
  readonly noteKey: TranslationKey;
  /** Translation key for the longer description */
  readonly descriptionKey: TranslationKey;
  /** Three intro instruction steps shown before the round starts */
  readonly introSteps: readonly [TranslationKey, TranslationKey, TranslationKey];
  /** Pace shown in the picker */
  readonly speed: MiniGameSpeed;
  /** Default number of rounds in a single-game session */
  readonly defaultRounds: number;
  /**
   * Whether this game appears in the public-facing picker.
   * Set to false for games that are implemented but not yet
   * ready for production (they can still be force-started via QA panel).
   */
  readonly visibleInPicker: boolean;
};

/**
 * THE registry. One entry per mini-game.
 * Order here = order in the picker UI.
 */
export const MINI_GAME_REGISTRY: readonly MiniGameRegistryEntry[] = [
  {
    id: 'food-origin',
    icon: '🍔',
    titleKey: 'minigame.foodOrigin.title',
    noteKey: 'minigame.foodOrigin.note',
    descriptionKey: 'minigame.foodOrigin.description',
    introSteps: ['gameplay.intro.food.step1', 'gameplay.intro.food.step2', 'gameplay.intro.food.step3'],
    speed: 'Fast',
    defaultRounds: 3,
    visibleInPicker: true,
  },
  {
    id: 'shape-count',
    icon: '🎬',
    titleKey: 'minigame.shapeCount.title',
    noteKey: 'minigame.shapeCount.note',
    descriptionKey: 'minigame.shapeCount.description',
    introSteps: ['gameplay.intro.shape.step1', 'gameplay.intro.shape.step2', 'gameplay.intro.shape.step3'],
    speed: 'Normal',
    defaultRounds: 3,
    visibleInPicker: true,
  },
  {
    id: 'maze-gates',
    icon: '🧠',
    titleKey: 'minigame.mazeGates.title',
    noteKey: 'minigame.mazeGates.note',
    descriptionKey: 'minigame.mazeGates.description',
    introSteps: ['gameplay.intro.maze.step1', 'gameplay.intro.maze.step2', 'gameplay.intro.maze.step3'],
    speed: 'Normal',
    defaultRounds: 3,
    visibleInPicker: true,
  },
  {
    id: 'before-after',
    icon: '⏳',
    titleKey: 'minigame.beforeAfter.title',
    noteKey: 'minigame.beforeAfter.note',
    descriptionKey: 'minigame.beforeAfter.note',
    introSteps: ['gameplay.intro.beforeAfter.step1', 'gameplay.intro.beforeAfter.step2', 'gameplay.intro.beforeAfter.step3'],
    speed: 'Normal',
    defaultRounds: 3,
    visibleInPicker: true,
  },
  {
    id: 'guess-logo',
    icon: '✨',
    titleKey: 'minigame.guessLogo.title',
    noteKey: 'minigame.guessLogo.note',
    descriptionKey: 'minigame.guessLogo.description',
    introSteps: ['gameplay.intro.logo.step1', 'gameplay.intro.logo.step2', 'gameplay.intro.logo.step3'],
    speed: 'Fast',
    defaultRounds: 3,
    visibleInPicker: true,
  },
  {
    id: 'count-the-beat',
    icon: '🎵',
    titleKey: 'minigame.countTheBeat.title',
    noteKey: 'minigame.countTheBeat.note',
    descriptionKey: 'minigame.countTheBeat.description',
    introSteps: ['gameplay.intro.shape.step1', 'gameplay.intro.shape.step2', 'gameplay.intro.shape.step3'],
    speed: 'Fast',
    defaultRounds: 3,
    visibleInPicker: true,
  },
  {
    id: 'lucky-cup',
    icon: '🥤',
    titleKey: 'minigame.luckyCup.title',
    noteKey: 'minigame.luckyCup.note',
    descriptionKey: 'minigame.luckyCup.description',
    introSteps: ['gameplay.intro.shape.step1', 'gameplay.intro.shape.step2', 'gameplay.intro.shape.step3'],
    speed: 'Fast',
    defaultRounds: 3,
    visibleInPicker: true,
  },
  // ── Games that exist but are not yet shown in the public picker ─────────────
  {
    id: 'true-fake',
    icon: '✅',
    titleKey: 'minigame.trueFake.title',
    noteKey: 'minigame.trueFake.note',
    descriptionKey: 'minigame.trueFake.description',
    introSteps: ['gameplay.intro.trueFake.step1', 'gameplay.intro.trueFake.step2', 'gameplay.intro.trueFake.step3'],
    speed: 'Fast',
    defaultRounds: 3,
    visibleInPicker: false,
  },
  {
    id: 'memory-count',
    icon: '🧩',
    titleKey: 'minigame.memoryCount.title',
    noteKey: 'minigame.memoryCount.note',
    descriptionKey: 'minigame.memoryCount.description',
    introSteps: ['gameplay.intro.memory.step1', 'gameplay.intro.memory.step2', 'gameplay.intro.memory.step3'],
    speed: 'Normal',
    defaultRounds: 3,
    visibleInPicker: false,
  },
  {
    id: 'hangman',
    icon: '🔤',
    titleKey: 'minigame.hangman.title',
    noteKey: 'minigame.hangman.note',
    descriptionKey: 'minigame.hangman.description',
    introSteps: ['gameplay.intro.hangman.step1', 'gameplay.intro.hangman.step2', 'gameplay.intro.hangman.step3'],
    speed: 'Normal',
    defaultRounds: 3,
    visibleInPicker: false,
  },
  {
    id: 'couple-or-siblings',
    icon: '👥',
    titleKey: 'minigame.coupleOrSiblings.title',
    noteKey: 'minigame.coupleOrSiblings.note',
    descriptionKey: 'minigame.coupleOrSiblings.description',
    introSteps: ['gameplay.intro.pair.step1', 'gameplay.intro.pair.step2', 'gameplay.intro.pair.step3'],
    speed: 'Fast',
    defaultRounds: 3,
    visibleInPicker: false,
  },
] as const;

/** All registered game IDs — derived, never manually listed elsewhere */
export const MINI_GAME_IDS = MINI_GAME_REGISTRY.map((g) => g.id) as MiniGameId[];

/** Games shown in the public picker — derived from visibleInPicker flag */
export const PICKER_MINI_GAME_IDS = MINI_GAME_REGISTRY
  .filter((g) => g.visibleInPicker)
  .map((g) => g.id) as MiniGameId[];

/** Fast lookup by ID */
export const MINI_GAME_BY_ID: Readonly<Record<MiniGameId, MiniGameRegistryEntry>> =
  Object.fromEntries(MINI_GAME_REGISTRY.map((g) => [g.id, g])) as Record<MiniGameId, MiniGameRegistryEntry>;
