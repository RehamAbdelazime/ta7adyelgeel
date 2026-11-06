'use strict';
require('../../scripts/qa/ts-register.cjs');
const test = require('node:test');
const assert = require('node:assert/strict');
const { GameStore } = require('../../src/game-core/app/game-store.ts');
const { GameEventBus } = require('../../src/game-core/events/game-event-bus.ts');
const { QaBotController, QA_BOT_PREFIX, qaAnswerOptions } = require('../../tests/helpers/qa-bot-controller.ts');
const { PUBLIC_MINI_GAME_IDS, MINI_GAME_IDS } = require('../../src/game-core/minigames/minigame-registry.ts');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const make = (id, message) => ({ twitchUserId: id, displayName: id, message, isBroadcaster: false, isMod: false, badges: [], timestamp: Date.now() });
const create = () => new GameStore(new GameEventBus());
const enterAnswers = store => {
  for (let attempts = 0; attempts < 6 && store.getSnapshot().tour.phase !== 'answer_window_open'; attempts++) store.skipPhase();
  assert.equal(store.getSnapshot().tour.phase, 'answer_window_open', 'Answer window did not open');
};
const finish = store => { for (let i = 0; i < 35 && store.getSnapshot().tour.phase !== 'tour_complete'; i++) store.skipPhase();
  assert.equal(store.getSnapshot().tour.phase, 'tour_complete'); };

test('catalog: every game ID unique; public/QA partition stable; deleted titles absent', () => {
  assert.equal(new Set(MINI_GAME_IDS).size, MINI_GAME_IDS.length);
  assert.equal(PUBLIC_MINI_GAME_IDS.length, 7);
  assert.equal(MINI_GAME_IDS.length, 9);
  for (const id of ['true-fake', 'before-after', 'guess-logo', 'hangman']) assert.ok(!MINI_GAME_IDS.includes(id));
});

for (const id of MINI_GAME_IDS) {
  for (const locale of ['en', 'ar']) {
    test(`${id}: ${locale}, intro / warmup / answers / scoring / final / lobby`, () => {
      const store = create();
      try {
        store.setLanguage(locale);
        store.setForcedNextMiniGame(id); // QA-only games must be forced through the QA override.
        assert.equal(store.submitTwitchChatMessage(make('official', '!join')).ok, true);
        store.startTour(1, [id], 'mini-game');
        assert.equal(store.getSnapshot().tour.phase, 'mini_game_intro');
        assert.equal(store.getSnapshot().miniGame.id, id);
        assert.ok(store.getSnapshot().miniGame.title);
        store.skipPhase();
        assert.equal(store.getSnapshot().tour.phase, 'tour_starting');
        enterAnswers(store);
        const snap = store.getSnapshot();
        assert.equal(snap.tour.acceptsAnswers, true);
        assert.equal(snap.miniGame.id, id);
        assert.ok(snap.miniGame.questionId, `${id}: no question`);
        const commands = qaAnswerOptions(snap);
        assert.ok(commands.length >= 2 && commands.length <= 4, `${id}: invalid answers ${commands}`);
        const first = store.submitTwitchChatMessage(make('official', commands[0]));
        assert.equal(first.ok, true, `${id}: first answer rejected: ${first.message}`);
        const second = store.submitTwitchChatMessage(make('official', commands[0]));
        assert.equal(second.ok, false, `${id}: repeat answer accepted`);
        store.skipPhase();
        assert.equal(store.getSnapshot().tour.phase, 'scoring');
        assert.equal(store.getSnapshot().sessionProgressionAwards.length, 0, 'XP awarded before final');
        store.skipPhase();
        assert.equal(store.getSnapshot().tour.phase, 'tour_complete');
        assert.ok(store.getSnapshot().sessionProgressionAwards.some(a => a.twitchUserId === 'official'));
        store.backToStage();
        assert.equal(store.getSnapshot().tour.phase, 'lobby_open');
      } finally { store.destroy(); }
    });
  }
}

