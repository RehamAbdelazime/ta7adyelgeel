#!/usr/bin/env node
/** Validate build output before attempting to ship a Windows portable app. */
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const at = (...parts) => path.join(root, ...parts);
for (const name of ['dist/index.html', 'dist-electron/main.js', 'dist-electron/preload.cjs']) {
  assert(existsSync(at(name)), `Missing build output ${name}; run npm run build first.`);
}
const index = readFileSync(at('dist/index.html'), 'utf8');
assert(index.includes('assets/'), 'Vite renderer bundle references are missing.');
for (const folder of ['dist/assets', 'dist/assets/game/runtime/config', 'dist/assets/game/runtime/host',
  'dist/assets/game/runtime/transition', 'dist/assets/game/runtime/minigames/lucky-cup']) {
  assert(existsSync(at(folder)) && readdirSync(at(folder)).length > 0, `Required runtime release folder missing/empty: ${folder}`);
}
assert(existsSync(at('dist/assets/game/runtime/minigames/lucky-cup/ball.png')), 'Lucky Cup ball asset missing from package.');
assert(existsSync(at('dist/assets/game/runtime/minigames/lucky-cup/cup.png')), 'Lucky Cup cup asset missing from package.');
console.log('Release output PASS: renderer, Electron main/preload, config, host, curtain, Lucky Cup assets.');
