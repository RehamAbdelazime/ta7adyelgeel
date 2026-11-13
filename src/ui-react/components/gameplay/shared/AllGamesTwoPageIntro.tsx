import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import type { MiniGameId } from '../../../../game-core/minigames/minigame-registry';
import type { ShapeCountShapeId } from '../../../../game-core/minigames/minigame-types';
import { MediaCard, ChoiceCard, ShapeMark } from './question-shell';
import { BeatIcon } from '../minigames/BeatIcon';
import { PosterPuzzleOverlay } from '../minigames/PosterPuzzleOverlay';
import movieCatalog from '../../../../game-core/minigames/visual-guess/visual-guess-questions.json';
import { generateLaserPuzzle } from '../../../../game-core/minigames/laser-challenge/laser-puzzle';
import { LaserBoard } from '../minigames/LaserBoard';

/** V72: two concise illustrated pages for the other eight games.
 * Everything here is local, deterministic sample data. The photo/eye assets,
 * answer cards, media frame, shape marks and beat icons are the live UI's assets
 * and components. Never imply the sample is the current live question. */
const ROOT = './assets/game/runtime/minigames/';
const STAGE = `${ROOT}HowTo/stage-quote.webp`;
const samplePoster = movieCatalog.movies.find(movie => movie.asset === 'Posters/movie-elzoga-13.jpg');
const samplePosterMasks = samplePoster?.titleMasks ?? [];
const MEDIA = {
  poster: `${ROOT}visual-guess/Posters/movie-elzoga-13.jpg`,
  eyes: `${ROOT}visual-guess/Stars/Eyes/uploaded-01.jpg`,
  face: `${ROOT}visual-guess/Stars/Full/uploaded-01.jpg`,
  cup: `${ROOT}lucky-cup/cup.png`,
  ball: `${ROOT}lucky-cup/ball.png`,
  pair: `${ROOT}couple-or-siblings/pair-002.svg`,
};
type Lang = 'ar' | 'en';
type Copy = { ar: string; en: string };
type PageGuide = { heading: Copy; lines: [Copy, Copy]; note?: Copy };
type Lesson = { question: Copy; pages: [PageGuide, PageGuide]; choices: { ar: string[]; en: string[] }; command: string; correctIndex?: number; };

