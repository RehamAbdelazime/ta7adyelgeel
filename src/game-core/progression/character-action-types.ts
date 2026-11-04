/** Short-lived, cosmetic-only audience reactions. Never affect scoring or XP. */
export type CharacterActionKind =
  | 'wave' | 'dance' | 'emote' | 'cheer' | 'challenge' | 'spotlight'
  | 'victory' | 'profile' | 'level_up';

export type CharacterActionSnapshot = {
  twitchUserId: string;
  kind: CharacterActionKind;
  sequence: number;
  startedAt: number;
  expiresAt: number;
  /** The new level is present only for a real level-up. */
  level?: number;
};
