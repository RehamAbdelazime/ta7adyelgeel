import type { TourPhaseDefinition } from './tour-types';

export const LOBBY_PHASE_DEFINITION: TourPhaseDefinition = {
  phase: 'lobby_open',
  titleKey: 'tour.phase.lobbyOpen',
  durationMs: 0,
  acceptsLateJoinersAsSpectators: false,
  acceptsAnswers: false,
};

export const TOUR_PHASE_SEQUENCE: TourPhaseDefinition[] = [
  {
    phase: 'mini_game_intro',
    titleKey: 'tour.phase.miniGameIntro',
    // Host-controlled explanation screen. It stays until Start Round is pressed.
    durationMs: 0,
    acceptsLateJoinersAsSpectators: true,
    acceptsAnswers: false,
  },
  {
    phase: 'tour_starting',
    titleKey: 'tour.phase.tourStarting',
    // Countdown after the host starts the round. The question stays hidden here.
    durationMs: 3_000,
    acceptsLateJoinersAsSpectators: true,
    acceptsAnswers: false,
  },
  {
    phase: 'answer_window_open',
    titleKey: 'tour.phase.answerWindowOpen',
    durationMs: 20_000,
    acceptsLateJoinersAsSpectators: true,
    acceptsAnswers: true,
  },
  {
    phase: 'scoring',
    titleKey: 'tour.phase.scoring',
    // Round score stays until the host continues.
    durationMs: 0,
    acceptsLateJoinersAsSpectators: true,
    acceptsAnswers: false,
  },
  {
    phase: 'tour_complete',
    titleKey: 'tour.phase.tourComplete',
    // Final scoreboard stays until the host returns to stage.
    durationMs: 0,
    acceptsLateJoinersAsSpectators: true,
    acceptsAnswers: false,
  },
  {
    phase: 'cleanup',
    titleKey: 'tour.phase.cleanup',
    durationMs: 0,
    acceptsLateJoinersAsSpectators: true,
    acceptsAnswers: false,
  },
];
