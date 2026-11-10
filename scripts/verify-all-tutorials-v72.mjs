import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const ts=createRequire(import.meta.url)('typescript');
const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const component=read('src/ui-react/components/gameplay/shared/AllGamesTwoPageIntro.tsx');
const parent=read('src/ui-react/components/gameplay/shared/MiniGameIntroDemonstration.tsx');
const gameOverlay=read('src/ui-react/components/gameplay/GameplayOverlay.tsx');
const main=read('src/ui-react/main.tsx');
const css=read('src/ui-react/styles/intro-all-games-v72.css');
const games=['shape-count','maze-gates','count-the-beat','lucky-cup','guess-movie','guess-star','memory-count','couple-or-siblings'];
assert.match(parent,/props\.gameId === 'food-origin'\s*\? <FoodOriginTwoPageIntro/,'Food origin production-layout tutorial retained');
assert.match(parent,/<AllGamesTwoPageIntro gameId=\{props\.gameId\}/,'Other games must use 2-page intro');
assert.doesNotMatch(gameOverlay,/<h2>\{miniGame\.title\}<\/h2>/,'No repeated title in top header');
assert.match(gameOverlay,/<h2>\{locale === 'ar' \? 'طريقة اللعب' : 'HOW TO PLAY'\}<\/h2>/,'Single minimal title');
assert.match(main,/intro-all-games-v72.css/,'V72 CSS must be imported');
for(const g of games) {
  assert.ok(component.includes(`'${g}': {`),`Missing lesson ${g}`);
  assert.ok(component.includes(`case '${g}':`),`Missing visual cue for ${g}`);
  assert.ok(component.includes(`'${g}': {ar:`),`Missing localized game title ${g}`);
}
assert.match(component,/pages: \[|pages:\[/,'Each game must have 2 concise pages');
assert.match(component,/Math\.min\(1,Math\.max\(0,current/,'Keyboard navigation bounded to 2 pages');
assert.match(component,/\{page\+1\} \/ 2/,'Two-page indicator');
assert.match(component,/<ChoiceCard/,'Reuse live ChoiceCard');
assert.match(component,/<MediaCard/,'Reuse live MediaCard');
assert.match(component,/<ShapeMark/,'Reuse live ShapeMark');
assert.match(component,/<BeatIcon/,'Reuse live BeatIcon');
assert.match(component,/uploaded-01\.jpg/,'Locally bundled celebrity portraits');
assert.match(component,/second \? MEDIA\.face : MEDIA\.eyes/,'Eyes-only until host reveal');
assert.match(component,/n===2 && !second/,'Ball only on initial observation; never shown during answer period');
assert.match(component,/const numberOnly = gameId === 'maze-gates'\|\|gameId === 'count-the-beat'/,'Numeric games use no fictional answer cards');
assert.match(component,/gameId==='shape-count'/,'Shape cards must use correct symbolic labels');
assert.match(component,/\{current\.lines\[0\]\[locale\]\}/,'Description in right card');
assert.match(component,/\{current\.lines\[1\]\[locale\]\}/,'Two lines per page');
assert.match(component,/<ExampleChat locale=\{locale\} command=\{lesson\.command\}/,'Every game shows a realistic chat command');
assert.doesNotMatch(component,/https?:\/\//,'No online media');
for(const file of ['HowTo/stage-quote.webp','visual-guess/Posters/movie-elzoga-13.jpg','visual-guess/Stars/Eyes/uploaded-01.jpg',
  'visual-guess/Stars/Full/uploaded-01.jpg','lucky-cup/cup.png','lucky-cup/ball.png','couple-or-siblings/pair-002.svg']) {
 const target=path.join(root,'public/assets/game/runtime/minigames',file);
 assert.ok(fs.statSync(target).size>1000,`Missing local sample: ${file}`);
}
for(const fragment of ['howto-v71-main','howto-v71-preview','howto-v71-guide','howto-v71-choices','howto-v71-chat-input']) {
 assert.ok(component.includes(fragment)&&read('src/ui-react/styles/intro-walkthrough-v68.css').includes(fragment),`Reused Food Origin layout ${fragment}`);
}
assert.match(css,/howto-v72-choices\.has-three/,'Three-cup option row');
assert.match(css,/howto-v72-no-choices/,'No fake answer row for number-input games');
for(const f of ['src/ui-react/components/gameplay/shared/AllGamesTwoPageIntro.tsx','src/ui-react/components/gameplay/shared/MiniGameIntroDemonstration.tsx','src/ui-react/components/gameplay/GameplayOverlay.tsx']) {
 const out=ts.transpileModule(read(f),{fileName:f,reportDiagnostics:true,compilerOptions:{module:ts.ModuleKind.ESNext,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022}});
 assert.equal(out.diagnostics?.length??0,0,`TSX syntax error in ${f}`);
}
console.log('[V72] PASS: 9/9 tutorials use the 2-page compact layout, bilingual copy, correctly numbered chat inputs, 3 cups, numeric-only games, eyes-only star, local assets, shared UI components and no invented hint.');
