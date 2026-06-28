import type { MiniGameHintSnapshot } from '../minigame-types';

export type TimedAnswerHintState = {
  answerWindowStartedAt: number | null;
  answerWindowDurationMs: number;
  revealAt: number | null;
  revealDelayMs: number;
  scoreMultiplierAfterReveal: number;
};

export type ConfigureTimedAnswerHintParams = {
  startedAt: number;
  durationMs: number;
  scoreMultiplierAfterReveal?: number;
  revealDelayRatio?: number;
};

export type TimedAnswerHintSnapshotParams = {
  state: TimedAnswerHintState;
  now?: number;
  label: string;
  hiddenValueLabel: string;
  revealedValueLabel: string;
  value: string;
  forceRevealed?: boolean;
};

export function createInactiveTimedAnswerHintState(scoreMultiplierAfterReveal = 0.5): TimedAnswerHintState {
  return {
    answerWindowStartedAt: null,
    answerWindowDurationMs: 0,
    revealAt: null,
    revealDelayMs: 0,
    scoreMultiplierAfterReveal,
  };
}

export function configureTimedAnswerHint(params: ConfigureTimedAnswerHintParams): TimedAnswerHintState {
  const durationMs = Math.max(0, Math.round(params.durationMs));
  const ratio = Number.isFinite(params.revealDelayRatio ?? Number.NaN) ? params.revealDelayRatio! : 0.5;
  const revealDelayRatio = Math.max(0, Math.min(1, ratio));
  const revealDelayMs = Math.round(durationMs * revealDelayRatio);
  const scoreMultiplierAfterReveal = typeof params.scoreMultiplierAfterReveal === 'number'
    ? Math.max(0, Math.min(1, params.scoreMultiplierAfterReveal))
    : 0.5;

  return {
    answerWindowStartedAt: params.startedAt,
    answerWindowDurationMs: durationMs,
    revealAt: params.startedAt + revealDelayMs,
    revealDelayMs,
    scoreMultiplierAfterReveal,
  };
}

export function hasTimedAnswerHintRevealed(state: TimedAnswerHintState, now = Date.now()): boolean {
  return state.revealAt !== null && now >= state.revealAt;
}

export function wasSubmittedAfterTimedAnswerHint(state: TimedAnswerHintState, submittedAt: number): boolean {
  return state.revealAt !== null && submittedAt >= state.revealAt;
}

export function buildTimedAnswerHintSnapshot(params: TimedAnswerHintSnapshotParams): MiniGameHintSnapshot {
  const now = params.now ?? Date.now();
  const isRevealed = Boolean(params.forceRevealed) || hasTimedAnswerHintRevealed(params.state, now);

  return {
    isEnabled: params.state.revealAt !== null,
    isRevealed,
    revealAt: params.state.revealAt,
    revealDelayMs: params.state.revealDelayMs,
    scoreMultiplierAfterReveal: params.state.scoreMultiplierAfterReveal,
    label: params.label,
    hiddenValueLabel: params.hiddenValueLabel,
    revealedValueLabel: params.revealedValueLabel,
    value: isRevealed ? params.value : null,
  };
}
