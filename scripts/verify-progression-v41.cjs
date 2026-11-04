/** V41: end-of-session XP is settled once and never awarded during a question. */
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const ts = require('/opt/nvm/versions/node/v22.16.0/lib/node_modules/typescript');
require.extensions['.ts'] = (module, filename) => {
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { fileName: filename,
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
  module._compile(code, filename);
};
const root=path.resolve(__dirname,'..');
const {GameStore}=require(path.join(root,'src/game-core/app/game-store.ts'));
const {GameEventBus}=require(path.join(root,'src/game-core/events/game-event-bus.ts'));
const {ProfileService}=require(path.join(root,'src/game-core/profiles/profile-service.ts'));
let checks=0;
function check(test, reason) { assert.ok(test, reason); checks++; }
const msg=(id,cmd)=>({twitchUserId:id,displayName:id,message:cmd,isBroadcaster:false,isMod:false,badges:[],timestamp:Date.now()});
const profileService=new ProfileService();
profileService.loadProfiles([{twitchUserId:'legacy',displayName:'Legacy',xp:250,coins:9999,level:3,totalOfficialWins:2,createdAt:'2024-01-01',lastSeenAt:'2024-01-02'}]);
check(profileService.getProfile('legacy').xp===250,'Legacy XP lost during currency removal');
check(!('coins' in profileService.getProfile('legacy')),'Legacy coins retained in memory');
check(!profileService.exportProfiles().some(p=>Object.hasOwn(p,'coins')),'Legacy coins would be re-saved');
const fakeStore=new GameStore(new GameEventBus());
const send=(id,c)=>fakeStore.submitTwitchChatMessage(msg(id,c));
const citizen=id=>fakeStore.getSnapshot().citizens.find(x=>x.twitchUserId===id);
const open=()=>{let i=0;while(fakeStore.getSnapshot().tour.phase!=='answer_window_open' && i++<8)fakeStore.skipPhase();check(fakeStore.getSnapshot().tour.phase==='answer_window_open','Could not open question');};
const correct=()=>fakeStore.foodOriginMiniGame.activeChoices.findIndex(c=>c.countryCode===fakeStore.foodOriginMiniGame.question.answer)+1;
try {
  check(send('alice','!join').ok && send('bob','!join').ok,'Official joins failed');
  fakeStore.setForcedNextMiniGame('food-origin');
  fakeStore.startTour(3,['food-origin'],'tour');
  check(fakeStore.getSnapshot().sessionProgressionAwards.length===0,'New Tour still displays previous XP');
  open();
  check(send('spect','!join').ok&&citizen('spect').role==='spectator','Spectator admission failed');
  fakeStore.twitchCommandRouter.cooldowns.clear();
  const right1=correct();
  check(send('alice','!'+right1).ok,'First official answer refused');
  check(send('bob','!'+((right1%4)+1)).ok,'Wrong answer refused');
  check(send('spect','!'+right1).ok,'Spectator answer refused');
  fakeStore.skipPhase();
  check(fakeStore.getSnapshot().tour.phase==='scoring','Scoring transition failed');
  check(citizen('alice').xp===0 && citizen('alice').level===1,'XP was prematurely granted at question scoring');
  check(fakeStore.profileService.getProfile('alice').xp===0,'Persistent XP changed before Tour finished');
  check(fakeStore.getSnapshot().sessionProgressionAwards.length===0,'Intermission shows settlement prematurely');
  const firstXps=fakeStore.pendingSessionXp.get(1);
  check(firstXps.get('alice').xp>0 && firstXps.get('bob').xp===0,'Wrong answers got points or correct XP');
  check(!firstXps.has('spect'),'Spectator acquired pending XP');

  fakeStore.skipPhase();open();
  fakeStore.twitchCommandRouter.cooldowns.clear();
  const right2=correct();
  check(send('alice','!'+right2).ok,'Second answer refused');
  fakeStore.skipPhase();
  check(citizen('alice').xp===0,'XP changed in second intermission');
  const secondAward=fakeStore.pendingSessionXp.get(2).get('alice').xp;
  check(secondAward>=8,'Second question lacks earned XP');
  fakeStore.skipPhase();open();
  fakeStore.twitchCommandRouter.cooldowns.clear();
  const right3=correct();
  check(send('alice','!'+right3).ok,'Third answer refused');
  fakeStore.skipPhase();
  check(citizen('alice').xp===0,'XP changed before final scoreboard');
  const thirdAward=fakeStore.pendingSessionXp.get(3).get('alice').xp;
  fakeStore.skipPhase(); // final
  check(fakeStore.getSnapshot().tour.phase==='tour_complete','No final screen');
  const aliceAward=fakeStore.getSnapshot().sessionProgressionAwards.find(x=>x.twitchUserId==='alice');
  const bobAward=fakeStore.getSnapshot().sessionProgressionAwards.find(x=>x.twitchUserId==='bob');
  check(aliceAward?.xpEarned===20+firstXps.get('alice').xp+secondAward+thirdAward+15,'Tour XP formula incorrect');
  check(bobAward?.xpEarned===20,'Wrong answer should still earn a single participation reward');
  check(aliceAward?.totalXp===citizen('alice').xp,'Final XP not applied');
  check(!fakeStore.getSnapshot().sessionProgressionAwards.some(x=>x.twitchUserId==='spect'),'Spectator received XP at finale');
  check(citizen('spect').xp===0,'Spectator XP changed');
  check(!Object.hasOwn(citizen('alice'),'coins'),'Coin currency leaked into citizen');
  const frozen=citizen('alice').xp;
  fakeStore.endTour();
  check(citizen('alice').xp===frozen,'Repeated endTour paid again');
  fakeStore.backToStage();
  check(citizen('alice').xp===frozen,'Returning to Lobby paid again');
  fakeStore.startTour(1,['food-origin'],'mini-game');
  check(fakeStore.getSnapshot().sessionProgressionAwards.length===0,'New session displayed stale XP');
  check(citizen('alice').xp===frozen,'Starting new game reset accumulated XP');
  open();
  fakeStore.twitchCommandRouter.cooldowns.clear();
  check(send('alice','!'+correct()).ok,'Single game answer refused');
  fakeStore.skipPhase();
  check(citizen('alice').xp===frozen,'Single game paid before finish');
  const singleEarned=fakeStore.pendingSessionXp.get(1).get('alice').xp;
  fakeStore.skipPhase();
  const singleAward=fakeStore.getSnapshot().sessionProgressionAwards.find(x=>x.twitchUserId==='alice');
  check(singleAward?.xpEarned===singleEarned+10+8,'Single MiniGame XP formula incorrect');
  check(citizen('alice').xp===frozen+singleAward.xpEarned,'XP not carried between games');
} finally { fakeStore.destroy(); }
// Abandoned session and zero-answer members should never earn XP.
const none=new GameStore(new GameEventBus());
try { none.submitTwitchChatMessage(msg('idle','!join'));none.startTour(2,['food-origin'],'tour');none.endTour();
  check(none.getSnapshot().sessionProgressionAwards.length===0,'Idle join received XP on early end');
} finally {none.destroy();}
const config=fs.readFileSync(path.join(root,'public/assets/game/runtime/config/gameplay-config.json'),'utf8');
check(!/coins|officialParticipationXp|officialCorrectRewardByDifficulty/i.test(config),'Currency/old per-question rewards remain in config');
const scoreboard=fs.readFileSync(path.join(root,'src/ui-react/components/gameplay/scoreboard/Scoreboard.tsx'),'utf8');
check(scoreboard.includes('isFinal && selectedBoard === \'official\' ? <XpFinishBadge'), 'Final-only XP badge missing');
check(scoreboard.includes('result.newLevel > result.previousLevel') && scoreboard.includes('xpEarned'),'Level-up display missing');
const profiles=fs.readFileSync(path.join(root,'src/game-core/profiles/profile-service.ts'),'utf8');
check(profiles.includes('sanitizeProfile') && !profiles.includes('params.coins'), 'Currency migration incomplete');
console.log(`[PASS] V41 session progression: ${checks} runtime, migration, scoring and UI checks`);
