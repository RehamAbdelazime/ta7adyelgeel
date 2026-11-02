import type { CitizenRuntime } from '../../citizens/citizen-types';
import { calculateExactAnswerScore } from '../scoring-policy';
import type { LocaleCode } from '../../localization/locale-types';
import type { QuestionCategory, QuestionDifficulty } from '../../questions/question-types';
import type {
  MazeGateAnswer,
  MazeGateChoice,
  MazeGateFullMaze,
  MazeGatePathSummary,
  MiniGameAnswerRecord,
  MiniGameScoreAward,
  MiniGameSnapshot,
  MiniGameStatus,
  SubmitMiniGameAnswerResult,
} from '../minigame-types';


type MazeGateRound = {
  id: string;
  gateCount: 3 | 4;
  correctOptionNumber: number;
  difficulty: QuestionDifficulty;
  category: QuestionCategory;
  signature: string;
  seed: number;
  fullMaze: GeneratedFullMaze;
};

/**
 * Difficulty is expressed through observable puzzle mechanics, not score alone:
 * - easy: fewer entrances, shorter route, fewer turns and smaller dead-end regions;
 * - medium: one additional entrance and a longer, more winding route;
 * - hard: the same four entrances, but the correct route and decoys are deliberately
 *   more involved while preserving the same readable cell size.
 */
type MazeDifficultyProfile = {
  gateCount: 3 | 4;
  columns: number;
  rows: number;
  cellSize: number;
  wrongIslandMinSize: number;
  wrongIslandMaxSize: number;
  targetSolutionEdges: number;
  targetSolutionTurns: number;
  minSolutionEdges: number;
  minSolutionTurns: number;
};

const MAZE_DIFFICULTY_PROFILES: Record<QuestionDifficulty, MazeDifficultyProfile> = {
  easy: {
    gateCount: 3,
    columns: 11,
    rows: 7,
    cellSize: 44,
    wrongIslandMinSize: 4,
    wrongIslandMaxSize: 6,
    targetSolutionEdges: 15,
    targetSolutionTurns: 7,
    minSolutionEdges: 10,
    minSolutionTurns: 4,
  },
  medium: {
    gateCount: 4,
    columns: 13,
    rows: 8,
    cellSize: 40,
    wrongIslandMinSize: 7,
    wrongIslandMaxSize: 9,
    targetSolutionEdges: 28,
    targetSolutionTurns: 13,
    minSolutionEdges: 21,
    minSolutionTurns: 9,
  },
  hard: {
    gateCount: 4,
    columns: 15,
    rows: 9,
    cellSize: 36,
    wrongIslandMinSize: 10,
    wrongIslandMaxSize: 13,
    targetSolutionEdges: 43,
    targetSolutionTurns: 19,
    minSolutionEdges: 34,
    minSolutionTurns: 15,
  },
};

const GATE_LABELS: Record<LocaleCode, string[]> = {
  en: ['Gate A', 'Gate B', 'Gate C', 'Gate D'],
  ar: ['بوابة أ', 'بوابة ب', 'بوابة ج', 'بوابة د'],
};

export class MazeGatesMiniGameService {
  private round: MazeGateRound | null = null;
  private status: MiniGameStatus = 'idle';
  private roundNumber = 0;
  private readonly answers = new Map<string, MiniGameAnswerRecord>();
  private correctOfficialCount = 0;
  private correctSpectatorCount = 0;
  private scored = false;
  private readonly tourSignatures = new Set<string>();
  private readonly sessionSignatures = new Set<string>();

  beginTour(): void {
    this.tourSignatures.clear();
    this.clearActiveRound();
  }

  startRound(roundNumber: number): void {
    this.roundNumber = roundNumber;
    this.round = this.generateUniqueRound(roundNumber);
    this.status = 'intro';
    this.answers.clear();
    this.correctOfficialCount = 0;
    this.correctSpectatorCount = 0;
    this.scored = false;
    this.tourSignatures.add(this.round.signature);
    this.sessionSignatures.add(this.round.signature);
  }

  setStatus(status: MiniGameStatus): void {
    if (!this.round && status !== 'idle') return;
    this.status = status;
  }

  submitAnswer(citizen: CitizenRuntime, answer: MazeGateAnswer): SubmitMiniGameAnswerResult {
    if (!this.round) return { ok: false, reason: 'no_round' };
    if (this.status !== 'answering') return { ok: false, reason: 'closed' };
    if (this.answers.has(citizen.twitchUserId)) return { ok: false, reason: 'already_answered' };

    const record: MiniGameAnswerRecord = {
      twitchUserId: citizen.twitchUserId,
      displayName: citizen.displayName,
      role: citizen.role,
      answer,
      submittedAt: Date.now(),
    };

    this.answers.set(citizen.twitchUserId, record);
    return { ok: true, record };
  }

  resolveRound(): void {
    if (!this.round) return;

    this.correctOfficialCount = 0;
    this.correctSpectatorCount = 0;

    for (const [id, record] of this.answers.entries()) {
      const optionNumber = this.getOptionNumber(record.answer as MazeGateAnswer);
      const isCorrect = optionNumber === this.round.correctOptionNumber;
      const resolvedRecord = { ...record, isCorrect };
      this.answers.set(id, resolvedRecord);

      if (isCorrect && record.role === 'official') this.correctOfficialCount += 1;
      if (isCorrect && record.role === 'spectator') this.correctSpectatorCount += 1;
    }

    this.status = 'resolved';
  }

