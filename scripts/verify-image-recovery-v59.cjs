#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const snap = JSON.parse(fs.readFileSync(path.join(root,'src/game-core/minigames/visual-guess/media-fallbacks.generated.json'),'utf8'));
const bank = JSON.parse(fs.readFileSync(path.join(root,'src/game-core/minigames/visual-guess/visual-guess-questions.json'),'utf8'));
const clues = JSON.parse(fs.readFileSync(path.join(root,'src/game-core/minigames/visual-guess/movie-clues.generated.json'),'utf8'));
const ui = fs.readFileSync(path.join(root,'src/ui-react/components/gameplay/minigames/VisualGuessScreen.tsx'),'utf8');
const pkg = JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));
assert.equal(pkg.scripts.start, 'npm run build && electron .','npm start MUST rebuild the renderer, not just Electron');
assert.match(pkg.scripts.build,/vite build && npm run verify:renderer-media-v59 && npm run build:electron/);
assert.match(pkg.scripts['visuals:sync'],/generate-movie-fallback-v59/);
assert.match(ui,/if \(!useBundledFallback && embeddedImage\) setUseBundledFallback\(true\)/);
assert.match(ui,/src=\{displayedImageUrl\}/);
const expected = new Set([...bank.movies.map(m=>m.asset).filter(Boolean),...clues.clues.map(c=>c.asset).filter(Boolean)]);
assert.equal(expected.size,Object.keys(snap.assets).length,'Every playable image needs an offline fallback');
for (const key of expected) {
  assert.match(key,/^(Posters|Frame)\/[\w.-]+\.(jpg|jpeg|png|webp|avif)$/i);
  const info = snap.assets[key];
  assert.ok(info,`Missing inline fallback: ${key}`);
  const original = fs.readFileSync(path.join(root,'public/assets/game/runtime/minigames/visual-guess',key));
  assert.equal(crypto.createHash('sha256').update(original).digest('hex'),info.sha256,`Stale fallback: ${key}`);
  const parts = info.dataUrl.match(/^data:image\/(webp|jpeg|png|avif);base64,(.+)$/);
  assert.ok(parts,`Invalid data URL: ${key}`);
  const bytes = Buffer.from(parts[2],'base64');
  assert.ok(bytes.length>1000,`Empty preview: ${key}`);
  if(parts[1]==='webp') assert.equal(bytes.subarray(0,4).toString(),'RIFF',`Broken preview: ${key}`);
}
console.log(`[V59] PASS: ${expected.size} real images with bundled fallbacks, npm start rebuilds dist, renderer preflight wired.`);
