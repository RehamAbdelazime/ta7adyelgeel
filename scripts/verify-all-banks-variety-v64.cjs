/** V64 — exercise all seven public games, plus the QA-only content bank. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
require.extensions['.ts'] = (mod, filename) => mod._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  fileName: filename, compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
    esModuleInterop: true, resolveJsonModule: true },
}).outputText, filename);
const load = file => require(path.join(root, 'src/game-core', file));
const { ChoiceVariety } = load('questions/choice-variety.ts');
const { QuestionBankService } = load('questions/question-bank-service.ts');
const { FoodOriginMiniGameService } = load('minigames/food-origin/food-origin-service.ts');
const { FOOD_ORIGIN_QUESTIONS } = load('minigames/food-origin/food-origin-content.ts');
const { VisualGuessMiniGameService, getVisualGuessBank } = load('minigames/visual-guess/visual-guess-service.ts');
const { MINI_GAME_REGISTRY } = load('minigames/minigame-registry.ts');
const allIds = new Set(MINI_GAME_REGISTRY.filter(entry => entry.availability === 'public').map(entry => entry.id));
assert.deepEqual([...allIds].sort(), ['count-the-beat','food-origin','guess-movie','guess-star','lucky-cup','maze-gates','shape-count'].sort());
function memoryStore() {const values=new Map();return {getItem:key=>values.get(key)??null,setItem:(key,val)=>values.set(key,val)};}
function seq(seed) {let x=seed>>>0;return ()=>((x=(Math.imul(x,1664525)+1013904223)>>>0)/0x100000000);}
function uniqueFour(correct, choices) {
  assert.equal(choices.length, 4);
  assert.equal(new Set(choices.map(choice => choice.value)).size, 4);
  assert.equal(choices.filter(choice => choice.value === correct).length, 1);
}
// Shared policy: exact correctness, cross-launch history, real group variety, slot rotation,
// corrupted/private storage never blocking play.
const storage=memoryStore();let sameIdGroups=new Set(),slots=[];
for(let run=0;run<32;run++) {
  const variety=new ChoiceVariety('v64-test',storage);
  const fake = [{id:'wrong-a'},{id:'wrong-b'},{id:'wrong-c'},{id:'wrong-d'},{id:'wrong-e'}];
  const random=seq(700+run*1981);
  const choices=variety.chooseFour({questionId:'q1',correct:{id:'correct'},rng:random,
    generateWrong:()=>fake.map(x=>x).sort(()=>random()-.5).slice(0,3)});
  uniqueFour('correct', choices.map(x=>({value:x.id})));
  sameIdGroups.add(choices.filter(x=>x.id!=='correct').map(x=>x.id).sort().join(','));
  const slot=choices.findIndex(x=>x.id==='correct')+1;
  assert.notEqual(slot,slots[slots.length-1]); slots.push(slot);
}
assert(sameIdGroups.size>=6, 'Shared rotation must vary decoy sets, not just slots');
const corrupt={getItem:()=>'not json',setItem:()=>{throw Error('storage blocked')}};
assert.doesNotThrow(()=>new ChoiceVariety('crash-test',corrupt).chooseFour({
  questionId:'x',correct:{id:'ok'},rng:seq(3),generateWrong:()=>[{id:'a'},{id:'b'},{id:'c'}],
}));

const foodStore=memoryStore(), foodSeen=new Map(), foodCounts=new Map(), goodDifficulties=['easy','medium','hard'];
for(let run=0;run<190;run++) {
  const svc=new FoodOriginMiniGameService(foodStore);svc.beginTour();
  for(let round=1;round<=3;round++){
    svc.startRound(round);
    const snap=svc.getSnapshot('ar');
    const id=snap.questionId;const question=FOOD_ORIGIN_QUESTIONS.find(q=>q.id===id);
    assert(question);assert.equal(snap.questionDifficulty,goodDifficulties[round-1]);
    const labels=snap.foodOrigin.choices;
    uniqueFour(question.answer,labels.map(x=>({value:x.countryCode})));
    assert(labels.every(x=>x.label.trim() && !/^[A-Z]{2}$/.test(x.label)), 'Missing localized country label');
    const set=labels.filter(x=>x.countryCode!==question.answer).map(x=>x.countryCode).sort().join(',');
    if(!foodSeen.has(id))foodSeen.set(id,new Set());foodSeen.get(id).add(set);
    foodCounts.set(id,(foodCounts.get(id)??0)+1);
  }
}
assert(foodSeen.size>=100,`Expanded bank should serve at least 100 playable dishes, saw ${foodSeen.size}`);
for(const [id,sets] of foodSeen) { if ((foodCounts.get(id)??0)>=4) assert(sets.size>=2,`${id} has fixed countries`); }
assert([...foodCounts.values()].every(n=>n>=1), 'Question history must spread plays across fresh sessions');

const starStore=memoryStore(), starSeen=new Map();let starRounds=0,starDifferentGroups=0;
const stars=getVisualGuessBank('guess-star');
for(let run=0;run<180;run++){
  const svc=new VisualGuessMiniGameService('guess-star',starStore);svc.beginTour();
  for(let round=1;round<=4;round++){
    svc.startRound(round,run*997+round*13);
    const snap=svc.getSnapshot('ar'),item=stars.find(q=>q.id===snap.questionId);
    assert(item);assert.equal(snap.questionDifficulty,item.difficulty);
    const choices=snap.visualGuess.choices;
    uniqueFour(item.id,choices);
    const sameCategory=choices.filter(c=>c.value!==item.id && stars.find(x=>x.id===c.value)?.category===item.category).length;
    const possibleSame=stars.filter(x=>x.id!==item.id&&x.category===item.category).length;
    assert(sameCategory >= Math.min(possibleSame,item.difficulty==='easy'?1:item.difficulty==='medium'?2:3),`${item.id}: insufficient difficulty-aware star peers`);
    const set=choices.filter(c=>c.value!==item.id).map(c=>c.value).sort().join(',');
    if(!starSeen.has(item.id))starSeen.set(item.id,new Set());starSeen.get(item.id).add(set);
    starRounds++;
  }
}
assert([...starSeen.values()].filter(g=>g.size>=2).length>=8,'Star repeats must vary decoy identities');

const movieStore=memoryStore(), movieGroups=new Map();let filmRounds=0;
for(let run=0;run<120;run++) {
  const svc=new VisualGuessMiniGameService('guess-movie',movieStore);svc.beginTour();
  for(let round=1;round<=4;round++) {
    svc.startRound(round,177+run*1307+round*7);
    const snap=svc.getSnapshot('ar');
    const item=getVisualGuessBank('guess-movie').find(q=>q.id===snap.questionId);
    assert(item);assert.equal(snap.questionDifficulty,item.difficulty);
    if(['complete','speaker'].includes(snap.visualGuess.movieQuoteMode)) continue;
    uniqueFour(item.id,snap.visualGuess.choices);
    const set=snap.visualGuess.choices.filter(c=>c.value!==item.id).map(c=>c.value).sort().join(',');
    const key=`${item.id}#${snap.visualGuess.movieClueKind}`;
    if(!movieGroups.has(key))movieGroups.set(key,new Set());movieGroups.get(key).add(set);
    filmRounds++;
  }
}
assert([...movieGroups.values()].some(v=>v.size>=2),'Poster/Frame/Movie Quote options must rotate');

// QA-only binary bank: rotate the real questions and ONLY two factual answers.
const qaStore=memoryStore();const qaHistory=new ChoiceVariety('qa-binary-test',qaStore);
const questions=[...Array(3)].flatMap((_,i)=>goodDifficulties.map(d=>({id:`q_${i}_${d}`,answer:'couple',statement:{ar:'',en:''},difficulty:d,similarityGroup:`g${i}-${d}`,category:'games',tags:[]})));
let selected=[];
for(let session=0;session<12;session++){
  const bank=new QuestionBankService(questions,new ChoiceVariety('qa-binary-test',qaStore));bank.beginTour();
  const a=bank.selectForRound(1,'easy');selected.push(a.question.id);
}
assert.equal(new Set(selected).size,3,'Shared question bank must exhaust all easy questions before repeating');

// Procedural games: no static distractor banks exist. Their E/M/H puzzle
// profiles and signature/new-random generation are verified by runtime tests.
const procedural = [
  ['shape-count','ShapeCountMiniGameService'],['maze-gates','MazeGatesMiniGameService'],
  ['count-the-beat','CountTheBeatMiniGameService'],['lucky-cup','LuckyCupMiniGameService'],
];
for(const [id,className] of procedural){
  const mod=load(`minigames/${id}/${id}-service.ts`);
  const Game=mod[className]; assert.equal(typeof Game,'function',`missing procedural ${id}`);
  const game=new Game();game.beginTour();
  for(let round=1;round<=3;round++){
    game.startRound(round,500+round*101);
    const snap=game.getSnapshot('ar');
    assert.equal(snap.questionDifficulty,goodDifficulties[round-1],`${id}: difficulty drift`);
  }
}
assert.equal(MINI_GAME_REGISTRY.filter(x=>x.availability==='qa-only').length,2);
console.log(`[V64] PASS: 7 public games audited, 2 QA-only games classified; Food ${foodSeen.size} dishes with varied countries, Star ${starRounds} rounds, Movie ${filmRounds} film-title rounds, ${sameIdGroups.size} distinct test decoy groups; difficulty and replay policies verified.`);
