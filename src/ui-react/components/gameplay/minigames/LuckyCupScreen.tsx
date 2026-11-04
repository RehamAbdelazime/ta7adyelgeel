import { useEffect, useState, type CSSProperties } from 'react';
import type { MiniGameSnapshot, LuckyCupSnapshot } from '../../../../game-core/minigames/minigame-types';
import {
  LUCKY_CUP_OPEN_HOLD_MS,
  LUCKY_CUP_SHUFFLE_START_MS,
  getLuckyCupInitialLift,
  getLuckyCupMotion,
  getLuckyCupOrder,
} from '../../../../game-core/minigames/lucky-cup/lucky-cup-motion';
import type { TourPhase, TourSnapshot } from '../../../../game-core/tours/tour-types';
import { useGame } from '../../../context/GameContext';
import { QuestionScreenShell } from '../shared/question-shell';
import { useLuckyCupRevealCue } from '../../audio/useGameplayCue';

// Relative to Vite's base (./ in packaged Electron), not filesystem root.
const CUP_URL = `${import.meta.env.BASE_URL}assets/game/runtime/minigames/lucky-cup/cup.png`;
const BALL_URL = `${import.meta.env.BASE_URL}assets/game/runtime/minigames/lucky-cup/ball.png`;
const LABELS = {
  ar: { left: 'شمال', center: 'وسط', right: 'يمين' },
  en: { left: 'LEFT', center: 'CENTER', right: 'RIGHT' },
} as const;

/**
 * Only this visual field updates at screen refresh (requestAnimationFrame);
 * the shared header, timer and HUD
 * stay mounted. Timeline time is taken from Tour's phaseEndsAt (pause-aware),
 * never from a local animation start date that could drift after remounts.
 */
