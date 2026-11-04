/* V39 runtime and visual-data integration: real GameStore transitions with Twitch-style commands.
 * Uses the same dependency-free TypeScript runtime harness as V35.
 */
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const ts = require('/opt/nvm/versions/node/v22.16.0/lib/node_modules/typescript');
require.extensions['.ts'] = (module, filename) => {
  const code = ts.transpileModule(fs.readFileSync(filename,'utf8'), {
    fileName: filename,
    compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop:true},
  }).outputText;
  module._compile(code,filename);
};
const root = path.resolve(__dirname,'..');
const { GameStore } = require(path.join(root,'src/game-core/app/game-store.ts'));
const { GameEventBus } = require(path.join(root,'src/game-core/events/game-event-bus.ts'));
const msg = (id,command) => ({twitchUserId:id,displayName:id,message:command,isBroadcaster:false,isMod:false,badges:[],timestamp:Date.now()});
const role = (store,id) => store.getSnapshot().citizens.find(x=>x.twitchUserId===id)?.role;
let checks=0;
function test(claim,message){assert(claim,message);checks++;}
function submit(store,id,text){return store.submitTwitchChatMessage(msg(id,text));}
const store = new GameStore(new GameEventBus());
try {
  store.registerStreamerPlayer({twitchUserId:'host',displayName:'Host'});
  test(submit(store,'early','!join').ok,'Lobby join rejected');
  store.citizens.set('early',{...store.citizens.get('early'),score:999});
  store.setForcedNextMiniGame('food-origin');
  store.startTour(2,['food-origin','shape-count'],'tour');
  test(store.getSnapshot().tour.phase==='mini_game_intro','First intro did not start');
  test(store.getSnapshot().citizens.find(x=>x.twitchUserId==='early').score===0,'New Tour inherited stale score');
  test(role(store,'host')==='official' && role(store,'early')==='official','Original players changed role');
  test(submit(store,'intro','!join').ok && role(store,'intro')==='official','Intro join was not Official');
  store.skipPhase(); // countdown
  test(submit(store,'countdown','!join').ok && role(store,'countdown')==='official','Countdown join was not Official');
  store.skipPhase(); // first question
  test(store.getSnapshot().tour.acceptsAnswers,'First question did not open');
  for(let i=1;i<=4;i++){
    const id='spect'+i;
    test(submit(store,id,'!join').ok && role(store,id)==='spectator', 'Late entrant gained Official role');
    submit(store,id,'!join'); test(role(store,id)==='spectator', 'Repeated join changed role');
    test(submit(store,id,'!'+i).ok,'Spectator answer was refused');
  }
  test(submit(store,'intro','!1').ok,'Official answer refused');
  store.pauseTour();
  test(store.getSnapshot().tour.isPaused,'Tour did not pause');
  test(submit(store,'latePaused','!join').ok && role(store,'latePaused')==='spectator','Pause admission wrong');
  test(!submit(store,'latePaused','!1').ok,'Paused spectator answer accepted');
  test(!store.submitPrivateStreamerAnswer({rawAnswer:'1',twitchUserId:'host'}).ok,'Paused host answer accepted');
  const scoresBefore=JSON.stringify(store.getSnapshot().citizens.map(x=>[x.twitchUserId,x.score]));
  store.resetRuntimeScores();
  test(scoresBefore===JSON.stringify(store.getSnapshot().citizens.map(x=>[x.twitchUserId,x.score])), 'Reset during Tour changed scores');
  store.clearSpectators();
  test(role(store,'spect1')==='spectator','Clear Spectators removed an active competitor');
  store.resumeTour();
  // Ignore the router's unrelated 1.2s per-user command cooldown in this fast-forward test.
  store.twitchCommandRouter.cooldowns.clear();
  test(submit(store,'latePaused','!2').ok,'Spectator cannot answer after resume');
  store.skipPhase(); // score
  test(store.getSnapshot().tour.phase==='scoring','Scoring phase did not appear');
  const result=store.getSnapshot();
  const spectatorRows=result.tourScoreboardRows.filter(row=>row.role==='spectator');
  const officialRows=result.tourScoreboardRows.filter(row=>row.role==='official');
  test(spectatorRows.length===5 && officialRows.length>=4,'Separate official/spectator rows missing');
  test(spectatorRows.some(row=>row.total>0),'No spectator scored across four multiple-choice answers');
  test(officialRows.every(row=>!spectatorRows.some(s=>s.twitchUserId===row.twitchUserId)),'Official and spectator ranks overlap');
  test(spectatorRows.every(row=>row.total===result.citizens.find(x=>x.twitchUserId===row.twitchUserId)?.score),'Spectator score mismatch');
  test(result.citizens.filter(x=>x.role==='spectator').every(x=>x.xp===0),'Spectator received XP');
  const spectatorWin=spectatorRows.find(row=>row.total>0);
  store.endTour(); // TourComplete
  test(store.getSnapshot().tour.phase==='tour_complete','Final scoreboard did not appear');
  test(store.getSnapshot().tourAwards.bestSpectator?.role==='spectator','Best Spectator award missing');
  test(store.getSnapshot().tourAwards.scoreboardRows.some(row=>row.twitchUserId===spectatorWin.twitchUserId && row.role==='spectator'),'Final Tour rows lost Spectator');
  const frozen=JSON.stringify(store.getSnapshot().tourAwards.scoreboardRows);
  submit(store,'afterFinal','!join');
  test(role(store,'afterFinal')==='spectator','Post-finale entrant must not enter previous Tour officially');
  test(JSON.stringify(store.getSnapshot().tourAwards.scoreboardRows)===frozen,'Post-final join changed frozen Tour leaderboard');
  store.backToStage();
  test(store.getSnapshot().tour.phase==='lobby_open','Did not return to Lobby');
  test(role(store,'spect1')==='official' && role(store,'afterFinal')==='official','Spectators not eligible next Tour');
  const previousXp=store.getSnapshot().citizens.find(x=>x.twitchUserId==='intro').xp;
  store.startTour(1,['food-origin'],'mini-game');
  test(store.getSnapshot().citizens.every(x=>x.score===0),'Scores not reset at start of next Tour');
  test(store.getSnapshot().citizens.find(x=>x.twitchUserId==='intro').xp===previousXp,'Progression lost on Tour reset');
  store.skipPhase(); store.skipPhase();
  store.skipPhase(); // scoring, first question (skipped) must lock
  submit(store,'skippedLate','!join');
  test(role(store,'skippedLate')==='spectator','Skipped first question reopened Official entries');
} finally { store.destroy(); }

