import type { TourPhase } from '../../../game-core/tours/tour-types';

export type GameplayOverlayMode = 'final-score' | 'round-score' | 'tour-starting' | 'lobby' | 'mini-game';

/**
 * Score phases take precedence over the generic lobby/mini-game visibility flag.
 * This prevents a missing/late `hasRound` snapshot from hiding scoreboards.
 */
export function resolveGameplayOverlayMode(
  phase: TourPhase,
  isTourActive: boolean,
  shouldShowMiniGame: boolean,
): GameplayOverlayMode {
  if (phase === 'tour_complete') return 'final-score';
  if (phase === 'scoring') return 'round-score';
  if (isTourActive && phase === 'tour_starting') return 'tour-starting';
  if (!shouldShowMiniGame) return 'lobby';
  return 'mini-game';
}
