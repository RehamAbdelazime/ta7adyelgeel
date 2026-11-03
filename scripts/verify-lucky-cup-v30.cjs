/** Standalone V30 finale / timing regression. Works without npm install. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = (() => { try { return require('typescript'); } catch { return require('/opt/nvm/versions/node/v22.16.0/lib/node_modules/typescript'); } })();
require.extensions['.ts'] = (module, filename) => {
  const source = fs.readFileSync(filename, 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
    fileName: filename,
  });
  module._compile(compiled.outputText, filename);
};
const root = path.resolve(__dirname, '..');
const { LuckyCupMiniGameService, getLuckyCupPreparationMsForRound } = require(path.join(root, 'src/game-core/minigames/lucky-cup/lucky-cup-service.ts'));
const { getLuckyCupOrder, getLuckyCupMotion, getLuckyCupPreparationMs, getLuckyCupShuffleEndMs, LUCKY_CUP_SHUFFLE_START_MS } = require(path.join(root, 'src/game-core/minigames/lucky-cup/lucky-cup-motion.ts'));
let checks = 0;
const check = (condition, why) => { assert.ok(condition, why); checks += 1; };
const gap = (swaps, index) => swaps[index].delayMs - swaps[index - 1].delayMs - swaps[index - 1].durationMs;
const expectedFinale = [175, 145, 120, 100, 85];
const winners = [0, 0, 0];

for (let round = 1; round <= 12; round++) {
  for (let seed = 1; seed <= 300; seed++) {
    const game = new LuckyCupMiniGameService();
    game.startRound(round, seed * 719);
    const plan = game.getSnapshot('en').luckyCup;
    const difficultyIndex = (round - 1) % 3;
    check(Boolean(plan), 'missing round');
    check(plan.swaps.length === [5, 10, 18][difficultyIndex], 'wrong count');
    check(plan.swaps[0].delayMs === 0, 'wrong start delay');
    check(getLuckyCupPreparationMs(plan.swaps) === getLuckyCupPreparationMsForRound(round), 'phase timer differs from plan');
    const finalOrder = getLuckyCupOrder(plan.swaps);
    let ballSlot = plan.initialBallCupId;
    let lastPair = '';
    for (const [index, swap] of plan.swaps.entries()) {
      const pair = [swap.a, swap.b].sort().join('-');
      check(pair !== lastPair, `round ${round} seed ${seed}: instant reversal`);
      if (index > 0) {
        const expectedGap = difficultyIndex === 0 ? 120 : difficultyIndex === 1 ? 95 : index >= 13 ? 12 : 55;
        check(gap(plan.swaps, index) === expectedGap, 'wrong gap');
        check(swap.durationMs <= plan.swaps[index - 1].durationMs, 'swap timing reversed');
      }
      if (difficultyIndex === 2 && index >= 13) {
        check(swap.durationMs === expectedFinale[index - 13], 'turbo duration mismatch');
        check(swap.a === ballSlot || swap.b === ballSlot, 'ball cup must move every turbo swap');
        const midpoint = LUCKY_CUP_SHUFFLE_START_MS + swap.delayMs + swap.durationMs / 2;
        const frames = getLuckyCupMotion(plan.swaps, midpoint);
        check(frames.filter((frame) => frame.arc > .3).length === 2, 'midpoint animation missing');
      }
      if (swap.a === ballSlot) ballSlot = swap.b;
      else if (swap.b === ballSlot) ballSlot = swap.a;
      lastPair = pair;
    }
    check(finalOrder.indexOf(plan.initialBallCupId) === ballSlot, 'correct visual slot != ball slot');
    check(getLuckyCupMotion(plan.swaps, getLuckyCupShuffleEndMs(plan.swaps) + 1)
      .every((frame) => frame.slot === finalOrder.indexOf(frame.cupId)), 'last motion position differs');
    game.setStatus('resolved');
    check(game.getSnapshot('en').luckyCup.correctCupNumber === ballSlot + 1, 'scored answer != visible answer');
    if (difficultyIndex === 2) {
      winners[ballSlot] += 1;
      const swaps = plan.swaps;
      const finaleElapsedMs = swaps.at(-1).delayMs + swaps.at(-1).durationMs - swaps.at(-5).delayMs;
      check(finaleElapsedMs === 673, 'turbo needs to fit in 673ms');
      check(swaps[12].durationMs === 220, 'hard regular section changed');
    }
  }
}
check(winners.every((count) => count > 150), `final target must not become a fixed slot: ${winners}`);
const ui = fs.readFileSync(path.join(root, 'src/ui-react/components/gameplay/minigames/LuckyCupScreen.tsx'), 'utf8');
check(ui.includes('requestAnimationFrame(tick)') && ui.includes('cancelAnimationFrame(animationFrame)'), 'animation refresh should accommodate fast finale');
for (const file of [
  'src/game-core/minigames/lucky-cup/lucky-cup-service.ts',
  'src/game-core/minigames/lucky-cup/lucky-cup-service.test.ts',
  'src/ui-react/components/gameplay/minigames/LuckyCupScreen.tsx',
]) {
  const src = fs.readFileSync(path.join(root, file), 'utf8');
  const diagnostics = ts.transpileModule(src, { fileName: file, reportDiagnostics: true, compilerOptions: { target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.ESNext } }).diagnostics || [];
  check(!diagnostics.some((item) => item.category === ts.DiagnosticCategory.Error), `TS syntax error: ${file}`);
}
console.log(`Lucky Cup V30 PASS: ${checks} checks / 3600 rounds; 5 turbo swaps in 673ms, tracked target stays honest, correct reveal and clock. Winner distribution: ${winners}.`);
