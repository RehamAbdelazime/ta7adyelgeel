import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const spriteDir = path.resolve('public/assets/game/runtime/characters/stage-ready');
const typeSource = readFileSync('src/ui-react/components/gameplay/shared/overlay-types.ts', 'utf8');
const ids = typeSource.match(/CHARACTER_IDS = \[([^\]]+)\]/)?.[1]?.match(/'[^']+'/g)?.map(x => x.slice(1, -1));
assert(ids?.length === 11, 'Character registry must remain in sync with sprites');
const aliasesSource = readFileSync('src/ui-react/components/gameplay/citizens/sprite-frame-aliases.generated.ts', 'utf8');
const aliases = Object.fromEntries([...aliasesSource.matchAll(/^  "([^"]+)": "([^"]+)",?$/gm)].map(m => [m[1], m[2]]));
const actions = ['dead', 'idle', 'jump', 'run', 'slide', 'walk'];
let total = 0, mapped = 0;
for (const id of ids) for (const action of actions) for (let n = 0; n < 10; n++) {
  const key = `${id}/${action}/${action}_${String(n).padStart(2, '0')}.png`;
  const resolved = aliases[key] ?? key;
  assert(!aliases[resolved], `Alias chain or cycle is not allowed: ${key}`);
  assert(existsSync(path.join(spriteDir, resolved)), `Missing animation asset: ${key} -> ${resolved}`);
  assert(resolved.startsWith(`${id}/`), `Cross-character sprite alias is unsafe: ${key}`);
  if (resolved !== key) mapped++;
  total++;
}
assert.equal(mapped, Object.keys(aliases).length, 'Alias map contains invalid or stale keys');
assert(total === 660, 'Expected complete sprite animation frame coverage');
const citizen = readFileSync('src/ui-react/components/gameplay/citizens/CitizenPlaza.tsx', 'utf8');
assert(citizen.includes('SPRITE_FRAME_ALIASES[spriteFramePath]'), 'Rendering must resolve frame aliases');
console.log(`Sprite aliases verified: ${total} logical frames, ${mapped} reused without duplicate PNG bytes.`);
