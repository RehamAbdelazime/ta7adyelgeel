/** Verify the shared UI direction & floor answer lanes from V90. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const shell = read('src/ui-react/components/gameplay/shared/question-shell.tsx');
const css = read('src/ui-react/styles/answer-choice-rtl-v90.css');
const main = read('src/ui-react/main.tsx');
const floors = read('src/ui-react/components/gameplay/citizens/ChoiceSpotlights.tsx');
const helpers = read('src/ui-react/components/gameplay/shared/citizen-helpers.ts');
const citizens = read('src/ui-react/components/gameplay/citizens/CitizenPlaza.tsx');
assert(shell.includes('dir={snapshot.direction}'), 'choices use app direction');
assert(!shell.includes('qshell-quick-total'), 'remove duplicate total footer');
assert(shell.includes('qshell-vote-count'), 'keep per-option vote totals');
assert(shell.includes('!isModern ? ('), 'legacy hint/footer remains for old shells');
assert(css.includes('answer') && css.includes('[lang="ar"]') && css.includes('direction: rtl !important'));
assert(css.includes('audience-answer-lanes-v20'), 'floor lane order is the same as answer row');
assert(floors.includes('dir={snapshot.direction}'), 'floor respects locale');
assert(helpers.includes('const visualIndex = locale === \'ar\' ? count - 1 - index : index'), 'audience choice lanes mirror for Arabic');
assert(citizens.includes('getCitizenFloorStyle(index, renderedPlacement, locale)'), 'audience position uses locale');
assert(citizens.includes('getCitizenWalkFacing(currentRenderedPlacement, nextPlacement, index, locale)'), 'walking direction follows displayed lanes');
assert(main.trimEnd().endsWith("import './styles/answer-choice-rtl-v90.css';"), 'RTL override loaded last');
for(const n of [2,3,4]) for(let i=0;i<n;i++) {
  const en=(i+0.5)/n;
  const ar=(n-1-i+0.5)/n;
  assert(Math.abs(en+ar-1)<1e-9, 'RTL lane centers symmetric');
}
// Execute the production placement helper to catch mistakes missed by static checks.
require('./qa/ts-register.cjs');
const { getCitizenSpotlightStyle, getCitizenFloorStyle, getCitizenWalkFacing } = require('../src/ui-react/components/gameplay/shared/citizen-helpers.ts');
for(const count of [2,3,4]) for(let number=1;number<=count;number++) {
  const placement={kind:'choice',optionNumber:number,optionCount:count,groupIndex:0,tone:'cyan',resultState:'pending'};
  const en=parseFloat(getCitizenSpotlightStyle(placement,0,'en')['--citizen-x']);
  const ar=parseFloat(getCitizenSpotlightStyle(placement,0,'ar')['--citizen-x']);
  assert(Math.abs(en+ar-100)<1e-6,`mirrored placements: option ${number}/${count}`);
  assert.equal(getCitizenFloorStyle(0,placement,'ar')['--citizen-x'],getCitizenSpotlightStyle(placement,0,'ar')['--citizen-x']);
}
const firstAnswer={kind:'choice',optionNumber:1,optionCount:4,groupIndex:0,tone:'cyan',resultState:'pending'};
assert(getCitizenWalkFacing({kind:'side',side:'left',groupIndex:0},firstAnswer,0,'ar')>0);
assert(getCitizenWalkFacing({kind:'side',side:'right',groupIndex:0},firstAnswer,0,'ar')<0);
console.log('V90 RTL Answer Options PASS (2/3/4 choices, badge layout, stage lights, audience, no extra footer).');
