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
import { VisualGuessScreen } from './VisualGuessScreen';
import { LuckyCupScreen } from './LuckyCupScreen';
import { LaserChallengeScreen } from './LaserChallengeScreen';
import { MemoryCountScreen } from './MemoryCountScreen';
import { CoupleOrSiblingsScreen } from './CoupleOrSiblingsScreen';
import { CountTheBeatScreen } from './CountTheBeatScreen';

export type MiniGameScreenProps = {
  miniGame: MiniGameSnapshot;
  tourPhase: TourPhase;
};

/**
 * Every registered game must have a screen. Record (not Partial<Record>)
 * deliberately makes an un-wired game a TypeScript error.
 */
export const MINI_GAME_SCREENS: Record<MiniGameId, ComponentType<MiniGameScreenProps>> = {
  'food-origin':        FoodOriginScreen,
  'shape-count':        ShapeCountScreen,
  'maze-gates':         MazeGatesScreen,
  'guess-movie':        VisualGuessScreen,
  'guess-star':         VisualGuessScreen,
  'lucky-cup':          LuckyCupScreen,
  'laser-challenge':    LaserChallengeScreen,
  'memory-count':       MemoryCountScreen,
  'couple-or-siblings': CoupleOrSiblingsScreen,
  'count-the-beat':       CountTheBeatScreen,
};
