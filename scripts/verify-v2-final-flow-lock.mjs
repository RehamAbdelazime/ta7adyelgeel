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

const mainScreen = read("src/ui-react/components/play/MainScreenPlayFlow.tsx");
const playLauncher = read("src/ui-react/components/play/PlayLauncher.tsx");
for (const file of [["MainScreenPlayFlow", mainScreen], ["PlayLauncher", playLauncher]]) {
  for (const id of qaOnlyIds) {
    assert(!file[1].includes("id: " + JSON.stringify(id).replaceAll("\"", "\x27")), file[0] + " exposes disabled minigame: " + id);
  }
  assert(file[1].includes("useState<MiniGameId[]>([])"), file[0] + " must start tour selection empty");
  assert(file[1].includes("return unchanged ? currentSelected : stillAvailable;"), file[0] + " must preserve a manual empty tour selection without creating render loops");
  assert(file[1].includes("selectedTourMiniGames.length === 0"), file[0] + " must disable Start Tour when empty");
}

assert(playLauncher.includes("selectedOrder = selectedTourMiniGames.indexOf"), "PlayLauncher must show tour selection order");
assert(playLauncher.includes("play-mini-game-order-badge"), "PlayLauncher order badge missing");

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
