#!/usr/bin/env node
/** V81 read-only translation contract: Arabic/English keys, interpolation,
 * type union, static references, duplicate imported bindings and TS parse. */
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const sourceRoot = path.join(root,'src');
const translationFile=path.join(sourceRoot,'game-core/localization/translations.ts');
const typesFile=path.join(sourceRoot,'game-core/localization/locale-types.ts');
const txt=fs.readFileSync(translationFile,'utf8');
const ty=fs.readFileSync(typesFile,'utf8');
const sf=ts.createSourceFile(translationFile,txt,ts.ScriptTarget.Latest,true,ts.ScriptKind.TS);
const defs=sf.statements.filter(ts.isVariableStatement)
  .flatMap(s=>[...s.declarationList.declarations]);
const declaration=defs.find(s=>s.name.getText(sf)==='translations');
if (!declaration || !ts.isObjectLiteralExpression(declaration.initializer)) throw Error('translations dictionary not found');
const copy={en:{},ar:{}};
for(const p of declaration.initializer.properties){
 if(!ts.isPropertyAssignment(p))continue;
 const lang=p.name.getText(sf);
 if(!copy[lang] || !ts.isObjectLiteralExpression(p.initializer))continue;
 for(const pair of p.initializer.properties){
  if(!ts.isPropertyAssignment(pair))continue;
  const name=pair.name.text??pair.name.getText(sf).replace(/^['"]|['"]$/g,'');
  if(ts.isStringLiteral(pair.initializer)||ts.isNoSubstitutionTemplateLiteral(pair.initializer)) copy[lang][name]=pair.initializer.text;
 }
}
const errors=[];
const enSet=new Set(Object.keys(copy.en)),arSet=new Set(Object.keys(copy.ar));
for(const k of enSet)if(!arSet.has(k))errors.push(`Arabic missing ${k}`);
for(const k of arSet)if(!enSet.has(k))errors.push(`English missing ${k}`);
const placeholders=s=>[...s.matchAll(/\{\{([^}]+)\}\}/g)].map(m=>m[1]).sort().join(',');
for(const k of enSet)if(arSet.has(k)&&placeholders(copy.en[k])!==placeholders(copy.ar[k]))
 errors.push(`Interpolation differs ${k}: en=${placeholders(copy.en[k])}, ar=${placeholders(copy.ar[k])}`);
const typedSource=ty.split('export type TranslationKey =')[1];
if(!typedSource)throw Error('TranslationKey union missing');
const typedSet=new Set([...typedSource.matchAll(/\|\s*'([^']+)'/g)].map(m=>m[1]));
for(const k of enSet)if(!typedSet.has(k))errors.push(`TranslationKey missing ${k}`);
for(const k of typedSet)if(!enSet.has(k))errors.push(`Typed key without translated value ${k}`);
let parseErrors=0, checkedReferences=0, sourceFiles=0;
function walk(dir){
 for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
  const full=path.join(dir,entry.name);
  if(entry.isDirectory())walk(full);
  else if(/\.tsx?$/.test(entry.name)){
   sourceFiles++;
   const parsed=ts.createSourceFile(full,fs.readFileSync(full,'utf8'),ts.ScriptTarget.Latest,true,full.endsWith('x')?ts.ScriptKind.TSX:ts.ScriptKind.TS);
   parseErrors+=parsed.parseDiagnostics.length;
   const symbols=new Set();
   for(const decl of parsed.statements.filter(ts.isImportDeclaration)){
    const bindings=decl.importClause?.namedBindings;
    if(bindings&&ts.isNamedImports(bindings))for(const b of bindings.elements){
      const key=b.name.text;
      if(symbols.has(key)&&!b.isTypeOnly)errors.push(`Duplicate import ${key} in ${path.relative(root,full)}`);
      symbols.add(key);
    }
   }
   function visit(node){
    if(ts.isCallExpression(node)){
      const callee=node.expression.getText(parsed);
      const index=callee==='translate'?1:callee==='t'?0:-1;
      if(index!==-1&&node.arguments[index]&&ts.isStringLiteral(node.arguments[index])){
        checkedReferences++;
        const key=node.arguments[index].text;
        if(!enSet.has(key))errors.push(`Missing translation key ${key} at ${path.relative(root,full)}:${parsed.getLineAndCharacterOfPosition(node.getStart(parsed)).line+1}`);
      }
    }
    ts.forEachChild(node,visit);
   }
   visit(parsed);
  }
 }
}
walk(sourceRoot);
const summary={englishKeys:enSet.size,arabicKeys:arSet.size,typedKeys:typedSet.size,sourceFiles,checkedReferences,parseErrors,errors:errors.length};
if(process.argv.includes('--json'))console.log(JSON.stringify({summary,errors},null,2));
else {
 console.log('V81 typed i18n verification:',summary);
 for(const error of errors.slice(0,50))console.log('  ERROR',error);
}
if(parseErrors||errors.length)process.exitCode=1;
