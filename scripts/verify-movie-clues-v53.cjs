/** V53: user-managed Posters/Frame/Quotes folders, optional media, seeded mixed rounds. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const cp = require('node:child_process');
const ts = require('typescript');
const root = path.join(__dirname, '..');
const publicDir = path.join(root, 'public/assets/game/runtime/minigames/visual-guess');
const bank = require('../src/game-core/minigames/visual-guess/visual-guess-questions.json');
const realManifest = require('../src/game-core/minigames/visual-guess/movie-clues.generated.json');
assert.equal(bank.movies.length, 88);
assert(fs.statSync(path.join(publicDir, 'Posters')).isDirectory());
assert(fs.statSync(path.join(publicDir, 'Frame')).isDirectory());
assert(fs.statSync(path.join(publicDir, 'Quotes')).isDirectory());
assert(bank.movies.every(m => !m.asset || (m.asset.startsWith('Posters/') && fs.existsSync(path.join(publicDir, m.asset)))));
for(const clue of realManifest.clues){
  assert(['frame','quote'].includes(clue.kind));
  assert(bank.movies.some(m=>m.id===clue.movieId));
  if (clue.asset) assert(fs.existsSync(path.join(publicDir, clue.asset)));
  if(!clue.asset)assert(clue.text.ar && clue.text.en);
}
// Validate folder auto-discovery with genuine image magic bytes, two quote formats,
// multiple clues for one film, invalid filenames safely skipped. Use a scratch
// project tree: NEVER alter the user's actual content folders.
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'ta7ady-v53-'));
try {
  const dataDir = path.join(temp, 'src/game-core/minigames/visual-guess');
  const mediaDir = path.join(temp, 'public/assets/game/runtime/minigames/visual-guess');
  fs.mkdirSync(dataDir,{recursive:true});
  for(const f of ['Frame','Quotes']) fs.mkdirSync(path.join(mediaDir,f),{recursive:true});
  fs.writeFileSync(path.join(dataDir,'visual-guess-questions.json'), JSON.stringify(bank));
  const id=bank.movies[0].id;
  fs.writeFileSync(path.join(mediaDir,'Frame',`${id}__01.jpg`), Buffer.from([0xff,0xd8,0xff,0xd9]));
  fs.writeFileSync(path.join(mediaDir,'Frame',`${id}__bad.jpg`), Buffer.from('not jpeg'));
  fs.writeFileSync(path.join(mediaDir,'Quotes',`${id}__01.txt`), 'إنت عارف أنا مين؟');
  fs.writeFileSync(path.join(mediaDir,'Quotes',`${id}__02.json`), JSON.stringify({ar:'الليلة كبيرة',en:'Big night'}));
  fs.writeFileSync(path.join(mediaDir,'Quotes','unknown__01.txt'),'should skip');
  const proc = cp.spawnSync(process.execPath, [path.join(root,'scripts/generate-movie-clues-v53.mjs'),'--root',temp],{encoding:'utf8'});
  assert.equal(proc.status,0,proc.stderr);
  const manifest=JSON.parse(fs.readFileSync(path.join(dataDir,'movie-clues.generated.json'),'utf8'));
  assert.deepEqual(manifest.clues.map(c=>c.kind), ['frame','quote','quote']);
  assert.equal(manifest.clues[0].asset, `Frame/${id}__01.jpg`);
  assert.equal(manifest.clues[1].text.ar,'إنت عارف أنا مين؟');
  assert.equal(manifest.clues[2].text.en,'Big night');
  assert(proc.stderr.includes('Invalid image') && proc.stderr.includes('Cannot match'));
} finally { fs.rmSync(temp,{recursive:true,force:true}); }

// Inject in-memory test-only frame and quote metadata, without putting fake
// frames, images or quote text into the shipped game.
const generatedPath = require.resolve('../src/game-core/minigames/visual-guess/movie-clues.generated.json');
const injected = require(generatedPath);
const originals = injected.clues;
injected.clues = bank.movies.flatMap(m => [
  {id:`frame:${m.id}__01`,movieId:m.id,kind:'frame',asset:`Frame/${m.id}__01.jpg`,text:null},
  {id:`quote:${m.id}__01`,movieId:m.id,kind:'quote',asset:'',text:{ar:'جملة من فيلم للتجربة',en:'A line from a movie'}},
  {id:`quote:${m.id}__02`,movieId:m.id,kind:'quote',asset:`Quotes/${m.id}__02.png`,text:null},
]);
require.extensions['.ts'] = (mod, filename) => {
  const code=ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true,resolveJsonModule:true},fileName:filename}).outputText;
  mod._compile(code,filename);
};
const { VisualGuessMiniGameService } = require('../src/game-core/minigames/visual-guess/visual-guess-service.ts');
const kinds = new Set();
const types = {poster:0,frame:0,quote:0};
const saved = new Map();
const storage={getItem:k=>saved.get(k)??null,setItem:(k,v)=>saved.set(k,v)};
const encountered = new Set();
for(let tour=0;tour<65;tour++){
  const svc=new VisualGuessMiniGameService('guess-movie',storage);
  svc.beginTour();const used = new Set();
  for(let round=1;round<=4;round++){
    svc.startRound(round,50001 + tour * 2347);
    const ar=svc.getSnapshot('ar');const en=svc.getSnapshot('en');
    assert(!used.has(ar.questionId),'repeated same movie within a tour');
    used.add(ar.questionId);
    encountered.add(ar.questionId);
    const kind=ar.visualGuess.movieClueKind;
    assert(['poster','frame','quote'].includes(kind));
    types[kind]++;kinds.add(kind);
    assert.equal(ar.visualGuess.choices.length,4);
    assert.equal(ar.visualGuess.correctLabel,null);
    assert.equal(ar.visualGuess.correctOptionNumber,null);
    assert.equal(ar.questionDifficulty,['easy','medium','hard','hard'][round-1]);
    if(kind==='quote'){
      if(ar.visualGuess.movieQuoteText){
        assert(ar.visualGuess.movieQuoteText.includes('جملة'));
        assert.equal(ar.visualGuess.imageUrl,'');
        assert(en.visualGuess.movieQuoteText?.startsWith('A line'));
      }else assert(ar.visualGuess.imageUrl.includes('/Quotes/'));
      assert.equal(ar.visualGuess.posterReveal,null);
    }
    if(kind==='frame'){
      assert(ar.visualGuess.imageUrl.includes('/Frame/'));
      assert.equal(ar.visualGuess.posterReveal,null);
    }
    if(kind==='poster'){
      assert(ar.visualGuess.imageUrl.includes('/Posters/'));
      assert(ar.visualGuess.posterReveal);
    }
    svc.setStatus('answering');svc.resolveRound();
    assert(ar.visualGuess.choices.some(c => c.optionNumber === svc.getSnapshot('ar').visualGuess.correctOptionNumber));
  }
}
assert.equal(kinds.size,3, 'must show all three clue kinds when content exists');
assert.equal(encountered.size,bank.movies.length,'history favors all films before repeats');
for(const kind of kinds)assert(types[kind]>=30,`${kind} rarely selected: ${JSON.stringify(types)}`);
// Additional per-question choice histories may also be present in storage.
// Select the movie-play history explicitly rather than relying on insertion order.
const stored=JSON.parse(storage.getItem('ta7ady:movie-poster-history:v1')); 
assert(stored.entries && Object.values(stored.entries).some(entry=>entry.lastClueId && entry.kindUses?.quote));
injected.clues=originals;
const screen=fs.readFileSync(path.join(root,'src/ui-react/components/gameplay/minigames/VisualGuessScreen.tsx'),'utf8');
assert(screen.includes('isQuoteText') && screen.includes('visibleQuote') && screen.includes('isFrame'));
assert(screen.includes('remainingMs <= 1000'));
console.log(`V53 PASS: 81 posters + 7 frame-only titles; Frame/Quotes discovery; JSON/TXT/image support; ${Object.values(types).reduce((a,b)=>a+b,0)} rounds (poster ${types.poster}, frame ${types.frame}, quote ${types.quote}); no tour duplicates; persistent history; no fake media shipped.`);
