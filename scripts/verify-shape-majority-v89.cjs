'use strict';
/** Shape Count gameplay contract: visual majority in EVERY difficulty. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
require('./qa/ts-register.cjs');
const root = path.resolve(__dirname, '..');
const { ShapeCountMiniGameService } = require(path.join(root, 'src/game-core/minigames/shape-count/shape-count-service.ts'));
const player = { twitchUserId: 'majority-check', displayName: 'Majority Check', role: 'official' };
let rounds = 0;
for (let tour = 0; tour < 1600; tour++) {
  const game = new ShapeCountMiniGameService();
  game.beginTour();
  for (let round = 1; round <= 3; round++) {
    game.startRound(round);
    const ar = game.getSnapshot('ar');
    const en = game.getSnapshot('en');
    const grid = en.shapeGrid;
    assert(grid, 'missing shape grid');
    assert.equal(en.questionDifficulty, ['easy', 'medium', 'hard'][round - 1]);
    assert.equal(en.statement, 'Which shape appears the most?');
    assert.equal(ar.statement, 'أي شكل موجود بعدد أكبر؟');
    assert.equal(grid.mode, 'majority', 'numeric exact-count mode is forbidden');
    assert.equal(grid.targetCount, null, 'no numeric target number allowed');
    assert.equal(grid.cells.length, grid.rows * grid.columns);
    assert.equal(grid.choices.length, round === 1 ? 3 : 4);
    assert(new Set(grid.choices.map(c => c.shape)).size === grid.choices.length);
    const tallies = Object.fromEntries(grid.choices.map(c => [c.shape, 0]));
    for (const cell of grid.cells) {
      assert(cell.shape in tallies, 'unknown shape in grid');
      tallies[cell.shape] += 1;
    }
    for (const c of grid.choices) assert.equal(grid.counts[c.shape], tallies[c.shape]);
    const ranking = [...grid.choices].sort((a,b) => tallies[b.shape] - tallies[a.shape]);
    assert(tallies[ranking[0].shape] - tallies[ranking[1].shape] >= 2, 'visually indistinguishable majority');
    assert.equal(ranking.filter(c => tallies[c.shape] === tallies[ranking[0].shape]).length, 1, 'tied top count');
    const winningShape = ranking[0].shape;
    const option = grid.choices.find(c => c.shape === winningShape).optionNumber;
    assert.equal(game.getAnswerByOptionNumber(option), winningShape);
    game.setStatus('answering');
    assert(game.submitAnswer(player, winningShape).ok);
    game.resolveRound();
    assert.equal(game.getSnapshot('en').correctAnswer, winningShape);
    assert.equal(game.createScoreAwards()[0].isCorrect, true);
    assert.equal(game.createScoreAwards().length, 0, 'double-scoring not allowed');
    rounds++;
  }
}
const tutorial = fs.readFileSync(path.join(root,'src/game-core/localization/translations.ts'), 'utf8');
assert(!tutorial.includes('Find either the most frequent shape or one with a given count.'));
assert(!tutorial.includes('السؤال ممكن يطلب الشكل الأكثر تكرارًا'));
const service = fs.readFileSync(path.join(root,'src/game-core/minigames/shape-count/shape-count-service.ts'), 'utf8');
assert(!service.includes('exactMode') && !service.includes('exactAnswer'), 'numeric mode code remains');
console.log(`V89 SHAPE MAJORITY PASS: ${rounds} generated rounds, E/M/H all visual majority, unique winner, no exact counts, answers and scores verified.`);