  createScoreAwards(): MiniGameScoreAward[] {
    if (!this.round || this.scored) return [];
    const awards: MiniGameScoreAward[] = [];

    for (const record of this.answers.values()) {
      const optionNumber = this.getOptionNumber(record.answer as MazeGateAnswer);
      const isCorrect = optionNumber === this.round.correctOptionNumber;
      awards.push({
        twitchUserId: record.twitchUserId,
        displayName: record.displayName,
        role: record.role,
        ...calculateExactAnswerScore('maze-gates', this.round.difficulty, isCorrect),
        difficulty: this.round.difficulty,
      });
    }

    this.scored = true;
    this.status = 'scored';
    return awards;
  }

  clearActiveRound(): void {
    this.round = null;
    this.status = 'idle';
    this.roundNumber = 0;
    this.answers.clear();
    this.correctOfficialCount = 0;
    this.correctSpectatorCount = 0;
    this.scored = false;
  }

  clear(): void {
    this.clearActiveRound();
  }

  getSnapshot(locale: LocaleCode): MiniGameSnapshot {
    const officialAnswerCount = [...this.answers.values()].filter((answer) => answer.role === 'official').length;
    const spectatorAnswerCount = [...this.answers.values()].filter((answer) => answer.role === 'spectator').length;
    const shouldRevealAnswer = this.status === 'resolved' || this.status === 'scored' || this.status === 'leaderboard';

    return {
      id: 'maze-gates',
      status: this.status,
      roundNumber: this.roundNumber,
      title: locale === 'ar' ? 'بوابات المتاهة' : 'MAZE GATES',
      statement: this.round
        ? locale === 'ar'
          ? 'اختار البوابة اللي مسارها يوصل للنهاية.'
          : 'Pick the gate that reaches the exit.'
        : '',
      instruction: this.round ? this.buildInstruction(locale) : '',
      acceptsAnswers: this.status === 'answering',
      officialAnswerCount,
      spectatorAnswerCount,
      answerRecords: [...this.answers.values()],
      correctAnswer: shouldRevealAnswer && this.round ? `option-${this.round.correctOptionNumber}` as MazeGateAnswer : null,
      correctOfficialCount: this.correctOfficialCount,
      correctSpectatorCount: this.correctSpectatorCount,
      hasRound: Boolean(this.round),
      questionId: this.round?.id ?? null,
      questionCategory: this.round?.category ?? null,
      questionDifficulty: this.round?.difficulty ?? null,
      questionBankStats: {
        totalQuestions: 9999,
        tourUsedQuestions: this.tourSignatures.size,
        tourUsedSimilarityGroups: this.tourSignatures.size,
        sessionUsedQuestions: this.sessionSignatures.size,
        sessionUsedSimilarityGroups: this.sessionSignatures.size,
      },
      mazeGates: this.round
        ? {
            gateCount: this.round.gateCount,
            choices: this.buildChoices(locale),
            revealPath: shouldRevealAnswer,
            correctOptionNumber: shouldRevealAnswer ? this.round.correctOptionNumber : null,
            paths: this.buildPathSummaries(locale, shouldRevealAnswer),
            fullMaze: this.buildFullMaze(locale, shouldRevealAnswer),
          }
        : null,
    };
  }

  getAnswerByOptionNumber(optionNumber: number): MazeGateAnswer | null {
    if (!this.round || optionNumber < 1 || optionNumber > this.round.gateCount) return null;
    return `option-${optionNumber}` as MazeGateAnswer;
  }

  private buildInstruction(locale: LocaleCode): string {
    return locale === 'ar'
      ? `اختار مدخل: ${this.buildChoices(locale).map((choice) => choice.command).join(' / ')}`
      : `Choose an entrance: ${this.buildChoices(locale).map((choice) => choice.command).join(' / ')}`;
  }

  private buildChoices(locale: LocaleCode): MazeGateChoice[] {
    const gateCount = this.round?.gateCount ?? 4;
    return Array.from({ length: gateCount }, (_, index) => ({
      optionNumber: index + 1,
      command: `!${index + 1}`,
      label: GATE_LABELS[locale][index] ?? `Gate ${index + 1}`,
    }));
  }

  private buildFullMaze(locale: LocaleCode, reveal: boolean): MazeGateFullMaze | null {
    if (!this.round) return null;

    // The maze is generated once when the round starts. getSnapshot can be called
    // frequently by the UI, so rebuilding dozens of candidate mazes on every render
    // would waste CPU and could make the timer/answer phase feel less responsive.
    return convertFullMazeToSnapshot(
      {
        locale,
        gateCount: this.round.gateCount,
        correctOptionNumber: this.round.correctOptionNumber,
        reveal,
      },
      MAZE_DIFFICULTY_PROFILES[this.round.difficulty],
      this.round.fullMaze.generated,
      this.round.fullMaze.solutionCells,
    );
  }

