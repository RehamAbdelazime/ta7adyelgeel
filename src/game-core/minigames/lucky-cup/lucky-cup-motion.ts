/**
 * Single source of truth for Lucky Cup's shown shuffle and answer position.
 * Swap `a`/`b` refer to SLOTS, never permanent cup IDs.
 * The service generates the swaps and computes the correct answer from the same
 * order of operations; the renderer must never randomize cup movement itself.
 */
export type LuckyCupSlotSwap = {
  id: string;
  a: number;
  b: number;
  delayMs: number;
  durationMs: number;
};

export const LUCKY_CUP_OPEN_HOLD_MS = 1800;
export const LUCKY_CUP_LOWER_MS = 500;
export const LUCKY_CUP_SHUFFLE_START_MS = LUCKY_CUP_OPEN_HOLD_MS + LUCKY_CUP_LOWER_MS + 150;
export const LUCKY_CUP_SETTLE_MS = 950;

export type CupMotionFrame = {
  cupId: number;
  /** Current horizontal slot, including in-between values while swapping. */
  slot: number;
  /** A unit-height offset (0..1) to give both moving cups readable arcs. */
  arc: number;
  tilt: number;
  layer: number;
};

export function getLuckyCupShuffleEndMs(swaps: readonly LuckyCupSlotSwap[]): number {
  return LUCKY_CUP_SHUFFLE_START_MS + swaps.reduce(
    (max, swap) => Math.max(max, swap.delayMs + swap.durationMs), 0,
  );
}

export function getLuckyCupPreparationMs(swaps: readonly LuckyCupSlotSwap[]): number {
  return getLuckyCupShuffleEndMs(swaps) + LUCKY_CUP_SETTLE_MS;
}

export function getLuckyCupOrder(swaps: readonly LuckyCupSlotSwap[]): number[] {
  const order = [0, 1, 2];
  for (const swap of swaps) {
    if (!isValidSwap(swap)) continue;
    [order[swap.a], order[swap.b]] = [order[swap.b], order[swap.a]];
  }
  return order;
}

function isValidSwap(swap: LuckyCupSlotSwap): boolean {
  return Number.isInteger(swap.a) && Number.isInteger(swap.b)
    && swap.a >= 0 && swap.a <= 2 && swap.b >= 0 && swap.b <= 2
    && swap.a !== swap.b && swap.durationMs > 0 && swap.delayMs >= 0;
}

function easeInOut(t: number): number {
  return t * t * (3 - 2 * t);
}

/**
 * The animation is a pure function of the Tour phase's elapsed time.
 * Pausing/resuming, skipped frames, remounting and window throttling cannot
 * desynchronize the visual answer from the underlying service's swap plan.
 */
export function getLuckyCupMotion(
  swaps: readonly LuckyCupSlotSwap[],
  phaseElapsedMs: number,
): CupMotionFrame[] {
  const elapsed = Math.max(0, phaseElapsedMs - LUCKY_CUP_SHUFFLE_START_MS);
  const order = [0, 1, 2];
  let active: LuckyCupSlotSwap | null = null;
  for (const swap of swaps) {
    if (!isValidSwap(swap)) continue;
    if (elapsed >= swap.delayMs + swap.durationMs) {
      [order[swap.a], order[swap.b]] = [order[swap.b], order[swap.a]];
    } else if (elapsed >= swap.delayMs && active === null && phaseElapsedMs >= LUCKY_CUP_SHUFFLE_START_MS) {
      active = swap;
    }
  }

  const frames = order.map((cupId, slot): CupMotionFrame => ({ cupId, slot, arc: 0, tilt: 0, layer: 0 }));
  if (!active) return frames;
  const progress = Math.max(0, Math.min(1, (elapsed - active.delayMs) / active.durationMs));
  const eased = easeInOut(progress);
  const climb = Math.sin(progress * Math.PI);
  const fromA = frames[active.a];
  const fromB = frames[active.b];
  fromA.slot = active.a + (active.b - active.a) * eased;
  fromB.slot = active.b + (active.a - active.b) * eased;
  fromA.arc = climb;
  fromB.arc = climb * 0.34;
  fromA.tilt = Math.sin(progress * Math.PI * 2) * 2.3;
  fromB.tilt = -Math.sin(progress * Math.PI * 2) * 2;
  fromA.layer = 2;
  fromB.layer = 1;
  return frames;
}

export function getLuckyCupInitialLift(phaseElapsedMs: number): number {
  if (phaseElapsedMs <= LUCKY_CUP_OPEN_HOLD_MS) return 1;
  const closing = Math.min(1, Math.max(0, (phaseElapsedMs - LUCKY_CUP_OPEN_HOLD_MS) / LUCKY_CUP_LOWER_MS));
  return 1 - easeInOut(closing);
}
