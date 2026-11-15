/** V82 re-verification of V78 score and ranking rules after V79's 3-level UI. */
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
require('./qa/ts-register.cjs');
const { GameStore } = require('../src/game-core/app/game-store.ts');
const { GameEventBus } = require('../src/game-core/events/game-event-bus.ts');
const { scopeScoreboardRows } = require('../src/game-core/awards/scoreboard-levels.ts');
const { getRoundScoreboardRows } = require('../src/ui-react/components/gameplay/scoreboard/round-score-ranking.ts');
const { getMiniGameBasePoints } = require('../src/game-core/minigames/scoring-policy.ts');
const { CommandParser } = require('../src/game-core/twitch/command-parser.ts');
const rows = [
  { twitchUserId:'z',displayName:'Zee',total:350,roundPoints:[100,40],answerOrders:[1,5] },
  { twitchUserId:'a',displayName:'Amy',total:250,roundPoints:[100,40],answerOrders:[2,4] },
];
assert.deepEqual(scopeScoreboardRows(rows,{kind:'question',round:1}).map(r=>r.twitchUserId),['z','a']);
assert.deepEqual(getRoundScoreboardRows(rows,1).map(r=>r.twitchUserId),['z','a']);
assert.deepEqual(getRoundScoreboardRows(rows,2).map(r=>r.twitchUserId),['a','z']);
assert.equal(scopeScoreboardRows(rows,{kind:'mini-game',firstRound:1,lastRound:2})[0].total,140);
assert.equal(scopeScoreboardRows(rows,{kind:'tour'})[0].total,140);
const ui=fs.readFileSync('src/ui-react/components/gameplay/scoreboard/Scoreboard.tsx','utf8');
const storeSource=fs.readFileSync('src/game-core/app/game-store.ts','utf8');
assert.match(ui,/scopeScoreboardRows/);
assert.match(ui,/kind: 'question' as const/);
assert.match(ui,/kind: 'mini-game' as const/);
assert.match(storeSource,/recordAcceptedAnswer\(twitchMessage.twitchUserId\)/);
assert.match(storeSource,/phase.phaseRemainingMs > phase.phaseDurationMs \/ 2/);
assert.match(storeSource,/answerOrder\?\.get\(award.twitchUserId\)\?\.early === false/);
assert.equal(new CommandParser().parse('!0').kind,'answer');
assert.equal(new CommandParser().parse('!99').kind,'answer');
assert.equal(new CommandParser().parse('!100').kind,'unknown');
const now=Date.now;
let tick=1_800_000_000_000;
Date.now=()=>tick;
const store=new GameStore(new GameEventBus());
const send=(id,text)=>store.submitTwitchChatMessage({
  twitchUserId:id,displayName:id,message:text,badges:[],isBroadcaster:false,isMod:false,timestamp:Date.now(),
});
try {
  for(const id of ['z-first','a-second','late']) assert(send(id,'!join').ok);
  store.startTour(1,['food-origin'],'mini-game');
  store.skipPhase(); store.skipPhase();
  const phase=store.getSnapshot().tour;
  const correct=store.foodOriginMiniGame.getCorrectOptionNumber('en');
  const base=getMiniGameBasePoints('food-origin',store.getSnapshot().miniGame.questionDifficulty);
  tick=phase.phaseStartedAt+phase.phaseDurationMs*.1;
  assert(send('z-first',`!${correct}`).ok);
  tick=phase.phaseStartedAt+phase.phaseDurationMs*.25;
  assert(send('a-second',`!${correct}`).ok);
  tick=phase.phaseStartedAt+phase.phaseDurationMs*.75;
  assert(send('late',`!${correct}`).ok);
  store.skipPhase();
  const scores=store.getSnapshot().tourScoreboardRows;
  assert.deepEqual(getRoundScoreboardRows(scores,1).map(x=>x.twitchUserId),['z-first','a-second','late']);
  assert.equal(scores.find(x=>x.twitchUserId==='late').roundPoints[0],Math.round(base/2));
  store.skipPhase();
  assert.equal(store.getSnapshot().tourAwards.champion.twitchUserId,'z-first');
} finally { Date.now=now; store.destroy(); }
console.log('V82 PASS: V78 timing/tie rules, both ranking implementations and V79 3-level score UI.');
