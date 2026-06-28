import type { CitizenRuntime } from '../../citizens/citizen-types';
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

const PARTICIPATION_POINTS = 10;

const DIFFICULTY_SCORE: Record<QuestionDifficulty, number> = {
  easy: 90,
  medium: 140,
  hard: 200,
};

type MazeGateRound = {
  id: string;
  gateCount: 3 | 4;
  correctOptionNumber: number;
  difficulty: QuestionDifficulty;
  category: QuestionCategory;
  signature: string;
  seed: number;
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
        points: isCorrect ? DIFFICULTY_SCORE[this.round.difficulty] : PARTICIPATION_POINTS,
        isCorrect,
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
    return buildFullMazeBoard({
      locale,
      gateCount: this.round.gateCount,
      correctOptionNumber: this.round.correctOptionNumber,
      seed: this.round.seed + this.roundNumber * 7193 + 883,
      reveal,
    });
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
    const difficulty = this.pickDifficulty(roundNumber, random());
    const gateCount: 3 | 4 = difficulty === 'easy' && random() < 0.58 ? 3 : 4;
    const correctOptionNumber = Math.floor(random() * gateCount) + 1;
    const signature = `maze-gates:${difficulty}:${gateCount}:${correctOptionNumber}:${Math.floor(random() * 9999)}`;

    return {
      id: `maze-gates-${roundNumber}-${signature}`,
      gateCount,
      correctOptionNumber,
      difficulty,
      category: 'games',
      signature,
      seed,
    };
  }

  private pickDifficulty(roundNumber: number, roll: number): QuestionDifficulty {
    // Progressive difficulty: Easy → Medium → Hard → Repeat
    const cyclePosition = ((roundNumber - 1) % 3);
    
    if (cyclePosition === 0) {
      // First round of cycle: always easy
      return 'easy';
    }
    if (cyclePosition === 1) {
      // Second round of cycle: always medium
      return 'medium';
    }
    // Third round of cycle and beyond: always hard
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
  locale: LocaleCode;
  gateCount: 3 | 4;
  correctOptionNumber: number;
  seed: number;
  reveal: boolean;
};

type FullMazeDirection = 'top' | 'right' | 'bottom' | 'left';

type FullMazeCellWalls = Record<FullMazeDirection, boolean>;

type FullMazeGrid = FullMazeCellWalls[][];

const FULL_MAZE_COLUMNS = 21;
const FULL_MAZE_ROWS = 15;
const FULL_MAZE_CELL_SIZE = 20;
const FULL_MAZE_BOARD_X = 150;
const FULL_MAZE_BOARD_Y = 56;
const FULL_MAZE_VIEW_WIDTH = 720;
const FULL_MAZE_VIEW_HEIGHT = 420;

function buildFullMazeBoard(options: FullMazeBuildOptions): MazeGateFullMaze {
  for (let attempt = 0; attempt < 18; attempt += 1) {
    const random = createSeededRandom(options.seed + attempt * 100_003);
    const generated = generateFullMazeAttempt(options, random);
    const solutionCells = findOpenMazePath(generated.grid, generated.gateCells[options.correctOptionNumber - 1], generated.exitCell);

    if (solutionCells.length > 1) {
      return convertFullMazeToSnapshot(options, generated, solutionCells);
    }
  }

  const fallbackRandom = createSeededRandom(options.seed + 9_999_991);
  const fallback = generateFullMazeAttempt({ ...options, gateCount: options.gateCount }, fallbackRandom, true);
  const solutionCells = findOpenMazePath(fallback.grid, fallback.gateCells[options.correctOptionNumber - 1], fallback.exitCell);
  return convertFullMazeToSnapshot(options, fallback, solutionCells);
}

