import fs from 'node:fs';
import assert from 'node:assert/strict';

const read = (relative) => fs.readFileSync(relative, 'utf8');
const flow = read('src/ui-react/components/play/MainScreenPlayFlow.tsx');
const world = read('src/ui-react/components/visual/VisualWorldLayer.tsx');
const pickerCss = read('src/ui-react/styles/game-picker-v14.css');

// The same compact screen is used for Single Game and Full Tour.
assert.match(flow, /mode="single"/);
assert.match(flow, /mode="tour"/);
assert.match(flow, /<h2>\{title\}<\/h2>/);
assert.doesNotMatch(flow, /subtitle=\{t\('ui\.play\.choose/);
assert.doesNotMatch(flow, /<p>\{subtitle\}<\/p>/);
assert.doesNotMatch(flow, /translate\(miniGame\.noteKey\)/);
assert.doesNotMatch(flow, /<small>\{translate\(miniGame/);
assert.match(flow, /<strong>\{translate\(miniGame\.titleKey\)\}<\/strong>/);
assert.match(flow, /game-picker-v14-illustration/);
assert.match(flow, /onLaunch\(miniGame\.id\)/);
assert.match(flow, /selectedMiniGames\.indexOf\(miniGame\.id\)/);
assert.match(flow, /mode === 'tour' \? \(/);
assert.match(pickerCss, /\.main-screen-mini-card:focus-visible/);
assert.doesNotMatch(pickerCss, /\.main-screen-mini-card-copy small/);
// Stage artwork already includes stars. Avoid second, screen-space star glows
// that can land on the stage roof or hang disconnected from the light rig.
assert.doesNotMatch(world, /<div className="concert-star-twinkle-layer"/);
assert.match(world, /<ConcertLightingRig \/>/);
assert.match(world, /concert-lobby-sparkles/);
assert.match(world, /visual-world-stage-lobby/);
assert.match(world, /premium-stage-footlights/);
console.log('V91 PASS: bilingual single/tour picker shows only titles + icons; no unanchored twinkles; stage lights remain.');
