import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const ts=createRequire(import.meta.url)('typescript');
const read=f=>fs.readFileSync(path.join(process.cwd(),f),'utf8');
const shared=read('src/ui-react/components/gameplay/shared/MiniGameIntroDemonstration.tsx');
const lesson=read('src/ui-react/components/gameplay/shared/AllGamesTwoPageIntro.tsx');
const css=read('src/ui-react/styles/intro-all-games-v72.css');
const foodCss=read('src/ui-react/styles/intro-walkthrough-v68.css');
const overlay=read('src/ui-react/components/gameplay/GameplayOverlay.tsx');
const games=['shape-count','maze-gates','count-the-beat','lucky-cup','guess-movie','guess-star','memory-count','couple-or-siblings'];
for (const id of games) assert.ok(lesson.includes(`'${id}': {`),`Missing modern lesson for ${id}`);
for (const cls of ['howto-v72-clue','howto-v72-choices','howto-v72-guide','howto-v72-chat']) assert.ok(lesson.includes(cls)&&css.includes(cls),`Missing current tutorial UI: ${cls}`);
for(const cls of ['howto-v71-main','howto-v71-preview','howto-v71-guide','howto-v71-footer'])assert.ok(shared.includes(cls)&&foodCss.includes(cls),`Missing food tutorial UI: ${cls}`);
assert.match(lesson,/\[1,2,3\]\.map\(n=>/,'Three cups must use same image assets');
assert.match(lesson,/second \? MEDIA\.face : MEDIA\.eyes/);
assert.match(lesson,/case 'count-the-beat'/);
assert.match(lesson,/case 'maze-gates'/);
assert.match(lesson,/page\+1\} \/ 2/);
assert.match(overlay,/<MiniGameIntroDemonstration/);
assert.doesNotMatch(shared,/const WALKTHROUGHS|howto-v69-stage/,'Retired walkthrough must stay removed');
for (const [file,src] of [['MiniGameIntroDemonstration.tsx',shared],['AllGamesTwoPageIntro.tsx',lesson]]) {
 const result=ts.transpileModule(src,{fileName:file,reportDiagnostics:true,compilerOptions:{module:ts.ModuleKind.ESNext,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022}});
 assert.equal(result.diagnostics.filter(d=>d.category===ts.DiagnosticCategory.Error).length,0,file);
}
console.log('[V69 legacy target] PASS: current 2-page tutorial layout, shared components, no stale duplicate V68/V69 UI.');