function generateFullMazeAttempt(options: FullMazeBuildOptions, random: () => number, skipWrongIslands = false): {
  grid: FullMazeGrid;
  gateCells: MazeCell[];
  exitCell: MazeCell;
} {
  const gateColumns = options.gateCount === 3 ? [3, 10, 17] : [2, 8, 13, 18];
  const gateCells = gateColumns.map((col) => ({ col, row: FULL_MAZE_ROWS - 1 }));
  const exitCell = { col: Math.floor(FULL_MAZE_COLUMNS / 2), row: 0 };
  const correctStart = gateCells[options.correctOptionNumber - 1];
  const grid = createClosedFullMazeGrid(FULL_MAZE_COLUMNS, FULL_MAZE_ROWS);
  const reservedCells = new Set<string>([cellKey(correctStart), cellKey(exitCell)]);
  const wrongIslands: Set<string>[] = [];

  if (!skipWrongIslands) {
    for (const gateCell of gateCells) {
      if (cellsEqual(gateCell, correctStart)) continue;
      const island = growWrongGateIsland(gateCell, reservedCells, random);
      for (const key of island) reservedCells.add(key);
      wrongIslands.push(island);
      carvePerfectMazeInsideSubset(grid, island, gateCell, random);
    }
  }

  const blockedCells = new Set<string>();
  for (const island of wrongIslands) {
    for (const key of island) blockedCells.add(key);
  }

  const mainCells = new Set<string>();
  for (let row = 0; row < FULL_MAZE_ROWS; row += 1) {
    for (let col = 0; col < FULL_MAZE_COLUMNS; col += 1) {
      const key = cellKey({ col, row });
      if (!blockedCells.has(key)) mainCells.add(key);
    }
  }

  carvePerfectMazeInsideSubset(grid, mainCells, correctStart, random);

  for (const gateCell of gateCells) {
    grid[gateCell.row][gateCell.col].bottom = false;
  }
  grid[exitCell.row][exitCell.col].top = false;

  return { grid, gateCells, exitCell };
}

function createClosedFullMazeGrid(columns: number, rows: number): FullMazeGrid {
  return Array.from({ length: rows }, () =>
    Array.from({ length: columns }, () => ({ top: true, right: true, bottom: true, left: true })),
  );
}

function growWrongGateIsland(start: MazeCell, reserved: Set<string>, random: () => number): Set<string> {
  const island = new Set<string>([cellKey(start)]);
  const targetSize = 18 + Math.floor(random() * 12);
  const maxTopRow = 4;

  for (let guard = 0; guard < 280 && island.size < targetSize; guard += 1) {
    const current = randomCellFromSet(island, random);
    const candidates = shuffled(fullMazeNeighborCells(current), random)
      .filter((cell) => cell.col >= 1 && cell.col < FULL_MAZE_COLUMNS - 1)
      .filter((cell) => cell.row >= maxTopRow && cell.row < FULL_MAZE_ROWS)
      .filter((cell) => !reserved.has(cellKey(cell)))
      .filter((cell) => !island.has(cellKey(cell)));

    const next = candidates[0];
    if (next) island.add(cellKey(next));
  }

  return island;
}

