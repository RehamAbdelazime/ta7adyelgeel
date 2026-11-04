/* Runtime smoke: TypeScript services run through the global TS compiler;
   works without npm install and actually exercises game state transitions. */
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const ts = require('/opt/nvm/versions/node/v22.16.0/lib/node_modules/typescript');
require.extensions['.ts'] = (module, filename) => {
  const source = fs.readFileSync(filename, 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
    fileName: filename,
  });
  module._compile(compiled.outputText, filename);
};
const root = path.resolve(__dirname, '..');
function load(directory, className) {
  const filenames = {};
  const module = require(path.join(root, `src/game-core/minigames/${directory}/${filenames[directory] ?? `${directory}-service.ts`}`));
  assert(typeof module[className] === 'function', `Missing service ${className}`);
  return module[className];
}
const games = [
  ['food-origin','FoodOriginMiniGameService'],
  ['shape-count','ShapeCountMiniGameService'],
  ['maze-gates','MazeGatesMiniGameService'],
  ['count-the-beat','CountTheBeatMiniGameService'],
  ['lucky-cup','LuckyCupMiniGameService'],
  ['memory-count','MemoryCountMiniGameService'],
  ['couple-or-siblings','CoupleOrSiblingsMiniGameService'],
];
let total = 0;
for(const [gameId,className] of games){
  const service = new (load(gameId,className))();
  service.beginTour();
  for (let round = 1; round <= 3; round++) {
    service.startRound(round,round*121+47);
    let intro = service.getSnapshot('ar');
    assert.equal(intro.id,gameId,`Wrong game ID for ${gameId}`);
    assert(intro.hasRound,`No content for ${gameId} round ${round}`);
    assert(!intro.acceptsAnswers,`Intro must not accept answers: ${gameId}`);
    service.setStatus('prepare');
    let prepare = service.getSnapshot('ar');
    assert(!prepare.acceptsAnswers,`Prepare must not accept answers: ${gameId}`);
    if (gameId==='memory-count') assert(prepare.memoryCount.showItems,'Memory image must be visible during prepare');
    service.setStatus('answering');
    const active=service.getSnapshot('en');
    assert(active.acceptsAnswers,`No answer window: ${gameId}`);
    if (gameId==='memory-count') assert(!active.memoryCount.showItems,'Memory grid must disappear before answers open');
    if (gameId==='count-the-beat') {
      const beat=active.countTheBeat;
      assert.equal(beat.targetCount,null,'Target count leaks before reveal');
      assert(beat.items.length >= 20,'No icons to count');
      assert(beat.items.some(i=>i.isTarget)&&beat.items.some(i=>!i.isTarget),'Missing target/distractor mix');
      assert(beat.items.every(i=>Number.isFinite(i.delayMs)&&i.durationMs>0),'Bad beat timing');
    }
    service.resolveRound();
    const scored=service.getSnapshot('en');
    assert(scored.correctAnswer !== null,`No correct answer on reveal: ${gameId}`);
    if (gameId==='count-the-beat') assert.equal(scored.countTheBeat.targetCount,scored.countTheBeat.items.filter(i=>i.isTarget).length,'Wrong beat answer count');
    const awards=service.createScoreAwards();
    assert(Array.isArray(awards),`Scores malformed: ${gameId}`);
    total++;
  }
  console.log(`[PASS] ${gameId} service: 3 rounds, phase contract, 2 locales, reveal/score`);
}
const {GameStore} = require(path.join(root,'src/game-core/app/game-store.ts'));
const {GameEventBus} = require(path.join(root,'src/game-core/events/game-event-bus.ts'));
for(const gameId of ['memory-count','lucky-cup','food-origin','maze-gates']){
  const store=new GameStore(new GameEventBus());
  try{
    store.joinCitizen({twitchUserId:'v35-test-user',displayName:'Verifier'});
    if(gameId==='memory-count') store.setForcedNextMiniGame('memory-count');
    store.startTour(3,[gameId],'mini_game');
    assert.equal(store.getSnapshot().tour.phase,'mini_game_intro');
    store.skipPhase();
    const prepare=store.getSnapshot();
    assert.equal(prepare.tour.phase,'tour_starting');
    assert.equal(prepare.miniGame.id,gameId);
    if(gameId==='memory-count'){
      assert(prepare.tour.phaseDurationMs>=6000,`Memory preview too short: ${prepare.tour.phaseDurationMs}`);
      assert(prepare.miniGame.memoryCount.showItems,'Missing actual preview');
    }
    store.skipPhase();
    const answering=store.getSnapshot();
    assert.equal(answering.tour.phase,'answer_window_open');
    if(gameId==='memory-count') assert(!answering.miniGame.memoryCount.showItems);
    store.skipPhase();
    assert.equal(store.getSnapshot().tour.phase,'scoring');
    total++;
  }finally{store.destroy();}
  console.log(`[PASS] ${gameId} GameStore: intro > visible prep > answers > scoring`);
}
// Force Memory into the second round after scoring. The FSM increments its
// round index BEFORE duration resolution but BEFORE emitting phaseChanged.
// This catches the old 3-second-preview bug on cross-game tour transitions.
const cross = new GameStore(new GameEventBus());
try {
  cross.joinCitizen({twitchUserId:'cross-round',displayName:'Tour Tester'});
  cross.startTour(3,['food-origin'],'tour');
  cross.skipPhase(); cross.skipPhase(); cross.skipPhase();
  assert.equal(cross.getSnapshot().tour.phase,'scoring');
  cross.setForcedNextMiniGame('memory-count');
  cross.skipPhase();
  const next=cross.getSnapshot();
  assert.equal(next.tour.phase,'tour_starting');
  assert.equal(next.tour.roundNumber,2);
  assert.equal(next.miniGame.id,'memory-count');
  assert(next.tour.phaseDurationMs>=5300,`Second-round Memory preview truncated: ${next.tour.phaseDurationMs}`);
  assert(next.miniGame.memoryCount.showItems,'Memory must be on screen in second round');
  total++;
}finally{cross.destroy();}
console.log('[PASS] Full Tour: force Memory Count after another game, with complete visual preview');
console.log(`V35 functional runtime smoke: ${total} rounds / tours validated across all ${games.length} games.`);
