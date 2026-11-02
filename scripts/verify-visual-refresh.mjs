import { readOrderedCss } from './lib/ordered-css-source.mjs';
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const requiredFiles = [
  "src/ui-react/assets/fonts/LaboDisplay.ttf",
  "src/ui-react/components/play/MainScreenPlayFlow.tsx",
  "src/ui-react/components/gameplay/shared/citizen-helpers.ts",
  "src/ui-react/styles.css",
];

function fail(message) {
  console.error(`[visual-refresh] ${message}`);
  process.exit(1);
}

for (const relativePath of requiredFiles) {
  const absolutePath = path.join(root, relativePath);
  if (!fs.existsSync(absolutePath)) fail(`Missing required file: ${relativePath}`);
}

const fontPath = path.join(root, requiredFiles[0]);
if (fs.statSync(fontPath).size < 1_000) fail("Labo Display font asset looks incomplete.");

const playFlow = fs.readFileSync(path.join(root, requiredFiles[1]), "utf8");
for (const marker of [
  "main-screen-play-cta",
  "main-screen-play-cta-underline",
  "main-screen-play-cta-particles",
]) {
  if (!playFlow.includes(marker)) fail(`Play interaction is missing ${marker}.`);
}
if (playFlow.includes("main-screen-play-button-redesign")) {
  fail("The legacy Play button is still used by the lobby screen.");
}

const questionShell = fs.readFileSync(path.join(root, "src/ui-react/components/gameplay/shared/question-shell.tsx"), "utf8");
if (questionShell.includes("Luckiest Guy") || !questionShell.includes("var(--display-font)")) {
  fail("The shared question shell is not using the unified display font token.");
}

const helpers = fs.readFileSync(path.join(root, requiredFiles[2]), "utf8");
for (const characterId of ["cat", "dog", "robot", "stage_office", "stage_chef"]) {
  if (!helpers.includes(`${characterId}:`)) fail(`Character calibration is missing ${characterId}.`);
}
if (!helpers.includes("66 - row * 9.2")) fail("Audience side formation has not been recalibrated for the larger sprites.");

const css = readOrderedCss();
for (const marker of [
  '@font-face',
  'font-family: "Labo Display"',
  'url("../../assets/fonts/LaboDisplay.ttf")',
  "html body #root *",
  "main-screen-play-cta-underline",
  "concert-host-presenter-layer-intro .concert-host-presenter-mascot",
  "--citizen-visual-scale",
  "--display-font",
  "Tajawal",
  "font-family: var(--display-font) !important;",
  "width: 0 !important;",
  "left: 5.5% !important;",
  "width: clamp(250px, 14.2vw, 286px) !important;",
]) {
  if (!css.includes(marker)) fail(`Visual stylesheet is missing ${marker}.`);
}
if (css.includes('"Luckiest Guy"') || css.includes('font-family: Inter,')) {
  fail("Legacy screen typography declarations remain in the visual stylesheet.");
}
if (!css.includes("width: 78% !important;")) fail("Play hover underline expansion is missing.");

console.log("Visual refresh assets and UI hooks verified.");
