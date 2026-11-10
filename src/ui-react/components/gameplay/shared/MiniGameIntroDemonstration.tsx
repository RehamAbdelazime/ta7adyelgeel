import { useEffect, useState, type CSSProperties } from 'react';
import type { MiniGameId } from '../../../../game-core/minigames/minigame-registry';
import { FoodOriginHintPill } from '../minigames/FoodOriginHintPill';
import { AllGamesTwoPageIntro } from './AllGamesTwoPageIntro';
import { MediaCard, ChoiceCard } from './question-shell';

/**
 * V68 — visual, navigable mini-show tutorial. All images are shipped with the
 * game (two genuine user-shared stage screenshots, plus the existing game art).
 * The screenshot behind the sample playfield is only a visual reference: the
 * overlaid example is NOT a capture of a real round and never leaks an answer.
 */
const MEDIA = './assets/game/runtime/minigames/';
const SHOTS = `${MEDIA}HowTo/`;
const FOOD = `${MEDIA}food-origin/photos/carbonara_italy.jpg`;
const POSTER = `${MEDIA}visual-guess/Posters/movie-elzoga-13.jpg`;
const EYES = `${MEDIA}visual-guess/Stars/Eyes/uploaded-01.jpg`;
const FACE = `${MEDIA}visual-guess/Stars/Full/uploaded-01.jpg`;
const CUP = `${MEDIA}lucky-cup/cup.png`;
const BALL = `${MEDIA}lucky-cup/ball.png`;

type StepKind = 'watch' | 'answer' | 'hint' | 'reveal';
type Copy = { ar: string; en: string };
type Lesson = {
  title: Copy;
  watch: Copy;
  answer: Copy;
  reveal: Copy;
  example: readonly string[];
  correct: number;
  result?: Copy;
};

