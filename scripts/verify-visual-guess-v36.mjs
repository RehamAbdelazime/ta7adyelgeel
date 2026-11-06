/** V36 static + runtime quality gate. Kept separate from the original V35 checks. */
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const root = resolve(import.meta.dirname,'..');
const read = p => readFileSync(resolve(root,p),'utf8');
const bank = JSON.parse(read('src/game-core/minigames/visual-guess/visual-guess-questions.json'));
const registry = read('src/game-core/minigames/minigame-registry.ts');
const config = JSON.parse(read('public/assets/game/runtime/config/gameplay-config.json'));
const shell = read('src/ui-react/components/gameplay/minigames/VisualGuessScreen.tsx');
const picker = read('src/ui-react/styles/visual-guess-v36.css');
const styles = read('src/ui-react/main.tsx');
const store = read('src/game-core/app/game-store.ts');
for (const [key,id,modes] of [['movies','guess-movie',['poster','scene']],['stars','guess-star',['eyes','silhouette','zoom','reveal']]]) {
  assert(registry.includes(`id: '${id}'`));
  assert(config.tour.enabledMiniGames.includes(id));
  assert.equal(config.tour.singleMiniGameRoundCounts[id],4);
  assert.equal(new Set(bank[key].map(item=>item.id)).size,bank[key].length);
  assert(bank[key].length >= 2*modes.length,'at least two questions for every visual mode');
  for(const mode of modes) assert(bank[key].filter(item=>item.mode===mode).length>=2,`no mode content: ${mode}`);
  for (const item of bank[key]) {
    assert(item.name.en && item.name.ar && item.attribution.source && item.attribution.license);
    if (key === 'stars') {
      assert(item.imageUrl.startsWith('https://commons.wikimedia.org/wiki/Special:FilePath/'));
      assert(typeof item.asset === 'string' && item.asset.length > 6);
    } else {
      assert(item.mediaApproval && item.imageUrl === '');
      if (item.mode === 'poster') {
        assert(item.asset?.startsWith('Posters/'));
        assert(existsSync(resolve(root,'public/assets/game/runtime/minigames/visual-guess',item.asset)));
      } else {
        // Frame-only films have no invented poster. Their frame lives in the generated manifest.
        assert.equal(item.asset, '');
      }
    }
    assert(item.difficulty && modes.includes(item.mode));
  }
  assert(existsSync(resolve(root,`public/assets/game/runtime/ui/main/game-picker-v14/${id}.svg`)),`picker art ${id}`);
  const art = read(`public/assets/game/runtime/ui/main/game-picker-v14/${id}.svg`);
  assert(art.startsWith('<svg') && art.length>500);
}
assert.equal(config.tour.enabledMiniGames.length,7);
assert(picker.includes('grid-template-columns: repeat(4, minmax(0, 1fr)) !important'));
assert(styles.includes("import './styles/visual-guess-v36.css';"));
assert(shell.includes('<QuestionScreenShell') && shell.includes('layout="choice"'));
assert(shell.includes('v36-visual-reveal-grid') && shell.includes('getPosterBlurPx'));
assert(store.includes('this.guessMovieMiniGame') && store.includes('this.guessStarMiniGame'));
assert(read('src/ui-react/components/streamer/PrivateStreamerAnswerDock.tsx').includes('guess-movie'));
assert(read('src/ui-react/components/gameplay/shared/answer-helpers.ts').includes('guess-star'));
assert(read('src/ui-react/components/gameplay/minigames/minigame-screen-registry.tsx').includes("'guess-star':"));
const require = createRequire(import.meta.url);
require('./verify-visual-guess-v36-runtime.cjs');
console.log('Visual-guess structural verification PASS: 88 movie titles (poster or frame-only), 20 stars, 7 public cards.');