const GAMES: Record<Exclude<MiniGameId,'food-origin'>, Lesson> = {
  'shape-count': {
    question: { ar: 'أي شكل موجود بعدد أكبر؟', en: 'Which shape appears most?' },
    pages: [
      { heading:{ar:'ركّز في الأشكال',en:'Spot the shapes'}, lines:[
        { ar:'هتظهر شبكة فيها أشكال مختلفة. ركّز في كل شكل وعدّه.', en:'A grid appears with different shapes. Count carefully.' },
        { ar:'السؤال ممكن يطلب الشكل الأكثر تكرارًا، أو الموجود عدد مرات محدد.', en:'Find either the most frequent shape or one with a given count.' },
      ] },
      { heading:{ar:'اختار وجاوب',en:'Choose & answer'}, lines:[
        { ar:'الاختيارات تحت الشبكة، وكل شكل ليه رقم.', en:'Each shape has a numbered answer card below.' },
        { ar:'ابعت ! ورقم اختيارك في الشات قبل الوقت ما يخلص. الإجابة الصح بتبان بعد كشف الصبوح.', en:'Send ! and your choice number in chat before time runs out; host reveal shows the correct shape.' },
      ] },
    ], choices:{ar:['دائرة','معيّن','مثلث','مربع'],en:['Circle','Diamond','Triangle','Square']}, command:'!1', correctIndex:0,
  },
  'maze-gates': {
    question:{ ar:'أنهي بوابة توصل للمخرج؟', en:'Which gate reaches the exit?' },
    pages:[
      { heading:{ar:'اتبع الطريق',en:'Trace the paths'}, lines:[
        { ar:'قدامك متاهة فيها بوابات مرقمة. امشي بعينك من كل بوابة للمخرج.', en:'The maze has numbered gates. Trace each route to the exit.' },
        { ar:'خلي بالك من الحيطان والطرق المسدودة.', en:'Watch for walls and dead ends.' },
      ] },
      { heading:{ar:'ابعت رقم البوابة',en:'Send the gate number'}, lines:[
        { ar:'البوابات نفسها عليها الأرقام؛ مفيش اختيارات منفصلة تحت المتاهة.', en:'Numbers are printed on the gates; there are no separate choice cards.' },
        { ar:'اكتب ! وبعدها رقم البوابة في الشات قبل الوقت. بعد الكشف الطريق الصح بينور.', en:'Type ! followed by the gate number before time runs out. The correct route lights up on reveal.' },
      ] },
    ], choices:{ar:[],en:[]},command:'!2',correctIndex:1,
  },
  'count-the-beat': {
    question:{ar:'عدّ الرمز ده',en:'Count this symbol'},
    pages:[
      { heading:{ar:'ركز على الرمز المطلوب',en:'Watch the target'},lines:[
        { ar:'هيظهر رمز مطلوب فوق، ومع الإيقاع هتظهر رموز مختلفة.',en:'A target symbol appears above the rhythm stage.' },
        { ar:'عدّ مرات ظهور الرمز المطلوب بس، مش كل اللي بيظهر.',en:'Count only the target symbol—not every icon you see.' },
      ] },
      { heading:{ar:'جاوب بالعدد',en:'Answer with a count'},lines:[
        { ar:'مفيش أربع اختيارات هنا. ابعت ! وبعدها العدد اللي حسبته.',en:'No four choices here. Send ! followed by the number you counted.' },
        { ar:'لازم تجاوب قبل الوقت ما يخلص. بعد الكشف هيظهر العدد الصح.',en:'Answer before time runs out. The correct total is shown after reveal.' },
      ],note:{ar:'لو عددك قريب بفارق واحد، ممكن تاخد ربع النقاط.',en:'One off from the answer may earn quarter points.'} },
    ],choices:{ar:[],en:[]},command:'!4',
  },
  'lucky-cup': {
    question:{ar:'الكورة تحت أنهي كوباية؟',en:'Which cup hides the ball?'},
    pages:[
      {heading:{ar:'تابع الكورة',en:'Follow the ball'},lines:[
        {ar:'في الأول هتشوف الكورة تحت واحدة من 3 كوبايات.',en:'First you see the ball under one of three cups.'},
        {ar:'الكوبايات هتبدّل أماكنها. ركّز في الكوباية اللي فيها الكورة.',en:'The cups shuffle. Keep your eye on the ball’s cup.'},
      ]},
      {heading:{ar:'اختار مكانها',en:'Pick its position'},lines:[
        {ar:'بعد ما الكوبايات تقف: 1 شمال، 2 وسط، 3 يمين.',en:'After the shuffle: 1 left, 2 middle, 3 right.'},
        {ar:'اكتب ! ورقم المكان في الشات. الصبوح يكشف الكوباية الصح بعد الإجابات.',en:'Send ! and the final position in chat. Host reveal lifts the winning cup.'},
      ]},
    ],choices:{ar:['شمال','وسط','يمين'],en:['Left','Center','Right']},command:'!2',correctIndex:1,
  },
  'laser-challenge': {
    question: { ar:'الليزر هيوصل لأنهي هدف؟', en:'Which target will the laser hit?' },
    pages: [
      { heading:{ar:'اتبع الانعكاسات',en:'Trace the reflections'}, lines:[
        {ar:'المدفع على الشمال، وأربع أهداف مرقمة على اليمين.',en:'The emitter is on the left; four numbered targets are on the right.'},
        {ar:'تخيل الشعاع ماشي، وكل مراية مائلة بتغير اتجاهه.',en:'Follow the ray mentally: each tilted mirror changes its direction.'},
      ]},
      { heading:{ar:'اختار الهدف',en:'Pick the target'}, lines:[
        {ar:'قبل الوقت ما يخلص، ابعت ! ورقم الهدف اللي الليزر هيوصله.',en:'Before time runs out, send ! and the target number in chat.'},
        {ar:'لما الصبوح يكشف، الليزر هينطلق ويوضح المسار الصح.',en:'On host reveal, the beam fires and shows the actual path.'},
      ]},
    ], choices:{ar:[],en:[]},command:'!1',
  },
  'guess-movie': {
    question:{ar:'الفيلم ده إيه؟',en:'Which movie is it?'},
    pages:[
      {heading:{ar:'خمن الفيلم',en:'Guess the movie'},lines:[
        {ar:'ممكن يطلع بوستر بيتكشف، أو مشهد واضح، أو قفشة من فيلم.',en:'You might get a changing poster, a clear scene, or a film quote.'},
        {ar:'نوع القفشة ممكن يكون «مين قالها؟» أو «كمّل الجملة».',en:'Quote rounds may ask who said it or to complete the line.'},
      ]},
      {heading:{ar:'اختار الإجابة',en:'Pick the answer'},lines:[
        {ar:'اربع اختيارات تحت السؤال. ابعت ! ورقم اختيارك في الشات.',en:'Four numbered answers appear below. Send ! and your answer number in chat.'},
        {ar:'المربعات بتتشال واحدة واحدة، لكن اسم الفيلم يفضل مخفي. الصبوح يكشف الإجابة بعد الجولة.',en:'Tiles disappear, but the printed movie title stays hidden. The host reveals the answer.'},
      ]},
    ],choices:{ar:['الزوجة 13','الزوجة الثانية','أرض النفاق','العتبة الخضراء'],en:['The 13th Wife','The Second Wife','Land of Hypocrisy','The Green Threshold']},command:'!1',correctIndex:0,
  },
  'guess-star': {
    question:{ar:'مين المشهور من عينيه؟',en:'Who is behind these eyes?'},
    pages:[
      {heading:{ar:'العيون بس',en:'Eyes only'},lines:[
        {ar:'هتشوف عيون المشهور بس طول وقت السؤال.',en:'Only the celebrity’s eyes are visible throughout the question.'},
        {ar:'مفيش Blur أو كشف تدريجي. ركّز في تفاصيل العينين.',en:'No blur or gradual reveal. Focus on the eyes.'},
      ]},
      {heading:{ar:'جاوب وشوف الوجه',en:'Answer & reveal'},lines:[
        {ar:'اختار اسم المشهور من الأربع إجابات وابعت رقمه في الشات.',en:'Choose the celebrity from the four answers; send its number in chat.'},
        {ar:'بعد كشف الصبوح فقط، هتظهر نفس الصورة كاملة مرة واحدة.',en:'Only after host reveal does the full matching portrait appear at once.'},
      ]},
    ],choices:{ar:['هند صبري','منة شلبي','دينا الشربيني','أمينة خليل'],en:['Hend Sabry','Menna Shalaby','Dina El Sherbiny','Amina Khalil']},command:'!3',correctIndex:2,
  },
  'memory-count': {
    question:{ar:'افتكر اللي شوفته',en:'Remember what you saw'},
    pages:[
      {heading:{ar:'احفظ الصورة',en:'Memorize the items'},lines:[
        {ar:'رموز هتظهر وقت قصير وبعدها تختفي.',en:'Icons appear briefly and then disappear.'},
        {ar:'ركز في النوع والعدد قبل ما الصورة تختفي.',en:'Remember the type and number of each icon.'},
      ]},
      {heading:{ar:'جاوب من الذاكرة',en:'Answer from memory'},lines:[
        {ar:'بعد اختفاء العناصر، هتسأل عن عدد رمز معيّن.',en:'After they disappear, the game asks for the count of a target icon.'},
        {ar:'اختار العدد من الإجابات تحت، وابعت ! ورقمه في الشات.',en:'Choose the count from the numbered options below; send ! and the option number in chat.'},
      ],note:{ar:'الإجابة بفارق واحد ممكن تاخد ربع النقاط.',en:'One-count misses may earn quarter credit.'}},
    ],choices:{ar:['1','2','3','4'],en:['1','2','3','4']},command:'!3',correctIndex:2,
  },
  'couple-or-siblings': {
    question:{ar:'مرتبطين ولا إخوات؟',en:'Couple or siblings?'},
    pages:[
      {heading:{ar:'بص على الاتنين',en:'Look at the pair'},lines:[
        {ar:'هتشوف صورة شخصين، والمطلوب تعرف علاقتهم.',en:'You see two people and need to guess their relationship.'},
        {ar:'اختار إذا كانوا مرتبطين أو إخوات.',en:'Decide if they are a couple or siblings.'},
      ]},
      {heading:{ar:'اختار 1 أو 2',en:'Choose 1 or 2'},lines:[
        {ar:'إجابتين بس تحت الصورة، كل واحدة برقم.',en:'There are just two numbered options below the photo.'},
        {ar:'ابعت ! ورقم اختيارك قبل الوقت. الصبوح يكشف الحقيقة بعد الجولة.',en:'Send ! and the option number before time runs out. The host reveals the answer.'},
      ]},
    ],choices:{ar:['مرتبطين','إخوات'],en:['Couple','Siblings']},command:'!2',correctIndex:1,
  },
};

