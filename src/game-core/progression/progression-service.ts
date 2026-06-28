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
    title: { en: 'Join City', ar: 'دخول المدينة' },
    description: { en: 'Appear as a citizen in the plaza.', ar: 'اظهر كمواطن داخل الساحة.' },
  },
  {
    id: 'help',
    primaryCommand: '!help',
    aliases: ['!commands', '!اوامر', '!أوامر'],
    levelRequired: 1,
    title: { en: 'Command Help', ar: 'مساعدة الأوامر' },
    description: { en: 'Show available chat commands.', ar: 'اعرض أوامر الشات المتاحة.' },
  },
  {
    id: 'profile',
    primaryCommand: '!profile',
    aliases: ['!me', '!ملفي'],
    levelRequired: 1,
    title: { en: 'Profile', ar: 'الملف الشخصي' },
    description: { en: 'Show level, XP, coins, and role.', ar: 'اعرض المستوى والخبرة والعملات والدور.' },
  },
  {
    id: 'true-fake',
    primaryCommand: '!1 / !2 / !3 / !4',
    aliases: [],
    levelRequired: 1,
    title: { en: 'Mini-game Answers', ar: 'إجابات الميني جيم' },
    description: { en: 'Answer choices during the open answer window.', ar: 'اختار رقم الإجابة أثناء فتح نافذة الإجابة.' },
  },
  {
    id: 'wave',
    primaryCommand: '!wave',
    aliases: ['!hi', '!سلام'],
    levelRequired: 2,
    title: { en: 'Wave', ar: 'تلويح' },
    description: { en: 'Trigger a small hello animation.', ar: 'فعّل حركة ترحيب بسيطة.' },
  },
  {
    id: 'dance',
    primaryCommand: '!dance',
    aliases: ['!رقص'],
    levelRequired: 3,
    title: { en: 'Dance', ar: 'رقصة' },
    description: { en: 'Trigger a dance animation later.', ar: 'افتح حركة رقص لاحقًا.' },
  },
  {
    id: 'emote',
    primaryCommand: '!emote',
    aliases: ['!emoji', '!ايموت'],
    levelRequired: 5,
    title: { en: 'Emote', ar: 'إيموت' },
    description: { en: 'Use visual reactions above your citizen.', ar: 'استخدم تفاعلات فوق شخصيتك.' },
  },
  {
    id: 'cheer',
    primaryCommand: '!cheer',
    aliases: ['!تشجيع'],
    levelRequired: 8,
    title: { en: 'Cheer', ar: 'تشجيع' },
    description: { en: 'Boost the crowd mood.', ar: 'ارفع حماس المدينة.' },
  },
  {
    id: 'challenge',
    primaryCommand: '!challenge',
    aliases: ['!تحدي'],
    levelRequired: 10,
    title: { en: 'Challenge', ar: 'تحدي' },
    description: { en: 'Unlock special challenge prompts.', ar: 'افتح تحديات خاصة.' },
  },
  {
    id: 'spotlight',
    primaryCommand: '!spotlight',
    aliases: ['!نجومية'],
    levelRequired: 15,
    title: { en: 'Spotlight', ar: 'سبوت لايت' },
    description: { en: 'Get a moment on the main screen.', ar: 'خذ لحظة ظهور على الشاشة الرئيسية.' },
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

  createView(xp: number, coins: number): PlayerProgressionView {
    const level = this.getLevelFromXp(xp);
    const currentLevelXp = LEVEL_XP_THRESHOLDS[level - 1] ?? 0;
    const nextLevelXp = LEVEL_XP_THRESHOLDS[level] ?? currentLevelXp;
    const xpIntoLevel = Math.max(0, xp - currentLevelXp);
    const xpToNextLevel = Math.max(0, nextLevelXp - xp);
    const levelSpan = Math.max(1, nextLevelXp - currentLevelXp);

    return {
      level,
      xp,
      coins,
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
