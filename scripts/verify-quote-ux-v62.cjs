/** V62: full immediate context for speaker/completion, readable phrase answers. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const root = path.join(__dirname, '..');
const policyFile = path.join(root, 'src/ui-react/components/gameplay/minigames/quote-display-policy.ts');
const policySource = fs.readFileSync(policyFile, 'utf8');
const transpiled = ts.transpileModule(policySource, {
  fileName: policyFile,
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
  reportDiagnostics: true,
});
assert(!transpiled.diagnostics?.some(issue => issue.category === ts.DiagnosticCategory.Error));
const moduleRef = { exports: {} };
new Function('exports', 'module', transpiled.outputText)(moduleRef.exports, moduleRef);
const count = moduleRef.exports.visibleQuoteWordCount;
for (const mode of ['speaker', 'complete']) {
  for (const phase of ['mini_game_intro', 'answer_window_open', 'scoring']) {
    for (const [progress, remaining] of [[0,20000],[.3,18000],[.8,3000],[1,1000]]) {
      assert.equal(count(mode, 12, .13, progress, false, remaining, phase), 12, `${mode} must display the entire prompt from the start`);
    }
  }
}
// The old movie quote discovery still has an initial partial clue, growing
// without prematurely revealing the whole line, then a full final-second clue.
assert(count('movie', 12, .25, 0, false, 20000, 'mini_game_intro') < 12);
assert(count('movie', 12, .25, 0, false, 20000, 'answer_window_open') < count('movie', 12, .25, .65, false, 7000, 'answer_window_open'));
assert.equal(count('movie', 12, .25, .1, false, 850, 'answer_window_open'), 12);
assert.equal(count('movie', 12, .25, 0, true, 20000, 'scoring'), 12);
const ui = fs.readFileSync(path.join(root, 'src/ui-react/components/gameplay/minigames/VisualGuessScreen.tsx'), 'utf8');
assert(ui.includes('visibleQuoteWordCount(') && ui.includes('data.movieQuoteMode'));
assert(ui.includes('movieQuoteCompletionAnswer') && ui.includes('showingResult && data.movieQuoteCompletionAnswer'));
const manifest = require('../src/game-core/minigames/visual-guess/movie-clues.generated.json');
const quoteClues = manifest.clues.filter(x => x.kind === 'quote');
const withCompletion = quoteClues.filter(x => x.completion);
const withSpeaker = quoteClues.filter(x => x.speaker);
assert(quoteClues.length > 0 && withCompletion.length > 0 && withSpeaker.length > 0);
const words = value => String(value).trim().split(/\s+/).filter(Boolean).length;
for (const entry of withCompletion) {
  for (const lang of ['ar','en']) {
    const c = entry.completion;
    assert(words(c.prompt[lang]) >= 4, `${entry.id}: lead-in too short`);
    assert([c.answer, ...c.wrong].every(choice => words(choice[lang]) >= 2), `${entry.id}: one-word ending is not a full choice`);
    assert(!c.prompt[lang].includes(c.answer[lang]), `${entry.id}: prompt leaks answer`);
  }
  assert(entry.completion.wrong.length >= 3);
}
assert(quoteClues.every(x => x.text && x.text.ar && x.text.en), 'Never delete actual quote text');
console.log(`[V62] PASS: speaker/completion prompts fully visible immediately; legacy quote-movie gradual; ${withCompletion.length} phrase-based completions / ${withSpeaker.length} speaker rounds / ${quoteClues.length} preserved quotes; completion answers hidden until manual reveal.`);
