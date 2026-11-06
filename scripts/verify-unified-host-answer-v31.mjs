/** V31: all mini-games use exactly one stage-mounted host-answer control. */
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { createRequire } from 'node:module';

const root = resolve(import.meta.dirname, '..');
const read = file => readFileSync(resolve(root, file), 'utf8');
const app = read('src/ui-react/App.tsx');
const stage = read('src/ui-react/components/visual/GameSceneStage.tsx');
const mascot = read('src/ui-react/components/visual/HostMascotLayer.tsx');
const dock = read('src/ui-react/components/streamer/PrivateStreamerAnswerDock.tsx');
const registry = read('src/game-core/minigames/minigame-registry.ts');
const podCss = read('src/ui-react/styles/host-answer-pod-v28.css');
const main = read('src/ui-react/main.tsx');
const srcDir = resolve(root, 'src/ui-react');
const require = createRequire(import.meta.url);
const ts = (() => {
  try { return require('typescript'); }
  catch { return require('typescript'); }
})();

assert.doesNotMatch(app, /PrivateStreamerAnswerDock|usesModernQuestionUi/, 'App must not render the old separate floating host-answer dock');
assert.match(stage, /<HostMascotLayer scene=\{renderedScene\}/, 'stage must render mascot and answer control together');
assert.equal((mascot.match(/<PrivateStreamerAnswerDock\s*\/>/g) ?? []).length, 1, 'only one host-answer mount in mascot layer');
assert.match(mascot, /\{isQuestionHostActive\s*\?\s*\(\s*<div className="qshell-host-bubble-v20">/, 'dock should be active only during an answer window');
assert.doesNotMatch(mascot, /usesModernQuestionUi|MODERN_QUESTION_GAME_IDS/, 'all mini-games must share one host answer location');
assert.doesNotMatch(dock, /embedded\s*\?|embedded\s*=\s*false|HOST ONLY|الل?هوست فقط|letter \/ word/, 'obsolete standalone host-answer variant must be removed');
assert.match(dock, /private-streamer-answer-embedded/, 'new unified design must be used');
assert.match(dock, /snapshot\.privateStreamerAnswerSubmitted/, 'private answer must remain locked after acceptance');
assert.match(dock, /submitPrivateStreamerAnswer/, 'host submission must use the existing game-store command');
assert.match(dock, /miniGame\.id === 'couple-or-siblings'\) return 2/, 'Couple/Siblings must use two choices');
assert.match(dock, /miniGame\.id === 'lucky-cup'\) return 3/, 'Lucky Cup must retain three choices');
assert.match(dock, /isCountAnswer \? 3 : 1/, 'count input must retain 3 digits');
assert.match(podCss, /bottom:\s*39%\s*!important/, 'new left-stage position must be stable');
assert.match(podCss, /private-streamer-answer-form button/, 'new host-answer styles must cover the submit control');
assert.match(main, /import '\.\/styles\/host-answer-pod-v28\.css'/, 'new design must stay imported');
const miniGames = [...registry.matchAll(/^\s*id: '(.*?)',/gm)].map(m => m[1]);
assert.equal(miniGames.length, 9, 'verify retained public and QA-only game catalog');
const allUiComponents = [
  resolve(srcDir, 'App.tsx'),
  resolve(srcDir, 'components/visual/HostMascotLayer.tsx'),
  resolve(srcDir, 'components/gameplay/shared/question-shell.tsx'),
];
let count = 0;
for (const file of allUiComponents) {
  count += (readFileSync(file, 'utf8').match(/<PrivateStreamerAnswerDock(?:\s|\/|>)/g) ?? []).length;
}
assert.equal(count, 1, 'no duplicate host-answer input across App/question shell/host layer');
for (const file of ['src/ui-react/App.tsx', 'src/ui-react/components/visual/HostMascotLayer.tsx', 'src/ui-react/components/streamer/PrivateStreamerAnswerDock.tsx']) {
  assert.ok(existsSync(resolve(root, file)));
  const result = ts.transpileModule(read(file), {fileName:file, reportDiagnostics:true, compilerOptions: {target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.ESNext}});
  const errors = (result.diagnostics ?? []).filter(d => d.category === ts.DiagnosticCategory.Error);
  assert.equal(errors.length, 0, `TS/TSX syntax errors in ${file}: ${errors.map(e => d.messageText).join(', ')}`);
}
console.log(`V31 host-answer routing PASS: one new stage pod for ${miniGames.length} registered mini-games, legacy dock removed; TS syntax valid.`);
