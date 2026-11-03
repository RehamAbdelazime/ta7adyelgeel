import { describe, expect, it } from 'vitest';
import { getLuckyCupOrder, getLuckyCupPreparationMs, getLuckyCupShuffleEndMs, LUCKY_CUP_SHUFFLE_START_MS } from './lucky-cup-motion';
import { getLuckyCupPreparationMsForRound, LuckyCupMiniGameService } from './lucky-cup-service';

function makePlan(round: number, seed: number) {
  const service = new LuckyCupMiniGameService();
  service.startRound(round, seed);
  const snapshot = service.getSnapshot('ar');
  if (!snapshot.luckyCup) throw new Error('Lucky Cup round was not created');
  return { service, plan: snapshot.luckyCup };
}

describe('Lucky Cup V30 turbo finale and integrity', () => {
  it('makes the hard round much faster, with more swaps and short rests', () => {
    const easy = makePlan(1, 42).plan.swaps;
    const medium = makePlan(2, 42).plan.swaps;
    const hard = makePlan(3, 42).plan.swaps;
    expect(easy).toHaveLength(5);
    expect(medium).toHaveLength(10);
    expect(hard).toHaveLength(18);
    expect(easy[0].durationMs).toBeGreaterThan(medium[0].durationMs);
    expect(medium[0].durationMs).toBeGreaterThan(hard[0].durationMs);
    expect(hard.slice(-5).map((swap) => swap.durationMs)).toEqual([175, 145, 120, 100, 85]);
    expect(hard[12].durationMs).toBe(220);
    expect(hard[hard.length - 1].durationMs).toBeLessThan(medium[medium.length - 1].durationMs);
    for (const swaps of [easy, medium, hard]) {
      for (let i = 1; i < swaps.length; i++) {
        expect(swaps[i].durationMs).toBeLessThanOrEqual(swaps[i - 1].durationMs);
        expect(swaps[i].delayMs).toBeGreaterThanOrEqual(swaps[i - 1].delayMs + swaps[i - 1].durationMs);
      }
    }
  });


  it('makes the last five exchanges nearly continuous and moves the ball on every one', () => {
    for (let seed = 1; seed <= 200; seed++) {
      const plan = makePlan(3, seed).plan;
      const swaps = plan.swaps;
      let ballSlot = plan.initialBallCupId;
      for (let index = 0; index < swaps.length; index++) {
        const { a, b } = swaps[index];
        if (index >= swaps.length - 5) {
          expect([a, b]).toContain(ballSlot);
          const previousSwap = swaps[index - 1];
          expect(swaps[index].delayMs - (previousSwap.delayMs + previousSwap.durationMs)).toBe(12);
        }
        if (ballSlot === a) ballSlot = b;
        else if (ballSlot === b) ballSlot = a;
      }
      expect(getLuckyCupPreparationMs(swaps)).toBe(getLuckyCupPreparationMsForRound(3));
      expect(ballSlot).toBe(getLuckyCupOrder(swaps).indexOf(plan.initialBallCupId));
    }
  });

  it('cannot reverse the previous pair instantly', () => {
    for (let round = 1; round <= 9; round++) {
      for (let seed = 1; seed <= 30; seed++) {
        const swaps = makePlan(round, seed).plan.swaps;
        for (let index = 1; index < swaps.length; index++) {
          expect([swaps[index].a, swaps[index].b].sort()).not.toEqual(
            [swaps[index - 1].a, swaps[index - 1].b].sort(),
          );
        }
      }
    }
  });

  it('keeps the visual answer, timeline and phase duration synchronized', () => {
    for (let round = 1; round <= 9; round++) {
      for (let seed = 1; seed <= 35; seed++) {
        const { service, plan } = makePlan(round, seed * 917);
        const finalSlot = getLuckyCupOrder(plan.swaps).indexOf(plan.initialBallCupId);
        expect(getLuckyCupPreparationMs(plan.swaps)).toBe(getLuckyCupPreparationMsForRound(round));
        expect(getLuckyCupShuffleEndMs(plan.swaps)).toBeLessThan(getLuckyCupPreparationMsForRound(round));
        expect(plan.swaps[0].delayMs).toBe(0);
        expect(getLuckyCupShuffleEndMs(plan.swaps)).toBeGreaterThan(LUCKY_CUP_SHUFFLE_START_MS);
        service.setStatus('resolved');
        expect(service.getSnapshot('ar').luckyCup?.correctCupNumber).toBe(finalSlot + 1);
      }
    }
  });
});
