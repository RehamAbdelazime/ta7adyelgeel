import type { CitizenRuntime } from '../../../../game-core/citizens/citizen-types';

/** Keep a stable front row and reserve some capacity for newer/active participants.
 * Official and spectator eligibility lives in GameStore; visualization does not
 * change anyone's score or status. */
export const MAX_VISIBLE_AUDIENCE = 72;
const GUARANTEED_STABLE_SLOTS = 48;

export function getVisibleAudience(
  citizens: readonly CitizenRuntime[],
  broadcasterUserId: string | null | undefined,
  activeAnswerUserIds: ReadonlySet<string> = new Set<string>(),
): CitizenRuntime[] {
  const candidates = citizens.filter((citizen) => !broadcasterUserId || citizen.twitchUserId !== broadcasterUserId);
  if (candidates.length <= MAX_VISIBLE_AUDIENCE) return candidates;

  // Preserve the first 48 positions, so the entire stage does not reshuffle
  // when a new viewer answers. Remaining slots favor recent responders and
  // arrivals, giving active Spectators a chance to appear on a crowded stream.
  const pinned = candidates.slice(0, GUARANTEED_STABLE_SLOTS);
  const extras = candidates.slice(GUARANTEED_STABLE_SLOTS).sort((a, b) => {
    const answering = Number(activeAnswerUserIds.has(b.twitchUserId)) - Number(activeAnswerUserIds.has(a.twitchUserId));
    return answering || b.joinedAt - a.joinedAt || a.twitchUserId.localeCompare(b.twitchUserId);
  });
  return [...pinned, ...extras.slice(0, MAX_VISIBLE_AUDIENCE - pinned.length)];
}
