/* Standalone verification: no npm install required. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');
const ts = (() => {
  try { return require('typescript'); } catch { return require('typescript'); }
})();
require.extensions['.ts'] = (module, filename) => {
  const source = fs.readFileSync(filename, 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true }, fileName: filename });
  module._compile(compiled.outputText, filename);
};
const root = path.join(__dirname, '..');
const { LuckyCupMiniGameService, getLuckyCupPreparationMsForRound } = require(path.join(root, 'src/game-core/minigames/lucky-cup/lucky-cup-service.ts'));
const { getLuckyCupMotion, getLuckyCupOrder, getLuckyCupPreparationMs, getLuckyCupShuffleEndMs, LUCKY_CUP_SHUFFLE_START_MS } = require(path.join(root, 'src/game-core/minigames/lucky-cup/lucky-cup-motion.ts'));
let checkCount = 0;
function check(condition, msg) { assert.ok(condition, msg); checkCount += 1; }
for (let round = 1; round <= 12; round++) {
  for (let seed = 1; seed <= 70; seed++) {
    const game = new LuckyCupMiniGameService();
    game.startRound(round, seed * 491);
    const plan = game.getSnapshot('ar').luckyCup;
    check(!!plan, 'plan missing');
    check(plan.swaps.length > 0, 'swaps missing');
    check(getLuckyCupPreparationMs(plan.swaps) === getLuckyCupPreparationMsForRound(round), 'phase duration out of sync');
    const finalOrder = getLuckyCupOrder(plan.swaps);
    const intendedSlot = finalOrder.indexOf(plan.initialBallCupId);
    check(intendedSlot + 1 === game.getAnswerByOptionNumber(intendedSlot + 1), 'input number map');
    const lastFrame = getLuckyCupMotion(plan.swaps, getLuckyCupShuffleEndMs(plan.swaps) + 1);
    check(lastFrame.every((frame) => frame.slot === finalOrder.indexOf(frame.cupId)), 'visual final slot differs');
    game.setStatus('resolved');
    check(game.getSnapshot('en').luckyCup.correctCupNumber === intendedSlot + 1, 'correct answer differs from shown shuffle');
    const initial = getLuckyCupMotion(plan.swaps, LUCKY_CUP_SHUFFLE_START_MS - 1);
    check(initial.every((frame) => frame.slot === frame.cupId), 'cup moved before shuffle');
    for (const swap of plan.swaps) {
      check(swap.a !== swap.b, 'self-swap not allowed');
    }
    // Find the frame immediately before and immediately after every swap.
    for (const swap of plan.swaps) {
      const prev = getLuckyCupMotion(plan.swaps, LUCKY_CUP_SHUFFLE_START_MS + swap.delayMs - 1);
      const next = getLuckyCupMotion(plan.swaps, LUCKY_CUP_SHUFFLE_START_MS + swap.delayMs + 1);
      check(prev.every((p) => Math.abs(p.slot - next.find((n) => n.cupId === p.cupId).slot) < .05), 'start frame jumps');
      const mid = getLuckyCupMotion(plan.swaps, LUCKY_CUP_SHUFFLE_START_MS + swap.delayMs + swap.durationMs / 2);
      check(mid.some((p) => p.arc > 0.3), 'cup does not lift during visible exchange');
    }
  }
}
// End-to-end tour transitions: every 3 rounds receives its OWN shuffle
// duration before any answers are accepted. This catches the previous-round
// snapshot bug in the state machine's pre-transition duration callback.
const { GameStore } = require(path.join(root, 'src/game-core/app/game-store.ts'));
const { GameEventBus } = require(path.join(root, 'src/game-core/events/game-event-bus.ts'));
{
  const store = new GameStore(new GameEventBus());
  try {
    store.joinCitizen({ twitchUserId: 'lucky-audit-player', displayName: 'Tester' });
    store.startTour(3, ['lucky-cup'], 'mini_game');
    check(store.getSnapshot().tour.phase === 'mini_game_intro', 'Lucky Cup intro not reached');
    store.skipPhase();
    for (let round = 1; round <= 3; round++) {
      const beforeAnswers = store.getSnapshot();
      check(beforeAnswers.tour.phase === 'tour_starting', `round ${round}: countdown missing`);
      check(beforeAnswers.miniGame.id === 'lucky-cup', 'active game differs');
      check(beforeAnswers.tour.phaseDurationMs === getLuckyCupPreparationMsForRound(round), `round ${round}: duration wrong`);
      check(!beforeAnswers.miniGame.acceptsAnswers, 'cannot accept chat answers while shuffling');
      store.skipPhase();
      check(store.getSnapshot().miniGame.acceptsAnswers, 'answer window did not open after shuffle');
      store.skipPhase();
      check(store.getSnapshot().tour.phase === 'scoring', 'scoring skipped');
      store.skipPhase();
    }
    check(store.getSnapshot().tour.phase === 'tour_complete', 'tour never completed');
  } finally { store.destroy(); }
}
{
  // Switching from another game to Lucky Cup mid-tour must ALSO reserve the
  // full upcoming shuffle, despite the previous service being Food Origin.
  const store = new GameStore(new GameEventBus());
  try {
    store.joinCitizen({ twitchUserId: 'lucky-audit-player-2', displayName: 'Tester' });
    store.startTour(2, ['food-origin'], 'tour');
    store.skipPhase();
    store.skipPhase();
    store.skipPhase();
    check(store.getSnapshot().tour.phase === 'scoring', 'food round scoring missing');
    store.forcedNextMiniGameId = 'lucky-cup';
    store.skipPhase();
    const intro = store.getSnapshot();
    check(intro.tour.phase === 'mini_game_intro', 'new game must show illustrated instructions');
    store.skipPhase();
    const switched = store.getSnapshot();
    check(switched.miniGame.id === 'lucky-cup', 'force-next did not select Lucky Cup');
    check(switched.tour.phaseDurationMs === getLuckyCupPreparationMsForRound(2), 'cross-game duration truncated');
    check(!switched.miniGame.acceptsAnswers, 'cross-game chat must remain closed');
  } finally { store.destroy(); }
}
const mandatoryFiles = [
  'public/assets/game/runtime/minigames/lucky-cup/ball.png',
  'public/assets/game/runtime/minigames/lucky-cup/cup.png',
  'src/ui-react/styles/lucky-cup-v27.css',
  'src/ui-react/components/gameplay/minigames/LuckyCupScreen.tsx',
];
for (const file of mandatoryFiles) check(fs.existsSync(path.join(root,file)), `missing ${file}`);
const store = fs.readFileSync(path.join(root, 'src/game-core/app/game-store.ts'), 'utf8');
const overlay = fs.readFileSync(path.join(root, 'src/ui-react/components/gameplay/GameplayOverlay.tsx'), 'utf8');
check(store.includes('upcomingGameId') && store.includes('getLuckyCupPreparationMsForRound'), 'new round timing not guarded');
check(overlay.includes("miniGame.id === 'lucky-cup'") && overlay.includes('miniGame.hasRound') && overlay.includes('tourPhase="tour_starting"'), 'real shuffle not shown in countdown');
const ui = fs.readFileSync(path.join(root, 'src/ui-react/components/gameplay/minigames/LuckyCupScreen.tsx'), 'utf8');
check(!ui.includes('gameplay-lucky-cup-cup-number'), 'cup must not have tracking number');
check(ui.includes('QuestionScreenShell') && ui.includes('layout="choice"'), 'shared layout missing');
const motion = fs.readFileSync(path.join(root, 'src/game-core/minigames/lucky-cup/lucky-cup-motion.ts'), 'utf8');
check(motion.includes('phaseElapsedMs'), 'animation not time-driven');
for(const file of [
  'src/game-core/minigames/lucky-cup/lucky-cup-motion.ts',
  'src/game-core/minigames/lucky-cup/lucky-cup-service.ts',
  'src/game-core/app/game-store.ts',
  'src/ui-react/components/gameplay/minigames/LuckyCupScreen.tsx',
  'src/ui-react/components/gameplay/GameplayOverlay.tsx',
]) {
  const filename=path.join(root,file);
  const transpilation=ts.transpileModule(fs.readFileSync(filename,'utf8'),{ fileName: filename, reportDiagnostics:true, compilerOptions:{target:ts.ScriptTarget.ES2022, jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.ESNext}});
  const errors = transpilation.diagnostics?.filter(d=>d.category===ts.DiagnosticCategory.Error)??[];
  check(errors.length === 0, `TS syntax errors ${file}: ${errors.map(e=>e.messageText).join(', ')}`);
}
console.log(`Lucky Cup v27: ${checkCount} motion/logic/source/TS checks PASS across 12 rounds × 70 seeded games.`);
