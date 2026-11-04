import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const ts = require('/opt/nvm/versions/node/v22.16.0/lib/node_modules/typescript/lib/typescript.js');

function read(file) { return readFileSync(file, 'utf8'); }
const files = {
  helper: 'src/ui-react/components/gameplay/shared/visible-audience.ts',
  plaza: 'src/ui-react/components/gameplay/citizens/CitizenPlaza.tsx',
  lobby: 'src/ui-react/components/play/MainScreenPlayFlow.tsx',
  stage: 'src/ui-react/components/visual/VisualWorldLayer.tsx',
  css: 'src/ui-react/styles/lobby-final-polish.css',
  main: 'src/ui-react/main.tsx',
};
const t = Object.fromEntries(Object.entries(files).map(([k,f])=>[k,read(f)]));
assert(t.main.indexOf('premium-experience.css')<t.main.indexOf('lobby-final-polish.css'));
assert(t.plaza.includes('getVisibleAudience(citizens, streamerUserId, activeAnswerUserIds)'));
assert(t.lobby.includes('getVisibleAudience(snapshot.citizens, status.accountUserId).length'));
assert(t.stage.includes('useLobbyJoinFlash') && t.stage.includes('premium-audience-join-flash'));
assert(t.css.includes('prefers-reduced-motion: reduce'));
for (const f of ['soft-audience-light.png', 'stage-glint.png','led-microdots.png']) {
 const size=statSync(`public/assets/game/runtime/ui/scene-polish/${f}`).size;
 assert(size>70 && size<30000, `Missing or heavyweight texture: ${f}`);
}
for(const key of ['helper','plaza','lobby','stage']) {
 const file=files[key];
 const source=ts.createSourceFile(file,t[key],ts.ScriptTarget.Latest,true,file.endsWith('.tsx')?ts.ScriptKind.TSX:ts.ScriptKind.TS);
 assert.equal(source.parseDiagnostics.length,0,`Typescript parser errors in ${file}`);
}
// Execute type-erased selector in isolation to check the actual algorithm, not string matching.
const compiled=ts.transpileModule(t.helper,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
const exports={};new Function('exports',compiled)(exports);
const people=Array.from({length:80},(_,i)=>({twitchUserId:String(i+1),displayName:`Viewer ${i+1}`}));
assert.equal(exports.getVisibleAudience(people,'1').length,72);
assert.equal(exports.getVisibleAudience(people,'1')[0].twitchUserId,'2');
assert.equal(exports.getVisibleAudience(people,'1')[71].twitchUserId,'73');
assert.equal(exports.getVisibleAudience(people,'10').find(x=>x.twitchUserId==='10'),undefined);
assert.equal(exports.getVisibleAudience(people,null).length,72);
assert(exports.getVisibleAudience(people,'1',new Set(['80'])).some(x=>x.twitchUserId==='80'), 'active late joiner must appear in crowded audience');
assert.equal(exports.getVisibleAudience([],null).length,0);
console.log('Final lobby polish checks passed: shared counter/floor selector, 72 cap, broadcaster filtering, assets, CSS order, TS syntax.');
