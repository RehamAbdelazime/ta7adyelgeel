import { describe, expect, it } from 'vitest';
import {
  DEFAULT_RUNTIME_GAME_CONFIG,
  normalizeRuntimeGameConfig,
} from './runtime-game-config';
import { MINI_GAME_REGISTRY, PUBLIC_MINI_GAME_IDS } from '../minigames/minigame-registry';

describe('runtime mini-game configuration', () => {
  it('derives public eligibility from the registry and keeps QA-only games out of it', () => {
    const publicIds = MINI_GAME_REGISTRY
      .filter((game) => game.availability === 'public')
      .map((game) => game.id);

    expect(PUBLIC_MINI_GAME_IDS).toEqual(publicIds);
    expect(PUBLIC_MINI_GAME_IDS).toHaveLength(7);
    expect(DEFAULT_RUNTIME_GAME_CONFIG.tour.enabledMiniGames).toHaveLength(7);
    expect(PUBLIC_MINI_GAME_IDS).not.toContain('memory-count');
    expect(PUBLIC_MINI_GAME_IDS).not.toContain('couple-or-siblings');
  });

  it('accepts only registered public enabled games and deduplicates them', () => {
    const normalized = normalizeRuntimeGameConfig({
      tour: {
        enabledMiniGames: ['food-origin', 'memory-count', 'food-origin', 'unknown-game'],
        miniGameRotation: ['food-origin'],
      },
    });

    expect(normalized.tour.enabledMiniGames).toEqual(['food-origin']);
    expect(normalized.tour.miniGameRotation).toEqual(['food-origin']);
  });

  it('keeps Tour rotation as a subset of enabled public games', () => {
    const normalized = normalizeRuntimeGameConfig({
      tour: {
        enabledMiniGames: ['count-the-beat', 'lucky-cup'],
        miniGameRotation: ['food-origin', 'lucky-cup', 'maze-gates'],
      },
    });

    expect(normalized.tour.enabledMiniGames).toEqual(['count-the-beat', 'lucky-cup']);
    expect(normalized.tour.miniGameRotation).toEqual(['lucky-cup']);
  });

  it('falls back to the JSON-derived defaults when the supplied lists are empty or invalid', () => {
    const normalized = normalizeRuntimeGameConfig({
      tour: {
        enabledMiniGames: ['memory-count', 'not-registered'],
        miniGameRotation: [],
      },
    });

    expect(normalized.tour.enabledMiniGames).toEqual(DEFAULT_RUNTIME_GAME_CONFIG.tour.enabledMiniGames);
    expect(normalized.tour.miniGameRotation).toEqual(DEFAULT_RUNTIME_GAME_CONFIG.tour.miniGameRotation);
  });

  it('preserves an explicit zero phase override', () => {
    const normalized = normalizeRuntimeGameConfig({
      tour: {
        miniGamePhaseOverridesMs: { 'count-the-beat': { answer_window_open: 0 } },
      },
    });

    expect(normalized.tour.miniGamePhaseOverridesMs['count-the-beat']?.answer_window_open).toBe(0);
  });
});
