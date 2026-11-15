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
const { generateLaserPuzzle, traceLaser, reflectLaser } = require('../src/game-core/minigames/laser-challenge/laser-puzzle.ts');
const { projectLaserPoint, projectedLaserDistance, LASER_VERTICAL_BOARD } = require('../src/game-core/minigames/laser-challenge/laser-board-layout.ts');
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
    assert.equal(puzzle.solution.length, { easy:6, medium:8, hard:10 }[difficulty]);
    assert.equal(puzzle.mirrors.filter(m => m.id.startsWith('m')).length, {easy:4,medium:6,hard:8}[difficulty]);
    // Model and actual screen projection share one viewport contract. Screen
    // coordinates are NOT a separate guessed solution: all reflections must
    // be valid on the V80 top-to-bottom board.
    const projectedSolution = puzzle.solution.map(projectLaserPoint);
    assert.equal(projectedSolution[0].y, LASER_VERTICAL_BOARD.sourceY);
    assert.equal(projectedSolution.at(-1).y, LASER_VERTICAL_BOARD.receiverY);
    assert.equal(projectedSolution.at(-1).x,
      LASER_VERTICAL_BOARD.firstReceiverX + (puzzle.correctTarget - 1) * LASER_VERTICAL_BOARD.receiverStepX);
    for (let i=1;i<projectedSolution.length-1;i++) {
      const before=projectedSolution[i-1], here=projectedSolution[i], after=projectedSolution[i+1];
      const mirror=puzzle.mirrors.find(m => Math.hypot(
        projectLaserPoint(m).x-here.x, projectLaserPoint(m).y-here.y) < .001);
      assert(mirror, 'a visual beam turn must correspond to a visible mirror');
      const incoming=[Math.sign(here.x-before.x),Math.sign(here.y-before.y)];
      const outgoing=[Math.sign(after.x-here.x),Math.sign(after.y-here.y)];
      assert.deepEqual(reflectLaser(...incoming,mirror.slash).map(n=>n||0), outgoing,
        'the V80 mirror slope must match the projected reflection');
    }
    for(let i=0;i<puzzle.mirrors.length;i++) for(let j=i+1;j<puzzle.mirrors.length;j++) {
      assert(projectedLaserDistance(puzzle.mirrors[i],puzzle.mirrors[j]) >= LASER_VERTICAL_BOARD.mirrorCenterClearance,
        `overlapping crystal mirrors in ${difficulty} seed ${seed}`);
    }
    const trace = traceLaser(puzzle.source, puzzle.mirrors);
    assert.deepEqual(trace, puzzle.solution);
    assert.equal(puzzle.targetYs.indexOf(trace.at(-1).y)+1, puzzle.correctTarget);
    assert.equal(puzzle.mirrors.length, {easy:9,medium:13,hard:16}[difficulty]);
    assert.equal(puzzle.solution.at(-1).x, 794, 'Laser must finish at the separate receiver beneath the answer');
    assert.equal(puzzle.solution[0].x, 80, 'Laser cannon origin must not move');
    if (difficulty !== 'easy') {
      assert(puzzle.solution.some((p,i) => i && p.x < puzzle.solution[i-1].x), 'Medium/Hard puzzles need a backwards detour');
    }
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
  assert(before.laserChallenge.mirrors.every(m=>/^mirror-\d+$/.test(m.id)), 'do not leak true mirror/distractor IDs');
  assert(!before.statement.includes('undefined'));
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
// V80: The shared QuestionScreenShell renders four ChoiceCards OUTSIDE the
// SVG, whereas the laser board is just optics. Keep the old V75 test from
// falsely requiring a duplicate answer card inside a <foreignObject>.
const boardSource = fs.readFileSync(path.join(root, 'src/ui-react/components/gameplay/minigames/LaserBoard.tsx'), 'utf8');
const screenSource = fs.readFileSync(path.join(root, 'src/ui-react/components/gameplay/minigames/LaserChallengeScreen.tsx'), 'utf8');
const shellSource = fs.readFileSync(path.join(root, 'src/ui-react/components/gameplay/shared/question-shell.tsx'), 'utf8');
const boardCSS = fs.readFileSync(path.join(root, 'src/ui-react/styles/laser-challenge-v75.css'), 'utf8');
const tutorialSource = fs.readFileSync(path.join(root, 'src/ui-react/components/gameplay/shared/AllGamesTwoPageIntro.tsx'), 'utf8');
assert.match(screenSource, /<QuestionScreenShell/);
assert.match(screenSource, /choices=\{choices\}/);
assert.match(screenSource, /<LaserBoard plan=\{plan\}/);
assert.match(shellSource, /export function ChoiceCard/);
assert.match(shellSource, /orderedChoices\.map/);
assert.doesNotMatch(boardSource, /<ChoiceCard|<foreignObject|laser-v75-target-choice/,
  'do not duplicate shared answer cards inside SVG');
assert.match(boardSource, /projectLaserPoint/);
assert.match(boardSource, /cy=\{LASER_VERTICAL_BOARD\.receiverY\}/,
  'visible exit sockets must use the shared geometry, never a removed constant');
assert.doesNotMatch(boardSource, /\bRECEIVER_Y\b/, 'old projection constant must not survive');
assert.match(boardSource, /translate\(locale, 'minigame\.laserChallenge\.boardAria'\)/);
assert.match(boardSource, /href=\{MIRROR_SPRITE\}/, 'mirror image asset must be shared');
assert.match(boardSource, /href=\{EMITTER_SPRITE\}/, 'emitter image asset must be shared');
assert.match(boardSource, /mirror\.slash === '\/' \? undefined : 'rotate\(90\)'/, 'do not rotate the pre-diagonal mirror twice');
assert.doesNotMatch(boardSource, /laserV80Crystal|laserV80Steel/, 'no duplicate procedural mirror/cannon materials');
assert.match(boardCSS, /laser-v80-beam-shell/, 'ray reference must have pink shell and bright core');
for (const name of ['laser-mirror', 'laser-emitter', 'laser-beam-reference']) {
  const sprite = path.join(root, `public/assets/game/runtime/minigames/laser-challenge/${name}.png`);
  assert(fs.existsSync(sprite), `missing approved sprite: ${name}`);
  const png = fs.readFileSync(sprite);
  assert.equal(png.toString('hex', 0, 8), '89504e470d0a1a0a', 'sprite must be PNG');
}
assert.doesNotMatch(boardCSS, /\.laser-v80-shell[^\n]*\.gameplay-choice-card/,
  'only common choices stylesheet may own the answer visuals');
assert.match(tutorialSource, /tutorial\.twoPage\.laser\.pages\.1\.lines\.1/,
  'two-page tutorial must use the translated V80 vertical orientation instructions');
assert.match(fs.readFileSync(path.join(root, 'src/game-core/localization/translations.ts'),'utf8'), /المدفع فوق، وأربع مخارج تحت/,
  'Arabic laser translation must correctly describe the vertical orientation');
assert.match(tutorialSource, /'laser-challenge'[^]*?choices:\[\s*'tutorial\.twoPage\.laser\.choices\.1'/,
  'two-page tutorial must have four localized shared answer choices');
for (let i=1; i<=4; i++) assert(tutorialSource.includes(`tutorial.twoPage.laser.choices.${i}`), 'missing laser option '+i);
console.log(`Laser Challenge V75 PASS: ${rounds} traced E/M/H puzzles, ${mirrorPatterns.size} unique boards, 4 destinations, no pre-reveal path/answer, chat gating and one-time scoring.`);
