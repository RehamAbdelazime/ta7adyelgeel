/** V52: local-only bounded movie history. No names/answers/player identifiers stored. */
import { POSTER_REVEAL_MODES, type PosterPlayEntry, type PosterRevealPlan } from './poster-mystery';

export interface PosterHistoryStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}
export const POSTER_HISTORY_KEY = 'ta7ady:movie-poster-history:v1';
export type PosterHistory = { version: 1; sequence: number; entries: Record<string, PosterPlayEntry> };
export const emptyPosterHistory = (): PosterHistory => ({ version: 1, sequence: 0, entries: {} });
export function browserPosterStorage(): PosterHistoryStorage | null {
  try { return typeof window !== 'undefined' ? window.localStorage : null; } catch { return null; }
}
export function readPosterHistory(storage: PosterHistoryStorage | null): PosterHistory {
  try {
    const raw = storage?.getItem(POSTER_HISTORY_KEY);
    if (!raw || raw.length > 100_000) return emptyPosterHistory();
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return emptyPosterHistory();
    const data = parsed as Partial<PosterHistory>;
    if (data.version !== 1 || !data.entries || typeof data.entries !== 'object' || Array.isArray(data.entries)) return emptyPosterHistory();
    const safe = emptyPosterHistory();
    safe.sequence = boundedInt(data.sequence, 0, 10_000_000);
    for (const [id, entry] of Object.entries(data.entries).slice(0, 150)) {
      if (!/^movie-[\w-]{1,100}$/.test(id) || !entry || typeof entry !== 'object') continue;
      const plays = boundedInt(entry.plays, 0, 100_000);
      if (plays < 1) continue;
      const modes: PosterPlayEntry['modeUses'] = {};
      for (const mode of POSTER_REVEAL_MODES) {
        const count = boundedInt(entry.modeUses?.[mode], 0, 100_000);
        if (count) modes[mode] = count;
      }
      safe.entries[id] = { plays, lastPlayedSeq: boundedInt(entry.lastPlayedSeq, 0, 10_000_000),
        lastMode: POSTER_REVEAL_MODES.includes(entry.lastMode!) ? entry.lastMode : undefined,
        lastPattern: boundedInt(entry.lastPattern, 0, 1_000_000), modeUses: modes };
    }
    return safe;
  } catch { return emptyPosterHistory(); }
}
function boundedInt(value: unknown, min: number, max: number): number {
  return Number.isSafeInteger(value) ? Math.max(min, Math.min(max, value as number)) : min;
}
export function rememberPosterPlay(history: PosterHistory, id: string, plan: PosterRevealPlan, storage: PosterHistoryStorage | null): void {
  const previous = history.entries[id];
  history.sequence += 1;
  history.entries[id] = {
    plays: (previous?.plays ?? 0) + 1,
    lastPlayedSeq: history.sequence,
    lastMode: plan.mode,
    lastPattern: plan.pattern,
    modeUses: { ...previous?.modeUses, [plan.mode]: (previous?.modeUses?.[plan.mode] ?? 0) + 1 },
  };
  // Keep only the latest 100 poster IDs; the current pack contains 50.
  const keys = Object.keys(history.entries);
  if (keys.length > 100) {
    keys.sort((a, b) => history.entries[a].lastPlayedSeq - history.entries[b].lastPlayedSeq);
    for (const old of keys.slice(0, keys.length - 100)) delete history.entries[old];
  }
  try { storage?.setItem(POSTER_HISTORY_KEY, JSON.stringify(history)); } catch { /* Quota, private mode: runtime memory still works */ }
}
