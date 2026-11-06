#!/usr/bin/env node
/** Remove generated build/report outputs only; never touch media, Docs or app state. */
import { rm, lstat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
if (args.some(arg => arg !== '--dry-run')) {
  console.error('Usage: npm run clean [-- --dry-run]');
  process.exit(2);
}
const dryRun = args.includes('--dry-run');
// Fixed allowlist rooted at this package: running from a different cwd cannot
// wipe an unrelated project's output. User content is intentionally excluded.
const targets = [
  'dist', 'dist-electron', 'dist-release', 'release-v2', 'release',
  'release-check', 'coverage', 'qa-artifacts', '.vite',
  'npm-debug.log', 'yarn-error.log', 'pnpm-debug.log',
  'SECURITY_AUDIT.json', 'LOCALIZATION_REPORT.json',
];
let removed = 0;
for (const target of targets) {
  const absolute = path.join(root, target);
  try { await lstat(absolute); }
  catch (error) { if (error.code === 'ENOENT') continue; throw error; }
  console.log(`${dryRun ? 'WOULD REMOVE' : 'REMOVE'} ${target}`);
  if (!dryRun) await rm(absolute, { recursive: true, force: true });
  removed++;
}
console.log(`Generated-only cleanup ${dryRun ? 'preview' : 'complete'}: ${removed} item(s). Poster/Frame/Quotes, user data, and source untouched.`);
