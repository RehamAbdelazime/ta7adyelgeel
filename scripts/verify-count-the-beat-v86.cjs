/** V86: all three row arrangements, acceleration, artwork and game fairness. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const root = path.join(__dirname, '..');
require.extensions['.ts'] = (module, file) => {
  const compiled = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    fileName: file, reportDiagnostics: true,
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  });
  assert.equal((compiled.diagnostics || []).filter(d => d.category === ts.DiagnosticCategory.Error).length, 0, `TS syntax: ${file}`);
  module._compile(compiled.outputText, file);
};
const {
  CountTheBeatMiniGameService,
  getCountTheBeatSchedule,
  getCountTheBeatPreparationMsForRound,
  getBeatLanePositions,
} = require(path.join(root, 'src/game-core/minigames/count-the-beat/count-the-beat-service.ts'));

let rounds = 0;
for (let round = 1; round <= 3; round += 1) {
  const expectedLanes = [1, 2, 4][round - 1];
  const schedule = getCountTheBeatSchedule(round);
  const gaps = schedule.slice(1).map((item, index) => item.delayMs - schedule[index].delayMs);
  assert(gaps.at(-1) < gaps[0], 'the LAST beats must be faster than the FIRST beats');
  for (let i = 1; i < gaps.length; i += 1) assert(gaps[i] <= gaps[i-1] + 1, 'tempo must ramp smoothly');
  const endMs = Math.max(...schedule.map(item => item.delayMs + item.durationMs));
  assert(getCountTheBeatPreparationMsForRound(round) >= endMs + 270, 'last symbol needs time to go dark');
  assert(getCountTheBeatPreparationMsForRound(round) < 16_000, 'preview should be short');
  for (let seed = 1; seed <= 2000; seed += 1) {
    const svc = new CountTheBeatMiniGameService();
    svc.startRound(round, seed * 853);
    const preview = svc.getSnapshot('ar').countTheBeat;
    assert.equal(preview.lanes, expectedLanes);
    assert.equal(preview.targetCount, null);
    assert.equal(preview.items.length, [12, 14, 16][round - 1]);
    assert(preview.items.every(i => getBeatLanePositions(expectedLanes).includes(i.y)));
    assert(preview.items.every(i => [18,34,50,66,82].includes(i.x)));
    assert(preview.items.every(i => i.tone === 'cyan' && i.size === 1 && i.rotate === 0));
    assert(preview.items.every(i => i.icon === preview.targetIcon || i.isTarget === false));
    assert.deepEqual(preview.items.map(i => [i.delayMs, i.durationMs]), schedule.map(i => [i.delayMs, i.durationMs]));
    assert(preview.items.slice(1).every((item, idx) => item.delayMs > preview.items[idx].delayMs + preview.items[idx].durationMs), 'no simultaneous flashes');
    // Easy remains straightforward. The mid/hard row set is truly exercised.
    const uniqueLanes = new Set(preview.items.map(i => i.y)).size;
    assert(uniqueLanes >= Math.min(2, expectedLanes), 'no row changes at this difficulty');
    svc.resolveRound();
    assert.equal(svc.getSnapshot('ar').countTheBeat.targetCount, preview.items.filter(i => i.isTarget).length);
    rounds += 1;
  }
}
const iconPath = path.join(root, 'src/ui-react/components/gameplay/minigames/BeatIcon.tsx');
const jsx = fs.readFileSync(iconPath, 'utf8');
// The Vite base is a compile-time substitution. Stub it for this isolated VM test.
const rendered = ts.transpileModule(jsx.replaceAll('import.meta.env.BASE_URL', JSON.stringify('./')), { compilerOptions: { jsx: ts.JsxEmit.React, module: ts.ModuleKind.CommonJS } }).outputText;
const iconModule = {};
const React = { Fragment: 'fragment', createElement: (type, props, ...children) => ({ type, props: props || {}, children }) };
vm.runInNewContext(rendered, { exports: iconModule, React });
for (const id of ['note', 'double-note', 'wave', 'mic', 'headphones', 'speaker', 'disc']) {
  const icon = iconModule.BeatIcon({ icon: id });
  assert.equal(icon.type, 'img');
  assert.equal(icon.props.alt, '');
  assert.equal(icon.props['aria-hidden'], 'true');
  assert(icon.props.src.endsWith(`/beat-${id}.png`), `wrong shared PNG for ${id}`);
  assert(fs.existsSync(path.join(root, 'public', 'assets/game/runtime/minigames/count-the-beat/icons', `beat-${id}.png`)), `missing production artwork for ${id}`);
}
const screen = fs.readFileSync(path.join(root,'src/ui-react/components/gameplay/minigames/CountTheBeatScreen.tsx'),'utf8');
const audio = fs.readFileSync(path.join(root,'src/ui-react/components/audio/useGameplayCue.ts'),'utf8');
const tutorial = fs.readFileSync(path.join(root,'src/ui-react/components/gameplay/shared/AllGamesTwoPageIntro.tsx'),'utf8');
assert(screen.includes('BeatStageLanes rows={beat.lanes}'), 'live gameplay must render shared guide rows');
assert(tutorial.includes('<BeatStageLanes rows={1} />'), 'tutorial must use the same guide component');
assert(audio.includes('items[nextBeat].delayMs'), 'audio must follow accelerating visual pulse, not constant BPM');
assert(screen.includes("tourPhase === 'tour_starting'"), 'all flashing must occur BEFORE answers open');
assert(screen.includes("tourPhase === 'answer_window_open'"), 'answer prompt must remain separated');
console.log(`V86 Count The Beat PASS: ${rounds} generated rounds, 1/2/4 rows, increasing tempo, no overlap, seven premium PNG icons from one shared component, matched sound and tutorial.`);
