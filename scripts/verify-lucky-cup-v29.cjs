/* Self-contained gameplay verification. No npm dependencies required. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = (() => { try { return require('typescript'); } catch { return require('typescript'); } })();
require.extensions['.ts'] = (module, filename) => {
  const source = fs.readFileSync(filename, 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true }, fileName: filename });
  module._compile(compiled.outputText, filename);
};
const root = path.join(__dirname, '..');
const { LuckyCupMiniGameService, getLuckyCupPreparationMsForRound } = require(path.join(root,'src/game-core/minigames/lucky-cup/lucky-cup-service.ts'));
const { getLuckyCupOrder, getLuckyCupPreparationMs, getLuckyCupShuffleEndMs, getLuckyCupMotion, LUCKY_CUP_SHUFFLE_START_MS } = require(path.join(root,'src/game-core/minigames/lucky-cup/lucky-cup-motion.ts'));
let checks = 0;
const verify = (condition, message) => { assert.ok(condition, message); checks++; };
const expectedSwaps = [5, 10, 18];
for (let round = 1; round <= 12; round++) {
  for (let seed = 1; seed <= 120; seed++) {
    const game = new LuckyCupMiniGameService();
    game.startRound(round, seed * 941);
    const plan = game.getSnapshot('en').luckyCup;
    verify(Boolean(plan), 'plan missing');
    const swaps = plan.swaps;
    verify(swaps.length === expectedSwaps[(round - 1) % 3], 'bad difficulty swap count');
    verify(swaps[0].delayMs === 0, 'shuffle must start with zero swap offset');
    verify(getLuckyCupPreparationMs(swaps) === getLuckyCupPreparationMsForRound(round), 'visual/phase timing drift');
    for (let index = 1; index < swaps.length; index++) {
      const previous = swaps[index - 1], current = swaps[index];
      verify(current.durationMs <= previous.durationMs, 'tempo not accelerating');
      verify(current.delayMs === previous.delayMs + previous.durationMs + ((round - 1) % 3 === 0 ? 120 : (round - 1) % 3 === 1 ? 95 : (index >= 13 ? 12 : 55)), 'gap inconsistent');
      verify(!(previous.a === current.a && previous.b === current.b), 'immediate reversal');
    }
    if ((round - 1) % 3 === 2) {
      verify(swaps.at(-1).durationMs <= 190, 'hard round must have fast climax');
    }
    const finalOrder = getLuckyCupOrder(swaps);
    const correctSlot = finalOrder.indexOf(plan.initialBallCupId);
    game.setStatus('resolved');
    verify(game.getSnapshot('en').luckyCup.correctCupNumber === correctSlot + 1, 'visual answer mismatch');
    const lastMotion = getLuckyCupMotion(swaps, getLuckyCupShuffleEndMs(swaps) + 1);
    verify(lastMotion.every((frame) => frame.slot === finalOrder.indexOf(frame.cupId)), 'last visible frame mismatch');
    const initialMotion = getLuckyCupMotion(swaps, LUCKY_CUP_SHUFFLE_START_MS - 1);
    verify(initialMotion.every((frame) => frame.slot === frame.cupId), 'motion before preview ends');
  }
}
for (const filename of [
  'src/game-core/minigames/lucky-cup/lucky-cup-service.ts',
  'src/game-core/minigames/lucky-cup/lucky-cup-service.test.ts',
]) {
  const fullPath = path.join(root, filename);
  const diagnostics = ts.transpileModule(fs.readFileSync(fullPath,'utf8'), { fileName: filename, reportDiagnostics: true, compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).diagnostics ?? [];
  verify(!diagnostics.some(item => item.category === ts.DiagnosticCategory.Error), `TypeScript syntax ${filename}`);
}
console.log(`Lucky Cup V29/V30 baseline PASS: ${checks} checks across 12 rounds × 120 seeds; strict difficulty ramp, no instant reversals, exact answer/timing synchronization.`);
