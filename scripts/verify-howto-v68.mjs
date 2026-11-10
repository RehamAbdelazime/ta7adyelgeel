import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const root = process.cwd();
const read = p => fs.readFileSync(path.join(root,p),'utf8');
const view = read('src/ui-react/components/gameplay/shared/MiniGameIntroDemonstration.tsx');
const overlay = read('src/ui-react/components/gameplay/GameplayOverlay.tsx');
const css = read('src/ui-react/styles/intro-walkthrough-v68.css');
const main = read('src/ui-react/main.tsx');
const registry = read('src/game-core/minigames/minigame-registry.ts');
const ids = ['food-origin','shape-count','maze-gates','count-the-beat','lucky-cup','guess-movie','guess-star','memory-count','couple-or-siblings'];
for (const id of ids) {
 assert.match(registry,new RegExp(`id: '${id}'`),`Game missing from registry: ${id}`);
 assert.match(view,new RegExp(`'${id}': \\{`),`Missing visual walkthrough: ${id}`);
}
assert.match(overlay,/<MiniGameIntroDemonstration/);
assert.doesNotMatch(overlay,/<MiniGameIntroIllustration/);
assert.match(view,/ArrowRight.*ArrowLeft/);
assert.match(view,/rtl \? event.key === 'ArrowLeft'/);
assert.match(view,/aria-current=\{page === i \? 'step'/);
assert.match(view,/onStart\(\)/);
assert.match(view,/revealed \? FACE : EYES/);
assert.match(view,/howto-v68-marker-reveal/);
assert.match(view,/howto-v68-answer-strip/);
assert.match(main,/intro-walkthrough-v68.css/);
assert.match(css,/howto-v68-layout/);
for (const file of [
 'public/assets/game/runtime/minigames/HowTo/stage-quote.webp',
 'public/assets/game/runtime/minigames/food-origin/photos/carbonara_italy.jpg',
 'public/assets/game/runtime/minigames/visual-guess/Posters/movie-elzoga-13.jpg',
 'public/assets/game/runtime/minigames/visual-guess/Stars/Eyes/uploaded-01.jpg',
 'public/assets/game/runtime/minigames/visual-guess/Stars/Full/uploaded-01.jpg',
 'public/assets/game/runtime/minigames/lucky-cup/cup.png',
 'public/assets/game/runtime/minigames/lucky-cup/ball.png',
]) assert.ok(fs.statSync(path.join(root,file)).size > 1000,`Missing actual local tutorial media: ${file}`);
assert.doesNotMatch(view, /https?:\/\//, 'Walkthrough must use local images only');
console.log('[V68] PASS: 9 navigable bilingual how-to demonstrations, accessible arrows, correct star reveal, real local stage screenshot and game artwork.');
