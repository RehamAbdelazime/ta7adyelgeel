import fs from 'node:fs';
import path from 'node:path';

// Walk local @imports in DOM cascade order. This is the source used by CSS
// regression checks; inspecting only styles.css would miss the split modules.
export function readOrderedCss(entry = 'src/ui-react/styles.css') {
  const root = process.cwd();
  const visited = new Set();
  function expand(relativeFile) {
    const full = path.resolve(root, relativeFile);
    if (!full.startsWith(root + path.sep)) throw new Error(`Unsafe CSS import: ${relativeFile}`);
    if (visited.has(full)) throw new Error(`CSS import cycle / repeated import: ${relativeFile}`);
    visited.add(full);
    const css = fs.readFileSync(full, 'utf8');
    return css.replace(/^@import\s+["']([^"']+\.css)["'];\s*$/gm, (_all, dependency) =>
      expand(path.relative(root, path.resolve(path.dirname(full), dependency))));
  }
  return expand(entry);
}
