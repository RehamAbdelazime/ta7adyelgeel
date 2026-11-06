/* V36 actual runtime checks without node_modules, using globally installed TypeScript. */
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => {
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true, resolveJsonModule: true },
    fileName: filename,
  }).outputText;
  module._compile(code, filename);
};
const root = path.resolve(__dirname, '..');
const { VisualGuessMiniGameService, getVisualGuessBank } = require(path.join(root, 'src/game-core/minigames/visual-guess/visual-guess-service.ts'));
const citizen = { twitchUserId: 'v36-citizen', displayName: 'Player V36', role: 'official' };
const byMode = { 'guess-movie': ['poster','poster','poster','poster'], 'guess-star':['eyes','silhouette','zoom','reveal'] };
let total = 0;
for (const gameId of Object.keys(byMode)) {
  const service = new VisualGuessMiniGameService(gameId);
  service.beginTour();
  const used = new Set();
  for (const [roundIndex, mode] of byMode[gameId].entries()) {
    service.startRound(roundIndex + 1, 405 + roundIndex);
    const intro = service.getSnapshot('ar');
    assert(intro.hasRound && !intro.acceptsAnswers && !intro.correctAnswer);
    assert.equal(intro.visualGuess.mode, mode, `${gameId}: wrong visual mode in round ${roundIndex+1}`);
    assert(!used.has(intro.questionId), `${gameId}: duplicate visual clue before pool exhausted`);
    used.add(intro.questionId);
    assert.equal(intro.visualGuess.choices.length, 4);
    assert.equal(new Set(intro.visualGuess.choices.map(c => c.value)).size, 4);
    assert(intro.visualGuess.choices.every(c => c.label), 'missing localized choice');
    assert.equal(intro.visualGuess.correctOptionNumber, null, 'correct option leaked in intro');
    service.setStatus('answering');
    const before = service.getSnapshot('en');
    assert(before.acceptsAnswers);
    assert.equal(before.visualGuess.correctLabel, null);
    assert(before.visualGuess.choices.every(c => c.command.startsWith('!')));
    // Submit first candidate, verify single-answer lock and no pre-reveal solution.
    const picked = service.getAnswerByOptionNumber(1);
    assert(picked && service.submitAnswer(citizen, picked).ok);
    assert.equal(service.submitAnswer(citizen, picked).reason, 'already_answered');
    assert.equal(service.getAnswerByOptionNumber(5), null);
    service.resolveRound();
    const scored = service.getSnapshot('en');
    const actual = scored.visualGuess.correctOptionNumber;
    assert(actual >= 1 && actual <= 4);
    assert.equal(scored.correctAnswer, `option-${actual}`);
    assert(scored.visualGuess.correctLabel);
    const awards = service.createScoreAwards();
    assert.equal(awards.length, 1);
    assert.equal(awards[0].points > 0, actual === 1);
    assert.equal(service.createScoreAwards().length, 0, 'double scoring');
    total++;
  }
  console.log(`[PASS] ${gameId}: all ${byMode[gameId].length} modes, varied clues, answer lock, reveal, scoring`);
}
const { GameStore } = require(path.join(root, 'src/game-core/app/game-store.ts'));
const { GameEventBus } = require(path.join(root, 'src/game-core/events/game-event-bus.ts'));
for (const gameId of Object.keys(byMode)) {
  const store = new GameStore(new GameEventBus());
  try {
    store.joinCitizen({ twitchUserId: 'v36-check', displayName: 'Tester' });
    store.startTour(4, [gameId], 'mini_game');
    assert.equal(store.getSnapshot().tour.phase, 'mini_game_intro');
    assert.equal(store.getSnapshot().miniGame.id, gameId);
    store.skipPhase();
    assert.equal(store.getSnapshot().tour.phase, 'tour_starting');
    store.skipPhase();
    assert.equal(store.getSnapshot().tour.phase, 'answer_window_open');
    store.skipPhase();
    assert.equal(store.getSnapshot().tour.phase, 'scoring');
    assert(store.getSnapshot().miniGame.visualGuess.correctLabel);
    total++;
  } finally { store.destroy(); }
  console.log(`[PASS] ${gameId}: real GameStore intro → prepare → answers → reveal`);
}
assert.equal(getVisualGuessBank('guess-movie').length,50);
assert.equal(getVisualGuessBank('guess-star').length,20);
console.log(`V36 visual-guess runtime PASS: ${total} modes/flows across both new mini-games.`);
