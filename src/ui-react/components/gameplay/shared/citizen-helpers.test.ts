import { describe, expect, it } from 'vitest';
import {
  getCitizenFloorStyle,
  getCitizenSpotlightStyle,
  getCitizenWalkFacing,
  getCitizenStageSidePlacement,
  getCitizenPlacementMotionSignature,
  getCitizenPlacementSignature,
  shouldUseCitizenAnswerPlacement,
} from './citizen-helpers';
import type { CitizenSpotlightPlacement, CitizenSidePlacement } from './overlay-types';

describe('citizen placement', () => {
  it('places the first responder at the center of its longitudinal answer zone', () => {
    const placement: CitizenSpotlightPlacement = {
      kind: 'choice', optionNumber: 3, optionCount: 4, groupIndex: 0,
      tone: 'green', resultState: 'pending',
    };
    const style = getCitizenSpotlightStyle(placement, 0) as Record<string, unknown>;
    expect(style['--citizen-x']).toBe('59.25%');
    expect(style['--citizen-target-x']).toBe('59.25%');
    expect(Number.parseFloat(String(style['--citizen-y']))).toBeCloseTo(58, 1);
  });

  it('spreads multiple responders across their shared answer zone', () => {
    const first = getCitizenSpotlightStyle({
      kind: 'choice', optionNumber: 1, optionCount: 4, groupIndex: 0,
      tone: 'cyan', resultState: 'pending',
    }, 0) as Record<string, unknown>;
    const second = getCitizenSpotlightStyle({
      kind: 'choice', optionNumber: 1, optionCount: 4, groupIndex: 1,
      tone: 'cyan', resultState: 'pending',
    }, 1) as Record<string, unknown>;
    expect(first['--citizen-x']).not.toBe(second['--citizen-x']);
    expect(Number.parseFloat(String(first['--citizen-y']))).toBeCloseTo(58, 1);
  });

  it('keeps audience clusters inside their respective numbered aisles with up to 72 answers', () => {
    const widths = { min: 13, lane: 74 / 4 };
    for (const groupSize of [1, 2, 3, 4, 8, 16, 30, 72]) {
      for (const optionNumber of [1, 2, 3, 4]) {
        const zoneStart = widths.min + (optionNumber - 1) * widths.lane;
        const zoneEnd = zoneStart + widths.lane;
        const locations = Array.from({ length: groupSize }, (_, groupIndex) => {
          const style = getCitizenSpotlightStyle({
            kind: 'choice', optionNumber, optionCount: 4, groupIndex, groupSize,
            tone: 'cyan', resultState: 'pending',
          }, groupIndex) as Record<string, unknown>;
          const x = Number.parseFloat(String(style['--citizen-x']));
          const y = Number.parseFloat(String(style['--citizen-y']));
          expect(x).toBeGreaterThanOrEqual(zoneStart);
          expect(x).toBeLessThanOrEqual(zoneEnd);
          expect(y).toBeGreaterThanOrEqual(27);
          expect(y).toBeLessThanOrEqual(72);
          return `${x.toFixed(4)}/${y.toFixed(4)}`;
        });
        expect(new Set(locations).size).toBe(groupSize);
      }
    }
  });

  it('creates real positions for lobby and side formations', () => {
    const lobby = getCitizenFloorStyle(17, null) as Record<string, unknown>;
    const sidePlacement: CitizenSidePlacement = { kind: 'side', side: 'right', groupIndex: 7 };
    const side = getCitizenFloorStyle(17, sidePlacement) as Record<string, unknown>;
    expect(lobby['--citizen-x']).not.toBe('50%');
    expect(side['--citizen-x']).toBeDefined();
    expect(side['--citizen-y']).toBeDefined();
  });


  it('keeps all 72 lobby slots inside the desktop audience safe area without overlaps at identical coordinates', () => {
    const positions = Array.from({ length: 72 }, (_, index) => getCitizenFloorStyle(index, null) as Record<string, unknown>);
    const coordinates = positions.map((position) => `${position['--citizen-x']}/${position['--citizen-y']}`);
    expect(new Set(coordinates).size).toBe(72);
    for (const position of positions) {
      const x = Number.parseFloat(String(position['--citizen-x']));
      const y = Number.parseFloat(String(position['--citizen-y']));
      expect(x).toBeGreaterThanOrEqual(10);
      expect(x).toBeLessThanOrEqual(90);
      expect(y).toBeGreaterThanOrEqual(10);
      expect(y).toBeLessThanOrEqual(50);
    }
  });

  it('assigns deterministic side positions so the crowd does not reshuffle when someone answers', () => {
    expect(getCitizenStageSidePlacement(0)).toEqual({ kind: 'side', side: 'left', groupIndex: 0 });
    expect(getCitizenStageSidePlacement(1)).toEqual({ kind: 'side', side: 'right', groupIndex: 0 });
    expect(getCitizenStageSidePlacement(2)).toEqual({ kind: 'side', side: 'left', groupIndex: 1 });
    expect(getCitizenStageSidePlacement(3)).toEqual({ kind: 'side', side: 'right', groupIndex: 1 });
  });

  it('only sends viewers to number markers while the answer window is open', () => {
    expect(shouldUseCitizenAnswerPlacement('answer_window_open')).toBe(true);
    expect(shouldUseCitizenAnswerPlacement('scoring')).toBe(false);
    expect(shouldUseCitizenAnswerPlacement('mini_game_intro')).toBe(false);
  });

  it('faces characters toward the destination and repositions changed group slots', () => {
    const leftSide: CitizenSidePlacement = { kind: 'side', side: 'left', groupIndex: 0 };
    const rightSide: CitizenSidePlacement = { kind: 'side', side: 'right', groupIndex: 0 };
    const choice: CitizenSpotlightPlacement = {
      kind: 'choice', optionNumber: 2, optionCount: 4, groupIndex: 0,
      tone: 'pink', resultState: 'pending',
    };
    expect(getCitizenWalkFacing(leftSide, choice, 0)).toBe(1);
    expect(getCitizenWalkFacing(rightSide, choice, 0)).toBe(-1);
    expect(getCitizenPlacementMotionSignature({ ...leftSide, groupIndex: 1 })).not.toBe(
      getCitizenPlacementMotionSignature(leftSide),
    );
    expect(getCitizenPlacementSignature({ ...choice, optionCount: 3 })).not.toBe(
      getCitizenPlacementSignature(choice),
    );
    const resolvedChoice = { ...choice, resultState: 'correct' as const };
    expect(getCitizenPlacementSignature(resolvedChoice)).not.toBe(getCitizenPlacementSignature(choice));
    expect(getCitizenPlacementMotionSignature(resolvedChoice)).toBe(getCitizenPlacementMotionSignature(choice));
  });
});
