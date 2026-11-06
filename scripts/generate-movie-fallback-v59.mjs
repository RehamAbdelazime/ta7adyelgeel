#!/usr/bin/env node
/**
 * V59: Always bundle a verified fallback for each user-provided movie image.
 * No third-party requests or optional image-processing dependencies. A stored,
 * quality-controlled preview is reused when its original file is unchanged;
 * newly added files are embedded in their original, browser-supported format.
 * Only used if the primary public asset fails to load at runtime.
 */
import { readFile, readdir, writeFile } from 'node:fs/promises';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const mediaDir = path.join(root, 'public', 'assets','game','runtime','minigames','visual-guess');
const output = path.join(root, 'src','game-core','minigames','visual-guess','media-fallbacks.generated.json');
const mimes = { '.jpg': 'image/jpeg', '.jpeg':'image/jpeg', '.png':'image/png', '.webp':'image/webp', '.avif':'image/avif' };
let previous = {};
try { previous = JSON.parse(await readFile(output, 'utf8')).assets ?? {}; } catch { /* first generation */ }
const assets = {};
let reused = 0, embedded = 0;
for (const folder of ['Posters','Frame']) {
  const files = (await readdir(path.join(mediaDir,folder))).sort();
  for (const file of files) {
    const mime = mimes[path.extname(file).toLowerCase()];
    if (!mime) continue;
    const key = `${folder}/${file}`;
    const bytes = await readFile(path.join(mediaDir, folder, file));
    if (!bytes.length) throw new Error(`Movie image is empty: ${key}`);
    const sha256 = crypto.createHash('sha256').update(bytes).digest('hex');
    const old = previous[key];
    const reuse = old?.sha256 === sha256 && /^data:image\/(webp|jpeg|png|avif);base64,/.test(old?.dataUrl ?? '');
    const dataUrl = reuse ? old.dataUrl : `data:${mime};base64,${bytes.toString('base64')}`;
    assets[key] = {sha256, dataUrl};
    if (reuse) reused++; else embedded++;
  }
}
const next = JSON.stringify({schemaVersion:1,assets});
const existing = await readFile(output,'utf8').catch(()=>null);
if (existing !== next) await writeFile(output,next,'utf8');
console.log(`[V59] Movie image fallback: ${Object.keys(assets).length} assets (${reused} reused previews, ${embedded} new originals embedded)`);
