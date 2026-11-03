import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const ts = require('typescript');
function transpile(file) {
  const source = fs.readFileSync(file, 'utf8');
  const output = ts.transpileModule(source, {
    fileName: file,
    reportDiagnostics: true,
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  });
  const errors = (output.diagnostics ?? []).filter((entry) => entry.category === ts.DiagnosticCategory.Error);
  assert.equal(errors.length, 0, `${file} must transpile`);
  return output.outputText;
}
function requireFromJs(js, deps = {}) {
  const module = { exports: {} };
  const sandbox = { module, exports: module.exports, require: (id) => {
    if (!Object.hasOwn(deps, id)) throw new Error(`Unexpected dependency ${id}`);
    return deps[id];
  }};
  vm.runInNewContext(js, sandbox, { timeout: 2000 });
  return module.exports;
}
const base = 'src/ui-react';
const layout = requireFromJs(transpile(`${base}/components/gameplay/shared/answer-stage-layout.ts`));
const lights = requireFromJs(transpile(`${base}/components/visual/mini-game-lighting-cues.ts`), {
  '../gameplay/shared/answer-stage-layout': layout,
});
let count = 0;
const test = (value, expectation) => { assert.equal(value, expectation); count += 1; };
for (const n of [2,3,4]) {
  for (let option=1; option<=n; option++) {
    const point = lights.getAnswerLaneLightTarget(option, n);
    const expected = 1920 * (layout.ANSWER_STAGE_LAYOUT.leftPercent + layout.ANSWER_STAGE_LAYOUT.widthPercent * (option - .5) / n) / 100;
    test(Math.abs(point.x - expected) < 1e-6, true);
    test(point.y, 970);
  }
}
test(lights.getAnswerLaneLightTarget(5,4), null);
test(lights.getAnswerLaneLightTarget(0,4), null);
test(lights.getAnswerLaneLightTarget(2,5), null);
test(lights.getLightingState({phase:'answer_window_open',revealFinished:false,correctOption:2,optionCount:4,hasScoredWinner:true}).cue,'ambient');
test(lights.getLightingState({phase:'scoring',revealFinished:false,correctOption:2,optionCount:4,hasScoredWinner:false}).cue,'correct');
test(lights.getLightingState({phase:'scoring',revealFinished:false,correctOption:null,optionCount:4,hasScoredWinner:true}).cue,'ambient');
test(lights.getLightingState({phase:'scoring',revealFinished:true,correctOption:2,optionCount:4,hasScoredWinner:true}).cue,'winner');
test(lights.getLightingState({phase:'scoring',revealFinished:true,correctOption:2,optionCount:4,hasScoredWinner:false}).cue,'ambient');
test(lights.getLightingState({phase:'tour_complete',revealFinished:false,correctOption:null,optionCount:4,hasScoredWinner:true}).cue,'winner');
test(lights.getLightingState({phase:'tour_complete',revealFinished:false,correctOption:null,optionCount:4,hasScoredWinner:false}).cue,'ambient');
const geometry = [lights.STAGE_LIGHT_ORIGINS.leftSide,lights.STAGE_LIGHT_ORIGINS.rightSide,lights.STAGE_LIGHT_ORIGINS.roofCenter];
test(geometry[0].x, 211); test(geometry[1].x,1709); test(geometry[2].y,81);
const files = [
 `${base}/components/visual/MiniGameLightingRig.tsx`,
 `${base}/components/visual/VisualWorldLayer.tsx`,
 `${base}/components/gameplay/scoreboard/Scoreboard.tsx`,
 `${base}/components/gameplay/scoreboard/ScoreboardAmbientLights.tsx`,
 `${base}/main.tsx`,
];
for (const file of files) { transpile(file); count++; }
const css = fs.readFileSync(`${base}/styles/event-stage-lighting-v22.css`, 'utf8');
const screen = fs.readFileSync(`${base}/components/gameplay/scoreboard/Scoreboard.tsx`, 'utf8');
const rig = fs.readFileSync(`${base}/components/visual/MiniGameLightingRig.tsx`, 'utf8');
test(css.includes('prefers-reduced-motion: reduce'),true);
test(css.includes('pointer-events: none'),true);
test(css.includes('transform-origin: 211px 413px'),true);
test(css.includes('transform-origin: 1709px 413px'),true);
test(screen.includes('leader?.total ?? 0'),true);
test(screen.includes('!isEndedEarly'),true);
test(rig.includes('getAnswerLaneLightTarget(state.correctOption, state.optionCount)'),true);
console.log(`v22 event-driven lighting passed: ${count} checks`);
