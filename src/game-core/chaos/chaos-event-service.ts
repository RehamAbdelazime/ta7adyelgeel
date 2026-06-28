import type { LocaleCode } from '../localization/locale-types';
import type { CitizenRuntime } from '../citizens/citizen-types';
import type { MiniGameScoreAward } from '../minigames/minigame-types';
import type { ChaosEventDefinition, ChaosEventSnapshot } from './chaos-types';

export const CHAOS_EVENTS: ChaosEventDefinition[] = [
  {
    id: 'double_score',
    title: { en: 'Double Score', ar: 'النقاط مضاعفة' },
    description: { en: 'Correct answers are worth x2 this round.', ar: 'كل إجابة صحيحة قيمتها x2 في الراوند ده.' },
    category: 'score',
    rarity: 'common',
    appliesTo: 'all',
    scoreMultiplier: 2,
    correctOnly: true,
  },
  {
    id: 'half_score',
    title: { en: 'Half Score', ar: 'نصف النقاط' },
    description: { en: 'Correct answers are worth half points this round.', ar: 'كل إجابة صحيحة قيمتها نصف النقاط في الراوند ده.' },
    category: 'score',
    rarity: 'common',
    appliesTo: 'all',
    scoreMultiplier: 0.5,
    correctOnly: true,
  },
  {
    id: 'risk_round',
    title: { en: 'Risk Round', ar: 'راوند المخاطرة' },
    description: { en: 'Wrong answers lose 30 points. No answer is safe.', ar: 'الإجابة الغلط تخصم 30 نقطة. عدم الإجابة آمن.' },
    category: 'answer',
    rarity: 'rare',
    appliesTo: 'all',
    wrongAnswerPenalty: -30,
  },
  {
    id: 'score_storm',
    title: { en: 'Score Storm', ar: 'عاصفة النقاط' },
    description: { en: 'Everyone loses 5 points at scoring.', ar: 'كل اللاعبين يخسروا 5 نقاط وقت السكور.' },
    category: 'instant',
    rarity: 'common',
    appliesTo: 'all',
    flatScoreDelta: -5,
  },
  {
    id: 'comeback_boost',
    title: { en: 'Comeback Boost', ar: 'فرصة العودة' },
    description: { en: 'Bottom players get x2 for correct answers.', ar: 'آخر اللاعبين ياخدوا x2 لو جاوبوا صح.' },
    category: 'role',
    rarity: 'rare',
    appliesTo: 'bottomPlayers',
    scoreMultiplier: 2,
    correctOnly: true,
  },
  {
    id: 'spectator_mayhem',
    title: { en: 'Spectator Mayhem', ar: 'فوضى المتفرجين' },
    description: { en: 'Spectators get x2 runtime score this round.', ar: 'المتفرجون ياخدوا x2 سكور مؤقت في الراوند ده.' },
    category: 'role',
    rarity: 'common',
    appliesTo: 'spectator',
    scoreMultiplier: 2,
    correctOnly: true,
  },
  {
    id: 'fast_window',
    title: { en: 'Fast Window', ar: 'نافذة سريعة' },
    description: { en: 'The answer window is shorter this round.', ar: 'وقت الإجابة أقل في الراوند ده.' },
    category: 'time',
    rarity: 'common',
    appliesTo: 'all',
    answerWindowMultiplier: 0.72,
  },
  {
    id: 'chill_window',
    title: { en: 'Chill Window', ar: 'وقت إضافي' },
    description: { en: 'The answer window is longer this round.', ar: 'وقت الإجابة أطول في الراوند ده.' },
    category: 'time',
    rarity: 'common',
    appliesTo: 'all',
    answerWindowMultiplier: 1.45,
  },
];

export class ChaosEventService {
  private readonly roundHistory: string[] = [];

  beginTour(): void {
    this.roundHistory.length = 0;
  }

