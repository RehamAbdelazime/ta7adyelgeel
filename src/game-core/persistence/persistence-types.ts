import type { LocaleCode } from '../localization/locale-types';
import type { PlayerProfile } from '../profiles/profile-types';
import type { TourAward } from '../awards/tour-awards';

export type PersistentFileName = 'profiles.json' | 'settings.json' | 'tour-history.json';

export type GamePersistencePort = {
  readJson: <T>(fileName: PersistentFileName) => Promise<T | null>;
  writeJson: (fileName: PersistentFileName, data: unknown) => Promise<boolean>;
};

export type PersistenceStatus = 'loading' | 'ready' | 'unavailable' | 'error';

export type PersistenceSnapshot = {
  status: PersistenceStatus;
  error: string | null;
  profileCount: number;
  tourHistoryCount: number;
  lastSavedAt: string | null;
};

export type PersistentProfilesFile = {
  version: 1;
  savedAt: string;
  profiles: PlayerProfile[];
};

export type PersistentSettingsFile = {
  version: 1;
  savedAt: string;
  locale: LocaleCode;
};

export type StoredTourLeaderboardEntry = {
  twitchUserId: string;
  displayName: string;
  role: 'official' | 'spectator';
  score: number;
  level: number;
};

export type StoredTourHistoryEntry = {
  id: string;
  startedAt: string;
  completedAt: string;
  roundIndex: number;
  officialCount: number;
  spectatorCount: number;
  topOfficial: StoredTourLeaderboardEntry[];
  topSpectator: StoredTourLeaderboardEntry[];
  awards?: TourAward[];
};

export type PersistentTourHistoryFile = {
  version: 1;
  savedAt: string;
  entries: StoredTourHistoryEntry[];
};

export function createNoopPersistencePort(): GamePersistencePort {
  return {
    readJson: async () => null,
    writeJson: async () => false,
  };
}