for (const crowd of [1, 5, 25, 72]) {
  test(`roster and scoring with ${crowd} QA participants and a late spectator`, () => {
    const store = create();
    try {
      for(let i = 0; i < crowd; i++) assert.ok(store.submitTwitchChatMessage(make(`${QA_BOT_PREFIX}${i}`, '!join')).ok);
      store.startTour(1, ['food-origin'], 'mini-game');
      assert.equal(store.getSnapshot().citizens.filter(c=>c.role==='official').length, crowd);
      assert.ok(store.submitTwitchChatMessage(make('pre_answer', '!join')).ok, 'Signup before first question must be allowed');
      enterAnswers(store);
      assert.ok(store.submitTwitchChatMessage(make('late_viewer', '!join')).ok);
      const s = store.getSnapshot();
      assert.equal(s.citizens.find(c=>c.twitchUserId==='late_viewer').role, 'spectator');
      const ans = qaAnswerOptions(s)[0];
      assert.ok(store.submitTwitchChatMessage(make('late_viewer',ans)).ok);
      assert.ok(store.submitTwitchChatMessage(make(`${QA_BOT_PREFIX}0`,ans)).ok);
      store.skipPhase(); store.skipPhase();
      const fin = store.getSnapshot();
      assert.ok(!fin.sessionProgressionAwards.some(a=>a.twitchUserId==='late_viewer'));
      assert.ok(!fin.sessionProgressionAwards.some(a=>a.twitchUserId.startsWith(QA_BOT_PREFIX)));
      assert.ok(fin.tourScoreboardRows.some(c=>c.twitchUserId==='late_viewer' && c.role==='spectator'));
      store.backToStage();
      assert.equal(store.getSnapshot().citizens.find(c=>c.twitchUserId==='late_viewer').role,'official');
    } finally { store.destroy(); }
  });
}

test('pause freezes chat and host submissions; resume allows answer', () => {
  const store = create();
  try {
    store.submitTwitchChatMessage(make('user','!join'));
    store.startTour(1,['food-origin'],'mini-game'); enterAnswers(store);
    store.pauseTour(); assert.ok(store.getSnapshot().tour.isPaused);
    assert.ok(!store.submitTwitchChatMessage(make('user','!1')).ok);
    assert.ok(!store.submitPrivateStreamerAnswer({rawAnswer:'1'}).ok);
    store.resumeTour(); assert.ok(!store.getSnapshot().tour.isPaused);
    store.twitchCommandRouter.cooldowns.clear(); // Network-cooldown is separate from pause policy.
    assert.ok(store.submitTwitchChatMessage(make('user','!1')).ok);
  } finally {store.destroy();}
});

test('no XP for joining or each question; one final settlement, no coins', () => {
  const store = create();
  try {
    store.submitTwitchChatMessage(make('alice','!join'));
    assert.equal(store.getSnapshot().citizens.find(c=>c.twitchUserId==='alice').xp,0);
    store.startTour(3,['food-origin','shape-count','maze-gates'],'tour');
    for(let round=1;round<=3;round++) {
      enterAnswers(store);
      const snap = store.getSnapshot();
      store.submitTwitchChatMessage(make('alice',qaAnswerOptions(snap)[0]));
      assert.equal(store.getSnapshot().citizens.find(c=>c.twitchUserId==='alice').xp,0, 'XP leaked before final');
      store.skipPhase();
      if(round<3)store.skipPhase();
    }
    finish(store);
    assert.equal(store.getSnapshot().sessionProgressionAwards.filter(a=>a.twitchUserId==='alice').length,1);
    assert.ok(!JSON.stringify(store.getSnapshot().citizens).toLowerCase().includes('coins'));
  } finally {store.destroy();}
});

test('Chaos: forcing unsupported event cannot activate; forced valid event used next intro', () => {
  const store = create();
  try {
    store.submitTwitchChatMessage(make('alice','!join'));
    store.setChaosMode('off');store.forceNextChaosEvent('score_storm');
    store.startTour(2,['food-origin','shape-count'],'tour');
    assert.equal(store.getSnapshot().chaosEvent.id, null);
    store.forceNextChaosEvent('double_score');
    store.skipRound();
    assert.equal(store.getSnapshot().tour.roundNumber,2);
    assert.equal(store.getSnapshot().chaosEvent.id,'double_score');
  } finally {store.destroy();}
});

