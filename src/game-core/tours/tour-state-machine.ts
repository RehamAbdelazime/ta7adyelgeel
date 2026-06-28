import { LOBBY_PHASE_DEFINITION, TOUR_PHASE_SEQUENCE } from './tour-phase-definitions';
import type { TourPhase, TourPhaseDefinition, TourSnapshot, TourTransitionResult } from './tour-types';

type TourStateMachineOptions = {
  now?: () => number;
  resolvePhaseDurationMs?: (definition: TourPhaseDefinition) => number;
  onPhaseChanged?: (snapshot: TourSnapshot, previousPhase: TourPhase) => void;
  onTourCompleted?: (snapshot: TourSnapshot) => void;
};

const MIN_TOUR_ROUNDS = 1;
const MAX_TOUR_ROUNDS = 10;

export class TourStateMachine {
  private readonly now: () => number;
  private readonly resolvePhaseDurationMs?: (definition: TourPhaseDefinition) => number;
  private readonly onPhaseChanged?: (snapshot: TourSnapshot, previousPhase: TourPhase) => void;
  private readonly onTourCompleted?: (snapshot: TourSnapshot) => void;
  private tourId: string | null = null;
  private currentDefinition: TourPhaseDefinition = LOBBY_PHASE_DEFINITION;
  private phaseStartedAt: number | null = null;
  private phaseEndsAt: number | null = null;
  private pausedRemainingMs: number | null = null;
  private tourNumber = 0;
  private roundIndex = 0;
  private totalRounds = 0;
  private scheduledTransition: ReturnType<typeof setTimeout> | null = null;
  private activeSequenceIndex = -1;

  constructor(options: TourStateMachineOptions = {}) {
    this.now = options.now ?? (() => Date.now());
    this.resolvePhaseDurationMs = options.resolvePhaseDurationMs;
    this.onPhaseChanged = options.onPhaseChanged;
    this.onTourCompleted = options.onTourCompleted;
  }

  getSnapshot(): TourSnapshot {
    const currentTime = this.now();
    const phaseDurationMs = this.currentDefinition.durationMs;
    const isPaused = this.pausedRemainingMs !== null;
    const phaseRemainingMs = isPaused
      ? Math.max(0, this.pausedRemainingMs ?? 0)
      : this.phaseEndsAt
        ? Math.max(0, this.phaseEndsAt - currentTime)
        : 0;
    const elapsedMs = isPaused
      ? Math.max(0, phaseDurationMs - phaseRemainingMs)
      : this.phaseStartedAt
        ? Math.max(0, currentTime - this.phaseStartedAt)
        : 0;
    const phaseProgress = phaseDurationMs > 0 ? Math.min(1, elapsedMs / phaseDurationMs) : 0;
    const isTourActive = this.currentDefinition.phase !== 'lobby_open';
    const isCleanupActive = this.currentDefinition.phase === 'cleanup';
    const isFinalScoreboard = this.currentDefinition.phase === 'tour_complete';
    const currentRound = isTourActive ? Math.max(1, this.roundIndex) : 0;
    const plannedRounds = isTourActive ? Math.max(1, this.totalRounds) : 0;

    return {
      tourId: this.tourId,
      phase: this.currentDefinition.phase,
      phaseStartedAt: this.phaseStartedAt,
      phaseEndsAt: this.phaseEndsAt,
      phaseDurationMs,
      phaseRemainingMs,
      phaseProgress,
      roundIndex: currentRound,
      roundNumber: currentRound,
      tourNumber: this.tourNumber,
      totalRounds: plannedRounds,
      roundsRemaining: isTourActive ? Math.max(0, plannedRounds - currentRound) : 0,
      isTourActive,
      isCleanupActive,
      isPaused,
      canStartTour: this.currentDefinition.phase === 'lobby_open',
      canPauseTour: isTourActive && !isCleanupActive && !isFinalScoreboard && !isPaused && phaseDurationMs > 0,
      canResumeTour: isTourActive && !isCleanupActive && !isFinalScoreboard && isPaused,
      canSkipPhase: isTourActive && !isCleanupActive && !isFinalScoreboard,
      acceptsAnswers: this.currentDefinition.acceptsAnswers && !isPaused,
      acceptsLateJoinersAsSpectators: this.currentDefinition.acceptsLateJoinersAsSpectators,
    };
  }

  isTourActive(): boolean {
    return this.getSnapshot().isTourActive;
  }

