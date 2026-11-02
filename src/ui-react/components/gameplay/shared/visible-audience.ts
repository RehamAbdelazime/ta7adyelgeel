import type { CitizenRuntime } from '../../../../game-core/citizens/citizen-types';

/** The floor is capped at 72 sprites and never renders the connected broadcaster.
 * Reuse this selector for both the scene and its counter so their totals cannot drift.
 */
export const MAX_VISIBLE_AUDIENCE = 72;

export function getVisibleAudience(
  citizens: readonly CitizenRuntime[],
  broadcasterUserId: string | null | undefined,
): CitizenRuntime[] {
  return citizens
    .filter((citizen) => !broadcasterUserId || citizen.twitchUserId !== broadcasterUserId)
    .slice(0, MAX_VISIBLE_AUDIENCE);
}
