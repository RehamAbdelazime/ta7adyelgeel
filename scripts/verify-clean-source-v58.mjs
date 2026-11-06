#!/usr/bin/env node
/** Zero-dependency, read-only V58 cleanup contract. */
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const inside = (...segments) => path.join(root, ...segments);
const failures = [];
const check = (ok, message) => { if (!ok) failures.push(message); };
const walk = dir => readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
  const full = path.join(dir, entry.name);
  return entry.isDirectory() ? walk(full) : entry.isFile() ? [full] : [];
});

// These classes belonged exclusively to a deleted V45 QA Host Panel. The
// actual stage host is named concert-host-*/qshell-host-* and MUST remain.
const cssFiles = walk(inside('src','ui-react','styles')).filter(f => f.endsWith('.css'));
for (const file of cssFiles) {
  const source = readFileSync(file,'utf8');
  check(!/\.host-[A-Za-z_0-9-]+/.test(source), `${path.relative(root,file)} still contains retired Host Panel CSS`);
  check(!/\.(?:ctb-scoring(?:-[A-Za-z_0-9-]+)?|play-mini-game-order-badge|twitch-connection-panel|twitch-panel-heading)\b/.test(source),
    `${path.relative(root,file)} still contains styles for components removed in V58`);
}
for (const retired of [
  'src/ui-react/components/streamer/HostPanelToggle.tsx',
  'src/ui-react/components/streamer/HostProductionPanel.tsx',
  'src/ui-react/components/streamer/DeveloperQaPanel.tsx',
  'src/ui-react/styles/host-panel-v45.css',
  'scripts/apply-v33-cleanup.mjs',
  'scripts/cleanup-delete-manifest-v33.json',
  'src/ui-react/components/play/PlayLauncher.tsx',
  'src/ui-react/components/gameplay/shared/ScoringGuide.tsx',
  'src/ui-react/components/settings/TwitchConnectionPanel.tsx',
  'src/game-core/utils/seeded-shuffle.ts',
]) check(!existsSync(inside(retired)), `Retired file is back in source: ${retired}`);
const app = readFileSync(inside('src/ui-react/App.tsx'),'utf8');
const host = readFileSync(inside('src/ui-react/components/visual/HostMascotLayer.tsx'),'utf8');
check(!/HostPanelToggle|HostProductionPanel|DeveloperQaPanel/.test(app), 'QA Host Panel is mounted in production');
check(host.includes('PrivateStreamerAnswerDock'), 'Real host private answer UI has been removed');
const bank = JSON.parse(readFileSync(inside('src/game-core/minigames/visual-guess/visual-guess-questions.json'),'utf8'));
const clues = JSON.parse(readFileSync(inside('src/game-core/minigames/visual-guess/movie-clues.generated.json'),'utf8')).clues;
const media = inside('public/assets/game/runtime/minigames/visual-guess');
for (const folder of ['Posters','Frame','Quotes']) check(existsSync(path.join(media,folder)), `Missing user content folder ${folder}`);
const posterMovies = bank.movies.filter(m=>m.asset?.startsWith('Posters/'));
check(posterMovies.length>0, 'Poster bank is empty');
for (const movie of posterMovies) check(existsSync(path.join(media,movie.asset)), `Missing poster ${movie.asset}`);
for (const clue of clues) {
  if (clue.asset) check(existsSync(path.join(media,clue.asset)), `Missing generated ${clue.kind} clue: ${clue.asset}`);
  else check(clue.kind==='quote' && clue.text?.ar && clue.text?.en, `Malformed text clue ${clue.id}`);
}
check(existsSync(inside('src/ui-react/assets/fonts/LaboDisplay.ttf')), 'Local display font missing');
check(existsSync(inside('src/ui-react/components/visual/HostMascotLayer.tsx')), 'Host visuals missing');
const forbidden = /(?:^|\/)(?:Thumbs\.db|desktop\.ini|\.DS_Store|__MACOSX|[^/]+\.(?:bak|old|orig|swp|swo|tmp|zip|exe|7z))$/i;
for (const folder of ['src','scripts','public','docs']) {
  for (const file of walk(inside(folder))) {
    const relative = path.relative(root,file).replaceAll('\\','/');
    check(!forbidden.test(relative), `Temporary or archive residue in shipped source: ${relative}`);
  }
}
const packageFile = JSON.parse(readFileSync(inside('package.json'),'utf8'));
check(!packageFile.scripts['cleanup:v33'], 'Deprecated V33 mutator is still exposed as an npm script');
check(packageFile.scripts['clean:preview']?.includes('--dry-run'), 'Non-destructive clean preview missing');
check(packageFile.scripts['visuals:verify'] && packageFile.scripts['visuals:sync'], 'Movie-folder maintenance commands missing');
if (failures.length) {
  console.error(`V58 cleanup verification FAILED (${failures.length}):\n${failures.map(x=>' - '+x).join('\n')}`);
  process.exitCode = 1;
} else {
  assert(posterMovies.length <= bank.movies.length);
  console.log(`V58 source cleanup PASS: ${cssFiles.length} CSS files free of retired Host Panel CSS; ${posterMovies.length} local posters; ${clues.filter(c=>c.kind==='frame').length} frames; ${clues.filter(c=>c.kind==='quote').length} quotes; no untracked garbage.`);
}
