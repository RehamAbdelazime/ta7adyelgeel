/** V52: local-only bounded movie history. No names/answers/player identifiers stored. */
import type { MovieClueKind } from './visual-guess-service';
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
    for (const [id, entry] of Object.entries(data.entries).slice(0, 500)) {
      if (!/^movie-[\w-]{1,100}$/.test(id) || !entry || typeof entry !== 'object') continue;
      const plays = boundedInt(entry.plays, 0, 100_000);
      if (plays < 1) continue;
      const modes: PosterPlayEntry['modeUses'] = {};
      for (const mode of POSTER_REVEAL_MODES) {
        const count = boundedInt(entry.modeUses?.[mode], 0, 100_000);
        if (count) modes[mode] = count;
      }
      const rawKinds = entry as PosterPlayEntry & { kindUses?: Partial<Record<MovieClueKind, number>>; lastKind?: MovieClueKind; lastClueId?: string };
      const kindUses: Partial<Record<MovieClueKind, number>> = {};
      for (const kind of ['poster', 'frame', 'quote'] as const) {
        const count = boundedInt(rawKinds.kindUses?.[kind], 0, 100_000);
        if (count) kindUses[kind] = count;
      }
      safe.entries[id] = { kindUses, lastKind: ['poster','frame','quote'].includes(rawKinds.lastKind ?? '') ? rawKinds.lastKind : undefined,
        lastClueId: typeof rawKinds.lastClueId === 'string' && rawKinds.lastClueId.length < 200 ? rawKinds.lastClueId : undefined,
        plays, lastPlayedSeq: boundedInt(entry.lastPlayedSeq, 0, 10_000_000),
        lastMode: POSTER_REVEAL_MODES.includes(entry.lastMode!) ? entry.lastMode : undefined,
        lastPattern: boundedInt(entry.lastPattern, 0, 1_000_000), modeUses: modes };
    }
    return safe;
  } catch { return emptyPosterHistory(); }
}
function boundedInt(value: unknown, min: number, max: number): number {
  return Number.isSafeInteger(value) ? Math.max(min, Math.min(max, value as number)) : min;
}
export function rememberPosterPlay(history: PosterHistory, id: string, plan: PosterRevealPlan | null, storage: PosterHistoryStorage | null, kind: MovieClueKind = 'poster', clueId = `poster:${id}`): void {
  const previous = history.entries[id];
  history.sequence += 1;
  history.entries[id] = {
    plays: (previous?.plays ?? 0) + 1,
    lastPlayedSeq: history.sequence,
    lastMode: plan?.mode ?? previous?.lastMode,
    lastPattern: plan?.pattern ?? previous?.lastPattern,
    modeUses: plan ? { ...previous?.modeUses, [plan.mode]: (previous?.modeUses?.[plan.mode] ?? 0) + 1 } : (previous?.modeUses ?? {}),
    lastKind: kind, lastClueId: clueId,
    kindUses: { ...previous?.kindUses, [kind]: (previous?.kindUses?.[kind] ?? 0) + 1 },
  };
  // Keep plenty of room for expanded local poster and frame libraries.
  const keys = Object.keys(history.entries);
  if (keys.length > 500) {
    keys.sort((a, b) => history.entries[a].lastPlayedSeq - history.entries[b].lastPlayedSeq);
    for (const old of keys.slice(0, keys.length - 500)) delete history.entries[old];
  }
  try { storage?.setItem(POSTER_HISTORY_KEY, JSON.stringify(history)); } catch { /* Quota, private mode: runtime memory still works */ }
}
