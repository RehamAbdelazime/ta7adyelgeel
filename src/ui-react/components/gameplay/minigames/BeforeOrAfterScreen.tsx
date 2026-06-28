import type { MiniGameSnapshot } from '../../../../game-core/minigames/minigame-types';
import type { TourPhase } from '../../../../game-core/tours/tour-types';
import { useTranslation } from '../../../i18n/useTranslation';
import { getPhaseHelper, type ChoiceTone } from '../shared/overlay-types';
import { QuestionScreenShell } from '../shared/question-shell';

export function BeforeOrAfterScreen({ miniGame, tourPhase }: { miniGame: MiniGameSnapshot; tourPhase: TourPhase }) {
  const t = useTranslation();
  const beforeAfter = miniGame.beforeOrAfter;

  if (!beforeAfter) {
    return <p className="gameplay-empty-round">{t('minigame.beforeAfter.title')}</p>;
  }

  const helperText = miniGame.acceptsAnswers
    ? t('minigame.beforeAfter.answerWindowOpen')
    : beforeAfter.correctLabel
      ? t('minigame.beforeAfter.resultFeed', {
          answer: beforeAfter.correctLabel,
          official: String(miniGame.correctOfficialCount),
          spectator: String(miniGame.correctSpectatorCount),
        })
      : getPhaseHelper(tourPhase, t);

  const choices = beforeAfter.choices.map((choice, index) => ({
    command: choice.command,
    label: choice.label,
    tone: (index === 0 ? 'cyan' : 'pink') as ChoiceTone,
  }));

  return (
    <QuestionScreenShell
      miniGame={miniGame}
      tourPhase={tourPhase}
      helperText={helperText}
      choices={choices}
      bodyClassName="gameplay-question-body-before-after"
    >
      <div
        className="gameplay-before-after-board"
        style={{
          width: '100%',
          height: '100%',
          display: 'grid',
          gridTemplateRows: 'auto 1fr',
          gap: 'clamp(14px, 1.4vh, 24px)',
          minHeight: 0,
        }}
      >
        <div
          className="gameplay-before-after-kicker"
          style={{
            justifySelf: 'center',
            alignSelf: 'start',
            border: '1px solid rgba(255, 230, 109, 0.62)',
            borderRadius: '999px',
            padding: 'clamp(8px, .8vh, 12px) clamp(20px, 1.6vw, 34px)',
            background: 'rgba(20, 13, 45, .72)',
            color: '#ffe66d',
            fontWeight: 900,
            fontSize: 'clamp(16px, 1.2vw, 24px)',
            boxShadow: '0 0 22px rgba(255, 230, 109, .16)',
          }}
        >
          {beforeAfter.categoryLabel}
        </div>
        <div
          className="gameplay-before-after-options"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'stretch',
            gap: 'clamp(14px, 1.5vw, 28px)',
            minHeight: 0,
          }}
        >
          {beforeAfter.choices.map((choice, index) => {
            const isCorrect = beforeAfter.correctOptionNumber === choice.optionNumber;
            return (
              <div
                key={`${choice.command}-${choice.value}`}
                className={`gameplay-before-after-card gameplay-before-after-card-${index + 1} ${isCorrect ? 'gameplay-before-after-card-correct' : ''}`}
                style={{
                  minWidth: 0,
                  minHeight: 0,
                  display: 'grid',
                  gridTemplateRows: 'auto 1fr',
                  alignItems: 'center',
                  justifyItems: 'center',
                  padding: 'clamp(18px, 2vw, 34px)',
                  borderRadius: 'clamp(20px, 1.4vw, 30px)',
                  border: isCorrect ? '2px solid rgba(92,255,177,.92)' : '1px solid rgba(34,231,255,.42)',
                  background: index === 0
                    ? 'linear-gradient(135deg, rgba(0, 186, 255, .17), rgba(22, 9, 51, .86))'
                    : 'linear-gradient(135deg, rgba(255, 94, 219, .16), rgba(22, 9, 51, .86))',
                  boxShadow: isCorrect
                    ? '0 0 34px rgba(92,255,177,.28), inset 0 0 26px rgba(92,255,177,.10)'
                    : '0 0 34px rgba(0,0,0,.42), inset 0 0 30px rgba(0,0,0,.28)',
                  overflow: 'hidden',
                  gridColumn: index === 0 ? 1 : 3,
                  gridRow: 1,
                }}
              >
                <b
                  dir="ltr"
                  style={{
                    borderRadius: '16px',
                    border: '1px solid rgba(255,255,255,.20)',
                    background: 'rgba(255,255,255,.08)',
                    color: '#ffffff',
                    padding: 'clamp(8px, .75vh, 12px) clamp(12px, 1vw, 18px)',
                    fontSize: 'clamp(20px, 1.7vw, 34px)',
                    lineHeight: 1,
                  }}
                >
                  <bdi>{choice.command}</bdi>
                </b>
                <strong
                  dir="auto"
                  style={{
                    color: '#fff',
                    textAlign: 'center',
                    fontSize: 'clamp(34px, 3vw, 66px)',
                    lineHeight: 1.1,
                    textShadow: '0 6px 0 rgba(0,0,0,.44), 0 0 28px rgba(255,255,255,.18)',
                    wordBreak: 'break-word',
                  }}
                >
                  {choice.label}
                </strong>
              </div>
            );
          })}
          <div
            aria-hidden="true"
            className="gameplay-before-after-divider"
            style={{
              alignSelf: 'center',
              justifySelf: 'center',
              width: 'clamp(56px, 4.2vw, 86px)',
              height: 'clamp(56px, 4.2vw, 86px)',
              borderRadius: '999px',
              display: 'grid',
              placeItems: 'center',
              border: '1px solid rgba(255,230,109,.62)',
              color: '#ffe66d',
              fontWeight: 900,
              fontSize: 'clamp(24px, 2vw, 42px)',
              background: 'radial-gradient(circle, rgba(255,230,109,.16), rgba(20,10,45,.88))',
              boxShadow: '0 0 26px rgba(255,230,109,.22)',
              gridColumn: 2,
              gridRow: 1,
            }}
          >
            ↔
          </div>
        </div>
      </div>
    </QuestionScreenShell>
  );
}
