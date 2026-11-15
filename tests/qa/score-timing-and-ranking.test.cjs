'use strict';
require('../../scripts/qa/ts-register.cjs');
const test = require('node:test');
const assert = require('node:assert/strict');
const { CommandParser } = require('../../src/game-core/twitch/command-parser.ts');
const { GameStore } = require('../../src/game-core/app/game-store.ts');
const { GameEventBus } = require('../../src/game-core/events/game-event-bus.ts');
const { getRoundScoreboardRows } = require('../../src/ui-react/components/gameplay/scoreboard/round-score-ranking.ts');
const { applyAnswerTimingScore } = require('../../src/game-core/minigames/answer-timing-scoring.ts');
const { getMiniGameBasePoints } = require('../../src/game-core/minigames/scoring-policy.ts');
const { PUBLIC_MINI_GAME_IDS } = require('../../src/game-core/minigames/minigame-registry.ts');
const message = (id, cmd) => ({ twitchUserId: id, displayName: id, message: cmd, isBroadcaster: false, isMod: false, badges: [], timestamp: Date.now() });
const correctFoodCommand = (store) => `!${store.foodOriginMiniGame.activeChoices.findIndex(c => c.countryCode === store.foodOriginMiniGame.question.answer)+1}`;

for (const gameId of PUBLIC_MINI_GAME_IDS) {
  test(`${gameId}: early correct answers always outscore late ones`, () => {
    const base = getMiniGameBasePoints(gameId, 'medium');
    const a = { twitchUserId:'a', displayName:'a', role:'official', points:base, isCorrect:true, scoreOutcome:'correct', difficulty:'medium', maxPoints:base };
    assert.equal(applyAnswerTimingScore(a, gameId, true).points, base);
    assert.equal(applyAnswerTimingScore(a, gameId, false).points, Math.round(base/2));
    assert.ok(base > Math.round(base/2));
  });
}
test('food late hint never stacks to a quarter; numeric near-miss is also time-weighted',()=>{
  const food = { twitchUserId:'a', displayName:'a', role:'official', points:60, maxPoints:60, isCorrect:true, difficulty:'medium', usedHint:true, scoreMultiplier:.5 };
  assert.equal(applyAnswerTimingScore(food,'food-origin',false).points,60);
  assert.equal(applyAnswerTimingScore(food,'food-origin',true).points,120);
  const partial = { twitchUserId:'a', displayName:'a', role:'official', points:45, maxPoints:180, isCorrect:false, scoreOutcome:'partial', difficulty:'medium' };
  assert.equal(applyAnswerTimingScore(partial,'count-the-beat',true).points,45);
  assert.equal(applyAnswerTimingScore(partial,'count-the-beat',false).points,23);
  const incorrect = { ...partial, points:0, scoreOutcome:'incorrect' };
  assert.equal(applyAnswerTimingScore(incorrect,'count-the-beat',false).points,0);
});

test('a round scoreboard shows only its own points and ranks ties by answer arrival',()=>{
  const entries = [
    { twitchUserId:'a',displayName:'A',roundPoints:[100,25],total:125,roundAnswerOrder:8,firstAnswerOrder:1 },
    { twitchUserId:'z',displayName:'Z',roundPoints:[80,25],total:105,roundAnswerOrder:7,firstAnswerOrder:2 },
    { twitchUserId:'b',displayName:'B',roundPoints:[0,50],total:50,roundAnswerOrder:9,firstAnswerOrder:3 },
  ];
  const round = getRoundScoreboardRows(entries,2);
  assert.deepEqual(round.map(e=>[e.twitchUserId,e.total]),[['b',50],['z',25],['a',25]]);
  assert.deepEqual(entries.map(e=>e.total),[125,105,50], 'do not mutate cumulative values');
});

test('live Food Origin: early vs late plus first-response tie (officials)',()=>{
  const realNow = Date.now;
  let now = 1_800_000_000_000;
  Date.now = () => now;
  const store = new GameStore(new GameEventBus());
  try {
    for(const user of ['zeta','alpha','later'])assert.equal(store.submitTwitchChatMessage(message(user,'!join')).ok,true);
    store.startTour(1,['food-origin'],'mini-game');
    store.skipPhase(); store.skipPhase();
    const phase = store.getSnapshot().tour;
    assert.equal(phase.phase,'answer_window_open');
    const start = phase.phaseStartedAt;
    const duration = phase.phaseDurationMs;
    const correct = correctFoodCommand(store);
    // Zeta and Alpha earn the same points; Zeta's accepted answer goes first.
    now = start + duration*0.12;
    assert.equal(store.submitTwitchChatMessage(message('zeta',correct)).ok,true);
    now = start + duration*0.21;
    assert.equal(store.submitTwitchChatMessage(message('alpha',correct)).ok,true);
    // The third answer is after half the answer window.
    now = start + duration*0.76;
    assert.equal(store.submitTwitchChatMessage(message('later',correct)).ok,true);
    store.skipPhase();
    const snap = store.getSnapshot();
    assert.equal(snap.tour.phase,'scoring');
    const rows = snap.tourScoreboardRows.filter(row=>row.role==='official');
    const base = getMiniGameBasePoints('food-origin',snap.miniGame.questionDifficulty);
    assert.equal(rows.find(r=>r.twitchUserId==='zeta').roundPoints[0],base);
    assert.equal(rows.find(r=>r.twitchUserId==='alpha').roundPoints[0],base);
    assert.equal(rows.find(r=>r.twitchUserId==='later').roundPoints[0],Math.round(base/2));
    assert.deepEqual(getRoundScoreboardRows(rows,1).map(r=>r.twitchUserId),['zeta','alpha','later']);
    store.skipPhase();
    const final = store.getSnapshot();
    assert.equal(final.tour.phase,'tour_complete');
    assert.equal(final.tourAwards.champion.twitchUserId,'zeta');
    assert.deepEqual(final.tourAwards.topOfficial.map(w=>w.twitchUserId),['zeta','alpha','later']);
  } finally { Date.now=realNow; store.destroy(); }
});