  private buildPathSummaries(locale: LocaleCode, reveal: boolean): MazeGatePathSummary[] {
    if (!this.round) return [];

    // Maze Gates uses a grid-based path generator instead of freehand random lines.
    // The correct gate gets one continuous route to the EXIT. The other gates generate
    // clean non-crossing dead-end routes, so the board reads like a real chat puzzle.
    const layout = buildMazeLayout(this.round.gateCount);
    const random = createSeededRandom(this.round.seed + this.roundNumber * 1741 + 59);
    const correctGate = this.round.correctOptionNumber;
    const usedCells = new Set<string>();
    const correctStart = layout.starts[correctGate - 1] ?? layout.starts[0];
    const correctCells = findWeightedGridPath(layout, correctStart, layout.exit, random);

    for (const cell of correctCells) {
      usedCells.add(cellKey(cell));
    }

    const summaries = this.buildChoices(locale).map((choice) => {
      const start = layout.starts[choice.optionNumber - 1] ?? layout.starts[0];
      const isCorrect = choice.optionNumber === correctGate;
      const pathCells = isCorrect
        ? correctCells
        : buildDeadEndGridPath(layout, start, usedCells, createSeededRandom(this.round!.seed + choice.optionNumber * 9973 + 41));

      if (!isCorrect) {
        for (const cell of pathCells) {
          usedCells.add(cellKey(cell));
        }
      }

      return {
        optionNumber: choice.optionNumber,
        command: choice.command,
        label: choice.label,
        isCorrect: reveal && isCorrect,
        isDeadEnd: reveal && !isCorrect,
        path: convertMazeCellsToPoints(layout, pathCells, choice.optionNumber, isCorrect),
      };
    });

    return summaries;
  }

  private getOptionNumber(answer: MazeGateAnswer): number | null {
    const optionNumber = Number.parseInt(answer.replace('option-', ''), 10);
    return Number.isInteger(optionNumber) && optionNumber >= 1 && optionNumber <= 4 ? optionNumber : null;
  }

  private generateUniqueRound(roundNumber: number): MazeGateRound {
    for (let attempt = 0; attempt < 60; attempt += 1) {
      const round = this.generateRound(roundNumber, attempt);
      if (!this.tourSignatures.has(round.signature) && !this.sessionSignatures.has(round.signature)) return round;
    }

    for (let attempt = 80; attempt < 160; attempt += 1) {
      const round = this.generateRound(roundNumber, attempt);
      if (!this.tourSignatures.has(round.signature)) return round;
    }

    return this.generateRound(roundNumber, Date.now() % 10_000);
  }

  private generateRound(roundNumber: number, salt: number): MazeGateRound {
    const seed = roundNumber * 4219 + salt * 104_729 + this.sessionSignatures.size * 313 + Date.now();
    const random = createSeededRandom(seed);
    const difficulty = this.pickDifficulty(roundNumber);
    const profile = MAZE_DIFFICULTY_PROFILES[difficulty];
    const gateCount = profile.gateCount;
    const correctOptionNumber = Math.floor(random() * gateCount) + 1;
    const mazeSeed = seed + roundNumber * 7193 + 883;
    const fullMaze = buildFullMazeBoard({
      difficulty,
      gateCount,
      correctOptionNumber,
      seed: mazeSeed,
    });
    const signature = `maze-gates:${difficulty}:${gateCount}:${correctOptionNumber}:${Math.floor(random() * 9999)}`;

    return {
      id: `maze-gates-${roundNumber}-${signature}`,
      gateCount,
      correctOptionNumber,
      difficulty,
      category: 'games',
      signature,
      seed,
      fullMaze,
    };
  }

  private pickDifficulty(roundNumber: number): QuestionDifficulty {
    // A standard three-question run always progresses Easy → Medium → Hard.
    const cyclePosition = (roundNumber - 1) % 3;
    if (cyclePosition === 0) return 'easy';
    if (cyclePosition === 1) return 'medium';
    return 'hard';
  }
}

type MazeCell = {
  col: number;
  row: number;
};

type MazeLayout = {
  columns: number;
  rows: number;
  starts: MazeCell[];
  exit: MazeCell;
  boardLeft: number;
  boardTop: number;
  boardWidth: number;
  boardHeight: number;
  gateY: number;
  exitY: number;
};

function buildMazeLayout(gateCount: 3 | 4): MazeLayout {
  return {
    // A larger 15x9 board gives the maze enough room to snake horizontally
    // instead of reading like short vertical lines.
    columns: 15,
    rows: 9,
    starts: gateCount === 3
      ? [{ col: 2, row: 8 }, { col: 7, row: 8 }, { col: 12, row: 8 }]
      : [{ col: 1, row: 8 }, { col: 5, row: 8 }, { col: 9, row: 8 }, { col: 13, row: 8 }],
    exit: { col: 7, row: 0 },
    boardLeft: 54,
    boardTop: 62,
    boardWidth: 612,
    boardHeight: 250,
    gateY: 348,
    exitY: 38,
  };
}

function findWeightedGridPath(layout: MazeLayout, start: MazeCell, target: MazeCell, random: () => number): MazeCell[] {
  return buildSnakingRoute(layout, start, target, random, true, new Set<string>());
}

function buildDeadEndGridPath(layout: MazeLayout, start: MazeCell, protectedCells: Set<string>, random: () => number): MazeCell[] {
  const deadEndTarget = pickDeadEndTarget(layout, start, protectedCells, random);
  return buildSnakingRoute(layout, start, deadEndTarget, random, false, protectedCells);
}

