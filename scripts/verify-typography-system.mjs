import fs from 'node:fs';
import assert from 'node:assert/strict';
import path from 'node:path';

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const entry = read('src/ui-react/main.tsx');
const stylesheet = read('src/ui-react/styles/typography-system-v11.css');
const pkg = JSON.parse(read('package.json'));
const lock = JSON.parse(read('package-lock.json'));
const app = read('src/ui-react/App.tsx');
const auth = read('src/ui-react/components/settings/TwitchAuthGate.tsx');

for (const font of ['fredoka', 'alexandria']) {
  const name = `@fontsource-variable/${font}`;
  assert.equal(pkg.dependencies[name], '5.3.0', `${name} must be locked`);
  assert.equal(lock.packages[''].dependencies[name], '5.3.0');
  assert.equal(lock.packages[`node_modules/${name}`].version, '5.3.0');
  assert.ok(entry.includes(`import '${name}/wght.css';`), `missing import for ${name}`);
}
assert.ok(entry.lastIndexOf('typography-system-v11.css') > entry.lastIndexOf('casual-settings-v10.css'));
assert.match(stylesheet, /--display-font:\s*var\(--font-game-title\)/);
assert.match(stylesheet, /main\[lang="ar"\]/);
assert.match(stylesheet, /main-screen-mode-layout/);
assert.match(stylesheet, /casual-settings/);
assert.match(stylesheet, /gameplay-citizen-nameplate/);
assert.match(app, /lang=\{snapshot\.locale\}/);
assert.match(auth, /lang=\{snapshot\.locale\}/);
console.log('Typography integration checks passed: bilingual fonts, language binding, import order, and primary screens.');
