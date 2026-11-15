/* V85: actual FSM + GameStore Chaos cinematic, no React dependencies. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(
  ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    fileName:filename, compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}
  }).outputText, filename);
const root=path.resolve(__dirname,'..');
const {GameStore}=require(path.join(root,'src/game-core/app/game-store.ts'));
const {GameEventBus}=require(path.join(root,'src/game-core/events/game-event-bus.ts'));
const {PUBLIC_MINI_GAME_IDS}=require(path.join(root,'src/game-core/minigames/minigame-registry.ts'));
const {getTourPhaseTitleKey}=require(path.join(root,'src/game-core/tours/tour-phase-labels.ts'));
const {resolve}=require('path');
let assertions=0;function check(x,label){assert(x,label);assertions++;}
const msg=(id,message)=>({twitchUserId:id,displayName:id,message,isBroadcaster:false,isMod:false,badges:[],timestamp:Date.now()});
check(getTourPhaseTitleKey('chaos_announcement')==='tour.phase.chaosAnnouncement','phase translation key');
for(const gameId of PUBLIC_MINI_GAME_IDS){
  const store=new GameStore(new GameEventBus());
  try {
    check(store.submitTwitchChatMessage(msg('viewer','!join')).ok,`${gameId}: join`);
    store.forceNextChaosEvent('fast_window');
    store.startTour(2,[gameId],'mini-game');
    check(store.getSnapshot().tour.phase==='mini_game_intro',`${gameId}: howto before announcement`);
    store.skipPhase();
    let show=store.getSnapshot();
    check(show.tour.phase==='chaos_announcement',`${gameId}: separate announcement phase`);
    check(show.tour.phaseDurationMs===3900,`${gameId}: cinematic timing`);
    check(!show.tour.acceptsAnswers && !show.miniGame.acceptsAnswers,`${gameId}: questions locked during show`);
    check(!store.submitTwitchChatMessage(msg('viewer','!1')).ok,`${gameId}: early Twitch answer refused`);
    store.pauseTour();
    check(store.getSnapshot().tour.isPaused,`${gameId}: pause cinematic`);
    store.resumeTour();
    check(!store.getSnapshot().tour.isPaused,`${gameId}: resume cinematic`);
    store.skipPhase();
    let prep=store.getSnapshot();
    check(prep.tour.phase==='tour_starting' && !prep.tour.acceptsAnswers,`${gameId}: prep AFTER cinematic`);
    const prepTime=prep.tour.phaseDurationMs;
    store.skipPhase();
    check(store.getSnapshot().tour.phase==='answer_window_open',`${gameId}: answers only after prep`);
    check(store.getSnapshot().tour.phaseDurationMs===16000,`${gameId}: speed rush answer-only`);
    store.skipPhase();
    check(store.getSnapshot().tour.phase==='scoring',`${gameId}: scoring follows answer`);
    // Force another event, same minigame, without another tutorial.
    store.forceNextChaosEvent('risk_round');
    store.skipPhase();
    show=store.getSnapshot();
    check(show.tour.phase==='chaos_announcement' && show.chaosEvent.id==='risk_round',`${gameId}: next question needs its own reveal`);
    store.skipPhase();
    prep=store.getSnapshot();
    check(prep.tour.phase==='tour_starting' && prep.tour.phaseDurationMs >= 3_000 && (gameId==='count-the-beat' || gameId==='lucky-cup' || prep.tour.phaseDurationMs===prepTime),`${gameId}: visual preview must remain unchanged`);
  }finally{store.destroy();}
}
// Ordinary play: no extra phase or delay when Chaos is OFF.
{
  const store=new GameStore(new GameEventBus());
  try {
    store.registerStreamerPlayer({twitchUserId:'host',displayName:'Host'});
    store.startTour(2,['food-origin'],'mini-game');
    check(store.getSnapshot().tour.phase==='mini_game_intro','ordinary howto');
    store.skipPhase();
    check(store.getSnapshot().tour.phase==='tour_starting','non-chaos intro skipped instantly');
    store.skipPhase(); store.skipPhase(); store.skipPhase();
    check(store.getSnapshot().tour.phase==='tour_starting','ordinary second round no cinematic');
    store.endTour();
    check(store.getSnapshot().tour.phase==='tour_complete','ordinary finale');
  }finally{store.destroy();}
}
// Aborting during event must not leak cinematic or affect next session.
{
  const store=new GameStore(new GameEventBus());
  try{
    store.registerStreamerPlayer({twitchUserId:'host',displayName:'Host'});
    store.forceNextChaosEvent('double_score');
    store.startTour(1,['food-origin'],'mini-game');store.skipPhase();
    check(store.getSnapshot().tour.phase==='chaos_announcement','first question cinematic');
    store.endTour();
    check(store.getSnapshot().tour.phase==='tour_complete' && !store.getSnapshot().chaosEvent.active,'end tour clears event');
    store.backToStage();store.startTour(1,['food-origin'],'mini-game');store.skipPhase();
    check(store.getSnapshot().tour.phase==='tour_starting','event not leaked into another tour');
  }finally{store.destroy();}
}
const source=rel=>fs.readFileSync(resolve(root,rel),'utf8');
const overlay=source('src/ui-react/components/gameplay/GameplayOverlay.tsx');
const scene=source('src/ui-react/components/visual/GameSceneStage.tsx');
const announcement=source('src/ui-react/components/gameplay/ChaosShowAnnouncement.tsx');
const audio=source('src/ui-react/components/audio/RuntimeAudioManager.tsx');
const citizens=source('src/ui-react/components/gameplay/citizens/CitizenPlaza.tsx');
const css=source('src/ui-react/styles/chaos-show-v85.css');
check(overlay.includes("overlayMode === 'chaos-announcement'")&&overlay.includes('return null;'),'no tutorial/quiz under cinematic');
check(scene.includes('<ChaosShowAnnouncement')&&scene.indexOf('<ChaosShowAnnouncement')>scene.indexOf('<HostMascotLayer'),'separate top stage layer');
check(!overlay.includes('howto-chaos-v40'),'no old banner embedded in tutorial');
check(announcement.includes('chaos.show.title')&&announcement.includes('event.description'),'announces real event');
check(audio.includes('chaosMusicActive ? 1.08 : 1')&&audio.includes('if (music) music.playbackRate = 1'),'speed track and reset');
check(citizens.includes("phase === 'chaos_announcement'")&&citizens.includes("? 'run'"),'real sprites run');
check(css.includes('chaosV85Blackout')&&css.includes('chaosV85PlayerDash')&&css.includes('prefers-reduced-motion'),'flash/run/accessibility CSS');
for(const rel of ['src/ui-react/components/gameplay/ChaosShowAnnouncement.tsx','src/ui-react/components/gameplay/GameplayOverlay.tsx','src/ui-react/components/visual/GameSceneStage.tsx','src/ui-react/components/audio/RuntimeAudioManager.tsx','src/ui-react/components/gameplay/citizens/CitizenPlaza.tsx']) {
 const errs=ts.transpileModule(source(rel),{fileName:rel,reportDiagnostics:true,compilerOptions:{jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).diagnostics?.filter(d=>d.category===ts.DiagnosticCategory.Error)||[];
 check(errs.length===0,`TSX parse ${rel}`);
}
console.log(`V85 CHAOS SHOW PASS: ${assertions} assertions across all public games + UI/audio wiring.`);
