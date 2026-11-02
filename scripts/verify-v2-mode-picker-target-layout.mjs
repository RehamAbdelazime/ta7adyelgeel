import fs from 'node:fs';
import assert from 'node:assert/strict';
import { readOrderedCss } from './lib/ordered-css-source.mjs';
const css = readOrderedCss() + fs.readFileSync('src/ui-react/styles/premium-stage-mode.css', 'utf8');
const flow = fs.readFileSync('src/ui-react/components/play/MainScreenPlayFlow.tsx', 'utf8');
const translations = fs.readFileSync('src/game-core/localization/translations.ts', 'utf8');
for (const selector of ['.main-screen-mode-layout', '.premium-mode-cards', '.premium-mode-card']) {
  assert(css.includes(selector), `Mode picker selector missing: ${selector}`);
  assert(flow.includes(selector.slice(1)), `Mode picker component missing: ${selector}`);
}
assert(translations.includes('WHAT ARE WE PLAYING?'), 'Mode heading English translation missing');
console.log('Mode picker current modular CSS and React markup verified.');