const LESSONS: Record<MiniGameId, Lesson> = {
  'food-origin': {
    title: { ar: 'الطبق ده مشهور في مطبخ أنهي بلد؟', en: 'Which country is this dish associated with?' },
    watch: { ar: 'بص على صورة الأكلة الحقيقية، وافتكر البلد المشهورة بيها.', en: 'Look at the real dish photo and guess its country.' },
    answer: { ar: 'كل بلد قدامها رقم. ابعت رقم اختيارك في الشات قبل الوقت ما يخلص.', en: 'Each country has a number. Send yours in chat before time runs out.' },
    reveal: { ar: 'لما الصبوح يكشف، الاختيار الصح ينور ودرجات الناس تتحسب.', en: 'On host reveal, the correct country lights up and points are scored.' },
    example: ['إيطاليا', 'اليونان', 'فرنسا', 'تركيا'], correct: 0,
  },
  'shape-count': {
    title: { ar: 'إيه الشكل اللي ظاهر أكتر؟', en: 'Which shape appears most?' },
    watch: { ar: 'ركّز في شبكة الأشكال، وشوف أنهي شكل متكرر أكتر.', en: 'Scan the grid and spot the most frequent shape.' },
    answer: { ar: 'اختار رقم الشكل الصح. قربك من الإجابة مش معناه تختار عشوائي.', en: 'Choose the number for the shape you counted.' },
    reveal: { ar: 'الأشكال الصح بتتميز لما الإجابة تتكشف، وساعتها بتظهر النتيجة.', en: 'Matching shapes are highlighted when the answer is revealed.' },
    example: ['●', '◆', '▲', '■'], correct: 0,
  },
  'maze-gates': {
    title: { ar: 'أنهي بوابة توصل للمخرج؟', en: 'Which gate reaches the exit?' },
    watch: { ar: 'اتبع الطرق بعينك من البوابات لحد المخرج، وخلّي بالك من الطرق المقفولة.', en: 'Trace the paths from each gate and watch for dead ends.' },
    answer: { ar: 'كل بوابة مرقمة من 1 إلى 4. ابعت رقم البوابة اللي شايفها صح.', en: 'Gates are numbered 1–4. Send the number that reaches the exit.' },
    reveal: { ar: 'الطريق الصح بيتلوّن بعد كشف الإجابة، فتعرف كنت ماشي صح ولا لأ.', en: 'The correct path lights up on reveal so you can check your route.' },
    example: ['1', '2', '3', '4'], correct: 1,
  },
  'count-the-beat': {
    title: { ar: 'عدّ الرمز المطلوب', en: 'Count the target symbol' },
    watch: { ar: 'ركز في العلامة المطلوبة، وراقب الرموز اللي بتظهر على الإيقاع.', en: 'Watch the target symbol and the icons appearing to the beat.' },
    answer: { ar: 'عدّ مرات ظهور الرمز المطلوب بس، وابعت العدد في الشات.', en: 'Count only the target icon, then send the number in chat.' },
    reveal: { ar: 'بعد الكشف هيظهر العدد الصح، ويتحسب مين كان أدق.', en: 'Reveal shows the correct count and scores accurate answers.' },
    example: ['3', '4', '5', '6'], correct: 1,
  },
  'lucky-cup': {
    title: { ar: 'الكورة تحت أنهي كوباية؟', en: 'Which cup hides the ball?' },
    watch: { ar: 'شوف الكورة تحت أنهي كوباية قبل ما الكوبايات تبدأ تتحرك.', en: 'Find the ball before the cups start shuffling.' },
    answer: { ar: 'تابع الكوباية طول التبديل. بعد ما تقف ابعت رقمها.', en: 'Track the right cup through the shuffle, then send its number.' },
    reveal: { ar: 'الكوباية الصح تترفع، والكورة تظهر ونتيجة الإجابات تتحسب.', en: 'The winning cup lifts, the ball appears, and points are awarded.' },
    example: ['1', '2', '3', '4'], correct: 1,
  },
  'guess-movie': {
    title: { ar: 'الفيلم ده إيه؟', en: 'Name that movie' },
    watch: { ar: 'ممكن تشوف بوستر بيتكشف، أو مشهد واضح، أو قفشة من الفيلم.', en: 'You may get a revealing poster, a sharp frame, or a movie quote.' },
    answer: { ar: 'فكر في الفيلم أو كمّل القفشة حسب نوع السؤال، واختار رقم الإجابة.', en: 'Pick the movie or complete the quote depending on the clue.' },
    reveal: { ar: 'الصبوح يكشف الحل؛ البوستر يوضح كامل أو الإجابة الصح تتحدد.', en: 'Host reveal shows the complete poster or marks the correct answer.' },
    example: ['فيلم ١', 'فيلم ٢', 'فيلم ٣', 'فيلم ٤'], correct: 1,
  },
  'guess-star': {
    title: { ar: 'مين المشهور من عينيه؟', en: 'Who is behind the eyes?' },
    watch: { ar: 'الصورة بتعرض العينين بس، من غير Blur ومن غير كشف تدريجي.', en: 'Only the eyes are shown, sharp and without gradual reveal.' },
    answer: { ar: 'ركز في العيون، واختار رقم اسم المشهور اللي متأكد منه.', en: 'Study the eyes and choose the celebrity by number.' },
    reveal: { ar: 'بعد كشف الإجابة، تظهر نفس الصورة كاملة مرة واحدة.', en: 'After host reveal, the matching full portrait appears instantly.' },
    example: ['شخص ١', 'شخص ٢', 'شخص ٣', 'شخص ٤'], correct: 2,
  },
  'memory-count': {
    title: { ar: 'افتكر اللي شوفته', en: 'Remember what you saw' },
    watch: { ar: 'احفظ أماكن وعدد الرموز اللي ظهرت قدامك.', en: 'Memorize the positions and count of the displayed items.' },
    answer: { ar: 'بعد اختفاء العناصر، جاوب عن عدد الرمز المطلوب.', en: 'When they disappear, answer how many target icons you saw.' },
    reveal: { ar: 'عند الكشف هتعرف العدد الصح وتتحسب النقاط.', en: 'The correct count and points are shown on reveal.' },
    example: ['1', '2', '3', '4'], correct: 2,
  },
  'couple-or-siblings': {
    title: { ar: 'مرتبطين ولا إخوات؟', en: 'Couple or siblings?' },
    watch: { ar: 'بص على الاتنين كويس قبل ما تختار.', en: 'Take a good look at the two people.' },
    answer: { ar: 'اختار 1 أو 2 حسب رأيك، وابعت الرقم في الشات.', en: 'Choose 1 or 2, then send the number in chat.' },
    reveal: { ar: 'بعد الكشف هتعرف الإجابة الصح ويتحسب السكور.', en: 'The correct relation and points appear after reveal.' },
    example: ['مرتبطين', 'إخوات'], correct: 1,
  },
};


