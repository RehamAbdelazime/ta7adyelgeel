import type { CitizenRole, CitizenRuntime } from '../citizens/citizen-types';
import type { QuestionBankStats, QuestionCategory, QuestionDifficulty } from '../questions/question-types';


export type ShapeCountShapeId = 'circle' | 'square' | 'triangle' | 'star' | 'diamond' | 'hexagon';

export type ShapeCountAnswer = ShapeCountShapeId;

export type MemoryCountAnswer = `option-${1 | 2 | 3 | 4}`;

export type FoodOriginAnswer = `option-${1 | 2 | 3 | 4}`;


export type VisualGuessAnswer = `option-${1 | 2 | 3 | 4}`;
export type VisualGuessChoice = {
  optionNumber: number;
  command: string;
  label: string;
  value: string;
};

export type MazeGateAnswer = `option-${1 | 2 | 3 | 4}`;


export type CoupleOrSiblingsAnswer = `option-${1 | 2}`;

export type CountTheBeatAnswer = number;

export type LuckyCupAnswer = number;

export type MiniGameAnswer = ShapeCountAnswer | MemoryCountAnswer | FoodOriginAnswer | VisualGuessAnswer | MazeGateAnswer | CoupleOrSiblingsAnswer | CountTheBeatAnswer | LuckyCupAnswer;

export type { MiniGameId } from './minigame-registry';
import type { MiniGameId } from './minigame-registry';

export type MiniGameStatus =
  | 'idle'
  | 'intro'
  | 'prepare'
  | 'answering'
  | 'resolved'
  | 'scored'
  | 'leaderboard';

export type MiniGameAnswerRecord = {
  twitchUserId: string;
  displayName: string;
  role: CitizenRole;
  answer: MiniGameAnswer;
  submittedAt: number;
  isCorrect?: boolean;
  /** True when the player submitted after the reusable timed hint was revealed. */
  usedHint?: boolean;
  /** Score multiplier applied to correct answers for this submission. */
  scoreMultiplier?: number;
};

export type MiniGameScoreAward = {
  twitchUserId: string;
  displayName: string;
  role: CitizenRole;
  /** Runtime leaderboard score delta, after game-specific scoring rules. */
  points: number;
  /** True for a fully correct answer or a successful game-specific action (for example, a correct game action). Numeric near-misses remain false. */
  isCorrect: boolean;
  /** Explicit partial-credit classification for numeric estimate games. */
  scoreOutcome?: 'correct' | 'partial' | 'incorrect';
  /** Maximum available points for this answer; used to cap partial credit centrally. */
  maxPoints?: number;
  difficulty: QuestionDifficulty;
  usedHint?: boolean;
  scoreMultiplier?: number;
};

export type ShapeCountCell = {
  id: string;
  shape: ShapeCountShapeId;
};

export type ShapeCountChoice = {
  shape: ShapeCountShapeId;
  label: string;
  command: string;
  optionNumber: number;
};

export type NumberChoice = {
  optionNumber: number;
  command: string;
  label: string;
  value: number;
};

export type CountryChoice = {
  optionNumber: number;
  command: string;
  label: string;
  countryCode: string;
};


export type CoupleOrSiblingsChoice = {
  optionNumber: number;
  command: string;
  label: string;
  value: 'couple' | 'siblings';
};



export type MazeGateChoice = {
  optionNumber: number;
  command: string;
  label: string;
};

export type MazeGatePathPoint = {
  x: number;
  y: number;
};

export type MazeGatePathSummary = {
  optionNumber: number;
  command: string;
  label: string;
  isCorrect: boolean;
  isDeadEnd: boolean;
  path: MazeGatePathPoint[];
};

export type MazeGateWallSegment = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

export type MazeGateEntranceMarker = {
  optionNumber: number;
  command: string;
  label: string;
  x: number;
  y: number;
  isCorrect: boolean;
  isDeadEnd: boolean;
};

export type MazeGateFullMaze = {
  viewBoxWidth: number;
  viewBoxHeight: number;
  boardX: number;
  boardY: number;
  boardWidth: number;
  boardHeight: number;
  columns: number;
  rows: number;
  wallSegments: MazeGateWallSegment[];
  solutionPath: MazeGatePathPoint[];
  gates: MazeGateEntranceMarker[];
  exit: { x: number; y: number; label: string };
};



export type MiniGameHintSnapshot = {
  isEnabled: boolean;
  isRevealed: boolean;
  revealAt: number | null;
  revealDelayMs: number;
  scoreMultiplierAfterReveal: number;
  label: string;
  hiddenValueLabel: string;
  revealedValueLabel: string;
  value: string | null;
};

export type MemoryCountCell = {
  id: string;
  kind: 'sun' | 'star' | 'gem' | 'bolt' | 'heart' | 'crown';
};

