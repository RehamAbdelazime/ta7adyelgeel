/**
 * Seeded pseudo-random number generator using Mulberry32.
 *
 * Why Mulberry32 over Math.random():
 * - Deterministic: same seed = same output every time (consistent on reconnect)
 * - Fast: single integer operation per call, no entropy pool access
 * - Good distribution: passes BigCrush statistical tests
 * - Seedable: seed from question data so each question gets its own shuffle
 *
 * Math.random() problems for game use:
 * - Non-deterministic: different result on every call, including reconnects
 * - No seed control: cannot reproduce or test specific orderings
 * - Entropy pool: may block in low-entropy environments
 */

/** Mulberry32 PRNG — returns a callable that produces [0, 1) floats */
function mulberry32(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 0x100000000;
  };
}

/** djb2 hash — converts any string to a stable 32-bit integer seed */
function stringToSeed(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/**
 * Returns a shuffled copy of an array, deterministically seeded by a string.
 *
 * Use a string that is unique per question and per round so the same
 * question always shows the same order within a round, but a different
 * order when the question appears again in a later round.
 *
 * @example
 * seededShuffle(choices, `${miniGame.roundNumber}:${food.dishName}`)
 */
export function seededShuffle<T>(arr: readonly T[], seedString: string): T[] {
  const random = mulberry32(stringToSeed(seedString));
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