const GAME_NAMES: Record<Exclude<MiniGameId,'food-origin'>, Copy> = {
  'shape-count': {ar:'عدّ الأشكال', en:'SHAPE COUNT'},
  'maze-gates': {ar:'المتاهة', en:'MAZE GATES'},
  'count-the-beat': {ar:'عدّ الإيقاع', en:'COUNT THE BEAT'},
  'lucky-cup': {ar:'الكوباية المحظوظة', en:'LUCKY CUP'},
  'laser-challenge': {ar:'تحدي الليزر', en:'LASER CHALLENGE'},
  'guess-movie': {ar:'اعرف الفيلم', en:'GUESS THE MOVIE'},
  'guess-star': {ar:'اعرف المشهور', en:'GUESS THE STAR'},
  'memory-count': {ar:'اختبار الذاكرة', en:'MEMORY COUNT'},
  'couple-or-siblings': {ar:'مرتبطين ولا إخوات؟', en:'COUPLE OR SIBLINGS'},
};

const SHAPES: ShapeCountShapeId[] = [
  'circle','diamond','circle','triangle',
  'square','circle','diamond','circle',
  'triangle','circle','square','diamond',
];
const ANSWER_SHAPES: ShapeCountShapeId[] = ['circle','diamond','triangle','square'];

