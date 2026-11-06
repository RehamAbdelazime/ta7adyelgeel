#!/usr/bin/env node
/** Execute every registered source regression, including older release guards. */
import { readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const checks = readdirSync(path.join(root, 'scripts'))
  .filter(name => /^verify-[\w-]+\.(?:mjs|cjs)$/.test(name))
  .sort();
const failures = [];
for (const name of checks) {
  const result = spawnSync(process.execPath, [path.join(root, 'scripts', name), ...(name === 'verify-renderer-media-v59.mjs' ? ['--source-only'] : [])], {
    cwd: root,
    encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024,
  });
  if (result.status !== 0) {
    failures.push(name);
    console.error(`[FAIL] ${name}\n${result.stdout ?? ''}\n${result.stderr ?? ''}`);
  } else {
    console.log(`[PASS] ${name}`);
  }
}
console.log(`All-regressions report: ${checks.length - failures.length}/${checks.length} passed.`);
if (failures.length) process.exitCode = 1;
