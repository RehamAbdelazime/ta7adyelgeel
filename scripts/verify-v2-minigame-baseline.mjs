import fs from "node:fs";

const active = ["food-origin", "shape-count", "maze-gates", "guess-logo"];
const disabled = ["true-fake", "memory-count", "hangman", "couple-or-siblings"];

function fail(message) {
  console.error(message);
  process.exit(1);
}

function read(path) {
  return fs.readFileSync(path, "utf8");
}

const gameplay = JSON.parse(read("public/assets/game/runtime/config/gameplay-config.json"));

for (const key of ["miniGameRotation", "enabledMiniGames"]) {
  const value = gameplay.tour[key];
  if (JSON.stringify(value) !== JSON.stringify(active)) {
    fail("Invalid gameplay config " + key + ": " + JSON.stringify(value));
  }
}

if (gameplay.tour.defaultRoundCount !== 3) {
  fail("defaultRoundCount must be 3");
}

const uiFiles = [
  "src/ui-react/components/play/MainScreenPlayFlow.tsx",
  "src/ui-react/components/play/PlayLauncher.tsx",
  "src/ui-react/components/streamer/HostProductionPanel.tsx",
  "src/ui-react/components/streamer/DeveloperQaPanel.tsx"
];

for (const file of uiFiles) {
  const text = read(file);
  for (const id of disabled) {
    if (text.includes("id: " + JSON.stringify(id).replaceAll("\"", "\x27"))) {
      fail(file + " still exposes disabled mini-game id: " + id);
    }
  }
}

const runtimeConfig = read("src/game-core/config/runtime-game-config.ts");
const miniGameIdsBlock = runtimeConfig.match(/export const MINI_GAME_IDS:[\s\S]*?\];/);
if (!miniGameIdsBlock) {
  fail("Could not find MINI_GAME_IDS block");
}

for (const id of active) {
  if (!miniGameIdsBlock[0].includes(id)) {
    fail("MINI_GAME_IDS is missing active mini-game: " + id);
  }
}

for (const id of disabled) {
  if (miniGameIdsBlock[0].includes(id)) {
    fail("MINI_GAME_IDS still includes disabled mini-game: " + id);
  }
}

console.log("v2 minigame baseline verified.");
