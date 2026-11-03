import { readFileSync } from 'node:fs';
import { strict as assert } from 'node:assert';
import { resolve } from 'node:path';

const read = (path) => readFileSync(resolve(process.cwd(), path), 'utf8');
const scoreboard = read('src/ui-react/components/gameplay/scoreboard/Scoreboard.tsx');
const action = read('src/ui-react/components/gameplay/scoreboard/ScoreboardPrimaryAction.tsx');
const css = read('src/ui-react/styles/scoreboard-stage-v21.css');
const main = read('src/ui-react/main.tsx');
const lights = read('src/ui-react/components/visual/MiniGameLightingRig.tsx');
const stage = read('src/ui-react/components/visual/VisualWorldLayer.tsx');
const types = read('src/game-core/localization/locale-types.ts');
const strings = read('src/game-core/localization/translations.ts');
const locales = JSON.parse(read('public/assets/game/runtime/config/localization.json'));

assert.match(css, /gameplay-phase-tour_complete[\s\S]*pointer-events:\s*auto\s*!important/);
assert.match(css, /gameplay-phase-scoring[\s\S]*pointer-events:\s*auto\s*!important/);
assert.match(css, /\.show-score-action-v21/);
assert.match(css, /prefers-reduced-motion/);
assert.match(action, /onClick=\{onClick\}/);
assert.equal((scoreboard.match(/<ScoreboardPrimaryAction\b/g) ?? []).length, 2, 'Shared action used on both score screens');
assert.match(scoreboard, /onPrimaryAction=\{actions\.backToStage\}/);
assert.match(scoreboard, /wasEndedFromSettings/);
assert.equal((scoreboard.match(/<ScoreboardAmbientLights\b/g) ?? []).length, 2, 'Both scoreboard screens must still include ambient lighting with current props');
assert.match(stage, /<MiniGameLightingRig\s+state=\{lightingState\}\s*\/>/);
assert.match(lights, /minigame-light-head-left/);
assert.match(lights, /minigame-light-head-right/);
assert(main.indexOf('scoreboard-stage-v21.css') > main.indexOf('answer-zones-question-v20.css'));
for (const locale of ['en','ar']) {
  for (const key of ['gameplay.score.sessionEnded','gameplay.score.sessionEndedHint']) {
    assert(typeof locales[locale][key] === 'string', `${locale} ${key}`);
    assert(strings.includes(`"${key}"`));
    assert(types.includes(`'${key}'`));
  }
}
console.log('Scoreboard v21 structural checks: PASS (click pointer, shared CTA, lighting, localization).');
