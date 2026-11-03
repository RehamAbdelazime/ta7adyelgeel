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
  Array.isArray(enabledMiniGames) && enabledMiniGames.length === 8,
  'the current public mini-game list must contain exactly 8 games for the requested two-row layout',
);
assert(enabledMiniGames.includes('true-fake'), 'True or Fake must be included as the eighth public game.');

const gridRules = [...styles.matchAll(/\.main-screen-game-grid-layout \.main-screen-mini-card-grid\s*\{([^}]+)\}/g)];
assert(gridRules.length > 0, 'mini-game grid CSS rule is missing');
const desktopGridRule = gridRules.find((match) => /grid-template-columns:\s*repeat\(4,\s*minmax\(0,\s*1fr\)\)\s*!important/.test(match[1]))?.[1];
assert(
  Boolean(desktopGridRule),
  'desktop picker must display four cards per row',
);
assert(
  /grid-template-rows:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)\s*!important/.test(desktopGridRule ?? ''),
  'desktop picker must reserve exactly two card rows',
);
assert(
  /display:\s*grid\s*!important/.test(desktopGridRule ?? ''),
  'mini-game picker must use CSS Grid',
);

console.log(`v2 mini-game two-row grid verified (${enabledMiniGames.length} public games currently enabled; capacity: 8).`);