export type MiniGameSnapshot = {
  id: MiniGameId;
  status: MiniGameStatus;
  roundNumber: number;
  title: string;
  statement: string;
  instruction: string;
  acceptsAnswers: boolean;
  officialAnswerCount: number;
  spectatorAnswerCount: number;
  answerRecords: MiniGameAnswerRecord[];
  correctAnswer: MiniGameAnswer | null;
  correctOfficialCount: number;
  correctSpectatorCount: number;
  hasRound: boolean;
  questionId: string | null;
  questionCategory: QuestionCategory | null;
  questionDifficulty: QuestionDifficulty | null;
  questionBankStats: QuestionBankStats;
  hint?: MiniGameHintSnapshot | null;
  shapeGrid?: {
    rows: number;
    columns: number;
    cells: ShapeCountCell[];
    choices: ShapeCountChoice[];
    counts: Partial<Record<ShapeCountShapeId, number>>;
    mode: 'majority' | 'exact';
    targetCount: number | null;
  } | null;
  memoryCount?: {
    rows: number;
    columns: number;
    cells: MemoryCountCell[];
    targetKind: MemoryCountCell['kind'];
    targetLabel: string;
    choices: NumberChoice[];
    correctCount: number | null;
    showItems: boolean;
    scoring: {
      exact: number;
      partial: number;
      partialTolerance: number;
      incorrect: number;
    };
  } | null;
  foodOrigin?: {
    dishName: string;
    dishImageLabel: string;
    dishImageUrl?: string | null;
    choices: CountryChoice[];
    correctCountry: string | null;
    correctCountryCode: string | null;
  } | null;
  visualGuess?: {
    fallbackImageUrl: string;
    mode: 'scene' | 'poster' | 'eyes' | 'silhouette' | 'zoom' | 'reveal';
    imageUrl: string;
    focus: { x: number; y: number };
    titleMask: { x: number; y: number; w: number; h: number } | null;
    titleMasks: { x: number; y: number; w: number; h: number }[];
    posterAspectRatio: number | null;
    choices: VisualGuessChoice[];
    correctOptionNumber: number | null;
    correctLabel: string | null;
  } | null;
  mazeGates?: {
    gateCount: number;
    choices: MazeGateChoice[];
    revealPath: boolean;
    correctOptionNumber: number | null;
    paths: MazeGatePathSummary[];
    fullMaze?: MazeGateFullMaze | null;
  } | null;
  countTheBeat?: CountTheBeatSnapshot | null;
  luckyCup?: LuckyCupSnapshot | null;
  coupleOrSiblings?: {
    imageUrl: string;
    imageAlt: string;
    choices: CoupleOrSiblingsChoice[];
    correctAnswer: 'couple' | 'siblings' | null;
  } | null;
};

export type SubmitMiniGameAnswerResult =
  | { ok: true; record: MiniGameAnswerRecord }
  | { ok: false; reason: 'no_round' | 'closed' | 'already_answered' };


export type CountTheBeatItemSnapshot = {
  id: string;
  icon: string;
  glyph: string;
  isTarget: boolean;
  x: number;
  y: number;
  size: number;
  delayMs: number;
  durationMs: number;
  rotate: number;
  tone: string;
};

export type CountTheBeatSnapshot = {
  targetIcon: string;
  targetLabel: string;
  targetGlyph: string;
  targetCount: number | null;
  items: CountTheBeatItemSnapshot[];
  /** Stable visual beat clock in beats per minute. */
  bpm: number;
  scoring: {
    exact: number;
    partial: number;
    partialTolerance: number;
    incorrect: number;
  };
};


export type LuckyCupSnapshot = {
  initialBallCupId: number;
  finalBallCupId: number;
  correctCupNumber: number | null;
  cups: { cupId: number; label: string }[];
  swaps: { id: string; a: number; b: number; delayMs: number; durationMs: number }[];
  revealMs: number;
};

export type MiniGameServiceContract<TAnswer extends MiniGameAnswer = MiniGameAnswer> = {
  beginTour: () => void;
  startRound: (roundNumber: number, seed?: number) => void;
  setStatus: (status: MiniGameStatus) => void;
  submitAnswer: (citizen: CitizenRuntime, answer: TAnswer) => SubmitMiniGameAnswerResult;
  resolveRound: () => void;
  createScoreAwards: () => MiniGameScoreAward[];
  clearActiveRound: () => void;
  clear: () => void;
  getSnapshot: (locale: 'en' | 'ar') => MiniGameSnapshot;
};

export type MiniGameDefinition = {
  id: MiniGameId;
  titleKey: string;
  descriptionKey: string;
  modulePath: string;
};

