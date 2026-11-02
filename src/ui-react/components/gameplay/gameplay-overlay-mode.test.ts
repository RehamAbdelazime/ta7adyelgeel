import { describe, expect, it } from 'vitest';
import { resolveGameplayOverlayMode } from './gameplay-overlay-mode';

describe('gameplay overlay mode', () => {
  it('always shows the round scoreboard during scoring', () => {
    expect(resolveGameplayOverlayMode('scoring', true, false)).toBe('round-score');
    expect(resolveGameplayOverlayMode('scoring', true, true)).toBe('round-score');
    expect(resolveGameplayOverlayMode('scoring', false, false)).toBe('round-score');
  });

  it('always shows the cumulative scoreboard when the tour is complete', () => {
    expect(resolveGameplayOverlayMode('tour_complete', true, false)).toBe('final-score');
    expect(resolveGameplayOverlayMode('tour_complete', true, true)).toBe('final-score');
    expect(resolveGameplayOverlayMode('tour_complete', false, false)).toBe('final-score');
  });

  it('preserves the existing intro, countdown, gameplay and lobby routes', () => {
    expect(resolveGameplayOverlayMode('tour_starting', true, false)).toBe('tour-starting');
    expect(resolveGameplayOverlayMode('mini_game_intro', true, true)).toBe('mini-game');
    expect(resolveGameplayOverlayMode('answer_window_open', true, true)).toBe('mini-game');
    expect(resolveGameplayOverlayMode('lobby_open', false, false)).toBe('lobby');
  });
});
