import fs from 'node:fs';
import assert from 'node:assert/strict';
import path from 'node:path';
const read = p => fs.readFileSync(p, 'utf8');
const flow = read('src/ui-react/components/play/MainScreenPlayFlow.tsx');
const css = read('src/ui-react/styles/mode-picker-casual-v12.css');
const entry = read('src/ui-react/main.tsx');
const i18n = read('src/game-core/localization/translations.ts');
const assets = 'public/assets/game/runtime/ui/main';
for (const file of ['mode_one_game_v13.svg', 'mode_full_show_v13.svg']) {
  const svg = read(path.join(assets, file));
  assert.ok(svg.length > 2000, `${file} artwork missing`);
  assert.match(svg, /^<svg xmlns="http:\/\/www.w3.org\/2000\/svg"/);
  assert.match(svg, /<\/svg>\s*$/);
  assert.ok(flow.includes(file), `${file} not referenced by game UI`);
  assert.doesNotMatch(svg, /<script\b|(?:href|xlink:href)=[\"']https?:/i, `${file} has external resources or scripting`);
}
for (const line of [
 '"main.mode.miniGame": "ONE GAME"',
 '"main.mode.tour": "FULL SHOW"',
 '"main.mode.miniGame": "لعبة واحدة"',
 '"main.mode.tour": "شو كامل"',
 '"main.mode.title": "HOW DO WE PLAY?"',
 '"main.mode.title": "هنلعب إزاي؟"',
]) assert.ok(i18n.includes(line), `copy missing: ${line}`);
assert.ok(entry.lastIndexOf('mode-picker-casual-v12.css') > entry.lastIndexOf('typography-system-v11.css'));
assert.match(css, /v13 editorial pass/);
assert.match(css, /prefers-reduced-motion/);
assert.match(css, /focus-visible/);
assert.match(css, /main\[lang="ar"\]/);
assert.match(flow, /onClick=\{onMiniGame\}/);
assert.match(flow, /onClick=\{onTour\}/);
assert.match(flow, /onKeyDown=\{onCardKeyDown\}/);
assert.match(flow, /onBack=\{onBack\}/);
console.log('ModePicker v13: original vector assets, bilingual copy, keyboard, routing and scoped CSS PASS.');
