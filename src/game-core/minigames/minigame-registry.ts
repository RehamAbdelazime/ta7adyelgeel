/**
 * MINI-GAME REGISTRY — Canonical game catalog
 *
 * This is the canonical catalog of mini-games.
 * It owns game identity, UI metadata, and release eligibility.
 * Runtime enablement and tour rotation are owned by gameplay-config.json.
 *
 * SOLID adherence:
 *  - S: This file's only job is to describe what mini-games exist.
 *  - O: Add a game by adding an entry here — no other file needs changing
 *       (except wiring the screen component in minigame-screen-registry.tsx
 *        and the service in minigame-service-registry.ts, which are also
 *        the only places that NEED to know about concrete implementations).
 *  - D: Consumers depend on MiniGameRegistryEntry[], not on concrete games.
 */

import type { TranslationKey } from '../localization/locale-types';

export type MiniGameSpeed = 'Fast' | 'Normal';

export type MiniGameRegistryEntry = {
  /** Unique identifier. MiniGameId is inferred from the registry entries below. */
  readonly id: string;
  /** Emoji icon shown in the picker */
  readonly icon: string;
  /** Translation key for the game title */
  readonly titleKey: TranslationKey;
  /** Translation key for the short picker description */
  readonly noteKey: TranslationKey;
  /** Description string (free text, not in TranslationKey union) */
  readonly descriptionKey: string;
  /** Three intro instruction steps shown before the round starts */
  readonly introSteps: readonly [TranslationKey, TranslationKey, TranslationKey];
  /** Pace shown in the picker */
  readonly speed: MiniGameSpeed;
  /** Release eligibility. Runtime enablement is configured separately. */
  readonly availability: 'public' | 'qa-only';
};

/**
 * THE registry. One entry per mini-game.
 * Order here = order in the picker UI.
 */
