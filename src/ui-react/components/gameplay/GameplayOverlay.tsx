import { useState, useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import type { TourAwardsSnapshot } from '../../../game-core/awards/tour-awards';
import type { ChampionCelebrationSnapshot } from '../../../game-core/app/game-snapshot';
import type { ChaosEventSnapshot } from '../../../game-core/chaos/chaos-types';
import type { CitizenRuntime } from '../../../game-core/citizens/citizen-types';
import type { MiniGameId, MiniGameScoreAward, MiniGameSnapshot } from '../../../game-core/minigames/minigame-types';
import type { TourPhase, TourSnapshot } from '../../../game-core/tours/tour-types';
import { useGame } from '../../context/GameContext';
import { useTranslation } from '../../i18n/useTranslation';
import { MainScreenPlayFlow } from '../play/MainScreenPlayFlow';
import { PHASE_LABEL_KEY, DIFFICULTY_LABEL, getBottomStatus, getPhaseHelper, getMiniGameTitle, getCorrectAnswerText, type TranslateFn } from './shared/overlay-types';
import type { TranslationKey } from '../../../game-core/localization/locale-types';
import { formatAnswerParticipation, getCorrectOptionNumber, getCommandOptionNumber, buildChoiceSpotlights, getAnswerCountsByOption } from './shared/answer-helpers';
import { QuestionScreenShell, ChoiceCard, ShapeMark, type QuestionChoiceItem } from './shared/question-shell';
import { ChoiceSpotlights } from './citizens/ChoiceSpotlights';
import { CitizenPlazaOverlay } from './citizens/CitizenPlaza';
import { RoundResult, RoundScoreBoard, RoundIntermissionScreen, TourCompleteSummary } from './scoreboard/Scoreboard';
import { TrueFakeScreen } from './minigames/TrueFakeScreen';
import { LuckyCupScreen } from './minigames/LuckyCupScreen';
import { ShapeCountScreen } from './minigames/ShapeCountScreen';
import { MemoryCountScreen } from './minigames/MemoryCountScreen';
import { FoodOriginScreen } from './minigames/FoodOriginScreen';
import { CoupleOrSiblingsScreen } from './minigames/CoupleOrSiblingsScreen';
import { GuessLogoScreen } from './minigames/GuessLogoScreen';
import { MazeGatesScreen } from './minigames/MazeGatesScreen';
import { BeforeOrAfterScreen } from './minigames/BeforeOrAfterScreen';
import { HangmanScreen } from './minigames/HangmanScreen';

export function GameplayOverlay({ sceneOverride }: { sceneOverride?: 'lobby' | 'minigame' } = {}) {
  const { snapshot } = useGame();
  const shouldShowMiniGame = snapshot.miniGame.hasRound
    && snapshot.tour.isTourActive
    && snapshot.tour.phase !== 'tour_starting'
    && snapshot.tour.phase !== 'cleanup';
  const isMiniGameScene = sceneOverride
    ? sceneOverride === 'minigame'
    : snapshot.tour.isTourActive && snapshot.tour.phase !== 'lobby_open';

  return (
    <div className={`gameplay-overlay-layer ${isMiniGameScene ? 'gameplay-overlay-minigame-scene' : 'gameplay-overlay-lobby-scene'}`} aria-hidden={false}>
      <MainScreenGameplayOverlay
        tour={snapshot.tour}
        miniGame={snapshot.miniGame}
        citizens={snapshot.citizens}
        chaosEvent={snapshot.chaosEvent}
        tourAwards={snapshot.tourAwards}
        lastRoundAwards={snapshot.lastRoundAwards}
        shouldShowMiniGame={shouldShowMiniGame}
      />
      <ChoiceSpotlights miniGame={snapshot.miniGame} phase={snapshot.tour.phase} />
      <CitizenPlazaOverlay
        citizens={snapshot.citizens}
        phase={snapshot.tour.phase}
        miniGame={snapshot.miniGame}
        championCelebration={snapshot.championCelebration}
      />
    </div>
  );
}

function ChaosEventBanner({ chaosEvent, tourPhase }: { chaosEvent: ChaosEventSnapshot; tourPhase: TourPhase }) {
  const t = useTranslation();
  const isRevealPhase = tourPhase === 'mini_game_intro';

  return (
    <div className={`gameplay-chaos-banner gameplay-chaos-${chaosEvent.rarity ?? 'common'} ${isRevealPhase ? 'gameplay-chaos-reveal' : ''}`}>
      <span>● {chaosEvent.badge || 'CHAOS EVENT'} ●</span>
      <strong>{chaosEvent.title}</strong>
      <small>{chaosEvent.description}</small>
    </div>
  );
}

function LobbyScreen() {
  return (
    <section className="gameplay-main-screen-overlay gameplay-main-screen-lobby gameplay-main-screen-lobby-interactive">
      <MainScreenPlayFlow />
    </section>
  );
}

function TourStartingScreen({ seconds }: { seconds: number }) {
  const t = useTranslation();

  return (
    <section className="gameplay-main-screen-overlay gameplay-main-screen-active gameplay-tour-starting-card">
      <p className="gameplay-kicker">{t('gameplay.liveShow')}</p>
      <h1>{t('gameplay.phase.starting')}</h1>
      <strong>{seconds > 0 ? `${seconds}s` : t('gameplay.now')}</strong>
    </section>
  );
}

function MiniGameIntro({ miniGame }: { miniGame: MiniGameSnapshot }) {
  const { actions } = useGame();
  const t = useTranslation();
  const steps = MINI_GAME_BY_ID[miniGame.id]?.introSteps ?? [
    'gameplay.intro.shape.step1' as TranslationKey,
    'gameplay.intro.shape.step2' as TranslationKey,
    'gameplay.intro.shape.step3' as TranslationKey,
  ];

  return (
    <div className="gameplay-intro-card">
      <h2>{miniGame.title}</h2>
      <div className="gameplay-intro-steps">
        {steps.map((step, index) => (
          <span key={step}><b>{index + 1}</b>{t(step)}</span>
        ))}
      </div>
      <button className="gameplay-intro-continue-button" type="button" onClick={actions.skipPhase}>
        {t('ui.startRound')}
      </button>
    </div>
  );
}

function PrepareCountdown({ seconds }: { miniGame: MiniGameSnapshot; seconds: number }) {
  const t = useTranslation();

  return (
    <div className="gameplay-prepare-card">
      <h2>{seconds}</h2>
      <strong>{t('gameplay.getReady')}</strong>
      <span>{t('gameplay.prepare.questionAppears')}</span>
    </div>
  );
}

function ActionWarmupScreen({ seconds: _seconds }: { miniGame: MiniGameSnapshot; seconds: number }) {
  return null;
}

function AnswersLockedScreen({ miniGame }: { miniGame: MiniGameSnapshot }) {
  const t = useTranslation();

  return (
    <div className="gameplay-prepare-card gameplay-answers-locked-card">
      <h2>★</h2>
      <strong>{t('gameplay.answers.locked')}</strong>
      <span>{t('gameplay.answers.received', { count: String(miniGame.answerRecords.length) })}</span>
    </div>
  );
}

function MiniGamePlayScreen({ miniGame, tourPhase }: { miniGame: MiniGameSnapshot; tourPhase: TourPhase }) {
  const Screen = MINI_GAME_SCREENS[miniGame.id];
  if (!Screen) return null;
  return <Screen miniGame={miniGame} tourPhase={tourPhase} />;
}

function MainScreenGameplayOverlay({
  tour,
  miniGame,
  citizens,
  chaosEvent,
  tourAwards,
  lastRoundAwards,
  shouldShowMiniGame,
}: {
  tour: TourSnapshot;
  miniGame: MiniGameSnapshot;
  citizens: CitizenRuntime[];
  chaosEvent: ChaosEventSnapshot;
  tourAwards: TourAwardsSnapshot;
  lastRoundAwards: MiniGameScoreAward[];
  shouldShowMiniGame: boolean;
}) {
  const { actions, snapshot } = useGame();
  const t = useTranslation();
  const phaseRemaining = Math.max(0, Math.ceil(tour.phaseRemainingMs / 1000));

  // V2_RETURN_TO_STAGE_ON_END
  // Final scoreboard is not shown in the live scene. When a single mini game or tour ends,
  // immediately return to the stage/lobby flow instead.
  useEffect(() => {
    if (tour.phase === 'tour_complete') {
      actions.backToStage();
    }
  }, [actions, tour.phase]);

  if (tour.phase === 'tour_complete') {
    return null;
  }

  if (!shouldShowMiniGame) {
    if (tour.isTourActive && tour.phase === 'tour_starting') {
      return <TourStartingScreen seconds={phaseRemaining} />;
    }

    return <LobbyScreen />;
  }

  const phaseLabel = t(PHASE_LABEL_KEY[tour.phase] ?? 'gameplay.phase.miniGame');
  const isTourMode = snapshot.activeSessionMode === 'tour';
  const roundLabel = isTourMode && tour.totalRounds > 0 ? `${t('gameplay.round.label')} ${tour.roundNumber}/${tour.totalRounds}` : null;
  const showFinalScore = false;
  const showAnswerReveal = tour.phase === 'scoring' && miniGame.hasRound;
  const showRoundScore = tour.phase === 'scoring' && !showAnswerReveal;
  const showResult = false;
  const spectatorCount = citizens.filter((citizen) => citizen.role === 'spectator').length;

  return (
    <section className={`gameplay-main-screen-overlay gameplay-main-screen-active gameplay-phase-${tour.phase}`}>
      {false && chaosEvent.active ? <ChaosEventBanner chaosEvent={chaosEvent} tourPhase={tour.phase} /> : null}

      <div className="gameplay-round-header">
        <span>{roundLabel ? `${roundLabel} · ${phaseLabel}` : phaseLabel}</span>
        <b>{miniGame.title}</b>
        {miniGame.questionDifficulty ? <i>{DIFFICULTY_LABEL[miniGame.questionDifficulty]}</i> : null}
        {chaosEvent.active ? <em>{'\u26A1'} {chaosEvent.badge}</em> : null}
        {phaseRemaining > 0 ? <strong>{phaseRemaining}s</strong> : null}
      </div>

      {tour.phase === 'mini_game_intro' ? <MiniGameIntro miniGame={miniGame} /> : null}

      {(tour.phase === 'answer_window_open' || showAnswerReveal) && !showResult ? (
        <MiniGamePlayScreen miniGame={miniGame} tourPhase={tour.phase} />
      ) : null}

      {showResult ? <RoundResult miniGame={miniGame} /> : null}
      {showRoundScore ? <RoundScoreBoard citizens={citizens} tour={tour} miniGame={miniGame} lastRoundAwards={lastRoundAwards} /> : null}
      {showFinalScore ? <TourCompleteSummary citizens={citizens} tour={tour} tourAwards={tourAwards} lastRoundAwards={lastRoundAwards} /> : null}

      {!['tour_complete', 'scoring'].includes(tour.phase) ? (
        <div className="gameplay-answer-status">
          <span>{getBottomStatus(tour.phase, miniGame)}</span>
          <span>{formatAnswerParticipation(t, miniGame.officialAnswerCount, miniGame.spectatorAnswerCount, spectatorCount)}</span>
        </div>
      ) : null}
    </section>
  );
}