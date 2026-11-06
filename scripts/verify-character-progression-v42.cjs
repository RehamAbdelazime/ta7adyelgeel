/** V42: runtime character action, unlock gating, stable avatar and finale-only Level Up QA. */
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const ts = require('typescript');
require.extensions['.ts'] = (mod, filename) => mod._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  fileName: filename, compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
}).outputText, filename);
const root = path.resolve(__dirname, '..');
const { GameStore } = require(path.join(root, 'src/game-core/app/game-store.ts'));
const { GameEventBus } = require(path.join(root, 'src/game-core/events/game-event-bus.ts'));
const { ProgressionService } = require(path.join(root, 'src/game-core/progression/progression-service.ts'));
const { CommandParser } = require(path.join(root, 'src/game-core/twitch/command-parser.ts'));
let passed = 0;
function check(condition, detail) { assert.ok(condition, detail); passed++; }
const msg = (id, cmd) => ({ twitchUserId:id, displayName:id, message:cmd,
  isBroadcaster:false, isMod:false, badges:[], timestamp: Date.now() });
const store = new GameStore(new GameEventBus());
const send = (id, c) => store.submitTwitchChatMessage(msg(id,c));
const active = id => store.getSnapshot().characterActions.find(action => action.twitchUserId === id);
const makeLevel = (id, xp) => {
  const prog = new ProgressionService().createView(xp);
  store.profileService.updateProgress(id, { xp, level: prog.level });
  store.joinCitizen({ twitchUserId:id, displayName:id });
  store.twitchCommandRouter.cooldowns.clear();
};
try {
  check(send('low', '!join').ok, 'Join low failed');
  check(!send('low', '!wave').ok, 'Wave should be level-gated');
  check(active('low') === undefined, 'Locked command created stage effect');
  check(new CommandParser().parse('!victory').kind === 'victory', 'Victory command parser is missing');
  check(new CommandParser().parse('!فوز').kind === 'victory', 'Victory Arabic alias is missing');
  check(new ProgressionService().getLockedCommand('!victory', 19)?.levelRequired === 20, 'Victory not level 20');
  makeLevel('low', 100);
  check(send('low', '!wave').ok, 'Level 2 wave not accepted');
  check(active('low')?.kind === 'wave', 'Wave did not produce stage reaction');
  check(active('low').expiresAt > active('low').startedAt, 'Action missing expiry');
  check(!send('low', '!dance').ok, 'Dance used while locked');
  store.twitchCommandRouter.cooldowns.clear();
  check(!send('low', '!hi').ok, 'Spam cooldown did not block alias');
  store.characterActionCooldowns.clear();
  store.twitchCommandRouter.cooldowns.clear();
  check(send('low', '!profile').ok, 'Profile command failed');
  check(active('low')?.kind === 'profile', 'Profile is still only a hidden feed message');
  check(active('low').sequence >= 2, 'Repeated action did not get unique sequence');
  const roles = [
    { id:'dancer', xp:250, cmd:'!dance', kind:'dance' },
    { id:'emoter', xp:700, cmd:'!emote', kind:'emote' },
    { id:'cheerer', xp:1750, cmd:'!cheer', kind:'cheer' },
    { id:'challenger', xp:2700, cmd:'!challenge', kind:'challenge' },
    { id:'featured', xp:6700, cmd:'!spotlight', kind:'spotlight' },
    { id:'winner', xp:13700, cmd:'!victory', kind:'victory' },
  ];
  for (const {id,xp,cmd,kind} of roles) {
    check(send(id,'!join').ok, `${id} join failed`);
    makeLevel(id,xp);
    const res=send(id,cmd);
    if (kind === 'victory') {
      // The featured player's spotlight is still running: only one spotlight at once.
      check(!res.ok, 'Concurrent featured stage effects were allowed');
      store.characterActions.delete('featured');
      store.characterActionTimers.get('featured') && clearTimeout(store.characterActionTimers.get('featured'));
      store.characterActionTimers.delete('featured');
      store.twitchCommandRouter.cooldowns.clear();
      check(send(id,cmd).ok, 'Level 20 victory failed once spotlight cleared');
    } else check(res.ok, `${kind} not accepted`);
    check(active(id)?.kind===kind, `${kind} did not create visual action`);
  }
  check(!send('emoter', '!victory').ok, 'Level 5 stole Level 20 victory');
  const timeoutBefore=store.characterActionTimers.size;
  store.showCharacterAction('low','emote',20);
  check(store.characterActionTimers.size<=timeoutBefore+1,'Old action timer was not replaced');
  check(store.characterActions.get('low').kind==='emote','New animation did not replace old');

  // The real game still accepts answers while reactions are disabled on its timed surface.
  store.setForcedNextMiniGame('food-origin');
  store.startTour(1, ['food-origin'], 'mini-game');
  for(let i=0;i<9 && store.getSnapshot().tour.phase!=='answer_window_open';i++) store.skipPhase();
  check(store.getSnapshot().tour.phase==='answer_window_open','No timed game opened');
  store.characterActionCooldowns.clear();store.twitchCommandRouter.cooldowns.clear();
  check(!send('dancer','!dance').ok,'Reaction overlays can distract timed game');
  check(active('dancer')?.kind==='dance', 'Banned command erased previous action unexpectedly');
  const right = store.foodOriginMiniGame.activeChoices.findIndex(c => c.countryCode === store.foodOriginMiniGame.question.answer)+1;
  check(send('low',`!${right}`).ok,'Timed answers broken by character commands');
  store.skipPhase();
  check(store.getSnapshot().tour.phase==='scoring','Scoring transition broken');
  check(store.getSnapshot().sessionProgressionAwards.length===0,'XP shown before session end');
  store.skipPhase();
  check(store.getSnapshot().tour.phase==='tour_complete','Final results not reached');
  const award=store.getSnapshot().sessionProgressionAwards.find(x=>x.twitchUserId==='low');
  check(award?.xpEarned>0,'Final XP was not awarded');
  check(award?.newLevel>=2,'Old XP progression was reset');
  check(!Object.hasOwn(award,'coins'),'Currency was accidentally reintroduced');
} finally {store.destroy();}

