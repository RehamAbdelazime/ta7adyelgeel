import type { LocaleCode } from '../localization/locale-types';
import type { CitizenRuntime } from '../citizens/citizen-types';
import type { MiniGameScoreAward, MiniGameId } from '../minigames/minigame-types';
import { getAwardScoreOutcome } from '../minigames/scoring-policy';
import type { ChaosEventDefinition, ChaosEventSnapshot } from './chaos-types';

// One event per mini-game, announced BEFORE the question. No negative surprise
// penalties to players who don't submit an answer.
export const CHAOS_EVENTS: readonly ChaosEventDefinition[] = [
  {
    id: 'double_score', title: { en: 'Double Trouble ×2', ar: 'النقاط دبل ×2' },
    description: { en: 'Correct answers earn double points in this game.', ar: 'كل إجابة صحيحة بنقطتين بدل نقطة واحدة ×2.' },
    category: 'score', rarity: 'common', appliesTo: 'all', scoreMultiplier: 2, correctOnly: true,
  },
  {
    id: 'comeback_boost', title: { en: 'Comeback ×2', ar: 'فرصة الرجوع ×2' },
    description: { en: 'Bottom three official players get double points for correct answers.', ar: 'آخر 3 لاعبين رسميين ياخدوا دبل لو جاوبوا صح.' },
    category: 'role', rarity: 'rare', appliesTo: 'bottomPlayers', scoreMultiplier: 2, correctOnly: true,
  },
  {
    id: 'spectator_mayhem', title: { en: 'Spectator Power ×2', ar: 'قوة المتفرجين ×2' },
    description: { en: 'Spectators earn double runtime points. Official standings do not change.', ar: 'المتفرجين بياخدوا دبل في ترتيبهم المنفصل.' },
    category: 'role', rarity: 'common', appliesTo: 'spectator', scoreMultiplier: 2, correctOnly: true,
  },
  {
    id: 'fast_window', title: { en: 'Speed Rush', ar: 'تحدي السرعة' },
    description: { en: 'Less time to answer this game.', ar: 'وقت الإجابة أقصر في اللعبة دي.' },
    category: 'time', rarity: 'common', appliesTo: 'all', answerWindowMultiplier: 0.8,
  },
  {
    id: 'risk_round', title: { en: 'Risk Round', ar: 'جولة المخاطرة' },
    description: { en: 'Wrong answers lose 30 points; passing and near-misses are safe. A Shield blocks one penalty.', ar: 'الغلط يخصم 30؛ عدم الإجابة أو التقدير القريب من غير خصم. الدرع يحميك مرة.' },
    category: 'answer', rarity: 'rare', appliesTo: 'all', wrongAnswerPenalty: -30,
  },
  {
    id: 'golden_round', title: { en: 'GOLDEN ROUND', ar: 'الجولة الذهبية' },
    description: { en: 'Best-scoring official player wins one Shield and a +25% boost for their next correct answer. Ties are drawn fairly.', ar: 'أعلى لاعب رسمي يكسب درع وبونص 25% على إجابته الصحيحة الجاية. التعادل بقرعة.' },
    category: 'reward', rarity: 'legendary', appliesTo: 'official',
  },
] as const;

// Timing-based games are excluded from Speed Rush: shortening their fixed
// visual sequences would silently remove information from the player.
const SPEED_RUSH_EXCLUDED: ReadonlySet<MiniGameId> = new Set(['lucky-cup', 'count-the-beat', 'memory-count']);

export function isChaosEventEligible(event: ChaosEventDefinition, params: {
  officialCount: number; spectatorCount: number; miniGameId: MiniGameId;
  roundIndex: number; totalRounds: number; goldenAlreadyPlayed: boolean;
}): boolean {
  if (event.appliesTo === 'spectator' && params.spectatorCount === 0) return false;
  if (event.appliesTo === 'bottomPlayers' && params.officialCount < 3) return false;
  if (event.id === 'fast_window' && SPEED_RUSH_EXCLUDED.has(params.miniGameId)) return false;
  // A Shield and a next-correct bonus are worthless if there is no future round.
  if (event.id === 'golden_round' && (params.goldenAlreadyPlayed || params.roundIndex >= params.totalRounds)) return false;
  return true;
}

export class ChaosEventService {
  private readonly roundHistory: string[] = [];
  private goldenAlreadyPlayed = false;
  private readonly random: () => number;

  constructor(random: () => number = Math.random) { this.random = random; }

  beginTour(): void {
    this.roundHistory.length = 0;
    this.goldenAlreadyPlayed = false;
  }