function buildSnakingRoute(
  layout: MazeLayout,
  start: MazeCell,
  target: MazeCell,
  random: () => number,
  reachesExit: boolean,
  protectedCells: Set<string>,
): MazeCell[] {
  const cells: MazeCell[] = [start];
  const localUsed = new Set<string>([cellKey(start)]);
  let current = start;

  const waypointRows = reachesExit
    ? [7, 6, 5, 4, 3, 2, 1, 0]
    : buildDeadEndRows(start.row, target.row, random);

  for (let index = 0; index < waypointRows.length; index += 1) {
    const row = waypointRows[index];
    const isLast = index === waypointRows.length - 1;
    const targetCol = isLast
      ? target.col
      : pickWaypointColumn(layout, current.col, target.col, row, reachesExit, random);
    const waypoint = { col: targetCol, row };
    const horizontalFirst = index % 2 === 0 ? random() > 0.32 : random() > 0.68;

    addOrthogonalCells(cells, current, waypoint, horizontalFirst, localUsed, protectedCells, reachesExit);
    current = cells[cells.length - 1];
  }

  if (!cellsEqual(current, target)) {
    addOrthogonalCells(cells, current, target, random() > 0.5, localUsed, protectedCells, reachesExit);
  }

  return simplifyRouteCells(cells);
}

function buildDeadEndRows(startRow: number, targetRow: number, random: () => number): number[] {
  const rows: number[] = [];
  let row = startRow;
  const deepestSafeRow = Math.max(2, targetRow);

  while (row > deepestSafeRow) {
    row -= random() > 0.35 && row - 2 >= deepestSafeRow ? 2 : 1;
    rows.push(row);
  }

  if (rows.length < 3) {
    rows.push(Math.max(2, startRow - 1), Math.max(2, startRow - 3), deepestSafeRow);
  }

  return [...new Set(rows)].filter((value) => value >= 1 && value < startRow);
}

function pickWaypointColumn(
  layout: MazeLayout,
  currentCol: number,
  targetCol: number,
  row: number,
  reachesExit: boolean,
  random: () => number,
): number {
  const minCol = 1;
  const maxCol = layout.columns - 2;
  const sideBias = reachesExit ? (row % 2 === 0 ? -1 : 1) : (random() > 0.5 ? -1 : 1);
  const drift = 2 + Math.floor(random() * 4);
  const wanted = reachesExit
    ? Math.round((currentCol + targetCol) / 2) + sideBias * drift
    : currentCol + sideBias * drift;

  let col = clamp(wanted, minCol, maxCol);
  if (Math.abs(col - currentCol) < 2) {
    col = clamp(currentCol + (sideBias >= 0 ? 3 : -3), minCol, maxCol);
  }

  return col;
}

function pickDeadEndTarget(layout: MazeLayout, start: MazeCell, protectedCells: Set<string>, random: () => number): MazeCell {
  const side = start.col < layout.exit.col ? -1 : 1;
  const row = 2 + Math.floor(random() * 4);
  const offset = 2 + Math.floor(random() * 4);
  let target: MazeCell = {
    col: clamp(start.col + side * offset, 1, layout.columns - 2),
    row,
  };

  for (let guard = 0; guard < 18 && protectedCells.has(cellKey(target)); guard += 1) {
    target = {
      col: clamp(target.col + (guard % 2 === 0 ? 1 : -2), 1, layout.columns - 2),
      row: clamp(target.row + (guard % 3 === 0 ? 1 : -1), 2, layout.rows - 3),
    };
  }

  return target;
}

function addOrthogonalCells(
  cells: MazeCell[],
  from: MazeCell,
  to: MazeCell,
  horizontalFirst: boolean,
  localUsed: Set<string>,
  protectedCells: Set<string>,
  canTouchProtected: boolean,
): void {
  const corner = horizontalFirst ? { col: to.col, row: from.row } : { col: from.col, row: to.row };
  addStraightCells(cells, from, corner, localUsed, protectedCells, canTouchProtected);
  addStraightCells(cells, cells[cells.length - 1], to, localUsed, protectedCells, canTouchProtected);
}

function addStraightCells(
  cells: MazeCell[],
  from: MazeCell,
  to: MazeCell,
  localUsed: Set<string>,
  protectedCells: Set<string>,
  canTouchProtected: boolean,
): void {
  let col = from.col;
  let row = from.row;
  const colStep = Math.sign(to.col - from.col);
  const rowStep = Math.sign(to.row - from.row);

  while (col !== to.col || row !== to.row) {
    if (col !== to.col) col += colStep;
    else if (row !== to.row) row += rowStep;

    const next = { col, row };
    const key = cellKey(next);
    if (!canTouchProtected && protectedCells.has(key)) continue;
    if (localUsed.has(key)) continue;

    cells.push(next);
    localUsed.add(key);
  }
}

function simplifyRouteCells(cells: MazeCell[]): MazeCell[] {
  if (cells.length <= 2) return cells;
  const compact: MazeCell[] = [cells[0]];

  for (let index = 1; index < cells.length - 1; index += 1) {
    const previous = compact[compact.length - 1];
    const current = cells[index];
    const next = cells[index + 1];
    const sameVertical = previous.col === current.col && current.col === next.col;
    const sameHorizontal = previous.row === current.row && current.row === next.row;

    if (!sameVertical && !sameHorizontal) compact.push(current);
  }

  compact.push(cells[cells.length - 1]);
  return compact;
}

