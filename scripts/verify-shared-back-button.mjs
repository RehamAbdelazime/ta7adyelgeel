import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync('src/ui-react/components/play/MainScreenPlayFlow.tsx', 'utf8');
const button = readFileSync('src/ui-react/components/shared/ScreenBackButton.tsx', 'utf8');
const css = readFileSync('src/ui-react/styles/screen-back-button.css', 'utf8');
const imports = readFileSync('src/ui-react/main.tsx', 'utf8');

assert.match(source, /import \{ ScreenBackButton \} from '\.\.\/shared\/ScreenBackButton'/);
assert.equal(source.match(/<ScreenBackButton onBack=\{onBack\} \/>/g)?.length, 2,
  'Mode Picker and Game Picker must both reuse ScreenBackButton.');
assert.doesNotMatch(source, /function ScreenBackButton\(/,
  'Shared back control must not be duplicated inside MainScreenPlayFlow.');
assert.match(button, /className="screen-back-button"/);
assert.doesNotMatch(button, /main-screen-back-button/,
  'Legacy back class bypasses the shared component style.');
assert.match(css, /\.main-screen-mode-layout \.screen-back-button/);
assert.match(css, /\.main-screen-game-grid-layout \.screen-back-button/);
assert.match(css, /inset-inline-start/,
  'Back button must respect RTL logical positioning.');
assert.match(css, /:focus-visible/,
  'Shared back control needs a keyboard focus state.');
assert.match(css, /prefers-reduced-motion/);
assert.ok(imports.indexOf("import './styles/screen-back-button.css'") > imports.indexOf("import './styles/game-picker-v14.css'"),
  'Shared Back CSS should be the final override after legacy screen styles.');
console.log('Shared back control: reused in Mode Picker and Game Picker; scoped visual styles + RTL PASS.');