export const MINI_GAME_REGISTRY = [
  {
    id: 'food-origin',
    icon: '🍔',
    titleKey: 'minigame.foodOrigin.title',
    noteKey: 'minigame.foodOrigin.note',
    descriptionKey: 'minigame.foodOrigin.description',
    introSteps: ['gameplay.intro.food.step1', 'gameplay.intro.food.step2', 'gameplay.intro.food.step3'],
    speed: 'Fast',
    availability: 'public',
  },
  {
    id: 'shape-count',
    icon: '🎬',
    titleKey: 'minigame.shapeCount.title',
    noteKey: 'minigame.shapeCount.note',
    descriptionKey: 'minigame.shapeCount.description',
    introSteps: ['gameplay.intro.shape.step1', 'gameplay.intro.shape.step2', 'gameplay.intro.shape.step3'],
    speed: 'Normal',
    availability: 'public',
  },
  {
    id: 'maze-gates',
    icon: '🧠',
    titleKey: 'minigame.mazeGates.title',
    noteKey: 'minigame.mazeGates.note',
    descriptionKey: 'minigame.mazeGates.description',
    introSteps: ['gameplay.intro.maze.step1', 'gameplay.intro.maze.step2', 'gameplay.intro.maze.step3'],
    speed: 'Normal',
    availability: 'public',
  },
  {
    id: 'before-after',
    icon: '⏳',
    titleKey: 'minigame.beforeAfter.title',
    noteKey: 'minigame.beforeAfter.note',
    descriptionKey: 'minigame.beforeAfter.note',
    introSteps: ['gameplay.intro.beforeAfter.step1', 'gameplay.intro.beforeAfter.step2', 'gameplay.intro.beforeAfter.step3'],
    speed: 'Normal',
    availability: 'public',
  },
  {
    id: 'guess-logo',
    icon: '✨',
    titleKey: 'minigame.guessLogo.title',
    noteKey: 'minigame.guessLogo.note',
    descriptionKey: 'minigame.guessLogo.description',
    introSteps: ['gameplay.intro.logo.step1', 'gameplay.intro.logo.step2', 'gameplay.intro.logo.step3'],
    speed: 'Fast',
    availability: 'public',
  },
  {
    id: 'count-the-beat',
    icon: '🎵',
    titleKey: 'minigame.countTheBeat.title',
    noteKey: 'minigame.countTheBeat.note',
    descriptionKey: 'minigame.countTheBeat.description',
    introSteps: ['gameplay.intro.beat.step1', 'gameplay.intro.beat.step2', 'gameplay.intro.beat.step3'],
    speed: 'Fast',
    availability: 'public',
  },
  {
    id: 'lucky-cup',
    icon: '🥤',
    titleKey: 'minigame.luckyCup.title',
    noteKey: 'minigame.luckyCup.note',
    descriptionKey: 'minigame.luckyCup.description',
    introSteps: ['gameplay.intro.lucky.step1', 'gameplay.intro.lucky.step2', 'gameplay.intro.lucky.step3'],
    speed: 'Fast',
    availability: 'public',
  },
  // ══════════════════════════════════════════════════════════════════════════
  // Implemented but unreleased games remain QA-only until explicitly promoted.
  // True or Fake is public; the remaining three are reserved for QA.
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'true-fake',
    icon: '✅',
    titleKey: 'minigame.trueFake.title',
    noteKey: 'minigame.trueFake.note',
    descriptionKey: 'minigame.trueFake.description',
    introSteps: ['gameplay.intro.trueFake.step1', 'gameplay.intro.trueFake.step2', 'gameplay.intro.trueFake.step3'],
    speed: 'Fast',
    availability: 'public',
  },
  {
    id: 'memory-count',
    icon: '🧩',
    titleKey: 'minigame.memoryCount.title',
    noteKey: 'minigame.memoryCount.note',
    descriptionKey: 'minigame.memoryCount.description',
    introSteps: ['gameplay.intro.memory.step1', 'gameplay.intro.memory.step2', 'gameplay.intro.memory.step3'],
    speed: 'Normal',
    availability: 'qa-only',
  },
  {
    id: 'hangman',
    icon: '🔤',
    titleKey: 'minigame.hangman.title',
    noteKey: 'minigame.hangman.note',
    descriptionKey: 'minigame.hangman.description',
    introSteps: ['gameplay.intro.hangman.step1', 'gameplay.intro.hangman.step2', 'gameplay.intro.hangman.step3'],
    speed: 'Normal',
    availability: 'qa-only',
  },
  {
    id: 'couple-or-siblings',
    icon: '👥',
    titleKey: 'minigame.coupleOrSiblings.title',
    noteKey: 'minigame.coupleOrSiblings.note',
    descriptionKey: 'minigame.coupleOrSiblings.description',
    introSteps: ['gameplay.intro.pair.step1', 'gameplay.intro.pair.step2', 'gameplay.intro.pair.step3'],
    speed: 'Fast',
    availability: 'qa-only',
  },
] as const satisfies readonly MiniGameRegistryEntry[];

/** The MiniGameId union is derived from the catalog, never maintained separately. */
export type MiniGameId = (typeof MINI_GAME_REGISTRY)[number]['id'];

/** All registered game IDs, including QA-only games. */
export const MINI_GAME_IDS = MINI_GAME_REGISTRY.map((game) => game.id) as MiniGameId[];

/** Games eligible for public-facing play. Runtime enablement is applied by consumers. */
export const PUBLIC_MINI_GAME_IDS = MINI_GAME_REGISTRY
  .filter((game) => game.availability === 'public')
  .map((game) => game.id) as MiniGameId[];

/** Public games optionally narrowed by the current runtime-enabled list. */
export function getPublicMiniGames(enabledMiniGameIds?: readonly MiniGameId[]) {
  const enabled = enabledMiniGameIds ? new Set(enabledMiniGameIds) : null;

  return MINI_GAME_REGISTRY.filter((game) =>
    game.availability === 'public' && (!enabled || enabled.has(game.id)),
  );
}

/** Fast lookup by ID */
export const MINI_GAME_BY_ID: Readonly<Record<MiniGameId, MiniGameRegistryEntry>> =
  Object.fromEntries(MINI_GAME_REGISTRY.map((g) => [g.id, g])) as Record<MiniGameId, MiniGameRegistryEntry>;
