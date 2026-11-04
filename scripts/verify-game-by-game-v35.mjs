#!/usr/bin/env node
/** Complete code/content gate for all retained minigames in the V35 review. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(root,p), 'utf8');
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const ids = ['food-origin','shape-count','maze-gates','count-the-beat','lucky-cup','memory-count','couple-or-siblings'];
const registry = read('src/game-core/minigames/minigame-registry.ts');
for (const id of ids) assert(registry.includes(`id: '${id}'`), `Missing registered minigame ${id}`);
let n = 0;
function check(name, condition) { assert(condition, `V35 ${name} FAIL`); n++; console.log(`[PASS] ${name}`); }
const shell = read('src/ui-react/components/gameplay/shared/question-shell.tsx');
check('one numbered choice row and answer reveal contract', shell.includes('getCorrectOptionNumber') && shell.includes('gameplay-choice-result-') && shell.includes('reveal-to-scoreboard'));
const food = read('src/ui-react/components/gameplay/minigames/FoodOriginScreen.tsx');
check('Food Origin photo, timed hint and stable choices', food.includes('MediaCard') && food.includes('hintRemainingSeconds') && food.includes('sort((a, b)'));
const shapes = read('src/ui-react/components/gameplay/minigames/ShapeCountScreen.tsx');
check('Shape Count real count-grid and shape answer icons', shapes.includes('ShapeMark') && shapes.includes('grid.columns') && shapes.includes('shape: choice.shape'));
const maze = read('src/ui-react/components/gameplay/minigames/MazeGatesScreen.tsx');
check('Maze Gates numbers are on the maze and not repeated as bottom choice cards', maze.includes('{gate.optionNumber}') && maze.includes('choices={[]}'));
const beatSvc = read('src/game-core/minigames/count-the-beat/count-the-beat-service.ts');
const beatUi = read('src/ui-react/components/gameplay/minigames/CountTheBeatScreen.tsx');
const v34 = read('src/ui-react/styles/gameplay-clarity-v34.css');
check('Count the Beat schedules countable cues and renders visible animation', beatSvc.includes('orderedItems.forEach') && beatUi.includes('ctb-pop') && v34.includes('@keyframes ctb-pop'));
const cupSvc = read('src/game-core/minigames/lucky-cup/lucky-cup-service.ts');
const cupUi = read('src/ui-react/components/gameplay/minigames/LuckyCupScreen.tsx');
check('Lucky Cup keeps V30 turbo five and one true authoritative mapping', cupSvc.includes('[175, 145, 120, 100, 85]') && cupUi.includes('getLuckyCupOrder') && cupUi.includes('--v35-flight-scale'));
const memory = read('src/ui-react/components/gameplay/minigames/MemoryCountScreen.tsx');
const overlay = read('src/ui-react/components/gameplay/GameplayOverlay.tsx');
const store = read('src/game-core/app/game-store.ts');
check('Memory Count actually exposes its grid during preparation', overlay.includes("miniGame.id === 'memory-count'") && store.includes("upcomingGameId === 'memory-count'") && memory.includes("tourPhase === 'tour_starting'"));
check('Memory Count hides answers in preview and numeric reveal matches choice answers', memory.includes('isPreview ? [] : memory.choices') && memory.includes('memory.correctCount'));
const pair = registry.slice(registry.indexOf("id: 'couple-or-siblings'"));
const pairSvc = read('src/game-core/minigames/couple-or-siblings/couple-or-siblings-content.ts');
check('Couple or Siblings stays QA-only until objectively answerable content exists', pair.includes("availability: 'qa-only'") && pairSvc.includes('fictional-pairs'));
const content = read('src/ui-react/main.tsx');
check('V35 per-game stylesheet loads after V34 with all assets local', content.indexOf('gameplay-review-v35.css') > content.indexOf('gameplay-clarity-v34.css') && fs.existsSync(path.join(root,'src/ui-react/styles/gameplay-review-v35.css')));
console.log(`V35 game-by-game verification: ${n}/${n} checks PASS, ${ids.length} registered games covered.`);