/** The slide examples are illustrative, built only from the game's local art.
 * The photographic stage beneath them is the player's actual shared capture.
 * Nothing here affects the live questions, scoring, or answer revelation. */
const GAME_BADGES: Record<MiniGameId, Copy> = {
  'food-origin': { ar: 'أصل الأكلة', en: 'FOOD ORIGIN' },
  'shape-count': { ar: 'عدّ الأشكال', en: 'SHAPE COUNT' },
  'maze-gates': { ar: 'المتاهة', en: 'MAZE GATES' },
  'count-the-beat': { ar: 'عدّ الإيقاع', en: 'COUNT THE BEAT' },
  'lucky-cup': { ar: 'الكوباية المحظوظة', en: 'LUCKY CUP' },
  'guess-movie': { ar: 'اعرف الفيلم', en: 'GUESS THE MOVIE' },
  'guess-star': { ar: 'اعرف المشهور', en: 'GUESS THE STAR' },
  'memory-count': { ar: 'اختبار الذاكرة', en: 'MEMORY COUNT' },
  'couple-or-siblings': { ar: 'مرتبطين ولا إخوات؟', en: 'COUPLE OR SIBLINGS' },
};

function GameExample({ gameId, step, locale }: { gameId: MiniGameId; step: StepKind; locale: 'ar' | 'en' }) {
  const revealed = step === 'reveal';
  switch (gameId) {
    case 'food-origin':
      return <div className="howto-v70-food-visual">
        <img className="howto-demo-image howto-demo-food" src={FOOD} alt="" draggable={false} />
        <div className={`howto-v70-food-hint ${step === 'hint' || revealed ? 'is-visible' : ''}`}>
          {step === 'hint' || revealed ? (locale === 'ar' ? 'تلميح: اسم الأكلة كاربونارا' : 'HINT: Dish name — Carbonara') : (locale === 'ar' ? 'اسم الأكلة هيظهر في نص الوقت' : 'Dish name unlocks halfway')}
        </div>
      </div>;
    case 'guess-movie':
      return <img className={`howto-demo-image howto-demo-poster ${revealed ? 'is-revealed' : ''}`} src={POSTER} alt="" draggable={false} />;
    case 'guess-star':
      return <img className={`howto-demo-image ${revealed ? 'howto-demo-face' : 'howto-demo-eyes'}`} src={revealed ? FACE : EYES} alt="" draggable={false} />;
    case 'lucky-cup':
      // The live Lucky Cup game has THREE cups, not four.
      return <div className="howto-demo-cups" dir="ltr">{[0, 1, 2].map(i =>
        <div className="howto-demo-cup" key={i}>
          {revealed && i === 1 && <img className="howto-demo-ball" src={BALL} alt="" />}
          <img className={`howto-demo-cup-art ${revealed && i === 1 ? 'is-lifted' : ''}`} src={CUP} alt="" />
          <b>{i + 1}</b>
        </div>)}</div>;
    case 'shape-count':
      return <div className="howto-demo-shapes" aria-hidden="true">{'● ◆ ● ▲ ● ■ ◆ ● ▲ ■ ● ◆'.split(' ').map((shape, i) =>
        <span key={i} className={revealed && shape === '●' ? 'is-answer' : ''}>{shape}</span>)}</div>;
    case 'maze-gates':
      return <svg className="howto-demo-maze" viewBox="0 0 490 210" role="img" aria-label="Illustrative four-gate maze">
        <path className="howto-demo-grid" d="M20 45H470M20 90H470M20 135H470M20 180H470M95 10V200M170 10V200M245 10V200M320 10V200M395 10V200" />
        {[
          ['40,40 100,40 100,75 200,75 200,155 265,155','1',40],
          ['40,95 130,95 130,165 355,165 355,35 460,35','2',95],
          ['40,145 105,145 105,200','3',145],
          ['40,193 175,193 175,180','4',193],
        ].map(([points, name, y]) => <g key={name}>
          <polyline points={String(points)} className={revealed && name === '2' ? 'howto-demo-correct-path' : 'howto-demo-path'} />
          <circle cx="40" cy={Number(y)} r="16" className="howto-demo-gate" />
          <text x="40" y={Number(y) + 5} textAnchor="middle" fill="white" fontSize="16">{name}</text>
        </g>)}
        <rect x="425" y="15" width="59" height="32" rx="10" fill="#105c55" stroke="#79ffe0" />
        <text x="454" y="36" textAnchor="middle" fill="white" fontSize="14">EXIT</text>
      </svg>;
    case 'count-the-beat':
      return <div className="howto-demo-beat" aria-hidden="true">
        {revealed ? <span className="howto-demo-number">4</span> : <><b>♫</b><span>♫　★　♫　♪<br />♫　♪　♫　★</span></>}
      </div>;
    case 'memory-count':
      return <div className="howto-demo-memory" aria-hidden="true">{revealed ? '🍎 × 3' : '🍎　🍋　🍎　🍇　🍎　🍋'}</div>;
    case 'couple-or-siblings':
      return <div className="howto-demo-pair" aria-hidden="true"><img src={`${MEDIA}couple-or-siblings/pair-002.svg`} alt="" /></div>;
  }
}

