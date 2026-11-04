#!/usr/bin/env node
/** Import a REAL photo supplied by the rights-holder/user into the offline game.
 * Example: npm run visuals:import -- movie-el-nazer "D:/film/scene.jpg" "Studio / photographer" "permission reference"
 * No generated stand-ins; pass attribution and license/permission proof yourself.
 */
import { readFile, writeFile, copyFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
const [id, source, credit, license] = process.argv.slice(2);
if (!id || !source || !credit || !license) {
  console.error('Usage: npm run visuals:import -- movie-id path/to/real-photo.jpg "Source/credit" "License or permission reference"');
  process.exit(2);
}
const bankFile=path.resolve('src/game-core/minigames/visual-guess/visual-guess-questions.json');
const bank=JSON.parse(await readFile(bankFile,'utf8'));
const item=[...bank.movies,...bank.stars].find(item=>item.id===id);
if (!item) { console.error('Unknown question id:',id);process.exit(2); }
const bytes=await readFile(path.resolve(source));
const jpg=bytes[0]===0xff&&bytes[1]===0xd8;
const png=bytes.subarray(0,8).equals(Buffer.from('89504e470d0a1a0a','hex'));
if ((!jpg&&!png) || bytes.length<1200 || bytes.length>12000000) {console.error('Only actual JPEG/PNG image data 1.2KB–12MB is supported.');process.exit(2);}
const destDir=path.resolve('public/assets/game/runtime/minigames/visual-guess');
await mkdir(destDir,{recursive:true});
const destName=`${id}.${jpg?'jpg':'png'}`;
await copyFile(path.resolve(source),path.join(destDir,destName));
item.asset=destName;
// Retain previous source URLs for provenance, but the local authorized file wins.
item.attribution={source:credit,license};
item.mediaApproval='user_supplied_with_permission';
item.mediaType='real_photo_user_authorized';
await writeFile(bankFile,JSON.stringify(bank,null,2)+'\n');
console.log(`OK ${id}: ${destName}; original photo saved. Copyright permission supplied by user, not independently verified.`);
