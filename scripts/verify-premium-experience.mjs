/** Focused static verification for the v4 lobby design pass (not a runtime screenshot). */
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const text = (path) => readFileSync(path, 'utf8');
const main = text('src/ui-react/main.tsx');
const lobby = text('src/ui-react/components/play/MainScreenPlayFlow.tsx');
const host = text('src/ui-react/components/visual/HostMascotLayer.tsx');
const plaza = text('src/ui-react/components/gameplay/citizens/CitizenPlaza.tsx');
const positions = text('src/ui-react/components/gameplay/shared/citizen-helpers.ts');
const css = text('src/ui-react/styles/premium-experience.css');
const enAr = text('src/game-core/localization/translations.ts');
const typeKeys = text('src/game-core/localization/locale-types.ts');

assert(existsSync('src/ui-react/styles/premium-experience.css'));
assert(main.indexOf("import './styles/premium-stage-mode.css'") < main.indexOf("import './styles/premium-experience.css'"), 'v4 CSS must load last');
assert(lobby.includes('premium-lobby-status') && lobby.includes('joinedCount'), 'joined count UI missing');
assert(lobby.includes("t('ui.landing.playersJoined')"), 'joined count must be localized');
assert(enAr.includes('"ui.landing.playersJoined": "PLAYERS JOINED"'));
assert(enAr.includes('"ui.landing.playersJoined": "هيلعبوا معانا"'));
assert(typeKeys.includes("| 'ui.landing.playersJoined'"));
assert(positions.includes('export function getLobbyCrowdCoordinates(index: number)'), 'stable positioning missing');
assert(positions.includes('y: Math.max(10, 50 - row * 5)'), 'audience safe-area contract changed');
assert(plaza.includes('gameplay-citizen-plaza-packed'), 'dense crowd treatment missing');
assert(host.includes('premium-host-reacting') && host.includes('previousJoinCount'), 'host event reaction missing');
assert(host.includes("window.addEventListener('ta7ady:lobby-play-selected'"), 'host play event missing');
assert(css.includes('prefers-reduced-motion: reduce'), 'reduce-motion support missing');
for (const required of ['premium-lobby-status', 'premiumHostRespond', 'premiumDisplayArrive', 'premiumJoinSpot']) {
  assert(css.includes(required), `Missing CSS component ${required}`);
}

// Independent check of the authored 72-slot geometric contract.
const order = [2, 5, 0, 7, 3, 4, 1, 6];
const slots = Array.from({ length: 72 }, (_, index) => {
  const row = Math.floor(index / 8);
  const column = order[index % 8];
  return [10 + 80 / 7 * column, Math.max(10, 50 - row * 5)];
});
assert.equal(new Set(slots.map((slot) => slot.join('/'))).size, 72, 'duplicate audience slots');
assert(slots.every(([x, y]) => x >= 10 && x <= 90 && y >= 10 && y <= 50), 'crowd slot outside safe boundary');
console.log('Premium experience v4 static checks passed: CSS order, i18n, interactions, 72 safe slots.');
