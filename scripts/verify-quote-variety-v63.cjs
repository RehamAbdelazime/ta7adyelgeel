/** V63: meaningful variation in the ACTUAL quote options, not just shuffle positions. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const cp = require('node:child_process');
const ts = require('typescript');
const root = path.join(__dirname, '..');
require.extensions['.ts'] = (mod, filename) => {
  const result = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module:ts.ModuleKind.CommonJS, target:ts.ScriptTarget.ES2022,
      esModuleInterop:true, resolveJsonModule:true }, fileName:filename, reportDiagnostics:true,
  });
  assert(!result.diagnostics?.some(d=>d.category===ts.DiagnosticCategory.Error), `${filename}: TypeScript transpile error`);
  mod._compile(result.outputText,filename);
};
const {chooseQuoteWrongAnswers,readQuoteChoiceHistory,rememberQuoteChoice,choiceHistoryKey,shuffleQuoteAnswerPositions,normalizeChoice} =
  require('../src/game-core/minigames/visual-guess/quote-choice-rotation.ts');
const generated = require('../src/game-core/minigames/visual-guess/movie-clues.generated.json');
const editorial = require('../src/game-core/minigames/visual-guess/quote-choice-pools-v63.json');
const quoteClues = generated.clues.filter(x=>x.kind==='quote');
const difficulties=Object.fromEntries(require('../src/game-core/minigames/visual-guess/visual-guess-questions.json').movies.map(x=>[x.id,x.difficulty]));
const live = quoteClues.flatMap(clue => [
  ...(clue.completion ? [{clue,mode:'complete', answers:clue.completion}]:[]),
  ...(clue.speaker ? [{clue,mode:'speaker', answers:clue.speaker}]:[]),
]);
assert.equal(quoteClues.length,40);
assert(live.length>=50, 'expected real quote game modes');
const completionIds = quoteClues.filter(x=>x.completion).map(x=>x.id);
assert.equal(Object.keys(editorial.completionByClue).length,completionIds.length,'each playable completion needs an anchored editorial pool');
assert(completionIds.every(id=>editorial.completionByClue[id]),'missing editorial completion');
let checks=0;
let totalDistinctGroups=0;
let totalDistinctPositions=0;
function rng(seed){let state=seed>>>0;return ()=>((state=(Math.imul(state,1664525)+1013904223)>>>0)/0x100000000);}
for(const {clue,mode,answers} of live){
  const context={clueId:clue.id, movieId:clue.movieId, mode,
    role:clue.speaker?.role, difficulty:difficulties[clue.movieId], correct:answers.answer,authoredWrong:answers.wrong};
  const saved = new Map();
  const storage={getItem:key=>saved.get(key)??null,setItem:(key,val)=>saved.set(key,val)};
  let memory=readQuoteChoiceHistory(storage);
  const key=choiceHistoryKey(context);
  const observed=new Set(),positions=new Set();
  let lastSignature=null,lastSlot=null;
  for(let trial=0;trial<36;trial++){
    const random=rng(30000+trial*113+clue.id.length*971+(mode==='complete'?500:0));
    const wrong=chooseQuoteWrongAnswers(context,random,memory[key]?.recent);
    assert.equal(wrong.length,3);
    const normalized = [answers.answer,...wrong].map(x=>normalizeChoice(x.ar));
    assert.equal(new Set(normalized).size,4,`Duplicate answer for ${clue.id}`);
    if(mode==='complete') assert(wrong.every(x=>x.ar.trim().split(/\s+/).length>=2),`one-word ending for ${clue.id}`);
    const signature=wrong.map(x=>normalizeChoice(x.ar)).sort().join('~');
    const choices=shuffleQuoteAnswerPositions([answers.answer,...wrong].map((x,i)=>({value:i===0?'quote:correct':`quote:wrong:${i}`,name:x})),random,memory[key]?.lastCorrectSlot);
    const slot=choices.findIndex(x=>x.value==='quote:correct')+1;
    assert(slot>=1&&slot<=4);
    assert.notEqual(slot,lastSlot,'same correct answer position back-to-back');
    // Group rotation is enforced only when candidate pools can actually differ.
    assert.notEqual(signature,lastSignature,`Same 3 wrong options repeated for ${clue.id}`);
    lastSignature=signature;lastSlot=slot;
    observed.add(signature);positions.add(slot);
    rememberQuoteChoice(memory,storage,key,wrong,slot);
    memory=readQuoteChoiceHistory(storage); // real app relaunch
    assert(memory[key].recent.includes(signature));
    checks++;
  }
  assert(observed.size>=5,`${clue.id}/${mode}: only ${observed.size} different answer sets`);
  assert(positions.size>=3,`correct answer not moving for ${clue.id}`);
  totalDistinctGroups+=observed.size;
  totalDistinctPositions+=positions.size;
}
// V63 also accepts author-supplied 4+ distinct decoys for *new* quotes. No new
// copyrighted lines or attributed names are inserted into the user's bank.
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'v63-quote-pool-'));
try {
 const sourceDir=path.join(temp,'src/game-core/minigames/visual-guess');
 const quoteDir=path.join(temp,'public/assets/game/runtime/minigames/visual-guess/Quotes');
 fs.mkdirSync(sourceDir,{recursive:true});fs.mkdirSync(quoteDir,{recursive:true});
 const bank=require('../src/game-core/minigames/visual-guess/visual-guess-questions.json');
 fs.writeFileSync(path.join(sourceDir,'visual-guess-questions.json'),JSON.stringify(bank));
 const data={ar:'الناس هتفهم القفشة من أولها',completion:{prompt:'لما الجو يروق والناس تهدى', answer:'نبقى نرجع نتكلم',
   wrong:['نقعد ونشرب شاي','نوقف الهزار ده','نأجل الكلام لبكرة','نخلص اللي ورانا','نبطل شد وجذب','نروح على بيوتنا']}};
 fs.writeFileSync(path.join(quoteDir,`${bank.movies[0].id}__pool.json`),JSON.stringify(data));
 const run=cp.spawnSync(process.execPath,[path.join(root,'scripts/generate-movie-clues-v53.mjs'),'--root',temp],{encoding:'utf8'});
 assert.equal(run.status,0,run.stderr);
 const output=JSON.parse(fs.readFileSync(path.join(sourceDir,'movie-clues.generated.json'),'utf8'));
 assert.equal(output.clues[0].completion.wrong.length,6,'generator failed to accept expanded authored pools');
}finally{fs.rmSync(temp,{recursive:true,force:true});}
console.log(`[V63] PASS: ${live.length} real quote variants (${completionIds.length} completions), ${checks} replay trials, ${totalDistinctGroups} unique wrong-answer sets across scenarios, ${totalDistinctPositions} correct-slot varieties; local persistence/expanded author pools/score answer IDs safe.`);
