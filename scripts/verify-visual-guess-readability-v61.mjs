import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const root = new URL('../', import.meta.url);
const read = file => readFileSync(new URL(file, root), 'utf8');
const screen = read('src/ui-react/components/gameplay/minigames/VisualGuessScreen.tsx');
const stylesheet = read('src/ui-react/styles/visual-guess-readability-v61.css');
const imports = read('src/ui-react/main.tsx');
const service = read('src/game-core/minigames/visual-guess/visual-guess-service.ts');

// A frame should never inherit blur from the progressive poster/quote effect.
assert.match(screen, /isFrame\s*\?\s*\{\s*filter:\s*'none'\s*\}/);
assert.match(screen, /isMovieQuote\s*\?\s*\{\s*filter:\s*quoteImageBlur/);
assert.match(screen, /isPoster\s*\?\s*posterImageStyle/);
assert.match(screen, /data\.mode\s*===\s*'reveal'\s*&&\s*!isFrame/);
assert.match(service, /المشهد ده من فيلم إيه؟/);

// Answers must wrap, avoid ellipses, gain extra space and respect the existing
// four-choice order on desktop. These styles are scoped to visual trivia only.
assert.match(stylesheet, /\.v36-visual-shell/);
assert.match(stylesheet, /white-space:\s*normal\s*!important/);
assert.match(stylesheet, /text-overflow:\s*clip\s*!important/);
assert.match(stylesheet, /overflow-wrap:\s*anywhere\s*!important/);
assert.match(stylesheet, /grid-template-rows:\s*minmax\(0,\s*1fr\)\s*clamp\(108px/);
assert.match(stylesheet, /v61-visual-answers-long/);
assert.match(stylesheet, /v61-visual-answers-xl/);
assert.match(stylesheet, /@media \(max-width:\s*900px\)/);
assert.match(screen, /const longestChoice = Math\.max/);
assert.match(imports, /import '\.\/styles\/visual-guess-readability-v61\.css';/);
assert(imports.indexOf("import './styles/visual-guess-readability-v61.css';") > imports.indexOf("import './styles/visual-guess-v36.css';"), 'V61 overrides must be after the legacy choice rules');

console.log('[V61] PASS: frame never blurred; poster/quote effects retained; long answers wrap with reserved height and responsive layout.');
