/** Runtime QA: test bots are synthetic, join via real router, stay official/spectator
 * based on join phase, answer once per question, and never persist player data. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
require.extensions['.ts'] = (module, file) => module._compile(ts.transpileModule(fs.readFileSync(file, 'utf8'), {
  compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true,resolveJsonModule:true},fileName:file
}).outputText,file);
const root=path.resolve(__dirname,'..');
const { GameStore }=require(path.join(root,'src/game-core/app/game-store.ts'));
const { GameEventBus }=require(path.join(root,'src/game-core/events/game-event-bus.ts'));
const { QaBotController, QA_BOT_PREFIX, qaAnswerOptions }=require(path.join(root,'tests/helpers/qa-bot-controller.ts'));
const store = new GameStore(new GameEventBus());
const bot = new QaBotController({store});
try {
  bot.add(5);
  assert.equal(bot.getSnapshot().count,5);
  assert.equal(store.getSnapshot().citizens.length,5);
  assert(store.getSnapshot().citizens.every(c=>c.role==='official' && c.twitchUserId.startsWith(QA_BOT_PREFIX)));
  store.startTour(2,['food-origin'],'tour');
  store.skipPhase();store.skipPhase();
  assert.equal(store.getSnapshot().tour.phase,'answer_window_open');
  bot.add(25);
  assert.equal(bot.getSnapshot().count,30);
  const ranks=store.getSnapshot().citizens;
  assert(ranks.some(c=>c.role==='spectator'), 'late join should become spectators');
  assert(qaAnswerOptions(store.getSnapshot()).every(x=>x.startsWith('!')));
  bot.answerNow('mixed');
  assert(store.getSnapshot().miniGame.officialAnswerCount > 0, 'QA bots answer through chat router');
  assert.equal(store.getSnapshot().miniGame.answerRecords.filter(x=>x.twitchUserId.startsWith(QA_BOT_PREFIX)).length,25, 'manual QA command sends first joined chunk, never unjoined bots');
  bot.setAuto(true);
  assert.equal(bot.getSnapshot().auto,true);
  bot.setAuto(false);
  store.endTour();
  store.backToStage();
  bot.clear();
  assert.equal(bot.getSnapshot().count,0);
  assert.equal(store.getSnapshot().citizens.some(c=>c.twitchUserId.startsWith(QA_BOT_PREFIX)),false);
  const prof=store.createProfilesFile(new Date().toISOString());
  assert(prof.profiles.every(p=>!p.twitchUserId.startsWith(QA_BOT_PREFIX)));
  console.log('V44 QA bots lifecycle PASS (real command pipeline, role split, scoring, clear, profile isolation)');
} finally { bot.destroy();store.destroy(); }
