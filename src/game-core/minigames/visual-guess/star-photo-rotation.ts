/** V67 — Offline repeat-aware portrait rotation for Guess the Star.
 * - Never treats two photos of one celebrity as two separate answer choices.
 * - Tries every photo of that person before cycling.
 * - Remembers photo usage across app restarts; new photos enter at zero plays.
 * - Safe on denied or corrupt localStorage; no viewer/host data collected.
 */
import type { PosterHistoryStorage } from './poster-history';
export type StarPhotoVariant = { id: string; asset: string; eyesAsset: string };
export const STAR_PHOTO_HISTORY_KEY = 'ta7ady:star-photo-history:v1';
type StarPhotoHistoryEntry = { used: Record<string, number>; last?: string };
type StarPhotoHistory = { version: 1; people: Record<string, StarPhotoHistoryEntry> };
const fresh = (): StarPhotoHistory => ({ version: 1, people: {} });
function readHistory(storage: PosterHistoryStorage | null): StarPhotoHistory {
  try {
    const raw = storage?.getItem(STAR_PHOTO_HISTORY_KEY);
    if (!raw || raw.length > 60000) return fresh();
    const data: unknown = JSON.parse(raw);
    if (!data || typeof data !== 'object' || (data as StarPhotoHistory).version !== 1) return fresh();
    const out = fresh();
    for (const [person, entry] of Object.entries((data as StarPhotoHistory).people ?? {}).slice(-250)) {
      if (!/^[a-z0-9-]{2,100}$/.test(person) || !entry || typeof entry !== 'object') continue;
      const safe: StarPhotoHistoryEntry = { used: {} };
      for (const [id, count] of Object.entries(entry.used ?? {}).slice(-30)) {
        if (/^star-uploaded-\d{2,}$/.test(id) && Number.isSafeInteger(count) && count >= 0) safe.used[id] = Math.min(100000, count);
      }
      if (typeof entry.last === 'string' && /^star-uploaded-\d{2,}$/.test(entry.last)) safe.last = entry.last;
      out.people[person] = safe;
    }
    return out;
  } catch { return fresh(); }
}
export function pickStarPhotoVariant(
  personKey: string,
  variants: readonly StarPhotoVariant[],
  rng: () => number,
  storage: PosterHistoryStorage | null,
): StarPhotoVariant {
  if (!variants.length) throw Error(`${personKey}: star has no local image variants`);
  if (!/^[a-z0-9-]{2,100}$/.test(personKey)) throw Error(`Unsafe star personKey: ${personKey}`);
  const history = readHistory(storage);
  const prior = history.people[personKey] ?? { used: {} };
  // Do not mix photo identities: every variant is validated by the generator as
  // belonging to this same personKey. Incomplete names are excluded entirely.
  const min = Math.min(...variants.map(variant => prior.used[variant.id] ?? 0));
  let candidates = variants.filter(variant => (prior.used[variant.id] ?? 0) === min);
  const withoutLast = candidates.filter(variant => variant.id !== prior.last);
  if (withoutLast.length) candidates = withoutLast;
  const chosen = candidates[Math.min(candidates.length - 1, Math.floor(rng() * candidates.length))];
  const next: StarPhotoHistoryEntry = {
    used: { ...prior.used, [chosen.id]: Math.min(100000, (prior.used[chosen.id] ?? 0) + 1) }, last: chosen.id,
  };
  history.people[personKey] = next;
  try { storage?.setItem(STAR_PHOTO_HISTORY_KEY, JSON.stringify(history)); } catch { /* Per-session fallback. */ }
  return chosen;
}
