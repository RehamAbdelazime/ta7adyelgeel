#!/usr/bin/env node
/** V43: cache only reviewed Commons star portraits, NOT copyrighted film posters or stills.
 * Run on a computer with Internet: npm run visuals:cache
 * Movie photographs are NOT included in the release: import authorized JPEG/PNG files via visuals:import.
 * This command never fabricates missing faces or substitutes unrelated photos.
 */
import { readFile, mkdir, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';
const root = process.cwd();
const bank = JSON.parse(await readFile(path.join(root,'src/game-core/minigames/visual-guess/visual-guess-questions.json'),'utf8'));
const output = path.join(root,'public/assets/game/runtime/minigames/visual-guess');
await mkdir(output,{recursive:true});
let ok=0, skipped=0;const failures=[];
for (const item of bank.stars) {
  try {
    const source = new URL(item.imageUrl);
    if (source.protocol !== 'https:' || source.hostname !== 'commons.wikimedia.org' || !source.pathname.startsWith('/wiki/Special:FilePath/')) throw Error('Untrusted media source');
    if (!/^star-[a-z0-9-]+\.(jpg|jpeg|png)$/i.test(item.asset)) throw Error('Invalid asset filename');
    const target=path.join(output,item.asset);
    try { if ((await stat(target)).size >= 1000) {skipped++; console.log(`[SKIP] ${item.id}`);continue;} } catch {}
    const response=await fetch(source,{headers:{'User-Agent':'Ta7adyElGeel/1.0 (visual media license credits in docs)'},signal:AbortSignal.timeout(24000)});
    if (!response.ok) throw Error(`HTTP ${response.status}`);
    if (!['upload.wikimedia.org','thumb.wikimedia.org','commons.wikimedia.org'].includes(new URL(response.url).hostname)) throw Error('Unexpected redirect host');
    const data=new Uint8Array(await response.arrayBuffer());
    if(data.byteLength > 10000000 || data.byteLength < 1000) throw Error('Media too small or >10MB');
    const isJpeg=data[0]===255 && data[1]===216;
    const isPng=Buffer.from(data.subarray(0,8)).equals(Buffer.from('89504e470d0a1a0a','hex'));
    const suffix=path.extname(item.asset).toLowerCase();
    if (!((suffix==='.jpg'||suffix==='.jpeg')&&isJpeg || suffix==='.png'&&isPng)) throw Error(`Wrong image format for ${suffix}`);
    await writeFile(target,data);
    console.log(`[OK] ${item.id} ${data.byteLength} bytes`);ok++;
  } catch(error){failures.push({id:item.id,error:String(error)});console.error(`[FAIL] ${item.id}: ${error}`);}
}
console.log(`Star portraits: downloaded ${ok}, already cached ${skipped}, failed ${failures.length} / ${bank.stars.length}`);
if(failures.length){console.error('Failed items can fall back to Commons over the Internet, but require a valid connection.');process.exitCode=1;}
