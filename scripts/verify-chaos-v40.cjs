/* V40 Chaos V2: runtime tests without downloaded dependencies. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('/opt/nvm/versions/node/v22.16.0/lib/node_modules/typescript');
require.extensions['.ts'] = (module, filename) => {
  const code = ts.transpileModule(fs.readFileSync(filename,'utf8'),{fileName:filename,
    compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
  module._compile(code,filename);
};
const root=path.resolve(__dirname,'..');
const {ChaosEventService,CHAOS_EVENTS,isChaosEventEligible}=require(path.join(root,'src/game-core/chaos/chaos-event-service.ts'));
const {ChaosRewardService}=require(path.join(root,'src/game-core/chaos/chaos-rewards.ts'));
const {GameStore}=require(path.join(root,'src/game-core/app/game-store.ts'));
const {GameEventBus}=require(path.join(root,'src/game-core/events/game-event-bus.ts'));
const award=(id='player',points=100,correct=true,role='official') => ({twitchUserId:id,displayName:id,role,points,isCorrect:correct,difficulty:'medium'});
const msg=(id,message)=>({twitchUserId:id,displayName:id,message,isBroadcaster:false,isMod:false,badges:[],timestamp:Date.now()});
let checks=0;
function check(predicate,description){assert(predicate,description);checks++}
const find=id=>CHAOS_EVENTS.find(e=>e.id===id);
check(CHAOS_EVENTS.length===6, 'V40 should have 6 curated events');
for(const removed of ['half_score','score_storm','chill_window'])check(!find(removed), `Stale event ${removed}`);
const eligibleParams={roundIndex:1,totalRounds:4,officialCount:5,spectatorCount:4,miniGameId:'food-origin'};
check(!isChaosEventEligible(find('spectator_mayhem'),{...eligibleParams,spectatorCount:0,goldenAlreadyPlayed:false}),'Spectator event without spectators');
check(!isChaosEventEligible(find('comeback_boost'),{...eligibleParams,officialCount:2,goldenAlreadyPlayed:false}),'Comeback event <3 officials');
for(const game of ['lucky-cup','memory-count','count-the-beat'])check(!isChaosEventEligible(find('fast_window'),{...eligibleParams,miniGameId:game,goldenAlreadyPlayed:false}),`Speed should exclude ${game}`);
check(!isChaosEventEligible(find('golden_round'),{...eligibleParams,roundIndex:4,goldenAlreadyPlayed:false}),'Golden on final round is useless');
const always=new ChaosEventService(()=>0);
always.beginTour();
check(always.selectForRound({...eligibleParams,chance:0})===null,'Zero chance should not select');
const sequence=[];
for(let roundIndex=1;roundIndex<=4;roundIndex++){
  const event=always.selectForRound({...eligibleParams,roundIndex,chance:1});
  check(!!event,'Always-trigger selector missed event');
  sequence.push(event.id);
}
for(let i=1;i<sequence.length;i++)check(sequence[i]!==sequence[i-1],'Repeated random event consecutively');
const forced=new ChaosEventService(()=>0.1);
forced.beginTour();
check(forced.selectForced('golden_round',eligibleParams)?.id==='golden_round','Forced Golden not accepted');
check(forced.selectForced('golden_round',{...eligibleParams,roundIndex:2})===null,'Golden reused twice in same Tour');
check(forced.selectForced('fast_window',{...eligibleParams,miniGameId:'lucky-cup'})===null,'Forced incompatible event must be denied');
forced.beginTour();
check(forced.selectForced('golden_round',eligibleParams)?.id==='golden_round','Golden not reset for new Tour');
const citizen=(id,score,role='official')=>({twitchUserId:id,displayName:id,score,role,joinedAt:0,level:1,xp:0,xpToNextLevel:100,progressPercent:0,unlockedCommandIds:[]});
const scoring=new ChaosEventService();
const people=[citizen('a',300),citizen('b',100),citizen('c',50),citizen('d',20),citizen('e',10),citizen('spect',0,'spectator')];
const sample=[award('a'),award('b'),award('c'),award('d'),award('e'),award('spect',100,true,'spectator')];
let adjusted=scoring.applyToAwards({event:find('comeback_boost'),awards:sample,citizens:people});
check(adjusted[0].points===100 && adjusted[1].points===100,'Leaders incorrectly boosted');
check(adjusted[2].points===200 && adjusted[3].points===200 && adjusted[4].points===200,'Trailing players did not get ×2');
check(adjusted[5].points===100,'Spectator got Official comeback boost');
adjusted=scoring.applyToAwards({event:find('spectator_mayhem'),awards:sample,citizens:people});
check(adjusted[5].points===200 && adjusted[0].points===100,'Spectator event leaked into Officials');
adjusted=scoring.applyToAwards({event:find('double_score'),awards:[award('a'),award('b',0,false)],citizens:people});
check(adjusted[0].points===200 && adjusted[1].points===0,'Double Score awarded wrong answer');
adjusted=scoring.applyToAwards({event:find('risk_round'),awards:[award('a',0,false),{...award('b',20,false),scoreOutcome:'partial'}],citizens:people});
check(adjusted[0].points===-30 && adjusted[1].points===20,'Risk penalty incorrectly applied to numeric near-miss');
const rs=new ChaosRewardService();
rs.beginTour();rs.awardGolden('a');
let r=rs.applyToAwards([award('a',-30,false),award('spect',-30,false,'spectator')]);
check(r.awards[0].points===0 && r.blocked.length===1,'Shield did not block one penalty');
check(r.awards[1].points===-30,'Spectator shield unexpectedly protected');
check(rs.getSnapshot()[0].shield===0 && rs.getSnapshot()[0].boost===1,'Wrong reward charge consumed');
r=rs.applyToAwards([award('a',100,true)]);
check(r.awards[0].points===125 && r.boosted.includes('a'),'Golden boost not applied');
r=rs.applyToAwards([award('a',100,true)]);
check(r.awards[0].points===100,'Golden boost repeated');
check(rs.getSnapshot()[0].crown,'Crown should remain as cosmetic Tour badge');
rs.beginTour();check(rs.getSnapshot().length===0,'Next Tour leaked old rewards');

// End-to-end GameStore with actual Twitch chat commands and phase machine.
const store=new GameStore(new GameEventBus());
const send=(id,command)=>store.submitTwitchChatMessage(msg(id,command));
const getCitizen=id=>store.getSnapshot().citizens.find(p=>p.twitchUserId===id);
const openAnswerWindow=()=>{while(store.getSnapshot().tour.phase!=='answer_window_open'){store.skipPhase();}};
const scoreNow=()=>{store.skipPhase();check(store.getSnapshot().tour.phase==='scoring','Score phase did not start');};
const getCorrectOption=()=>store.foodOriginMiniGame.activeChoices.findIndex(c=>c.countryCode===store.foodOriginMiniGame.question.answer)+1;
try {
  store.registerStreamerPlayer({twitchUserId:'host',displayName:'Host'});
  check(send('winner','!join').ok && send('runner','!join').ok,'Player joins failed');
  store.forceNextChaosEvent('golden_round');
  store.startTour(3,['food-origin'],'tour');
  check(store.getSnapshot().chaosEvent.id==='golden_round','First Golden event did not trigger in intro');
  check(store.getSnapshot().chaosRewards.length===0,'Reward granted before correct answer');
  openAnswerWindow();
  const good1=getCorrectOption();
  store.twitchCommandRouter.cooldowns.clear();
  check(send('winner','!'+good1).ok,'Golden correct answer refused');
  check(send('spect','!join').ok,'Spectator cannot join after first open');
  store.twitchCommandRouter.cooldowns.clear();
  check(send('spect','!'+good1).ok,'Spectator answer refused');
  scoreNow();
  const reward=store.getSnapshot().chaosRewards.find(r=>r.twitchUserId==='winner');
  check(reward?.shield===1 && reward?.boost===1 && reward?.crown,'Golden winner missed two rewards');
  check(!store.getSnapshot().chaosRewards.some(r=>r.twitchUserId==='spect'),'Golden reward leaked to Spectator');
  store.forceNextChaosEvent('risk_round');
  store.skipPhase(); // next round: tour_starting, selected at phase transition
  check(store.getSnapshot().chaosEvent.id==='risk_round','Forced Risk on second round missing');
  openAnswerWindow();
  const good2=getCorrectOption(); const bad2=(good2%4)+1;
  store.twitchCommandRouter.cooldowns.clear();
  check(send('winner','!'+bad2).ok,'Risk wrong answer refused');
  scoreNow();
  const w2=store.getSnapshot().chaosRewards.find(r=>r.twitchUserId==='winner');
  check(w2?.shield===0 && w2?.boost===1,'Risk should consume Shield, not boost');
  check(store.getSnapshot().lastRoundAwards.find(a=>a.twitchUserId==='winner')?.points===0,'Shield did not protect Risk penalty');
  store.forceNextChaosEvent('double_score');
  store.skipPhase();
  check(store.getSnapshot().chaosEvent.id==='double_score','Third forced Double missing');
  openAnswerWindow();
  const good3=getCorrectOption();
  store.twitchCommandRouter.cooldowns.clear();
  check(send('winner','!'+good3).ok,'Next correct answer refused');
  scoreNow();
  const w3=store.getSnapshot().chaosRewards.find(r=>r.twitchUserId==='winner');
  check(w3?.shield===0 && w3?.boost===0 && w3?.crown,'Boost should spend on next correct answer');
  const third=store.getSnapshot().lastRoundAwards.find(a=>a.twitchUserId==='winner');
  check(third.points>0 && third.points%1===0,'Boost produced invalid score');
  const before=store.getSnapshot().citizens.find(c=>c.twitchUserId==='winner').score;
  check(before>=third.points,'Reward score not reflected in runtime leaderboard');
  const frozen=store.getSnapshot().tourScoreboardRows.find(r=>r.twitchUserId==='winner');
  check(frozen.total===before,'Tour scoreboard did not track final boosted points');
  store.endTour();store.backToStage();
  check(store.getSnapshot().chaosRewards.length===0,'Rewards not cleared on return to Lobby');
  store.startTour(1,['food-origin'],'mini-game');
  check(store.getSnapshot().chaosRewards.length===0,'Rewards leaked to next Tour');
} finally {store.destroy();}
// TSX + CSS and UI bindings
for(const file of ['src/ui-react/components/gameplay/GameplayOverlay.tsx','src/ui-react/components/gameplay/scoreboard/Scoreboard.tsx','src/ui-react/components/streamer/HostProductionPanel.tsx']){
  const code=fs.readFileSync(path.join(root,file),'utf8');
  const diagnostics=ts.transpileModule(code,{fileName:file,compilerOptions:{jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022},reportDiagnostics:true}).diagnostics ?? [];
  check(!diagnostics.some(d=>d.category===ts.DiagnosticCategory.Error),`TSX syntax failure: ${file}`);
}
const sheet=fs.readFileSync(path.join(root,'src/ui-react/styles/chaos-v40.css'),'utf8');
check(sheet.includes('gameplay-chaos-mini-v40')&&sheet.includes('chaos-rewards-v40'),'Missing badge style');
console.log(`V40 Chaos V2 PASS: ${checks} runtime and integration assertions`);
