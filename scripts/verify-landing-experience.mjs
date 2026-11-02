import { readOrderedCss } from './lib/ordered-css-source.mjs';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');
const fail = (message) => {
  console.error(`[landing-experience] ${message}`);
  process.exit(1);
};
const assert = (condition, message) => {
  if (!condition) fail(message);
};

const requiredFiles = [
  'public/assets/game/runtime/ui/main/ta7ady_brand_mark.png',
  'src/ui-react/events/app-ui-events.ts',
  'src/ui-react/components/play/MainScreenPlayFlow.tsx',
  'src/ui-react/components/settings/AppSettingsButton.tsx',
  'src/ui-react/styles.css',
];
for (const file of requiredFiles) assert(fs.existsSync(path.join(root, file)), `Missing ${file}`);

const playFlow = read('src/ui-react/components/play/MainScreenPlayFlow.tsx');
assert(playFlow.includes('ta7ady_brand_mark.png'), 'New supplied brand mark is not used.');
assert(playFlow.includes("t('ui.landing.joinHint')"), 'Localized !join instruction is missing.');
assert(!playFlow.includes('!canStart ? <small className="main-screen-join-hint"'), 'The join instruction must remain visible after players join.');
assert(playFlow.includes('OPEN_APP_SETTINGS_EVENT'), 'Lobby Settings does not invoke the shared settings surface.');
assert(playFlow.includes('premium-chat-message'), 'Live chat messages should render in the lobby.');
assert(!playFlow.includes('ui.landing.streamer'), 'Streamer label should not be displayed.');
assert(!playFlow.includes('ui.landing.chatWaitingTitle'), 'Live-chat placeholder copy should not be displayed.');

const settings = read('src/ui-react/components/settings/AppSettingsButton.tsx');
assert(settings.includes('OPEN_APP_SETTINGS_EVENT'), 'Global Settings does not listen for the lobby trigger.');
assert(settings.includes('snapshot.tour.isTourActive ?'), 'The duplicate lobby gear should be hidden while the lobby Settings link is available.');

const translations = read('src/game-core/localization/translations.ts');
assert(translations.includes('Type !join in Twitch chat to enter the game.'), 'English join instruction is missing.');
assert(translations.includes('اكتب !join في شات تويتش عشان تدخل اللعبة.'), 'Arabic join instruction is missing.');

const css = readOrderedCss();
for (const marker of [
  'container-type: size;',
  'main-screen-brand-mark',
  'main-screen-settings-link',
  'lobbyStageLightSweep',
  'hostStageIdle',
  '@container (max-width: 1160px)',
  '@media (prefers-reduced-motion: reduce)',
  'left: 80.4cqw !important;',
  'left: 6.2cqw !important;',
  'transform: scale(1.22) !important;',
]) {
  assert(css.includes(marker), `Responsive/visual CSS marker missing: ${marker}`);
}

const font = readOrderedCss();
assert(font.includes('font-family: "Labo Display"'), 'Local Labo Display font-face missing.');


// Visual QA regression checks for the user's current lobby screenshot.
const brandPng = fs.readFileSync('public/assets/game/runtime/ui/main/ta7ady_brand_mark.png');
assert(brandPng.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])), 'Brand mark must be a valid PNG.');
const brandWidth = brandPng.readUInt32BE(16);
const brandHeight = brandPng.readUInt32BE(20);
assert(brandWidth < 600 && brandHeight < 140, 'Brand mark must be the compact supplied stripe asset, not the old hidden wordmark composite.');
assert(playFlow.includes('status.channelName?.replace(/^#/,'), 'Show only the connected channel name.');
assert(!playFlow.includes('`@${rawChannelName}`'), 'The streamer label should not add a prefixed handle.');
assert(playFlow.includes('{channelName ? ('), 'The channel-name row should disappear cleanly when no streamer name is available.');
assert(playFlow.includes('function JoinInstruction'), 'The localized join message should highlight !join without hard-coded translated copy.');
assert(playFlow.includes('recentMessages.map('), 'The live feed must render incoming messages.');
assert(read('src/ui-react/components/visual/VisualWorldLayer.tsx').includes('length: 18'), 'The lobby atmosphere should include 18 distributed floor sparkles.');
for (const marker of [
  'flex-direction: column !important;',
  'font-size: clamp(20px, 1.4cqw, 34px) !important;',
  'left: 82.2cqw !important;',
  'bottom: 30cqh !important;',
  'width: clamp(220px, 15.4cqw, 300px) !important;',
  'scale: 1.13 !important;',
  '@container (max-width: 1160px)',
  '@container (max-height: 760px)',
  '@keyframes lobbyLiveDotPulse',
  '@media (prefers-reduced-motion: reduce)',
]) {
  assert(css.includes(marker), `Current lobby visual calibration marker missing: ${marker}`);
}

console.log('Landing experience verification passed.');
