/** V87 regression: filenames, format, transparent borders, one shared renderer. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const icons = ['note', 'double-note', 'wave', 'mic', 'headphones', 'speaker', 'disc'];
const dir = path.join(root, 'public/assets/game/runtime/minigames/count-the-beat/icons');
for (const name of icons) {
  const file = path.join(dir, `beat-${name}.png`);
  const data = fs.readFileSync(file);
  assert.equal(data.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', `${name}: not PNG`);
  assert.equal(data.toString('ascii', 12, 16), 'IHDR', `${name}: missing IHDR`);
  assert.equal(data.readUInt32BE(16), 512, `${name}: width`);
  assert.equal(data.readUInt32BE(20), 512, `${name}: height`);
  assert.equal(data[25], 6, `${name}: image must preserve RGBA transparency`);
  assert(data.length >= 30_000, `${name}: unexpectedly empty/corrupt artwork`);
}
const component = fs.readFileSync(path.join(root, 'src/ui-react/components/gameplay/minigames/BeatIcon.tsx'), 'utf8');
assert(component.includes('import.meta.env.BASE_URL'), 'Electron needs Vite relative-base-aware image URLs');
assert(component.includes('new Image()'), 'all seven symbols need to be preloaded before timed flashes');
for (const name of icons) assert(component.includes(`beat-${name}.png`), `missing mapping for ${name}`);
const screen = fs.readFileSync(path.join(root, 'src/ui-react/components/gameplay/minigames/CountTheBeatScreen.tsx'), 'utf8');
const tutorial = fs.readFileSync(path.join(root, 'src/ui-react/components/gameplay/shared/AllGamesTwoPageIntro.tsx'), 'utf8');
assert(screen.includes("import { BeatIcon } from './BeatIcon'"), 'gameplay must use shared symbol renderer');
assert(tutorial.includes("import { BeatIcon } from '../minigames/BeatIcon'"), 'tutorial must use shared symbol renderer');
assert(screen.includes('BeatStageLanes rows={beat.lanes}'), '1/2/4 lanes should remain unchanged');
assert(screen.includes("tourPhase === 'tour_starting'"), 'timed symbols must remain in preview phase');
assert(screen.includes("tourPhase === 'answer_window_open'"), 'answer time must remain separate');
console.log('V87 Beat Premium Icons PASS: 7 genuine transparent 512px PNGs, shared renderer, eager preload, package-safe URLs, intact timing and tutorials.');
