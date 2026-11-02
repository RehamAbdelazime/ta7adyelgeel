import fs from 'node:fs';

function read(file) {
  if (!fs.existsSync(file)) throw new Error(`Missing scoring-policy file: ${file}`);
  return fs.readFileSync(file, 'utf8');
}

function assertIncludes(source, needle, message) {
  if (!source.includes(needle)) throw new Error(message);
}

function assertNotIncludes(source, needle, message) {
  if (source.includes(needle)) throw new Error(message);
}

const policy = read('src/game-core/minigames/scoring-policy.ts');
for (const symbol of [
  'MINI_GAME_BASE_POINTS',
  'NUMERIC_ESTIMATE_RULES',
  'NUMERIC_PARTIAL_CREDIT_RATIO',
  'getNumericEstimateScoringGuide',
  'calculateExactAnswerScore',
  'calculateNumericEstimateScore',
  'enforceMiniGameScoreAwardPolicy',
  'HANGMAN_SCORING',
  'calculateHangmanActionPoints',
  'FOOD_ORIGIN_HINT_SCORE_MULTIPLIER',
]) {
  assertIncludes(policy, symbol, `Shared scoring policy is missing ${symbol}.`);
}
assertNotIncludes(policy, 'calculateCorrectAnswerPoints', 'Legacy scoring helper must be removed.');
assertNotIncludes(policy, 'enforceIncorrectAnswerScorePolicy', 'Legacy scoring guard must be removed.');
assertIncludes(policy, 'const numericRule = getNumericEstimateRule(gameId);', 'Only the active numeric-estimate game may classify an answer as partial.');
assertIncludes(policy, 'getMiniGameBasePoints(gameId, award.difficulty)', 'Partial-credit caps must use canonical game points, not service-provided maxima.');
assertIncludes(policy, 'points === Math.round(Number(configuredPenalty))', 'Only the exact configured Chaos penalty may survive the final scoring guard.');

