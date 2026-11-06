/** Non-GUI QA load bench: 5 and 300 bots, randomized replies and active round transition. */
const assert=require('node:assert/strict');
const fs=require('node:fs');const path=require('node:path');
const ts=require('typescript');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,resolveJsonModule:true,esModuleInterop:true},fileName:f}).outputText,f);
const root=path.resolve(__dirname,'..');
const {GameStore}=require(root+'/src/game-core/app/game-store.ts');
const {GameEventBus}=require(root+'/src/game-core/events/game-event-bus.ts');
const {QaBotController,QA_BOT_PREFIX}=require(root+'/tests/helpers/qa-bot-controller.ts');
const store=new GameStore(new GameEventBus());const controller=new QaBotController({store});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
 try{
  controller.add(5);
  await sleep(50);
  assert.equal(store.getSnapshot().citizens.filter(c=>c.twitchUserId.startsWith(QA_BOT_PREFIX)).length,5);
  controller.add(300);
  await sleep(450);
  assert.equal(store.getSnapshot().citizens.filter(c=>c.twitchUserId.startsWith(QA_BOT_PREFIX)).length,305);
  assert.equal(controller.getSnapshot().count,305);
  store.startTour(2,['food-origin'],'tour');
  store.skipPhase();store.skipPhase();
  controller.setAuto(true,'mixed');
  await sleep(1300);
  const all=store.getSnapshot().miniGame.answerRecords.filter(x=>x.twitchUserId.startsWith(QA_BOT_PREFIX));
  assert.equal(all.length,305,`305 bots should answer exactly once (${all.length})`);
  assert.equal(new Set(all.map(x=>x.twitchUserId)).size,305);
  assert.equal(store.getSnapshot().miniGame.officialAnswerCount,305);
  // Add late bots to verify spectator scores remain separate.
  controller.add(25);
  await sleep(120);
  assert.equal(store.getSnapshot().citizens.filter(c=>c.role==='spectator').length,25);
  store.skipPhase();
  controller.setAuto(false);
  // Stress limit: simulate the full 500-bot crowd with extra late spectators.
  controller.add(170);
  await sleep(250);
  assert.equal(controller.getSnapshot().count,500);
  assert.equal(store.getSnapshot().citizens.filter(c=>c.twitchUserId.startsWith(QA_BOT_PREFIX)).length,500);
  assert.equal(store.getSnapshot().citizens.filter(c=>c.role==='spectator').length,195);

  store.endTour();store.backToStage();controller.clear();
  assert.equal(store.getSnapshot().citizens.filter(c=>c.twitchUserId.startsWith(QA_BOT_PREFIX)).length,0);
  assert.equal(store.createProfilesFile(new Date().toISOString()).profiles.length,0);
  console.log('V44 QA load PASS: 5 + 300 + 25 + 170 = 500 bots, 305 auto-answer once, 195 late spectators, cleanup and persistence isolation');
 } finally {controller.destroy();store.destroy();}
})().catch(error=>{console.error(error);process.exitCode=1;});
