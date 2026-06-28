// Random utilities used by question selection.
// Prefer Web Crypto so first-round questions do not accidentally become source-order biased.
export function randomUnit(): number {
  const cryptoObject = globalThis.crypto;

  if (cryptoObject?.getRandomValues) {
    const buffer = new Uint32Array(1);
    cryptoObject.getRandomValues(buffer);
    return buffer[0] / 0x1_0000_0000;
  }

  return Math.random();
}

export function randomIntExclusive(maxExclusive: number): number {
  if (!Number.isFinite(maxExclusive) || maxExclusive <= 0) return 0;
  return Math.floor(randomUnit() * maxExclusive);
}

export function shuffleRandom<T>(items: readonly T[]): T[] {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = randomIntExclusive(index + 1);
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }

  return copy;
}
