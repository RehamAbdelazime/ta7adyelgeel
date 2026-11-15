import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { translate } from '../../../../game-core/localization/translations';
import type { TranslationKey } from '../../../../game-core/localization/locale-types';
import type { MiniGameId } from '../../../../game-core/minigames/minigame-registry';
import type { ShapeCountShapeId } from '../../../../game-core/minigames/minigame-types';
import { MediaCard, ChoiceCard, ShapeMark } from './question-shell';
import { BeatIcon } from '../minigames/BeatIcon';
import { BeatStageLanes } from '../minigames/BeatStageLanes';
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
type Copy = TranslationKey;
type PageGuide = { heading: Copy; lines: [Copy, Copy]; note?: Copy };
type Lesson = { question: Copy; pages: [PageGuide, PageGuide]; choices: TranslationKey[]; command: string; correctIndex?: number; };

const GAMES: Record<Exclude<MiniGameId,'food-origin'>, Lesson> = {
  'shape-count': {
    question: 'tutorial.twoPage.shape.count.question',
    pages: [
      { heading:'tutorial.twoPage.shape.count.pages.1.heading', lines:[
        'tutorial.twoPage.shape.count.pages.1.lines.1',
        'tutorial.twoPage.shape.count.pages.1.lines.2',
      ] },
      { heading:'tutorial.twoPage.shape.count.pages.2.heading', lines:[
        'tutorial.twoPage.shape.count.pages.2.lines.1',
        'tutorial.twoPage.shape.count.pages.2.lines.2',
      ] },
    ], choices:['shape.label.circle', 'tutorial.twoPage.shape.count.choices.2', 'shape.label.triangle', 'shape.label.square'], command:'!1', correctIndex:0,
  },
  'maze-gates': {
    question:'tutorial.twoPage.maze.gates.question',
    pages:[
      { heading:'tutorial.twoPage.maze.gates.pages.1.heading', lines:[
        'tutorial.twoPage.maze.gates.pages.1.lines.1',
        'tutorial.twoPage.maze.gates.pages.1.lines.2',
      ] },
      { heading:'tutorial.twoPage.maze.gates.pages.2.heading', lines:[
        'tutorial.twoPage.maze.gates.pages.2.lines.1',
        'tutorial.twoPage.maze.gates.pages.2.lines.2',
      ] },
    ], choices:[],command:'!2',correctIndex:1,
  },
  'count-the-beat': {
    question:'tutorial.twoPage.count.the.beat.question',
    pages:[
      { heading:'tutorial.twoPage.count.the.beat.pages.1.heading',lines:[
        'tutorial.twoPage.count.the.beat.pages.1.lines.1',
        'tutorial.twoPage.count.the.beat.pages.1.lines.2',
      ] },
      { heading:'tutorial.twoPage.count.the.beat.pages.2.heading',lines:[
        'tutorial.twoPage.count.the.beat.pages.2.lines.1',
        'tutorial.twoPage.count.the.beat.pages.2.lines.2',
      ],note:'tutorial.twoPage.count.the.beat.pages.2.note' },
    ],choices:[],command:'!4',
  },
  'lucky-cup': {
    question:'tutorial.twoPage.lucky.cup.question',
    pages:[
      {heading:'tutorial.twoPage.lucky.cup.pages.1.heading',lines:[
        'tutorial.twoPage.lucky.cup.pages.1.lines.1',
        'tutorial.twoPage.lucky.cup.pages.1.lines.2',
      ]},
      {heading:'tutorial.twoPage.lucky.cup.pages.2.heading',lines:[
        'tutorial.twoPage.lucky.cup.pages.2.lines.1',
        'tutorial.twoPage.lucky.cup.pages.2.lines.2',
      ]},
    ],choices:['tutorial.twoPage.lucky.cup.choices.1', 'tutorial.twoPage.lucky.cup.choices.2', 'tutorial.twoPage.lucky.cup.choices.3'],command:'!2',correctIndex:1,
  },
  'laser-challenge': {
    question:'minigame.laserChallenge.statement',
    pages:[
      { heading:'tutorial.twoPage.laser.pages.1.heading', lines:[
        'tutorial.twoPage.laser.pages.1.lines.1',
        'tutorial.twoPage.laser.pages.1.lines.2',
      ] },
      { heading:'tutorial.twoPage.laser.pages.2.heading', lines:[
        'tutorial.twoPage.laser.pages.2.lines.1',
        'tutorial.twoPage.laser.pages.2.lines.2',
      ] },
    ], choices:[
      'tutorial.twoPage.laser.choices.1', 'tutorial.twoPage.laser.choices.2',
      'tutorial.twoPage.laser.choices.3', 'tutorial.twoPage.laser.choices.4',
    ], command:'!1', correctIndex:0,
  },
  'guess-movie': {
    question:'tutorial.twoPage.guess.movie.question',
    pages:[
      {heading:'tutorial.twoPage.guess.movie.pages.1.heading',lines:[
        'tutorial.twoPage.guess.movie.pages.1.lines.1',
        'tutorial.twoPage.guess.movie.pages.1.lines.2',
      ]},
      {heading:'tutorial.twoPage.guess.movie.pages.2.heading',lines:[
        'tutorial.twoPage.guess.movie.pages.2.lines.1',
        'tutorial.twoPage.guess.movie.pages.2.lines.2',
      ]},
    ],choices:['tutorial.twoPage.guess.movie.choices.1', 'tutorial.twoPage.guess.movie.choices.2', 'tutorial.twoPage.guess.movie.choices.3', 'tutorial.twoPage.guess.movie.choices.4'],command:'!1',correctIndex:0,
  },
  'guess-star': {
    question:'tutorial.twoPage.guess.star.question',
    pages:[
      {heading:'tutorial.twoPage.guess.star.pages.1.heading',lines:[
        'tutorial.twoPage.guess.star.pages.1.lines.1',
        'tutorial.twoPage.guess.star.pages.1.lines.2',
      ]},
      {heading:'tutorial.twoPage.guess.star.pages.2.heading',lines:[
        'tutorial.twoPage.guess.star.pages.2.lines.1',
        'tutorial.twoPage.guess.star.pages.2.lines.2',
      ]},
    ],choices:['tutorial.twoPage.guess.star.choices.1', 'tutorial.twoPage.guess.star.choices.2', 'tutorial.twoPage.guess.star.choices.3', 'tutorial.twoPage.guess.star.choices.4'],command:'!3',correctIndex:2,
  },
  'memory-count': {
    question:'tutorial.twoPage.memory.count.question',
    pages:[
      {heading:'tutorial.twoPage.memory.count.pages.1.heading',lines:[
        'tutorial.twoPage.memory.count.pages.1.lines.1',
        'tutorial.twoPage.memory.count.pages.1.lines.2',
      ]},
      {heading:'tutorial.twoPage.memory.count.pages.2.heading',lines:[
        'tutorial.twoPage.memory.count.pages.2.lines.1',
        'tutorial.twoPage.memory.count.pages.2.lines.2',
      ],note:'tutorial.twoPage.memory.count.pages.2.note'},
    ],choices:['tutorial.twoPage.memory.count.choices.1', 'tutorial.twoPage.memory.count.choices.2', 'tutorial.twoPage.memory.count.choices.3', 'tutorial.twoPage.memory.count.choices.4'],command:'!3',correctIndex:2,
  },
  'couple-or-siblings': {
    question:'tutorial.twoPage.couple.or.siblings.question',
    pages:[
      {heading:'tutorial.twoPage.couple.or.siblings.pages.1.heading',lines:[
        'tutorial.twoPage.couple.or.siblings.pages.1.lines.1',
        'tutorial.twoPage.couple.or.siblings.pages.1.lines.2',
      ]},
      {heading:'tutorial.twoPage.couple.or.siblings.pages.2.heading',lines:[
        'tutorial.twoPage.couple.or.siblings.pages.2.lines.1',
        'tutorial.twoPage.couple.or.siblings.pages.2.lines.2',
      ]},
    ],choices:['pair.answer.couple', 'pair.answer.siblings'],command:'!2',correctIndex:1,
  },
};

