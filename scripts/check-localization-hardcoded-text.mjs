#!/usr/bin/env node
/**
 * Advisory scan of visible JSX text literals. Keep false positives visible:
 * automated replacement is unsafe because numbers, glyphs and demos are UI.
 */
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const uiDir = path.join(root, 'src', 'ui-react');
function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory()
    ? walk(path.join(dir, entry.name))
    : entry.isFile() && entry.name.endsWith('.tsx') ? [path.join(dir, entry.name)] : []);
}
const suggestions = [];
for (const file of walk(uiDir)) {
  const text = readFileSync(file, 'utf8');
  for (const match of text.matchAll(/>\s*([^<>\n{}]{3,})\s*</g)) {
    const value = match[1].trim();
    // Advisory only: sample illustrations, counters, icons and brand names may
    // intentionally use literals instead of translation keys.
    if (!/[A-Za-z\u0600-\u06ff]{3}/.test(value)) continue;
    const line = text.slice(0, match.index).split('\n').length;
    suggestions.push({ file: path.relative(root, file).replaceAll('\\', '/'), line, value: value.slice(0, 90) });
  }
}
console.log(`Localization literal audit: ${suggestions.length} candidate JSX text nodes (advisory, review manually).`);
for (const suggestion of suggestions.slice(0, 40)) console.log(`  ${suggestion.file}:${suggestion.line} ${JSON.stringify(suggestion.value)}`);
if (suggestions.length > 40) console.log(`  … ${suggestions.length - 40} more candidates; no automatic replacements were made.`);
