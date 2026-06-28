import type { CommandUnlockId } from '../progression/progression-types';

export type CitizenRole = 'official' | 'spectator';

export type CitizenRuntime = {
  twitchUserId: string;
  displayName: string;
  role: CitizenRole;
  score: number;
  joinedAt: number;
  level: number;
  xp: number;
  coins: number;
  xpToNextLevel: number;
  progressPercent: number;
  unlockedCommandIds: CommandUnlockId[];
};