/** Answer cards are shown for the games that actually have a choice row.
 * Numeric-input games and maze gates do not get fictitious answer boxes. */
function sampleChoices(gameId: MiniGameId, locale: 'ar' | 'en') {
  switch (gameId) {
    case 'guess-movie': return locale === 'ar' ? ['الزوجة 13', 'الزوجة الثانية', 'فيلم آخر', 'فيلم تاني'] : ['The 13th Wife', 'The Second Wife', 'Movie C', 'Movie D'];
    case 'guess-star': return locale === 'ar' ? ['مشهور أ', 'مشهور ب', 'مشهور ج', 'مشهور د'] : ['Person A', 'Person B', 'Person C', 'Person D'];
    case 'food-origin': return locale === 'ar' ? ['إيطاليا', 'اليونان', 'فرنسا', 'تركيا'] : ['Italy', 'Greece', 'France', 'Türkiye'];
    case 'shape-count': return ['●', '◆', '▲', '■'];
    case 'lucky-cup': return ['1', '2', '3'];
    case 'couple-or-siblings': return locale === 'ar' ? ['مرتبطين', 'إخوات'] : ['Couple', 'Siblings'];
    default: return [];
  }
}

// Food Origin uses a dedicated TWO-page lesson. The other eight demos stay
// exactly as they were: no changes to their actual gameplay or screens.
export function MiniGameIntroDemonstration(props: {
  gameId: MiniGameId;
  locale: 'ar' | 'en';
  onStart: () => void;
}) {
  return props.gameId === 'food-origin'
    ? <FoodOriginTwoPageIntro locale={props.locale} onStart={props.onStart} />
    : <AllGamesTwoPageIntro gameId={props.gameId} locale={props.locale} onStart={props.onStart} />;
}

