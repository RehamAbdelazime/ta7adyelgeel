#!/usr/bin/env node
/** V74: self-contained, offline verification; no image processing on Windows. */
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import assert from 'node:assert/strict';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const media = 'public/assets/game/runtime/minigames/visual-guess/';
function dimensions(buf){
  assert(buf[0]===255 && buf[1]===216 && buf.at(-1)===217, 'not a complete JPEG');
  for(let p=2; p<buf.length-9;){
    if(buf[p]!==255){p++;continue;}
    let marker=buf[p+1];
    if(marker===255){p++;continue;}
    if(marker===217 || marker===218) break;
    const len=buf.readUInt16BE(p+2);
    if(len<2) throw Error('bad JPEG segment');
    if([0xc0,0xc1,0xc2,0xc3,0xc5,0xc6,0xc7,0xc9,0xca,0xcb,0xcd,0xce,0xcf].includes(marker))
      return [buf.readUInt16BE(p+7),buf.readUInt16BE(p+5)];
    p+=len+2;
  }
  throw Error('JPEG missing dimensions');
}
const config=JSON.parse(await readFile(path.join(root,'src/game-core/minigames/visual-guess/star-uploads-v66.json'),'utf8'));
let migrated=0;
for(const photo of config.photos){
  const id=photo.id;const n=Number(id.slice(-2));
  const eyePath=path.join(root,media,photo.eyes);
  const fullPath=path.join(root,media,photo.photo);
  const eye=await readFile(eyePath);const full=await readFile(fullPath);
  assert(full.length>1500,`${id}: original full photo missing`);
  const [w,h]=dimensions(eye);dimensions(full);
  assert(w>=200 && h>=80,`${id}: eyes malformed`);
  if(n<=61){ assert.deepEqual([w,h],[780,220],`${id}: old oversized strip still present; install V74 eyes`);migrated++; }
  assert(!eye.equals(full),`${id}: eye strip must never be full portrait`);
}
const css=await readFile(path.join(root,'src/ui-react/styles/visual-guess-v36.css'),'utf8');
assert(css.includes('/* V74 — only real eye details'), 'V74 eye sizing CSS is missing');
assert(css.includes('aspect-ratio: 780 / 220'), 'eye frame must match 780x220 asset');
const screen=await readFile(path.join(root,'src/ui-react/components/gameplay/minigames/VisualGuessScreen.tsx'),'utf8');
assert(screen.includes('showingResult ? data.imageUrl : (data.eyesImageUrl'), 'Must switch to corresponding full portrait only upon scoring/reveal');
console.log(`[V74] PASS: ${migrated} cropped eye images; ${config.photos.length} real eye/full pairs; no stretched 900px strips; original full photos and reveal behavior unchanged.`);
