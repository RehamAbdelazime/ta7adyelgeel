/** Local Egyptian poster pack + culturally plausible choice generation regression. */
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const questions = require(path.join(root, 'src/game-core/minigames/visual-guess/visual-guess-questions.json'));
const movies = questions.movies;
const v50Profiles = require(path.join(root, 'src/game-core/minigames/visual-guess/poster-visual-profiles-v50.json')).profiles;
const catalog = questions.movieChoiceCatalog;
assert.equal(movies.length, 50);
assert.equal(new Set(movies.map(m => m.id)).size, movies.length);
const moviesById = new Map(movies.map(m => [m.id, m]));
const allTitles = new Map([...movies.map(m => [m.id, m.name]), ...Object.entries(catalog)]);
const validMagic = (asset, bytes) => {
  if (/\.(?:jpeg|jpg)$/i.test(asset)) return bytes[0] === 0xff && bytes[1] === 0xd8;
  if (/\.png$/i.test(asset)) return bytes.subarray(0, 8).equals(Buffer.from('89504e470d0a1a0a', 'hex'));
  if (/\.webp$/i.test(asset)) return bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP';
  return false;
};
for (const movie of movies) {
  const file = path.join(root, 'public/assets/game/runtime/minigames/visual-guess', movie.asset);
  const bytes = fs.readFileSync(file);
  assert(validMagic(movie.asset, bytes), `Invalid original poster image: ${movie.id}`);
  assert.equal(movie.imageUrl, '', 'No movie photos from the internet');
  assert.equal(movie.mode, 'poster');
  assert(movie.name.ar && movie.name.en);
  assert(movie.titleMasks.length > 0);
  assert(movie.titleMasks.every(b => b.w > 0 && b.h > 0 && b.x >= 0 && b.y >= 0 && b.x + b.w <= 100 && b.y + b.h <= 100));
  assert(movie.posterAspectRatio > 0);
  assert.equal(movie.distractorIds.length, 5, `${movie.id}: editorial shortlist incomplete`);
  assert.equal(new Set(movie.distractorIds).size, 5, `${movie.id}: duplicate alternative`);
  for (const id of movie.distractorIds) {
    assert.notEqual(id, movie.id);
    assert(allTitles.has(id), `${movie.id}: unregistered familiar wrong title ${id}`);
    assert.notEqual(allTitles.get(id).ar, movie.name.ar);
  }
}
require.extensions['.ts'] = (mod, filename) => {
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true, resolveJsonModule: true }, fileName: filename,
  }).outputText;
  mod._compile(code, filename);
};
const { VisualGuessMiniGameService, getVisualGuessModes } = require(path.join(root, 'src/game-core/minigames/visual-guess/visual-guess-service.ts'));
assert.deepEqual(getVisualGuessModes('guess-movie'), ['poster']);
const appeared = new Set();
const positions = new Set();
let rounds = 0;
for (let seed = 0; seed < 250; seed++) {
  const svc = new VisualGuessMiniGameService('guess-movie');
  svc.beginTour();
  const tourItems = new Set();
  for (let n = 1; n <= 4; n++) {
    svc.startRound(n, 321 + seed * 631);
    const ar = svc.getSnapshot('ar');
    const en = svc.getSnapshot('en');
    const movie = moviesById.get(ar.questionId);
    assert(movie);
    appeared.add(movie.id);
    assert(!tourItems.has(movie.id));
    tourItems.add(movie.id);
    assert.equal(ar.questionDifficulty, ['easy', 'medium', 'hard', 'hard'][n-1]);
    assert.equal(ar.visualGuess.mode, 'poster');
    assert.equal(ar.visualGuess.correctOptionNumber, null);
    assert.equal(ar.visualGuess.correctLabel, null);
    assert.equal(ar.visualGuess.choices.length, 4);
    assert.equal(new Set(ar.visualGuess.choices.map(c=>c.value)).size, 4);
    const correct = ar.visualGuess.choices.find(c => c.value === movie.id);
    assert(correct);
    assert.equal(correct.label, movie.name.ar);
    positions.add(correct.optionNumber);
    for (const candidate of ar.visualGuess.choices) {
      assert(candidate.label, 'Arabic choice must be localized');
      assert(en.visualGuess.choices.find(x=>x.optionNumber===candidate.optionNumber).label === allTitles.get(candidate.value).en);
      if(candidate.value !== movie.id) assert(movie.distractorIds.includes(candidate.value) || v50Profiles[movie.id].visualNearIds.includes(candidate.value), `${movie.name.ar}: unrelated movie option ${candidate.label}`);
    }
    svc.setStatus('answering');
    svc.resolveRound();
    const reveal=svc.getSnapshot('ar');
    assert.equal(reveal.visualGuess.correctOptionNumber, correct.optionNumber);
    assert.equal(reveal.visualGuess.correctLabel, movie.name.ar);
    rounds++;
  }
}
assert.equal(appeared.size, 50, 'All 50 films must be reachable over seeded sessions');
assert.equal(positions.size, 4, 'Every correct-answer position must be reachable');
const screen = fs.readFileSync(path.join(root,'src/ui-react/components/gameplay/minigames/VisualGuessScreen.tsx'),'utf8');
const css = fs.readFileSync(path.join(root,'src/ui-react/styles/visual-guess-v36.css'),'utf8');
assert(screen.includes('posterBlur') && screen.includes('faceBlur'));
assert(screen.includes('titleMasks') && screen.includes('!showingResult'));
assert(css.includes('v49-poster-title-secret') && css.includes('38px'));
console.log(`V49+V50 PASS: ${movies.length} user-supplied posters, ${Object.keys(catalog).length} familiar title-only alternatives, ${rounds} playable seeded movie rounds; all 4 correct answer positions; no unrelated choices.`);