function LuckyCupPlayfield({
  plan, phase, tour, locale,
}: {
  plan: LuckyCupSnapshot;
  phase: TourPhase;
  tour: TourSnapshot;
  locale: 'ar' | 'en';
}) {
  const isShuffling = phase === 'tour_starting';
  const isReveal = phase === 'scoring';
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!isShuffling) {
      setElapsed(0);
      return undefined;
    }
    const update = () => {
      const remaining = tour.isPaused
        ? tour.phaseRemainingMs
        : tour.phaseEndsAt !== null
          ? Math.max(0, tour.phaseEndsAt - Date.now())
          : tour.phaseRemainingMs;
      setElapsed(Math.max(0, tour.phaseDurationMs - remaining));
    };
    let animationFrame = 0;
    const tick = () => {
      update();
      animationFrame = window.requestAnimationFrame(tick);
    };
    tick();
    return () => window.cancelAnimationFrame(animationFrame);
  }, [isShuffling, tour.phaseDurationMs, tour.phaseEndsAt, tour.isPaused, tour.isPaused ? tour.phaseRemainingMs : null]);

  const allMotion = getLuckyCupMotion(plan.swaps, isShuffling ? elapsed : Number.POSITIVE_INFINITY);
  const order = getLuckyCupOrder(plan.swaps);
  const correctSlot = order.indexOf(plan.initialBallCupId);
  const initialLift = isShuffling ? getLuckyCupInitialLift(elapsed) : 0;
  const showInitialBall = isShuffling && elapsed < LUCKY_CUP_SHUFFLE_START_MS && initialLift > 0.65;
  const visibleBallSlot = isReveal ? correctSlot : showInitialBall ? plan.initialBallCupId : -1;
  // The question exists once in the shared heading. A second question
  // floating over the cups steals attention precisely during the shuffle.
  const phasePrompt = isShuffling && elapsed < LUCKY_CUP_SHUFFLE_START_MS
    ? (locale === 'ar' ? 'تابع الكورة' : 'Follow the ball')
    : '';

  return (
    <div className={`lucky-v27-field ${isReveal ? 'lucky-v27-reveal' : ''} ${isShuffling ? 'lucky-v27-tracking' : ''}`} data-lucky-phase={phase} data-lucky-ball-visible={visibleBallSlot >= 0 ? 'true' : 'false'}>
      {phasePrompt ? <div className="lucky-v28-prompt" dir={locale} role="status" aria-live="off">{phasePrompt}</div> : null}
      <div className="lucky-v27-stage-floor" aria-hidden="true" />
      {allMotion.map((motion) => (
        <span
          key={`shadow-${motion.cupId}`}
          className="lucky-v27-floor-shadow"
          style={{
            left: `${16.6667 + motion.slot * 33.3333}%`,
            opacity: isReveal && motion.cupId === plan.initialBallCupId ? .22
              : isShuffling && motion.cupId === plan.initialBallCupId && initialLift > 0 ? .26
                : Math.max(.25, .6 - motion.arc * .3),
          }}
          aria-hidden="true"
        />
      ))}
      {plan.cups.map((cup) => {
        const motion = allMotion.find((frame) => frame.cupId === cup.cupId)!;
        const lift = isShuffling && cup.cupId === plan.initialBallCupId && elapsed < LUCKY_CUP_SHUFFLE_START_MS ? initialLift : 0;
        const isWinnerCup = isReveal && cup.cupId === plan.initialBallCupId;
        const transformVars = {
          left: `${16.6667 + motion.slot * 33.3333}%`,
          '--lucky-arc': `${motion.arc * 44 + lift * 118}px`,
          '--lucky-tilt': `${motion.tilt}deg`,
          '--v35-flight-scale': String(1 + Math.max(0, motion.arc) * 0.075),
          zIndex: 10 + motion.layer + (lift > 0 ? 4 : 0),
        } as CSSProperties;
        return (
          <div
            key={cup.cupId}
            className={`lucky-v27-cup-unit ${isWinnerCup ? 'lucky-v27-cup-winning' : ''}`}
            style={transformVars}
            data-cup-id={cup.cupId}
            data-slot={motion.slot.toFixed(3)}
          >
            <img className="lucky-v27-cup-art" src={CUP_URL} draggable={false} alt="" />
          </div>
        );
      })}
      {visibleBallSlot >= 0 ? (
        <div
          className={`lucky-v27-ball-unit ${isReveal ? 'lucky-v27-ball-revealed' : 'lucky-v28-ball-preview'}`}
          style={{ left: `${16.6667 + visibleBallSlot * 33.3333}%` }}
          aria-label={locale === 'ar' ? `الكورة في المكان ${visibleBallSlot + 1}` : `Ball at position ${visibleBallSlot + 1}`}
        >
          <img src={BALL_URL} draggable={false} alt="" />
        </div>
      ) : null}
      {isReveal ? <div className="lucky-v27-gold-glint" style={{ left: `${16.6667 + correctSlot * 33.3333}%` }} aria-hidden="true" /> : null}
    </div>
  );
}

export function LuckyCupScreen({ miniGame, tourPhase }: { miniGame: MiniGameSnapshot; tourPhase: TourPhase }) {
  const { snapshot } = useGame();
  const plan = miniGame.luckyCup;
  const locale = snapshot.locale;
  useLuckyCupRevealCue(tourPhase === 'scoring', miniGame.questionId);

  if (!plan) return null;

  const labels = LABELS[locale];
  const displayedMiniGame = tourPhase === 'tour_starting'
    ? { ...miniGame, statement: locale === 'ar' ? 'الكوباية اللي فيها الكورة... ركز!' : 'Watch the cup with the ball!' }
    : miniGame;
  return (
    <QuestionScreenShell
      miniGame={displayedMiniGame}
      tourPhase={tourPhase}
      helperText={miniGame.instruction}
      layout="choice"
      choices={[
        { command: '!1', label: labels.left, tone: 'cyan' },
        { command: '!2', label: labels.center, tone: 'cyan' },
        { command: '!3', label: labels.right, tone: 'cyan' },
      ]}
      bodyClassName="gameplay-question-body-lucky-cup lucky-v27-body"
      shellClassName="lucky-v27-shell"
      isAnswerReveal={tourPhase === 'scoring'}
      correctAnswerText={tourPhase === 'scoring' && plan.correctCupNumber ? [labels.left, labels.center, labels.right][plan.correctCupNumber - 1] : undefined}
    >
      <LuckyCupPlayfield key={miniGame.questionId ?? 'lucky'} plan={plan} phase={tourPhase} tour={snapshot.tour} locale={locale} />
    </QuestionScreenShell>
  );
}