test('pause does not cause late answers to be incorrectly classified as early',()=>{
  const realNow=Date.now;
  let now=1_800_000_000_000;
  Date.now=()=>now;
  const store=new GameStore(new GameEventBus());
  try {
    for(const id of ['before','after'])assert.equal(store.submitTwitchChatMessage(message(id,'!join')).ok,true);
    store.startTour(1,['food-origin'],'mini-game');store.skipPhase();store.skipPhase();
    const phase=store.getSnapshot().tour;
    const cmd=correctFoodCommand(store),duration=phase.phaseDurationMs,started=phase.phaseStartedAt;
    now=started+duration*.67;
    assert.equal(store.submitTwitchChatMessage(message('before',cmd)).ok,true);
    store.pauseTour();
    now += 5*60*1000; // a long pause in wall time
    assert.equal(store.getSnapshot().tour.isPaused,true);
    store.resumeTour();
    now += 100;
    assert.equal(store.submitTwitchChatMessage(message('after',cmd)).ok,true);
    store.skipPhase();
    const rows=store.getSnapshot().tourScoreboardRows;
    const base=getMiniGameBasePoints('food-origin',store.getSnapshot().miniGame.questionDifficulty);
    for(const id of ['before','after']) assert.equal(rows.find(r=>r.twitchUserId===id).roundPoints[0],Math.round(base/2));
  }finally{Date.now=realNow;store.destroy();}
});

for (const gameId of ['laser-challenge', 'count-the-beat']) {
  test(`live ${gameId}: scoring starts after actual answer-window opening`, () => {
    const realNow=Date.now;
    let now=1_800_000_000_000;
    Date.now=()=>now;
    const store=new GameStore(new GameEventBus());
    try {
      for(const id of ['early','late'])assert.equal(store.submitTwitchChatMessage(message(id,'!join')).ok,true);
      store.startTour(1,[gameId],'mini-game');
      store.skipPhase();
      assert.equal(store.getSnapshot().tour.phase,'tour_starting');
      // A game can have a long preparation; answers remain closed throughout.
      assert.equal(store.getSnapshot().tour.acceptsAnswers,false);
      store.skipPhase();
      const phase=store.getSnapshot().tour;
      assert.equal(phase.phase,'answer_window_open');
      const target=gameId==='laser-challenge'
        ? store.laserChallengeMiniGame.round.correctTarget
        : store.countTheBeatMiniGame.round.targetCount;
      const command=`!${target}`;
      now=phase.phaseStartedAt + phase.phaseDurationMs*.2;
      assert.equal(store.submitTwitchChatMessage(message('early',command)).ok,true);
      now=phase.phaseStartedAt + phase.phaseDurationMs*.8;
      assert.equal(store.submitTwitchChatMessage(message('late',command)).ok,true);
      store.skipPhase();
      const data=store.getSnapshot();
      const base=getMiniGameBasePoints(gameId,data.miniGame.questionDifficulty);
      assert.equal(data.tourScoreboardRows.find(e=>e.twitchUserId==='early').roundPoints[0],base);
      assert.equal(data.tourScoreboardRows.find(e=>e.twitchUserId==='late').roundPoints[0],Math.round(base/2));
    } finally {Date.now=realNow;store.destroy();}
  });
}


test('Count the Beat numeric chat commands 0–99 are parsed, out-of-range input is not',()=>{
  const parser=new CommandParser();
  for(const n of [0,1,4,5,12,99])assert.equal(parser.parse(`!${n}`).kind,'answer');
  for(const raw of ['!100','!-1','!cat','!1.5'])assert.notEqual(parser.parse(raw).kind,'answer');
});

test('spectators use round points and first arrival; exactly halfway is the lower tier',()=>{
  const realNow=Date.now; let now=1_800_000_000_000; Date.now=()=>now;
  const store=new GameStore(new GameEventBus());
  try {
    assert.equal(store.submitTwitchChatMessage(message('host','!join')).ok,true);
    store.startTour(1,['food-origin'],'mini-game');store.skipPhase();store.skipPhase();
    const phase=store.getSnapshot().tour, cmd=correctFoodCommand(store);
    for(const id of ['z-viewer','a-viewer','mid-viewer'])assert.equal(store.submitTwitchChatMessage(message(id,'!join')).ok,true);
    now=phase.phaseStartedAt+phase.phaseDurationMs*.1;
    assert.equal(store.submitTwitchChatMessage(message('z-viewer',cmd)).ok,true);
    now=phase.phaseStartedAt+phase.phaseDurationMs*.2;
    assert.equal(store.submitTwitchChatMessage(message('a-viewer',cmd)).ok,true);
    now=phase.phaseStartedAt+phase.phaseDurationMs/2;
    assert.equal(store.submitTwitchChatMessage(message('mid-viewer',cmd)).ok,true);
    store.skipPhase();
    const s=store.getSnapshot();
    const spectators=getRoundScoreboardRows(s.tourScoreboardRows.filter(e=>e.role==='spectator'),1);
    assert.deepEqual(spectators.map(e=>e.twitchUserId),['z-viewer','a-viewer','mid-viewer']);
    assert.ok(spectators[0].total > spectators[2].total);
    assert.equal(spectators[0].total,spectators[1].total);
    assert.equal(spectators[2].total,Math.round(spectators[0].total/2));
  }finally{Date.now=realNow;store.destroy();}
});
