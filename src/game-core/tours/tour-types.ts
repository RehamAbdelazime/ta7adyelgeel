import type { TranslationKey } from '../localization/locale-types';

export type TourPhase =
  | 'lobby_open'
  | 'tour_starting'
  | 'mini_game_intro'
  | 'answer_window_open'
  | 'scoring'
  | 'tour_complete'
  | 'cleanup';

export type TourPhaseDefinition = {
  phase: TourPhase;
  titleKey: TranslationKey;
  durationMs: number;
  acceptsLateJoinersAsSpectators: boolean;
  acceptsAnswers: boolean;
};

export type TourSnapshot = {
  tourId: string | null;
  phase: TourPhase;
  phaseStartedAt: number | null;
  phaseEndsAt: number | null;
  phaseDurationMs: number;
  phaseRemainingMs: number;
  phaseProgress: number;
  /** Current round inside the active Tour. 1-based. */
  roundIndex: number;
  /** Alias for UI clarity. */
  roundNumber: number;
  /** Current Tour number since app start. 1-based. */
  tourNumber: number;
  /** Number of mini-game rounds planned for this Tour. */
  totalRounds: number;
  /** Rounds remaining after the current round. */
  roundsRemaining: number;
  isTourActive: boolean;
  isCleanupActive: boolean;
  isPaused: boolean;
  canStartTour: boolean;
  canPauseTour: boolean;
  canResumeTour: boolean;
  canSkipPhase: boolean;
  acceptsAnswers: boolean;
  acceptsLateJoinersAsSpectators: boolean;
};

export type TourTransitionResult =
  | { ok: true; snapshot: TourSnapshot }
  | { ok: false; reason: 'already_active' | 'not_active' | 'already_paused' | 'not_paused' | 'cleanup_active' | 'cannot_pause' | 'cannot_skip' | 'cannot_restart' };
