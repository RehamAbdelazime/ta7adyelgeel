/** XP awarded once per completed Tour or single-game session. No currency. */
export type SessionProgressionAward = {
  twitchUserId: string;
  xpEarned: number;
  previousLevel: number;
  newLevel: number;
  totalXp: number;
  progressPercent: number;
  unlockedCommandIds: import('./progression-types').CommandUnlockId[];
};