  selectForRound(params: { roundIndex: number; chaosPercent: number; officialCount: number; spectatorCount: number }): ChaosEventDefinition | null {
    const random = createSeededRandom(params.roundIndex * 7919 + params.officialCount * 229 + params.spectatorCount * 131 + Math.floor(params.chaosPercent * 37));
    const chance = Math.min(0.72, 0.24 + params.chaosPercent / 190 + Math.min(0.14, params.officialCount * 0.015));

    if (random() > chance) {
      this.roundHistory.push('none');
      return null;
    }

    const rarityRoll = random();
    const targetRarity = rarityRoll > 0.72 ? 'rare' : 'common';
    const candidates = CHAOS_EVENTS.filter((event) => {
      if (event.rarity !== targetRarity) {
        return false;
      }

      if (event.id === this.roundHistory[this.roundHistory.length - 1]) {
        return false;
      }

      if (event.appliesTo === 'spectator' && params.spectatorCount === 0) {
        return false;
      }

      if (event.appliesTo === 'bottomPlayers' && params.officialCount < 3) {
        return false;
      }

      return true;
    });
    const fallback = CHAOS_EVENTS.filter((event) => event.id !== this.roundHistory[this.roundHistory.length - 1]);
    const pool = candidates.length > 0 ? candidates : fallback;
    const event = pool[Math.floor(random() * pool.length)] ?? null;
    this.roundHistory.push(event?.id ?? 'none');
    return event;
  }

  applyToAwards(params: { event: ChaosEventDefinition | null; awards: MiniGameScoreAward[]; citizens: CitizenRuntime[] }): MiniGameScoreAward[] {
    if (!params.event) {
      return params.awards;
    }

    const bottomPlayerIds = this.getBottomPlayerIds(params.citizens);
    const topPlayerIds = this.getTopPlayerIds(params.citizens);

    return params.awards.map((award) => {
      let points = award.points;
      const applies = this.eventAppliesToAward(params.event!, award, bottomPlayerIds, topPlayerIds);

      if (!applies) {
        return award;
      }

      if (!award.isCorrect && typeof params.event!.wrongAnswerPenalty === 'number') {
        points = params.event!.wrongAnswerPenalty;
      } else if (typeof params.event!.scoreMultiplier === 'number') {
        const canMultiply = params.event!.correctOnly ? award.isCorrect : true;
        if (canMultiply) {
          points = Math.round(points * params.event!.scoreMultiplier);
        }
      }

      return { ...award, points };
    });
  }

  getSnapshot(event: ChaosEventDefinition | null, locale: LocaleCode): ChaosEventSnapshot {
    if (!event) {
      return {
        active: false,
        id: null,
        title: locale === 'ar' ? 'لا يوجد حدث فوضى' : 'No Chaos Event',
        description: locale === 'ar' ? 'هذا الراوند عادي.' : 'This round is normal.',
        category: null,
        rarity: null,
        badge: '',
        scoreMultiplier: null,
        flatScoreDelta: null,
        wrongAnswerPenalty: null,
        answerWindowMultiplier: null,
      };
    }

    return {
      active: true,
      id: event.id,
      title: event.title[locale],
      description: event.description[locale],
      category: event.category,
      rarity: event.rarity,
      badge: this.getBadge(event),
      scoreMultiplier: event.scoreMultiplier ?? null,
      flatScoreDelta: event.flatScoreDelta ?? null,
      wrongAnswerPenalty: event.wrongAnswerPenalty ?? null,
      answerWindowMultiplier: event.answerWindowMultiplier ?? null,
    };
  }

  private eventAppliesToAward(event: ChaosEventDefinition, award: MiniGameScoreAward, bottomPlayerIds: Set<string>, topPlayerIds: Set<string>): boolean {
    switch (event.appliesTo) {
      case 'official':
        return award.role === 'official';
      case 'spectator':
        return award.role === 'spectator';
      case 'bottomPlayers':
        return bottomPlayerIds.has(award.twitchUserId);
      case 'topPlayers':
        return topPlayerIds.has(award.twitchUserId);
      case 'all':
      default:
        return true;
    }
  }

  private getBottomPlayerIds(citizens: CitizenRuntime[]): Set<string> {
    return new Set(citizens
      .filter((citizen) => citizen.role === 'official')
      .sort((a, b) => a.score - b.score || a.displayName.localeCompare(b.displayName))
      .slice(0, 3)
      .map((citizen) => citizen.twitchUserId));
  }

  private getTopPlayerIds(citizens: CitizenRuntime[]): Set<string> {
    return new Set(citizens
      .filter((citizen) => citizen.role === 'official')
      .sort((a, b) => b.score - a.score || a.displayName.localeCompare(b.displayName))
      .slice(0, 3)
      .map((citizen) => citizen.twitchUserId));
  }

  private getBadge(event: ChaosEventDefinition): string {
    if (event.rarity === 'legendary') return 'LEGENDARY';
    if (event.rarity === 'rare') return 'RARE';
    return 'CHAOS';
  }
}

function createSeededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}
