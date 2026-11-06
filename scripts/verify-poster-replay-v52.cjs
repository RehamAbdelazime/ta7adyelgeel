/** V52 gameplay tests: persistent replay fairness, 5 reveal modes, pause-safe end. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
require.extensions['.ts'] = (mod, filename) => {
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
      esModuleInterop: true, resolveJsonModule: true }, fileName: filename,
  }).outputText;
  mod._compile(code, filename);
};
const { VisualGuessMiniGameService } = require('../src/game-core/minigames/visual-guess/visual-guess-service.ts');
const { planPosterReveal, puzzleOrder, getSpotlightPoint, availablePosterModes } = require('../src/game-core/minigames/visual-guess/poster-mystery.ts');
const { POSTER_HISTORY_KEY, readPosterHistory, rememberPosterPlay } = require('../src/game-core/minigames/visual-guess/poster-history.ts');
const { getPosterRevealProgress } = require('../src/ui-react/components/gameplay/minigames/poster-reveal-curve.ts');
const bank = require('../src/game-core/minigames/visual-guess/visual-guess-questions.json');
const profiles = require('../src/game-core/minigames/visual-guess/poster-visual-profiles-v50.json').profiles;
const tiers = Object.fromEntries(['easy','medium','hard'].map(d => [d,bank.movies.filter(q => q.difficulty === d).length]));
const memory = new Map();
const storage = { getItem: key => memory.get(key) ?? null, setItem: (key, val) => memory.set(key, val) };
const firstSeen = { easy: new Set(), medium: new Set(), hard: new Set() };
const perFilm = new Map();
let rounds = 0;
let repeat = 0;
let changedReveal = 0;
let contextualDiff = 0;
// Simulate reopening Electron before every tour to confirm actual storage survives.
for (let tour = 0; tour < 32; tour++) {
  const svc = new VisualGuessMiniGameService('guess-movie', storage);
  svc.beginTour();
  const usedWithinTour = new Set();
  for (let round = 1; round <= 4; round++) {
    svc.startRound(round, 51513 + tour * 301 + round);
    const ar = svc.getSnapshot('ar');
    const en = svc.getSnapshot('en');
    const film = bank.movies.find(q => q.id === ar.questionId);
    const plan = ar.visualGuess.posterReveal;
    assert(film && plan, 'movie question must have playable poster + reveal plan');
    const difficulty = film.difficulty;
    assert.equal(difficulty, ['easy','medium','hard','hard'][round-1]);
    assert(availablePosterModes(difficulty).includes(plan.mode));
    assert.equal(ar.visualGuess.mode, 'poster', 'existing minigame type unchanged');
    assert(!usedWithinTour.has(film.id), 'do not duplicate posters within tour');
    usedWithinTour.add(film.id);
    assert.equal(ar.visualGuess.correctLabel, null, 'answer remains hidden while guessing');
    assert.equal(ar.visualGuess.correctOptionNumber, null);
    assert.equal(ar.visualGuess.choices.length, 4);
    assert.equal(new Set(ar.visualGuess.choices.map(x => x.label)).size, 4);
    assert.equal(ar.visualGuess.choices.find(x => x.value === film.id).label, film.name.ar);
    assert.equal(en.visualGuess.choices.find(x => x.value === film.id).label, film.name.en);
    for (const wrong of ar.visualGuess.choices.filter(x => x.value !== film.id)) {
      assert(film.distractorIds.includes(wrong.value) || profiles[film.id].visualNearIds.includes(wrong.value));
    }
    if (firstSeen[difficulty].size < tiers[difficulty]) {
      assert(!firstSeen[difficulty].has(film.id), 'no repeat before difficulty pack exhausts');
      firstSeen[difficulty].add(film.id);
    }
    const prior = perFilm.get(film.id);
    if (prior) {
      repeat++;
      if (prior.mode !== plan.mode) changedReveal++;
      assert.notEqual(plan.pattern, prior.pattern, 'changed variant pattern on replay');
    }
    perFilm.set(film.id, plan);
    assert(plan.focus.x > 0 && plan.focus.x < 100);
    assert(plan.focus.y > 0 && plan.focus.y < 100);
    assert(plan.initialRegions.every(x => Number.isInteger(x) && x >= 0 && x < 9));
    if (plan.mode === 'puzzle') {
      assert.equal(plan.initialRegions.length, 2);
      assert.deepEqual(plan.initialRegions, puzzleOrder(plan.pattern).slice(0,2));
    }
    const spotlight = getSpotlightPoint(plan, .4);
    assert(spotlight.x >= 0 && spotlight.x <=100 && spotlight.y >= 0 && spotlight.y <=100);
    svc.setStatus('answering'); svc.resolveRound();
    assert.equal(svc.getSnapshot('ar').visualGuess.correctLabel, film.name.ar);
    rounds++;
  }
  svc.clear(); // must not erase persisted history
}
assert.equal(memory.has(POSTER_HISTORY_KEY), true);
assert.deepEqual(Object.fromEntries(Object.entries(firstSeen).map(([k,v])=>[k,v.size])), tiers);
assert.equal(perFilm.size, 50, 'must expose all 50 films before using only repeats');
assert(repeat > 60 && changedReveal > repeat * .75, 'repeated posters should predominantly change reveal modes');
const history = readPosterHistory(storage);
assert.equal(Object.keys(history.entries).length, 50);
assert.equal(history.sequence, rounds);
// Verify per-poster mode fairness even when the same poster is artificially replayed.
for (const difficulty of ['easy','medium','hard']) {
  let previous; const modes = new Set();
  for(let n=0;n<availablePosterModes(difficulty).length;n++) {
    const plan=planPosterReveal(difficulty, 443 + n * 991, previous, {x:50,y:42});
    modes.add(plan.mode);
    previous={...previous, plays:n+1, lastMode:plan.mode, lastPattern:plan.pattern,
      modeUses:{...previous?.modeUses,[plan.mode]:(previous?.modeUses?.[plan.mode]??0)+1}};
  }
  assert.equal(modes.size, availablePosterModes(difficulty).length, `${difficulty}: cycle each allowed variant before reuse`);
}
for(const difficulty of ['easy','medium','hard']) {
  const duration=20000;
  for (const remaining of [20000,15000,7500,1100,1000,999,0]) {
    const p=getPosterRevealProgress(duration,remaining,difficulty);
    assert(p>=0 && p<=1);
    if(remaining<=1000) assert.equal(p,1, `${difficulty} must reveal complete original in final second`);
  }
  assert.equal(getPosterRevealProgress(duration, duration, difficulty),0);
}
// Damaged / unsupported history data cannot crash a release build.
const corrupt = { getItem:()=>'{bad json', setItem:()=>{ throw new Error('storage blocked'); } };
assert.deepEqual(readPosterHistory(corrupt).entries,{});
assert.doesNotThrow(()=>rememberPosterPlay(readPosterHistory(corrupt),'movie-test',planPosterReveal('easy',5,undefined,{x:50,y:40}),corrupt));
const blocked = { getItem:()=>{throw new Error('blocked');}, setItem:()=>{} };
assert.equal(readPosterHistory(blocked).sequence, 0);
// Static integration check: every reveal variant is wired to image elements;
// pause timing is based on the tour clock, never independent CSS keyframes.
const screen = fs.readFileSync(path.join(root,'src/ui-react/components/gameplay/minigames/VisualGuessScreen.tsx'),'utf8');
for(const mode of ['blur','zoom','spotlight','puzzle','color']) assert(screen.includes(`posterMode === '${mode}'`), `missing mode UI ${mode}`);
assert(screen.includes('posterFinished') && screen.includes('remainingMs <= 1000'));
assert(screen.includes('snapshot.tour.phaseEndsAt') && screen.includes('snapshot.tour.isPaused'));
assert(screen.includes('getPosterRevealProgress') && screen.includes('getSpotlightPoint'));
assert(!screen.includes('v49-poster-title-secret'));
const types=fs.readFileSync(path.join(root,'src/game-core/minigames/minigame-types.ts'),'utf8');
assert(types.includes('posterReveal?: PosterRevealPlan | null'));
console.log(`V52 PASS: ${rounds} rounds over 32 app relaunches; 50/50 posters covered; ${repeat} repeats (${changedReveal} different reveal modes); per-difficulty fairness, context-aware options, all 5 visuals, final-second full image, localized answers, storage fallbacks.`);
