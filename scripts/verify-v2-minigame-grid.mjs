import { readOrderedCss } from './lib/ordered-css-source.mjs';
import fs from 'node:fs';

function read(path) {
  return fs.readFileSync(path, 'utf8');
}

function assert(condition, message) {
  if (!condition) {
    console.error(`Mini-game grid verification failed: ${message}`);
    process.exit(1);
  }
}

const component = read('src/ui-react/components/play/MainScreenPlayFlow.tsx');
const styles = readOrderedCss();
const gameplay = JSON.parse(read('public/assets/game/runtime/config/gameplay-config.json'));
const enabledMiniGames = gameplay?.tour?.enabledMiniGames;

assert(
  component.includes('className="main-screen-mini-card-grid"') && component.includes('dir={direction}'),
  'the picker must render the complete game list in a direction-aware grid',
);
assert(
  component.includes('miniGames.map((miniGame) =>'),
  'every available mini-game must render directly; no two-item page slicing is allowed',
);
assert(
  !component.includes('carouselIndex') && !component.includes('carousel-inner') && !component.includes('main-screen-carousel-nav'),
  'the picker must not retain carousel paging state or controls',
);
assert(
  Array.isArray(enabledMiniGames) && enabledMiniGames.length === 7,
  'the public mini-game list must contain exactly 7 games for the two-row layout',
);
assert(enabledMiniGames.every((id) => (read('src/game-core/minigames/minigame-registry.ts').includes(`id: '${id}'`))), 'All public games must be in the canonical registry.');

const gridRules = [...styles.matchAll(/\.main-screen-game-grid-layout \.main-screen-mini-card-grid\s*\{([^}]+)\}/g)];
assert(gridRules.length > 0, 'mini-game grid CSS rule is missing');
const v36Styles = read('src/ui-react/styles/visual-guess-v36.css');
const desktopGridRule = [...v36Styles.matchAll(/html body #root \.main-screen-game-grid-layout \.main-screen-mini-card-grid\s*\{([^}]+)\}/g)][0]?.[1];
assert(Boolean(desktopGridRule), 'V36 expanded picker rule is missing');
assert(/grid-template-columns:\s*repeat\(4,\s*minmax\(0,\s*1fr\)\)\s*!important/.test(desktopGridRule ?? ''), 'desktop picker must display four cards per row');
assert(/grid-template-rows:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)\s*!important/.test(desktopGridRule ?? ''), 'desktop picker must reserve two rows');
assert(read('src/ui-react/main.tsx').includes("import './styles/visual-guess-v36.css';"), 'V36 picker override must be loaded last');
assert(/display:\s*grid\s*!important/.test(read('src/ui-react/styles/game-picker-v14.css')), 'mini-game picker must use CSS Grid');

console.log(`v2 mini-game two-row grid verified (${enabledMiniGames.length} public games currently enabled; capacity: 8).`);
