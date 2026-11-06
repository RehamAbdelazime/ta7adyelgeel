#!/usr/bin/env node
/** Deep source + asset audit. Produces FAIL/WARN/INFO without guessing that dynamic assets are unused. */
import { readFile, readdir, stat, mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
const root=path.resolve(import.meta.dirname, '../..');
const out=path.resolve(process.env.QA_OUTPUT ?? path.join(root,'release-check','static'));
await mkdir(out,{recursive:true});
const reports={generatedAt:new Date().toISOString(), totals:{}, errors:[], warnings:[], releaseBlockers:[], info:[]};
const require=createRequire(import.meta.url);
let ts;
try {ts=require('typescript');}catch {const global=execFileSync('npm',['root','-g'],{encoding:'utf8'}).trim();ts=createRequire(path.join(global,'qa-tmp.cjs'))('typescript');}
let postcss;
try {postcss=require('postcss');} catch {try {const global=execFileSync('npm',['root','-g'],{encoding:'utf8'}).trim();postcss=createRequire(path.join(global,'qa-tmp.cjs'))('postcss');} catch {reports.warnings.push('postcss not available; CSS parser check skipped');}}
async function walk(p) {let out=[];for(const f of await readdir(p,{withFileTypes:true})) {if(f.name==='node_modules'||f.name==='qa-artifacts'||f.name==='release-v2')continue;const a=path.join(p,f.name);if(f.isDirectory())out.push(...await walk(a));else if(f.isFile())out.push(a);}return out;}
const sources=await walk(path.join(root,'src'));
const scriptFiles=await walk(path.join(root,'scripts'));
const assets=await walk(path.join(root,'public'));
// QA has to run on the streamer's Windows PC, not only in the developer's
// Linux container. Hardcoded Node/TypeScript installation paths silently
// caused 12/55 regressions and blocked the build on Windows in V45.
for (const file of scriptFiles.filter(p => /\.(?:cjs|mjs|js)$/.test(p))) {
 const js = await readFile(file, 'utf8');
 if (/require\(\s*['"]\/opt\/nvm\/versions\/node\//.test(js)) {
  reports.errors.push(`Host-specific TypeScript path in ${path.relative(root,file).replaceAll('\\','/')}; use require('typescript')`);
 }
}

const srcTexts=new Map(); const relative=p=>path.relative(root,p).replaceAll('\\','/');
const sourceExtensions=['.ts','.tsx','.json','.css'];
const content=async p=>{if(!srcTexts.has(p))srcTexts.set(p,await readFile(p,'utf8'));return srcTexts.get(p);};
const tsfiles=sources.filter(p=>/\.tsx?$/.test(p));const cssfiles=sources.filter(p=>p.endsWith('.css'));
const graph=new Map();const refs=new Set();
for(const p of tsfiles){
 const txt=await content(p), ast=ts.createSourceFile(p,txt,ts.ScriptTarget.Latest,true,p.endsWith('.tsx')?ts.ScriptKind.TSX:ts.ScriptKind.TS);
 for(const d of ast.parseDiagnostics){const {line}=ast.getLineAndCharacterOfPosition(d.start||0);reports.errors.push(`${relative(p)}:${line+1} TS parser: ${ts.flattenDiagnosticMessageText(d.messageText,' ')}`);}
 const imported=[];
 const inspect=node=>{
  if((ts.isImportDeclaration(node)||ts.isExportDeclaration(node))&&node.moduleSpecifier&&ts.isStringLiteral(node.moduleSpecifier))imported.push(node.moduleSpecifier.text);
  if(ts.isCallExpression(node)&&node.arguments.length&&ts.isStringLiteral(node.arguments[0])&&(node.expression.kind===ts.SyntaxKind.ImportKeyword||node.expression.getText(ast)==='require'))imported.push(node.arguments[0].text);
  ts.forEachChild(node, inspect);
 };inspect(ast);graph.set(p,[]);
 for(const spec of imported){if(!spec.startsWith('.'))continue;const abs=path.resolve(path.dirname(p),spec);let found=null;
  const base=abs.replace(/\.js$/,''); // TypeScript emits .js from .ts imports on Electron side.
  const candidates=[abs,base+'.ts',base+'.tsx',base+'.cts',base+'.mts',abs+'.ts',abs+'.tsx',abs+'.cts',abs+'.js',abs+'.json',abs+'.css',abs+'/index.ts',abs+'/index.tsx'];
  for(const candidate of candidates) if(existsSync(candidate)){found=candidate;break;}
  if(!found)reports.errors.push(`Unresolved import: ${relative(p)} → ${spec}`);
  else graph.get(p).push(found);
 }
}
let selectors=new Map();
for(const p of cssfiles) {
 const txt=await content(p);
 if(postcss){try{const rootAst=postcss.parse(txt,{from:p});rootAst.walkRules(rule=>{for(const sel of rule.selector.split(',')){const s=sel.trim();if(!s)continue;selectors.set(s,(selectors.get(s)??0)+1);}});}
  catch(err){reports.errors.push(`CSS parse ${relative(p)}: ${err.reason||err.message}`);}}
 for(const m of txt.matchAll(/url\(\s*['"]?(\.{1,2}\/[^'"\)\s]+)['"]?\s*\)/g)){
  const url=m[1].split(/[?#]/)[0];if(!existsSync(path.resolve(path.dirname(p),url)))reports.warnings.push(`CSS asset candidate not found: ${relative(p)} ${url}`);
 }
}
// Literal public references: many resources are loaded by game data and scene runtime
// factories; never automatically delete unreferenced files.
let allText='';for(const p of [...tsfiles,...cssfiles,...sources.filter(p=>p.endsWith('.json'))])allText+='\n'+await content(p);
for(const file of assets){
 const rel=relative(file).replace(/^public\//,'');
 const base=path.basename(file);
 if(!allText.includes(rel)&&!allText.includes(base))refs.add(rel);
}
const unused=Array.from(refs);
reports.info.push(`${unused.length} potentially unreferenced assets; dynamic paths are possible, DO NOT auto-delete.`);
// Reachability audit for source modules. Entry points are runtime UI and desktop,
// not tests or scripts. Report candidates only: registries can use dynamic loads.
const visited=new Set();
function visit(p){if(visited.has(p)||!graph.has(p))return;visited.add(p);for(const child of graph.get(p))visit(child);}
visit(path.join(root,'src/ui-react/main.tsx'));
visit(path.join(root,'src/desktop-electron/main.ts'));
const unusedModules=tsfiles.filter(p=>!visited.has(p) && !/\.test\.tsx?$/.test(p) && !p.endsWith('.d.ts'));
reports.info.push(`Potentially unreachable TS modules (${unusedModules.length}), manual review: ${JSON.stringify(unusedModules.map(relative).slice(0,35))}`);

reports.info.push(`Top 25 CSS selectors with repeated rules (expected for layered styling): ${JSON.stringify([...selectors].filter(x=>x[1]>=10).sort((a,b)=>b[1]-a[1]).slice(0,25))}`);
reports.info.push(`Potential unused assets sample (manual triage only): ${JSON.stringify(unused.slice(0,40))}`);
// Critical content readiness: missing local media is a release blocker, not an npm/test failure.
const mediaJson=path.join(root,'src/game-core/minigames/visual-guess/visual-guess-questions.json');
const media=JSON.parse(await readFile(mediaJson,'utf8'));
const mediaText=JSON.stringify(media);
let mediaOffline=0, mediaRemote=0, mediaMissing=0;
for(const item of [...(media.movies??[]),...(media.stars??[])]){
 const local=path.join(root,'public/assets/game/runtime/minigames/visual-guess',item.asset ?? '__no_asset__');
 if(existsSync(local))mediaOffline++;
 else if(item.imageUrl)mediaRemote++;
 else mediaMissing++;
}
const visualStatus=`Visual pack not ready for fully-offline playback: ${mediaOffline} local media, ${mediaRemote} remote-only, ${mediaMissing} no image source. Missing entries are excluded from play.`;
reports.warnings.push(visualStatus);
if(mediaMissing>0)reports.releaseBlockers.push(`${mediaMissing} movie/star questions have no usable image source: import authorized photographs before release.`);
if(mediaRemote>0)reports.releaseBlockers.push(`${mediaRemote} movie/star questions use remote-only images: cache local files and test offline before release.`);

const publicIds=['food-origin','shape-count','maze-gates','count-the-beat','lucky-cup','guess-movie','guess-star'];
const catalogText=await readFile(path.join(root,'src/game-core/minigames/minigame-registry.ts'),'utf8');
for(const id of publicIds) if(!catalogText.includes(`id: '${id}'`)) reports.errors.push(`Public game missing from catalog: ${id}`);
if(mediaText.includes('original-clues/'))reports.errors.push('V43 generated illustrative movie clues remain referenced');
reports.warnings.push('Real movie stills/posters and celebrity photography require individual licensing review; source URLs alone do not convey broadcast rights.');
reports.releaseBlockers.push('Copyright/photography/publicity rights not verified for all movie stills/posters and star photographs. Source URL is not a broadcast license.');
reports.totals={tsFiles:tsfiles.length, cssFiles:cssfiles.length, scriptFiles:scriptFiles.length, publicAssets:assets.length, potentialUnusedAssets:unused.length, potentiallyUnreachableSourceModules:unusedModules.length, visualMedia:{offline:mediaOffline,remote:mediaRemote,missing:mediaMissing}, cssRepeatedSelectorsAbove10:[...selectors.values()].filter(n=>n>=10).length, errorCount:reports.errors.length, warningCount:reports.warnings.length};
await writeFile(path.join(out,'source-audit.json'),JSON.stringify(reports,null,2));
console.log(`V45 SOURCE AUDIT: ${JSON.stringify(reports.totals)}`);
for(const e of reports.errors)console.error('FAIL',e);
for(const w of reports.warnings.slice(0,20))console.warn('WARN',w);
console.log('RELEASE BLOCKERS:',reports.releaseBlockers.length);for(const b of reports.releaseBlockers)console.warn('BLOCKER',b);
console.log('Report:',path.join(out,'source-audit.json'));
if(reports.errors.length)process.exitCode=1;
