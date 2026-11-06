#!/usr/bin/env node
// Regression guard: QA scripts must work on Windows without Linux Node paths.
const assert = require('node:assert/strict');
const { readdirSync, readFileSync } = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
let checked = 0;
function recurse(directory) {
 for (const entry of readdirSync(directory, { withFileTypes: true })) {
  const filename = path.join(directory, entry.name);
  if (entry.isDirectory()) { recurse(filename); continue; }
  if (!/\.(?:cjs|mjs|js)$/.test(entry.name) || entry.name === 'verify-qa-portability-v45.cjs') continue;
  const content = readFileSync(filename, 'utf8');
  assert(!content.includes('/opt/nvm/versions/node/'), `${path.relative(root,filename)} hardcodes developer's Node installation`);
  checked++;
 }
}
recurse(path.join(root, 'scripts'));
const ts = require('typescript');
assert(typeof ts.transpileModule === 'function', 'TypeScript must resolve from project dependencies');
const controller = readFileSync(path.join(root, 'tests/helpers/qa-bot-controller.ts'), 'utf8');
assert(controller.includes('MAX_QA_BOTS = 500'), 'Load-testing controller must remain in test helpers');
assert(!readFileSync(path.join(root, 'src/ui-react/context/GameContext.tsx'), 'utf8').includes('QaBotController'), 'Production React provider must not ship bot controller');
console.log(`QA portable verification passed: ${checked} scripts, local TypeScript ${ts.version}, test-only synthetic load testing.`);
