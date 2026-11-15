import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const read = p => fs.readFileSync(path.join(process.cwd(),p),'utf8');
const view=read('src/ui-react/components/gameplay/shared/MiniGameIntroDemonstration.tsx');
const modern=read('src/ui-react/components/gameplay/shared/AllGamesTwoPageIntro.tsx');
const overlay=read('src/ui-react/components/gameplay/GameplayOverlay.tsx');
const registry=read('src/game-core/minigames/minigame-registry.ts');
const translations=read('src/game-core/localization/translations.ts');
const ids=['food-origin','shape-count','maze-gates','count-the-beat','lucky-cup','guess-movie','guess-star','memory-count','couple-or-siblings'];
for(const id of ids){
 assert.ok(registry.includes(`id: '${id}'`),`Missing ${id} in registry`);
 if(id!=='food-origin') assert.ok(modern.includes(`'${id}': {`),`Missing current two-page lesson ${id}`);
}
assert.match(view,/props\.gameId === 'food-origin'\s*\? <FoodOriginTwoPageIntro/);
assert.match(view,/<AllGamesTwoPageIntro gameId=\{props\.gameId\}/);
assert.match(overlay,/<MiniGameIntroDemonstration/);
assert.match(view,/ArrowLeft.*ArrowRight|ArrowRight.*ArrowLeft/);
assert.match(modern,/ArrowLeft.*ArrowRight|ArrowRight.*ArrowLeft/);
assert.match(view,/Math\.max\(0, Math\.min\(1,/);
assert.match(modern,/Math\.min\(1,Math\.max\(0,/);
assert.match(view,/<MediaCard/);
assert.match(view,/<ChoiceCard/);
assert.match(modern,/<ChoiceCard/);
assert.match(modern,/<BeatIcon/);
assert.match(modern,/second \? MEDIA\.face : MEDIA\.eyes/);
assert.doesNotMatch(view,/const WALKTHROUGHS|function LegacyWalkthrough|howto-v69-stage/,'Do not reintroduce removed duplicate tutorials');
assert.match(translations,/['"]tutorial\.twoPage\.shape\.count\.question['"]/);
for(const file of ['HowTo/stage-quote.webp','visual-guess/Stars/Eyes/uploaded-01.jpg','visual-guess/Stars/Full/uploaded-01.jpg','food-origin/photos/carbonara_italy.jpg']) {
 const p=path.join(process.cwd(),'public/assets/game/runtime/minigames',file);
 assert.ok(fs.statSync(p).size>1000,`Missing local media: ${file}`);
}
console.log('[V68 legacy target] PASS: real shared two-page tutorials, local media, keyboard navigation, translation keys, no duplicate retired walkthroughs.');
