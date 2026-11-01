import { describe, expect, it } from 'vitest';
import { MINI_GAME_IDS } from '../../../../game-core/minigames/minigame-registry';
import { MINI_GAME_SCREENS } from './minigame-screen-registry';

describe('mini-game screen registry', () => {
  it('provides a screen for every registered mini-game', () => {
    for (const miniGameId of MINI_GAME_IDS) {
      expect(MINI_GAME_SCREENS[miniGameId], `Missing screen for ${miniGameId}`).toBeTypeOf('function');
    }
  });
});
