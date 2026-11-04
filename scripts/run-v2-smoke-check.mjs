#!/usr/bin/env node
/** Fast offline smoke checks. Does not pretend to launch the Electron UI. */
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const checks = [
  'verify-source-integrity.mjs',
  'verify-v33-reveal-consistency.mjs',
  'verify-v2-minigame-baseline.mjs',
  'verify-v2-minigame-grid.mjs',
  'verify-v2-scoring-policy.mjs',
  'verify-unified-host-answer-v31.mjs',
  'verify-experience-v32.mjs',
];
for (const check of checks) {
  const status = spawnSync(process.execPath, [path.join(root, 'scripts', check)], { cwd: root, stdio: 'inherit' });
  if (status.status !== 0) process.exit(status.status ?? 1);
}
console.log(`Offline source smoke PASS (${checks.length} suites).`);
