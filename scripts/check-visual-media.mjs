/** Visual pack inspection: questions are only ready OFFLINE when real photo bytes exist. */
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
const bank = JSON.parse(await readFile('src/game-core/minigames/visual-guess/visual-guess-questions.json','utf8'));
const root = 'public/assets/game/runtime/minigames/visual-guess';
let offline=0, remote=0, missing=0, approved=0;
for (const [category, items] of [['movie',bank.movies],['star',bank.stars]]) {
  for(const item of items) {
    let local=false;
    try { const f=await stat(path.join(root,item.asset)); local=f.size>1000; } catch {}
    const label=local?'OFFLINE':item.imageUrl?'REMOTE ONLY':'MISSING';
    if(local)offline++;else if(item.imageUrl)remote++;else missing++;
    if(item.mediaApproval==='user_supplied_with_permission'||item.mediaApproval==='commons_license_reviewed_per_file')approved++;
    console.log(`${label.padEnd(11)} ${category.padEnd(6)} ${item.id.padEnd(32)} ${(item.mediaApproval||'').padEnd(33)} ${item.mode}`);
  }
}
console.log(`\nOFFLINE ${offline}; REMOTE ONLY ${remote}; MISSING ${missing}; SOURCE-LICENSE REVIEWED/USER-SUPPLIED ${approved}`);
console.log('Movie press stills/posters linked from third-party publishers are NOT automatically licensed for redistribution or Twitch broadcasting.');
if(missing)process.exitCode=1;
