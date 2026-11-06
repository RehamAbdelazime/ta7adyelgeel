#!/usr/bin/env node
/** V56: Offline media doctor for the Guess the Movie / Guess the Star libraries.
 * Only reads the local project (and optionally repairs a legacy poster move).
 * No downloads, fabricated images or writes to the user's question bank.
 */
import { readFile, stat, copyFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const args = new Set(process.argv.slice(2).filter(arg => arg.startsWith('--')));
const at = process.argv.indexOf('--root');
const root = at >= 0 ? path.resolve(process.argv[at + 1] ?? '.')
  : path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const mediaRoot = path.join('assets', 'game', 'runtime', 'minigames', 'visual-guess');
const publicMedia = path.join(root, 'public', mediaRoot);
const bank = JSON.parse(await readFile(path.join(root, 'src/game-core/minigames/visual-guess/visual-guess-questions.json'), 'utf8'));

const validFile = async filename => {
  try { return (await stat(filename)).isFile() && (await stat(filename)).size > 1000; }
  catch { return false; }
};
const summary = { posters: { available: 0, total: bank.movies.filter(movie => movie.asset?.startsWith('Posters/')).length, missing: [] },
  frames: { available: 0, total: 0, missing: [] }, quotes: { available: 0, total: 0, missing: [] },
  stars: { available: 0, total: bank.stars.length, remoteOnly: [], missing: [] },
  legacyPostersMoved: 0, dist: { checked: false, missing: [] } };

for (const movie of bank.movies.filter(movie => movie.asset?.startsWith('Posters/'))) {
  const rel = movie.asset || `Posters/${movie.id}.jpg`;
  const target = path.join(publicMedia, rel);
  if (!(await validFile(target)) && args.has('--repair-legacy') && rel.startsWith('Posters/')) {
    const legacyPath = path.join(publicMedia, path.basename(rel));
    if (await validFile(legacyPath)) {
      await mkdir(path.dirname(target), {recursive: true});
      await copyFile(legacyPath, target);
      summary.legacyPostersMoved++;
    }
  }
  if (await validFile(target)) summary.posters.available++;
  else summary.posters.missing.push({ id: movie.id, path: path.relative(root, target).replaceAll('\\','/') });
}
for (const star of bank.stars) {
  const rel = star.asset || `${star.id}.jpg`;
  if (await validFile(path.join(publicMedia, rel))) summary.stars.available++;
  else if (star.imageUrl) summary.stars.remoteOnly.push({ id: star.id, file: rel });
  else summary.stars.missing.push({ id: star.id, file: rel });
}

// Frame and quote files are present only if the local manifest references them.
let generated = { clues: [] };
try { generated = JSON.parse(await readFile(path.join(root, 'src/game-core/minigames/visual-guess/movie-clues.generated.json'), 'utf8')); }
catch (error) { if (error.code !== 'ENOENT') throw error; }
for (const clue of generated.clues) {
  const kind = clue.kind === 'frame' ? 'frames' : 'quotes';
  summary[kind].total++;
  const source = clue.asset ? path.join(publicMedia, clue.asset) : null;
  // Text quote contents are baked into the generated manifest; no runtime media URL is required.
  if (!source || await validFile(source)) summary[kind].available++;
  else summary[kind].missing.push(clue.asset);
}

// Vite copies public/ to dist/ on build. A local source can be correct while the
// installed EXE (or an old dist/) still references stale/missing files.
if (args.has('--check-dist')) {
  const distRoot = path.join(root, 'dist', mediaRoot);
  summary.dist.checked = true;
  for (const film of bank.movies.filter(movie => movie.asset?.startsWith('Posters/'))) {
    const rel = film.asset || `Posters/${film.id}.jpg`;
    if (!(await validFile(path.join(distRoot, rel)))) summary.dist.missing.push({ id: film.id, path: rel });
  }
  for (const clue of generated.clues) {
    if (clue.asset && !(await validFile(path.join(distRoot, clue.asset))))
      summary.dist.missing.push({ id: clue.id, path: clue.asset });
  }
  for (const star of bank.stars) {
    const rel = star.asset || `${star.id}.jpg`;
    if (await validFile(path.join(publicMedia, rel)) && !(await validFile(path.join(distRoot, rel))))
      summary.dist.missing.push({ id: star.id, path: rel });
  }
}

console.log(`\n[V56 IMAGE DOCTOR] Project: ${root}`);
console.log(`POSTERS: ${summary.posters.available}/${summary.posters.total} local and ready`);
for (const item of summary.posters.missing) console.error(`  MISSING POSTER: ${item.id}\n    ${item.path}`);
console.log(`FRAMES: ${summary.frames.available}/${summary.frames.total} generated frame files present`);
console.log(`QUOTES: ${summary.quotes.available}/${summary.quotes.total} generated quote files present`);
console.log(`STARS: ${summary.stars.available}/${summary.stars.total} local; ${summary.stars.remoteOnly.length} require internet; ${summary.stars.missing.length} unconfigured`);
for (const item of summary.stars.remoteOnly) console.warn(`  STAR REMOTE ONLY: ${item.id} (expected local ${item.file})`);
for (const item of summary.stars.missing) console.error(`  MISSING STAR: ${item.id} (expected local ${item.file})`);
if (summary.legacyPostersMoved) console.log(`RESTORED ${summary.legacyPostersMoved} legacy posters to Posters/ (old originals kept).`);
if (summary.dist.checked) {
  console.log(`DIST: ${summary.dist.missing.length} referenced images absent from dist/`);
  for (const item of summary.dist.missing) console.error(`  DIST MISSING: ${item.id} (${item.path})`);
  if (summary.dist.missing.length) console.warn('Rebuild with npm run build; an older EXE will NOT see the source folder changes.');
}
if (summary.stars.remoteOnly.length) console.warn('Guess the Star is NOT offline-ready. Supply the approved portrait files or use npm run visuals:cache (network required; check URLs/rights).');
if (summary.posters.missing.length) console.error('Restore Posters/ files from the complete V56 source or the V56 repair patch, then rebuild.');
if (args.has('--json')) console.log(JSON.stringify(summary,null,2));
if (summary.posters.missing.length || summary.frames.missing.length || summary.quotes.missing.length || summary.stars.missing.length
  || (summary.dist.checked && summary.dist.missing.length)
  || (args.has('--strict-offline') && summary.stars.remoteOnly.length)) process.exitCode = 1;
