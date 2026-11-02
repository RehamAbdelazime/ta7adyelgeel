import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { readOrderedCss } from './lib/ordered-css-source.mjs';

const entry = readFileSync('src/ui-react/styles.css', 'utf8');
const imports = [...entry.matchAll(/^@import "([^"]+\.css)";/gm)].map(m => m[1]);
assert.equal(imports.length, 17, 'The ordered legacy CSS must contain all 17 modules');
for (const file of imports) {
  assert(file.startsWith('./styles/legacy/'), `Unexpected CSS import path: ${file}`);
  assert(existsSync(path.resolve('src/ui-react',file)), `Missing CSS module ${file}`);
}
const css = readOrderedCss();
assert(css.includes('url("../../assets/fonts/LaboDisplay.ttf")'), 'Font CSS URL must be relative to its module location');
assert(existsSync('src/ui-react/assets/fonts/LaboDisplay.ttf'), 'Display font asset missing');
assert(css.includes('url("/assets/game/runtime/background/twitch_login_background.png")'), 'Public image must use Vite base-aware URL');
assert(existsSync('public/assets/game/runtime/background/twitch_login_background.png'), 'Auth image asset missing');
assert(css.includes('.app-desktop-shell'), 'Desktop shell rules missing');
assert(css.includes('@media (prefers-reduced-motion: reduce)'), 'Reduced motion safety missing');
assert(entry.length < 2000, 'Entrypoint should only list the modules');
const premium = readFileSync('src/ui-react/main.tsx', 'utf8');
assert(premium.indexOf("import './styles.css'") < premium.indexOf("import './styles/premium-lobby.css'"));
assert(premium.indexOf("import './styles/premium-lobby.css'") < premium.indexOf("import './styles/premium-stage-mode.css'"));
console.log(`Modular CSS verified: ${imports.length} ordered modules, ${css.split('\n').length} combined lines.`);
