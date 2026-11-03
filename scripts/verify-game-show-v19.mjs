/** v19 game-show visual shell invariants. Run with: node scripts/verify-game-show-v19.mjs */
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
const root = resolve(import.meta.dirname, '..');
const read = (file) => readFileSync(resolve(root,file), 'utf8');
const questions = read('src/ui-react/components/gameplay/shared/question-shell.tsx');
const stage = read('src/ui-react/components/gameplay/citizens/ChoiceSpotlights.tsx');
const citizens = read('src/ui-react/components/gameplay/shared/citizen-helpers.ts');
const host = read('src/ui-react/components/streamer/PrivateStreamerAnswerDock.tsx');
const app = read('src/ui-react/App.tsx');
const score = read('src/ui-react/components/gameplay/scoreboard/Scoreboard.tsx');
const css = read('src/ui-react/styles/game-show-polish-v19.css');
const main = read('src/ui-react/main.tsx');
const food = read('src/ui-react/components/gameplay/minigames/FoodOriginScreen.tsx');
const locales = read('src/game-core/localization/translations.ts');
const json = JSON.parse(read('public/assets/game/runtime/config/localization.json'));
let checked=0;
function test(value,message){assert.ok(value, message);checked+=1;}
// The numbers are stable and retain the game service's command mapping.
test(/sort\(\(a, b\) => a\.optionNumber - b\.optionNumber\)/.test(food), 'Food Origin options must remain sorted by optionNumber');
test(!/shuffle\s*\(/.test(food), 'Food Origin must not reshuffle its service-provided choices');
test(/tone:\s*'cyan'/.test(food), 'Food Origin option accents are neutral until result reveal');
test(/\.sort\(\(a, b\) =>/.test(questions) && /getCommandOptionNumber/.test(questions), 'shared question component must use command numbers for order');
test(/private-streamer-answer-embedded/.test(host) && /qshell-host-bubble-v20/.test(read('src/ui-react/components/visual/HostMascotLayer.tsx')), 'host answer now anchors to the mascot instead of the question header');
test(!/PrivateStreamerAnswerDock/.test(app) && /<AppSettingsButton \/>/.test(app), 'App must never render the obsolete floating host-answer dock');
test(/qshell-quick-total/.test(questions) && !/qshell-quick-instruction/.test(questions), 'answering stage avoids redundant extra footer instructions');
test(/qshell-vote-count/.test(questions) && /getAnswerCountsByOption/.test(questions), 'answer totals display on choice cards');
test(!/floor-answer-(?:tally|count)|choice\.count/.test(stage), 'floor option markers should not include tiny count badges');
test(/ANSWER_STAGE_LAYOUT/.test(stage) && /ANSWER_STAGE_LAYOUT/.test(citizens), 'floor spots and player positions must share geometry');
test(/laneWidth/.test(citizens) && /Math\.floor\(placement\.groupIndex/.test(citizens), 'crowd positions must spread inside full-height lanes');
// V32 replaced the old reveal banner class; retain the result-specific
// styling assertion against the active CSS rather than a retired class.
test(/qshell-reveal-v32/.test(questions) && /gameplay-choice-result-correct/.test(css)
  && /\.qshell-reveal-v32/.test(read('src/ui-react/styles/experience-unification-v32.css')), 'result reveal has distinct style');
test(!/inset-inline:\s*auto\s*!important/.test(css), 'result reveal must not reset its 50% center position with logical inset');
test(/--show-cyan:\s*#4de3ed/.test(css) && /--show-pink:\s*#fa57c7/.test(css), 'shared game-show color tokens exist');
test(/--v18-choice:\s*var\(--show-cyan\)/.test(css), 'all unrevealed choices have the same cyan accent');
test(/show-scoreboard-v19/.test(score) && /show-score-leader/.test(score), 'scoreboard shows a featured leader');
test(/show-score-ranking-row/.test(score) && /SCOREBOARD_PAGE_SIZE/.test(score), 'scoreboard keeps paginated ranks');
test(/buildReusableScoreboardRows/.test(score) && /show-intermission-v19/.test(score), 'shared score data and intermission are retained');
test(/getVisibleScoreboardRoundIndexes/.test(score) && /roundPoints\[roundIndex\]/.test(score), 'leader shows real per-round points');
test(/grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/.test(css), 'compact two-column rankings fit small screens');
test(main.includes("'./styles/game-show-polish-v19.css'") && main.indexOf('game-show-polish-v19.css') > main.indexOf('question-stage-v18.css'), 'v19 CSS remains loaded below previous visual layers');
for(const k of ['gameplay.answer.chatShort','gameplay.answer.revealedShort']){
 test(locales.includes(k),`missing ${k} in typed translations`);
 test(JSON.stringify(json).includes(k),`missing ${k} in runtime translations`);
}
test(existsSync(resolve(root,'src/ui-react/styles/game-show-polish-v19.css')),'v19 CSS missing');
console.log(`v19 game-show checks PASS (${checked} invariants)`);
