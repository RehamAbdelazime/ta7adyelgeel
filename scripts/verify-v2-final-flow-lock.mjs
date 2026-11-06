import fs from "node:fs";

function read(path) {
  return fs.readFileSync(path, "utf8");
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

const config = JSON.parse(read("public/assets/game/runtime/config/gameplay-config.json"));
assert(Number.isInteger(config.tour.defaultRoundCount), "defaultRoundCount must be configured as an integer");
assert(config.tour.phaseDurationsMs.answer_window_open >= 1000, "answer window must be configured");
assert(Array.isArray(config.tour.enabledMiniGames) && config.tour.enabledMiniGames.length > 0, "enabledMiniGames must not be empty");
assert(Array.isArray(config.tour.miniGameRotation) && config.tour.miniGameRotation.length > 0, "miniGameRotation must not be empty");
assert(config.tour.miniGameRotation.every((id) => config.tour.enabledMiniGames.includes(id)), "Tour rotation must be a subset of enabled games");

const registry = read("src/game-core/minigames/minigame-registry.ts");
const registryEntryBlocks = registry.match(/\n  \{\s*id:[\s\S]*?\n  \},?/g) ?? [];
const qaOnlyIds = registryEntryBlocks
  .filter((block) => /\bavailability:\s*['"]qa-only['"]/.test(block))
  .map((block) => block.match(/\bid:\s*['"]([^'"]+)['"]/)?.[1])
  .filter(Boolean);
const runtimeConfig = read("src/game-core/config/runtime-game-config.ts");
assert(runtimeConfig.includes("runtime-game-config.defaults.generated"), "runtime config must use JSON-generated defaults");
for (const id of qaOnlyIds) {
  assert(!config.tour.enabledMiniGames.includes(id), "QA-only game must not be enabled in public gameplay config: " + id);
  assert(!config.tour.miniGameRotation.includes(id), "QA-only game must not be in public Tour rotation: " + id);
}

// Only assert the actually mounted lobby flow. The retired PlayLauncher looked
// correct in tests but never rendered, hiding regressions in the real UI.
const mainScreen = read("src/ui-react/components/play/MainScreenPlayFlow.tsx");
for (const id of qaOnlyIds) {
  assert(!mainScreen.includes("id: " + JSON.stringify(id).replaceAll("\"", "\x27")), "MainScreenPlayFlow exposes disabled minigame: " + id);
}
assert(mainScreen.includes("useState<MiniGameId[]>([])"), "Tour selection must start empty");
assert(mainScreen.includes("return unchanged ? currentSelected : stillAvailable;"), "Empty tour selection must remain stable");
assert(mainScreen.includes("selectedTourMiniGames.length === 0"), "Start Tour must be disabled when empty");
assert(mainScreen.includes("selectedMiniGames.indexOf(miniGame.id) + 1"), "Current lobby must display selection order");
assert(mainScreen.includes("main-screen-mini-card-order"), "Current lobby order badge missing");

const overlay = read("src/ui-react/components/gameplay/GameplayOverlay.tsx");
assert(overlay.includes("RoundScoreBoard"), "Round score screen missing");
assert(overlay.includes("TourCompleteSummary"), "Final scoreboard missing");
assert(overlay.includes("snapshot.activeSessionMode === \x27tour\x27"), "Tour mode must be based on core session mode");

const tourDefs = read("src/game-core/tours/tour-phase-definitions.ts");
assert(tourDefs.includes("phase: \x27mini_game_intro\x27"), "mini_game_intro phase missing");
assert(tourDefs.includes("phase: \x27tour_starting\x27"), "tour_starting phase missing");
assert(tourDefs.includes("phase: \x27answer_window_open\x27"), "answer_window_open phase missing");
assert(tourDefs.includes("phase: \x27scoring\x27"), "scoring phase missing");
assert(tourDefs.includes("phase: \x27tour_complete\x27"), "tour_complete phase missing");

console.log("v2 final flow lock verified.");