function carvePerfectMazeInsideSubset(grid: FullMazeGrid, subset: Set<string>, preferredStart: MazeCell, random: () => number): void {
  const visited = new Set<string>();
  const starts = [preferredStart, ...[...subset].map(parseCellKey).filter((cell) => !cellsEqual(cell, preferredStart))];

  for (const start of starts) {
    const startKey = cellKey(start);
    if (!subset.has(startKey) || visited.has(startKey)) continue;

    visited.add(startKey);
    const stack: MazeCell[] = [start];

    while (stack.length > 0) {
      const current = stack[stack.length - 1];
      const neighborsToVisit = shuffled(fullMazeNeighborCells(current), random)
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

function fullMazeNeighborCells(cell: MazeCell): MazeCell[] {
  return [
    { col: cell.col, row: cell.row - 1 },
    { col: cell.col + 1, row: cell.row },
    { col: cell.col, row: cell.row + 1 },
    { col: cell.col - 1, row: cell.row },
  ].filter((candidate) => candidate.col >= 0 && candidate.col < FULL_MAZE_COLUMNS && candidate.row >= 0 && candidate.row < FULL_MAZE_ROWS);
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

function findOpenMazePath(grid: FullMazeGrid, start: MazeCell, target: MazeCell): MazeCell[] {
  const queue: MazeCell[] = [start];
  const previous = new Map<string, MazeCell>();
  const visited = new Set<string>([cellKey(start)]);

  for (let index = 0; index < queue.length; index += 1) {
    const current = queue[index];
    if (cellsEqual(current, target)) return reconstructPath(start, target, previous);

    for (const next of openFullMazeNeighbors(grid, current)) {
      const key = cellKey(next);
      if (visited.has(key)) continue;
      visited.add(key);
      previous.set(key, current);
      queue.push(next);
    }
  }

  return [];
}

function openFullMazeNeighbors(grid: FullMazeGrid, cell: MazeCell): MazeCell[] {
  const walls = grid[cell.row][cell.col];
  const candidates: MazeCell[] = [];
  if (!walls.top && cell.row > 0) candidates.push({ col: cell.col, row: cell.row - 1 });
  if (!walls.right && cell.col < FULL_MAZE_COLUMNS - 1) candidates.push({ col: cell.col + 1, row: cell.row });
  if (!walls.bottom && cell.row < FULL_MAZE_ROWS - 1) candidates.push({ col: cell.col, row: cell.row + 1 });
  if (!walls.left && cell.col > 0) candidates.push({ col: cell.col - 1, row: cell.row });
  return candidates;
}

function convertFullMazeToSnapshot(
  options: FullMazeBuildOptions,
  generated: { grid: FullMazeGrid; gateCells: MazeCell[]; exitCell: MazeCell },
  solutionCells: MazeCell[],
): MazeGateFullMaze {
  const boardWidth = FULL_MAZE_COLUMNS * FULL_MAZE_CELL_SIZE;
  const boardHeight = FULL_MAZE_ROWS * FULL_MAZE_CELL_SIZE;
  const wallSegments = buildFullMazeWallSegments(generated.grid);
  const choices = Array.from({ length: options.gateCount }, (_, index) => ({
    optionNumber: index + 1,
    command: `!${index + 1}`,
    label: GATE_LABELS[options.locale][index] ?? `Gate ${index + 1}`,
  }));

  return {
    viewBoxWidth: FULL_MAZE_VIEW_WIDTH,
    viewBoxHeight: FULL_MAZE_VIEW_HEIGHT,
    boardX: FULL_MAZE_BOARD_X,
    boardY: FULL_MAZE_BOARD_Y,
    boardWidth,
    boardHeight,
    columns: FULL_MAZE_COLUMNS,
    rows: FULL_MAZE_ROWS,
    wallSegments,
    solutionPath: options.reveal ? buildFullMazeSolutionPolyline(solutionCells) : [],
    gates: choices.map((choice, index) => {
      const cell = generated.gateCells[index];
      const point = fullMazeCellCenter(cell);
      return {
        ...choice,
        x: point.x,
        y: FULL_MAZE_BOARD_Y + boardHeight + 24,
        isCorrect: options.reveal && choice.optionNumber === options.correctOptionNumber,
        isDeadEnd: options.reveal && choice.optionNumber !== options.correctOptionNumber,
      };
    }),
    exit: {
      x: fullMazeCellCenter(generated.exitCell).x,
      y: FULL_MAZE_BOARD_Y - 24,
      label: 'EXIT',
    },
  };
}

function buildFullMazeWallSegments(grid: FullMazeGrid): MazeGateFullMaze['wallSegments'] {
  const segments: MazeGateFullMaze['wallSegments'] = [];

  for (let row = 0; row < FULL_MAZE_ROWS; row += 1) {
    for (let col = 0; col < FULL_MAZE_COLUMNS; col += 1) {
      const walls = grid[row][col];
      const x = FULL_MAZE_BOARD_X + col * FULL_MAZE_CELL_SIZE;
      const y = FULL_MAZE_BOARD_Y + row * FULL_MAZE_CELL_SIZE;
      const size = FULL_MAZE_CELL_SIZE;

      if (walls.top) segments.push({ x1: x, y1: y, x2: x + size, y2: y });
      if (walls.left) segments.push({ x1: x, y1: y, x2: x, y2: y + size });
      if (col === FULL_MAZE_COLUMNS - 1 && walls.right) segments.push({ x1: x + size, y1: y, x2: x + size, y2: y + size });
      if (row === FULL_MAZE_ROWS - 1 && walls.bottom) segments.push({ x1: x, y1: y + size, x2: x + size, y2: y + size });
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

function buildFullMazeSolutionPolyline(cells: MazeCell[]): MazeGatePathSummary['path'] {
  if (cells.length === 0) return [];
  const points = cells.map(fullMazeCellCenter);
  const first = points[0];
  const last = points[points.length - 1];
  return compressCollinearPoints([
    { x: first.x, y: FULL_MAZE_BOARD_Y + FULL_MAZE_ROWS * FULL_MAZE_CELL_SIZE + 24 },
    first,
    ...points.slice(1),
    { x: last.x, y: FULL_MAZE_BOARD_Y - 24 },
  ]);
}

function fullMazeCellCenter(cell: MazeCell): MazeGatePathSummary['path'][number] {
  return {
    x: FULL_MAZE_BOARD_X + cell.col * FULL_MAZE_CELL_SIZE + FULL_MAZE_CELL_SIZE / 2,
    y: FULL_MAZE_BOARD_Y + cell.row * FULL_MAZE_CELL_SIZE + FULL_MAZE_CELL_SIZE / 2,
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
