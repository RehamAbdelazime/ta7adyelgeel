import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourcePath = path.join(projectRoot, 'public/assets/game/runtime/config/gameplay-config.json');
const outputPath = path.join(projectRoot, 'src/game-core/config/runtime-game-config.defaults.generated.ts');

const raw = fs.readFileSync(sourcePath, 'utf8');
const config = JSON.parse(raw);

if (!config || typeof config !== 'object' || Array.isArray(config) || !config.tour) {
  throw new Error('gameplay-config.json must contain a root object with a tour section.');
}

const generated = [
  '/**',
  ' * GENERATED FILE — DO NOT EDIT BY HAND.',
  ' * Source: public/assets/game/runtime/config/gameplay-config.json',
  ' * Regenerate with: node scripts/generate-runtime-game-config.mjs',
  ' */',
  `export const DEFAULT_RUNTIME_GAME_CONFIG_DATA = ${JSON.stringify(config, null, 2)} as const;`,
  '',
].join('\n');

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, generated, 'utf8');
console.log('Generated runtime-game-config.defaults.generated.ts from gameplay-config.json.');
