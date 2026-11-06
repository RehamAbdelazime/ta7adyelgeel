#!/usr/bin/env node
/** Cross-platform guard for fixes that previously made
 * Windows npm test/build fail despite the 56 legacy checks passing. */
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
const require = createRequire(import.meta.url);
let ts;
try { ts = require('typescript'); }
catch { // Offline artifact environment: discover global TS dynamically, never hardcode Linux paths.
  const globalRoot = execFileSync(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['root', '-g'], { encoding: 'utf8' }).trim();
  ts = createRequire(path.join(globalRoot, '__qa_verify__.cjs'))('typescript');
}
const root = path.resolve(import.meta.dirname, '../..');
const read = f => readFileSync(path.join(root, f), 'utf8');
let checks = 0;
const ok = (test, desc) => { assert.ok(test, desc); checks++; };
const paths = [
  'src/desktop-electron/preload.cts',
  'src/desktop-electron/bridge-contract.ts',
  'src/ui-react/components/settings/AppSettingsButton.tsx',
  'src/ui-react/context/TwitchConnectionContext.tsx',
  'src/ui-react/types/electron.d.ts',
  'src/ui-react/components/gameplay/shared/answer-helpers.test.ts',
  'src/game-core/config/runtime-game-config.test.ts',
  'src/ui-react/components/gameplay/minigames/CountTheBeatScreen.tsx',
  'vitest.config.ts',
];
for (const file of paths) ok(existsSync(path.join(root, file)), `Missing ${file}`);
const contract = read('src/desktop-electron/bridge-contract.ts');
const preload = read('src/desktop-electron/preload.cts');
ok(contract.includes('export type ElGeelDesktopApi') && contract.includes('export type ElGeelTwitchApi'), 'Shared typed IPC contract');
ok(preload.includes('const api: ElGeelDesktopApi') && preload.includes('const twitchApi: ElGeelTwitchApi'), 'Preload runtime is checked against contract');
for (const file of paths.filter(f => f.startsWith('src/ui-react') && !f.endsWith('.test.ts'))) {
  ok(!/desktop-electron\/preload['"]/.test(read(file)), `Renderer incorrectly imports executable preload: ${file}`);
}
const answerFixtures = read('src/ui-react/components/gameplay/shared/answer-helpers.test.ts');
ok(answerFixtures.includes('bpm: 108') && answerFixtures.includes("mode: 'majority'") && answerFixtures.includes('targetCount: null'), 'Fixture fields match current game snapshots');
const configTest = read('src/game-core/config/runtime-game-config.test.ts');
ok(configTest.includes('toEqual(normalized.tour.enabledMiniGames)'), 'Default rotation fallback is based on enabled games');
const vitest = read('vitest.config.ts');
ok(vitest.includes("include: ['src/**/*.test.ts', 'src/**/*.test.tsx']"), 'Vitest excludes node:test CJS runners');
const beat = read('src/ui-react/components/gameplay/minigames/CountTheBeatScreen.tsx');
ok(!/\banimation:\s*`ctb-pop/.test(beat) && /animationName: 'ctb-pop'/.test(beat), 'Beat animation uses longhand only');
const app = read('src/ui-react/App.tsx');
ok(!app.includes('HostPanelToggle'), 'No production HOST launcher');
const provider = read('src/ui-react/context/GameContext.tsx');
ok(!provider.includes('__TA7ADY_QA__') && !provider.includes('QaBotController'), 'Production runtime contains no QA bot hooks');
const pack = JSON.parse(read('package.json'));
ok(pack.scripts['test:unit'] === 'vitest run' && pack.scripts.test.includes('npm run test:unit'), 'Native node:test and Vitest runners stay separate');
const files = paths.filter(file => /\.(?:ts|tsx|cts)$/.test(file));
for (const file of files) {
  const data = read(file);
  const sf = ts.createSourceFile(file, data, ts.ScriptTarget.Latest, true, file.endsWith('.tsx') ? ts.ScriptKind.TSX : file.endsWith('.cts') ? ts.ScriptKind.TS : ts.ScriptKind.TS);
  ok(sf.parseDiagnostics.length === 0, `TypeScript syntax error in ${file}`);
}
console.log(`V47 stabilization contract: PASS ${checks} checks (this is NOT a substitute for full npm build, Vitest, or Electron GUI).`);