const GAME_NAMES: Record<Exclude<MiniGameId,'food-origin'>, Copy> = {
  'shape-count': 'tutorial.name.shape.count',
  'maze-gates': 'tutorial.name.maze.gates',
  'count-the-beat': 'minigame.countTheBeat.title',
  'lucky-cup': 'tutorial.name.lucky.cup',
  'laser-challenge': 'minigame.laserChallenge.title',
  'guess-movie': 'minigame.guessMovie.title',
  'guess-star': 'tutorial.name.guess.star',
  'memory-count': 'tutorial.name.memory.count',
  'couple-or-siblings': 'tutorial.name.couple.or.siblings',
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
        <MediaCard imageUrl={second ? MEDIA.face : MEDIA.eyes} altText={translate(locale, 'tutorial.twoPage.star.photoAlt')} objectFit="contain" />
        {second ? <span className="howto-v72-reveal-badge">✓ {translate(locale, 'tutorial.twoPage.star.hostReveal')}</span> : null}
      </div>;
    case 'guess-movie':
      return <div className={`howto-v72-clue howto-v72-poster ${second ? 'is-clear' : ''}`}>
        <MediaCard imageUrl={MEDIA.poster} altText={translate(locale, 'tutorial.twoPage.movie.posterAlt')} objectFit="contain" />
        <PosterPuzzleOverlay plan={null} titleMasks={samplePosterMasks} progress={second ? 1 : .32} difficulty="medium" />
        <span className="howto-v72-media-type">{translate(locale, 'tutorial.twoPage.movie.posterExample')}</span>
      </div>;
    case 'couple-or-siblings':
      return <div className="howto-v72-clue howto-v72-pair"><MediaCard imageUrl={MEDIA.pair} altText="" objectFit="contain" /></div>;
    case 'shape-count':
      return <div className="howto-v72-clue gameplay-shape-stage"><div className="gameplay-shape-grid howto-v72-shapes" style={{gridTemplateColumns:'repeat(4,minmax(0,1fr))'}}>
        {SHAPES.map((shape, index) => <span className={`v38-shape-tile ${second && shape === 'circle' ? 'v38-shape-hit' : ''}`} key={index}><ShapeMark shape={shape}/></span>)}
      </div></div>;
    case 'maze-gates':
      return <div className="howto-v72-clue howto-v72-maze gameplay-maze-stage">
        <svg className="gameplay-maze-svg" viewBox="0 0 720 390" role="img" aria-label={translate(locale, 'tutorial.twoPage.maze.exampleAria')}>
          <rect x="34" y="28" width="652" height="332" rx="26" className="gameplay-maze-board" />
          <g className="gameplay-maze-grid">{Array.from({length:9},(_,i)=><path key={i} d={`M${106+i*64} 58 V330`}/>)}</g>
          <g className="gameplay-maze-exit-svg"><rect x="320" y="20" width="80" height="30" rx="15"/><text x="360" y="40" textAnchor="middle">{translate(locale, 'tutorial.shared.exit')}</text></g>
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
        <div className="ctb-target-bar"><span className="ctb-target-glyph"><BeatIcon icon="note" /></span><span className="ctb-target-name">{translate(locale, 'tutorial.twoPage.beat.targetNote')}</span></div>
        <div className="ctb-stage ctb-stage-1-lanes">
          {!second ? <BeatStageLanes rows={1} /> : null}
          {second ? <div className="ctb-answer-turn"><div className="ctb-answer-turn-card"><strong>{translate(locale, 'ui.countTheBeatScreen.answerNow')}</strong><small>{translate(locale, 'ui.countTheBeatScreen.typeCount')}</small></div></div>
            : <div className="howto-v72-beat-items"><span style={{color:'#f0f8ff'}}><BeatIcon icon="note" /></span></div>}
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
        <small>{second ? (translate(locale, 'tutorial.twoPage.cups.sendPosition')) : (translate(locale, 'tutorial.twoPage.cups.followBall'))}</small>
      </div>;
    case 'memory-count':
      return <div className="howto-v72-clue howto-v72-memory">
        {second ? <div className="v35-memory-query"><span className="v35-memory-query-icon">🍎</span><strong>?</strong><small>{translate(locale, 'tutorial.twoPage.memory.countApples')}</small></div>
          : <div className="gameplay-memory-grid v35-memory-grid">{['🍎','🍋','🍎','🍇','🍎','🍋'].map((v,i)=><span className="gameplay-memory-item" key={i}>{v}</span>)}</div>}
      </div>;
  }
}

