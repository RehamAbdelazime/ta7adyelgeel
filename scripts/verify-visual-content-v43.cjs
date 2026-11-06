/** V49 supersedes the old V44 30 remote movie clues: all 50 local user posters. */
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const bank = JSON.parse(fs.readFileSync(path.join(root, 'src/game-core/minigames/visual-guess/visual-guess-questions.json'), 'utf8'));
assert.equal(bank.movies.length, 88);
const posters = bank.movies.filter(item => item.asset?.startsWith('Posters/'));
assert.equal(posters.length, 81);
assert.equal(bank.stars.length, 20);
const ids = new Set(bank.movies.map(item => item.id));
assert.equal(ids.size, bank.movies.length);
const artwork = path.join(root, 'public/assets/game/runtime/minigames/visual-guess');
for (const item of posters) {
  assert.equal(item.mode, 'poster');
  assert.equal(item.imageUrl, '', 'Movie poster must never use internet fallback');
  assert.equal(item.mediaApproval, 'user_supplied_local_rights_unverified');
  assert(fs.statSync(path.join(artwork, item.asset)).size > 1500, `Missing local poster ${item.id}`);
  assert(Number.isFinite(item.posterAspectRatio) && item.posterAspectRatio > .4);
  assert(Array.isArray(item.titleMasks) || !item.titleMasks, `Invalid optional masks ${item.id}`);
  for (const mask of item.titleMasks ?? []) {
    assert(mask.w > 0 && mask.h > 0 && mask.x >= 0 && mask.y >= 0);
    assert(mask.x + mask.w <= 100 && mask.y + mask.h <= 100);
  }
  assert(item.distractorIds?.length >= 5, `Insufficient curated film neighbors ${item.id}`);
  for (const id of item.distractorIds) {
    assert(ids.has(id) || bank.movieChoiceCatalog[id], `Unknown local/extra film title ${id}`);
    assert.notEqual(id, item.id);
  }
}
for (const frameOnly of bank.movies.filter(item => !item.asset)) {
  assert.equal(frameOnly.mode, 'scene');
  assert.equal(frameOnly.imageUrl, '');
  assert(frameOnly.distractorIds.length >= 5);
}
for (const diff of ['easy','medium','hard']) assert(bank.movies.some(item => item.difficulty === diff));
for (const item of bank.stars) {
  assert(item.imageUrl.startsWith('https://commons.wikimedia.org/wiki/Special:FilePath/'));
  assert(item.attribution.source.startsWith('https://commons.wikimedia.org/wiki/File:'));
  assert(item.asset && !item.asset.endsWith('.svg'));
  assert(Number.isFinite(item.focus.x) && Number.isFinite(item.focus.y));
}
assert.equal(fs.readdirSync(artwork).filter(name => /^movie-.*\.svg$/.test(name)).length, 0);
const ts = require('typescript');
require.extensions['.ts'] = (module, file) => module._compile(ts.transpileModule(fs.readFileSync(file, 'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true,resolveJsonModule:true},fileName:file}).outputText, file);
const {VisualGuessMiniGameService} = require(path.join(root,'src/game-core/minigames/visual-guess/visual-guess-service.ts'));
const modeSchedule = {'guess-movie':['poster','poster','poster','poster'], 'guess-star':['eyes','silhouette','zoom','reveal']};
for (const id of Object.keys(modeSchedule)) {
  for(let seed = 0; seed < 45; seed++) {
    const svc = new VisualGuessMiniGameService(id);
    svc.beginTour();
    const seen = new Set();
    for(let round = 1; round <= 4; round++) {
      svc.startRound(round,seed*47+100);
      const snap = svc.getSnapshot('ar');
      if(id==='guess-movie') assert(['poster','scene'].includes(snap.visualGuess.mode));
      else assert.equal(snap.visualGuess.mode, modeSchedule[id][round-1]);
      assert.equal(snap.questionDifficulty, ['easy','medium','hard','hard'][round-1]);
      assert(!seen.has(snap.questionId)); seen.add(snap.questionId);
      assert.equal(snap.visualGuess.correctOptionNumber,null);
      assert.equal(snap.visualGuess.choices.length,4);
    }
  }
}
console.log(`V49 user-poster media + content regression PASS: 81/81 local movie posters + 7 frame-only titles, 20 Commons stars, 90 seeded tours.`);