test('joining twice does not upgrade an already-registered spectator', () => {
  const store=create();
  try {store.submitTwitchChatMessage(make('official','!join'));store.startTour(1,['food-origin'],'mini-game');enterAnswers(store);
    store.submitTwitchChatMessage(make('late','!join'));
    store.submitTwitchChatMessage(make('late','!join'));
    assert.equal(store.getSnapshot().citizens.filter(c=>c.twitchUserId==='late').length,1);
    assert.equal(store.getSnapshot().citizens.find(c=>c.twitchUserId==='late').role,'spectator');
  } finally {store.destroy();}
});

test('QA auto-answer responds once; pause-safe; removals scoped to QA only', async () => {
  const store=create(); const controller=new QaBotController({store});
  try { store.submitTwitchChatMessage(make('real','!join')); controller.add(25); await sleep(70);
    assert.equal(store.getSnapshot().citizens.filter(c=>c.twitchUserId.startsWith(QA_BOT_PREFIX)).length,25);
    store.startTour(1,['food-origin'],'mini-game');enterAnswers(store);
    store.pauseTour();controller.setAuto(true); await sleep(70);
    assert.equal(store.getSnapshot().miniGame.answerRecords.length,0);
    store.resumeTour();await sleep(950);
    const records=store.getSnapshot().miniGame.answerRecords;
    assert.equal(records.filter(r=>r.twitchUserId.startsWith(QA_BOT_PREFIX)).length,25);
    controller.answerNow();await sleep(45);
    assert.equal(store.getSnapshot().miniGame.answerRecords.filter(r=>r.twitchUserId.startsWith(QA_BOT_PREFIX)).length,25);
    store.endTour();store.backToStage();controller.clear();
    assert.ok(store.getSnapshot().citizens.some(c=>c.twitchUserId==='real'));
    assert.equal(store.getSnapshot().citizens.filter(c=>c.twitchUserId.startsWith(QA_BOT_PREFIX)).length,0);
  } finally {controller.destroy();store.destroy();}
});


test('React StrictMode effect replay does not permanently disable QA bot controller', async () => {
  const store = create();
  const controller = new QaBotController({ store });
  try {
    // In React dev, mounted effects run setup, cleanup, setup again.
    controller.activate();
    controller.destroy();
    assert.equal(controller.getSnapshot().active, false);
    controller.activate();
    assert.equal(controller.getSnapshot().active, true);
    controller.add(5);
    assert.equal(store.getSnapshot().citizens.filter(c => c.twitchUserId.startsWith(QA_BOT_PREFIX)).length, 5,
      'Bots must join the real Twitch command router after StrictMode effect replay');
    assert.equal(store.getSnapshot().citizens.filter(c => c.role === 'official').length, 5);

    store.startTour(1, ['food-origin'], 'mini-game');
    enterAnswers(store);
    controller.answerNow();
    assert.equal(store.getSnapshot().miniGame.answerRecords.filter(c => c.twitchUserId.startsWith(QA_BOT_PREFIX)).length, 5);
    store.endTour();
    store.backToStage();
    controller.clear();
    assert.equal(store.getSnapshot().citizens.some(c => c.twitchUserId.startsWith(QA_BOT_PREFIX)), false);
    // Unmount cleanup is idempotent; a later real remount still works.
    controller.destroy();
    controller.destroy();
    controller.activate();
    controller.add(1);
    assert.equal(store.getSnapshot().citizens.filter(c => c.twitchUserId.startsWith(QA_BOT_PREFIX)).length, 1);
  } finally {
    controller.destroy(); store.destroy();
  }
});


test('Release GameProvider never exposes developer QA commands, bot controller or launcher', () => {
  const fs = require('node:fs');
  const path = require('node:path');
  const source = fs.readFileSync(path.join(__dirname, '../../src/ui-react/context/GameContext.tsx'), 'utf8');
  const app = fs.readFileSync(path.join(__dirname, '../../src/ui-react/App.tsx'), 'utf8');
  assert.ok(!source.includes('__TA7ADY_QA__') && !source.includes('QaBotController'));
  assert.ok(!app.includes('HostPanelToggle') && !app.includes('HostProductionPanel'));
});
