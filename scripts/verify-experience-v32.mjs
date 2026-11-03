/** V32 deterministic structural regressions; does not require a browser. */
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(resolve(root, p), 'utf8');
const screens = [
  'BeforeOrAfter','CountTheBeat','CoupleOrSiblings','FoodOrigin','GuessLogo',
  'Hangman','LuckyCup','MazeGates','MemoryCount','ShapeCount','TrueFake',
];
function assert(condition, message) {if (!condition) throw Error('V32: '+message);}
const overlay = read('src/ui-react/components/gameplay/GameplayOverlay.tsx');
const shell = read('src/ui-react/components/gameplay/shared/question-shell.tsx');
const scene = read('src/ui-react/components/visual/GameSceneStage.tsx');
const store = read('src/game-core/tours/tour-phase-definitions.ts');
const spotlights = read('src/ui-react/components/gameplay/citizens/ChoiceSpotlights.tsx');
const registry = read('src/game-core/minigames/minigame-registry.ts');
const visual = read('src/ui-react/components/gameplay/shared/MiniGameIntroIllustration.tsx');
const css = read('src/ui-react/styles/experience-unification-v32.css');
const modern = read('src/ui-react/components/gameplay/shared/modern-question-games.ts');
assert(!overlay.includes('4800') && !overlay.includes('setTimeout('), 'answer reveal must NOT auto-advance');
assert(overlay.includes('RoundRevealProvider') && overlay.includes('setCompletedScoringRevealKey(scoringRevealKey)'), 'host-reveal handoff required');
assert(store.includes("phase: 'scoring'") && /phase: 'scoring'[\s\S]{0,180}durationMs: 0/.test(store), 'scoring must stay host-controlled');
assert(shell.includes('continueToLeaderboard ?? actions.skipPhase'), 'reveal button must lead to score, not skip');
assert(!shell.includes('qshell-next-button" type="button"'), 'remove outdated tiny footer next button');
assert(scene.includes('GameViewSnapshotProvider') && scene.includes('curtainPhase'), 'freeze old stage until curtain closes');
assert(!spotlights.includes('answer-lane-label-v20"'), 'remove duplicated floor number tiles');
assert(visual.includes('EXAMPLE_ANSWERS') && visual.includes('INTRO_STEP_ICONS'), 'illustrations + icon steps required');
assert(visual.match(/case '[^']+':/g)?.length === 11, 'every mini-game has one illustration');
assert(css.includes('qshell-reveal-primary-action') && css.includes('position: absolute !important'), 'floating action must not move answers');
for (const name of screens) {
  const screen = read(`src/ui-react/components/gameplay/minigames/${name}Screen.tsx`);
  assert(screen.includes('QuestionScreenShell'), `${name} must render the common shell`);
  assert(screen.includes('layout="') || screen.includes('layout={'), `${name} must explicitly opt into shared layout`);
}
for (const id of ['food-origin','shape-count','maze-gates','before-after','guess-logo','count-the-beat','lucky-cup','true-fake','memory-count','hangman','couple-or-siblings']) {
  assert(modern.includes(`'${id}'`), `${id} must be in shared question screen set`);
  assert(registry.includes(`id: '${id}'`), `${id} must be registered`);
  assert(existsSync(resolve(root, 'src/ui-react/styles/experience-unification-v32.css')), 'styles exist');
}
for (const id of ['beat','lucky']) {
  assert(registry.includes(`gameplay.intro.${id}.step1`), `${id} intro should not borrow shape steps`);
}
console.log('V32: PASS — stable curtain view, manual answer reveal, single large action, no floor badges, 11 illustrated intros + shared shells.');
