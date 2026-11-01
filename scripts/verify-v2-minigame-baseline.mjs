import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');
const fail = (message) => {
  console.error(`Gameplay config verification failed: ${message}`);
  process.exit(1);
};

const configPath = 'public/assets/game/runtime/config/gameplay-config.json';
const config = JSON.parse(read(configPath));
const registrySource = read('src/game-core/minigames/minigame-registry.ts');
const typesSource = read('src/game-core/minigames/minigame-types.ts');

// Keep this lightweight Node script independent of a TypeScript runtime loader.
const registryEntryBlocks = registrySource.match(/\n  \{\s*id:[\s\S]*?\n  \},?/g) ?? [];
const entries = registryEntryBlocks.map((block) => ({
  id: block.match(/\bid:\s*['"]([^'"]+)['"]/)?.[1],
  availability: block.match(/\bavailability:\s*['"](public|qa-only)['"]/)?.[1],
})).filter((entry) => entry.id && entry.availability);

if (entries.length === 0) fail('Could not read any MINI_GAME_REGISTRY entries.');

const allIds = entries.map((entry) => entry.id);
const publicIds = new Set(entries.filter((entry) => entry.availability === 'public').map((entry) => entry.id));
if (new Set(allIds).size !== allIds.length) fail('MINI_GAME_REGISTRY contains duplicate IDs.');
if (publicIds.size === 0) fail('MINI_GAME_REGISTRY must contain at least one public mini-game.');

if (!typesSource.includes("export type { MiniGameId } from './minigame-registry';")) {
  fail('MiniGameId must be re-exported from the registry instead of maintaining a second union.');
}
if (/export\s+type\s+MiniGameId\s*=/.test(typesSource)) {
  fail('minigame-types.ts still declares a duplicate MiniGameId union.');
}
if (/visibleInPicker/.test(registrySource)) {
  fail('Registry still contains the old visibleInPicker flag.');
}

const tour = config?.tour;
if (!tour || typeof tour !== 'object') fail('Config is missing tour settings.');

function assertUniqueKnownPublicIds(value, label) {
  if (!Array.isArray(value) || value.length === 0) fail(`${label} must be a non-empty array.`);
  if (new Set(value).size !== value.length) fail(`${label} contains duplicate IDs.`);
  for (const id of value) {
    if (!allIds.includes(id)) fail(`${label} references unknown mini-game: ${id}`);
    if (!publicIds.has(id)) fail(`${label} exposes QA-only mini-game: ${id}`);
  }
}

assertUniqueKnownPublicIds(tour.enabledMiniGames, 'tour.enabledMiniGames');
assertUniqueKnownPublicIds(tour.miniGameRotation, 'tour.miniGameRotation');
const enabledIds = new Set(tour.enabledMiniGames);
for (const id of tour.miniGameRotation) {
  if (!enabledIds.has(id)) fail(`miniGameRotation contains a game that is not enabled: ${id}`);
}

const minRoundCount = tour.minRoundCount;
const maxRoundCount = tour.maxRoundCount;
if (!Number.isInteger(minRoundCount) || !Number.isInteger(maxRoundCount) || minRoundCount < 1 || maxRoundCount < minRoundCount) {
  fail('minRoundCount/maxRoundCount are invalid.');
}
if (!Number.isInteger(tour.defaultRoundCount) || tour.defaultRoundCount < minRoundCount || tour.defaultRoundCount > maxRoundCount) {
  fail('defaultRoundCount must be an integer inside the configured range.');
}

for (const [id, rounds] of Object.entries(tour.singleMiniGameRoundCounts ?? {})) {
  if (!allIds.includes(id)) fail(`singleMiniGameRoundCounts references unknown mini-game: ${id}`);
  if (!Number.isInteger(rounds) || rounds < 1 || rounds > 25) fail(`Invalid round count for ${id}: ${rounds}`);
}

for (const [id, overrides] of Object.entries(tour.miniGamePhaseOverridesMs ?? {})) {
  if (!allIds.includes(id)) fail(`miniGamePhaseOverridesMs references unknown mini-game: ${id}`);
  for (const [phase, duration] of Object.entries(overrides ?? {})) {
    if (!Number.isInteger(duration) || duration < 0 || duration > 300_000) {
      fail(`Invalid phase duration for ${id}.${phase}: ${duration}`);
    }
  }
}

const generatedExpected = [
  '/**',
  ' * GENERATED FILE — DO NOT EDIT BY HAND.',
  ' * Source: public/assets/game/runtime/config/gameplay-config.json',
  ' * Regenerate with: node scripts/generate-runtime-game-config.mjs',
  ' */',
  `export const DEFAULT_RUNTIME_GAME_CONFIG_DATA = ${JSON.stringify(config, null, 2)} as const;`,
  '',
].join('\n');
const generatedActual = read('src/game-core/config/runtime-game-config.defaults.generated.ts');
if (generatedActual !== generatedExpected) {
  fail('Generated TypeScript fallback is out of sync; run scripts/generate-runtime-game-config.mjs.');
}

console.log(`Gameplay config verified: ${allIds.length} registered games, ${publicIds.size} public games, ${tour.enabledMiniGames.length} enabled.`);
