import { describe, expect, it } from 'vitest';
import { TourStateMachine } from './tour-state-machine';

describe('end mini game via settings -> return to stage', () => {
  it('keeps the final results visible until the user clicks Back To Stage', () => {
    const machine = new TourStateMachine();
    expect(machine.startTour(3).ok).toBe(true);
    expect(machine.getSnapshot().phase).toBe('mini_game_intro');

    expect(machine.endTourImmediately().ok).toBe(true);
    expect(machine.getSnapshot().phase).toBe('tour_complete');
    expect(machine.getSnapshot().isTourActive).toBe(true);

    const back = machine.returnToLobbyFromFinalScoreboard();
    expect(back.ok).toBe(true);
    expect(machine.getSnapshot().phase).toBe('lobby_open');
    expect(machine.getSnapshot().isTourActive).toBe(false);
    expect(machine.getSnapshot().canStartTour).toBe(true);
  });

  it('allows a normal final-score return as well', () => {
    const machine = new TourStateMachine();
    expect(machine.startTour(1).ok).toBe(true);
    expect(machine.endTourImmediately().ok).toBe(true);
    expect(machine.returnToLobbyFromFinalScoreboard().ok).toBe(true);
    expect(machine.returnToLobbyFromFinalScoreboard().ok).toBe(true);
  });
});
