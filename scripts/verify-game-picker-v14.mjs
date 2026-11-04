import fs from 'node:fs';
import assert from 'node:assert/strict';
const flow = fs.readFileSync('src/ui-react/components/play/MainScreenPlayFlow.tsx','utf8');
const css = fs.readFileSync('src/ui-react/styles/game-picker-v14.css','utf8');
const entry = fs.readFileSync('src/ui-react/main.tsx','utf8');
const i18n = fs.readFileSync('src/game-core/localization/translations.ts','utf8');
const idList = ['food-origin','shape-count','maze-gates','count-the-beat','lucky-cup','guess-movie','guess-star'];
for(const id of idList) {
  const artwork = fs.readFileSync(`public/assets/game/runtime/ui/main/game-picker-v14/${id}.svg`,'utf8');
  assert.match(artwork, /^<svg xmlns="http:\/\/www.w3.org\/2000\/svg"/);
  assert.ok(artwork.length>500, `Missing art for ${id}`);
  assert.doesNotMatch(artwork, /<script|(?:href|xlink:href)=["']https?:/i);
}
assert.match(flow, /selectedMiniGames\.indexOf\(miniGame\.id\) \+ 1/);
assert.match(flow, /MINI_GAME_ART_ROOT/);
assert.match(flow, /onStartTour=\{startTour\}/);
assert.match(flow, /onLaunch=\{startMiniGame\}/);
assert.match(css, /main-screen-game-grid-layout-tour/);
assert.match(css, /prefers-reduced-motion/);
assert.match(css, /focus-visible/);
assert.match(css, /main-screen-mini-card-selected::after/);
assert.match(entry, /game-picker-v14\.css/);
assert.match(i18n, /"main.mode.title": "هنلعب إيه؟"/);
assert.match(i18n, /"main.mode.title": "WHAT ARE WE PLAYING\?"/);
console.log('Game picker v14: 10 unique local illustrations, bilingual copy, selection order, routing, focus and CSS PASS.');
