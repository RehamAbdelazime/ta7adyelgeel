/** V44 supersedes V43's drawn-art contract. Preserve 30/20 question records,
 * but NEVER accept synthesized movie clues; require an actual film media source
 * for every playable candidate. Copyright approval is tracked separately. */
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const bank = JSON.parse(fs.readFileSync(path.join(root, 'src/game-core/minigames/visual-guess/visual-guess-questions.json'), 'utf8'));
assert.equal(bank.movies.length, 30);
assert.equal(bank.stars.length, 20);
const playable = bank.movies.filter(item => Boolean(item.imageUrl));
assert(playable.length >= 12, 'real film image candidates missing');
assert(bank.movies.every(item => !item.asset.endsWith('.svg') && item.mediaApproval && item.attribution.source));
assert(bank.movies.some(item => item.mediaApproval === 'missing_authorized_still'), 'missing-licenses must not silently be hidden');
for (const item of playable) {
  const url = new URL(item.imageUrl);
  assert.equal(url.protocol, 'https:');
  assert(['scene', 'poster'].includes(item.mode));
  assert(item.mediaApproval !== 'cleared_for_broadcast', 'never imply copyright cleared for external press images');
}
for (const mode of ['scene', 'poster']) for (const difficulty of ['easy', 'medium', 'hard']) {
  assert(playable.some(item => item.mode === mode && item.difficulty === difficulty), `${mode}/${difficulty} lacks an actual image candidate`);
}
for (const item of bank.stars) {
  assert(item.imageUrl.startsWith('https://commons.wikimedia.org/wiki/Special:FilePath/'));
  assert(item.attribution.source.startsWith('https://commons.wikimedia.org/wiki/File:'));
  assert(item.asset && !item.asset.endsWith('.svg'));
  assert(Number.isFinite(item.focus.x) && Number.isFinite(item.focus.y));
}
const artwork = path.join(root, 'public/assets/game/runtime/minigames/visual-guess');
assert.equal(fs.readdirSync(artwork).filter(name => /^movie-.*\.svg$/.test(name)).length, 0, 'fake film artwork must be removed');
const ts = require('/opt/nvm/versions/node/v22.16.0/lib/node_modules/typescript');
require.extensions['.ts'] = (module, file) => module._compile(ts.transpileModule(fs.readFileSync(file, 'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true,resolveJsonModule:true},fileName:file}).outputText, file);
const {VisualGuessMiniGameService} = require(path.join(root,'src/game-core/minigames/visual-guess/visual-guess-service.ts'));
const modeSchedule = {'guess-movie':['scene','poster','scene','poster'], 'guess-star':['eyes','silhouette','zoom','reveal']};
for (const id of Object.keys(modeSchedule)) {
  for(let seed = 0; seed < 45; seed++) {
    const svc = new VisualGuessMiniGameService(id);
    svc.beginTour();
    const seen = new Set();
    for(let round = 1; round <= 4; round++) {
      svc.startRound(round,seed*47+100);
      const snap = svc.getSnapshot('ar');
      assert.equal(snap.visualGuess.mode, modeSchedule[id][round-1]);
      assert.equal(snap.questionDifficulty, ['easy','medium','hard','hard'][round-1]);
      assert(!seen.has(snap.questionId)); seen.add(snap.questionId);
      assert.equal(snap.visualGuess.correctOptionNumber,null);
      assert.equal(snap.visualGuess.choices.length,4);
    }
  }
}
console.log(`V44 genuine-media + content regression PASS: ${playable.length}/30 real movie image candidates, 20 Commons stars, 90 seeded tours.`);
