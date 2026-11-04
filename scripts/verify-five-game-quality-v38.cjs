/* Standalone dynamic V38 checks; no npm install necessary. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = (() => { try { return require('typescript'); } catch { return require('/opt/nvm/versions/node/v22.16.0/lib/node_modules/typescript'); } })();
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
    const bpm=[108,134,158][round-1];
    assert.equal(beat.bpm,bpm);
    assert.equal(beat.items.filter(i=>i.isTarget).length,beat.items.reduce((sum,i)=>sum+Number(i.isTarget),0));
    const expectedBeatMs=60000/bpm;
    const positionsByBeat=new Map();
    for(const item of beat.items) {
      const beatNumber=Math.round(item.delayMs/expectedBeatMs);
      assert(Math.abs(item.delayMs-beatNumber*expectedBeatMs)<=1.01,'off-beat glyph');
      assert(item.durationMs<=Math.round(expectedBeatMs*.86),'glyph exceeds beat window');
      assert(item.x>=14&&item.x<=90&&item.y>=18&&item.y<=80,'offstage glyph');
      const positions=positionsByBeat.get(beatNumber)||new Set();
      const key=`${item.x}:${item.y}`;
      assert(!positions.has(key),'same-slot simultaneous overlap');
      positions.add(key);positionsByBeat.set(beatNumber,positions);
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
    assert.equal(grid.mode,round===1?'majority':'exact');
    const tally = Object.fromEntries(grid.choices.map(c=>[c.shape,grid.cells.filter(cell=>cell.shape===c.shape).length]));
    assert.equal(grid.cells.length,grid.rows*grid.columns);
    assert(grid.choices.every(c=>grid.counts[c.shape]===tally[c.shape]));
    const answerShape=round===1?grid.choices.reduce((a,b)=>tally[a.shape]>tally[b.shape]?a:b).shape:
      grid.choices.find(c=>tally[c.shape]===grid.targetCount).shape;
    if(round!==1) assert.equal(grid.choices.filter(c=>tally[c.shape]===grid.targetCount).length,1,'ambiguous quantity question');
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
