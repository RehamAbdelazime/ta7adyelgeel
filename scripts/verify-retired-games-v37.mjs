#!/usr/bin/env node
/** V37 regression guard: retired games are not registered, shipped or executable. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = rel => fs.readFileSync(path.join(root, rel), 'utf8');
const retired = ['true-fake', 'before-after', 'guess-logo', 'hangman'];
const registrySource = read('src/game-core/minigames/minigame-registry.ts');
const ids = [...registrySource.matchAll(/^\s*id: '([^']+)'/gm)].map(match => match[1]);
const expected = ['food-origin','shape-count','maze-gates','count-the-beat','lucky-cup','laser-challenge','guess-movie','guess-star','memory-count','couple-or-siblings'];
assert.equal(new Set(ids).size, 10, '10 unique games must remain');
assert.deepEqual([...ids].sort(), [...expected].sort(), 'Only the 10 approved games may remain');
const config = JSON.parse(read('public/assets/game/runtime/config/gameplay-config.json'));
const enabled = config.tour.enabledMiniGames;
const rotation = config.tour.miniGameRotation;
assert.deepEqual(enabled, expected.slice(0,8), '8 public games are enabled');
assert.deepEqual(rotation, expected.slice(0,6), 'Original auto-tour rotation plus Laser Challenge');
for (const id of retired) {
  assert(!ids.includes(id));
  assert(!enabled.includes(id));
  assert(!rotation.includes(id));
  assert(!Object.hasOwn(config.tour.singleMiniGameRoundCounts,id));
  assert(!Object.hasOwn(config.tour.miniGamePhaseOverridesMs,id));
}
const source = ['src','public'];
const found = [];
function visit(folder) {
  for (const item of fs.readdirSync(folder,{withFileTypes:true})) {
    const filename = path.join(folder,item.name);
    if (item.isDirectory()) visit(filename);
    else if (item.isFile()) {
      const rel = path.relative(root,filename).replaceAll(path.sep,'/');
      if (retired.some(id=>rel.includes(id))) found.push('obsolete path: '+rel);
      if (/\.(tsx?|jsx?|css|json|svg)$/.test(item.name)) {
        const text = fs.readFileSync(filename,'utf8');
        const pattern = /(?:true[-_]?fake|before[-_]?(?:or[-_]?)?after|guess[-_]?logo|hangman|TrueFake|BeforeOrAfter|GuessLogo|Hangman)/i;
        if(pattern.test(text)) found.push('obsolete reference: '+rel);
      }
    }
  }
}
for (const dir of source) visit(path.join(root,dir));
assert.deepEqual(found,[],'No retired game source, style, data, translations or artwork references may ship');
const screens = read('src/ui-react/components/gameplay/minigames/minigame-screen-registry.tsx');
for (const id of ids) assert(screens.includes(`'${id}':`) || screens.includes(`${id}:`),`Missing UI screen for ${id}`);
const store = read('src/game-core/app/game-store.ts');
assert(store.includes('this.guessMovieMiniGame') && store.includes('this.guessStarMiniGame'));
assert(store.includes('Unsupported mini-game.') && store.includes('Unregistered mini-game:'), 'No fallback to a removed game');
const policy = read('src/game-core/minigames/scoring-policy.ts');
for(const id of ids) assert(policy.includes(`'${id}':`) || policy.includes(`${id}:`),`Missing points for ${id}`);
const picker = read('src/ui-react/styles/visual-guess-v36.css');
assert(picker.includes('repeat(4, minmax(0, 1fr))'), 'Picker must fit 7 cards in 4-column two-row layout');
console.log(`V37 retired-game gate PASS: ${retired.length} removed, ${enabled.length} public + ${ids.length-enabled.length} QA retained, no orphan assets or UI imports.`);
