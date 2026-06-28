const fs = require('fs');

const source = 'dist-electron/preload.js';
const target = 'dist-electron/preload.cjs';

if (!fs.existsSync(source)) {
  console.error('Missing dist-electron/preload.js. Run tsc -p tsconfig.electron.json first.');
  process.exit(1);
}

let text = fs.readFileSync(source, 'utf8');

text = text.replace(
  /^import\s+\{\s*contextBridge\s*,\s*ipcRenderer\s*\}\s+from\s+['"]electron['"];?\s*$/m,
  "const { contextBridge, ipcRenderer } = require('electron');"
);

text = text.replace(/^export\s+\{\s*\};?\s*$/gm, '');

if (/^import\s+/m.test(text)) {
  console.error('preload.cjs conversion left ESM imports behind. Inspect dist-electron/preload.js.');
  process.exit(1);
}

fs.writeFileSync(target, text, 'utf8');
console.log('Electron preload CJS -> ' + target);