function GameClue({ gameId, page, locale }: { gameId: Exclude<MiniGameId,'food-origin'>; page: number; locale: Lang }): ReactNode {
  const second = page === 1;
  switch (gameId) {
    case 'guess-star':
      return <div className={`howto-v72-clue howto-v72-portrait ${second ? 'is-full' : 'is-eyes'}`}>
        <MediaCard imageUrl={second ? MEDIA.face : MEDIA.eyes} altText={locale === 'ar' ? 'صورة توضيحية من صور المشاهير المحلية' : 'Local celebrity photo example'} objectFit="contain" />
        {second ? <span className="howto-v72-reveal-badge">✓ {locale === 'ar' ? 'بعد كشف الصبوح' : 'HOST REVEAL'}</span> : null}
      </div>;
    case 'guess-movie':
      return <div className={`howto-v72-clue howto-v72-poster ${second ? 'is-clear' : ''}`}>
        <MediaCard imageUrl={MEDIA.poster} altText={locale === 'ar' ? 'بوستر فيلم محلي، اسم الفيلم مخفي بالمربعات' : 'Local poster, printed title kept hidden'} objectFit="contain" />
        <PosterPuzzleOverlay plan={null} titleMasks={samplePosterMasks} progress={second ? 1 : .32} difficulty="medium" />
        <span className="howto-v72-media-type">{locale === 'ar' ? 'مثال: بوستر' : 'EXAMPLE: POSTER'}</span>
      </div>;
    case 'couple-or-siblings':
      return <div className="howto-v72-clue howto-v72-pair"><MediaCard imageUrl={MEDIA.pair} altText="" objectFit="contain" /></div>;
    case 'shape-count':
      return <div className="howto-v72-clue gameplay-shape-stage"><div className="gameplay-shape-grid howto-v72-shapes" style={{gridTemplateColumns:'repeat(4,minmax(0,1fr))'}}>
        {SHAPES.map((shape, index) => <span className={`v38-shape-tile ${second && shape === 'circle' ? 'v38-shape-hit' : ''}`} key={index}><ShapeMark shape={shape}/></span>)}
      </div></div>;
    case 'maze-gates':
      return <div className="howto-v72-clue howto-v72-maze gameplay-maze-stage">
        <svg className="gameplay-maze-svg" viewBox="0 0 720 390" role="img" aria-label={locale === 'ar' ? 'متاهة توضيحية بأربع بوابات' : 'Example maze with four numbered gates'}>
          <rect x="34" y="28" width="652" height="332" rx="26" className="gameplay-maze-board" />
          <g className="gameplay-maze-grid">{Array.from({length:9},(_,i)=><path key={i} d={`M${106+i*64} 58 V330`}/>)}</g>
          <g className="gameplay-maze-exit-svg"><rect x="320" y="20" width="80" height="30" rx="15"/><text x="360" y="40" textAnchor="middle">EXIT</text></g>
          {[
            {number:1, y:92, points:'75,92 125,92 125,137 155,137'},
            {number:2, y:169, points:'75,169 170,169 170,55 360,55 360,35'},
            {number:3, y:247, points:'75,247 165,247 165,312'},
            {number:4, y:325, points:'75,325 285,325 285,253'},
          ].map(path=><g key={path.number}>
            <polyline points={path.points} className={`gameplay-maze-path ${second && path.number === 2 ? 'gameplay-maze-path-correct' : ''}`}/>
            <g className={`gameplay-maze-entrance ${second && path.number===2 ? 'gameplay-maze-entrance-correct' : ''}`} transform={`translate(75 ${path.y})`}><circle r="20"/><text textAnchor="middle" y="6">{path.number}</text></g>
          </g>)}
        </svg>
      </div>;
    case 'count-the-beat':
      return <div className="howto-v72-clue howto-v72-beat ctb-shell">
        <div className="ctb-target-bar"><span className="ctb-target-glyph"><BeatIcon icon="note" /></span><span className="ctb-target-name">{locale === 'ar' ? 'عدّ النغمة' : 'Count the note'}</span></div>
        <div className="ctb-stage">
          {second ? <div className="ctb-reveal-overlay"><span className="ctb-reveal-glyph"><BeatIcon icon="note" /></span><strong className="ctb-reveal-count">4</strong></div>
            : <div className="howto-v72-beat-items">{['note','disc','note','wave','note','note','disc'].map((v,i)=><span key={i} style={{color:i%2?'#f5a7ec':'#83f5e6'}}><BeatIcon icon={v}/></span>)}</div>}
        </div>
      </div>;
    case 'laser-challenge': {
      const example = generateLaserPuzzle('medium', 70261);
      return <div className="howto-v72-clue howto-v75-laser">
        <LaserBoard compact locale={locale} plan={{
          source: example.source, mirrors: example.mirrors, targetYs: example.targetYs,
          correctTarget: second ? example.correctTarget : null,
          revealedPath: second ? example.solution : null,
        }}/>
      </div>;
    }
    case 'lucky-cup':
      return <div className="howto-v72-clue howto-v72-cup-row" dir="ltr">
        {[1,2,3].map(n=><div className="howto-v72-cup" key={n}>
          {n===2 && !second ? <img className="howto-v72-ball" src={MEDIA.ball} alt="" /> : null}
          <img className={`howto-v72-cup-image ${!second && n===2 ? 'is-lifted' : ''}`} src={MEDIA.cup} alt="" />
          <b>{n}</b>
        </div>)}
        <small>{second ? (locale === 'ar' ? 'بعد ما الكوبايات تقف، ابعت رقم المكان' : 'WHEN CUPS STOP, SEND THE POSITION') : (locale === 'ar' ? 'شوف الكورة ثم تابع مكانها أثناء التبديل' : 'SEE THE BALL, THEN FOLLOW THE CUP')}</small>
      </div>;
    case 'memory-count':
      return <div className="howto-v72-clue howto-v72-memory">
        {second ? <div className="v35-memory-query"><span className="v35-memory-query-icon">🍎</span><strong>?</strong><small>{locale==='ar'?'كام تفاحة؟':'How many apples?'}</small></div>
          : <div className="gameplay-memory-grid v35-memory-grid">{['🍎','🍋','🍎','🍇','🍎','🍋'].map((v,i)=><span className="gameplay-memory-item" key={i}>{v}</span>)}</div>}
      </div>;
  }
}

