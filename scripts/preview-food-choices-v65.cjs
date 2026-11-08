const ts=require('typescript'),fs=require('fs'),path=require('path');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{fileName:f,compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,f);
const {FOOD_ORIGIN_QUESTIONS}=require('../src/game-core/minigames/food-origin/food-origin-content.ts');
const {buildDynamicFoodOriginChoices}=require('../src/game-core/minigames/food-origin/food-origin-distractors.ts');
for(const target of ['Koshary','Mandi','Moussaka','Tinola','Chakhokhbili','Tajine Zitoune','Carbonara','Fish and Chips','Bibimbap','Batar Da\'an','Pad Thai','Bobotie']) {
 const q=FOOD_ORIGIN_QUESTIONS.find(q=>q.dishName.en===target || q.id.includes(target.toLowerCase()));
 if(!q){console.log('missing',target);continue;}
 console.log(`${q.difficulty.padEnd(6)} | ${q.dishName.ar} → ${q.choices.find(c=>c.countryCode===q.answer).label.ar}`)
 for(const seed of [311,847,2933])console.log('        ',buildDynamicFoodOriginChoices({question:q,allQuestions:FOOD_ORIGIN_QUESTIONS,seed}).map(c=>c.label.ar).join(' | '));
}
