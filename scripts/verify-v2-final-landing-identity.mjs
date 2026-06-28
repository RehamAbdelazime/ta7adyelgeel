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

const mainScreen = read("src/ui-react/components/play/MainScreenPlayFlow.tsx");
const translations = read("src/game-core/localization/translations.ts");
const localeTypes = read("src/game-core/localization/locale-types.ts");
const styles = read("src/ui-react/styles.css");

assert(mainScreen.includes("LANDING_LOGO_AR"), "Arabic landing logo is not wired");
assert(mainScreen.includes("LANDING_LOGO_EN"), "English landing logo is not wired");
assert(mainScreen.includes("main-screen-brand-logo"), "Landing brand logo element missing");
assert(mainScreen.includes("ui.landing.brand"), "Landing brand translation key missing in UI");
assert(mainScreen.includes("ui.landing.slogan"), "Landing slogan translation key missing in UI");
assert(!mainScreen.includes("Ta7ady ELGEEL"), "Old hardcoded brand still exists");
assert(!mainScreen.includes("WELCOME TO"), "Hardcoded welcome text still exists");
assert(!mainScreen.includes("LIVE CHAT"), "Hardcoded live chat text still exists");
assert(localeTypes.includes("\x27ui.landing.brand\x27"), "ui.landing.brand type key missing");
assert(translations.includes("\x27ui.landing.brand\x27: \x27Ta7ady ElGeel\x27"), "English landing brand missing");
assert(translations.includes("\\u062a\\u062d\\u062f\\u064a \\u0627\\u0644\\u062c\\u064a\\u0644"), "Arabic landing brand unicode text missing");
assert(translations.includes("\\u0625\\u062b\\u0628\\u062a \\u0644\\u0644\\u0622\\u062e\\u0631"), "Arabic slogan unicode text missing");
assert(styles.includes("Batch 40A final landing identity"), "Landing identity CSS block missing");
assert(fs.existsSync("public/assets/game/runtime/ui/main/ta7ady_landing_logo_ar.png"), "Arabic landing logo asset missing");
assert(fs.existsSync("public/assets/game/runtime/ui/main/ta7ady_landing_logo_en.png"), "English landing logo asset missing");

console.log("v2 final landing identity verified.");
