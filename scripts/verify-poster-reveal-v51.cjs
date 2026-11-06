/** V51 single-blur UX regression, including exact 1-second finish. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const moduleSource = fs.readFileSync(path.join(root, 'src/ui-react/components/gameplay/minigames/poster-reveal-curve.ts'), 'utf8');
const { getPosterBlurPx } = (() => {
  const { outputText } = ts.transpileModule(moduleSource, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } });
  const module = { exports: {} };
  new Function('module', 'exports', outputText)(module, module.exports);
  return module.exports;
})();
const duration = 20_000;
for (const diff of ['easy', 'medium', 'hard']) {
  let last = Infinity;
  for (let remain = duration; remain >= 0; remain -= 100) {
    const blur = getPosterBlurPx(duration, remain, diff);
    assert(Number.isFinite(blur) && blur >= 0);
    assert(blur <= last + 1e-9, `blur increased as time passed: ${diff}`);
    if (remain <= 1000) assert.equal(blur, 0, `final second must be sharp: ${diff}`);
    last = blur;
  }
  assert(getPosterBlurPx(duration, 1_001, diff) > 0);
}
assert(getPosterBlurPx(duration, duration, 'easy') < getPosterBlurPx(duration, duration, 'medium'));
assert(getPosterBlurPx(duration, duration, 'medium') < getPosterBlurPx(duration, duration, 'hard'));
assert(getPosterBlurPx(duration, 2_000, 'hard') > getPosterBlurPx(duration, 2_000, 'medium'));
assert.equal(getPosterBlurPx(800, 0, 'hard'), 0, 'short timers stay safe');
assert.equal(getPosterBlurPx(duration, -1, 'easy'), 0);
const screen = fs.readFileSync(path.join(root, 'src/ui-react/components/gameplay/minigames/VisualGuessScreen.tsx'), 'utf8');
const css = fs.readFileSync(path.join(root, 'src/ui-react/styles/visual-guess-v36.css'), 'utf8');
assert(screen.includes('getPosterBlurPx'));
assert(screen.includes("filter: posterBlur > 0 ? `blur(${posterBlur.toFixed(2)}px)` : 'none'"));
assert(screen.includes('phaseEndsAt') && screen.includes('isPaused'), 'pause/resume must not advance the picture blur');
for (const removed of ['v36-visual-poster-mask', 'v49-poster-title-secret', 'v49-poster-face-blur']) {
  assert(!screen.includes(removed), `${removed} rendered a wrong-placed rectangle`);
  assert(!css.includes(`.${removed}`), `${removed} legacy CSS still in use`);
}
console.log('V51 compatibility PASS: full-poster blur still reaches 0px in final second, no rectangular masks, pause-aware timing.');