const registry = read('src/game-core/minigames/minigame-registry.ts');
const registryIds = new Set([...registry.matchAll(/^\s*id: ['\"]([^'\"]+)['\"]/gm)].map((match) => match[1]));
const pointTableMatch = policy.match(/MINI_GAME_BASE_POINTS:[\s\S]*?= \{([\s\S]*?)\n\};/);
if (!pointTableMatch) throw new Error('Could not parse the centralized mini-game base-points table.');
const pointTableIds = new Set([...pointTableMatch[1].matchAll(/^\s*(?:'([^']+)'|([a-z][a-z0-9-]*)): \{/gm)].map((match) => match[1] ?? match[2]));
for (const id of registryIds) {
  if (!pointTableIds.has(id)) throw new Error(`Central scoring table is missing registered mini-game: ${id}`);
}
for (const id of pointTableIds) {
  if (!registryIds.has(id)) throw new Error(`Central scoring table contains an unregistered mini-game: ${id}`);
}

const exactAnswerServices = [
  'src/game-core/minigames/food-origin/food-origin-service.ts',
  'src/game-core/minigames/shape-count/shape-count-service.ts',
  'src/game-core/minigames/maze-gates/maze-gates-service.ts',
  'src/game-core/minigames/before-or-after/before-or-after-service.ts',
  'src/game-core/minigames/guess-logo/guess-logo-service.ts',
  'src/game-core/minigames/true-fake/true-fake-service.ts',
  'src/game-core/minigames/couple-or-siblings/couple-or-siblings-service.ts',
  'src/game-core/minigames/lucky-cup/lucky-cup-service.ts',
];

for (const file of exactAnswerServices) {
  const source = read(file);
  assertIncludes(source, 'calculateExactAnswerScore', `${file} does not use centralized exact-answer scoring.`);
  assertNotIncludes(source, 'DIFFICULTY_SCORE', `${file} still defines a local points table.`);
  assertNotIncludes(source, 'calculateCorrectAnswerPoints', `${file} still uses the legacy scoring helper.`);
}

for (const file of [
  'src/game-core/minigames/count-the-beat/count-the-beat-service.ts',
  'src/game-core/minigames/memory-count/memory-count-service.ts',
]) {
  const source = read(file);
  assertIncludes(source, 'calculateNumericEstimateScore', `${file} does not use centralized numeric-estimate scoring.`);
  assertIncludes(source, 'getNumericEstimateScoringGuide', `${file} duplicates the numeric score guide calculation instead of using the shared helper.`);
  assertNotIncludes(source, 'DIFFICULTY_SCORE', `${file} still defines a local numeric scoring table.`);
  assertNotIncludes(source, 'calculateCorrectAnswerPoints', `${file} still uses the legacy scoring helper.`);
}

const foodOrigin = read('src/game-core/minigames/food-origin/food-origin-service.ts');
assertIncludes(foodOrigin, 'FOOD_ORIGIN_HINT_SCORE_MULTIPLIER', 'Food Origin hint multiplier must be centralized.');

const hangman = read('src/game-core/minigames/hangman/hangman-service.ts');
assertIncludes(hangman, 'calculateHangmanActionPoints', 'Hangman action points must use the central scoring policy.');
assertNotIncludes(hangman, 'HANGMAN_SCORING', 'Hangman must not keep a second scoring calculation in its service.');
assertNotIncludes(hangman, 'const CORRECT_LETTER_POINTS', 'Hangman must not duplicate its point constants.');
assertNotIncludes(hangman, 'const WORD_WINNER_BONUS', 'Hangman must not duplicate its word bonus table.');

const store = read('src/game-core/app/game-store.ts');
assertIncludes(store, 'enforceMiniGameScoreAwardPolicy(', 'GameStore is missing the shared scoring safety boundary.');
assertIncludes(store, 'const baseAwards = enforceMiniGameScoreAwardPolicy(', 'GameStore must validate base awards before Chaos modifiers.');
assertIncludes(store, '      this.activeMiniGameId,', 'GameStore must pass the active mini-game ID into the central score policy.');
assertIncludes(store, 'allowedWrongAnswerPenalty: this.activeChaosEvent?.wrongAnswerPenalty ?? null,', 'GameStore must only allow the exact negative penalty configured by the active Chaos event.');
assertIncludes(store, 'this.recordTourAwardStats(awards, scoresBeforeRound);', 'Tour totals must use actual runtime score deltas.');
assertIncludes(store, 'partialAnswers:', 'Tour stats must keep partial answers separate from exact and incorrect answers.');
assertNotIncludes(store, 'enforceIncorrectAnswerScorePolicy', 'GameStore still uses the legacy score guard.');

const chaos = read('src/game-core/chaos/chaos-event-service.ts');
assertIncludes(chaos, "getAwardScoreOutcome(award) === 'incorrect'", 'Risk Round must penalize fully incorrect answers, not numeric near-misses.');

const test = read('src/game-core/minigames/scoring-policy.test.ts');
for (const fragment of [
  'Count the Beat estimates',
  'Memory Count estimates',
  'quarter',
  'Risk Round penalties',
]) {
  assertIncludes(test, fragment, `Scoring regression tests are missing coverage for ${fragment}.`);
}

const countTheBeatUi = read('src/ui-react/components/gameplay/minigames/CountTheBeatScreen.tsx');
const memoryCountUi = read('src/ui-react/components/gameplay/minigames/MemoryCountScreen.tsx');
for (const [file, source] of [['Count The Beat', countTheBeatUi], ['Memory Count', memoryCountUi]]) {
  assertIncludes(source, 'ScoringGuide', `${file} must display its exact / near-miss / incorrect score rules.`);
  assertIncludes(source, "gameplay.scoring.withinMargin", `${file} must explain its numeric margin reward.`);
}

console.log('v2 scoring policy verified: scoring is centralized; exact answers receive full points, numeric near-misses receive capped quarter credit, incorrect answers receive zero, and Risk Round only penalizes fully incorrect answers.');
