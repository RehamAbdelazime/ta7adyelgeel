import { readOrderedCss } from './lib/ordered-css-source.mjs';
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const app = read('src/ui-react/App.tsx');
const flow = read('src/ui-react/components/play/MainScreenPlayFlow.tsx');
const settings = read('src/ui-react/components/settings/AppSettingsButton.tsx');
const answerDock = read('src/ui-react/components/streamer/PrivateStreamerAnswerDock.tsx');
const scoreboard = read('src/ui-react/components/gameplay/scoreboard/Scoreboard.tsx');
const css = readOrderedCss();
const translations = read('src/game-core/localization/translations.ts');
const localeTypes = read('src/game-core/localization/locale-types.ts');

for (const hook of ['app-desktop-shell', 'app-desktop-overlay-layer']) {
  assert(app.includes(`className="${hook}"`), `Desktop shell is missing ${hook}`);
  assert(css.includes(`.${hook} {`), `Desktop shell CSS missing ${hook}`);
}
assert(!app.includes('h-screen w-screen'), 'Tailwind-only app shell classes returned');
assert(flow.includes('setStep(step === \'mode\' ? \'home\' : \'mode\')'), 'Escape back-navigation missing');
assert(!flow.includes('<LobbyHomeScreen canStart='), 'Browsing games is locked until players join');
assert(flow.includes("disabled={mode === 'single' && !canStart}"), 'Single-round launch must still be gated');
assert(flow.includes("disabled={!canStart || selectedMiniGames.length === 0}"), 'Tour launch must still be gated');
assert(flow.includes("{'✓'}"), 'Selected tour cards should not imply deterministic play order');
assert(settings.includes('dialogRef') && settings.includes('restoreFocusRef') && settings.includes('event.key === \'Tab\''), 'Modal keyboard flow is missing');
assert(settings.indexOf('if (hasDisplayChanges) {', settings.indexOf('const applySettings'))
  < settings.indexOf('if (hasLanguageChanges) actions.setLanguage(draftLocale)', settings.indexOf('const applySettings')), 'Settings commits language before display succeeds');
assert(settings.includes('setDraftMusicVolume(Number(event.target.value))'), 'Audio draft is not transactional');
assert(answerDock.includes('isCountAnswer ? 3 : 1'), 'Numeric count input is limited to one digit');
assert(answerDock.includes("miniGame.id === 'lucky-cup'"), 'Lucky cup choice count must be 3');
assert(answerDock.includes("miniGame.id === 'before-or-after'"), 'Before/after choice count must be 2');
for (const key of ['gameplay.score.topThree', 'gameplay.score.finalRounds', 'gameplay.score.calculatingHint', 'ui.play.noGamesEnabled']) {
  assert(localeTypes.includes(`'${key}'`), `Missing localization key type: ${key}`);
  assert(translations.split(`'${key}':`).length === 3, `Missing/duplicated translation of ${key}`);
}
assert(!translations.includes('"Choose Tour Games Hint"'), 'Literal placeholder copy returned');
assert(!translations.includes('"Choose Mini Game Hint"'), 'Literal placeholder copy returned');
assert(scoreboard.includes("t('gameplay.score.topThree')"), 'Scoreboard top-three label not localized');
assert(css.includes(':focus-visible'), 'Visible keyboard-focus treatment is missing');
console.log('Desktop UX hardening structural checks passed (not a live visual test).');
