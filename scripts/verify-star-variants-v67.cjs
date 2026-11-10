/** V67 runtime: duplicate portraits remain one possible ANSWER, but photos
 * rotate by person across sessions and preserve the eye/full pairing.
 */
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  fileName: filename, compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
    esModuleInterop: true, resolveJsonModule: true },
}).outputText, filename);
const { getVisualGuessBank, VisualGuessMiniGameService } = require(path.join(root,'src/game-core/minigames/visual-guess/visual-guess-service.ts'));
const { pickStarPhotoVariant, STAR_PHOTO_HISTORY_KEY } = require(path.join(root,'src/game-core/minigames/visual-guess/star-photo-rotation.ts'));
const manifest = JSON.parse(fs.readFileSync(path.join(root,'src/game-core/minigames/visual-guess/star-uploads-v66.json'),'utf8'));
const stars = getVisualGuessBank('guess-star');
const named = manifest.photos.filter(p=>p.name.ar?.trim());
const persons = new Set(named.map(p=>p.personKey));
assert.equal(stars.length, persons.size);
assert(stars.length >= 30, 'File labels should expand the seven old named people');
const multi = stars.filter(item=>item.photoVariants.length>=2);
assert(multi.length>=10, 'Photos of known repeat people should be grouped as alternatives');
for(const star of stars){
  assert.equal(new Set(star.photoVariants.map(v=>v.id)).size,star.photoVariants.length);
  assert.equal(new Set(star.photoVariants.map(v=>v.eyesAsset)).size,star.photoVariants.length);
  assert(star.photoVariants.every(v=>fs.existsSync(path.join(root,'public/assets/game/runtime/minigames/visual-guess/',v.eyesAsset))));
}
const map = new Map(); const storage = {getItem:key=>map.get(key)??null,setItem:(key,val)=>map.set(key,val)};
const random = ()=>0.44;
for(const item of multi){
  const seen=[];
  for(let i=0;i<item.photoVariants.length*4;i++){
    const v=pickStarPhotoVariant(item.personKey,item.photoVariants,random,storage);
    if(i>0)assert.notEqual(v.id,seen[i-1],`${item.personKey}: same image appeared twice consecutively`);
    seen.push(v.id);
  }
  assert.equal(new Set(seen).size,item.photoVariants.length);
  assert.equal(new Set(seen.slice(0,item.photoVariants.length)).size,item.photoVariants.length,`${item.personKey}: used a variant twice before exhausting pack`);
}
assert(JSON.parse(map.get(STAR_PHOTO_HISTORY_KEY)).people);
const alternative=multi.find(item=>item.difficulty==='easy')??multi[0];
const storage2 = {getItem:key=>map.get(key)??null,setItem:(key,val)=>map.set(key,val)};
const next = pickStarPhotoVariant(alternative.personKey,alternative.photoVariants,random,storage2);
assert(alternative.photoVariants.includes(next));
const serviceStore = new Map();const ss={getItem:k=>serviceStore.get(k)??null,setItem:(k,v)=>serviceStore.set(k,v)};
let total=0;
for(let session=0;session<40;session++){
 const game=new VisualGuessMiniGameService('guess-star',ss);game.beginTour();const used=new Set();
 for(let round=1;round<=4;round++){
  game.startRound(round,session*1431+round);
  const intro=game.getSnapshot('ar'),ref=stars.find(s=>s.id===intro.questionId);
  assert(ref);assert(!used.has(ref.id),`Same person repeated in one tour: ${ref.name.ar}`);used.add(ref.id);
  const choices=intro.visualGuess.choices;
  assert.equal(new Set(choices.map(c=>c.value)).size,4,'Two photos of same person must NEVER become duplicate options');
  assert.equal(new Set(choices.map(c=>c.label)).size,4,'Visible names must all be distinct');
  const v=ref.photoVariants.find(x=>intro.visualGuess.imageUrl.endsWith(x.asset));
  assert(v && intro.visualGuess.eyesImageUrl.endsWith(v.eyesAsset),`Eye and full portrait mismatched for ${ref.name.ar}`);
  assert.equal(intro.visualGuess.correctOptionNumber,null,'answer must stay hidden until reveal');
  game.resolveRound();const scored=game.getSnapshot('ar');
  assert.equal(scored.visualGuess.imageUrl,intro.visualGuess.imageUrl);
  assert.equal(scored.visualGuess.eyesImageUrl,intro.visualGuess.eyesImageUrl);
  total++;
 }
}
// Corrupt or denied localStorage must not crash the game.
const broken={getItem:()=>'{not json',setItem:()=>{throw Error('blocked')}};
assert.doesNotThrow(()=>pickStarPhotoVariant(multi[0].personKey,multi[0].photoVariants,random,broken));
console.log(`[V67] PASS: ${stars.length} named people, ${named.length} named photo variants, ${multi.length} repeat people; ${total} real Guess Star rounds, correct pairings and unique answer identities, photo rotation across restarts.`);
