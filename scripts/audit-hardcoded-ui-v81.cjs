#!/usr/bin/env node
/**
 * V81 localized UI audit — read-only. npm package 'typescript' is a devDependency.
 *
 * Usage: node scripts/audit-hardcoded-ui-v81.cjs [--json] [--strict] [--write]
 * --json: print a machine readable result
 * --strict: nonzero exit code if high-confidence hardcoded text remains
 * --write: save docs/V81_HARDCODED_UI_AUDIT.json (explicitly opt in)
 *
 * It deliberately reports candidates: original movie quotes, customer content,
 * chat commands, CSS classes and game IDs should NOT become translation keys.
 */
const ts = require('typescript');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const src = path.join(root, 'src');
const json = process.argv.includes('--json');
const strict = process.argv.includes('--strict');
const write = process.argv.includes('--write');
const visibleAttributes = new Set(['title', 'alt', 'placeholder', 'aria-label', 'aria-description', 'label', 'description', 'helperText', 'tooltip', 'emptyText']);
const skipFiles = /(?:\.test\.|\.spec\.|\.generated\.|\/localization\/|\/questions\/|\/fixtures\/|\/assets\/)/;
const matches = [];
const syntaxErrors = [];
const counts = { sourceFiles: 0, jsxText: 0, visibleAttribute: 0, visibleExpression: 0, bilingualConditional: 0, bilingualObject: 0 };
function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p);
    else if (/\.tsx?$/.test(ent.name) && !skipFiles.test(p.replace(/\\/g,'/'))) examine(p);
  }
}
function isText(s) {
  const v = s.trim();
  if (v.length < 2) return false;
  // Human readable Arabic or English, not a pure icon, variable, command or CSS token.
  if (!/[\p{L}]/u.test(v)) return false;
  if (['ar','en','rtl','ltr','numeric','ArrowLeft','ArrowRight'].includes(v)) return false;
  if (/^!?\d+$|^[!@#?.,:;\-–—\u2190-\u21FF]+$/u.test(v)) return false;
  if (/^(?:\w[\w-]*\.)+\w+$/.test(v)) return false; // likely translation key
  if (/^(?:[A-Z][A-Z0-9_]{1,8})$/.test(v)) return false; // status/technical badge
  return true;
}
function record(type, node, sf, value) {
  if (!isText(value)) return;
  const loc = sf.getLineAndCharacterOfPosition(node.getStart(sf));
  matches.push({ type, file: path.relative(root,sf.fileName).replace(/\\/g,'/'), line: loc.line + 1, column: loc.character + 1, text: value.trim().slice(0, 180) });
  counts[type]++;
}
function literal(node) {
  if (ts.isStringLiteralLike(node)) return node.text;
  if (ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  return null;
}
function propertyName(p) {
  if (!p.name) return null;
  if (ts.isIdentifier(p.name)) return p.name.text;
  if (ts.isStringLiteral(p.name)) return p.name.text;
  return null;
}
function examine(file) {
  const sf = ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  counts.sourceFiles++;
  for (const diag of sf.parseDiagnostics) syntaxErrors.push({ file: path.relative(root,file), message: ts.flattenDiagnosticMessageText(diag.messageText,' '), start: diag.start });
  function visit(n) {
    if (ts.isJsxText(n)) {
      const txt=n.getText(sf).replace(/\s+/g, ' ').trim();
      if (txt) record('jsxText',n,sf,txt);
    }
    if (ts.isJsxAttribute(n) && visibleAttributes.has(n.name.text) && n.initializer && ts.isStringLiteral(n.initializer)) {
      record('visibleAttribute',n,sf,n.initializer.text);
    }
    if (ts.isJsxExpression(n) && n.expression && literal(n.expression) !== null) {
      record('visibleExpression',n,sf,literal(n.expression));
    }
    if (ts.isConditionalExpression(n) && /\blocale\b|\blang\b|\brtl\b/.test(n.condition.getText(sf))) {
      const a=literal(n.whenTrue), b=literal(n.whenFalse);
      if (a!==null && b!==null && isText(a) && isText(b) && a!==b) record('bilingualConditional',n,sf,`${a} / ${b}`);
    }
    if (ts.isObjectLiteralExpression(n)) {
      const props=new Map();
      for(const prop of n.properties) if (ts.isPropertyAssignment(prop)) {
        const key=propertyName(prop), text=literal(prop.initializer);
        if (key && text!==null) props.set(key,text);
      }
      if(props.has('ar') && props.has('en') && isText(props.get('ar')) && isText(props.get('en')))
        record('bilingualObject',n,sf,`${props.get('ar')} / ${props.get('en')}`);
    }
    ts.forEachChild(n,visit);
  }
  visit(sf);
}
walk(src);
const report={title:'V81 Hardcoded UI text audit',scannedAt:new Date().toISOString(),root:'.',summary:{...counts,findings:matches.length,syntaxErrors:syntaxErrors.length},warnings:['Heuristic candidate detector: confirm before changing any source or user-provided question bank.','The program is read-only unless --write is provided.'],findings:matches,parseErrors:syntaxErrors};
if(write) {
  const output=path.join(root,'docs','V81_HARDCODED_UI_AUDIT.json');
  fs.mkdirSync(path.dirname(output),{recursive:true});
  fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');
}
if(json) process.stdout.write(JSON.stringify(report,null,2)+'\n');
else {
  console.log(`V81 UI audit: ${counts.sourceFiles} TS/TSX files, ${matches.length} possible hardcoded UI strings, ${syntaxErrors.length} parse errors`);
  for (const row of matches.slice(0,75)) console.log(`  ${row.type.padEnd(20)} ${row.file}:${row.line} ${JSON.stringify(row.text)}`);
  if (matches.length>75) console.log(`  ... and ${matches.length-75} more (use --json for all)`);
  console.log('This is an advisory audit, not an automatic code rewriter.');
}
if (strict && (matches.length || syntaxErrors.length)) process.exitCode=1;
if (syntaxErrors.length) process.exitCode=1;