  startTour(totalRounds = 5): TourTransitionResult {
    if (this.isTourActive()) {
      return { ok: false, reason: 'already_active' };
    }

    this.tourNumber += 1;
    this.roundIndex = 1;
    this.totalRounds = Math.max(MIN_TOUR_ROUNDS, Math.min(MAX_TOUR_ROUNDS, Math.round(totalRounds)));
    this.tourId = `tour-${this.now()}`;
    this.activeSequenceIndex = this.getPhaseIndex('mini_game_intro');
    this.pausedRemainingMs = null;
    this.enterDefinition(TOUR_PHASE_SEQUENCE[this.activeSequenceIndex]);

    return { ok: true, snapshot: this.getSnapshot() };
  }

  endTourImmediately(): TourTransitionResult {
    if (!this.isTourActive()) {
      return { ok: false, reason: 'not_active' };
    }

    if (this.currentDefinition.phase === 'tour_complete') {
      return { ok: true, snapshot: this.getSnapshot() };
    }

    this.activeSequenceIndex = this.getPhaseIndex('tour_complete');
    this.pausedRemainingMs = null;
    this.enterDefinition(TOUR_PHASE_SEQUENCE[this.activeSequenceIndex]);

    return { ok: true, snapshot: this.getSnapshot() };
  }

  pauseTour(): TourTransitionResult {
    const snapshot = this.getSnapshot();

    if (!snapshot.isTourActive) {
      return { ok: false, reason: 'not_active' };
    }

    if (snapshot.isCleanupActive) {
      return { ok: false, reason: 'cleanup_active' };
    }

    if (snapshot.isPaused) {
      return { ok: false, reason: 'already_paused' };
    }

    if (snapshot.phaseDurationMs <= 0) {
      return { ok: false, reason: 'cannot_pause' };
    }

    this.pausedRemainingMs = Math.max(0, snapshot.phaseRemainingMs);
    this.phaseEndsAt = null;
    this.clearScheduledTransition();

    return { ok: true, snapshot: this.getSnapshot() };
  }

  resumeTour(): TourTransitionResult {
    const snapshot = this.getSnapshot();

    if (!snapshot.isTourActive) {
      return { ok: false, reason: 'not_active' };
    }

    if (snapshot.isCleanupActive) {
      return { ok: false, reason: 'cleanup_active' };
    }

    if (!snapshot.isPaused) {
      return { ok: false, reason: 'not_paused' };
    }

    const remainingMs = Math.max(0, this.pausedRemainingMs ?? 0);
    this.pausedRemainingMs = null;
    this.phaseEndsAt = this.now() + remainingMs;

    if (remainingMs <= 0) {
      this.advance();
    } else {
      this.scheduledTransition = setTimeout(() => this.advance(), remainingMs);
    }

    return { ok: true, snapshot: this.getSnapshot() };
  }

  skipCurrentPhase(): TourTransitionResult {
    const snapshot = this.getSnapshot();

    if (!snapshot.isTourActive) {
      return { ok: false, reason: 'not_active' };
    }

    if (snapshot.isCleanupActive) {
      return { ok: false, reason: 'cleanup_active' };
    }

    if (!snapshot.canSkipPhase) {
      return { ok: false, reason: 'cannot_skip' };
    }

    this.pausedRemainingMs = null;
    this.advance();

    return { ok: true, snapshot: this.getSnapshot() };
  }

  skipToNextRound(): TourTransitionResult {
    const snapshot = this.getSnapshot();

    if (!snapshot.isTourActive) {
      return { ok: false, reason: 'not_active' };
    }

    if (snapshot.isCleanupActive) {
      return { ok: false, reason: 'cleanup_active' };
    }

    this.clearScheduledTransition();
    this.pausedRemainingMs = null;

    if (this.roundIndex < this.totalRounds) {
      this.roundIndex += 1;
      this.activeSequenceIndex = this.getPhaseIndex('mini_game_intro');
      this.enterDefinition(TOUR_PHASE_SEQUENCE[this.activeSequenceIndex]);
      return { ok: true, snapshot: this.getSnapshot() };
    }

    this.activeSequenceIndex = this.getPhaseIndex('tour_complete');
    this.enterDefinition(TOUR_PHASE_SEQUENCE[this.activeSequenceIndex]);
    return { ok: true, snapshot: this.getSnapshot() };
  }

