import type { ReactNode } from 'react';
import type { MiniGameId } from '../../../../game-core/minigames/minigame-registry';
import { useGame } from '../../../context/GameContext';

const CUP = './assets/game/runtime/minigames/lucky-cup/cup.png';
const BALL = './assets/game/runtime/minigames/lucky-cup/ball.png';

type Language = 'ar' | 'en';
function L({ locale, ar, en }: { locale: Language; ar: string; en: string }) {
  return <>{locale === 'ar' ? ar : en}</>;
}

function SampleChoices({ labels, highlight = 0 }: { labels: string[]; highlight?: number }) {
  return (
    <div className="howto-sample-choices" dir="ltr">
      {labels.map((label, index) => (
        <span className={`howto-sample-option ${highlight === index ? 'howto-sample-option-highlight' : ''}`} key={label}>
          <b>{index + 1}</b><span>{label}</span>
        </span>
      ))}
    </div>
  );
}

function IllustrationContent({ gameId, locale }: { gameId: MiniGameId; locale: Language }): ReactNode {
  switch (gameId) {
    case 'food-origin':
      return <><div className="howto-food-display"><span>🍣</span><i aria-hidden="true">⌕</i></div>
        <SampleChoices labels={locale === 'ar' ? ['اليابان', 'إيطاليا', 'مصر'] : ['Japan', 'Italy', 'Egypt']} highlight={0} /></>;
    case 'shape-count':
      return <><div className="howto-shapes-display" aria-hidden="true">{'● ◆ ● ▲ ● ◆ ● ▲ ●'.split(' ').map((v, i) => <span key={i} className={v === '●' ? 'howto-most-common' : ''}>{v}</span>)}</div>
        <SampleChoices labels={['● × 5', '◆ × 2', '▲ × 2']} highlight={0} /></>;
    case 'maze-gates':
      return <><svg className="howto-maze-demo" viewBox="0 0 460 150" role="img" aria-label={locale === 'ar' ? 'مسار صحيح من البوابة إلى الخروج' : 'Correct path from entry to exit'}>
          <rect x="4" y="4" width="452" height="142" rx="16" fill="#0a1735" stroke="#5681a1" />
          {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M${70+i*51} 12V140`} stroke="#223959" strokeWidth="2" />)}
          <path d="M46 45H145V104H222V45H305V100H409" fill="none" stroke="#52f6b9" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="46" cy="45" r="23" fill="#193960" stroke="#6febff" strokeWidth="3" /><text x="46" y="52" textAnchor="middle" fill="white" fontSize="20">1</text>
          <rect x="400" y="77" width="50" height="42" rx="10" fill="#1f6947" stroke="#7bf6ae" />
          <text x="425" y="103" textAnchor="middle" fill="white" fontSize="18">✓</text>
        </svg><div className="howto-demo-tag"><L locale={locale} ar="اتبع الطريق لحد المخرج" en="Follow the path to the exit" /></div></>;
    case 'guess-movie':
      return <><div className="v36-howto-poster"><span>🎬</span><strong>?</strong><i>FILM</i></div>
        <SampleChoices labels={locale === 'ar' ? ['فيلم ١','فيلم ٢','فيلم ٣'] : ['Film 1','Film 2','Film 3']} highlight={1} /></>;
    case 'guess-star':
      return <><div className="v36-howto-eyes"><span aria-hidden="true">◉　◉</span><strong>?</strong></div>
        <SampleChoices labels={locale === 'ar' ? ['نجم ١','نجم ٢','نجم ٣'] : ['Star 1','Star 2','Star 3']} highlight={1} /></>;
    case 'count-the-beat':
      return <><div className="howto-beat-demo">{['♫','♪','★','♫','♫','♪','♫','★'].map((v, i) => <span key={i} className={v === '♫' ? 'howto-beat-target' : ''}>{v}</span>)}</div>
        <div className="howto-count-result"><span>♫ × 4</span><strong dir="ltr">!4</strong></div></>;
    case 'lucky-cup':
      return <><div className="howto-cups-demo" dir="ltr">{[0,1,2].map(i => <div className="howto-demo-cup" key={i}><img src={CUP} alt="" draggable={false} />{i===1 ? <img className="howto-demo-ball" src={BALL} alt="" draggable={false} /> : null}<b>↔</b></div>)}</div>
        <div className="howto-demo-tag"><L locale={locale} ar="راقب الكورة وبعدين اختار الكوباية" en="Track the ball, then pick a cup" /></div></>;
    case 'memory-count':
      return <><div className="howto-memory-demo"><div className="howto-memory-items">{'🍎 🍋 🍎 🍇 🍎 🍋'.split(' ').map((v,i) => <span key={i}>{v}</span>)}</div><div className="howto-memory-cover">?</div></div><div className="howto-count-result"><span><L locale={locale} ar="كام تفاحة؟" en="How many apples?" /></span><strong dir="ltr">!3</strong></div></>;
    case 'couple-or-siblings':
      return <><div className="howto-pair-demo"><span>👩</span><b>?</b><span>👨</span></div>
        <SampleChoices labels={locale === 'ar' ? ['مرتبطين ❤️','إخوات 👨‍👩‍👧'] : ['Couple ❤️','Siblings 👨‍👩‍👧']} highlight={1} /></>;
  }
}

const EXAMPLE_ANSWERS: Record<MiniGameId, string> = {
  'food-origin': '!1', 'shape-count': '!1', 'maze-gates': '!1', 'count-the-beat': '!4',
  'lucky-cup': '!2', 'guess-movie': '!2', 'guess-star': '!2', 'memory-count': '!3', 'couple-or-siblings': '!2',
};

/** Pure decorative example — never shows the real round answer. */
export function MiniGameIntroIllustration({ gameId }: { gameId: MiniGameId }) {
  const { snapshot } = useGame();
  const locale = snapshot.locale;
  return (
    <figure className={`howto-visual howto-visual-${gameId}`} aria-label={locale === 'ar' ? 'مثال مصور لطريقة اللعب' : 'Illustrated example of how to play'}>
      <span className="howto-visual-kicker"><L locale={locale} ar="مثال توضيحي" en="EXAMPLE ROUND" /></span>
      <div className="howto-visual-content"><IllustrationContent gameId={gameId} locale={locale} /></div>
      <figcaption><span><L locale={locale} ar="مثال لإجابة الشات" en="Example chat answer" /></span><strong dir="ltr">{EXAMPLE_ANSWERS[gameId]}</strong></figcaption>
    </figure>
  );
}

export const INTRO_STEP_ICONS: Record<MiniGameId, readonly [string, string, string]> = {
  'food-origin': ['👀','🌍','💬'],
  'shape-count': ['👀','🔢','💬'],
  'maze-gates': ['🧠','🧭','💬'],
  'guess-movie': ['🎞️','🎬','💬'],
  'guess-star': ['👀','✨','💬'],
  'count-the-beat': ['♫','🔢','💬'],
  'lucky-cup': ['🥇','🔀','💬'],
  'memory-count': ['👁️','🧠','💬'],
  'couple-or-siblings': ['👥','❤️','💬'],
};