// Verify the actual level-up path including newly unlocked commands.
const levelup = new GameStore(new GameEventBus());
try {
  levelup.submitTwitchChatMessage(msg('alice','!join'));
  levelup.profileService.updateProgress('alice',{xp:95,level:1});
  levelup.joinCitizen({twitchUserId:'alice',displayName:'alice'});
  levelup.startTour(1,['food-origin'],'mini-game');
  for(let i=0;i<9 && levelup.getSnapshot().tour.phase!=='answer_window_open';i++) levelup.skipPhase();
  const answer = levelup.foodOriginMiniGame.activeChoices.findIndex(c=>c.countryCode===levelup.foodOriginMiniGame.question.answer)+1;
  check(levelup.submitTwitchChatMessage(msg('alice',`!${answer}`)).ok,'Level-up sample did not answer');
  levelup.skipPhase();
  check(levelup.getSnapshot().characterActions.every(x=>x.kind!=='level_up'), 'LevelUp appeared before finale');
  levelup.skipPhase();
  const a=levelup.getSnapshot().sessionProgressionAwards.find(x=>x.twitchUserId==='alice');
  check(a?.previousLevel===1 && a?.newLevel>=2,'Award did not cross Level 2');
  check(a?.unlockedCommandIds.includes('wave'), 'Unlocked wave not shown in final XP award');
  check(levelup.getSnapshot().characterActions.some(x=>x.twitchUserId==='alice'&&x.kind==='level_up'&&x.level>=2),
    'No visible finale LevelUp action was emitted');
  check(levelup.getSnapshot().citizens.find(x=>x.twitchUserId==='alice').xp>=100,'XP not actually stored');
} finally { levelup.destroy(); }

const files = {
  avatar:'src/ui-react/components/gameplay/shared/citizen-helpers.ts',
  sprite:'src/ui-react/components/gameplay/citizens/CitizenPlaza.tsx',
  css:'src/ui-react/styles/character-progression-v42.css',
  board:'src/ui-react/components/gameplay/scoreboard/Scoreboard.tsx',
  main:'src/ui-react/main.tsx',
};
const content=Object.fromEntries(Object.entries(files).map(([key,rel])=>[key,fs.readFileSync(path.join(root,rel),'utf8')]));
check(content.avatar.includes('character-v42:${twitchUserId}') && !content.avatar.includes('CHARACTER_SESSION_SEED'), 'Avatar still randomized per session');
check(content.sprite.includes('citizen-action-callout-v42')&&content.sprite.includes('citizen-special-aura-v42'), 'React missing visible stage FX');
check(content.css.includes('prefers-reduced-motion')&&content.css.includes('citizen-action-dance-v42'), 'Effect CSS or accessibility fallback missing');
check(content.board.includes('score-xp-new-unlock-v42') && content.board.includes('unlockedCommandIds'), 'Final score does not show new unlocks');
check(content.main.includes('character-progression-v42.css'), 'CSS not imported');
check(fs.readFileSync(path.join(root,'src/game-core/progression/progression-service.ts'),'utf8').includes("id: 'victory'"), 'Victory level unlock missing');
console.log(`[PASS] V42 Character Progression: ${passed} runtime, UI and persistence-safety assertions`);
