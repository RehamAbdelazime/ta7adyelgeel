import type { MiniGameId } from '../../../../game-core/minigames/minigame-types';

/**
 * All 11 registered games now use the same question HUD (V32).
 * Choice-based rounds use a bottom answer row; numeric/word challenges use a
 * full-focus artwork panel, but share header/timer/reveal/footer geometry.
 * Citizen movement follows the same per-game answer-zone configuration.
 * Host answers remain a single stage-mounted pod (V31).
 */
const MODERN_QUESTION_GAME_IDS: ReadonlySet<MiniGameId> = new Set<MiniGameId>([
  'food-origin',
  'maze-gates',
  'shape-count',
  'guess-logo',
  'couple-or-siblings',
  'true-fake',
  'lucky-cup',
  'before-after',
  'count-the-beat',
  'memory-count',
  'hangman',
]);

export function usesModernQuestionUi(miniGameId: MiniGameId): boolean {
  return MODERN_QUESTION_GAME_IDS.has(miniGameId);
}
