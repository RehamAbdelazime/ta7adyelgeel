import { translate } from '../../../../game-core/localization/translations';
import { useEffect, useState, type CSSProperties } from 'react';
import { useGame } from '../../../context/GameContext';
import { useCountBeatAudio } from '../../audio/useGameplayCue';
import type { MiniGameSnapshot, CountTheBeatItemSnapshot } from '../../../../game-core/minigames/minigame-types';
import type { TourPhase } from '../../../../game-core/tours/tour-types';
import { useTranslation } from '../../../i18n/useTranslation';
import { getPhaseHelper } from '../shared/overlay-types';
import { QuestionScreenShell } from '../shared/question-shell';
import { BeatIcon } from './BeatIcon';
import { BeatStageLanes } from './BeatStageLanes';

// All moving symbols are neutral white: color must NEVER help solve the count.
const BEAT_COLOUR = '#f0f8ff';

function BeatItem({ item, paused, elapsedMs }: { item: CountTheBeatItemSnapshot; paused: boolean; elapsedMs: number }) {
  // Capture the initial negative-delay correction ONCE. Recomputing animationDelay
  // every render was restarting CSS animations as the game timer updated.
  // Pause/resume is handled only with animationPlayState.
  const [startDelay] = useState(() => item.delayMs - elapsedMs);
  const style: CSSProperties & { '--ctb-rotate': string; '--v38-delay': string; '--v38-duration': string } = {
    position: 'absolute',
    left: `${item.x}%`,
    top: `${item.y}%`,
    fontSize: 'var(--ctb-icon-size)',
    color: BEAT_COLOUR,
    '--ctb-rotate': `${item.rotate}deg`,
    '--v38-duration': `${item.durationMs}ms`,
    '--v38-delay': `${startDelay}ms`,
    // Never mix the animation shorthand with animationPlayState: React 19
    // warns on rerender and the shorthand can reset the paused state.
    animationName: 'ctb-pop',
    animationDuration: `${item.durationMs}ms`,
    animationTimingFunction: 'ease-in-out',
    animationDelay: `${startDelay}ms`,
    animationFillMode: 'both',
    animationPlayState: paused ? 'paused' : 'running',
    filter: 'drop-shadow(0 0 10px rgba(175,228,255,.48))',
    opacity: 0, // Keyframes explicitly animate from/to 0; no flashing before delay.
    userSelect: 'none',
    pointerEvents: 'none',
    lineHeight: 1,
  };

  return <span className="ctb-beat-item" style={style} aria-hidden="true"><BeatIcon icon={item.icon} /></span>;
}

export function CountTheBeatScreen({ miniGame, tourPhase }: { miniGame: MiniGameSnapshot; tourPhase: TourPhase }) {
  const t = useTranslation();
  const { snapshot } = useGame();
  const beat = miniGame.countTheBeat;
  const [clockMs, setClockMs] = useState(() => Date.now());
  const isPlaying = tourPhase === 'tour_starting' && Boolean(beat);
  const paused = snapshot.tour.isPaused;
  useEffect(() => {
    if (!isPlaying || paused) return undefined;
    setClockMs(Date.now());
    const timer = window.setInterval(() => setClockMs(Date.now()), 125);
    return () => window.clearInterval(timer);
  }, [isPlaying, paused, miniGame.questionId]);

  // Hooks must run even if the round is briefly absent during a scene change.
  const remainingMs = snapshot.tour.isPaused || snapshot.tour.phaseEndsAt === null
    ? snapshot.tour.phaseRemainingMs
    : Math.max(0, snapshot.tour.phaseEndsAt - clockMs);
  const elapsedMs = isPlaying ? Math.max(0, snapshot.tour.phaseDurationMs - remainingMs) : 0;
  useCountBeatAudio({
    enabled: isPlaying,
    paused: snapshot.tour.isPaused,
    questionId: miniGame.questionId,
    elapsedMs,
    items: beat?.items ?? [], // same accelerating timeline as the visual symbols
  });

  if (!beat) {
    return <p className="gameplay-empty-round">{t('gameplay.empty.countTheBeat')}</p>;
  }
  const isRevealed = tourPhase === 'scoring' && beat.targetCount !== null;
  // Only the real answer phase unlocks chat; preview never accepts answers.
  const canAnswerNow = tourPhase === 'answer_window_open';
  const helperText = getPhaseHelper(tourPhase, t);
  // A single short prompt. The target symbol is displayed on the playfield;
  // don't repeat scoring rules, chat syntax and question text in three places.
  const displayedMiniGame = {
    ...miniGame,
    statement: canAnswerNow
      ? translate(snapshot.locale, 'ui.countTheBeatScreen.howManyTimes')
      : translate(snapshot.locale, 'ui.countTheBeatScreen.countSymbol'),
  };

  return (
    <QuestionScreenShell
      miniGame={displayedMiniGame}
      tourPhase={tourPhase}
      layout="focus"
      helperText={helperText}
      choices={[]}
      isAnswerReveal={isRevealed}
      correctAnswerText={beat.targetCount === null ? '-' : String(beat.targetCount)}
      bodyClassName="gameplay-question-body-count-the-beat"
    >
      <div className="ctb-shell">
        <div className="ctb-target-bar" aria-label={beat.targetLabel}>
          <span className="ctb-target-glyph" aria-hidden="true"><BeatIcon icon={beat.targetIcon} /></span>
          <span className="ctb-target-name">{beat.targetLabel}</span>
        </div>

        <div className={`ctb-stage ctb-stage-${beat.lanes}-lanes ${isPlaying ? 'ctb-stage-active' : ''}`} aria-label={t('gameplay.countTheBeat.countEvery')}>
          {isPlaying ? <BeatStageLanes rows={beat.lanes} /> : null}
          {isPlaying ? beat.items.map((item) => (
            <BeatItem key={`${miniGame.questionId}-${item.id}`} item={item} paused={paused} elapsedMs={elapsedMs} />
          )) : null}
          {canAnswerNow ? (
            <div className="ctb-answer-turn" role="status" aria-live="polite">
              <div className="ctb-answer-turn-card">
                <span className="ctb-answer-turn-ready" aria-hidden="true">✓</span>
                <strong>{translate(snapshot.locale, 'ui.countTheBeatScreen.answerNow')}</strong>
                <small>{translate(snapshot.locale, 'ui.countTheBeatScreen.typeCount')}</small>
              </div>
            </div>
          ) : null}
          {isRevealed ? (
            <div className="ctb-reveal-overlay" role="status">
              <span className="ctb-reveal-glyph"><BeatIcon icon={beat.targetIcon} /></span>
              <strong className="ctb-reveal-count">{beat.targetCount}</strong>
            </div>
          ) : null}
        </div>

      </div>
    </QuestionScreenShell>
  );
}
