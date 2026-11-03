import { readFileSync } from 'node:fs';

// The desktop app has two translation layers: typed fallbacks and optional
// runtime overrides. Keep matching values synchronized until overrides become
// explicit per-key patches rather than a complete copied dictionary.
const text = readFileSync('src/game-core/localization/translations.ts', 'utf8');
const runtime = JSON.parse(readFileSync('public/assets/game/runtime/config/localization.json', 'utf8'));
const beginning = text.indexOf('export const translations:');
const ending = text.indexOf('export function translate(', beginning);
if (beginning < 0 || ending < 0) throw new Error('Could not locate translations dictionary.');
const source = text.slice(beginning, ending);
const arStart = source.indexOf('\n  ar: {');
if (arStart < 0) throw new Error('Could not locate Arabic dictionary.');
const blocks = { en: source.slice(0, arStart), ar: source.slice(arStart) };

const errors = [];
const dictionary = {};
for (const locale of ['en', 'ar']) {
  const found = new Map();
  for (const line of blocks[locale].split('\n')) {
    const match = line.match(/^\s*['"]([^'"]+)['"]:\s*(['"])(.*)\2,?\s*$/);
    if (!match) continue;
    let value = match[3];
    if (value.endsWith(`${match[2]},`)) value = value.slice(0, -2);
    else if (value.endsWith(match[2])) value = value.slice(0, -1);
    const key = match[1];
    if (found.has(key)) errors.push(`${locale}: duplicate key ${key}`);
    found.set(key, value);
  }
  dictionary[locale] = found;
  for (const [key, runtimeValue] of Object.entries(runtime[locale] ?? {})) {
    if (!found.has(key)) errors.push(`${locale}: runtime key has no typed translation ${key}`);
    else if (found.get(key) !== runtimeValue) errors.push(`${locale}: runtime value differs from typed fallback for ${key}`);
  }
}
const placeholders = (template) => [...template.matchAll(/\{\{?([\w]+)\}\}?/g)].map(m => m[1]).sort().join('|');
for (const key of Object.keys(runtime.en ?? {})) {
  if (!Object.hasOwn(runtime.ar ?? {}, key)) continue;
  if (placeholders(runtime.en[key]) !== placeholders(runtime.ar[key])) {
    errors.push(`Parameter mismatch between en and ar in ${key}`);
  }
}
// Full scoreboard always requests `count`, not the obsolete `rounds` argument.
for (const locale of ['en', 'ar']) {
  if (!runtime[locale]['gameplay.score.finalRounds']?.includes('{{count}}')) {
    errors.push(`${locale}: final rounds must use {{count}}`);
  }
}
if (!text.includes('replaceAll(`{${paramKey}}`, paramValue)')) {
  errors.push('Translation formatter must support legacy single-brace {name} parameters.');
}
if (errors.length) {
  console.error('Localization contract failed:\n' + errors.map(x => `  - ${x}`).join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Localization contract PASS — ${dictionary.en.size} en / ${dictionary.ar.size} ar typed keys; ${Object.keys(runtime.en).length} / ${Object.keys(runtime.ar).length} synchronized runtime values.`);
}
