import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require=createRequire(import.meta.url);
const ts=require('typescript');
const read=f=>fs.readFileSync(path.join(process.cwd(),f),'utf8');
const intro=read('src/ui-react/components/gameplay/shared/MiniGameIntroDemonstration.tsx');
const overlay=read('src/ui-react/components/gameplay/GameplayOverlay.tsx');
const food=read('src/ui-react/components/gameplay/minigames/FoodOriginScreen.tsx');
const hint=read('src/ui-react/components/gameplay/minigames/FoodOriginHintPill.tsx');
const styles=read('src/ui-react/styles/intro-walkthrough-v68.css');
const foodService=read('src/game-core/minigames/food-origin/food-origin-service.ts');
const policy=read('src/game-core/minigames/scoring-policy.ts');
assert.match(overlay,/<h2>\{locale === 'ar' \? 'طريقة اللعب' : 'HOW TO PLAY'\}<\/h2>/,'All games must show ONLY How-to-Play as the header');
assert.match(intro,/props\.gameId === 'food-origin'\s*\? <FoodOriginTwoPageIntro/,'Food Origin must route to the focused walkthrough');
assert.match(intro,/const hintShown = page === 1/,'Food Origin must use exactly 2 pages');
assert.match(intro,/Math\.max\(0, Math\.min\(1, current/,'Keyboard navigation must clamp to 2 pages');
assert.match(intro,/>\{page \+ 1\} \/ 2<\/span>/,'Correct two-page indicator');
assert.match(intro,/<MediaCard imageUrl=\{FOOD\}/,'Same real MediaCard must render image');
assert.match(intro,/<ChoiceCard key=\{name\}/,'Same real ChoiceCard must render answers');
assert.match(intro,/<FoodOriginHintPill label=\{hintLabel\} revealed=\{hintShown\}/,'Same live hint component must render demo');
assert.match(food,/<FoodOriginHintPill label=\{dishHintLabel\} revealed=\{isDishHintVisible\}/,'Live FoodOriginScreen must also use shared hint');
assert.match(hint,/className="gameplay-food-hint-slot"/);
assert.match(hint,/gameplay-dish-hint-revealed/);
assert.match(hint,/gameplay-dish-hint-countdown/);
assert.match(intro,/تلميح بعد 9 ث/,'Pre-hint countdown must match live localized format');
assert.match(intro,/كاربونارا/,'Post-hint content must be the dish name only');
assert.doesNotMatch(intro.match(/function FoodOriginTwoPageIntro[\s\S]+$/)?.[0] ?? '',/howto-v70-food-hint|howto-v70-guide-card|howto-v70-food-timer|howto-v69-success/,'No fake extra reveal UI in new tutorial');
for(const phrase of ['اكتب في الشات','!1','جاوب قبل ما الوقت','بعد نص الوقت','نص النقاط','نقاط كاملة']) assert.ok(intro.includes(phrase),`Missing essential explanation: ${phrase}`);
for(const cls of ['howto-v71-main','howto-v71-guide','howto-v71-preview','howto-v71-media','howto-v71-score','howto-v71-chat-input','howto-v71-footer']) assert.ok(intro.includes(cls)&&styles.includes(cls),`Missing style ${cls}`);
assert.match(policy,/FOOD_ORIGIN_HINT_SCORE_MULTIPLIER\s*=\s*0\.5\b/);
assert.match(foodService,/revealDelayRatio:\s*0\.5\b/);
for(const file of ['public/assets/game/runtime/minigames/HowTo/stage-quote.webp','public/assets/game/runtime/minigames/food-origin/photos/carbonara_italy.jpg']) assert.ok(fs.statSync(file).size>1000,`Missing local art ${file}`);
for(const f of [
  'src/ui-react/components/gameplay/shared/MiniGameIntroDemonstration.tsx',
  'src/ui-react/components/gameplay/minigames/FoodOriginScreen.tsx',
  'src/ui-react/components/gameplay/minigames/FoodOriginHintPill.tsx',
  'src/ui-react/components/gameplay/GameplayOverlay.tsx',
]){
  const result=ts.transpileModule(read(f),{fileName:f,reportDiagnostics:true,compilerOptions:{module:ts.ModuleKind.ESNext,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022}});
  assert.equal(result.diagnostics.length,0,`${f} TS syntax diagnostics: ${result.diagnostics.map(x=>ts.flattenDiagnosticMessageText(x.messageText,' ')).join('; ')}`);
}
console.log('[V71] PASS: title only, 2 pages, shared live MediaCard/ChoiceCard/hint UI, !1 chat demonstration, real yellow pill before/after halfway, half-score, local assets, TSX syntax.');
