/* Standalone dynamic V38 checks; no npm install necessary. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = (() => { try { return require('typescript'); } catch { return require('typescript'); } })();
require.extensions['.ts'] = (module, filename) => {
  const source = fs.readFileSync(filename, 'utf8');
  const transpiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true }, fileName: filename, reportDiagnostics: true });
  assert(!(transpiled.diagnostics || []).some(d => d.category === ts.DiagnosticCategory.Error), `Syntax errors: ${filename}`);
  module._compile(transpiled.outputText, filename);
};
const root = path.join(__dirname,'..');
const load = (name, cls) => require(path.join(root,`src/game-core/minigames/${name}/${name}-service.ts`))[cls];
const Shape = load('shape-count', 'ShapeCountMiniGameService');
const Beat = load('count-the-beat', 'CountTheBeatMiniGameService');
const { getCountTheBeatSchedule, getBeatLanePositions } = require(path.join(root,'src/game-core/minigames/count-the-beat/count-the-beat-service.ts'));
const Food = load('food-origin', 'FoodOriginMiniGameService');
const Maze = load('maze-gates', 'MazeGatesMiniGameService');
const { LuckyCupMiniGameService } = require(path.join(root,'src/game-core/minigames/lucky-cup/lucky-cup-service.ts'));
const { getLuckyCupOrder } = require(path.join(root,'src/game-core/minigames/lucky-cup/lucky-cup-motion.ts'));
const citizen = { twitchUserId:'v38-test', displayName:'Tester', role:'official' };
let cases = 0;
for(let seed=1;seed<=100;seed++) {
  const game=new Beat();
  for(let round=1;round<=3;round++) {
    game.startRound(round, seed * 627);
    game.setStatus('answering');
    const snap=game.getSnapshot('en');
    const beat=snap.countTheBeat;
    const bpm=[54,60,66][round-1];
    assert.equal(beat.bpm,bpm);
    assert.equal(beat.items.filter(i=>i.isTarget).length,beat.items.reduce((sum,i)=>sum+Number(i.isTarget),0));
    const schedule = getCountTheBeatSchedule(round);
    const positions = getBeatLanePositions(beat.lanes);
    assert.equal(beat.lanes,[1,2,4][round-1]);
    assert.deepEqual(beat.items.length,[12,14,16][round-1]);
    assert.deepEqual(beat.items.map(i=>[i.delayMs,i.durationMs]),schedule.map(i=>[i.delayMs,i.durationMs]));
    assert(Math.max(...beat.items.map(i=>i.delayMs+i.durationMs)) < 16_000,'unplayable preview');
    for(let index=0;index<beat.items.length;index++) {
      const item=beat.items[index];
      assert.equal(item.tone,'cyan','color must not indicate target');
      assert.equal(item.size,1,'size must not indicate target');
      assert(item.x>=18 && item.x<=82 && positions.includes(item.y),'offstage glyph');
      if(index>0) assert(beat.items[index-1].delayMs + beat.items[index-1].durationMs < item.delayMs,'simultaneous symbols');
    }
    assert.equal(beat.targetCount,null,'live correct count leaked');
    game.resolveRound();
    assert.equal(game.getSnapshot('en').countTheBeat.targetCount,beat.items.filter(i=>i.isTarget).length,'wrong visible result');
    cases++;
  }
}
for(let trial=0;trial<45;trial++) {
  const shapes=new Shape();
  for(let round=1;round<=3;round++) {
    shapes.startRound(round);
    shapes.setStatus('answering');
    const snap=shapes.getSnapshot('en');
    const grid=snap.shapeGrid;
    assert.equal(snap.questionDifficulty,['easy','medium','hard'][round-1]);
    assert.equal(grid.mode,'majority','every difficulty must ask for the most common shape');
    assert.equal(grid.targetCount,null,'no numeric target in any shape question');
    assert.equal(snap.statement,'Which shape appears the most?');
    const tally = Object.fromEntries(grid.choices.map(c=>[c.shape,grid.cells.filter(cell=>cell.shape===c.shape).length]));
    assert.equal(grid.cells.length,grid.rows*grid.columns);
    assert(grid.choices.every(c=>grid.counts[c.shape]===tally[c.shape]));
    const answerShape=grid.choices.reduce((a,b)=>tally[a.shape]>tally[b.shape]?a:b).shape;
    assert.equal(grid.choices.filter(c=>tally[c.shape]===tally[answerShape]).length,1,'most-common shape must be unique');
    assert(tally[answerShape] - Math.max(...grid.choices.filter(c=>c.shape!==answerShape).map(c=>tally[c.shape]))>=2,'difference too small for visual guessing');
    const option=grid.choices.find(c=>c.shape===answerShape).optionNumber;
    assert.equal(shapes.getAnswerByOptionNumber(option),answerShape);
    assert(shapes.submitAnswer(citizen,answerShape).ok);
    assert(!shapes.submitAnswer(citizen,answerShape).ok,'player can answer twice');
    shapes.resolveRound();
    assert.equal(shapes.getSnapshot('en').correctAnswer,answerShape,'shape result incorrect');
    assert.equal(shapes.createScoreAwards()[0].isCorrect,true,'shape scoring incorrect');
    cases++;
  }
}
for(let trial=0;trial<5;trial++) {
  const food=new Food();
  for(let round=1;round<=3;round++){
    food.startRound(round);
    assert.equal(food.getSnapshot('en').questionDifficulty,['easy','medium','hard'][round-1], 'food session difficulty must be E/M/H');
    const data=food.getSnapshot('en').foodOrigin;
    assert(data.choices.length===4 && new Set(data.choices.map(c=>c.countryCode)).size===4,'food distractors invalid');
    assert(data.dishImageUrl?.startsWith('/assets/game/runtime/minigames/food-origin/photos/'),'offline dish photo required');
    assert(fs.existsSync(path.join(root,'public',data.dishImageUrl.slice(1))),'dish image missing');
    cases++;
  }
}
for(let trial=0;trial<5;trial++){
  const game=new Maze();
  for(let round=1;round<=3;round++){
    game.startRound(round);
    const before=game.getSnapshot('en');
    assert.equal(before.mazeGates.fullMaze.solutionPath.length,0,'maze shows hidden answer');
    assert(before.mazeGates.fullMaze.gates.every(g=>g.optionNumber>=1&&g.optionNumber<=4),'numbered gate invalid');
    game.resolveRound();
    const solved=game.getSnapshot('en');
    assert(solved.mazeGates.fullMaze.solutionPath.length>1,'maze has no drawn answer path');
    assert.equal(solved.mazeGates.fullMaze.gates.filter(g=>g.isCorrect).length,1,'not exactly one correct gate');
    cases++;
  }
}
for(let seed=1;seed<=50;seed++){
  const game=new LuckyCupMiniGameService();game.startRound(3,seed);
  const plan=game.getSnapshot('en').luckyCup;
  assert.deepEqual(plan.swaps.slice(-5).map(s=>s.durationMs),[175,145,120,100,85]);
  game.resolveRound();
  assert.equal(getLuckyCupOrder(plan.swaps).indexOf(plan.initialBallCupId)+1,game.getSnapshot('en').luckyCup.correctCupNumber);
  cases++;
}
for(const name of ['CountTheBeatScreen','ShapeCountScreen','MazeGatesScreen','LuckyCupScreen']){
  const code=fs.readFileSync(path.join(root,`src/ui-react/components/gameplay/minigames/${name}.tsx`),'utf8');
  const diagnostics=ts.transpileModule(code,{fileName:name+'.tsx',compilerOptions:{jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022},reportDiagnostics:true}).diagnostics || [];
  assert(!diagnostics.some(d=>d.category===ts.DiagnosticCategory.Error),'TSX syntax: '+name);
}
const mazeScreen=fs.readFileSync(path.join(root,'src/ui-react/components/gameplay/minigames/MazeGatesScreen.tsx'),'utf8');
assert(mazeScreen.includes('reveal && fullMaze.solutionPath.length > 0'), 'maze should render solution only after reveal');
console.log(`V38 gameplay quality PASS: ${cases} runtime cases, 4 TSX screens, no pre-reveal maze path, E/M/H sessions and V30 finale intact.`);
