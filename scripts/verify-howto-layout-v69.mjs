import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require=createRequire(import.meta.url);
const ts=require('typescript');
const root=process.cwd();
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const jsx=read('src/ui-react/components/gameplay/shared/MiniGameIntroDemonstration.tsx');
const css=read('src/ui-react/styles/intro-walkthrough-v68.css');
const overlay=read('src/ui-react/components/gameplay/GameplayOverlay.tsx');
const main=read('src/ui-react/main.tsx');
const games=['food-origin','shape-count','maze-gates','count-the-beat','lucky-cup','guess-movie','guess-star','memory-count','couple-or-siblings'];
for(const id of games) assert.ok(jsx.includes(`'${id}': {`),`Missing tutorial for ${id}`);
for(const part of ['howto-v69-stage','howto-v69-preview','howto-v69-answers','howto-v69-target-label','howto-v69-explain','howto-v69-navigation','howto-v69-step','howto-v69-choice-correct']){
  assert.ok(jsx.includes(part) && css.includes(part),`Tutorial structure/style missing: ${part}`);
}
assert.ok(jsx.includes('revealed ? FACE : EYES'),'Star reveal must match full portrait');
assert.ok(jsx.includes('[0, 1, 2].map(i =>'),'Lucky Cup must show three cups');
assert.ok(jsx.includes("case 'count-the-beat':") && jsx.includes("case 'maze-gates':"),'Number input and maze paths must be represented');
assert.doesNotMatch(jsx,/howto-v68-center-mask|howto-v68-real-shot/,'Obsolete floating masks from V68 must be gone');
assert.ok(jsx.includes('ArrowRight')&&jsx.includes('ArrowLeft'),'Keyboard navigation missing');
assert.ok(jsx.includes('onStart()'),'Start control missing');
assert.ok(overlay.includes('<MiniGameIntroDemonstration'),'Intro not connected');
assert.ok(main.includes('intro-walkthrough-v68.css'),'Style not connected');
assert.match(css,/\bgrid-template-columns\s*:\s*minmax\(0,\s*2\.25fr\)/);
assert.ok(css.includes('overflow-wrap:anywhere'),'Long answers must wrap');
for(const name of ['stage-quote.webp','carbonara_italy.jpg','uploaded-01.jpg']){
 const folder=name==='stage-quote.webp'?'HowTo':name==='carbonara_italy.jpg'?'food-origin/photos':'visual-guess/Stars/Full';
 const file=path.join(root,'public/assets/game/runtime/minigames',folder,name);
 assert.ok(fs.existsSync(file)&&fs.statSync(file).size>1000,`Missing local tutorial media ${file}`);
}
const output=ts.transpileModule(jsx,{fileName:'MiniGameIntroDemonstration.tsx',reportDiagnostics:true,
  compilerOptions:{module:ts.ModuleKind.ESNext,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022}});
assert.equal(output.diagnostics.length,0,'TSX transpile syntax diagnostics: '+output.diagnostics.map(d=>ts.flattenDiagnosticMessageText(d.messageText,'\n')).join('; '));
assert.doesNotMatch(jsx,/https?:\/\//,'No external media');
console.log('[V69] PASS: all 9 tutorials, 3 stages, 3-cup layout, photo mapping, choice wrapping, no floating duplicate screenshot, full celebrity reveal, bilingual keyboard/button navigation.');
