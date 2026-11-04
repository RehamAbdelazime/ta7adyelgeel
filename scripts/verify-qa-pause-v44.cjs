/** Regression: auto-answer must not fire during pause or lose a question on resume. */
const assert=require('node:assert/strict');
const fs=require('node:fs'); const path=require('node:path');
const ts=require('/opt/nvm/versions/node/v22.16.0/lib/node_modules/typescript');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,resolveJsonModule:true,esModuleInterop:true},fileName:f}).outputText,f);
const root=path.resolve(__dirname,'..');
const {GameStore}=require(root+'/src/game-core/app/game-store.ts');
const {GameEventBus}=require(root+'/src/game-core/events/game-event-bus.ts');
const {QaBotController,QA_BOT_PREFIX}=require(root+'/src/ui-react/services/qa-bot-controller.ts');
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
 const store=new GameStore(new GameEventBus());const bot=new QaBotController({store});
 try {
  bot.add(5);
  store.startTour(2,['food-origin'],'tour');
  store.skipPhase();store.skipPhase();
  assert.equal(store.getSnapshot().tour.phase,'answer_window_open');
  bot.setAuto(true,'mixed');
  store.pauseTour();
  await sleep(850);
  assert.equal(store.getSnapshot().miniGame.answerRecords.filter(x=>x.twitchUserId.startsWith(QA_BOT_PREFIX)).length,0,'no synthetic answers during pause');
  store.resumeTour();
  await sleep(900);
  assert.equal(store.getSnapshot().miniGame.answerRecords.filter(x=>x.twitchUserId.startsWith(QA_BOT_PREFIX)).length,5,'auto-answer resumes for the same question');
  bot.setAuto(false);store.endTour();store.backToStage();bot.clear();
  console.log('V44 QA pause PASS: no paused answers, all 5 bots resume on same question');
 } finally {bot.destroy();store.destroy();}
})().catch(e=>{console.error(e);process.exitCode=1});
