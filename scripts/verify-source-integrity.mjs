#!/usr/bin/env node
/**
 * Release-blocking, zero-dependency checks for missing code/CSS imports,
 * public assets, incomplete npm script wiring, and invalid JSON.
 * Deliberately avoids pruning assets: dynamic sprite and minigame paths exist.
 */
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const rel = (file) => path.relative(root, file).replaceAll('\\', '/');
const at = (...parts) => path.resolve(root, ...parts);
const errors = [];
const stats = { sourceFiles: 0, relativeImports: 0, cssImports: 0, assetReferences: 0, jsonFiles: 0, binaryAssets: 0 };

function walk(dir) {
  if (!existsSync(dir)) return [];
  const results = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.git', 'dist', 'dist-electron', 'release-v2'].includes(entry.name)) continue;
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...walk(file));
    else if (entry.isFile()) results.push(file);
  }
  return results;
}
function fail(file, description) { errors.push(`${rel(file)}: ${description}`); }
function resolveModule(from, specifier) {
  const base = path.resolve(path.dirname(from), specifier);
  const targets = [base, ...['.ts', '.tsx', '.cts', '.mts', '.js', '.jsx', '.json', '.css'].map(ext => base + ext),
    ...['index.ts', 'index.tsx', 'index.js'].map(name => path.join(base, name))];
  // Electron's NodeNext imports use .js/.cjs specifiers for .ts/.cts sources.
  if (base.endsWith('.js')) targets.push(base.slice(0, -3) + '.ts', base.slice(0, -3) + '.tsx');
  if (base.endsWith('.cjs')) targets.push(base.slice(0, -4) + '.cts');
  return targets.some(target => existsSync(target) && statSync(target).isFile());
}
function checkPublicAsset(sourceFile, assetPath) {
  if (assetPath.includes('$') || assetPath.includes('*')) return;
  const asset = assetPath.replace(/^\.\//, '').replace(/^\//, '').split(/[?#]/)[0];
  stats.assetReferences++;
  const target = at('public', asset);
  if (!target.startsWith(at('public') + path.sep)) fail(sourceFile, `Invalid public asset path: ${assetPath}`);
  else if (!existsSync(target)) fail(sourceFile, `Missing public asset: ${assetPath}`);
}

const codeFiles = walk(at('src')).filter(file => /\.(ts|tsx|cts|mts|js|jsx|mjs|cjs)$/.test(file));
for (const file of [at('vite.config.ts'), ...codeFiles]) {
  stats.sourceFiles++;
  const source = readFileSync(file, 'utf8');
  const imports = [
    ...source.matchAll(/\bfrom\s+['"](\.[^'"\n]+)['"]/g),
    ...source.matchAll(/^\s*import\s*['"](\.[^'"\n]+)['"]/gm),
    ...source.matchAll(/\bimport\s*\(\s*['"](\.[^'"\n]+)['"]\s*\)/g),
    ...source.matchAll(/\brequire\s*\(\s*['"](\.[^'"\n]+)['"]\s*\)/g),
  ];
  for (const match of imports) {
    stats.relativeImports++;
    if (!resolveModule(file, match[1])) fail(file, `Unresolved import: ${match[1]}`);
  }
}

for (const file of walk(at('src')).filter(file => path.extname(file) === '.css')) {
  const source = readFileSync(file, 'utf8');
  for (const [, url] of source.matchAll(/@import\s+['"](\.[^'"\n]+)['"]/g)) {
    stats.cssImports++;
    if (!resolveModule(file, url)) fail(file, `Unresolved CSS @import: ${url}`);
  }
  for (const [, raw] of source.matchAll(/url\(\s*['"]?([^)'"\s]+)['"]?\s*\)/g)) {
    if (raw.startsWith('data:') || raw.startsWith('#') || /^[a-z][a-z0-9+.-]*:/i.test(raw)) continue;
    const clean = raw.split(/[?#]/)[0];
    if (clean.startsWith('/assets/') || clean.startsWith('./assets/')) checkPublicAsset(file, clean);
    else if (clean.startsWith('.')) {
      const ref = path.resolve(path.dirname(file), clean);
      stats.assetReferences++;
      if (!existsSync(ref)) fail(file, `Unresolved CSS url(): ${raw}`);
    }
  }
}

for (const file of codeFiles) {
  const source = readFileSync(file, 'utf8');
  // Static string URLs only. Template-driven paths are covered by specialized
  // validators for sprite aliases and minigame catalogs.
  const regex = /(?:\.?\.?\/)?assets\/game\/runtime\/[^'"`\s(){}<>\\]+/g;
  for (const [raw] of source.matchAll(regex)) {
    checkPublicAsset(file, raw.replace(/[;,]$/, ''));
  }
}

const packageFile = at('package.json');
const pkg = JSON.parse(readFileSync(packageFile, 'utf8'));
for (const [name, command] of Object.entries(pkg.scripts)) {
  for (const [, script] of command.matchAll(/\bnode\s+(scripts\/[A-Za-z0-9_.\/-]+)/g)) {
    if (!existsSync(at(script))) fail(packageFile, `npm script '${name}' references missing ${script}`);
  }
  for (const [, dependent] of command.matchAll(/\bnpm\s+run\s+([\w:-]+)/g)) {
    if (!Object.hasOwn(pkg.scripts, dependent)) fail(packageFile, `npm script '${name}' calls missing npm script '${dependent}'`);
  }
}

for (const file of [...walk(at('src')), ...walk(at('public'))].filter(file => path.extname(file) === '.json')) {
  stats.jsonFiles++;
  try { JSON.parse(readFileSync(file, 'utf8')); }
  catch (error) { fail(file, `Invalid JSON: ${error.message}`); }
}

// Catch case-insensitive collisions before shipping to Windows (NTFS).
const files = [at('package.json'), ...walk(at('src')), ...walk(at('public')), ...walk(at('scripts'))];
const insensitive = new Map();
for (const file of files) {
  const folded = rel(file).toLowerCase();
  if (insensitive.has(folded) && insensitive.get(folded) !== rel(file)) {
    fail(file, `Case-insensitive path collision with ${insensitive.get(folded)}`);
  }
  insensitive.set(folded, rel(file));
}

const mimeSignatures = [
  ['.png', Buffer.from('89504e470d0a1a0a', 'hex')],
  ['.jpg', Buffer.from('ffd8', 'hex')],
  ['.jpeg', Buffer.from('ffd8', 'hex')],
];
const fileHashes = new Map();
for (const file of walk(at('public')).filter(file => /\.(png|jpe?g|webp|mp3|mp4|svg)$/i.test(file))) {
  stats.binaryAssets++;
  const bytes = readFileSync(file);
  const signature = mimeSignatures.find(([ext]) => file.toLowerCase().endsWith(ext))?.[1];
  if (signature && !bytes.subarray(0, signature.length).equals(signature)) fail(file, 'Binary signature does not match the extension.');
  if (file.endsWith('.webp') && (bytes.toString('ascii', 0, 4) !== 'RIFF' || bytes.toString('ascii', 8, 12) !== 'WEBP')) {
    fail(file, 'Invalid WEBP signature.');
  }
  if (file.endsWith('.svg') && !bytes.toString('utf8').includes('<svg')) fail(file, 'Invalid SVG markup.');
  const hash = createHash('sha256').update(bytes).digest('hex');
  if (fileHashes.has(hash)) fail(file, `Duplicate asset bytes of ${fileHashes.get(hash)}.`);
  else fileHashes.set(hash, rel(file));
}

if (errors.length) {
  console.error(`Source integrity FAILED (${errors.length} issue(s)):\n${errors.map(item => ' - ' + item).join('\n')}`);
  process.exitCode = 1;
} else {
  assert.equal(errors.length, 0);
  console.log(`Source integrity PASS: ${stats.sourceFiles} source files, ${stats.relativeImports} relative imports, ` +
    `${stats.cssImports} CSS imports, ${stats.assetReferences} asset references, ${stats.jsonFiles} JSON files, ` +
    `${stats.binaryAssets} verified public assets; no byte-identical asset duplicates.`);
}