  restartCurrentRound(): TourTransitionResult {
    const snapshot = this.getSnapshot();

    if (!snapshot.isTourActive) {
      return { ok: false, reason: 'not_active' };
    }

    if (snapshot.isCleanupActive || snapshot.phase === 'tour_complete') {
      return { ok: false, reason: 'cannot_restart' };
    }

    this.clearScheduledTransition();
    this.pausedRemainingMs = null;
    this.activeSequenceIndex = this.getPhaseIndex('mini_game_intro');
    this.enterDefinition(TOUR_PHASE_SEQUENCE[this.activeSequenceIndex]);
    return { ok: true, snapshot: this.getSnapshot() };
  }

  returnToLobbyFromFinalScoreboard(): TourTransitionResult {
    const snapshot = this.getSnapshot();

    if (!snapshot.isTourActive) {
      return { ok: true, snapshot };
    }

    if (snapshot.phase !== 'tour_complete' && snapshot.phase !== 'cleanup') {
      return { ok: false, reason: 'cannot_skip' };
    }

    this.clearScheduledTransition();
    this.completeTour();

    return { ok: true, snapshot: this.getSnapshot() };
  }

  destroy(): void {
    this.clearScheduledTransition();
  }

  private enterDefinition(definition: TourPhaseDefinition): void {
    const previousPhase = this.currentDefinition.phase;
    const now = this.now();

    this.clearScheduledTransition();
    this.pausedRemainingMs = null;
    const resolvedDurationMs = Math.max(0, Math.round(this.resolvePhaseDurationMs?.(definition) ?? definition.durationMs));

    this.currentDefinition = { ...definition, durationMs: resolvedDurationMs };
    this.phaseStartedAt = now;
    this.phaseEndsAt = resolvedDurationMs > 0 ? now + resolvedDurationMs : null;

    const snapshot = this.getSnapshot();
    this.onPhaseChanged?.(snapshot, previousPhase);

    if (resolvedDurationMs > 0) {
      this.scheduledTransition = setTimeout(() => this.advance(), resolvedDurationMs);
    }
  }

  private advance(): void {
    this.clearScheduledTransition();
    this.pausedRemainingMs = null;

    const currentPhase = this.currentDefinition.phase;

    if (currentPhase === 'cleanup') {
      this.completeTour();
      return;
    }

    if (currentPhase === 'scoring') {
      if (this.roundIndex < this.totalRounds) {
        this.roundIndex += 1;
        // Continue directly into the countdown for the next question. The explanation screen is
        // shown only once at the start of the selected mini-game/tour, not between questions.
        this.activeSequenceIndex = this.getPhaseIndex('tour_starting');
        this.enterDefinition(TOUR_PHASE_SEQUENCE[this.activeSequenceIndex]);
        return;
      }

      this.activeSequenceIndex = this.getPhaseIndex('tour_complete');
      this.enterDefinition(TOUR_PHASE_SEQUENCE[this.activeSequenceIndex]);
      return;
    }

    if (currentPhase === 'tour_complete') {
      return;
    }

    const nextIndex = this.activeSequenceIndex + 1;

    if (nextIndex < TOUR_PHASE_SEQUENCE.length) {
      this.activeSequenceIndex = nextIndex;
      this.enterDefinition(TOUR_PHASE_SEQUENCE[nextIndex]);
      return;
    }

    this.completeTour();
  }

  private completeTour(): void {
    const previousPhase = this.currentDefinition.phase;

    this.tourId = null;
    this.activeSequenceIndex = -1;
    this.pausedRemainingMs = null;
    this.currentDefinition = LOBBY_PHASE_DEFINITION;
    this.phaseStartedAt = null;
    this.phaseEndsAt = null;
    this.roundIndex = 0;
    this.totalRounds = 0;

    const snapshot = this.getSnapshot();
    this.onTourCompleted?.(snapshot);
    this.onPhaseChanged?.(snapshot, previousPhase);
  }

  private getPhaseIndex(phase: TourPhase): number {
    const index = TOUR_PHASE_SEQUENCE.findIndex((definition) => definition.phase === phase);

    if (index < 0) {
      throw new Error(`Tour phase not found: ${phase}`);
    }

    return index;
  }

  private clearScheduledTransition(): void {
    if (this.scheduledTransition) {
      clearTimeout(this.scheduledTransition);
      this.scheduledTransition = null;
    }
  }
}
