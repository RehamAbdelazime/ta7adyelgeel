#!/usr/bin/env node
/** V60: protect the V57/V59 full local movie library before generators change manifests.
 * This check is intentionally performed BEFORE movie-clues.generated.json gets rewritten.
 * The user can add new assets, but baseline media that were in the shipped version must remain.
 */
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const arg = process.argv.indexOf('--root');
const root = arg >= 0 ? path.resolve(process.argv[arg + 1] ?? '.')
  : path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const folder = path.join(root, 'public','assets','game','runtime','minigames','visual-guess');
const bankPath = path.join(root, 'src','game-core','minigames','visual-guess','visual-guess-questions.json');
const errors = [];
const expected = { Posters: 81, Frame: 8, Quotes: 40 };
const extensions = {
  Posters: new Set(['.jpg','.jpeg','.png','.webp','.avif']),
  Frame: new Set(['.jpg','.jpeg','.png','.webp','.avif']),
  Quotes: new Set(['.txt','.json','.jpg','.jpeg','.png','.webp','.avif'])
};
const counts = {};
const available = {};
for (const [name, minCount] of Object.entries(expected)) {
  const dir = path.join(folder, name);
  const entries = await readdir(dir, { withFileTypes: true }).catch(error => {
    if (error.code === 'ENOENT') {
      errors.push(`Missing directory: ${path.relative(root, dir)} (expected ${minCount} user-owned files)`);
      return [];
    }
    throw error;
  });
  const names = entries.filter(e => e.isFile() && extensions[name].has(path.extname(e.name).toLowerCase())).map(e => e.name);
  counts[name] = names.length;
  available[name] = new Set(names);
  if (names.length < minCount) errors.push(`${name}: found ${names.length} but V59/V60 includes ${minCount}. This is an incomplete or mixed-version install.`);
}
let bank;
try { bank = JSON.parse(await readFile(bankPath, 'utf8')); }
catch (e) { errors.push(`Cannot read movie bank: ${path.relative(root, bankPath)} (${e.code ?? e.message})`); }
if (bank) {
  const films = Array.isArray(bank.movies) ? bank.movies : [];
  if (films.length < 88) errors.push(`Movie catalog is outdated: ${films.length} titles; V59/V60 has 88. Copying only the two scripts cannot repair the catalog.`);
  const missingPosters = films.filter(m => m.asset?.startsWith('Posters/') && !available.Posters.has(path.basename(m.asset)));
  if (missingPosters.length) {
    const example = missingPosters.slice(0,4).map(m => m.asset).join(', ');
    errors.push(`Referenced movie posters missing (${missingPosters.length}): ${example}${missingPosters.length>4?', ...':''}`);
  }
  for (const id of films.filter(m => !m.asset).map(m => m.id)) {
    if (![...available.Frame].some(filename => filename.startsWith(id+'.') || filename.startsWith(id+'__'))) {
      errors.push(`Frame-only movie is missing its scene: ${id}`);
    }
  }
}
console.log(`[V60] Movie media preflight: ${counts.Posters} Posters / ${counts.Frame} Frames / ${counts.Quotes} Quotes / ${bank?.movies?.length ?? '?'} film titles`);
if (errors.length) {
  console.error('\n[V60] STOP: The source folder is incomplete. No new question manifests should be generated.');
  errors.forEach((message, index) => console.error(`  ${index+1}. ${message}`));
  console.error('\n[V60] FIX: Back up your existing project folder. Extract the COMPLETE V60 source ZIP into a CLEAN folder named ta7adyelgeel_source (not on top of the old mixed folder). Preserve any newer personal assets separately. Then run npm install and npm start.');
  console.error(`[V60] Expected root media folder: ${folder}`);
  process.exitCode = 1;
} else {
  console.log('[V60] PASS: media folders, movie references, and catalog are complete.');
}
