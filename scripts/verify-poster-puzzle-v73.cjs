/** V73: catalog-wide printable-title safety + only-puzzle replay verification. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
require.extensions['.ts'] = (mod, filename) => {
  const out = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module:ts.ModuleKind.CommonJS, target:ts.ScriptTarget.ES2022,
      esModuleInterop:true, resolveJsonModule:true },fileName:filename,
  }).outputText;
  mod._compile(out, filename);
};
const { isTitleTile, tileRevealOrder, PUZZLE_TOTAL, visibleSafeTiles, initialPuzzleRegions } =
  require('../src/game-core/minigames/visual-guess/poster-puzzle.ts');
const { availablePosterModes,planPosterReveal } = require('../src/game-core/minigames/visual-guess/poster-mystery.ts');
const { getPosterRevealProgress } = require('../src/ui-react/components/gameplay/minigames/poster-reveal-curve.ts');
const bank = require('../src/game-core/minigames/visual-guess/visual-guess-questions.json');
const posters = bank.movies.filter(x => x.asset?.startsWith('Posters/'));
assert.equal(posters.length,81);
const levels = ['easy','medium','hard'];
let samples=0;
for(const item of posters) {
  assert(item.titleMasks?.length >=1, item.id+': no title coordinates');
  for(const b of item.titleMasks) {
    assert([b.x,b.y,b.w,b.h].every(Number.isFinite), item.id);
    assert(b.x >= 0 && b.y >=0 && b.w>0 && b.h>0 && b.x+b.w<=101 && b.y+b.h<=101,item.id);
  }
  const base=path.join(root,'public/assets/game/runtime/minigames/visual-guess',item.asset);
  assert(fs.existsSync(base),item.asset);
  for(const diff of levels) {
    assert.deepEqual(availablePosterModes(diff),['puzzle']);
    const plans=[planPosterReveal(diff,1231,undefined,{x:50,y:40},item.titleMasks),
      planPosterReveal(diff,81909,{plays:1,lastPattern:1231,lastMode:'puzzle'}, {x:50,y:40}, item.titleMasks)];
    for(const plan of plans) {
      assert.equal(plan.mode,'puzzle');
      const openOrder=tileRevealOrder(plan.pattern,item.titleMasks);
      assert(openOrder.length>0,item.id+': title area covers entire poster');
      assert(openOrder.length<PUZZLE_TOTAL,item.id+': no title cells blocked');
      assert(openOrder.every(i=>!isTitleTile(i,item.titleMasks)),item.id);
      assert.equal(new Set(openOrder).size,openOrder.length);
      assert.deepEqual(plan.initialRegions,initialPuzzleRegions(plan.pattern,item.titleMasks,diff));
      for(const p of [0,.05,.25,.5,.75,1]) {
        const n=visibleSafeTiles(p,diff,openOrder.length);
        const open=new Set(openOrder.slice(0,n));
        assert(open.size<=openOrder.length);
        for(let i=0;i<PUZZLE_TOTAL;i++) {
          if(isTitleTile(i,item.titleMasks)) assert(!open.has(i),item.id+': printed title exposed');
        }
        samples++;
      }
    }
    assert.notEqual(plans[0].pattern,plans[1].pattern);
  }
}
const screen = fs.readFileSync(path.join(root,'src/ui-react/components/gameplay/minigames/VisualGuessScreen.tsx'),'utf8');
const howto = fs.readFileSync(path.join(root,'src/ui-react/components/gameplay/shared/AllGamesTwoPageIntro.tsx'),'utf8');
const maskComponent = fs.readFileSync(path.join(root,'src/ui-react/components/gameplay/minigames/PosterPuzzleOverlay.tsx'),'utf8');
assert(screen.includes('<PosterPuzzleOverlay') && howto.includes('<PosterPuzzleOverlay'));
assert(screen.includes('isPoster ? { objectPosition:') && screen.includes("filter: 'none'"));
assert(maskComponent.includes('isTitleTile') && maskComponent.includes('visibleSafeTiles'));
assert(!screen.includes("posterMode === 'zoom'") && !screen.includes("posterMode === 'blur'"));
assert(howto.includes('samplePosterMasks'));
assert(!howto.includes('البوستر بيظهر كامل في آخر ثانية'));
assert.equal(getPosterRevealProgress(20_000,1000,'hard'),1);
console.log(`V73 PASS: ${posters.length} posters with title zones, ${samples} covered/clear difficulty-replay states; puzzle-only live + tutorial; no title even at result.`);
