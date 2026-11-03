/** Focused static regression checks for scoreboard v23. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const ts = require('typescript');

const read = (path) => fs.readFileSync(path, 'utf8');
const scoreboardPath = 'src/ui-react/components/gameplay/scoreboard/Scoreboard.tsx';
const actionPath = 'src/ui-react/components/gameplay/scoreboard/ScoreboardPrimaryAction.tsx';
const score = read(scoreboardPath);
const action = read(actionPath);
const css = read('src/ui-react/styles/scoreboard-casual-v23.css');
const main = read('src/ui-react/main.tsx');
let passed = 0;
const check = (predicate, message) => { assert.ok(predicate, message); passed++; };

check(score.includes('show-score-banner-v23') && score.includes('show-score-banner-context-v23') && score.includes('show-score-banner-title-v23'), 'single shared game / phase title banner');
check(!score.includes('show-scoreboard-summary'), 'no redundant player and round counters scattered across scoreboard');
check(!score.includes('show-score-ranking-head'), 'no redundant table header');
check(score.includes('show-score-rounds-sr-v23') && css.includes('clip-path: inset(50%)'), 'round breakdown remains accessible without tiny chips');
check(score.includes('show-scoreboard-crowded') && score.includes('getScoreboardPageRows'), 'crowded scores and pagination preserved');
check(score.includes('ScoreboardAmbientLights') && score.includes('!isEndedEarly'), 'conditional winner lighting preserved');
check(score.includes('actions.backToStage') && score.includes('actions.skipPhase'), 'stage navigation and next phase callbacks retained');
check((score.match(/<ScoreboardPrimaryAction\b/g) ?? []).length === 2, 'same CTA used by intermission and scoreboard');
check(action.includes('data-testid="scoreboard-primary-action"') && action.includes('onClick={onClick}'), 'shared CTA is focusable and clickable');
check(!action.includes('show-score-action-chevron'), 'no misplaced decorative chevron');
check(css.includes('border-radius: 8px') && css.includes('background: var(--show-score-v23-cyan)'), 'CTA matches simple cyan game buttons');
check(css.includes('grid-column:2;justify-self:center'), 'primary CTA remains centered in RTL and LTR');
check(css.includes('prefers-reduced-motion: reduce'), 'reduced-motion supported');
check(main.includes('scoreboard-casual-v23.css') && main.indexOf('scoreboard-casual-v23.css') > main.indexOf('event-stage-lighting-v22.css'), 'v23 overrides imported last');
for (const path of [scoreboardPath,actionPath]) {
  const diagnostics = ts.transpileModule(read(path), {
    fileName: path,
    compilerOptions:{jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext},
    reportDiagnostics:true,
  }).diagnostics ?? [];
  const errors = diagnostics.filter(x => x.category === ts.DiagnosticCategory.Error);
  check(errors.length === 0, `TSX syntax check ${path}`);
}
console.log(`Scoreboard v23 pass (${passed} invariants)`);
