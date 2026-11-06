#!/usr/bin/env node
/** Validate EXACTLY the user-owned folders used at runtime. No web requests or fake media. */
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const at = process.argv.indexOf('--root');
const root = at >= 0 ? path.resolve(process.argv[at + 1] ?? '.') : path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const media = path.join(root, 'public/assets/game/runtime/minigames/visual-guess');
const bank = JSON.parse(await readFile(path.join(root,'src/game-core/minigames/visual-guess/visual-guess-questions.json'), 'utf8'));
const generated = JSON.parse(await readFile(path.join(root,'src/game-core/minigames/visual-guess/movie-clues.generated.json'), 'utf8'));
const profiles = JSON.parse(await readFile(path.join(root,'src/game-core/minigames/visual-guess/poster-visual-profiles-v50.json'),'utf8')).profiles;
const movies = new Map(bank.movies.map(movie=>[movie.id,movie]));
const errors = [];
const folderFiles = {};
const extTypes={'.jpg':'JPEG','.jpeg':'JPEG','.png':'PNG','.webp':'WEBP','.avif':'AVIF'};
for(const folder of ['Posters','Frame','Quotes']) {
  const entries = await readdir(path.join(media,folder),{withFileTypes:true});
  folderFiles[folder] = entries.filter(entry=>entry.isFile()&&!entry.name.startsWith('.')).map(entry=>entry.name);
}
const isValidBytes = (ext,bytes) => ext==='.jpg'||ext==='.jpeg'
  ? bytes[0]===0xff&&bytes[1]===0xd8&&bytes.at(-1)===0xd9
  : ext==='.png' ? bytes.subarray(0,8).equals(Buffer.from('89504e470d0a1a0a','hex'))
  : ext==='.webp' ? bytes.toString('ascii',0,4)==='RIFF'&&bytes.toString('ascii',8,12)==='WEBP'
  : ext==='.avif' ? bytes.toString('ascii',4,8)==='ftyp'&&bytes.toString('ascii',8,12)==='avif'
  : false;
for (const folder of ['Posters','Frame']) for(const name of folderFiles[folder]) {
  const ext=path.extname(name).toLowerCase();
  if(!extTypes[ext]){errors.push(`Unsupported image: ${folder}/${name}`);continue;}
  const bytes=await readFile(path.join(media,folder,name));
  if(bytes.length<1000||!isValidBytes(ext,bytes))errors.push(`Wrong image format / damaged bytes: ${folder}/${name}. Extension ${ext} must match actual format.`);
  const base=name.slice(0,-ext.length).split('__')[0];
  if(!movies.has(base))errors.push(`Unregistered film ID: ${folder}/${name} — add a film entry with title and 5 plausible distractors.`);
}
for(const m of bank.movies) {
  if(m.asset) {
    if(!m.asset.startsWith('Posters/')) errors.push(`Non-poster asset for ${m.id}: ${m.asset}`);
    if(!folderFiles.Posters.includes(path.basename(m.asset))) errors.push(`Referenced missing poster: ${m.asset}`);
    if(!profiles[m.id])errors.push(`Visual profile missing for: ${m.id}`);
  } else if(!generated.clues.some(c=>c.movieId===m.id)) errors.push(`Frame-only movie has no usable clue: ${m.id}`);
  if(!m.name?.ar||!m.name?.en||!['easy','medium','hard'].includes(m.difficulty))errors.push(`Incomplete film metadata: ${m.id}`);
  if(!Array.isArray(m.distractorIds)||m.distractorIds.length<5||new Set(m.distractorIds).size!==m.distractorIds.length)errors.push(`Need 5 unique plausible distractors: ${m.id}`);
}
for(const name of folderFiles.Posters) {
  const matching = bank.movies.filter(m=>m.asset===`Posters/${name}`);
  if(matching.length!==1) errors.push(`Poster should be linked to exactly one movie: ${name} (linked ${matching.length})`);
}
for(const name of folderFiles.Frame) {
  const matches=generated.clues.filter(c=>c.asset===`Frame/${name}`&&c.kind==='frame');
  if(matches.length!==1)errors.push(`Frame missing from generated question manifest: ${name}`);
}
for(const name of folderFiles.Quotes) {
  const matches=generated.clues.filter(c=>c.id===`quote:${name.slice(0,-path.extname(name).length)}`&&c.kind==='quote');
  if(matches.length!==1)errors.push(`Quote missing from generated question manifest: ${name}`);
}
for(const c of generated.clues) {
  if(!movies.has(c.movieId))errors.push(`Generated clue references unknown film: ${c.id}`);
  if(c.asset && !(await stat(path.join(media,c.asset)).then(s=>s.isFile()&&s.size>0).catch(()=>false)))errors.push(`Generated media path is missing: ${c.asset}`);
  if(c.kind==='quote'&&!c.text&&!c.asset)errors.push(`Quote has no displayable content: ${c.id}`);
}
const posterCount=folderFiles.Posters.length, frameCount=folderFiles.Frame.length, quoteCount=folderFiles.Quotes.length;
console.log(`[V57] ${posterCount} posters + ${frameCount} frames + ${quoteCount} quotes | ${movies.size} playable movies.`);
if(posterCount!==81||frameCount!==8||quoteCount!==40) console.log('[V57] Folder size has changed since the reviewed upload. This is OK if all new items are registered and valid.');
for(const error of errors)console.error(`[V57 ERROR] ${error}`);
if(errors.length){console.error(`[V57] FAIL: ${errors.length} error(s). Fix folder names / formats / movie entries before building.`);process.exitCode=1;}
else console.log('[V57] PASS: every user folder image and quote is registered and resolves to a real bundled file.');
