import type { LocaleCode } from '../localization/locale-types';

export type CommandUnlockId =
  | 'join'
  | 'help'
  | 'profile'
  | 'true-fake'
  | 'wave'
  | 'dance'
  | 'emote'
  | 'cheer'
  | 'challenge'
  | 'spotlight';

export type CommandUnlockDefinition = {
  id: CommandUnlockId;
  primaryCommand: string;
  aliases: string[];
  levelRequired: number;
  title: Record<LocaleCode, string>;
  description: Record<LocaleCode, string>;
};

export type CommandUnlockView = {
  id: CommandUnlockId;
  primaryCommand: string;
  levelRequired: number;
  title: string;
  description: string;
};

export type PlayerProgressionView = {
  level: number;
  xp: number;
  coins: number;
  currentLevelXp: number;
  nextLevelXp: number;
  xpIntoLevel: number;
  xpToNextLevel: number;
  progressPercent: number;
  unlockedCommandIds: CommandUnlockId[];
};

export type ProgressionSnapshot = {
  commandUnlocks: CommandUnlockView[];
  maxLevel: number;
};

export type ProgressionAwardResult = {
  previousLevel: number;
  newLevel: number;
  leveledUp: boolean;
  unlockedCommands: CommandUnlockDefinition[];
};
