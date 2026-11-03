#!/usr/bin/env node
/**
 * Optional SAFE removal of obsolete V32 files after applying the V33 PATCH.
 * Default is dry-run. Never delete files with changed bytes, directories,
 * symlinks, or anything not explicitly enumerated in the recorded manifest.
 */
import { createHash } from 'node:crypto';
import { existsSync, lstatSync, readFileSync, unlinkSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(readFileSync(path.join(root, 'scripts/cleanup-delete-manifest-v33.json'), 'utf8'));
const args = process.argv.slice(2);
if (args.some(arg => !['--apply', '--dry-run'].includes(arg)) || (args.includes('--apply') && args.includes('--dry-run'))) {
  console.error('Usage: npm run cleanup:v33 [-- --dry-run | -- --apply]');
  process.exit(2);
}
const apply = args.includes('--apply');
let matched = 0;
let skipped = 0;
let absent = 0;
let bytes = 0;
for (const entry of manifest.entries) {
  const file = path.resolve(root, entry.path);
  if (!file.startsWith(root + path.sep) || entry.path.includes('..') || path.isAbsolute(entry.path)) {
    throw new Error(`Unsafe cleanup path: ${entry.path}`);
  }
  if (!existsSync(file)) { absent++; continue; }
  // Never follow a symlinked parent directory out of the project tree.
  let current = root;
  const hasSymlinkParent = entry.path.split('/').slice(0, -1).some(segment => {
    current = path.join(current, segment);
    return existsSync(current) && lstatSync(current).isSymbolicLink();
  });
  if (hasSymlinkParent) {
    console.warn(`SKIPPED symlinked directory: ${entry.path}`); skipped++; continue;
  }
  const stat = lstatSync(file);
  if (!stat.isFile() || stat.isSymbolicLink()) {
    console.warn(`SKIPPED non-file: ${entry.path}`); skipped++; continue;
  }
  if (stat.size !== entry.size || createHash('sha256').update(readFileSync(file)).digest('hex') !== entry.sha256) {
    console.warn(`SKIPPED modified file: ${entry.path}`); skipped++; continue;
  }
  matched++; bytes += entry.size;
  if (apply) unlinkSync(file);
}
console.log(`V33 cleanup ${apply ? 'APPLIED' : 'DRY-RUN'}: ${matched} verified obsolete files / ${(bytes/1024/1024).toFixed(2)} MiB; ${absent} already absent, ${skipped} preserved (modified or unsafe).`);
if (!apply && matched) console.log('To actually remove these exact V32 files: npm run cleanup:v33 -- --apply');