function OtherMiniGameIntroDemonstration({ gameId, locale, onStart }: {
  gameId: MiniGameId;
  locale: 'ar' | 'en';
  onStart: () => void;
}) {
  const [page, setPage] = useState(0);
  useEffect(() => setPage(0), [gameId]);
  const lesson = LESSONS[gameId];
  const rtl = locale === 'ar';
  const local = (value: Copy) => value[locale];
  const isFood = gameId === 'food-origin';
  const totalPages = isFood ? 4 : 3;
  const kind: StepKind = page === 0 ? 'watch' : page === 1 ? 'answer' : isFood && page === 2 ? 'hint' : 'reveal';
  const headings = rtl ? ['شوف التحدي', 'اختار وجاوب', 'دي النتيجة'] : ['Look at the challenge', 'Choose & answer', 'See the result'];
  const captions = isFood ? (rtl ? ['شوف', 'جاوب', 'التلميح', 'الحل'] : ['WATCH', 'ANSWER', 'HINT', 'REVEAL']) : (rtl ? ['شوف', 'جاوب', 'اكشف'] : ['WATCH', 'ANSWER', 'REVEAL']);
  const choices = sampleChoices(gameId, locale);
  const correct = gameId === 'guess-movie' ? 0 : gameId === 'lucky-cup' ? 1 : lesson.correct;
  const numericGame = gameId === 'count-the-beat' || gameId === 'maze-gates' || gameId === 'memory-count';
  const answerExample = gameId === 'count-the-beat' ? '4' : gameId === 'memory-count' ? '3' : '2';
  const focusLabel = kind === 'hint' ? (rtl ? 'التلميح هنا' : 'HINT HERE') : kind === 'watch'
    ? (rtl ? 'ركّز هنا' : 'LOOK HERE')
    : kind === 'answer' ? (rtl ? 'اختار رقمك' : 'PICK A NUMBER')
      : (rtl ? 'ده الحل' : 'THE ANSWER');

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.isComposing ||
        event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement ||
        (event.target instanceof HTMLElement && event.target.isContentEditable)) return;
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
      event.preventDefault();
      const forward = rtl ? event.key === 'ArrowLeft' : event.key === 'ArrowRight';
      setPage(current => Math.min(totalPages - 1, Math.max(0, current + (forward ? 1 : -1))));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [rtl, totalPages]);

  return <section className="howto-v68 howto-v69" dir={rtl ? 'rtl' : 'ltr'} aria-label={rtl ? 'الشرح المصور للعبة' : 'Illustrated game walkthrough'}>
    <div className="howto-v69-steps" aria-label={rtl ? 'خطوات الشرح' : 'Tutorial steps'}>
      {Array.from({ length: totalPages }, (_, i) => i).map(i => <button type="button" key={i} className={`howto-v69-step ${i === page ? 'active' : ''} ${i < page ? 'visited' : ''}`}
        onClick={() => setPage(i)} aria-current={i === page ? 'step' : undefined}
        aria-label={rtl ? `الخطوة ${i + 1}: ${captions[i]}` : `Step ${i + 1}: ${captions[i]}`}>
        <span className="howto-v69-step-circle">{i + 1}</span><b>{captions[i]}</b>
      </button>)}
    </div>

    <div className={`howto-v68-layout howto-v69-layout ${isFood ? 'howto-v70-food-layout' : ''}`}>
      <div className={`howto-v69-preview howto-v69-phase-${kind}`}>
        <img className="howto-v69-photo" src={`${SHOTS}stage-quote.webp`} alt="" aria-hidden="true" draggable={false}/>
        <div className="howto-v69-stage" aria-hidden="true">
          <div className="howto-v69-hud"><span>{local(GAME_BADGES[gameId])}</span><small>{rtl ? 'سؤال 1' : 'QUESTION 1'}</small></div>
          <div className={`howto-v69-timer ${isFood ? 'howto-v70-food-timer' : ''}`}><span style={isFood && kind === 'hint' ? { width: '49%' } : undefined} /></div>
          <div className="howto-v69-clue-title">{gameId === 'guess-star' ? (rtl ? 'مين ده من عينيه؟' : 'Whose eyes?') : local(lesson.title)}</div>
          <div className="howto-v69-clue-focus"><GameExample gameId={gameId} step={kind} locale={locale} /></div>
          {choices.length > 0 ? <div className="howto-v68-answer-strip howto-v69-answers" dir="ltr">
            {choices.map((label, index) => <div className={`howto-v69-choice ${kind === 'reveal' && index === correct ? 'howto-v69-choice-correct' : ''} ${isFood && kind === 'answer' && index === 0 ? 'howto-v70-selected-choice' : ''}`} key={`${index}-${label}`}>
              <b className="howto-v69-choice-id">!{index + 1}</b><span dir={rtl ? 'rtl' : 'ltr'}>{label}</span>
            </div>)}
          </div> : <div className="howto-v69-answer-hint" aria-hidden="true">
            {numericGame ? (rtl ? 'جاوب في الشات برقم' : 'SEND A NUMBER IN CHAT') : ''}
            {kind === 'reveal' ? <strong>{gameId === 'count-the-beat' ? 4 : gameId === 'memory-count' ? 3 : 2} ✓</strong> : null}
          </div>}
          {kind === 'reveal' ? <div className="howto-v69-success" aria-hidden="true">✓ {rtl ? 'إجابة صحيحة' : 'CORRECT'}</div> : null}
        </div>
        <span className={`howto-v69-target-label howto-v68-marker-reveal howto-v69-target-${kind}`}
          style={kind === 'reveal' && choices.length > 0 ? { left: `${8 + correct * (choices.length === 4 ? 21 : 29)}%` } : undefined}
          aria-hidden="true">
          {kind === 'watch' ? '➜' : '↑'} {focusLabel}
        </span>
      </div>

      <aside className={`howto-v69-explain ${isFood ? 'howto-v70-food-guide' : ''}`} aria-live="polite" aria-atomic="true" dir={rtl ? 'rtl' : 'ltr'}>
        {isFood ? <div className="howto-v70-guide-card" key={`${locale}-${kind}`}>
          <div className="howto-v70-guide-kicker">
            <span>{rtl ? 'دليلك للعبة' : 'HOW TO PLAY'}</span>
            <strong dir="ltr">{String(page + 1).padStart(2, '0')} / 04</strong>
          </div>
          <h3>{rtl ? (['بص على الأكلة', 'اختار وجاوب', 'الوقت والتلميح', 'شوف الإجابة'][page])
            : (['Look at the food', 'Pick & answer', 'Timer & hint', 'Reveal'][page])}</h3>
          {kind === 'watch' ? <div className="howto-v70-guide-points">
            <p><b>01</b><span>{rtl ? 'هتظهر صورة أكلة في نص الشاشة.' : 'A dish photo appears in the middle of the screen.'}</span></p>
            <p><b>02</b><span>{rtl ? 'خمّن إيه البلد المشهورة بالأكلة دي.' : 'Guess the country famous for this dish.'}</span></p>
          </div> : kind === 'answer' ? <>
            <div className="howto-v70-guide-points">
              <p><b>01</b><span>{rtl ? 'هتلاقي الإجابات جنب بعض تحت الصورة.' : 'Four answer choices sit side by side under the photo.'}</span></p>
              <p><b>02</b><span>{rtl ? 'كل اختيار جنبه رقم. علشان تجاوب، ابعت علامة ! وبعدها رقم اختيارك في الشات.' : 'Each choice has a number. Send ! followed by that number in chat.'}</span></p>
            </div>
            <div className="howto-v70-chat-example" aria-label={rtl ? 'مثال إرسال إجابة في الشات' : 'Example chat response'}>
              <div className="howto-v70-chat-top"><span className="howto-v70-chat-dot" />{rtl ? 'الشات — مثال' : 'CHAT — EXAMPLE'}<span className="howto-v70-chat-sent">✓</span></div>
              <div className="howto-v70-chat-row"><span className="howto-v70-chat-name">PLAYER</span><strong dir="ltr">!1</strong><span className="howto-v70-chat-send">➤</span></div>
              <small>{rtl ? 'لو اخترت الإجابة رقم 1، اكتب !1 في الشات' : 'For choice 1, type !1 in chat'}</small>
            </div>
          </> : kind === 'hint' ? <>
            <div className="howto-v70-guide-points">
              <p><b>01</b><span>{rtl ? 'فوق الصورة فيه مؤقت؛ لازم تجاوب قبل ما الوقت يخلص.' : 'The timer is at the top. Answer before time runs out.'}</span></p>
              <p><b>02</b><span>{rtl ? 'بعد نص الوقت، اسم الأكلة هيظهر كتلميح تحت الصورة.' : 'Halfway through, the dish name appears as a hint below the photo.'}</span></p>
            </div>
            <div className="howto-v70-score-note">
              <strong>{rtl ? 'جاوب بدري = سكور أعلى' : 'EARLY ANSWER = MORE POINTS'}</strong>
              <span>{rtl ? 'لو جاوبت بعد ظهور التلميح، هتاخد نص نقاط الإجابة الصح.' : 'After the hint appears, a correct answer earns half the points.'}</span>
            </div>
          </> : <>
            <div className="howto-v70-guide-points">
              <p><b>01</b><span>{rtl ? 'بعد ما الوقت يخلص، الصبوح يكشف البلد الصح.' : 'After time runs out, the host reveals the correct country.'}</span></p>
              <p><b>02</b><span>{rtl ? 'إجابتك الصح تتحسب حسب توقيت إرسالها: قبل التلميح أو بعده.' : 'Correct answers score according to whether they were sent before or after the hint.'}</span></p>
            </div>
            <div className="howto-v70-score-note is-reveal"><strong>✓ {rtl ? 'الإجابة الصحيحة: إيطاليا' : 'CORRECT: ITALY'}</strong></div>
          </>}
        </div> : <>
          <div className="howto-v69-count">{rtl ? 'خطوة' : 'STEP'} <strong dir="ltr">0{page + 1} / 03</strong></div>
          <h3>{headings[page]}</h3>
          <p>{local(lesson[kind === 'hint' ? 'watch' : kind])}</p>
          <div className="howto-v69-example">
            <span>{kind === 'watch' ? (rtl ? 'مثال من اللعبة' : 'GAME EXAMPLE')
              : kind === 'answer' ? (rtl ? 'لو اخترت' : 'IF YOU CHOOSE')
                : (rtl ? 'بعد كشف الصبوح' : 'ON HOST REVEAL')}</span>
            {kind === 'watch' ? <b>{rtl ? 'عينك على التحدي' : 'WATCH THE CLUE'}</b>
              : kind === 'answer' ? <b dir="ltr">!{numericGame ? answerExample : String(correct + 1)} <i>←</i> {rtl ? 'في الشات' : 'in chat'}</b>
                : <b>{rtl ? 'يظهر الحل وتتحسب النقاط' : 'Answer shown · points counted'}</b>}
          </div>
          <span className="howto-v69-preview-note">{rtl ? 'مثال توضيحي من تصميم اللعبة — مش سؤال حقيقي' : 'Illustrative example, not a live round'}</span>
        </>}
      </aside>
    </div>

    <div className="howto-v69-footer">
      <div className="howto-v69-navigation" aria-label={rtl ? 'تنقل بين الشرح' : 'Tutorial navigation'}>
        <button className="howto-v69-prev" type="button" disabled={page === 0} onClick={() => setPage(x => Math.max(0, x - 1))}>
          <span aria-hidden="true">{rtl ? '→' : '←'}</span><span>{rtl ? 'السابق' : 'Back'}</span>
        </button>
        <div className="howto-v69-dots">{Array.from({ length: totalPages }, (_, i) => i).map(i => <button type="button" aria-label={rtl ? `الخطوة ${i + 1}` : `Step ${i + 1}`}
          aria-current={page === i ? 'step' : undefined} className={page === i ? 'active' : ''} key={i} onClick={() => setPage(i)} />)}</div>
        <button className="howto-v69-next" type="button" onClick={() => page === totalPages - 1 ? onStart() : setPage(x => x + 1)}>
          <span>{page === totalPages - 1 ? (rtl ? 'يلا نلعب!' : 'LET’S PLAY!') : (rtl ? 'التالي' : 'Next')}</span><span aria-hidden="true">{rtl ? '←' : '→'}</span>
        </button>
      </div>
      <button className="howto-v69-skip" type="button" onClick={onStart}>{rtl ? 'تخطي الشرح' : 'Skip tutorial'}</button>
    </div>
  </section>;
}

