import { describe, expect, it, vi } from 'vitest';
import { MazeGatesMiniGameService } from './maze-gates-service';

describe('Maze Gates visual layout', () => {
  it('uses a readable maze grid with larger corridors', () => {
    const service = new MazeGatesMiniGameService();
    service.startRound(1);

    const snapshot = service.getSnapshot('en');
    const maze = snapshot.mazeGates?.fullMaze;

    expect(maze).not.toBeNull();
    expect(maze?.columns).toBe(11);
    expect(maze?.rows).toBe(7);
    expect(maze?.boardWidth).toBe(484);
    expect(maze?.boardHeight).toBe(308);
    expect(maze?.boardWidth).toBe(maze!.columns * 44);
    expect(maze?.boardHeight).toBe(maze!.rows * 44);
    expect(maze?.wallSegments.length).toBeGreaterThan(0);
    expect(maze?.gates).toHaveLength(snapshot.mazeGates?.gateCount ?? 0);

    for (const gate of maze?.gates ?? []) {
      expect(gate.x).toBeGreaterThanOrEqual(maze!.boardX);
      expect(gate.x).toBeLessThanOrEqual(maze!.boardX + maze!.boardWidth);
      expect(gate.y).toBeGreaterThan(maze!.boardY + maze!.boardHeight);
    }
  });

  it('still reveals a continuous solution after the round resolves', () => {
    const service = new MazeGatesMiniGameService();
    service.startRound(1);
    service.resolveRound();

    const resolved = service.getSnapshot('en');
    const maze = resolved.mazeGates?.fullMaze;

    expect(resolved.mazeGates?.revealPath).toBe(true);
    expect(maze?.solutionPath.length).toBeGreaterThan(1);
  });
});


type MazeProgressionMetrics = {
  pathLength: number;
  turns: number;
  columns: number;
  rows: number;
  cellSize: number;
};

function getResolvedMazeMetrics(roundNumber: number, timeSeed: number): MazeProgressionMetrics & {
  difficulty: string | null;
  gateCount: number;
} {
  const dateNow = vi.spyOn(Date, 'now').mockReturnValue(timeSeed);
  try {
    const service = new MazeGatesMiniGameService();
    service.startRound(roundNumber);
    const introSnapshot = service.getSnapshot('en');

    // The correct route must remain hidden until the reveal phase.
    expect(introSnapshot.mazeGates?.fullMaze?.solutionPath).toEqual([]);

    service.resolveRound();
    const resolved = service.getSnapshot('en');
    const path = resolved.mazeGates?.fullMaze?.solutionPath ?? [];

    let totalDistance = 0;
    let turns = 0;
    let previousDirection: 'horizontal' | 'vertical' | null = null;

    for (let index = 1; index < path.length; index += 1) {
      const previous = path[index - 1];
      const current = path[index];
      const dx = current.x - previous.x;
      const dy = current.y - previous.y;
      totalDistance += Math.abs(dx) + Math.abs(dy);

      const direction = dx === 0 ? 'vertical' : 'horizontal';
      if (previousDirection && direction !== previousDirection) turns += 1;
      previousDirection = direction;
    }

    const maze = resolved.mazeGates?.fullMaze;
    const columns = maze?.columns ?? 0;
    const rows = maze?.rows ?? 0;
    const cellSize = columns > 0 ? (maze?.boardWidth ?? 0) / columns : 0;

    return {
      difficulty: resolved.questionDifficulty,
      gateCount: resolved.mazeGates?.gateCount ?? 0,
      pathLength: cellSize > 0 ? Math.round(totalDistance / cellSize) : 0,
      turns,
      columns,
      rows,
      cellSize,
    };
  } finally {
    dateNow.mockRestore();
  }
}

function median(values: number[]): number {
  const sorted = [...values].sort((left, right) => left - right);
  return sorted[Math.floor(sorted.length / 2)] ?? 0;
}

describe('Maze Gates difficulty progression', () => {
  it('progresses from three easy gates to four medium and hard gates', () => {
    const easy = getResolvedMazeMetrics(1, 1_700_000_000_001);
    const medium = getResolvedMazeMetrics(2, 1_700_000_000_002);
    const hard = getResolvedMazeMetrics(3, 1_700_000_000_003);

    expect(easy.difficulty).toBe('easy');
    expect(medium.difficulty).toBe('medium');
    expect(hard.difficulty).toBe('hard');
    expect(easy.gateCount).toBe(3);
    expect(medium.gateCount).toBe(4);
    expect(hard.gateCount).toBe(4);

    expect([easy.columns, easy.rows, easy.cellSize]).toEqual([11, 7, 44]);
    expect([medium.columns, medium.rows, medium.cellSize]).toEqual([13, 8, 40]);
    expect([hard.columns, hard.rows, hard.cellSize]).toEqual([15, 9, 36]);
  });

  it('makes the correct route measurably longer and more winding each round', () => {
    const seeds = Array.from({ length: 12 }, (_, index) => 1_710_000_000_000 + index * 1_234_567);
    const easy = seeds.map((seed) => getResolvedMazeMetrics(1, seed));
    const medium = seeds.map((seed) => getResolvedMazeMetrics(2, seed));
    const hard = seeds.map((seed) => getResolvedMazeMetrics(3, seed));

    const easyLength = median(easy.map((sample) => sample.pathLength));
    const mediumLength = median(medium.map((sample) => sample.pathLength));
    const hardLength = median(hard.map((sample) => sample.pathLength));
    const easyTurns = median(easy.map((sample) => sample.turns));
    const mediumTurns = median(medium.map((sample) => sample.turns));
    const hardTurns = median(hard.map((sample) => sample.turns));

    expect(mediumLength).toBeGreaterThan(easyLength + 5);
    expect(hardLength).toBeGreaterThan(mediumLength + 7);
    expect(mediumTurns).toBeGreaterThan(easyTurns);
    expect(hardTurns).toBeGreaterThan(mediumTurns);
  });
});
