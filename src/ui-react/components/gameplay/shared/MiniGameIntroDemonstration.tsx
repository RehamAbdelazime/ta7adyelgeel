import { useEffect, useState, type CSSProperties } from 'react';
import type { MiniGameId } from '../../../../game-core/minigames/minigame-registry';
import { translate } from '../../../../game-core/localization/translations';
import { FoodOriginHintPill } from '../minigames/FoodOriginHintPill';
import { AllGamesTwoPageIntro } from './AllGamesTwoPageIntro';
import { MediaCard, ChoiceCard } from './question-shell';

/** Only the active two-page tutorials remain. The retired V68 walkthrough,
 * duplicated game examples and their unused assets were removed in V81. */
const MEDIA = './assets/game/runtime/minigames/';
const SHOTS = `${MEDIA}HowTo/`;
const FOOD = `${MEDIA}food-origin/photos/carbonara_italy.jpg`;

export function MiniGameIntroDemonstration(props: {
  gameId: MiniGameId;
  locale: 'ar' | 'en';
  onStart: () => void;
}) {
  return props.gameId === 'food-origin'
    ? <FoodOriginTwoPageIntro locale={props.locale} onStart={props.onStart} />
    : <AllGamesTwoPageIntro gameId={props.gameId} locale={props.locale} onStart={props.onStart} />;
}


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

  const countries = [
    'tutorial.food.country.italy', 'tutorial.food.country.greece',
    'tutorial.food.country.france', 'tutorial.food.country.turkiye',
  ] as const;
  const localizedCountries = countries.map(country => translate(locale, country));
  // This matches FoodOriginScreen's label contract, including countdown form.
  const hintLabel = hintShown
    ? (translate(locale, 'food.dish.carbonara'))
    : (translate(locale, 'tutorial.food.hint.countdownNineSeconds'));

  return (
    <section className="howto-v71 howto-v71-food" dir={(rtl ? 'rtl' : 'ltr')} aria-label={translate(locale, 'tutorial.food.aria.section')}>
      <div className="howto-v71-main">
        <div className="howto-v71-preview" aria-label={translate(locale, 'tutorial.food.aria.preview')}>
          <img className="howto-v71-background" src={`${SHOTS}stage-quote.webp`} alt="" aria-hidden="true" draggable={false} />
          <div className="howto-v71-board">
            <div className="howto-v71-question-meta">
              <strong className="qshell-game-name">{translate(locale, 'tutorial.food.sample.gameName')}</strong>
              <div className="gameplay-question-meta"><span>{translate(locale, 'tutorial.food.sample.questionOne')}</span></div>
            </div>
            <div className="gameplay-question-timer howto-v71-timer" role="timer" aria-label={translate(locale, 'tutorial.food.sample.timerAria')}>
              <i className="gameplay-question-timer-icon" aria-hidden="true" />
              <div className="gameplay-question-timer-track"><span className="gameplay-question-timer-fill"
                style={{ '--timer-progress': hintShown ? '50%' : '100%', '--timer-scale': hintShown ? '.5' : '1' } as CSSProperties} /></div>
              <strong>{hintShown ? '9s' : '18s'}</strong>
            </div>
            <h3 className="qshell-title howto-v71-question">{translate(locale, 'tutorial.food.sample.originQuestion')}</h3>
            <div className="howto-v71-media">
              <MediaCard imageUrl={FOOD} altText={translate(locale, 'tutorial.food.sample.carbonaraAlt')}
                caption={<FoodOriginHintPill label={hintLabel} revealed={hintShown} />} />
            </div>
            <div className="howto-v71-choices" dir="ltr">
              {localizedCountries.map((name, index) =>
                <ChoiceCard key={name} command={`!${index + 1}`} label={name} tone="cyan" isOpen answerCount={0}
                  answerCountAriaLabel={translate(locale, 'tutorial.food.sample.answerCountAria')} />)}
            </div>
          </div>
        </div>

        <aside className="howto-v71-info" dir={(rtl ? 'rtl' : 'ltr')} aria-live="polite" aria-atomic="true">
          <div className="howto-v71-guide">
            <h3>{hintShown ? (translate(locale, 'tutorial.food.guide.timingHeading')) : (translate(locale, 'minigame.foodOrigin.note'))}</h3>
            {hintShown ? <>
              <p>{translate(locale, 'tutorial.food.guide.answerBeforeTimer')}</p>
              <p>{translate(locale, 'tutorial.food.guide.hintAtHalfTime')}</p>
              <div className="howto-v71-score" aria-label={translate(locale, 'tutorial.food.guide.pointsAria')}>
                <div><small>{translate(locale, 'tutorial.food.guide.beforeHint')}</small><strong>{translate(locale, 'tutorial.food.guide.fullPoints')}</strong></div>
                <div><small>{translate(locale, 'tutorial.food.guide.afterHint')}</small><strong>{translate(locale, 'tutorial.food.guide.halfPoints')}</strong></div>
              </div>
              <small className="howto-v71-note">{translate(locale, 'tutorial.food.guide.correctAnswersOnly')}</small>
            </> : <>
              <p>{translate(locale, 'tutorial.food.guide.guessCountry')}</p>
              <p>{translate(locale, 'tutorial.food.guide.fourChoices')}</p>
              <div className="howto-v71-chat">
                <span>{translate(locale, 'tutorial.food.chat.typeCommand')}</span>
                <div className="howto-v71-chat-input" dir="ltr"><span>{translate(locale, 'tutorial.common.chat')}</span><strong>!1</strong><b aria-hidden="true">➜</b></div>
                <small>{translate(locale, 'tutorial.food.chat.exampleOne')}</small>
              </div>
            </>}
          </div>
        </aside>
      </div>
      <footer className="howto-v71-footer">
        <button className="howto-v71-skip" type="button" onClick={onStart}>{translate(locale, 'tutorial.food.nav.skip')}</button>
        <div className="howto-v71-controls">
          <button type="button" className="howto-v71-back" onClick={() => setPage(0)} disabled={!hintShown}>
            <span aria-hidden="true">{(rtl ? '→' : '←')}</span>{translate(locale, 'tutorial.food.nav.back')}
          </button>
          <span className="howto-v71-pagenum" dir="ltr">{page + 1} / 2</span>
          <button type="button" className="howto-v71-next" onClick={() => hintShown ? onStart() : setPage(1)}>
            {hintShown ? (translate(locale, 'tutorial.food.nav.play')) : (translate(locale, 'tutorial.food.nav.next'))}
            <span aria-hidden="true">{(rtl ? '←' : '→')}</span>
          </button>
        </div>
      </footer>
    </section>
  );
}
