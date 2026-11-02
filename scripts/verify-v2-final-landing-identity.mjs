import fs from 'node:fs';

function read(path) {
  return fs.readFileSync(path, 'utf8');
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

const mainScreen = read('src/ui-react/components/play/MainScreenPlayFlow.tsx');
const translations = read('src/game-core/localization/translations.ts');
const localeTypes = read('src/game-core/localization/locale-types.ts');
const styles = read('src/ui-react/styles.css');

assert(mainScreen.includes('ta7ady_brand_mark.png'), 'New simple landing brand mark is not wired');
assert(mainScreen.includes('main-screen-brand-name'), 'Localized landing wordmark is missing');
assert(mainScreen.includes('main-screen-brand-slogan'), 'Landing slogan element is missing');
assert(mainScreen.includes('ui.landing.brand'), 'Landing brand translation key missing in UI');
assert(mainScreen.includes('ui.landing.slogan'), 'Landing slogan translation key missing in UI');
assert(mainScreen.includes('main-screen-settings-link'), 'Lobby Settings link missing');
assert(localeTypes.includes("'ui.landing.brand'"), 'ui.landing.brand type key missing');
assert(translations.includes('"ui.landing.brand": "Ta7ady ElGeel"'), 'English landing brand missing');
assert(translations.includes('\"ui.landing.brand\": \"تحدي الجيل\"'), 'Arabic landing brand unicode text missing');
assert(translations.includes('\"ui.landing.slogan\": \"اثبت للآخر\"'), 'Arabic slogan unicode text missing');
assert(styles.includes('LANDING EXPERIENCE POLISH'), 'Landing experience CSS block missing');
assert(fs.existsSync('public/assets/game/runtime/ui/main/ta7ady_brand_mark.png'), 'New brand mark asset missing');

console.log('v2 final landing identity verified.');