// A Tour ended before the first question must still finalize its roster.
const endedEarly=new GameStore(new GameEventBus());
try {
  endedEarly.registerStreamerPlayer({twitchUserId:'host-early',displayName:'Host'});
  endedEarly.startTour(1,['food-origin'],'mini-game');
  endedEarly.endTour();
  test(endedEarly.getSnapshot().tour.phase==='tour_complete','Early end did not finalize');
  submit(endedEarly,'post-early','!join');
  test(role(endedEarly,'post-early')==='spectator','Early finale admitted an Official');
} finally {endedEarly.destroy();}

// Execute the actual reusable scoreboard mapper (extracted from TSX without React).
const scoreboardPath=path.join(root,'src/ui-react/components/gameplay/scoreboard/Scoreboard.tsx');
const screenText=fs.readFileSync(scoreboardPath,'utf8');
const sf=ts.createSourceFile(scoreboardPath,screenText,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
assert.equal(sf.parseDiagnostics.length,0,'Scoreboard TSX parse errors');
const fn=sf.statements.find(x=>ts.isFunctionDeclaration(x)&&x.name?.text==='buildReusableScoreboardRows');
assert(fn,'Scoreboard mapper is missing');
const moduleCode=ts.transpileModule(fn.getText(sf),{
  fileName:'scoreboard-row-map.ts',
  compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022},
}).outputText;
const mapperExports={};new Function('exports',moduleCode)(mapperExports);
const {buildReusableScoreboardRows}=mapperExports;
const players=[{twitchUserId:'o',displayName:'Official',role:'official',score:190},{twitchUserId:'s',displayName:'Spectator',role:'spectator',score:70}];
const rows=[{twitchUserId:'o',displayName:'Official',role:'official',total:190,roundPoints:[100,90]},{twitchUserId:'s',displayName:'Spectator',role:'spectator',total:70,roundPoints:[40,30]}];
const base={citizens:players,tourRows:rows,lastRoundAwards:[],totalRounds:2,currentRound:2};
test(buildReusableScoreboardRows({...base,role:'official'}).map(x=>x.twitchUserId).join(',')==='o','Official board leaked spectator');
test(buildReusableScoreboardRows({...base,role:'spectator'}).map(x=>x.twitchUserId).join(',')==='s','Spectator board leaked official');
test(buildReusableScoreboardRows({...base,role:'spectator'})[0].total===70,'Spectator total wrong');
test(buildReusableScoreboardRows({...base,role:'spectator',tourRows:[{...rows[1],total:0}],citizens:[players[1]]})[0].total===0,'Zero scoreboard total incorrectly fell back to runtime score');
const audiencePath=path.join(root,'src/ui-react/components/gameplay/shared/visible-audience.ts');
const audienceModule=ts.transpileModule(fs.readFileSync(audiencePath,'utf8'),{fileName:audiencePath,compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const crowdExports={};new Function('exports',audienceModule)(crowdExports);
const crowd=Array.from({length:100},(_,i)=>({twitchUserId:`v${i}`,joinedAt:i*100,role:i%3?'spectator':'official'}));
const visible=crowdExports.getVisibleAudience(crowd,null,new Set(['v99']));
test(visible.length===72 && visible.some(c=>c.twitchUserId==='v99'),'Crowded audience does not include active late spectator');
test(visible.slice(0,48).every((c,i)=>c.twitchUserId===`v${i}`),'Stable positions shifted in crowded audience');
console.log(`[PASS] V39 spectator runtime: ${checks} join/answer/score/finale/restart/scoreboard/audience assertions`);
