/** V54: no fabricated content enters the production bank; all samples in scratch dir or memory. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const cp = require('node:child_process');
const path = require('node:path');
const os = require('node:os');
const ts = require('typescript');
const root = path.join(__dirname, '..');
const bank = require('../src/game-core/minigames/visual-guess/visual-guess-questions.json');
const realManifest = require('../src/game-core/minigames/visual-guess/movie-clues.generated.json');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'ta7ady-v54-'));
try {
  const bankPath = path.join(temp, 'src/game-core/minigames/visual-guess');
  const quotePath = path.join(temp, 'public/assets/game/runtime/minigames/visual-guess/Quotes');
  fs.mkdirSync(bankPath, { recursive: true });
  fs.mkdirSync(quotePath, { recursive: true });
  fs.writeFileSync(path.join(bankPath, 'visual-guess-questions.json'), JSON.stringify(bank));
  const id = bank.movies[0].id;
  const meta = {
    ar: 'جملة الاختبار الكاملة', en: 'Full test line',
    completion: { prompt: {ar:'دي بداية الجملة اللي هتتكمل',en:'This line begins with these words'},
      answer:{ar:'النهاية الصح',en:'The real ending'},
      wrong:[{ar:'نهاية أخرى',en:'Fake ending one'},{ar:'اختيار تاني',en:'Fake ending two'},{ar:'اختيار ثالث',en:'Fake ending three'}] },
    speaker: { role: 'actor', correct: {ar:'الممثل الصح',en:'Correct actor'},
      wrong:[{ar:'ممثل واحد',en:'Actor one'},{ar:'ممثل اتنين',en:'Actor two'},{ar:'ممثل تلاتة',en:'Actor three'}] },
  };
  fs.writeFileSync(path.join(quotePath, `${id}__01.json`), JSON.stringify(meta));
  fs.writeFileSync(path.join(quotePath, `${id}__02.txt`), 'Legacy film quote');
  fs.writeFileSync(path.join(quotePath, `${id}__invalid.json`), JSON.stringify({ar:'أي جملة',completion:{prompt:'بداية',answer:'نهاية',wrong:['A','A','C']}}));
  const proc = cp.spawnSync(process.execPath, [path.join(root, 'scripts/generate-movie-clues-v53.mjs'),'--root',temp], {encoding:'utf8'});
  assert.equal(proc.status,0,proc.stderr);
  const manifest = JSON.parse(fs.readFileSync(path.join(bankPath,'movie-clues.generated.json'),'utf8'));
  const complete = manifest.clues.find(clue=>clue.id.endsWith('__01'));
  assert.equal(complete.completion.answer.ar,'النهاية الصح');
  assert.equal(complete.speaker.answer.en,'Correct actor');
  assert.equal(complete.speaker.role,'actor');
  assert(manifest.clues.some(clue=>clue.text.ar==='Legacy film quote' && !clue.completion));
  assert(proc.stderr.includes('Invalid completion'));
  assert(!manifest.clues.find(clue=>clue.id.endsWith('__invalid')).completion);
} finally {fs.rmSync(temp,{recursive:true,force:true});}
// Use the exact generator output schema but fake all test text IN MEMORY only.
const original = realManifest.clues;
const testQuote = movie => ({
  id:`quote:${movie.id}__v54`, movieId:movie.id, kind:'quote', asset:'',
  text:{ar:'جملة الاختبار كاملة',en:'A full test quote'},
  completion: {prompt:{ar:'دي بداية الجملة اللي هتتكمل',en:'This is the start of the sentence'},
    answer:{ar:'النهاية الصح',en:'Right ending'},
    wrong:[{ar:'النهاية الأولى',en:'Ending one'},{ar:'النهاية التانية',en:'Ending two'},{ar:'النهاية التالتة',en:'Ending three'}]},
  speaker: {role:'actor', answer:{ar:'الممثل الصح',en:'Right actor'},
    wrong:[{ar:'ممثل أول',en:'Actor one'},{ar:'ممثل تاني',en:'Actor two'},{ar:'ممثل تالت',en:'Actor three'}]},
});
realManifest.clues = bank.movies.flatMap(movie => [testQuote(movie),
  {id:`quote:${movie.id}__old`,movieId:movie.id,kind:'quote',asset:'',text:{ar:'الجملة دي من فيلم إيه؟',en:'Which movie?'}}]);
require.extensions['.ts'] = (mod, filename) => {
  const transpiled = ts.transpileModule(fs.readFileSync(filename,'utf8'),{
    compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true,resolveJsonModule:true},
    fileName:filename,reportDiagnostics:true});
  assert(!transpiled.diagnostics?.some(d=>d.category===ts.DiagnosticCategory.Error));
  mod._compile(transpiled.outputText,filename);
};
const {VisualGuessMiniGameService} = require('../src/game-core/minigames/visual-guess/visual-guess-service.ts');
const seen = new Set(); const count = {poster:0,complete:0,speaker:0,movie:0};
const saved = new Map();
const storage={getItem:key=>saved.get(key)??null,setItem:(key,value)=>saved.set(key,value)};
let tests=0;
for (let tour=0; tour<125; tour++) {
  const game = new VisualGuessMiniGameService('guess-movie',storage);
  game.beginTour(); const picked = new Set();
  for (let round=1;round<=4;round++) {
    game.startRound(round, 48000+tour*8191);
    const ar=game.getSnapshot('ar');const en=game.getSnapshot('en');
    assert(!picked.has(ar.questionId));picked.add(ar.questionId);
    assert.equal(ar.visualGuess.choices.length,4);
    const kind=ar.visualGuess.movieQuoteMode;
    seen.add(kind??'poster'); count[kind??'poster']++;
    assert.equal(ar.visualGuess.correctLabel,null,'never reveal answer in active round');
    assert.equal(ar.visualGuess.movieQuoteCompletionAnswer,null,'never reveal ending before result');
    if (kind === 'complete') {
      assert.equal(ar.statement,'كمّل الجملة');
      assert.equal(ar.visualGuess.movieQuoteText,'دي بداية الجملة اللي هتتكمل');
      assert(!ar.visualGuess.movieQuoteText.includes('النهاية الصح'));
      assert(ar.visualGuess.choices.some(x=>x.label==='النهاية الصح'));
      assert(en.visualGuess.choices.some(x=>x.label==='Right ending'));
    }
    if (kind === 'speaker') {
      assert(ar.statement.includes('الممثل'));
      assert.equal(ar.visualGuess.movieQuoteText,'جملة الاختبار كاملة');
      assert(ar.visualGuess.choices.some(x=>x.label==='الممثل الصح'));
    }
    if (kind === 'movie') assert(ar.visualGuess.choices.every(x=>!x.value.startsWith('quote:')));
    // Score check: correct option and wrong option cannot both score.
    game.setStatus('answering');
    const correctValue = kind==='complete'||kind==='speaker'?'quote:correct':ar.questionId;
    const winner=ar.visualGuess.choices.find(x=>x.value===correctValue);
    const loser=ar.visualGuess.choices.find(x=>x.value!==correctValue);
    assert(winner && loser);
    const makeCitizen=(id)=>({twitchUserId:id,displayName:id,role:'official'});
    assert.equal(game.submitAnswer(makeCitizen('win'),`option-${winner.optionNumber}`).record.isCorrect,true);
    assert.equal(game.submitAnswer(makeCitizen('lose'),`option-${loser.optionNumber}`).record.isCorrect,false);
    game.resolveRound();
    const result=game.getSnapshot('ar');
    assert.equal(result.visualGuess.correctOptionNumber,winner.optionNumber);
    assert.equal(result.visualGuess.correctLabel,ar.visualGuess.choices.find(x=>x.value===correctValue).label);
    if (kind === 'complete') assert.equal(result.visualGuess.movieQuoteCompletionAnswer,'النهاية الصح');
    assert.equal(game.createScoreAwards().filter(award=>award.isCorrect).length,1);
    tests++;
  }
}
for(const variant of ['poster','complete','speaker','movie']) assert(seen.has(variant),`Variant ${variant} not played`);
assert(count.complete>15 && count.speaker>15, `New modes barely played: ${JSON.stringify(count)}`);
const source=fs.readFileSync(path.join(root,'src/ui-react/components/gameplay/minigames/VisualGuessScreen.tsx'),'utf8');
assert(source.includes('movieQuoteCompletionAnswer') && source.includes('v54-quote-missing'));
realManifest.clues=original;
assert.equal(realManifest.clues, original, 'Production manifest must remain unchanged by the test');
console.log(`V54 PASS: ${tests} rounds, quote submodes randomized independently, safe correct-answer scoring, bilingual options, legacy formats, no fabricated production content; ${JSON.stringify(count)}.`);
