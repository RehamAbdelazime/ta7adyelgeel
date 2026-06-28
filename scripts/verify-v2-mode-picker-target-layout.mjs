import fs from "node:fs";

function read(path) {
  return fs.readFileSync(path, "utf8");
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

const styles = read("src/ui-react/styles.css");
const translations = read("src/game-core/localization/translations.ts");

if (!styles.includes("Batch 40B mode picker target layout")) {
  fail("Mode picker target CSS is missing.");
}

if (!translations.includes("\\u0647\\u0646\\u0644\\u0639\\u0628 \\u0625\\u064a\\u0647\\u061f")) {
  fail("Arabic mode title is not fixed.");
}

if (!translations.includes("\\u0627\\u062e\\u062a\\u0627\\u0631 \\u0627\\u0644\\u0645\\u0648\\u062f")) {
  fail("Arabic mode subtitle is not fixed.");
}

console.log("v2 mode picker target layout verified.");
