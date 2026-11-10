#!/usr/bin/env node
/** V66/V67 offline celebrity-photo contract. One playable answer identity may
 * own many real user-provided eye/full portrait pairs. Identity is from names
 * explicitly supplied in filenames/manifest ONLY, never from image inference.
 */
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cwd = relative => path.join(root, relative);
const mroot = 'public/assets/game/runtime/minigames/visual-guess/';
const manifest = JSON.parse(await readFile(cwd('src/game-core/minigames/visual-guess/star-uploads-v66.json'), 'utf8'));
const bank = JSON.parse(await readFile(cwd('src/game-core/minigames/visual-guess/visual-guess-questions.json'), 'utf8'));
assert(manifest.schemaVersion === 1 && manifest.photos.length > 0);
assert.equal(new Set(manifest.photos.map(p => p.id)).size, manifest.photos.length);
const named = manifest.photos.filter(p => p.name.ar?.trim() && p.name.en?.trim());
const people = new Set(named.map(p => p.personKey));
assert.equal(bank.stars.length, people.size, 'Every PERSON, not every photo, must be one quiz answer. Run npm run visuals:sync.');
assert(bank.stars.length >= 4);
assert.equal(new Set(bank.stars.map(s => s.id)).size, bank.stars.length);
assert.equal(new Set(bank.stars.map(s => s.name.ar)).size, bank.stars.length, 'No celebrity may appear twice in the answer bank');
let pending = 0;
for (const photo of manifest.photos) {
  for (const field of ['photo', 'eyes']) {
    const rel = photo[field];
    assert(/^Stars\/(Full|Eyes)\/uploaded-\d{2,}\.jpg$/.test(rel), `Unsafe star asset ${rel}`);
    const f = await readFile(cwd(mroot + rel));
    assert(f.length > 1500 && f[0] === 255 && f[1] === 216 && f.at(-1) === 217, `Bad local JPEG: ${rel}`);
    if (process.argv.includes('--check-dist')) {
      const built = await readFile(cwd('dist/assets/game/runtime/minigames/visual-guess/' + rel)).catch(() => null);
      assert(built && createHash('sha256').update(f).digest('hex') === createHash('sha256').update(built).digest('hex'), `Missing/outdated bundled star photo: ${rel}`);
    }
  }
  if (!photo.name.ar?.trim()) { pending++; continue; }
  const star = bank.stars.find(s => s.personKey === photo.personKey);
  assert(star && star.imageUrl === '' && star.mode === 'eyes', `Missing named person: ${photo.personKey}`);
  const variant = star.photoVariants.find(v => v.id === photo.id);
  assert(variant && variant.asset === photo.photo && variant.eyesAsset === photo.eyes, `Wrong variant pair: ${photo.id}`);
  assert(['easy','medium','hard'].includes(star.difficulty));
  assert(!/^https?:/.test(star.imageUrl));
}
const screen = await readFile(cwd('src/ui-react/components/gameplay/minigames/VisualGuessScreen.tsx'), 'utf8');
const service = await readFile(cwd('src/game-core/minigames/visual-guess/visual-guess-service.ts'), 'utf8');
const css = await readFile(cwd('src/ui-react/styles/visual-guess-v36.css'), 'utf8');
assert(screen.includes('showingResult ? data.imageUrl : (data.eyesImageUrl'), 'Before reveal show eyes only; on scoring show FULL original');
assert(screen.includes('v66-star-eyes-frame') && screen.includes('v66-star-full-frame'));
assert(css.includes('v66-star-eyes-canvas') && css.includes('transition: none !important'));
assert(service.includes("'guess-star': ['eyes']"));
assert(service.includes('eyesImageUrl:') && service.includes('pickStarPhotoVariant('));
console.log(`[V67] PASS: ${manifest.photos.length} original/eye pairs; ${named.length} labeled photo variants for ${people.size} UNIQUE people, ${pending} names pending; 0 network images; eyes static until manual reveal.${process.argv.includes('--check-dist') ? ' dist byte-checked.' : ''}`);
