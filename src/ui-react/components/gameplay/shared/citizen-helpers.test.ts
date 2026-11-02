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
  it('places a character in the same horizontal center as its answer marker', () => {
    const placement: CitizenSpotlightPlacement = {
      kind: 'choice', optionNumber: 3, optionCount: 4, groupIndex: 0,
      tone: 'green', resultState: 'pending',
    };
    const style = getCitizenSpotlightStyle(placement, 0) as Record<string, unknown>;
    expect(style['--citizen-x']).toBe('57.5%');
    expect(style['--citizen-target-x']).toBe('57.5%');
    expect(Number.parseFloat(String(style['--citizen-y']))).toBeCloseTo(65.1, 1);
  });

  it('fans multiple viewers inside the same numbered marker area', () => {
    const first = getCitizenSpotlightStyle({
      kind: 'choice', optionNumber: 1, optionCount: 4, groupIndex: 0,
      tone: 'cyan', resultState: 'pending',
    }, 0) as Record<string, unknown>;
    const second = getCitizenSpotlightStyle({
      kind: 'choice', optionNumber: 1, optionCount: 4, groupIndex: 1,
      tone: 'cyan', resultState: 'pending',
    }, 1) as Record<string, unknown>;
    expect(first['--citizen-x']).not.toBe(second['--citizen-x']);
    expect(Number.parseFloat(String(first['--citizen-y']))).toBeCloseTo(65.1, 1);
  });

  it('creates real positions for lobby and side formations', () => {
    const lobby = getCitizenFloorStyle(17, null) as Record<string, unknown>;
    const sidePlacement: CitizenSidePlacement = { kind: 'side', side: 'right', groupIndex: 7 };
    const side = getCitizenFloorStyle(17, sidePlacement) as Record<string, unknown>;
    expect(lobby['--citizen-x']).not.toBe('50%');
    expect(side['--citizen-x']).toBeDefined();
    expect(side['--citizen-y']).toBeDefined();
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
