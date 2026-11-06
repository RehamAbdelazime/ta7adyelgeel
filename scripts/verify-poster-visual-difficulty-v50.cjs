/** V50: poster-colour, actor-layout and difficulty-aware movie choice QA. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const dir = path.join(root, 'src/game-core/minigames/visual-guess');
const bank = require(path.join(dir, 'visual-guess-questions.json'));
const profiles = require(path.join(dir, 'poster-visual-profiles-v50.json')).profiles;
const ids = new Set(bank.movies.map(x => x.id));
const titleById = new Map([...bank.movies.map(x => [x.id, x.name]), ...Object.entries(bank.movieChoiceCatalog ?? {})]);
assert.equal(Object.keys(profiles).length, 50, 'Every poster needs explicit visual metadata');
for (const movie of bank.movies) {
  const p = profiles[movie.id];
  assert(p, `${movie.id}: missing profile`);
  assert(['solo', 'duo', 'trio', 'ensemble', 'collage'].includes(p.castLayout));
  assert(['center', 'side', 'split', 'scattered'].includes(p.heroPlacement));
  assert.equal(p.spatialPaletteRGB.length, 9);
  assert(p.spatialPaletteRGB.every(row => row.length === 3 && row.every(v => Number.isInteger(v) && v >= 0 && v <= 256)));
  assert.equal(p.visualNearIds.length, 5, `${movie.name.ar}: expected five visual alternatives`);
  assert.equal(new Set(p.visualNearIds).size, 5);
  for (const id of p.visualNearIds) {
    assert(ids.has(id), `${movie.name.ar}: visual candidates must have source posters`);
    assert.notEqual(id, movie.id);
  }
}
require.extensions['.ts'] = (mod, filename) => {
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
      esModuleInterop: true, resolveJsonModule: true,
    }, fileName: filename,
  }).outputText;
  mod._compile(code, filename);
};
const { VisualGuessMiniGameService } = require(path.join(dir, 'visual-guess-service.ts'));
const stats = { easy: { n: 0, visual: 0, cultural: 0 }, medium: { n: 0, visual: 0, cultural: 0 }, hard: { n: 0, visual: 0, cultural: 0 } };
const discovered = new Set();
const samples = new Map();
let rounds = 0;
for (let seed = 0; seed < 700; seed++) {
  const svc = new VisualGuessMiniGameService('guess-movie');
  for (let round = 1; round <= 4; round++) {
    svc.startRound(round, seed * 1009 + 123);
    const a = svc.getSnapshot('ar');
    const m = bank.movies.find(x => x.id === a.questionId);
    assert(m);
    discovered.add(m.id);
    const wrong = a.visualGuess.choices.filter(x => x.value !== m.id);
    assert.equal(wrong.length, 3);
    assert.equal(new Set(wrong.map(x => x.label)).size, 3);
    const visuals = wrong.filter(x => profiles[m.id].visualNearIds.includes(x.value)).length;
    const cultural = wrong.filter(x => m.distractorIds.includes(x.value)).length;
    assert(visuals >= (m.difficulty === 'hard' ? 3 : m.difficulty === 'medium' ? 2 : 1), `${m.name.ar}: wrong visual composition count`);
    assert(cultural >= (m.difficulty === 'easy' ? 2 : m.difficulty === 'medium' ? 1 : 0), `${m.name.ar}: poor audience similarity`);
    assert(wrong.every(x => titleById.has(x.value)));
    const d = stats[m.difficulty]; d.n++; d.visual += visuals; d.cultural += cultural;
    if (!samples.has(m.id)) samples.set(m.id, wrong.map(x=>x.value));
    rounds++;
  }
}
assert.equal(discovered.size, 50, 'All posters accessible across deterministic sessions');
const screen = fs.readFileSync(path.join(root, 'src/ui-react/components/gameplay/minigames/VisualGuessScreen.tsx'), 'utf8');
assert(screen.includes("posterDifficulty === 'easy' ? 13 : posterDifficulty === 'hard' ? 24 : 19"));
assert(screen.includes("posterDifficulty === 'easy' ? 10 : posterDifficulty === 'hard' ? 20 : 15"));
assert(screen.includes('!showingResult') && screen.includes('titleMasks'));

const rows = [['الفيلم الصحيح', 'المستوى', 'ألوان البوستر', 'توزيع الممثلين', 'التمركز', 'اختيار غلط ١ (تجربة)', 'اختيار غلط ٢ (تجربة)', 'اختيار غلط ٣ (تجربة)', 'أقرب ٥ بوسترات بصريًا', '٥ اختيارات مرتبطة بالمشاهد المصري']];
for (const m of bank.movies) {
  const p = profiles[m.id]; const names = arr => arr.map(id => titleById.get(id).ar).join('، ');
  const sample = samples.get(m.id);
  rows.push([m.name.ar, m.difficulty, p.paletteLabel, p.castLayout, p.heroPlacement,
    ...sample.map(id => titleById.get(id).ar), names(p.visualNearIds), names(m.distractorIds)]);
}
const toCsv = v => `"${String(v).replace(/"/g, '""')}"`;
fs.writeFileSync(path.join(root, 'docs/V50_POSTER_VISUAL_CHOICES_REVIEW_AR.csv'), '\ufeff' + rows.map(row => row.map(toCsv).join(',')).join('\r\n') + '\r\n');
for (const [key, x] of Object.entries(stats)) console.log(`${key}: ${x.n} rounds, average visual lookalikes ${(x.visual/x.n).toFixed(2)}/3, cultural ${(x.cultural/x.n).toFixed(2)}/3`);
console.log(`V50 PASS: ${rounds} rounds; 50/50 visually annotated local posters; visual+actor-position-aware distractors; difficulty policy verified; distinct Arabic choices.`);
