import fs from "node:fs";

const active = ["food-origin", "shape-count", "maze-gates", "guess-logo"];
const disabled = ["true-fake", "memory-count", "hangman", "couple-or-siblings"];

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

function sameArray(value, expected) {
  return Array.isArray(value) && JSON.stringify(value) === JSON.stringify(expected);
}

const config = JSON.parse(read("public/assets/game/runtime/config/gameplay-config.json"));
assert(config.tour.defaultRoundCount === 3, "defaultRoundCount must be 3");
assert(sameArray(config.tour.enabledMiniGames, active), "enabledMiniGames must match active v2 games");
assert(sameArray(config.tour.miniGameRotation, active), "miniGameRotation must match active v2 games");
assert(config.tour.phaseDurationsMs.answer_window_open === 20000, "answer window must be 20 seconds");

const runtimeConfig = read("src/game-core/config/runtime-game-config.ts");
const miniGameIdsBlock = runtimeConfig.match(/export const MINI_GAME_IDS:[\s\S]*?\];/);
assert(Boolean(miniGameIdsBlock), "MINI_GAME_IDS block missing");
for (const id of active) assert(miniGameIdsBlock[0].includes(id), "active minigame missing from MINI_GAME_IDS: " + id);
for (const id of disabled) assert(!miniGameIdsBlock[0].includes(id), "disabled minigame still in MINI_GAME_IDS: " + id);
assert(runtimeConfig.includes("defaultRoundCount: 3"), "runtime defaultRoundCount must be 3");
assert(runtimeConfig.includes("answer_window_open: 20_000"), "runtime answer window must be 20 seconds");

const mainScreen = read("src/ui-react/components/play/MainScreenPlayFlow.tsx");
const playLauncher = read("src/ui-react/components/play/PlayLauncher.tsx");
for (const file of [["MainScreenPlayFlow", mainScreen], ["PlayLauncher", playLauncher]]) {
  for (const id of disabled) {
    assert(!file[1].includes("id: " + JSON.stringify(id).replaceAll("\"", "\x27")), file[0] + " exposes disabled minigame: " + id);
  }
  assert(file[1].includes("useState<MiniGameId[]>([])"), file[0] + " must start tour selection empty");
  assert(file[1].includes("return stillAvailable;"), file[0] + " must not auto-fill tour selection");
  assert(file[1].includes("selectedTourMiniGames.length === 0"), file[0] + " must disable Start Tour when empty");
}

assert(playLauncher.includes("selectedOrder = selectedTourMiniGames.indexOf"), "PlayLauncher must show tour selection order");
assert(playLauncher.includes("play-mini-game-order-badge"), "PlayLauncher order badge missing");

const overlay = read("src/ui-react/components/gameplay/GameplayOverlay.tsx");
assert(overlay.includes("RoundScoreBoard"), "Round score screen missing");
assert(overlay.includes("TourCompleteSummary"), "Final scoreboard missing");
assert(overlay.includes("RoundIntermissionScreen"), "Top 3 intermission missing");
assert(overlay.includes("snapshot.activeSessionMode === \x27tour\x27"), "Top 3 intermission must be based on core session mode");
assert(overlay.includes("snapshot.nextMiniGameId"), "Top 3 intermission must use nextMiniGameId from core");

const tourDefs = read("src/game-core/tours/tour-phase-definitions.ts");
assert(tourDefs.includes("phase: \x27mini_game_intro\x27"), "mini_game_intro phase missing");
assert(tourDefs.includes("phase: \x27tour_starting\x27"), "tour_starting phase missing");
assert(tourDefs.includes("phase: \x27answer_window_open\x27"), "answer_window_open phase missing");
assert(tourDefs.includes("phase: \x27scoring\x27"), "scoring phase missing");
assert(tourDefs.includes("phase: \x27tour_complete\x27"), "tour_complete phase missing");

console.log("v2 final flow lock verified.");
