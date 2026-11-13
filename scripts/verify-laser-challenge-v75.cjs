/** Run with Node on Windows: never requires Electron/browser or a content bank. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
require.extensions['.ts'] = (mod, filename) => mod._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  fileName: filename, compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
    esModuleInterop: true, resolveJsonModule: true },
}).outputText, filename);
const { generateLaserPuzzle, traceLaser } = require('../src/game-core/minigames/laser-challenge/laser-puzzle.ts');
const { LaserChallengeMiniGameService } = require('../src/game-core/minigames/laser-challenge/laser-challenge-service.ts');
const { MINI_GAME_REGISTRY } = require('../src/game-core/minigames/minigame-registry.ts');
assert.equal(MINI_GAME_REGISTRY.find(g => g.id === 'laser-challenge')?.availability, 'public');
const first = generateLaserPuzzle('hard', 42);
assert.deepEqual(first, generateLaserPuzzle('hard', 42), 'Same seed must reproduce exact puzzle');
let rounds = 0;
const targets = new Set(), mirrorPatterns = new Set();
for (const difficulty of ['easy','medium','hard']) {
  for (let seed=1;seed<=900;seed++) {
    const puzzle = generateLaserPuzzle(difficulty, seed * 311 + (difficulty.length * 47));
    assert.equal(puzzle.solution.length, { easy:4, medium:6, hard:8 }[difficulty]);
    assert.equal(puzzle.mirrors.filter(m => m.id.startsWith('m')).length, {easy:2,medium:4,hard:6}[difficulty]);
    const trace = traceLaser(puzzle.source, puzzle.mirrors);
    assert.deepEqual(trace, puzzle.solution);
    assert.equal(puzzle.targetYs.indexOf(trace.at(-1).y)+1, puzzle.correctTarget);
    assert.equal(puzzle.mirrors.length, {easy:5,medium:10,hard:15}[difficulty]);
    targets.add(puzzle.correctTarget);
    mirrorPatterns.add(puzzle.mirrors.map(m => `${m.x}/${m.y}/${m.slash}`).sort().join(','));
    rounds++;
  }
}
assert.deepEqual([...targets].sort(), [1,2,3,4]);
assert(mirrorPatterns.size > 1000, 'A content-free game still needs substantial replay variety');
const svc = new LaserChallengeMiniGameService();
const citizen = { twitchUserId:'player', displayName:'Player', role:'official' };
for (let round=1;round<=3;round++) {
  svc.startRound(round, 770 + round);
  const before=svc.getSnapshot('ar');
  assert.equal(before.questionDifficulty, ['easy','medium','hard'][round-1]);
  assert.equal(before.correctAnswer, null);
  assert.equal(before.laserChallenge.correctTarget, null);
  assert.equal(before.laserChallenge.revealedPath, null);
  assert.equal(before.laserChallenge.targetYs.length,4);
  assert.equal(svc.submitAnswer(citizen,1).ok,false,'Can never answer during intro');
  svc.setStatus('answering');
  const solution = generateLaserPuzzle(before.questionDifficulty, 770 + round).correctTarget;
  assert.equal(svc.submitAnswer(citizen,solution).ok,true);
  assert.equal(svc.submitAnswer(citizen,solution).reason,'already_answered');
  assert.equal(svc.getSnapshot('en').laserChallenge.correctTarget,null);
  svc.resolveRound();
  const revealed=svc.getSnapshot('ar');
  assert.equal(revealed.laserChallenge.correctTarget,solution);
  assert(revealed.laserChallenge.revealedPath.length>2);
  assert.equal(revealed.answerRecords[0].isCorrect,true);
  const awards=svc.createScoreAwards();
  assert.equal(awards.length,1);
  assert(awards[0].points>0);
  assert.equal(svc.createScoreAwards().length,0,'Score once only');
}
console.log(`Laser Challenge V75 PASS: ${rounds} traced E/M/H puzzles, ${mirrorPatterns.size} unique boards, 4 destinations, no pre-reveal path/answer, chat gating and one-time scoring.`);
