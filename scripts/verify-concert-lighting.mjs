import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = path => readFileSync(path, 'utf8');
const world = read('src/ui-react/components/visual/VisualWorldLayer.tsx');
const rig = read('src/ui-react/components/visual/ConcertLightingRig.tsx');
const css = read('src/ui-react/styles/concert-lighting-rig.css');
const entry = read('src/ui-react/main.tsx');

assert.match(world, /import \{ ConcertLightingRig \}/);
assert.match(world, /!isMiniGameScene\s*\?\s*\(/);
assert.match(world, /<ConcertLightingRig\s*\/>/);
assert.equal((world.match(/<ConcertLightingRig\s*\/>/g) ?? []).length, 1);
assert.equal((rig.match(/className="concert-top-wash concert-top-wash-\d"/g) ?? []).length, 3);
assert.equal((rig.match(/className="concert-audience-moving-light concert-audience-moving-light-(left|right)"/g) ?? []).length, 2);
assert.match(rig, /viewBox="0 0 1920 1080"/);
assert.match(rig, /mask="url\(#ta7-light-audience-mask\)"/);
assert.match(rig, /concert-side-lamp-cores/);
assert.match(css, /transform-origin:\s*493px 426px/);
assert.match(css, /transform-origin:\s*1422px 426px/);
assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
assert.match(css, /concertAudienceSweepLeft/);
assert.match(css, /concertAudienceSweepRight/);
assert.match(entry, /styles\/concert-lighting-rig\.css/);
assert.doesNotMatch(rig, /\b(?:useEffect|useState|setInterval|requestAnimationFrame|addEventListener)\s*\(/);
assert.doesNotMatch(world, /premium-plaza-spot-cyan|premium-stage-beam-cyan/);
console.log('Concert lighting: 3 overhead lamps, 2 animated moving heads, world-space alignment, reduced motion verified.');