  /** Explicit host choice goes through the same eligibility checks as random events. */
  selectForced(eventId: string, params: {
    officialCount: number; spectatorCount: number; miniGameId: MiniGameId;
    roundIndex: number; totalRounds: number;
  }): ChaosEventDefinition | null {
    const event = CHAOS_EVENTS.find(item => item.id === eventId) ?? null;
    if (!event || !isChaosEventEligible(event, { ...params, goldenAlreadyPlayed: this.goldenAlreadyPlayed })) return null;
    this.remember(event);
    return event;
  }

  selectForRound(params: {
    roundIndex: number; totalRounds: number; chance: number;
    officialCount: number; spectatorCount: number; miniGameId: MiniGameId;
  }): ChaosEventDefinition | null {
    const chance = Math.min(1, Math.max(0, params.chance));
    if (this.random() >= chance) { this.remember(null); return null; }
    const eligible = CHAOS_EVENTS.filter((event) =>
      event.id !== this.roundHistory[this.roundHistory.length - 1] &&
      isChaosEventEligible(event, { ...params, goldenAlreadyPlayed: this.goldenAlreadyPlayed }));
    if (!eligible.length) { this.remember(null); return null; }
    // Weighted rarity: Golden is a genuine rare surprise, not a 1-in-6 repeat.
    const weight = (event: ChaosEventDefinition): number => event.rarity === 'legendary' ? 0.35 : event.rarity === 'rare' ? 1.3 : 3;
    const totalWeight = eligible.reduce((sum, event) => sum + weight(event), 0);
    let roll = this.random() * totalWeight;
    let choice = eligible[eligible.length - 1];
    for (const event of eligible) { roll -= weight(event); if (roll < 0) { choice = event; break; } }
    this.remember(choice);
    return choice;
  }

  private remember(event: ChaosEventDefinition | null): void {
    this.roundHistory.push(event?.id ?? 'none');
    if (event?.id === 'golden_round') this.goldenAlreadyPlayed = true;
  }

  applyToAwards(params: { event: ChaosEventDefinition | null; awards: MiniGameScoreAward[]; citizens: CitizenRuntime[] }): MiniGameScoreAward[] {
    if (!params.event) return params.awards;
    // Freeze trailing positions when the round is selected, not after scoring.
    // Callers supply the roster snapshot captured at selection time.
    const bottomPlayerIds = this.getBottomPlayerIds(params.citizens);
    return params.awards.map((award) => {
      if (!this.eventAppliesToAward(params.event!, award, bottomPlayerIds)) return award;
      if (getAwardScoreOutcome(award) === 'incorrect' && typeof params.event!.wrongAnswerPenalty === 'number') {
        return { ...award, points: params.event!.wrongAnswerPenalty };
      }
      if (typeof params.event!.scoreMultiplier === 'number' && (!params.event!.correctOnly || award.isCorrect)) {
        return { ...award, points: Math.round(award.points * params.event!.scoreMultiplier) };
      }
      return award;
    });
  }

  getSnapshot(event: ChaosEventDefinition | null, locale: LocaleCode): ChaosEventSnapshot {
    if (!event) return {
      active: false, id: null, title: '', description: '', category: null, rarity: null,
      badge: '', scoreMultiplier: null, flatScoreDelta: null, wrongAnswerPenalty: null, answerWindowMultiplier: null,
    };
    return {
      active: true, id: event.id, title: event.title[locale], description: event.description[locale],
      category: event.category, rarity: event.rarity, badge: event.id === 'golden_round' ? 'GOLDEN' : 'CHAOS',
      scoreMultiplier: event.scoreMultiplier ?? null, flatScoreDelta: null,
      wrongAnswerPenalty: event.wrongAnswerPenalty ?? null, answerWindowMultiplier: event.answerWindowMultiplier ?? null,
    };
  }

  private eventAppliesToAward(event: ChaosEventDefinition, award: MiniGameScoreAward, bottomIds: Set<string>): boolean {
    switch (event.appliesTo) {
      case 'official': return award.role === 'official';
      case 'spectator': return award.role === 'spectator';
      case 'bottomPlayers': return bottomIds.has(award.twitchUserId);
      case 'topPlayers': return false;
      default: return true;
    }
  }

  private getBottomPlayerIds(citizens: CitizenRuntime[]): Set<string> {
    return new Set(citizens.filter(c => c.role === 'official')
      .sort((a, b) => a.score - b.score || a.displayName.localeCompare(b.displayName))
      .slice(0, 3).map(c => c.twitchUserId));
  }
}
