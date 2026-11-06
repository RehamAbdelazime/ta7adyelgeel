'use strict';
/** Node QA-only TypeScript CJS loader. Works with globally installed tsc even offline. */
const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');
let ts;
try { ts = require('typescript'); } catch {
  const global = require('node:child_process').execFileSync('npm', ['root', '-g'], { encoding: 'utf8' }).trim();
  ts = createRequire(path.join(global, '__qa__.cjs'))('typescript');
}
const diagnostics = [];
for (const ext of ['.ts', '.tsx']) {
  require.extensions[ext] = (mod, filename) => {
    const { outputText, diagnostics: errors } = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
      fileName: filename,
      reportDiagnostics: true,
      compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022,
        esModuleInterop: true, resolveJsonModule: true },
    });
    if (errors?.length) diagnostics.push(...errors.map(e => `${filename}: ${ts.flattenDiagnosticMessageText(e.messageText, '\n')}`));
    mod._compile(outputText, filename);
  };
}
process.on('exit', () => {
  if (diagnostics.length) { console.error('[QA TS SYNTAX]', diagnostics.join('\n')); process.exitCode = 1; }
});
module.exports = { ts };
