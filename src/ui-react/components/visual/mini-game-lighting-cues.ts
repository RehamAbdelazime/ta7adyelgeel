/**
 * Game-show light cues, deliberately independent of React and CSS.
 * The scenery is drawn in the 1920×1080 stage coordinate system. Audience
 * lane centers come from the same layout contract as their player movement.
 */
import { ANSWER_STAGE_LAYOUT } from '../gameplay/shared/answer-stage-layout';

export type MiniGameLightCue = 'ambient' | 'correct' | 'winner';

export type MiniGameLightingState = {
  cue: MiniGameLightCue;
  correctOption: number | null;
  optionCount: number;
};

export const STAGE_LIGHT_ORIGINS = {
  leftSide: { x: 211, y: 413 },
  rightSide: { x: 1709, y: 413 },
  roofCenter: { x: 960, y: 81 },
} as const;

/** Center of each actual answer lane, in stage pixels; lane 1 is always left. */
export function getAnswerLaneLightTarget(option: number, optionCount: number): { x: number; y: number } | null {
  if (!Number.isInteger(option) || !Number.isInteger(optionCount) || optionCount < 1 || optionCount > 4 || option < 1 || option > optionCount) {
    return null;
  }
  const centerPercent = ANSWER_STAGE_LAYOUT.leftPercent + ANSWER_STAGE_LAYOUT.widthPercent * ((option - 0.5) / optionCount);
  return { x: (centerPercent / 100) * 1920, y: 970 };
}

export function getLightingState({
  phase,
  revealFinished,
  correctOption,
  optionCount,
  hasScoredWinner,
}: {
  phase: string;
  revealFinished: boolean;
  correctOption: number | null;
  optionCount: number;
  hasScoredWinner: boolean;
}): MiniGameLightingState {
  if (phase === 'scoring' && !revealFinished && correctOption !== null && getAnswerLaneLightTarget(correctOption, optionCount)) {
    return { cue: 'correct', correctOption, optionCount };
  }
  if ((phase === 'scoring' && revealFinished || phase === 'tour_complete') && hasScoredWinner) {
    return { cue: 'winner', correctOption: null, optionCount };
  }
  return { cue: 'ambient', correctOption: null, optionCount };
}
