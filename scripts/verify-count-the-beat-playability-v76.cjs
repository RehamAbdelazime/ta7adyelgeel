/* Count the Beat V76 playability contract: runnable without images or game banks. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => {
  const code = fs.readFileSync(filename, 'utf8');
  const result = ts.transpileModule(code, { fileName: filename, compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true }, reportDiagnostics: true });
  assert(!(result.diagnostics || []).some(d => d.category === ts.DiagnosticCategory.Error), filename);
  module._compile(result.outputText, filename);
};
const root = path.resolve(__dirname,'..');
const {CountTheBeatMiniGameService,getCountTheBeatPreparationMsForRound,getCountTheBeatSchedule,getBeatLanePositions} = require(path.join(root,'src/game-core/minigames/count-the-beat/count-the-beat-service.ts'));
const config = JSON.parse(fs.readFileSync(path.join(root,'public/assets/game/runtime/config/gameplay-config.json'),'utf8'));
const windowMs = config.tour.phaseDurationsMs.answer_window_open;
assert.equal(windowMs,20_000, 'the answer timer should be the full normal 20s after counting');
assert(!('count-the-beat' in config.tour.miniGamePhaseOverridesMs), 'obsolete combined preview+answer window must not return');
const expected = [54,60,66];
const expectedRows = [1,2,4];
let cases = 0;
for (let round=1; round<=3; round++) for (let seed=1; seed<=800; seed++) {
  const svc = new CountTheBeatMiniGameService();
  svc.startRound(round, seed * 1297);
  svc.setStatus('answering');
  const data = svc.getSnapshot('ar').countTheBeat;
  assert.equal(data.bpm,expected[round-1]);
  assert.equal(data.targetCount,null,'target count must stay hidden');
  assert.equal(data.items.length,[12,14,16][round-1], 'fixed beat count keeps preview time aligned');
  assert(data.items.some(x => x.isTarget) && data.items.some(x => !x.isTarget));
  assert(data.items.every((x,i,all) => i<2 || x.icon!==all[i-1].icon || x.icon!==all[i-2].icon),'no triple identical flash');
  assert(data.items.every(x => x.size===1 && x.tone==='cyan' && x.rotate===0), 'no visual identity leaks');
  assert.equal(data.lanes,expectedRows[round-1]);
  assert(data.items.every(x => getBeatLanePositions(data.lanes).includes(x.y) && [18,34,50,66,82].includes(x.x)), 'icons must stay on guide rows');
  assert.equal(new Set(data.items.map(x=>x.delayMs)).size,data.items.length,'one symbol per beat');
  const sorted = [...data.items].sort((a,b)=>a.delayMs-b.delayMs);
  assert.deepEqual(sorted.map(x=>[x.delayMs,x.durationMs]),getCountTheBeatSchedule(round).map(x=>[x.delayMs,x.durationMs]));
  assert.equal(sorted[0].delayMs,0);
  for(let n=1;n<sorted.length;n++) assert(sorted[n-1].delayMs+sorted[n-1].durationMs < sorted[n].delayMs, 'no overlapping icons');
  const end = Math.max(...sorted.map(x=>x.delayMs+x.durationMs));
  const previewMs=getCountTheBeatPreparationMsForRound(round);
  assert(previewMs>end && previewMs-end<=350, 'open answers immediately after the last symbol fades');
  assert(end < 16_000, 'sequence too long');
  const gaps=sorted.slice(1).map((item,index)=>item.delayMs-sorted[index].delayMs);
  assert(gaps.at(-1)<gaps[0],'tempo must accelerate during the SAME question');
  // Target shape and tone/size/position must be visually independent.
  assert(data.items.filter(x=>x.isTarget).every(x=>x.icon===data.targetIcon));
  assert(data.items.filter(x=>!x.isTarget).every(x=>x.icon!==data.targetIcon));
  svc.resolveRound();
  assert.equal(svc.getSnapshot('en').countTheBeat.targetCount,sorted.filter(x=>x.isTarget).length);
  cases++;
}
const screen=fs.readFileSync(path.join(root,'src/ui-react/components/gameplay/minigames/CountTheBeatScreen.tsx'),'utf8');
assert(!screen.includes('TONE_COLOUR') && !screen.includes('item.isTarget'), 'no per-target color / emphasis');
assert(screen.includes('const [startDelay] = useState'), 'animation delay must not restart each render');
assert(screen.includes("tourPhase === 'tour_starting'"), 'beats must play in the non-answer phase');
assert(screen.includes("tourPhase === 'answer_window_open'"), 'answer callout only when the real answer timer starts');
assert(screen.includes('ctb-answer-turn'), 'players must see when answers open');
assert(screen.includes('BeatStageLanes'), 'live row guides missing');
const tutorial=fs.readFileSync(path.join(root,'src/ui-react/components/gameplay/shared/AllGamesTwoPageIntro.tsx'),'utf8');
assert(!tutorial.includes('i%2?\'#f5a7ec\''), 'tutorial still claims multicolor icons');
const store=fs.readFileSync(path.join(root,'src/game-core/app/game-store.ts'),'utf8');
const overlay=fs.readFileSync(path.join(root,'src/ui-react/components/gameplay/GameplayOverlay.tsx'),'utf8');
assert(store.includes('getCountTheBeatPreparationMsForRound(questionNumber)'), 'each mini-game segment must use its own beat preview duration');
assert(overlay.includes("miniGame.id === 'count-the-beat'"), 'screen must mount during tour_starting');
assert(tutorial.includes('tutorial.twoPage.count.the.beat.pages.2.lines.1'), 'how-to must use the translated two-phase counting lesson');
const translations = fs.readFileSync(path.join(root,'src/game-core/localization/translations.ts'),'utf8');
assert(translations.includes('بعد ما كل الرموز تختفي'), 'Arabic translation must describe separate counting/answer phases');
// Actual GameStore/FSM integration: answer gate and 20s timer only open
// AFTER the non-answer visual preparation phase (same game across rounds).
const { GameStore } = require(path.join(root,'src/game-core/app/game-store.ts'));
const { GameEventBus } = require(path.join(root,'src/game-core/events/game-event-bus.ts'));
const storeInstance = new GameStore(new GameEventBus());
try {
  storeInstance.submitTwitchChatMessage({
    twitchUserId:'beat-player',displayName:'Beat Player',message:'!join',
    isBroadcaster:false,isMod:false,badges:[],timestamp:Date.now(),
  });
  storeInstance.startTour(3,['count-the-beat'],'mini-game');
  assert.equal(storeInstance.getSnapshot().tour.phase,'mini_game_intro');
  for(let round=1;round<=3;round++) {
    if (storeInstance.getSnapshot().tour.phase==='mini_game_intro') storeInstance.skipPhase();
    const preparation=storeInstance.getSnapshot();
    assert.equal(preparation.tour.phase,'tour_starting');
    assert.equal(preparation.tour.phaseDurationMs,getCountTheBeatPreparationMsForRound(round));
    assert.equal(preparation.tour.acceptsAnswers,false);
    assert.equal(preparation.miniGame.acceptsAnswers,false);
    // The chat gate is independent of rendering. Early answers must fail.
    const premature=storeInstance.submitTwitchChatMessage({
      twitchUserId:'beat-player',displayName:'Beat Player',message:'!6',
      isBroadcaster:false,isMod:false,badges:[],timestamp:Date.now(),
    });
    assert.equal(premature.ok,false,'chat accepted during counting');
    storeInstance.pauseTour();
    assert.equal(storeInstance.getSnapshot().tour.isPaused,true);
    assert.equal(storeInstance.getSnapshot().tour.acceptsAnswers,false);
    storeInstance.resumeTour();
    assert.equal(storeInstance.getSnapshot().tour.isPaused,false);
    storeInstance.skipPhase();
    const answering=storeInstance.getSnapshot();
    assert.equal(answering.tour.phase,'answer_window_open');
    assert.equal(answering.tour.phaseDurationMs,20_000,'must grant FULL answer time');
    assert.equal(answering.tour.acceptsAnswers,true);
    assert.equal(answering.miniGame.acceptsAnswers,true);
    assert.equal(answering.miniGame.countTheBeat.targetCount,null);
    storeInstance.skipPhase();
    assert.equal(storeInstance.getSnapshot().tour.phase,'scoring');
    if(round<3) storeInstance.skipPhase();
  }
} finally { storeInstance.destroy(); }

console.log(`V77 Beat Phase PASS: ${cases} rounds, separate count/answer phases, clear callout, full ${windowMs/1000}s Twitch answer time.`);