/**
 * V71 — FOOD ORIGIN only: small WYSIWYG rendition of the actual question.
 * Uses the production MediaCard, ChoiceCard and FoodOriginHintPill components,
 * not an invented green hint strip or an interactive answer button. The round
 * content is an example; its UI pieces are the same as those used in gameplay.
 */
function FoodOriginTwoPageIntro({ locale, onStart }: { locale: 'ar' | 'en'; onStart: () => void }) {
  const rtl = locale === 'ar';
  const [page, setPage] = useState(0);
  const hintShown = page === 1;
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.isComposing ||
        event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement ||
        (event.target instanceof HTMLElement && event.target.isContentEditable)) return;
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      setPage(current => Math.max(0, Math.min(1, current + ((rtl ? event.key === 'ArrowLeft' : event.key === 'ArrowRight') ? 1 : -1))));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [rtl]);

  const countries = rtl ? ['إيطاليا', 'اليونان', 'فرنسا', 'تركيا'] : ['Italy', 'Greece', 'France', 'Türkiye'];
  // This matches FoodOriginScreen's label contract, including countdown form.
  const hintLabel = hintShown
    ? (rtl ? 'كاربونارا' : 'Carbonara')
    : (rtl ? 'تلميح بعد 9 ث' : 'HINT IN 9s');

  return (
    <section className="howto-v71 howto-v71-food" dir={rtl ? 'rtl' : 'ltr'} aria-label={rtl ? 'طريقة اللعب: أصل الأكلة' : 'How to play: Food Origin'}>
      <div className="howto-v71-main">
        <div className="howto-v71-preview" aria-label={rtl ? 'مثال مصغّر من واجهة السؤال الحقيقية' : 'Small example of the actual question interface'}>
          <img className="howto-v71-background" src={`${SHOTS}stage-quote.webp`} alt="" aria-hidden="true" draggable={false} />
          <div className="howto-v71-board">
            <div className="howto-v71-question-meta">
              <strong className="qshell-game-name">{rtl ? 'أصل الأكلة' : 'FOOD ORIGIN'}</strong>
              <div className="gameplay-question-meta"><span>{rtl ? 'سؤال 1' : 'Question 1'}</span></div>
            </div>
            <div className="gameplay-question-timer howto-v71-timer" role="timer" aria-label={rtl ? 'الوقت المتبقي' : 'Time remaining'}>
              <i className="gameplay-question-timer-icon" aria-hidden="true" />
              <div className="gameplay-question-timer-track"><span className="gameplay-question-timer-fill"
                style={{ '--timer-progress': hintShown ? '50%' : '100%', '--timer-scale': hintShown ? '.5' : '1' } as CSSProperties} /></div>
              <strong>{hintShown ? '9s' : '18s'}</strong>
            </div>
            <h3 className="qshell-title howto-v71-question">{rtl ? 'الطبق ده مشهور في مطبخ أنهي بلد؟' : 'Which country is this dish associated with?'}</h3>
            <div className="howto-v71-media">
              <MediaCard imageUrl={FOOD} altText={rtl ? 'صورة طبق كاربونارا' : 'Carbonara dish'}
                caption={<FoodOriginHintPill label={hintLabel} revealed={hintShown} />} />
            </div>
            <div className="howto-v71-choices" dir="ltr">
              {countries.map((name, index) =>
                <ChoiceCard key={name} command={`!${index + 1}`} label={name} tone="cyan" isOpen answerCount={0}
                  answerCountAriaLabel={rtl ? 'إجابة' : 'answers'} />)}
            </div>
          </div>
        </div>

        <aside className="howto-v71-info" dir={rtl ? 'rtl' : 'ltr'} aria-live="polite" aria-atomic="true">
          <div className="howto-v71-guide">
            <h3>{hintShown ? (rtl ? 'الوقت والتلميح' : 'Time & hint') : (rtl ? 'خمن البلد' : 'Guess the country')}</h3>
            {hintShown ? <>
              <p>{rtl ? 'جاوب قبل ما الوقت اللي فوق يخلص.' : 'Answer before the timer at the top runs out.'}</p>
              <p>{rtl ? 'بعد نص الوقت، اسم الأكلة بيظهر تحت الصورة كتلميح.' : 'Halfway through, the dish name appears below the photo as a hint.'}</p>
              <div className="howto-v71-score" aria-label={rtl ? 'تأثير توقيت الإجابة على النقاط' : 'How answer timing affects points'}>
                <div><small>{rtl ? 'قبل التلميح' : 'Before hint'}</small><strong>{rtl ? 'نقاط كاملة' : 'Full points'}</strong></div>
                <div><small>{rtl ? 'بعد التلميح' : 'After hint'}</small><strong>{rtl ? 'نص النقاط' : 'Half points'}</strong></div>
              </div>
              <small className="howto-v71-note">{rtl ? '* لو الإجابة صح' : '* For a correct answer'}</small>
            </> : <>
              <p>{rtl ? 'هتشوف صورة أكلة في النص. خمّن البلد المشهورة بيها.' : 'A dish appears in the middle. Guess the country it is famous in.'}</p>
              <p>{rtl ? 'أربع اختيارات تحت الصورة، وكل اختيار جنبُه رقمه.' : 'Four choices below the photo, each with its own number.'}</p>
              <div className="howto-v71-chat">
                <span>{rtl ? 'اكتب في الشات' : 'TYPE IN CHAT'}</span>
                <div className="howto-v71-chat-input" dir="ltr"><span>CHAT</span><strong>!1</strong><b aria-hidden="true">➜</b></div>
                <small>{rtl ? 'مثلاً: !1 يعني اخترت الإجابة رقم 1' : 'For example, !1 means you chose answer 1'}</small>
              </div>
            </>}
          </div>
        </aside>
      </div>
      <footer className="howto-v71-footer">
        <button className="howto-v71-skip" type="button" onClick={onStart}>{rtl ? 'تخطي' : 'Skip'}</button>
        <div className="howto-v71-controls">
          <button type="button" className="howto-v71-back" onClick={() => setPage(0)} disabled={!hintShown}>
            <span aria-hidden="true">{rtl ? '→' : '←'}</span>{rtl ? 'السابق' : 'Back'}
          </button>
          <span className="howto-v71-pagenum" dir="ltr">{page + 1} / 2</span>
          <button type="button" className="howto-v71-next" onClick={() => hintShown ? onStart() : setPage(1)}>
            {hintShown ? (rtl ? 'يلا نلعب' : 'Play!') : (rtl ? 'التالي' : 'Next')}
            <span aria-hidden="true">{rtl ? '←' : '→'}</span>
          </button>
        </div>
      </footer>
    </section>
  );
}
