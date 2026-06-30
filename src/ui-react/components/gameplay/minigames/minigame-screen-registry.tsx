/**
 * MINI-GAME SCREEN REGISTRY
 *
 * Maps each MiniGameId to its React screen component.
 * This is the ONLY file that imports concrete screen components.
 *
 * To add a new screen: add one import and one entry here.
 * GameplayOverlay.tsx never needs to change.
 */

import type { ComponentType } from 'react';
import type { MiniGameSnapshot } from '../../../../game-core/minigames/minigame-types';
import type { TourPhase } from '../../../../game-core/tours/tour-types';
import type { MiniGameId } from '../../../../game-core/minigames/minigame-types';

import { FoodOriginScreen } from './FoodOriginScreen';
import { ShapeCountScreen } from './ShapeCountScreen';
import { MazeGatesScreen } from './MazeGatesScreen';
import { BeforeOrAfterScreen } from './BeforeOrAfterScreen';
import { GuessLogoScreen } from './GuessLogoScreen';
import { LuckyCupScreen } from './LuckyCupScreen';
import { MemoryCountScreen } from './MemoryCountScreen';
import { TrueFakeScreen } from './TrueFakeScreen';
import { HangmanScreen } from './HangmanScreen';
import { CoupleOrSiblingsScreen } from './CoupleOrSiblingsScreen';
import { CountTheBeatScreen } from './CountTheBeatScreen';

export type MiniGameScreenProps = {
  miniGame: MiniGameSnapshot;
  tourPhase: TourPhase;
};

/**
 * All screens that currently have implementations.
 * Games NOT in this map will show nothing when played.
 */
export const MINI_GAME_SCREENS: Partial<Record<MiniGameId, ComponentType<MiniGameScreenProps>>> = {
  'food-origin':        FoodOriginScreen,
  'shape-count':        ShapeCountScreen,
  'maze-gates':         MazeGatesScreen,
  'before-after':       BeforeOrAfterScreen,
  'guess-logo':         GuessLogoScreen,
  'lucky-cup':          LuckyCupScreen,
  'memory-count':       MemoryCountScreen,
  'true-fake':          TrueFakeScreen,
  hangman:              HangmanScreen,
  'couple-or-siblings': CoupleOrSiblingsScreen,
  'count-the-beat':       CountTheBeatScreen,
};
