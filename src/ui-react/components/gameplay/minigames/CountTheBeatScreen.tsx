import type { CSSProperties } from 'react';
import { useGame } from '../../../context/GameContext';
import { useCountBeatAudio } from '../../audio/useGameplayCue';
import type { MiniGameSnapshot, CountTheBeatItemSnapshot } from '../../../../game-core/minigames/minigame-types';
import type { TourPhase } from '../../../../game-core/tours/tour-types';
import { useTranslation } from '../../../i18n/useTranslation';
import { getPhaseHelper } from '../shared/overlay-types';
import { QuestionScreenShell } from '../shared/question-shell';
import { BeatIcon } from './BeatIcon';

const TONE_COLOUR: Record<string, string> = {
  cyan: '#22e7ff',
  pink: '#ff4be7',
  yellow: '#ffe246',
  purple: '#a855f7',
  green: '#36e8a0',
};

function BeatItem({ item, paused, elapsedMs }: { item: CountTheBeatItemSnapshot; paused: boolean; elapsedMs: number }) {
  const colour = TONE_COLOUR[item.tone] ?? TONE_COLOUR.cyan;
  const style: CSSProperties & { '--ctb-rotate': string; '--v38-delay': string; '--v38-duration': string } = {
    position: 'absolute',
    left: `${item.x}%`,
    top: `${item.y}%`,
    fontSize: `${item.size * 2.4}rem`,
    color: colour,
    '--ctb-rotate': `${item.rotate}deg`,
    '--v38-duration': `${item.durationMs}ms`,
    '--v38-delay': `${item.delayMs - elapsedMs}ms`,
    // Never mix the animation shorthand with animationPlayState: React 19
    // warns on rerender and the shorthand can reset the paused state.
    animationName: 'ctb-pop',
    animationDuration: `${item.durationMs}ms`,
    animationTimingFunction: 'ease-in-out',
    animationDelay: `${item.delayMs - elapsedMs}ms`,
    animationFillMode: 'both',
    animationPlayState: paused ? 'paused' : 'running',
    filter: item.isTarget
      ? `drop-shadow(0 0 8px ${colour}) drop-shadow(0 0 14px ${colour}88)`
      : `drop-shadow(0 0 4px ${colour}66)`,
    opacity: 0, // Keyframes explicitly animate from/to 0; no flashing before delay.
    userSelect: 'none',
    pointerEvents: 'none',
    lineHeight: 1,
  };

  return <span style={style} aria-hidden="true"><BeatIcon icon={item.icon} /></span>;
}

export function CountTheBeatScreen({ miniGame, tourPhase }: { miniGame: MiniGameSnapshot; tourPhase: TourPhase }) {
  const t = useTranslation();
  const { snapshot } = useGame();
  const beat = miniGame.countTheBeat;

  // Hooks must run even if the round is briefly absent during a scene change.
  const isPlaying = tourPhase === 'answer_window_open' && Boolean(beat);
  const remainingMs = snapshot.tour.isPaused || snapshot.tour.phaseEndsAt === null
    ? snapshot.tour.phaseRemainingMs
    : Math.max(0, snapshot.tour.phaseEndsAt - Date.now());
  const elapsedMs = isPlaying ? Math.max(0, snapshot.tour.phaseDurationMs - remainingMs) : 0;
  useCountBeatAudio({
    enabled: isPlaying,
    paused: snapshot.tour.isPaused,
    bpm: beat?.bpm ?? 108,
    questionId: miniGame.questionId,
    elapsedMs,
    totalBeats: beat ? Math.floor(Math.max(...beat.items.map((item) => item.delayMs), 0) / (60000 / beat.bpm)) + 1 : 0,
  });

  if (!beat) {
    return <p className="gameplay-empty-round">{t('gameplay.empty.countTheBeat')}</p>;
  }
  const isRevealed = tourPhase === 'scoring' && beat.targetCount !== null;
  const helperText = getPhaseHelper(tourPhase, t);
  // A single short prompt. The target symbol is displayed on the playfield;
  // don't repeat scoring rules, chat syntax and question text in three places.
  const displayedMiniGame = {
    ...miniGame,
    statement: snapshot.locale === 'ar' ? 'عدّ الرمز ده' : 'Count this symbol',
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

        <div className={`ctb-stage ${isPlaying ? 'ctb-stage-active' : ''}`} aria-label={t('gameplay.countTheBeat.countEvery')}>
          {isPlaying ? <span className="ctb-beat-pulse" style={{ animationDuration: `${60 / beat.bpm}s`, animationDelay: `${-elapsedMs}ms`, animationPlayState: snapshot.tour.isPaused ? 'paused' : 'running' }} aria-hidden="true" /> : null}
          {isPlaying ? beat.items.map((item) => (
            <BeatItem key={item.id} item={item} paused={snapshot.tour.isPaused} elapsedMs={elapsedMs} />
          )) : null}
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
