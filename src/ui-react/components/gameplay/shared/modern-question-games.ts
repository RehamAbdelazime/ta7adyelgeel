import type { MiniGameId } from '../../../../game-core/minigames/minigame-types';

/**
 * All 10 registered games now use the same question HUD (V32).
 * Choice-based rounds use a bottom answer row; numeric challenges use a
 * full-focus artwork panel, but share header/timer/reveal/footer geometry.
 * Citizen movement follows the same per-game answer-zone configuration.
 * Host answers remain a single stage-mounted pod (V31).
 */
const MODERN_QUESTION_GAME_IDS: ReadonlySet<MiniGameId> = new Set<MiniGameId>([
  'food-origin',
  'maze-gates',
  'shape-count',
  'guess-movie',
  'guess-star',
  'couple-or-siblings',
  'lucky-cup',
  'laser-challenge',
  'count-the-beat',
  'memory-count',
]);

export function usesModernQuestionUi(miniGameId: MiniGameId): boolean {
  return MODERN_QUESTION_GAME_IDS.has(miniGameId);
}
