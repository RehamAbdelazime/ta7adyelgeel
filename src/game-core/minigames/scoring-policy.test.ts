import { describe, expect, it } from 'vitest';
import type { CitizenRuntime } from '../citizens/citizen-types';
import { CountTheBeatMiniGameService } from './count-the-beat/count-the-beat-service';
import { MemoryCountMiniGameService } from './memory-count/memory-count-service';
import type { MiniGameScoreAward, MemoryCountAnswer } from './minigame-types';
import {
  calculateExactAnswerScore,
  calculateNumericEstimateScore,
  enforceMiniGameScoreAwardPolicy,
  getAwardScoreOutcome,
  getMiniGameBasePoints,
  getNumericEstimateRule,
  getNumericEstimateScoringGuide,
} from './scoring-policy';

function award(overrides: Partial<MiniGameScoreAward> = {}): MiniGameScoreAward {
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


function citizen(twitchUserId: string): CitizenRuntime {
  return {
    twitchUserId,
    displayName: twitchUserId,
    role: 'spectator',
    score: 0,
    joinedAt: 0,
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    progressPercent: 0,
    unlockedCommandIds: [],
  };
}

describe('shared mini-game scoring policy', () => {
  it('keeps the existing per-game base points in one place', () => {
    expect(getMiniGameBasePoints('count-the-beat', 'easy')).toBe(120);
    expect(getMiniGameBasePoints('count-the-beat', 'medium')).toBe(180);
    expect(getMiniGameBasePoints('count-the-beat', 'hard')).toBe(240);
    expect(getMiniGameBasePoints('memory-count', 'easy')).toBe(60);
    expect(getMiniGameBasePoints('memory-count', 'medium')).toBe(120);
    expect(getMiniGameBasePoints('memory-count', 'hard')).toBe(180);
  });

  it('awards full points only for an exact categorical answer', () => {
    expect(calculateExactAnswerScore('shape-count', 'medium', true)).toMatchObject({
      points: 100,
      maxPoints: 100,
      isCorrect: true,
      scoreOutcome: 'correct',
    });
    expect(calculateExactAnswerScore('shape-count', 'medium', false)).toMatchObject({
      points: 0,
      maxPoints: 100,
      isCorrect: false,
      scoreOutcome: 'incorrect',
    });
  });

  it('awards full, quarter, or zero points for Count the Beat estimates', () => {
    expect(calculateNumericEstimateScore('count-the-beat', 'easy', 12, 12)).toMatchObject({
      points: 120,
      maxPoints: 120,
      isCorrect: true,
      scoreOutcome: 'correct',
    });
    expect(calculateNumericEstimateScore('count-the-beat', 'easy', 12, 13)).toMatchObject({
      points: 30,
      maxPoints: 120,
      isCorrect: false,
      scoreOutcome: 'partial',
    });
    expect(calculateNumericEstimateScore('count-the-beat', 'easy', 12, 11).points).toBe(30);
    expect(calculateNumericEstimateScore('count-the-beat', 'easy', 12, 14)).toMatchObject({
      points: 0,
      scoreOutcome: 'incorrect',
    });
  });

  it('awards full, quarter, or zero points for Memory Count estimates', () => {
    expect(calculateNumericEstimateScore('memory-count', 'hard', 16, 16)).toMatchObject({
      points: 180,
      maxPoints: 180,
      isCorrect: true,
      scoreOutcome: 'correct',
    });
    expect(calculateNumericEstimateScore('memory-count', 'hard', 16, 15)).toMatchObject({
      points: 45,
      maxPoints: 180,
      isCorrect: false,
      scoreOutcome: 'partial',
    });
    expect(calculateNumericEstimateScore('memory-count', 'hard', 16, 17).points).toBe(45);
    expect(calculateNumericEstimateScore('memory-count', 'hard', 16, 18)).toMatchObject({
      points: 0,
      scoreOutcome: 'incorrect',
    });
  });


  it('applies the numeric margin in the real Count the Beat service awards', () => {
    const service = new CountTheBeatMiniGameService();
    service.startRound(2, 48291);

    // Reveal the generated target to the test, then submit while the answer
    // window is open so this exercises the actual service award pipeline.
    service.setStatus('resolved');
    const snapshot = service.getSnapshot('en');
    const target = snapshot.countTheBeat?.targetCount;
    const difficulty = snapshot.questionDifficulty;
    expect(target).toBeTypeOf('number');
    expect(difficulty).not.toBeNull();

    service.setStatus('answering');
    expect(service.submitAnswer(citizen('exact'), target!)).toMatchObject({ ok: true });
    expect(service.submitAnswer(citizen('near'), target! + 1)).toMatchObject({ ok: true });
    expect(service.submitAnswer(citizen('far'), target! + 2)).toMatchObject({ ok: true });
    service.resolveRound();

    const awards = new Map(service.createScoreAwards().map((item) => [item.twitchUserId, item]));
    const maximum = getMiniGameBasePoints('count-the-beat', difficulty!);
    expect(awards.get('exact')).toMatchObject({ points: maximum, scoreOutcome: 'correct', isCorrect: true });
    expect(awards.get('near')).toMatchObject({ points: Math.round(maximum * 0.25), scoreOutcome: 'partial', isCorrect: false });
    expect(awards.get('far')).toMatchObject({ points: 0, scoreOutcome: 'incorrect', isCorrect: false });
  });

  it('always offers exactly one one-count-near option in Memory Count and scores it as quarter credit', () => {
    const service = new MemoryCountMiniGameService();
    service.startRound(2);
    service.setStatus('resolved');
    const snapshot = service.getSnapshot('en');
    const memory = snapshot.memoryCount;
    expect(memory).not.toBeNull();

    const exactOption = memory!.choices.find((choice) => choice.value === memory!.correctCount);
    const nearOptions = memory!.choices.filter((choice) => Math.abs(choice.value - memory!.correctCount!) === 1);
    expect(exactOption).toBeDefined();
    expect(nearOptions).toHaveLength(1);

    service.setStatus('answering');
    expect(service.submitAnswer(citizen('near-memory'), `option-${nearOptions[0].optionNumber}` as MemoryCountAnswer)).toMatchObject({ ok: true });
    service.resolveRound();

    const [partialAward] = service.createScoreAwards();
    const maximum = getMiniGameBasePoints('memory-count', snapshot.questionDifficulty!);
    expect(partialAward).toMatchObject({
      points: Math.round(maximum * 0.25),
      maxPoints: maximum,
      isCorrect: false,
      scoreOutcome: 'partial',
    });
  });

  it('builds the same score guide shown by the numeric game screens', () => {
    expect(getNumericEstimateScoringGuide('count-the-beat', 'hard')).toEqual({
      exact: 240, partial: 60, partialTolerance: 1, incorrect: 0,
    });
    expect(getNumericEstimateScoringGuide('memory-count', 'easy')).toEqual({
      exact: 60, partial: 15, partialTolerance: 1, incorrect: 0,
    });
  });

  it('uses the one-count margin only for numeric estimate games', () => {
    expect(getNumericEstimateRule('count-the-beat')).toMatchObject({
      partialTolerance: 1,
      partialCreditRatio: 0.25,
    });
    expect(getNumericEstimateRule('memory-count')).toMatchObject({
      partialTolerance: 1,
      partialCreditRatio: 0.25,
    });
    expect(getNumericEstimateRule('shape-count')).toBeNull();
    expect(getNumericEstimateRule('lucky-cup')).toBeNull();
  });

  it('rejects non-integer or non-finite numeric estimates', () => {
    expect(calculateNumericEstimateScore('count-the-beat', 'easy', 12, 12.5).points).toBe(0);
    expect(calculateNumericEstimateScore('count-the-beat', 'easy', Number.NaN, 12).points).toBe(0);
    expect(calculateNumericEstimateScore('memory-count', 'easy', 10, Number.POSITIVE_INFINITY).points).toBe(0);
  });

  it('removes all positive score from incorrect answers at the GameStore boundary', () => {
    const [normalized] = enforceMiniGameScoreAwardPolicy([
      award({ isCorrect: false, points: 90, scoreOutcome: 'incorrect', maxPoints: 100 }),
    ], 'shape-count');

    expect(normalized.points).toBe(0);
    expect(normalized.scoreOutcome).toBe('incorrect');
    expect(getAwardScoreOutcome(normalized)).toBe('incorrect');
  });

  it('caps partial credit at one quarter of the maximum even if a service over-awards', () => {
    const [normalized] = enforceMiniGameScoreAwardPolicy([
      award({ isCorrect: false, points: 999, scoreOutcome: 'partial', maxPoints: 999_999 }),
    ], 'count-the-beat');

    expect(normalized.points).toBe(45);
    expect(normalized.scoreOutcome).toBe('partial');
    expect(getAwardScoreOutcome(normalized)).toBe('partial');
  });

  it('does not allow partial credit without a valid maximum score', () => {
    const [missingMaximum, invalidMaximum, negativeMaximum] = enforceMiniGameScoreAwardPolicy([
      award({ isCorrect: false, points: 20, scoreOutcome: 'partial' }),
      award({ isCorrect: false, points: 20, scoreOutcome: 'partial', maxPoints: Number.NaN }),
      award({ isCorrect: false, points: 20, scoreOutcome: 'partial', maxPoints: -1 }),
    ], 'memory-count');

    expect(missingMaximum.points).toBe(0);
    expect(invalidMaximum.points).toBe(0);
    expect(negativeMaximum.points).toBe(0);
  });

  it('rejects partial-credit classifications for games without a numeric margin', () => {
    const [normalized] = enforceMiniGameScoreAwardPolicy([
      award({ isCorrect: false, points: 25, scoreOutcome: 'partial', maxPoints: 100 }),
    ], 'shape-count');

    expect(normalized.points).toBe(0);
    expect(normalized.scoreOutcome).toBe('incorrect');
  });

  it('blocks negative points from a mini-game service before Chaos modifiers', () => {
    const [normalized] = enforceMiniGameScoreAwardPolicy([
      award({ isCorrect: false, points: -30, scoreOutcome: 'incorrect' }),
    ], 'count-the-beat');

    expect(normalized.points).toBe(0);
  });

  it('preserves explicit negative Risk Round penalties only after Chaos modifiers', () => {
    const [normalized] = enforceMiniGameScoreAwardPolicy([
      award({ isCorrect: false, points: -30, scoreOutcome: 'incorrect' }),
    ], 'count-the-beat', { allowedWrongAnswerPenalty: -30 });

    expect(normalized.points).toBe(-30);
    expect(normalized.scoreOutcome).toBe('incorrect');
  });

  it('rejects negative answer awards that do not match the active Chaos penalty', () => {
    const [normalized] = enforceMiniGameScoreAwardPolicy([
      award({ isCorrect: false, points: -999, scoreOutcome: 'incorrect' }),
    ], 'shape-count', { allowedWrongAnswerPenalty: -30 });

    expect(normalized.points).toBe(0);
  });

  it('never applies Risk Round penalties to a numeric partial answer', () => {
    const [normalized] = enforceMiniGameScoreAwardPolicy([
      award({ isCorrect: false, points: -30, scoreOutcome: 'partial', maxPoints: 180 }),
    ], 'count-the-beat', { allowedWrongAnswerPenalty: -30 });

    expect(normalized.points).toBe(0);
    expect(normalized.scoreOutcome).toBe('incorrect');
  });

  it('keeps valid correct-answer awards and clamps malformed negative rewards', () => {
    const [correct, malformed] = enforceMiniGameScoreAwardPolicy([
      award({ isCorrect: true, points: 180, scoreOutcome: 'correct' }),
      award({ isCorrect: true, points: -5, scoreOutcome: 'correct' }),
    ], 'shape-count');

    expect(correct.points).toBe(180);
    expect(malformed.points).toBe(0);
  });
});
