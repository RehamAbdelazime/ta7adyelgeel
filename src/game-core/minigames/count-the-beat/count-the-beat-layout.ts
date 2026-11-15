/** The visual guide and the question generator use these same row positions.
 * No UI-specific dependency or duplicated difficulty mapping. */
export function getBeatLanePositions(rows: number): readonly number[] {
  if (rows === 1) return [50];
  if (rows === 2) return [34, 66];
  if (rows === 4) return [16, 38.5, 61.5, 84];
  return [50];
}
