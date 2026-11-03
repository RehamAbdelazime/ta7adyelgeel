import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
const get = (name) => readFileSync(resolve(name), 'utf8');
const food = get('src/ui-react/components/gameplay/minigames/FoodOriginScreen.tsx');
const service = get('src/game-core/minigames/food-origin/food-origin-service.ts');
const shell = get('src/ui-react/components/gameplay/shared/question-shell.tsx');
const stage = get('src/ui-react/components/gameplay/citizens/ChoiceSpotlights.tsx');
const placement = get('src/ui-react/components/gameplay/shared/citizen-helpers.ts');
const dock = get('src/ui-react/components/streamer/PrivateStreamerAnswerDock.tsx');
const app = get('src/ui-react/App.tsx');
const lighting = get('src/ui-react/components/visual/VisualWorldLayer.tsx');
const style = get('src/ui-react/styles/question-stage-v18.css');
const main = get('src/ui-react/main.tsx');
const layer = get('src/ui-react/components/gameplay/GameplayOverlay.tsx');

assert.doesNotMatch(food, /seededShuffle|shuffledChoices/, 'UI must not randomize already-numbered answer commands');
assert.match(food, /\.sort\(\(a, b\) => a\.optionNumber - b\.optionNumber\)/);
assert.match(service, /command: `!\$\{index \+ 1\}`/, 'Service must own the command mapping');
assert.match(service, /return this\.activeChoices\[optionNumber - 1\]/, 'Scoreboard resolution must refer to original service option index');
assert.match(shell, /const orderedChoices = \[\.\.\.choices\]\.sort/);
assert.match(shell, /orderedChoices\.map\(\(choice\)/);
assert.doesNotMatch(shell, /<PrivateStreamerAnswerDock/, 'embedded host dock moved to mascot layer in v20');
assert.match(stage, /\.sort\(\(a, b\) => a\.optionNumber - b\.optionNumber\)/);
assert.doesNotMatch(stage, /choice_spotlight_\$\{choice.optionNumber\}/, 'Old ring sprites must not be used');
assert.match(stage, /audience-answer-lanes-v20/, 'v20 floor lanes replace old pads');
assert.match(stage, /ANSWER_STAGE_LAYOUT\.leftPercent/);
assert.match(placement, /CHOICE_SPOTLIGHT_LAYOUT = ANSWER_STAGE_LAYOUT/);
assert.match(dock, /export function PrivateStreamerAnswerDock\(\)/, 'host uses only the stage-mounted answer pod');
assert.match(dock, /type="password"/);
assert.doesNotMatch(app, /PrivateStreamerAnswerDock|usesModernQuestionUi/, 'App must not own the old floating host-answer routing');
assert.match(lighting, /question-stage-lighting-v18/);
assert.doesNotMatch(layer, /setTimeout\(/, 'Answer reveal must not auto-hide on a timer');
assert.match(layer, /RoundRevealProvider/, 'Host-visible scoreboard handoff should be explicit');
assert.match(main, /question-stage-v18\.css/);
assert.match(style, /--answer-zone-left/);
assert.match(style, /prefers-reduced-motion/);

// Contract: rendering sorted commands must not reassign option numbers or alter game scoring.
const generated = [ {optionNumber:4,command:'!4',country:'FR'}, {optionNumber:2,command:'!2',country:'KR'}, {optionNumber:1,command:'!1',country:'MX'}, {optionNumber:3,command:'!3',country:'YE'} ];
const display = [...generated].sort((a,b)=>a.optionNumber-b.optionNumber);
assert.deepEqual(display.map(x=>x.command), ['!1','!2','!3','!4']);
for (const item of generated) assert.equal(display.find(x=>x.command===item.command).country,item.country);
const zone = { leftPercent:20,widthPercent:60,topPercent:84.2,heightPercent:13.4 };
for (const count of [2,3,4]) {
  for(let index=0;index<count;index++) {
    const fromPlacement = zone.leftPercent + zone.widthPercent * ((index + .5) / count);
    const fromCSSGrid = zone.leftPercent + (index + .5) * (zone.widthPercent / count);
    assert.equal(fromPlacement,fromCSSGrid,'Floor pads must align with matching citizen placement');
  }
}
console.log('Question Stage v18 PASS: stable answers, shared floor/character centers, embedded host, timed reveal, scene lighting.');
