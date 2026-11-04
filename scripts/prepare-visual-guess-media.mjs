#!/usr/bin/env node
/** Optional one-time media cache for offline play. Downloads only from the curated Commons list. */
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const root = process.cwd();
const bank = JSON.parse(await readFile(path.join(root, 'src/game-core/minigames/visual-guess/visual-guess-questions.json'), 'utf8'));
const output = path.join(root, 'public/assets/game/runtime/minigames/visual-guess');
await mkdir(output, { recursive: true });
let ok = 0; const failures = [];
for (const item of [...bank.movies, ...bank.stars]) {
  try {
    const source = new URL(item.imageUrl);
    if (source.protocol !== 'https:' || source.hostname !== 'commons.wikimedia.org' || !source.pathname.startsWith('/wiki/Special:FilePath/')) throw new Error('Untrusted media source');
    const response = await fetch(source, { headers: { 'User-Agent': 'Ta7adyElGeelVisualGuess/0.1 (educational media cache)' }, signal: AbortSignal.timeout(15_000) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    if (!['upload.wikimedia.org','thumb.wikimedia.org','commons.wikimedia.org'].includes(new URL(response.url).hostname)) throw new Error('Unexpected redirect host');
    const kind = response.headers.get('content-type') ?? '';
    if (!kind.startsWith('image/jpeg')) throw new Error(`Expected JPEG; got ${kind}`);
    const bytes = new Uint8Array(await response.arrayBuffer());
    if (bytes.byteLength > 8_000_000 || bytes.byteLength < 1_000 || bytes[0] !== 0xff || bytes[1] !== 0xd8) throw new Error('Invalid or oversized JPEG');
    await writeFile(path.join(output, `${item.id}.jpg`), bytes);
    console.log(`[OK] ${item.id}`); ok++;
  } catch (error) { failures.push({id:item.id, error:String(error)}); console.error(`[FAIL] ${item.id}: ${error}`); }
}
console.log(`Cached ${ok}/${bank.movies.length + bank.stars.length} images.`);
if (failures.length) process.exitCode = 1;