function ExampleChat({ locale, command }: { locale: Lang; command: string }) {
  return <div className="howto-v71-chat howto-v72-chat">
    <span>{translate(locale, 'tutorial.twoPage.chat.typeCommand')}</span>
    <div className="howto-v71-chat-input" dir="ltr"><span>{translate(locale, 'tutorial.common.chat')}</span><strong>{command}</strong><b aria-hidden="true">➜</b></div>
    <small>{translate(locale, 'tutorial.twoPage.chat.help')}</small>
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
      setPage(current=>Math.min(1,Math.max(0,current+(event.key===((rtl ? 'ArrowLeft' : 'ArrowRight'))?1:-1))));
    };
    window.addEventListener('keydown',onKey);
    return ()=>window.removeEventListener('keydown',onKey);
  },[rtl]);

  const local = (copyKey: TranslationKey) => translate(locale, copyKey);
  const labels = lesson.choices.map(local);
  const hasCards = labels.length > 0;
  const numberOnly = gameId === 'maze-gates'||gameId === 'count-the-beat';
  const isPostReveal = second && ['guess-star','shape-count','maze-gates','laser-challenge'].includes(gameId);
  const timerLabel = gameId === 'count-the-beat' && !second ? translate(locale, 'ui.countTheBeatScreen.watchAndCount')
    : isPostReveal ? '0s' : second && gameId === 'guess-movie' ? '1s' : second ? '20s' : '18s';
  const useShapeCards = gameId==='shape-count';
  const sampleDisplayQuestion = gameId==='memory-count' && second
    ? (translate(locale, 'tutorial.twoPage.memory.questionApples')) : local(lesson.question);
  return <section className={`howto-v71 howto-v71-food howto-v72 howto-v72-${gameId}`} dir={(rtl ? 'rtl' : 'ltr')} aria-label={translate(locale, 'tutorial.twoPage.aria.section')}>
    <div className="howto-v71-main">
      <div className="howto-v71-preview" aria-label={translate(locale, 'tutorial.twoPage.aria.preview')}>
        <img className="howto-v71-background" src={STAGE} alt="" aria-hidden="true" draggable={false} />
        <div className={`howto-v71-board howto-v72-board ${numberOnly ? 'howto-v72-no-choices' : ''}`}>
          <div className="howto-v71-question-meta">
            <strong className="qshell-game-name">{local(GAME_NAMES[gameId])}</strong>
            <div className="gameplay-question-meta"><span>{translate(locale, 'tutorial.twoPage.sample.questionOne')}</span></div>
          </div>
          <div className="gameplay-question-timer howto-v71-timer" role="timer" aria-label={translate(locale, 'tutorial.twoPage.sample.timerAria')}>
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
              resultState={second && isPostReveal && lesson.correctIndex===index ? 'correct':'pending'} answerCountAriaLabel={translate(locale, 'tutorial.twoPage.sample.answerCountAria')}/>)}
          </div>:<div className="howto-v72-numeric-footer" aria-hidden="true">{translate(locale, 'tutorial.twoPage.chat.sendNumber')}</div>}
        </div>
      </div>
      <aside className="howto-v71-info" dir={(rtl ? 'rtl' : 'ltr')} aria-live="polite" aria-atomic="true">
        <div className="howto-v71-guide howto-v72-guide">
          <h3>{local(current.heading)}</h3>
          <p>{local(current.lines[0])}</p>
          <p>{local(current.lines[1])}</p>
          {second ? <ExampleChat locale={locale} command={lesson.command}/> : null}
          {second&&current.note ? <small className="howto-v72-note">{local(current.note)}</small>:null}
        </div>
      </aside>
    </div>
    <footer className="howto-v71-footer">
      <button className="howto-v71-skip" type="button" onClick={onStart}>{translate(locale, 'tutorial.twoPage.nav.skip')}</button>
      <div className="howto-v71-controls">
        <button className="howto-v71-back" type="button" disabled={!second} onClick={()=>setPage(0)}><span aria-hidden="true">{(rtl ? '→' : '←')}</span>{translate(locale, 'tutorial.twoPage.nav.back')}</button>
        <span className="howto-v71-pagenum" dir="ltr">{page+1} / 2</span>
        <button className="howto-v71-next" type="button" onClick={()=>second?onStart():setPage(1)}>{second?(translate(locale, 'tutorial.twoPage.nav.play')):(translate(locale, 'tutorial.twoPage.nav.next'))} <span aria-hidden="true">{(rtl ? '←' : '→')}</span></button>
      </div>
    </footer>
  </section>;
}
