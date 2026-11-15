import { describe, expect, it } from 'vitest';
import { ChaosEventService } from './chaos-event-service';
import type { MiniGameScoreAward } from '../minigames/minigame-types';
import { CHAOS_EVENTS } from './chaos-event-service';
import { enforceMiniGameScoreAwardPolicy } from '../minigames/scoring-policy';

function createAward(overrides: Partial<MiniGameScoreAward> = {}): MiniGameScoreAward {
  return {
    twitchUserId: 'viewer-1',
    displayName: 'Viewer',
    role: 'spectator',
    points: 100,
    isCorrect: true,
    difficulty: 'medium',
    ...overrides,
  };
}

describe('Chaos scoring modifiers', () => {
  const service = new ChaosEventService();

  it('multiplies correct answers only for Double Score', () => {
    const doubleScore = CHAOS_EVENTS.find((event) => event.id === 'double_score')!;
    const awards = service.applyToAwards({
      event: doubleScore,
      awards: [
        createAward({ points: 100, isCorrect: true }),
        createAward({ twitchUserId: 'viewer-2', points: 0, isCorrect: false }),
      ],
      miniGameId: 'shape-count',
    });

    expect(awards.map((award) => award.points)).toEqual([200, 0]);
  });

  it('keeps the explicit Risk Round penalty for wrong answers', () => {
    const riskRound = CHAOS_EVENTS.find((event) => event.id === 'risk_round')!;
    const [award] = service.applyToAwards({
      event: riskRound,
      awards: [createAward({ points: 0, isCorrect: false })],
      miniGameId: 'shape-count',
    });

    expect(award.points).toBe(-20); // shape-count medium base 100
  });


  it('keeps wrong-answer base score at zero while still applying an explicit Risk Round penalty', () => {
    const riskRound = CHAOS_EVENTS.find((event) => event.id === 'risk_round')!;
    const safeBaseAwards = enforceMiniGameScoreAwardPolicy([
      createAward({ points: 10, isCorrect: false }),
    ], 'shape-count');
    const chaosAdjusted = service.applyToAwards({
      event: riskRound,
      awards: safeBaseAwards,
      miniGameId: 'shape-count',
    });
    const finalAwards = enforceMiniGameScoreAwardPolicy(chaosAdjusted, 'shape-count', { allowedWrongAnswerPenaltyRatio: riskRound.wrongAnswerPenaltyRatio });

    expect(safeBaseAwards[0].points).toBe(0);
    expect(finalAwards[0].points).toBe(-20);
  });


  it('does not apply the Risk Round wrong-answer penalty to a numeric near-miss', () => {
    const riskRound = CHAOS_EVENTS.find((event) => event.id === 'risk_round')!;
    const partialBaseAward = enforceMiniGameScoreAwardPolicy([
      createAward({
        points: 30,
        isCorrect: false,
        scoreOutcome: 'partial',
        maxPoints: 120,
      }),
    ], 'count-the-beat');
    const [chaosAdjusted] = service.applyToAwards({
      event: riskRound,
      awards: partialBaseAward,
      miniGameId: 'count-the-beat',
    });
    const [finalAward] = enforceMiniGameScoreAwardPolicy([chaosAdjusted], 'count-the-beat', { allowedWrongAnswerPenaltyRatio: riskRound.wrongAnswerPenaltyRatio });

    expect(finalAward.points).toBe(30);
    expect(finalAward.scoreOutcome).toBe('partial');
  });

  it('does not create positive points for incorrect answers when a modifier is not correct-only', () => {
    const customMultiplier = {
      ...CHAOS_EVENTS.find((event) => event.id === 'double_score')!,
      scoreMultiplier: 3,
      correctOnly: false,
    };
    const [award] = service.applyToAwards({
      event: customMultiplier,
      awards: [createAward({ points: 0, isCorrect: false })],
      miniGameId: 'shape-count',
    });

    expect(award.points).toBe(0);
  });
});
