import { translate } from '../localization/translations';
import type { LocaleCode } from '../localization/locale-types';
import type { MiniGameScoreAward, MiniGameId } from '../minigames/minigame-types';
import { getAwardScoreOutcome, getRiskRoundPenaltyPoints } from '../minigames/scoring-policy';
import type { ChaosEventDefinition, ChaosEventSnapshot } from './chaos-types';

// One event per question, selected BEFORE it begins. No negative penalties
// for players who skip the question or earn numeric near-miss credit.
export const CHAOS_EVENTS: readonly ChaosEventDefinition[] = [
  {
    id: 'double_score', title: { en: translate('en', 'chaos.doubleScore.title'), ar: translate('ar', 'chaos.doubleScore.title') },
    description: { en: translate('en', 'chaos.doubleScore.description'), ar: translate('ar', 'chaos.doubleScore.description') },
    category: 'score', rarity: 'common', appliesTo: 'all', scoreMultiplier: 2, correctOnly: true,
  },
  {
    id: 'fast_window', title: { en: translate('en', 'chaos.fastWindow.title'), ar: translate('ar', 'chaos.fastWindow.title') },
    description: { en: translate('en', 'chaos.fastWindow.description'), ar: translate('ar', 'chaos.fastWindow.description') },
    category: 'time', rarity: 'common', appliesTo: 'all', answerWindowMultiplier: 0.8,
  },
  {
    id: 'risk_round', title: { en: translate('en', 'chaos.riskRound.title'), ar: translate('ar', 'chaos.riskRound.title') },
    description: { en: translate('en', 'chaos.riskRound.description'), ar: translate('ar', 'chaos.riskRound.description') },
    category: 'answer', rarity: 'rare', appliesTo: 'all', wrongAnswerPenaltyRatio: 0.20,
  },
  {
    id: 'golden_round', title: { en: translate('en', 'chaos.goldenRound.title'), ar: translate('ar', 'chaos.goldenRound.title') },
    description: { en: translate('en', 'chaos.goldenRound.description'), ar: translate('ar', 'chaos.goldenRound.description') },
    category: 'reward', rarity: 'legendary', appliesTo: 'official',
  },
] as const;

export function isChaosEventEligible(event: ChaosEventDefinition, params: {
  officialCount: number; spectatorCount: number; miniGameId: MiniGameId;
  roundIndex: number; totalRounds: number; goldenAlreadyPlayed: boolean;
}): boolean {
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
    // Weighted rarity: Golden is a genuine rare surprise, not an equally weighted pick.
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

  applyToAwards(params: { event: ChaosEventDefinition | null; awards: MiniGameScoreAward[]; miniGameId: MiniGameId }): MiniGameScoreAward[] {
    if (!params.event) return params.awards;
    return params.awards.map((award) => {
      if (params.event!.appliesTo === 'official' && award.role !== 'official') return award;
      if (getAwardScoreOutcome(award) === 'incorrect' && typeof params.event!.wrongAnswerPenaltyRatio === 'number') {
        // A wrong answer loses 20% of this question's CANONICAL base score,
        // not a fixed number and not a chaos/early-answer boosted score.
        return { ...award, points: getRiskRoundPenaltyPoints(params.miniGameId, award.difficulty, params.event!.wrongAnswerPenaltyRatio) };
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
      badge: '', scoreMultiplier: null, flatScoreDelta: null, wrongAnswerPenaltyRatio: null, answerWindowMultiplier: null,
    };
    return {
      active: true, id: event.id, title: event.title[locale], description: event.description[locale],
      category: event.category, rarity: event.rarity, badge: event.id === 'golden_round' ? 'GOLDEN' : 'CHAOS',
      scoreMultiplier: event.scoreMultiplier ?? null, flatScoreDelta: null,
      wrongAnswerPenaltyRatio: event.wrongAnswerPenaltyRatio ?? null, answerWindowMultiplier: event.answerWindowMultiplier ?? null,
    };
  }

}
