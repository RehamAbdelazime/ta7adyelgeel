import { translate } from '../localization/translations';
import type { LocaleCode } from '../localization/locale-types';
import type {
  CommandUnlockDefinition,
  CommandUnlockId,
  CommandUnlockView,
  PlayerProgressionView,
  ProgressionAwardResult,
  ProgressionSnapshot,
} from './progression-types';

const LEVEL_XP_THRESHOLDS = [
  0,
  100,
  250,
  450,
  700,
  1_000,
  1_350,
  1_750,
  2_200,
  2_700,
  3_300,
  4_000,
  4_800,
  5_700,
  6_700,
  7_900,
  9_200,
  10_600,
  12_100,
  13_700,
];

export const MAX_LEVEL = LEVEL_XP_THRESHOLDS.length;

export const COMMAND_UNLOCKS: CommandUnlockDefinition[] = [
  {
    id: 'join',
    primaryCommand: '!join',
    aliases: ['!انضم', '!دخول'],
    levelRequired: 1,
    title: { en: translate('en', 'progression.join.title'), ar: translate('ar', 'progression.join.title') },
    description: { en: translate('en', 'progression.join.description'), ar: translate('ar', 'progression.join.description') },
  },
  {
    id: 'help',
    primaryCommand: '!help',
    aliases: ['!commands', '!اوامر', '!أوامر'],
    levelRequired: 1,
    title: { en: translate('en', 'progression.help.title'), ar: translate('ar', 'progression.help.title') },
    description: { en: translate('en', 'progression.help.description'), ar: translate('ar', 'progression.help.description') },
  },
  {
    id: 'profile',
    primaryCommand: '!profile',
    aliases: ['!me', '!ملفي'],
    levelRequired: 1,
    title: { en: translate('en', 'progression.profile.title'), ar: translate('ar', 'progression.profile.title') },
    description: { en: translate('en', 'progression.profile.description'), ar: translate('ar', 'progression.profile.description') },
  },
  {
    id: 'answer-choices',
    primaryCommand: '!1 / !2 / !3 / !4',
    aliases: [],
    levelRequired: 1,
    title: { en: translate('en', 'progression.answerChoices.title'), ar: translate('ar', 'progression.answerChoices.title') },
    description: { en: translate('en', 'progression.answerChoices.description'), ar: translate('ar', 'progression.answerChoices.description') },
  },
  {
    id: 'wave',
    primaryCommand: '!wave',
    aliases: ['!hi', '!سلام'],
    levelRequired: 2,
    title: { en: translate('en', 'progression.wave.title'), ar: translate('ar', 'progression.wave.title') },
    description: { en: translate('en', 'progression.wave.description'), ar: translate('ar', 'progression.wave.description') },
  },
  {
    id: 'dance',
    primaryCommand: '!dance',
    aliases: ['!رقص'],
    levelRequired: 3,
    title: { en: translate('en', 'progression.dance.title'), ar: translate('ar', 'progression.dance.title') },
    description: { en: translate('en', 'progression.dance.description'), ar: translate('ar', 'progression.dance.description') },
  },
  {
    id: 'emote',
    primaryCommand: '!emote',
    aliases: ['!emoji', '!ايموت'],
    levelRequired: 5,
    title: { en: translate('en', 'progression.emote.title'), ar: translate('ar', 'progression.emote.title') },
    description: { en: translate('en', 'progression.emote.description'), ar: translate('ar', 'progression.emote.description') },
  },
  {
    id: 'cheer',
    primaryCommand: '!cheer',
    aliases: ['!تشجيع'],
    levelRequired: 8,
    title: { en: translate('en', 'progression.cheer.title'), ar: translate('ar', 'progression.cheer.title') },
    description: { en: translate('en', 'progression.cheer.description'), ar: translate('ar', 'progression.cheer.description') },
  },
  {
    id: 'challenge',
    primaryCommand: '!challenge',
    aliases: ['!تحدي'],
    levelRequired: 10,
    title: { en: translate('en', 'progression.challenge.title'), ar: translate('ar', 'progression.challenge.title') },
    description: { en: translate('en', 'progression.challenge.description'), ar: translate('ar', 'progression.challenge.description') },
  },
  {
    id: 'spotlight',
    primaryCommand: '!spotlight',
    aliases: ['!نجومية'],
    levelRequired: 15,
    title: { en: translate('en', 'progression.spotlight.title'), ar: translate('ar', 'progression.spotlight.title') },
    description: { en: translate('en', 'progression.spotlight.description'), ar: translate('ar', 'progression.spotlight.description') },
  },
  {
    id: 'victory',
    primaryCommand: '!victory',
    aliases: ['!فوز'],
    levelRequired: 20,
    title: { en: translate('en', 'progression.victory.title'), ar: translate('ar', 'progression.victory.title') },
    description: { en: translate('en', 'progression.victory.description'), ar: translate('ar', 'progression.victory.description') },
  },
];

