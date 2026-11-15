'use strict';
/** Question -> mini-game -> Tour projection, grouping, time and tie priority. */
require('./qa/ts-register.cjs');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { GameStore } = require('../src/game-core/app/game-store.ts');
const { GameEventBus } = require('../src/game-core/events/game-event-bus.ts');
const { segmentForRound, scopeScoreboardRows } = require('../src/game-core/awards/scoreboard-levels.ts');
const { CommandParser } = require('../src/game-core/twitch/command-parser.ts');
const send = (store, id, message) => store.submitTwitchChatMessage({
  twitchUserId:id,displayName:id,isBroadcaster:false,isMod:false,badges:[],message,timestamp:Date.now(),
});
assert.equal(new CommandParser().parse('!12').kind,'answer','numeric counting answers must route');
assert.equal(new CommandParser().parse('!99').kind,'answer');
assert.equal(new CommandParser().parse('!100').kind,'unknown');

// Pure score projection NEVER takes the full-Tour total as an intermediate input.
const sample = [
  { twitchUserId:'a', displayName:'Alice', role:'official', roundPoints:[100,0,10,0,20], total:130, answerOrders:[1,0,3,0,9] },
  { twitchUserId:'b', displayName:'Bob', role:'official', roundPoints:[50,90,0,20,100], total:260, answerOrders:[2,4,0,6,8] },
];
assert.deepEqual(scopeScoreboardRows(sample,{kind:'question',round:1}).map(x=>[x.displayName,x.total]), [['Alice',100],['Bob',50]]);
assert.deepEqual(scopeScoreboardRows(sample,{kind:'mini-game',firstRound:2,lastRound:3}).map(x=>[x.displayName,x.total]), [['Bob',90],['Alice',10]]);
assert.deepEqual(scopeScoreboardRows(sample,{kind:'tour'}).map(x=>[x.displayName,x.total]), [['Bob',260],['Alice',130]]);
const tied=[
  { twitchUserId:'z',displayName:'Zee',role:'official',roundPoints:[100],total:100,answerOrders:[3] },
  { twitchUserId:'a',displayName:'Amy',role:'official',roundPoints:[100],total:100,answerOrders:[2] },
];
assert.equal(scopeScoreboardRows(tied,{kind:'question',round:1})[0].twitchUserId,'a','earlier answer breaks score ties');
assert.deepEqual(segmentForRound(['food-origin','food-origin','food-origin','shape-count','shape-count','shape-count'],4),{
  gameId:'shape-count',firstRound:4,lastRound:6,questionNumber:1,questionCount:3,
});

// UI Tour path: each game contributes all its configured questions in order.
{
 const store = new GameStore(new GameEventBus());
 try {
  assert(send(store,'alice','!join').ok);
  store.startTour(undefined,['food-origin','shape-count'],'tour');
  assert.equal(store.getSnapshot().tour.totalRounds,6);
  for(let q=1;q<=6;q++) {
   const snap=store.getSnapshot();
   const isFirst=q===1 || q===4;
   assert.equal(snap.tour.phase,isFirst?'mini_game_intro':'tour_starting');
   assert.equal(snap.miniGameSegment.questionNumber,(q-1)%3+1);
   assert.equal(snap.miniGameSegment.questionCount,3);
   assert.equal(snap.miniGameSegment.gameId,q<=3?'food-origin':'shape-count');
   if(isFirst)store.skipPhase();
   store.skipPhase();
   assert.equal(store.getSnapshot().tour.phase,'answer_window_open');
   store.skipPhase();
   assert.equal(store.getSnapshot().tour.phase,'scoring');
   assert.equal(store.getSnapshot().miniGameSegment.questionNumber,(q-1)%3+1);
   store.skipPhase();
  }
  const end=store.getSnapshot();
  assert.equal(end.tour.phase,'tour_complete');
  assert.equal(end.tour.totalRounds,6);
  assert.equal(end.miniGameSegment.gameId,'shape-count');
 } finally {store.destroy()}
}

// The two answer clocks are independent: late correct Food answer has exactly
// half the early points, never quarter credit from double-applying the hint.
{
 const store = new GameStore(new GameEventBus());
 const realNow=Date.now;
 try {
  send(store,'fast','!join');send(store,'slow','!join');
  store.startTour(1,['food-origin'],'mini-game');store.skipPhase();store.skipPhase();
  const answer = store.foodOriginMiniGame.getCorrectOptionNumber('en');
  assert(answer>=1&&answer<=4);
  const atStart=store.getSnapshot().tour;
  assert(send(store,'fast',`!${answer}`).ok);
  Date.now = () => (atStart.phaseStartedAt || realNow()) + Math.ceil(atStart.phaseDurationMs*.62);
  assert(send(store,'slow',`!${answer}`).ok);
  Date.now = realNow;
  store.skipPhase();
  const scores=Object.fromEntries(store.getSnapshot().lastRoundAwards.map(a=>[a.twitchUserId,a.points]));
  assert(scores.fast>0, 'first valid correct answer must earn points');
  assert.equal(scores.slow, Math.round(scores.fast*.5), 'late answer must score half, not quarter');
  const rows=store.getSnapshot().tourScoreboardRows;
  assert(rows.find(r=>r.twitchUserId==='fast').answerOrders[0] < rows.find(r=>r.twitchUserId==='slow').answerOrders[0]);
 } finally {Date.now=realNow;store.destroy()}
}
{
 const store=new GameStore(new GameEventBus());
 try {
  send(store,'z_first','!join');send(store,'a_second','!join');
  store.startTour(1,['food-origin'],'mini-game');store.skipPhase();store.skipPhase();
  const correct=store.foodOriginMiniGame.getCorrectOptionNumber('en');
  assert(send(store,'z_first',`!${correct}`).ok);
  assert(send(store,'a_second',`!${correct}`).ok);
  store.skipPhase();store.skipPhase();
  assert.equal(store.getSnapshot().tourAwards.champion?.twitchUserId,'z_first','first correct responder wins final score tie');
 } finally {store.destroy()}
}
const ui=fs.readFileSync(path.join(__dirname,'../src/ui-react/components/gameplay/scoreboard/Scoreboard.tsx'),'utf8');
assert(ui.includes('showMiniGameResult') && ui.includes("kind: 'question' as const") && ui.includes("kind: 'mini-game' as const"));
assert(ui.includes('scoreboard-scope-label-v79'), 'ranking label should sit next to the leaderboard');
console.log('V79 PASS — three isolated scoreboard levels, 6-question grouped Tour, half-time scoring, first-answer tie priority, single game result.');