function convertMazeCellsToPoints(layout: MazeLayout, cells: MazeCell[], gateNumber: number, reachesExit: boolean): MazeGatePathSummary['path'] {
  const points = cells.map((cell) => cellToPoint(layout, cell));
  const first = points[0];
  const last = points[points.length - 1];
  if (!first || !last) return [];

  const path = [
    { x: first.x, y: layout.gateY },
    { x: first.x, y: layout.boardTop + layout.boardHeight + 22 },
    ...points,
  ];

  if (reachesExit) {
    const exitPoint = cellToPoint(layout, layout.exit);
    path.push({ x: exitPoint.x, y: layout.exitY });
  } else {
    const capDirection = gateNumber % 2 === 0 ? 1 : -1;
    path.push({ x: clamp(last.x + capDirection * 42, layout.boardLeft + 24, layout.boardLeft + layout.boardWidth - 24), y: last.y });
  }

  return compressCollinearPoints(path);
}

function cellToPoint(layout: MazeLayout, cell: MazeCell): MazeGatePathSummary['path'][number] {
  const x = layout.boardLeft + (cell.col / (layout.columns - 1)) * layout.boardWidth;
  const y = layout.boardTop + (cell.row / (layout.rows - 1)) * layout.boardHeight;
  return { x: Math.round(x), y: Math.round(y) };
}

function neighbors(layout: MazeLayout, cell: MazeCell): MazeCell[] {
  return [
    { col: cell.col, row: cell.row - 1 },
    { col: cell.col + 1, row: cell.row },
    { col: cell.col, row: cell.row + 1 },
    { col: cell.col - 1, row: cell.row },
  ].filter((candidate) => candidate.col >= 0 && candidate.col < layout.columns && candidate.row >= 0 && candidate.row < layout.rows);
}

function reconstructPath(start: MazeCell, target: MazeCell, previous: Map<string, MazeCell>): MazeCell[] {
  const path = [target];
  let current = target;

  for (let guard = 0; guard < 512 && !cellsEqual(current, start); guard += 1) {
    const parent = previous.get(cellKey(current));
    if (!parent) break;
    path.unshift(parent);
    current = parent;
  }

  return cellsEqual(path[0], start) ? path : [start, target];
}

function compressCollinearPoints(points: MazeGatePathSummary['path']): MazeGatePathSummary['path'] {
  if (points.length <= 2) return points;
  const compact: MazeGatePathSummary['path'] = [points[0]];

  for (let index = 1; index < points.length - 1; index += 1) {
    const previous = compact[compact.length - 1];
    const current = points[index];
    const next = points[index + 1];
    const sameVertical = previous.x === current.x && current.x === next.x;
    const sameHorizontal = previous.y === current.y && current.y === next.y;

    if (!sameVertical && !sameHorizontal) compact.push(current);
  }

  compact.push(points[points.length - 1]);
  return compact;
}

