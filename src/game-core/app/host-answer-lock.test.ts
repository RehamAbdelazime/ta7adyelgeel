import { describe, expect, it } from 'vitest';
import { GameStore } from './game-store';
import { GameEventBus } from '../events/game-event-bus';
import type { TwitchChatMessage } from '../twitch/twitch-message-types';

const createMessage = (userId: string, command: string, isBroadcaster = false): TwitchChatMessage => ({
  twitchUserId: userId,
  displayName: userId,
  message: command,
  isBroadcaster,
  isMod: isBroadcaster,
  badges: isBroadcaster ? ['broadcaster'] : [],
  timestamp: Date.now(),
});

function startAnswerWindow(store: GameStore): void {
  for (let step = 0; step < 5 && store.getSnapshot().tour.phase !== 'answer_window_open'; step += 1) {
    store.skipPhase();
  }
  expect(store.getSnapshot().tour.phase).toBe('answer_window_open');
}

describe('host answer lock (v24)', () => {
  it('closes after first accepted host answer, rejects changes even with a different Twitch ID, and resets next round', () => {
    const store = new GameStore(new GameEventBus());
    try {
      store.registerStreamerPlayer({ twitchUserId: 'host', displayName: 'Host' });
      store.startTour(2, ['food-origin'], 'mini-game');
      startAnswerWindow(store);

      expect(store.getSnapshot().privateStreamerAnswerSubmitted).toBe(false);
      expect(store.submitPrivateStreamerAnswer({ rawAnswer: '1', twitchUserId: 'host' }).ok).toBe(true);
      const originalRecord = store.getSnapshot().miniGame.answerRecords.find((record) => record.twitchUserId === 'host');
      expect(originalRecord).toBeDefined();
      expect(store.getSnapshot().privateStreamerAnswerSubmitted).toBe(true);

      expect(store.submitPrivateStreamerAnswer({ rawAnswer: '2', twitchUserId: 'host' }).ok).toBe(false);
      expect(store.submitPrivateStreamerAnswer({ rawAnswer: '3', twitchUserId: 'reconnected-host' }).ok).toBe(false);
      expect(store.submitTwitchChatMessage(createMessage('host', '!4', true)).ok).toBe(false);
      expect(store.getSnapshot().miniGame.answerRecords.find((record) => record.twitchUserId === 'host')?.answer).toEqual(originalRecord?.answer);

      store.skipPhase(); // scoring
      store.skipPhase(); // next round intro
      startAnswerWindow(store);
      expect(store.getSnapshot().tour.roundNumber).toBe(2);
      expect(store.getSnapshot().privateStreamerAnswerSubmitted).toBe(false);
      expect(store.submitPrivateStreamerAnswer({ rawAnswer: '2', twitchUserId: 'host' }).ok).toBe(true);
    } finally {
      store.destroy();
    }
  });

  it('locks the host input when the broadcaster answers through Twitch chat first', () => {
    const store = new GameStore(new GameEventBus());
    try {
      store.registerStreamerPlayer({ twitchUserId: 'host', displayName: 'Host' });
      store.startTour(1, ['food-origin'], 'mini-game');
      startAnswerWindow(store);
      expect(store.submitTwitchChatMessage(createMessage('host', '!2', true)).ok).toBe(true);
      expect(store.getSnapshot().privateStreamerAnswerSubmitted).toBe(true);
      expect(store.submitPrivateStreamerAnswer({ rawAnswer: '3', twitchUserId: 'host' }).ok).toBe(false);
      expect(store.getSnapshot().miniGame.answerRecords).toHaveLength(1);
    } finally {
      store.destroy();
    }
  });

  it('keeps the viewer’s first accepted multiple-choice answer', () => {
    const store = new GameStore(new GameEventBus());
    try {
      store.registerStreamerPlayer({ twitchUserId: 'host', displayName: 'Host' });
      store.submitTwitchChatMessage(createMessage('viewer', '!join'));
      store.startTour(1, ['food-origin'], 'mini-game');
      startAnswerWindow(store);
      expect(store.submitTwitchChatMessage(createMessage('viewer', '!1')).ok).toBe(true);
      const originalRecord = store.getSnapshot().miniGame.answerRecords.find((record) => record.twitchUserId === 'viewer');
      expect(store.submitTwitchChatMessage(createMessage('viewer', '!3')).ok).toBe(false);
      expect(store.getSnapshot().miniGame.answerRecords.find((record) => record.twitchUserId === 'viewer')?.answer).toEqual(originalRecord?.answer);
    } finally {
      store.destroy();
    }
  });
});
