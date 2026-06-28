import type { CitizenRole, CitizenRuntime } from '../citizens/citizen-types';
import type { QuestionBankStats, QuestionCategory, QuestionDifficulty } from '../questions/question-types';

export type TrueFakeAnswer = 'true' | 'fake';

export type ShapeCountShapeId = 'circle' | 'square' | 'triangle' | 'star' | 'diamond' | 'hexagon';

export type ShapeCountAnswer = ShapeCountShapeId;

export type MemoryCountAnswer = `option-${1 | 2 | 3 | 4}`;

export type FoodOriginAnswer = `option-${1 | 2 | 3 | 4}`;

export type BeforeOrAfterAnswer = `option-${1 | 2}`;

export type GuessLogoAnswer = `option-${1 | 2 | 3 | 4}`;

export type MazeGateAnswer = `option-${1 | 2 | 3 | 4}`;

export type HangmanAnswer = `letter:${string}` | `word:${string}`;

export type CoupleOrSiblingsAnswer = `option-${1 | 2}`;

export type CountTheBeatAnswer = number;

export type LuckyCupAnswer = number;

export type MiniGameAnswer = TrueFakeAnswer | ShapeCountAnswer | MemoryCountAnswer | FoodOriginAnswer | BeforeOrAfterAnswer | GuessLogoAnswer | MazeGateAnswer | HangmanAnswer | CoupleOrSiblingsAnswer | CountTheBeatAnswer | LuckyCupAnswer;

export type MiniGameId = 'true-fake' | 'shape-count' | 'memory-count' | 'food-origin' | 'before-after' | 'guess-logo' | 'maze-gates' | 'hangman' | 'couple-or-siblings' | 'count-the-beat' | 'lucky-cup';

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
  points: number;
  isCorrect: boolean;
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


export type GuessLogoChoice = {
  optionNumber: number;
  command: string;
  label: string;
  value: string;
};

export type BeforeOrAfterChoice = {
  optionNumber: number;
  command: string;
  label: string;
  value: 'left' | 'right';
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


export type HangmanSnapshot = {
  maskedWord: string;
  hint: string;
  guessedLetters: string[];
  wrongLetters: string[];
  maxWrongGuesses: number;
  remainingWrongGuesses: number;
  correctWord: string | null;
  winnerDisplayName: string | null;
  isSolved: boolean;
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
  kind: 'coin' | 'star' | 'gem' | 'bolt' | 'heart' | 'crown';
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
  } | null;
  foodOrigin?: {
    dishName: string;
    dishImageLabel: string;
    dishImageUrl?: string | null;
    choices: CountryChoice[];
    correctCountry: string | null;
    correctCountryCode: string | null;
  } | null;
  beforeOrAfter?: {
    prompt: string;
    categoryLabel: string;
    choices: BeforeOrAfterChoice[];
    correctLabel: string | null;
    correctOptionNumber: number | null;
  } | null;
  guessLogo?: {
    prompt: string;
    logoMark: string;
    choices: GuessLogoChoice[];
    correctLogo: string | null;
    correctOptionNumber: number | null;
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
  hangman?: HangmanSnapshot | null;
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
  answerMargin: number;
  scoring: {
    exact: number;
    marginOne: number;
    marginTwo: number;
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