const COMMAND_TO_UNLOCK_ID = new Map<string, CommandUnlockId>();

for (const unlock of COMMAND_UNLOCKS) {
  COMMAND_TO_UNLOCK_ID.set(unlock.primaryCommand.split(' ')[0].toLowerCase(), unlock.id);
  for (const alias of unlock.aliases) {
    COMMAND_TO_UNLOCK_ID.set(alias.toLowerCase(), unlock.id);
  }
}

export class ProgressionService {
  getLevelFromXp(xp: number): number {
    const normalizedXp = Math.max(0, Math.floor(xp));
    let level = 1;

    for (let index = 0; index < LEVEL_XP_THRESHOLDS.length; index += 1) {
      if (normalizedXp >= LEVEL_XP_THRESHOLDS[index]) {
        level = index + 1;
      }
    }

    return Math.min(level, MAX_LEVEL);
  }

  createView(xp: number): PlayerProgressionView {
    const level = this.getLevelFromXp(xp);
    const currentLevelXp = LEVEL_XP_THRESHOLDS[level - 1] ?? 0;
    const nextLevelXp = LEVEL_XP_THRESHOLDS[level] ?? currentLevelXp;
    const xpIntoLevel = Math.max(0, xp - currentLevelXp);
    const xpToNextLevel = Math.max(0, nextLevelXp - xp);
    const levelSpan = Math.max(1, nextLevelXp - currentLevelXp);

    return {
      level,
      xp,
      currentLevelXp,
      nextLevelXp,
      xpIntoLevel,
      xpToNextLevel,
      progressPercent: level >= MAX_LEVEL ? 100 : Math.round((xpIntoLevel / levelSpan) * 100),
      unlockedCommandIds: this.getUnlockedCommands(level).map((unlock) => unlock.id),
    };
  }

  awardXp(currentXp: number, awardXp: number): ProgressionAwardResult {
    const previousLevel = this.getLevelFromXp(currentXp);
    const nextXp = Math.max(0, currentXp + awardXp);
    const newLevel = this.getLevelFromXp(nextXp);

    return {
      previousLevel,
      newLevel,
      leveledUp: newLevel > previousLevel,
      unlockedCommands: this.getUnlocksBetweenLevels(previousLevel, newLevel),
    };
  }

  getUnlockedCommands(level: number): CommandUnlockDefinition[] {
    return COMMAND_UNLOCKS.filter((unlock) => unlock.levelRequired <= level);
  }

  getLockedCommand(commandText: string, level: number): CommandUnlockDefinition | null {
    const normalized = commandText.trim().split(' ')[0]?.toLowerCase() ?? '';
    const unlockId = COMMAND_TO_UNLOCK_ID.get(normalized);

    if (!unlockId) {
      return null;
    }

    const unlock = COMMAND_UNLOCKS.find((candidate) => candidate.id === unlockId) ?? null;

    if (!unlock || unlock.levelRequired <= level) {
      return null;
    }

    return unlock;
  }

  getCommandById(id: CommandUnlockId): CommandUnlockDefinition | null {
    return COMMAND_UNLOCKS.find((unlock) => unlock.id === id) ?? null;
  }

  createSnapshot(locale: LocaleCode): ProgressionSnapshot {
    return {
      maxLevel: MAX_LEVEL,
      commandUnlocks: COMMAND_UNLOCKS.map((unlock): CommandUnlockView => ({
        id: unlock.id,
        primaryCommand: unlock.primaryCommand,
        levelRequired: unlock.levelRequired,
        title: unlock.title[locale],
        description: unlock.description[locale],
      })),
    };
  }

  private getUnlocksBetweenLevels(previousLevel: number, newLevel: number): CommandUnlockDefinition[] {
    if (newLevel <= previousLevel) {
      return [];
    }

    return COMMAND_UNLOCKS.filter(
      (unlock) => unlock.levelRequired > previousLevel && unlock.levelRequired <= newLevel,
    );
  }
}
