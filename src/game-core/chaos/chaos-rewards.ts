import type { MiniGameScoreAward } from '../minigames/minigame-types';
import type { ChaosPlayerReward } from './chaos-types';

export class ChaosRewardService {
  private readonly rewards = new Map<string, ChaosPlayerReward>();
  beginTour(): void { this.rewards.clear(); }
  getSnapshot(): ChaosPlayerReward[] { return [...this.rewards.values()].map(r => ({ ...r })); }

  /** Golden Round: one reward to the leading correct official player. */
  awardGolden(twitchUserId: string): ChaosPlayerReward {
    const old = this.rewards.get(twitchUserId) ?? { twitchUserId, shield: 0, boost: 0, crown: false };
    const next = { ...old, shield: Math.min(1, old.shield + 1), boost: Math.min(1, old.boost + 1), crown: true };
    this.rewards.set(twitchUserId, next);
    return { ...next };
  }

  applyToAwards(awards: MiniGameScoreAward[]): { awards: MiniGameScoreAward[]; blocked: string[]; boosted: string[] } {
    const blocked: string[] = [];
    const boosted: string[] = [];
    const result = awards.map(award => {
      if (award.role !== 'official') return award;
      const old = this.rewards.get(award.twitchUserId);
      if (!old) return award;
      // One shield cancels exactly one explicit negative score penalty;
      // it does not grant free correct-answer points or stop elimination.
      if (award.points < 0 && old.shield > 0) {
        this.rewards.set(award.twitchUserId, { ...old, shield: old.shield - 1 });
        blocked.push(award.twitchUserId);
        return { ...award, points: 0 };
      }
      if (award.isCorrect && award.points > 0 && old.boost > 0) {
        this.rewards.set(award.twitchUserId, { ...old, boost: old.boost - 1 });
        boosted.push(award.twitchUserId);
        return { ...award, points: Math.round(award.points * 1.25) };
      }
      return award;
    });
    return { awards: result, blocked, boosted };
  }
}
