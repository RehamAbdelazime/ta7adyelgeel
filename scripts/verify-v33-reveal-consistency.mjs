#!/usr/bin/env node
/** V33 maintenance regression: answer reveal and stage lights share one host-controlled state. */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = file => readFileSync(path.join(root, file), 'utf8');
const state = read('src/ui-react/components/gameplay/shared/RoundRevealCompletionContext.tsx');
const stage = read('src/ui-react/components/visual/GameSceneStage.tsx');
const overlay = read('src/ui-react/components/gameplay/GameplayOverlay.tsx');
const lights = read('src/ui-react/components/visual/VisualWorldLayer.tsx');
assert(state.includes('getScoringRevealKey') && state.includes('completedScoringRevealKey'));
assert(stage.includes('<RoundRevealCompletionProvider>') && stage.includes('<GameViewSnapshotProvider'));
assert(overlay.includes('getScoringRevealKey(') && overlay.includes('setCompletedScoringRevealKey(scoringRevealKey)'));
assert(lights.includes('getScoringRevealKey(') && lights.includes('completedScoringRevealKey === revealKey'));
assert(!lights.includes('4800') && !lights.includes('finishedLightRevealKey'), 'Stage lights must not automatically leave answer reveal');
assert(!overlay.includes('function AnswersLockedScreen') && !overlay.includes('function PrepareCountdown'), 'Unused screens removed');
console.log('V33 answer/lighting alignment PASS — one host-controlled completion state, no obsolete auto timer.');