function shuffled<T>(items: T[], random: () => number): T[] {
  return [...items].sort(() => random() - 0.5);
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function cellKey(cell: MazeCell): string {
  return `${cell.col}:${cell.row}`;
}

function parseCellKey(key: string): MazeCell {
  const [col, row] = key.split(':').map((value) => Number.parseInt(value, 10));
  return { col, row };
}

function cellsEqual(a: MazeCell, b: MazeCell): boolean {
  return a.col === b.col && a.row === b.row;
}



type FullMazeBuildOptions = {
  difficulty: QuestionDifficulty;
  gateCount: 3 | 4;
  correctOptionNumber: number;
  seed: number;
};

type FullMazeSnapshotOptions = {
  locale: LocaleCode;
  gateCount: 3 | 4;
  correctOptionNumber: number;
  reveal: boolean;
};

type FullMazeDirection = 'top' | 'right' | 'bottom' | 'left';

type FullMazeCellWalls = Record<FullMazeDirection, boolean>;
type FullMazeGrid = FullMazeCellWalls[][];

type GeneratedFullMaze = {
  generated: { grid: FullMazeGrid; gateCells: MazeCell[]; exitCell: MazeCell };
  solutionCells: MazeCell[];
};

type MazePathComplexity = {
  edges: number;
  turns: number;
};

// The outer SVG viewport stays fixed, but the logical maze density progresses:
// easy has fewer, larger cells; medium is in between; hard uses the full 15x9 grid.
// This makes the difficulty visible at a glance without shrinking the readable area.
const FULL_MAZE_VIEW_WIDTH = 720;
const FULL_MAZE_VIEW_HEIGHT = 440;

type FullMazeGeometry = {
  boardX: number;
  boardY: number;
  boardWidth: number;
  boardHeight: number;
};

function getFullMazeGeometry(profile: MazeDifficultyProfile): FullMazeGeometry {
  const boardWidth = profile.columns * profile.cellSize;
  const boardHeight = profile.rows * profile.cellSize;
  return {
    boardX: Math.round((FULL_MAZE_VIEW_WIDTH - boardWidth) / 2),
    boardY: Math.round((FULL_MAZE_VIEW_HEIGHT - boardHeight) / 2),
    boardWidth,
    boardHeight,
  };
}

function buildFullMazeBoard(options: FullMazeBuildOptions): GeneratedFullMaze {
  const profile = MAZE_DIFFICULTY_PROFILES[options.difficulty];
  let bestCandidate: GeneratedFullMaze | null = null;
  let bestScore = Number.POSITIVE_INFINITY;

  // Generate a pool and select the maze that best fits the intended difficulty.
  // Grid density, route length, turns, entrance count and decoy-region size all rise
  // across the three profiles while cell sizes remain large enough for stream viewing.
  for (let attempt = 0; attempt < 64; attempt += 1) {
    const random = createSeededRandom(options.seed + attempt * 100_003);
    const generated = generateFullMazeAttempt(options, profile, random);
    const solutionCells = findOpenMazePath(
      generated.grid,
      generated.gateCells[options.correctOptionNumber - 1],
      generated.exitCell,
      profile,
    );
    if (solutionCells.length <= 1) continue;

    const candidate = { generated, solutionCells };
    const score = scoreMazeCandidate(measureMazePathComplexity(solutionCells), profile);
    if (score < bestScore) {
      bestCandidate = candidate;
      bestScore = score;
    }
  }

  if (bestCandidate) return bestCandidate;

  // Defensive fallback: create a connected, solvable board even if candidate
  // generation is unexpectedly constrained.
  const fallbackRandom = createSeededRandom(options.seed + 9_999_991);
  const fallback = generateFullMazeAttempt(options, profile, fallbackRandom, true);
  const solutionCells = findOpenMazePath(
    fallback.grid,
    fallback.gateCells[options.correctOptionNumber - 1],
    fallback.exitCell,
    profile,
  );
  return { generated: fallback, solutionCells };
}

function measureMazePathComplexity(cells: MazeCell[]): MazePathComplexity {
  let turns = 0;
  let previousDirection: 'horizontal' | 'vertical' | null = null;

  for (let index = 1; index < cells.length; index += 1) {
    const previous = cells[index - 1];
    const current = cells[index];
    const direction = previous.col === current.col ? 'vertical' : 'horizontal';
    if (previousDirection && direction !== previousDirection) turns += 1;
    previousDirection = direction;
  }

  return { edges: Math.max(0, cells.length - 1), turns };
}

function scoreMazeCandidate(complexity: MazePathComplexity, profile: MazeDifficultyProfile): number {
  const edgeDistance = Math.abs(complexity.edges - profile.targetSolutionEdges);
  const turnDistance = Math.abs(complexity.turns - profile.targetSolutionTurns);
  const belowMinimumEdges = Math.max(0, profile.minSolutionEdges - complexity.edges);
  const belowMinimumTurns = Math.max(0, profile.minSolutionTurns - complexity.turns);

  // Missing the minimum difficulty floor is penalized more heavily than being
  // slightly above the target, so an easy board is not accidentally selected
  // for a hard round just because it happens to have a tidy route.
  return edgeDistance + turnDistance * 1.7 + belowMinimumEdges * 5 + belowMinimumTurns * 4;
}

function generateFullMazeAttempt(
  options: FullMazeBuildOptions,
  profile: MazeDifficultyProfile,
  random: () => number,
  skipWrongIslands = false,
): {
  grid: FullMazeGrid;
  gateCells: MazeCell[];
  exitCell: MazeCell;
} {
  const gateColumns = getFullMazeGateColumns(profile.columns, options.gateCount);
  const gateCells = gateColumns.map((col) => ({ col, row: profile.rows - 1 }));
  const exitCell = { col: Math.floor(profile.columns / 2), row: 0 };
  const correctStart = gateCells[options.correctOptionNumber - 1];
  const grid = createClosedFullMazeGrid(profile.columns, profile.rows);
  const reservedCells = new Set<string>([cellKey(correctStart), cellKey(exitCell)]);
  const wrongIslands: Set<string>[] = [];

  if (!skipWrongIslands) {
    for (const gateCell of gateCells) {
      if (cellsEqual(gateCell, correctStart)) continue;
      const island = growWrongGateIsland(gateCell, reservedCells, random, profile);
      for (const key of island) reservedCells.add(key);
      wrongIslands.push(island);
      carvePerfectMazeInsideSubset(grid, island, gateCell, random, profile);
    }
  }

  const blockedCells = new Set<string>();
  for (const island of wrongIslands) {
    for (const key of island) blockedCells.add(key);
  }

  const mainCells = new Set<string>();
  for (let row = 0; row < profile.rows; row += 1) {
    for (let col = 0; col < profile.columns; col += 1) {
      const key = cellKey({ col, row });
      if (!blockedCells.has(key)) mainCells.add(key);
    }
  }

  carvePerfectMazeInsideSubset(grid, mainCells, correctStart, random, profile);

  for (const gateCell of gateCells) {
    grid[gateCell.row][gateCell.col].bottom = false;
  }
  grid[exitCell.row][exitCell.col].top = false;

  return { grid, gateCells, exitCell };
}

function getFullMazeGateColumns(columns: number, gateCount: 3 | 4): number[] {
  const lastColumn = columns - 1;
  if (gateCount === 3) {
    return [
      Math.round(lastColumn * 0.15),
      Math.round(lastColumn * 0.5),
      Math.round(lastColumn * 0.85),
    ];
  }

  return [
    1,
    Math.round(lastColumn * 0.35),
    Math.round(lastColumn * 0.65),
    lastColumn - 1,
  ];
}

function createClosedFullMazeGrid(columns: number, rows: number): FullMazeGrid {
  return Array.from({ length: rows }, () =>
    Array.from({ length: columns }, () => ({ top: true, right: true, bottom: true, left: true })),
  );
}

function growWrongGateIsland(
  start: MazeCell,
  reserved: Set<string>,
  random: () => number,
  profile: MazeDifficultyProfile,
): Set<string> {
  const island = new Set<string>([cellKey(start)]);
  // Larger decoy regions introduce more plausible wrong routes on harder rounds.
  // The target remains bounded so the board does not become visually cluttered.
  const targetSize = profile.wrongIslandMinSize
    + Math.floor(random() * (profile.wrongIslandMaxSize - profile.wrongIslandMinSize + 1));
  const maxTopRow = Math.max(2, Math.floor(profile.rows * 0.25));

  for (let guard = 0; guard < 280 && island.size < targetSize; guard += 1) {
    const current = randomCellFromSet(island, random);
    const candidates = shuffled(fullMazeNeighborCells(current, profile), random)
      .filter((cell) => cell.col >= 1 && cell.col < profile.columns - 1)
      .filter((cell) => cell.row >= maxTopRow && cell.row < profile.rows)
      .filter((cell) => !reserved.has(cellKey(cell)))
      .filter((cell) => !island.has(cellKey(cell)));

    const next = candidates[0];
    if (next) island.add(cellKey(next));
  }

  return island;
}

function carvePerfectMazeInsideSubset(
  grid: FullMazeGrid,
  subset: Set<string>,
  preferredStart: MazeCell,
  random: () => number,
  profile: MazeDifficultyProfile,
): void {
  const visited = new Set<string>();
  const starts = [preferredStart, ...[...subset].map(parseCellKey).filter((cell) => !cellsEqual(cell, preferredStart))];

  for (const start of starts) {
    const startKey = cellKey(start);
    if (!subset.has(startKey) || visited.has(startKey)) continue;

    visited.add(startKey);
    const stack: MazeCell[] = [start];

    while (stack.length > 0) {
      const current = stack[stack.length - 1];
      const neighborsToVisit = shuffled(fullMazeNeighborCells(current, profile), random)
        .filter((neighborCell) => subset.has(cellKey(neighborCell)) && !visited.has(cellKey(neighborCell)));

      const next = neighborsToVisit[0];
      if (!next) {
        stack.pop();
        continue;
      }

      carveWallBetween(grid, current, next);
      visited.add(cellKey(next));
      stack.push(next);
    }
  }
}

function fullMazeNeighborCells(cell: MazeCell, profile: MazeDifficultyProfile): MazeCell[] {
  return [
    { col: cell.col, row: cell.row - 1 },
    { col: cell.col + 1, row: cell.row },
    { col: cell.col, row: cell.row + 1 },
    { col: cell.col - 1, row: cell.row },
  ].filter((candidate) => candidate.col >= 0 && candidate.col < profile.columns && candidate.row >= 0 && candidate.row < profile.rows);
}

function carveWallBetween(grid: FullMazeGrid, from: MazeCell, to: MazeCell): void {
  const dx = to.col - from.col;
  const dy = to.row - from.row;

  if (dx === 1) {
    grid[from.row][from.col].right = false;
    grid[to.row][to.col].left = false;
  } else if (dx === -1) {
    grid[from.row][from.col].left = false;
    grid[to.row][to.col].right = false;
  } else if (dy === 1) {
    grid[from.row][from.col].bottom = false;
    grid[to.row][to.col].top = false;
  } else if (dy === -1) {
    grid[from.row][from.col].top = false;
    grid[to.row][to.col].bottom = false;
  }
}

function findOpenMazePath(grid: FullMazeGrid, start: MazeCell, target: MazeCell, profile: MazeDifficultyProfile): MazeCell[] {
  const queue: MazeCell[] = [start];
  const previous = new Map<string, MazeCell>();
  const visited = new Set<string>([cellKey(start)]);

  for (let index = 0; index < queue.length; index += 1) {
    const current = queue[index];
    if (cellsEqual(current, target)) return reconstructPath(start, target, previous);

    for (const next of openFullMazeNeighbors(grid, current, profile)) {
      const key = cellKey(next);
      if (visited.has(key)) continue;
      visited.add(key);
      previous.set(key, current);
      queue.push(next);
    }
  }

  return [];
}

function openFullMazeNeighbors(grid: FullMazeGrid, cell: MazeCell, profile: MazeDifficultyProfile): MazeCell[] {
  const walls = grid[cell.row][cell.col];
  const candidates: MazeCell[] = [];
  if (!walls.top && cell.row > 0) candidates.push({ col: cell.col, row: cell.row - 1 });
  if (!walls.right && cell.col < profile.columns - 1) candidates.push({ col: cell.col + 1, row: cell.row });
  if (!walls.bottom && cell.row < profile.rows - 1) candidates.push({ col: cell.col, row: cell.row + 1 });
  if (!walls.left && cell.col > 0) candidates.push({ col: cell.col - 1, row: cell.row });
  return candidates;
}

function convertFullMazeToSnapshot(
  options: FullMazeSnapshotOptions,
  profile: MazeDifficultyProfile,
  generated: { grid: FullMazeGrid; gateCells: MazeCell[]; exitCell: MazeCell },
  solutionCells: MazeCell[],
): MazeGateFullMaze {
  const geometry = getFullMazeGeometry(profile);
  const wallSegments = buildFullMazeWallSegments(generated.grid, profile, geometry);
  const choices = Array.from({ length: options.gateCount }, (_, index) => ({
    optionNumber: index + 1,
    command: `!${index + 1}`,
    label: GATE_LABELS[options.locale][index] ?? `Gate ${index + 1}`,
  }));

  return {
    viewBoxWidth: FULL_MAZE_VIEW_WIDTH,
    viewBoxHeight: FULL_MAZE_VIEW_HEIGHT,
    boardX: geometry.boardX,
    boardY: geometry.boardY,
    boardWidth: geometry.boardWidth,
    boardHeight: geometry.boardHeight,
    columns: profile.columns,
    rows: profile.rows,
    wallSegments,
    solutionPath: options.reveal ? buildFullMazeSolutionPolyline(solutionCells, profile, geometry) : [],
    gates: choices.map((choice, index) => {
      const cell = generated.gateCells[index];
      const point = fullMazeCellCenter(cell, profile, geometry);
      return {
        ...choice,
        x: point.x,
        y: geometry.boardY + geometry.boardHeight + 24,
        isCorrect: options.reveal && choice.optionNumber === options.correctOptionNumber,
        isDeadEnd: options.reveal && choice.optionNumber !== options.correctOptionNumber,
      };
    }),
    exit: {
      x: fullMazeCellCenter(generated.exitCell, profile, geometry).x,
      y: geometry.boardY - 24,
      label: 'EXIT',
    },
  };
}

function buildFullMazeWallSegments(
  grid: FullMazeGrid,
  profile: MazeDifficultyProfile,
  geometry: FullMazeGeometry,
): MazeGateFullMaze['wallSegments'] {
  const segments: MazeGateFullMaze['wallSegments'] = [];

  for (let row = 0; row < profile.rows; row += 1) {
    for (let col = 0; col < profile.columns; col += 1) {
      const walls = grid[row][col];
      const x = geometry.boardX + col * profile.cellSize;
      const y = geometry.boardY + row * profile.cellSize;
      const size = profile.cellSize;

      if (walls.top) segments.push({ x1: x, y1: y, x2: x + size, y2: y });
      if (walls.left) segments.push({ x1: x, y1: y, x2: x, y2: y + size });
      if (col === profile.columns - 1 && walls.right) segments.push({ x1: x + size, y1: y, x2: x + size, y2: y + size });
      if (row === profile.rows - 1 && walls.bottom) segments.push({ x1: x, y1: y + size, x2: x + size, y2: y + size });
    }
  }

  return mergeMazeWallSegments(segments);
}

function mergeMazeWallSegments(segments: MazeGateFullMaze['wallSegments']): MazeGateFullMaze['wallSegments'] {
  const horizontal = new Map<number, MazeGateFullMaze['wallSegments']>();
  const vertical = new Map<number, MazeGateFullMaze['wallSegments']>();

  for (const segment of segments) {
    if (segment.y1 === segment.y2) {
      const y = segment.y1;
      if (!horizontal.has(y)) horizontal.set(y, []);
      horizontal.get(y)!.push(segment);
    } else if (segment.x1 === segment.x2) {
      const x = segment.x1;
      if (!vertical.has(x)) vertical.set(x, []);
      vertical.get(x)!.push(segment);
    }
  }

  const merged: MazeGateFullMaze['wallSegments'] = [];

  for (const [y, rowSegments] of horizontal.entries()) {
    const sorted = rowSegments.sort((a, b) => a.x1 - b.x1);
    let active: MazeGateFullMaze['wallSegments'][number] | null = null;
    for (const segment of sorted) {
      if (!active) {
        active = { ...segment };
      } else if (segment.x1 <= active.x2) {
        active.x2 = Math.max(active.x2, segment.x2);
      } else {
        merged.push(active);
        active = { ...segment };
      }
    }
    if (active) merged.push({ ...active, y1: y, y2: y });
  }

  for (const [x, colSegments] of vertical.entries()) {
    const sorted = colSegments.sort((a, b) => a.y1 - b.y1);
    let active: MazeGateFullMaze['wallSegments'][number] | null = null;
    for (const segment of sorted) {
      if (!active) {
        active = { ...segment };
      } else if (segment.y1 <= active.y2) {
        active.y2 = Math.max(active.y2, segment.y2);
      } else {
        merged.push(active);
        active = { ...segment };
      }
    }
    if (active) merged.push({ ...active, x1: x, x2: x });
  }

  return merged;
}

function buildFullMazeSolutionPolyline(
  cells: MazeCell[],
  profile: MazeDifficultyProfile,
  geometry: FullMazeGeometry,
): MazeGatePathSummary['path'] {
  if (cells.length === 0) return [];
  const points = cells.map((cell) => fullMazeCellCenter(cell, profile, geometry));
  const first = points[0];
  const last = points[points.length - 1];
  return compressCollinearPoints([
    { x: first.x, y: geometry.boardY + geometry.boardHeight + 24 },
    first,
    ...points.slice(1),
    { x: last.x, y: geometry.boardY - 24 },
  ]);
}

function fullMazeCellCenter(
  cell: MazeCell,
  profile: MazeDifficultyProfile,
  geometry: FullMazeGeometry,
): MazeGatePathSummary['path'][number] {
  return {
    x: geometry.boardX + cell.col * profile.cellSize + profile.cellSize / 2,
    y: geometry.boardY + cell.row * profile.cellSize + profile.cellSize / 2,
  };
}

function randomCellFromSet(cells: Set<string>, random: () => number): MazeCell {
  const list = [...cells];
  return parseCellKey(list[Math.floor(random() * list.length)] ?? list[0]);
}

function createSeededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}
