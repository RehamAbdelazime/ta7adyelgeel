import { describe, expect, it } from 'vitest';
import {
  clampScoreboardPage,
  getScoreboardPageCount,
  getScoreboardPageRows,
  getScoreboardParticipantSignature,
  getVisibleScoreboardRoundIndexes,
} from './scoreboard-pagination';

type Row = {
  twitchUserId: string;
  total: number;
  roundPoints: number[];
};

describe('scoreboard pagination behavior', () => {
  it('does not treat score or ranking updates as a participant-list change', () => {
    const initial: Row[] = [
      { twitchUserId: 'player-a', total: 10, roundPoints: [10] },
      { twitchUserId: 'player-b', total: 8, roundPoints: [8] },
    ];
    const updatedAndReordered: Row[] = [
      { twitchUserId: 'player-b', total: 18, roundPoints: [18] },
      { twitchUserId: 'player-a', total: 10, roundPoints: [10] },
    ];

    expect(getScoreboardParticipantSignature(updatedAndReordered))
      .toBe(getScoreboardParticipantSignature(initial));
  });

  it('detects participants joining or leaving so the scoreboard can reset safely', () => {
    const initial: Row[] = [{ twitchUserId: 'player-a', total: 10, roundPoints: [10] }];
    const withNewPlayer: Row[] = [
      ...initial,
      { twitchUserId: 'player-b', total: 0, roundPoints: [0] },
    ];

    expect(getScoreboardParticipantSignature(withNewPlayer))
      .not.toBe(getScoreboardParticipantSignature(initial));
  });

  it('calculates page counts in groups of eight', () => {
    expect(getScoreboardPageCount(0)).toBe(1);
    expect(getScoreboardPageCount(8)).toBe(1);
    expect(getScoreboardPageCount(9)).toBe(2);
    expect(getScoreboardPageCount(17)).toBe(3);
  });

  it('returns the correct eight-player slice for each page', () => {
    const rows = Array.from({ length: 17 }, (_, index) => ({ id: index + 1 }));

    expect(getScoreboardPageRows(rows, 0).map((row) => row.id)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    expect(getScoreboardPageRows(rows, 1).map((row) => row.id)).toEqual([9, 10, 11, 12, 13, 14, 15, 16]);
    expect(getScoreboardPageRows(rows, 2).map((row) => row.id)).toEqual([17]);
  });

  it('clamps the current page when the number of participants shrinks', () => {
    expect(clampScoreboardPage(2, 2)).toBe(1);
    expect(clampScoreboardPage(0, 1)).toBe(0);
    expect(clampScoreboardPage(-1, 3)).toBe(0);
  });
});

describe('visible round scoreboard window', () => {
  it('shows first five rounds during round five', () => {
    expect(getVisibleScoreboardRoundIndexes(10, 5)).toEqual([0, 1, 2, 3, 4]);
  });
  it('slides to the most recent rounds when a tour exceeds five', () => {
    expect(getVisibleScoreboardRoundIndexes(10, 9)).toEqual([4, 5, 6, 7, 8]);
    expect(getVisibleScoreboardRoundIndexes(10, 10)).toEqual([5, 6, 7, 8, 9]);
  });
  it('uses all columns for short tours', () => {
    expect(getVisibleScoreboardRoundIndexes(2, 2)).toEqual([0, 1]);
  });
});