function ExampleChat({ locale, command }: { locale: Lang; command: string }) {
  return <div className="howto-v71-chat howto-v72-chat">
    <span>{locale === 'ar' ? 'اكتب في الشات' : 'TYPE IN CHAT'}</span>
    <div className="howto-v71-chat-input" dir="ltr"><span>CHAT</span><strong>{command}</strong><b aria-hidden="true">➜</b></div>
    <small>{locale === 'ar' ? 'علامة ! وبعدها رقم الاختيار أو العدد' : 'Type ! followed by your choice number or count'}</small>
  </div>;
}

export function AllGamesTwoPageIntro({ gameId, locale, onStart }: {
  gameId: Exclude<MiniGameId,'food-origin'>;
  locale: Lang;
  onStart: () => void;
}) {
  const [page,setPage] = useState(0);
  const second = page === 1;
  const rtl = locale === 'ar';
  const lesson = GAMES[gameId];
  const current = lesson.pages[page];
  useEffect(()=>setPage(0),[gameId]);
  useEffect(()=>{
    const onKey=(event: KeyboardEvent)=>{
      if(event.altKey||event.ctrlKey||event.metaKey||event.isComposing||
        event.target instanceof HTMLInputElement||event.target instanceof HTMLTextAreaElement||
        event.target instanceof HTMLSelectElement||
        (event.target instanceof HTMLElement&&event.target.isContentEditable))return;
      if(event.key!=='ArrowLeft'&&event.key!=='ArrowRight')return;
      event.preventDefault();
      setPage(current=>Math.min(1,Math.max(0,current+(event.key===(rtl?'ArrowLeft':'ArrowRight')?1:-1))));
    };
    window.addEventListener('keydown',onKey);
    return ()=>window.removeEventListener('keydown',onKey);
  },[rtl]);

  const labels = lesson.choices[locale];
  const hasCards = labels.length > 0;
  const numberOnly = gameId === 'maze-gates'||gameId === 'count-the-beat'||gameId === 'laser-challenge';
  const isPostReveal = second && ['guess-star','shape-count','count-the-beat','maze-gates','laser-challenge'].includes(gameId);
  const timerLabel = isPostReveal ? '0s' : second && gameId === 'guess-movie' ? '1s' : second ? '8s' : '18s';
  const useShapeCards = gameId==='shape-count';
  const sampleDisplayQuestion = gameId==='memory-count' && second
    ? (rtl?'كام تفاحة؟':'How many apples?') : lesson.question[locale];
  return <section className={`howto-v71 howto-v71-food howto-v72 howto-v72-${gameId}`} dir={rtl?'rtl':'ltr'} aria-label={rtl?'طريقة اللعب':'How to play'}>
    <div className="howto-v71-main">
      <div className="howto-v71-preview" aria-label={rtl?'مثال مصغر من عناصر شاشة اللعبة':'Small demonstration using live game UI elements'}>
        <img className="howto-v71-background" src={STAGE} alt="" aria-hidden="true" draggable={false} />
        <div className={`howto-v71-board howto-v72-board ${numberOnly ? 'howto-v72-no-choices' : ''}`}>
          <div className="howto-v71-question-meta">
            <strong className="qshell-game-name">{GAME_NAMES[gameId][locale]}</strong>
            <div className="gameplay-question-meta"><span>{rtl ? 'سؤال 1' : 'Question 1'}</span></div>
          </div>
          <div className="gameplay-question-timer howto-v71-timer" role="timer" aria-label={rtl?'الوقت المتبقي':'Time remaining'}>
            <i className="gameplay-question-timer-icon" aria-hidden="true" />
            <div className="gameplay-question-timer-track"><span className="gameplay-question-timer-fill"
              style={{'--timer-progress':isPostReveal?'0%':second?'45%':'100%','--timer-scale':isPostReveal?'0':second?'.45':'1'} as CSSProperties}/></div>
            <strong>{timerLabel}</strong>
          </div>
          <h3 className="qshell-title howto-v71-question">{sampleDisplayQuestion}</h3>
          <div className="howto-v71-media howto-v72-media"><GameClue gameId={gameId} page={page} locale={locale}/></div>
          {hasCards ? <div className={`howto-v71-choices howto-v72-choices ${labels.length===2?'has-two':''} ${labels.length===3?'has-three':''}`} dir="ltr">
            {labels.map((name,index)=><ChoiceCard key={`${name}-${index}`} command={`!${index+1}`} label={name} tone="cyan" isOpen answerCount={0}
              shape={useShapeCards ? ANSWER_SHAPES[index] : undefined}
              resultState={second && isPostReveal && lesson.correctIndex===index ? 'correct':'pending'} answerCountAriaLabel={rtl?'إجابة':'answers'}/>)}
          </div>:<div className="howto-v72-numeric-footer" aria-hidden="true">{rtl?'جاوب برقم في الشات':'SEND A NUMBER IN CHAT'}</div>}
        </div>
      </div>
      <aside className="howto-v71-info" dir={rtl?'rtl':'ltr'} aria-live="polite" aria-atomic="true">
        <div className="howto-v71-guide howto-v72-guide">
          <h3>{current.heading[locale]}</h3>
          <p>{current.lines[0][locale]}</p>
          <p>{current.lines[1][locale]}</p>
          {second ? <ExampleChat locale={locale} command={lesson.command}/> : null}
          {second&&current.note ? <small className="howto-v72-note">{current.note[locale]}</small>:null}
        </div>
      </aside>
    </div>
    <footer className="howto-v71-footer">
      <button className="howto-v71-skip" type="button" onClick={onStart}>{rtl?'تخطي':'Skip'}</button>
      <div className="howto-v71-controls">
        <button className="howto-v71-back" type="button" disabled={!second} onClick={()=>setPage(0)}><span aria-hidden="true">{rtl?'→':'←'}</span>{rtl?'السابق':'Back'}</button>
        <span className="howto-v71-pagenum" dir="ltr">{page+1} / 2</span>
        <button className="howto-v71-next" type="button" onClick={()=>second?onStart():setPage(1)}>{second?(rtl?'يلا نلعب':'Play!'):(rtl?'التالي':'Next')} <span aria-hidden="true">{rtl?'←':'→'}</span></button>
      </div>
    </footer>
  </section>;
}
