'use strict';
require('../../scripts/qa/ts-register.cjs');
const test=require('node:test');const assert=require('node:assert/strict');
const {TourStateMachine}=require('../../src/game-core/tours/tour-state-machine.ts');
const {ProgressionService, COMMAND_UNLOCKS, MAX_LEVEL}=require('../../src/game-core/progression/progression-service.ts');
const {getScoreboardPageCount,getScoreboardPageRows,clampScoreboardPage,getVisibleScoreboardRoundIndexes}=require('../../src/ui-react/components/gameplay/scoreboard/scoreboard-pagination.ts');
const {GameStore}=require('../../src/game-core/app/game-store.ts');
const {GameEventBus}=require('../../src/game-core/events/game-event-bus.ts');
const msg=(id,command)=>({twitchUserId:id,displayName:id,message:command,isBroadcaster:false,isMod:false,badges:[],timestamp:Date.now()});
for(const count of [1,2,3,5,7,10]){
 test(`FSM ${count} rounds: every phase and leaderboard hold is host-controlled`,()=>{
  const fsm=new TourStateMachine();
  try{assert.equal(fsm.getSnapshot().phase,'lobby_open');assert.equal(fsm.startTour(count).ok,true);
   for(let round=1;round<=count;round++){
    assert.equal(fsm.getSnapshot().phase,'mini_game_intro');assert.equal(fsm.getSnapshot().roundNumber,round);
    assert.equal(fsm.getSnapshot().phaseRemainingMs,0);
    assert.equal(fsm.getSnapshot().acceptsAnswers,false);
    assert.equal(fsm.skipCurrentPhase().ok,true);assert.equal(fsm.getSnapshot().phase,'tour_starting');
    assert.equal(fsm.skipCurrentPhase().ok,true);assert.equal(fsm.getSnapshot().phase,'answer_window_open');
    assert.equal(fsm.getSnapshot().acceptsAnswers,true);assert.equal(fsm.skipCurrentPhase().ok,true);
    assert.equal(fsm.getSnapshot().phase,'scoring');assert.equal(fsm.getSnapshot().acceptsAnswers,false);
    if(round<count)assert.equal(fsm.skipCurrentPhase().ok,true);
    else assert.equal(fsm.skipCurrentPhase().ok,true);
   }
   assert.equal(fsm.getSnapshot().phase,'tour_complete');assert.equal(fsm.getSnapshot().canStartTour,false);
   assert.equal(fsm.returnToLobbyFromFinalScoreboard().ok,true);
   assert.equal(fsm.getSnapshot().phase,'lobby_open');
  }finally{fsm.destroy();}
 });
}
for(const xp of [0,1,50,99,100,249,250,449,450,2699,2700,13699,13700,13701,999999]){
 test(`Progression XP=${xp}: monotonic level, bounded progress, no excess unlocks`,()=>{
  const p=new ProgressionService();const v=p.createView(xp);
  assert.equal(v.xp,xp);assert.ok(v.level>=1&&v.level<=MAX_LEVEL);assert.ok(v.progressPercent>=0&&v.progressPercent<=100);
  assert.equal(p.getLevelFromXp(xp),v.level);
  assert.equal(v.unlockedCommandIds.length,new Set(v.unlockedCommandIds).size);
  for(const id of v.unlockedCommandIds){const cmd=COMMAND_UNLOCKS.find(x=>x.id===id);assert.ok(cmd && cmd.levelRequired<=v.level);}
  assert.ok(p.getLevelFromXp(xp+1)>=v.level);
  if(xp>=13700) assert.equal(v.level,20);
 });
}
for(const n of [0,1,7,8,9,16,17,72,100,300,500]) {
 test(`Scoreboard paging ${n} users: no duplicates, sixteen per page, stable clamp`,()=>{
  const rows=Array.from({length:n},(_,i)=>({twitchUserId:`player${i}`,score:i}));const pages=getScoreboardPageCount(n);
  assert.equal(pages,Math.max(1,Math.ceil(n/16)));
  const flattened=Array.from({length:pages},(_,i)=>getScoreboardPageRows(rows,i)).flat();
  assert.deepEqual(flattened,rows);
  assert.ok(getScoreboardPageRows(rows,999).length<=16);
  assert.equal(clampScoreboardPage(999,pages),pages-1);
  assert.ok(getVisibleScoreboardRoundIndexes(10,10).length<=5);
 });
}
for(const at of ['intro','warmup','answer','scoring']) {
 test(`Tour early end during ${at}: one terminal scoreboard and safe return`,()=>{
  const store=new GameStore(new GameEventBus());
  try{store.submitTwitchChatMessage(msg('a','!join'));store.startTour(3,['food-origin','shape-count','maze-gates'],'tour');
   if(at==='warmup')store.skipPhase();
   if(at==='answer'){store.skipPhase();store.skipPhase();}
   if(at==='scoring'){store.skipPhase();store.skipPhase();store.skipPhase();}
   store.endTour();assert.equal(store.getSnapshot().tour.phase,'tour_complete');
   assert.equal(store.getSnapshot().sessionProgressionAwards.length,0);
   store.endTour();assert.equal(store.getSnapshot().tour.phase,'tour_complete');
   store.backToStage();assert.equal(store.getSnapshot().tour.phase,'lobby_open');
  }finally{store.destroy();}
 });
}
for(const phase of ['intro','answer','scoring']){
 test(`Restart ${phase}: returns to intro and rejects answers until open`,()=>{
  const store=new GameStore(new GameEventBus());
  try {store.submitTwitchChatMessage(msg('a','!join'));store.startTour(2,['food-origin','shape-count'],'tour');
   if(phase!=='intro'){store.skipPhase();store.skipPhase();}
   if(phase==='scoring')store.skipPhase();
   store.restartRound();assert.equal(store.getSnapshot().tour.phase,'mini_game_intro');
   assert.equal(store.getSnapshot().tour.acceptsAnswers,false);
   assert.ok(!store.submitTwitchChatMessage(msg('a','!1')).ok);
  }finally{store.destroy();}
 });
}

test('Different next minigame: illustrated how-to is shown again, not skipped',()=>{
 const store=new GameStore(new GameEventBus());
 try{store.submitTwitchChatMessage(msg('a','!join'));store.startTour(2,['food-origin','shape-count'],'tour');
  const first=store.getSnapshot().miniGame.id;
  store.skipPhase();store.skipPhase();store.skipPhase();
  assert.equal(store.getSnapshot().tour.phase,'scoring');store.skipPhase();
  const s=store.getSnapshot();
  assert.equal(s.tour.phase,'mini_game_intro','A new minigame must display how-to');
  assert.notEqual(s.miniGame.id,first,'Test fixture should rotate between two games');
 }finally{store.destroy();}
});

test('Same minigame in a three-question session: no repeated how-to screens',()=>{
 const store=new GameStore(new GameEventBus());
 try{store.submitTwitchChatMessage(msg('a','!join'));store.startTour(3,['food-origin'],'mini-game');
  for(let round=1;round<=3;round++) {
   if(round===1){assert.equal(store.getSnapshot().tour.phase,'mini_game_intro');store.skipPhase();}
   else assert.equal(store.getSnapshot().tour.phase,'tour_starting');
   store.skipPhase();assert.equal(store.getSnapshot().tour.phase,'answer_window_open');
   store.skipPhase();assert.equal(store.getSnapshot().tour.phase,'scoring');
   store.skipPhase();
  }
  assert.equal(store.getSnapshot().tour.phase,'tour_complete');
 }finally{store.destroy();}
});
