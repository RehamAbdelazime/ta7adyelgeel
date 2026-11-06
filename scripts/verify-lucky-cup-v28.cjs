/* Validate missing-shell fixes and the preview/reveal UI without installing npm. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = (() => { try { return require('typescript'); } catch { return require('typescript'); } })();
const root = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const has = (file, phrase) => assert.ok(read(file).includes(phrase), `${file} missing: ${phrase}`);
for (const file of [
  'src/ui-react/styles/shared-choice-questions-v25.css',
  'src/ui-react/styles/lucky-cup-v27.css',
  'src/ui-react/styles/lucky-cup-v28.css',
  'src/ui-react/styles/host-answer-pod-v28.css',
  'public/assets/game/runtime/minigames/lucky-cup/cup.png',
  'public/assets/game/runtime/minigames/lucky-cup/ball.png',
]) assert.ok(fs.existsSync(path.join(root,file)), `missing ${file}`);
for(const entry of [
  'shared-choice-questions-v25.css',
  'lucky-cup-v27.css',
  'lucky-cup-v28.css',
  'host-answer-pod-v28.css',
]) has('src/ui-react/main.tsx',entry);
const main=read('src/ui-react/main.tsx');
assert.ok(main.indexOf('lucky-cup-v28.css') > main.indexOf('lucky-cup-v27.css'));
assert.ok(main.indexOf('host-answer-pod-v28.css') > main.indexOf('lucky-cup-v28.css'));
has('src/ui-react/styles/lucky-cup-v28.css', '.gameplay-lucky-cup-warmup');
has('src/ui-react/styles/lucky-cup-v28.css', 'display: block !important');
has('src/ui-react/styles/lucky-cup-v28.css', 'lucky-v28-reveal-cup');
has('src/ui-react/styles/lucky-cup-v28.css', 'z-index: 32 !important');
has('src/ui-react/styles/host-answer-pod-v28.css', '.qshell-host-bubble-v20');
has('src/ui-react/components/gameplay/minigames/LuckyCupScreen.tsx','getLuckyCupInitialLift(elapsed)');
has('src/ui-react/components/gameplay/minigames/LuckyCupScreen.tsx','lucky-v28-prompt');
has('src/ui-react/components/gameplay/minigames/LuckyCupScreen.tsx','showInitialBall');
has('src/ui-react/components/streamer/PrivateStreamerAnswerDock.tsx','qshell-host-private-tag');
const motion = read('src/game-core/minigames/lucky-cup/lucky-cup-motion.ts');
const hold = Number(motion.match(/LUCKY_CUP_OPEN_HOLD_MS = (\d+);/)[1]);
assert.ok(hold >= 1600, 'preview should be long enough to see ball');
for(const file of [
  'src/game-core/minigames/lucky-cup/lucky-cup-motion.ts',
  'src/ui-react/components/gameplay/minigames/LuckyCupScreen.tsx',
  'src/ui-react/components/streamer/PrivateStreamerAnswerDock.tsx',
  'src/ui-react/main.tsx',
]) {
  const d=ts.transpileModule(read(file), {fileName:file,reportDiagnostics:true,compilerOptions:{target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.ESNext}}).diagnostics||[];
  const errors=d.filter(diag=>diag.category===ts.DiagnosticCategory.Error);
  assert.equal(errors.length,0, `invalid TS/TSX ${file}: ${errors.map(e=>e.messageText).join(', ')}`);
}
console.log('Lucky Cup V28 UI/asset/source checks PASS. Browser/Electron runtime QA is separate.');
