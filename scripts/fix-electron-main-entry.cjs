const fs = require('fs');

const pkgPath = 'package.json';
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

if (!fs.existsSync('dist-electron/main.js')) {
  console.error('Missing dist-electron/main.js.');
  process.exit(1);
}

if (!fs.existsSync('dist-electron/preload.cjs')) {
  console.error('Missing dist-electron/preload.cjs.');
  process.exit(1);
}

pkg.main = 'dist-electron/main.js';
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');

console.log('Electron package main -> dist-electron/main.js');
console.log('Electron preload -> dist-electron/preload.cjs');
