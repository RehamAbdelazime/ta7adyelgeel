/** V65 media, answer safety, replay variety & Egyptian audience plausibility audit. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
require.extensions['.ts'] = (mod, filename) => mod._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'), {
  fileName: filename, compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop:true},
}).outputText, filename);
const { FOOD_ORIGIN_QUESTIONS } = require(path.join(root,'src/game-core/minigames/food-origin/food-origin-content.ts'));
const { buildDynamicFoodOriginChoices } = require(path.join(root,'src/game-core/minigames/food-origin/food-origin-distractors.ts'));
const { FoodOriginMiniGameService } = require(path.join(root,'src/game-core/minigames/food-origin/food-origin-service.ts'));
const { FOOD_COUNTRY_PROFILES } = require(path.join(root,'src/game-core/minigames/food-origin/food-origin-country-data.generated.ts'));
const audit=JSON.parse(fs.readFileSync(path.join(root,'docs/V65_FOOD_IMAGE_AUDIT.json'),'utf8'));
const review=new Set(FOOD_ORIGIN_QUESTIONS.filter(q => /shakshuka_libya|makboos_yemen|zelnik_north_macedonia/.test(q.id)).map(q=>q.id));
const playable=FOOD_ORIGIN_QUESTIONS.filter(q=>!review.has(q.id));
assert.equal(audit.uploaded_image_files,186);
assert.equal(audit.playable_uploaded_images,104);
assert.equal(audit.review_images,83);
assert.equal(audit.new_questions,93);
assert.equal(playable.length,104);
assert.equal(new Set(playable.map(q=>q.id)).size,104);
assert.equal(audit.audit.length,187);
assert.equal(audit.audit.filter(x=>x.status==='PLAYABLE').length,104);
assert.equal(audit.audit.filter(x=>x.status==='REVIEW').length,83);
const counts = {easy:0,medium:0,hard:0};
let samples=0, differentSets=0, comparisons=0;
const poolLabels = new Set();
for (const question of playable) {
  counts[question.difficulty]++;
  assert(question.dishName.ar && question.dishName.en,question.id);
  assert(question.imageUrl.startsWith('/assets/game/runtime/minigames/food-origin/photos/'),question.id);
  const filepath=path.join(root,'public',question.imageUrl.slice(1));
  assert(fs.existsSync(filepath),`missing photo ${question.id} ${filepath}`);
  assert(fs.statSync(filepath).size>8000,`tiny/corrupt photo ${question.id}`);
  const expected=question.choices.find(c=>c.countryCode===question.answer);
  assert(expected,`no correct country label for ${question.id}`);
  assert(expected.label.ar && expected.label.en);
  // No credit for a country spoiled by its own country name in the halfway hint.
  assert(!question.dishName.ar.includes(expected.label.ar),`hint leaks answer ${question.id}`);
  const seen = new Set();
  for(let repeat=1;repeat<=24;repeat++) {
    const choices=buildDynamicFoodOriginChoices({question,allQuestions:playable,seed:repeat*91337+147});
    assert.equal(choices.length,4,`${question.id}: not 4 options`);
    assert.equal(new Set(choices.map(x=>x.countryCode)).size,4,`${question.id}: duplicated option`);
    assert.equal(choices.filter(x=>x.countryCode===question.answer).length,1,`${question.id}: truth lost`);
    for(const choice of choices) {
      assert(choice.label.ar && choice.label.en && !/^[A-Z]{2}$/.test(choice.label.ar),`${question.id}: missing localized country`);
      poolLabels.add(choice.countryCode);
    }
    seen.add(choices.filter(x=>x.countryCode!==question.answer).map(x=>x.countryCode).sort().join(','));
    samples++;
    if (question.id.startsWith('food_new_')) {
      const nearCountries = new Set(question.distractorNearCodes);
      const nearCount=choices.filter(x=>x.countryCode!==question.answer && nearCountries.has(x.countryCode)).length;
      assert.equal(nearCount,question.difficulty==='easy'?1:question.difficulty==='medium'?2:3,`${question.id}: difficulty-aware near choice count expected`);
      comparisons++;
    }
  }
  if(seen.size>=6) differentSets++;
}
assert(differentSets>=95,`too many repeated fixed distractor groups: ${differentSets}/104`);
const storageValues = new Map();
const storage = {getItem:k=>storageValues.get(k)??null,setItem:(k,v)=>storageValues.set(k,v)};
const recent=[];
for(let j=0;j<200;j++) {
 const svc=new FoodOriginMiniGameService(storage);svc.beginTour();
 for(let r=1;r<=3;r++) {
  svc.startRound(r);
  const snap=svc.getSnapshot('ar');
  assert.equal(snap.questionDifficulty,['easy','medium','hard'][r-1]);
  assert.equal(snap.foodOrigin.choices.length,4);
  recent.push(snap.questionId);
 }
}
assert(new Set(recent).size>=100,`History should actually surface the enlarged catalog, saw ${new Set(recent).size}`);
assert(counts.easy>=10 && counts.medium>=20 && counts.hard>=40,JSON.stringify(counts));
const photoFolder=path.join(root,'public/assets/game/runtime/minigames/food-origin/photos');
assert.equal(fs.readdirSync(photoFolder).filter(x=>/\.(jpg|jpeg|webp|png)$/.test(x)).length,108);
console.log(`[V65] PASS: ${playable.length} fair food questions ${JSON.stringify(counts)}, 108 local photos, 83 review-held uploaded files, ${samples} valid 4-choice rolls, ${comparisons} strict difficulty checks, ${differentSets} /104 fresh option sets, ${new Set(recent).size} dishes across 600 rounds.`);
