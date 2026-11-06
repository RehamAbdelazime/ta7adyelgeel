#!/usr/bin/env node
/** Verify that a freshly built renderer ACTUALLY includes every local movie image.
 * This catches the source-has-images / dist-is-stale bug before `npm start`.
 */
import { readFile, stat } from 'node:fs/promises';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const base = 'assets/game/runtime/minigames/visual-guess';
const fallback = JSON.parse(await readFile(path.join(root,'src/game-core/minigames/visual-guess/media-fallbacks.generated.json'),'utf8'));
const bank = JSON.parse(await readFile(path.join(root,'src/game-core/minigames/visual-guess/visual-guess-questions.json'),'utf8'));
const extra = JSON.parse(await readFile(path.join(root,'src/game-core/minigames/visual-guess/movie-clues.generated.json'),'utf8'));
const files = new Set([
  ...bank.movies.map(m=>m.asset).filter(Boolean),
  ...extra.clues.map(c=>c.asset).filter(Boolean)
]);
const errors = [];
const hashes = contents => crypto.createHash('sha256').update(contents).digest('hex');
const dist = path.join(root,'dist');
const sourceOnly = process.argv.includes('--source-only');
const indexExists = await stat(path.join(dist, 'index.html')).then(x=>x.isFile()).catch(()=>false);
if (!sourceOnly && !indexExists) errors.push('dist/index.html is absent. Run npm run build to rebuild the renderer.');
for (const asset of files) {
  if (!/^(Posters|Frame)\/[\w.-]+\.(jpg|jpeg|png|webp|avif)$/i.test(asset)) { errors.push(`Unsafe/invalid asset path: ${asset}`); continue; }
  const source = path.join(root,'public',base,asset);
  const shipped = path.join(dist,base,asset);
  const sourceBytes = await readFile(source).catch(()=>null);
  const packagedBytes = await readFile(shipped).catch(()=>null);
  if (!sourceBytes) errors.push(`MISSING SOURCE: ${asset}`);
  if (!sourceOnly && !packagedBytes) errors.push(`NOT IN DIST: ${asset}`);
  if (!sourceOnly && sourceBytes && packagedBytes && hashes(sourceBytes)!==hashes(packagedBytes)) errors.push(`OUTDATED DIST IMAGE: ${asset}`);
  const item = fallback.assets?.[asset];
  if (!item || !sourceBytes || item.sha256!==hashes(sourceBytes) || !/^data:image\/(webp|jpeg|png|avif);base64,/.test(item.dataUrl)) errors.push(`Fallback missing/stale: ${asset}`);
}
if (Object.keys(fallback.assets??{}).length !== files.size) errors.push(`Fallback bank count mismatch: ${Object.keys(fallback.assets??{}).length} vs ${files.size} used images`);
console.log(`[V59] ${files.size} referenced movie images checked against ${sourceOnly ? 'source' : 'dist/'} and embedded fallback bank.`);
for (const e of errors) console.error(`[V59 ERROR] ${e}`);
if (errors.length) { console.error(`[V59] FAIL: stale/missing renderer assets. Build not safe to launch.`); process.exitCode=1; }
else console.log('[V59] PASS: every movie image is present, up-to-date, and has an offline fallback.');
