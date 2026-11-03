import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root=resolve(import.meta.dirname,'..');
const read=(p)=>readFileSync(resolve(root,p),'utf8');
const flow=read('src/ui-react/components/play/MainScreenPlayFlow.tsx');
const texts=read('src/game-core/localization/translations.ts');
const json=JSON.parse(read('public/assets/game/runtime/config/localization.json'));
const main=read('src/ui-react/main.tsx');
const css=read('src/ui-react/styles/shared-choice-questions-v25.css');
const q=read('src/ui-react/components/gameplay/shared/question-shell.tsx');
const modern=read('src/ui-react/components/gameplay/shared/modern-question-games.ts');
const helper=read('src/ui-react/components/gameplay/shared/answer-helpers.ts');
let n=0;const check=(condition,message)=>{assert.ok(condition,message);n++};
check(texts.includes('"ui.landing.playersJoined": "هيلعبوا معانا"'), 'requested Arabic lobby wording');
check(!Object.hasOwn(json.ar ?? {},'ui.landing.playersJoined'), 'runtime localization does not mask new label');
check(!flow.includes('جاهزين للشات!') && !flow.includes('CHAT IS READY'), 'no chat-ready placeholder');
check(!flow.includes('premium-chat-empty-light') && !flow.includes('premium-chat-empty'), 'chat orb removed from DOM');
check(flow.includes('{recentMessages.length > 0 ? ('), 'real messages still render');
check(main.includes("import './styles/shared-choice-questions-v25.css'"), 'scoped CSS imported');
check(main.indexOf('shared-choice-questions-v25.css')>main.indexOf('answer-zones-question-v20.css'), 'question v25 styles cascade last');
check(/gameplay-question-shape-count/.test(css) && /gameplay-question-choices-3/.test(css), 'three shape answers aligned horizontally');
check(/qshell-v20/.test(css), 'CSS is scoped to modern shared layout');
check(q.includes('orderedChoices') && q.includes('getCommandOptionNumber'), 'choices sorted by command, never reshuffled visually');
check(helper.includes("miniGame.id === 'shape-count'") && helper.includes('optionNumber'), 'shape answers and correct-option mapping preserved');
check(modern.includes("'shape-count'") && modern.includes("'food-origin'"), 'shared registry includes all modern minigames');
for(const path of ['src/ui-react/components/gameplay/GameplayOverlay.tsx','src/ui-react/components/gameplay/citizens/CitizenPlaza.tsx']) {
 check(path.includes('CitizenPlaza') ? read(path).includes('usesModernQuestionUi') : read(path).includes('MiniGamePlayScreen'), `${path} consumes the shared question-layout architecture`);
}
for(const path of ['src/ui-react/App.tsx','src/ui-react/components/visual/HostMascotLayer.tsx']) {
 check(!read(path).includes('usesModernQuestionUi'), `${path} must not restrict host answers to modern-layout games`);
}
for(const file of ['ShapeCountScreen','GuessLogoScreen','CoupleOrSiblingsScreen','TrueFakeScreen']) {
  const source=read(`src/ui-react/components/gameplay/minigames/${file}.tsx`);
  check(source.includes('layout="choice"'),`${file} uses shared question layout`);
  check(source.includes('QuestionScreenShell'),`${file} keeps shared header/timer/reveal`);
}
check(read('src/ui-react/components/gameplay/minigames/MazeGatesScreen.tsx').includes('layout="focus"'), 'Maze Gates now fills available screen instead of duplicating gate choices');
console.log(`v25 shared UI + lobby copy regression PASS (${n} checks)`);
