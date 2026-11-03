import { useEffect, useState } from 'react';
import type { TourAwardsSnapshot } from '../../../game-core/awards/tour-awards';
import type { ChampionCelebrationSnapshot } from '../../../game-core/app/game-snapshot';
import type { ChaosEventSnapshot } from '../../../game-core/chaos/chaos-types';
import type { CitizenRuntime } from '../../../game-core/citizens/citizen-types';
import type { MiniGameScoreAward, MiniGameSnapshot } from '../../../game-core/minigames/minigame-types';
import type { TourPhase, TourSnapshot } from '../../../game-core/tours/tour-types';
import type { TranslationKey } from '../../../game-core/localization/locale-types';
import { useGame } from '../../context/GameContext';
import { useTranslation } from '../../i18n/useTranslation';
import { MainScreenPlayFlow } from '../play/MainScreenPlayFlow';
import { PHASE_LABEL_KEY, DIFFICULTY_LABEL, getBottomStatus } from './shared/overlay-types';
import { formatAnswerParticipation } from './shared/answer-helpers';
import { ChoiceSpotlights } from './citizens/ChoiceSpotlights';
import { CitizenPlazaOverlay } from './citizens/CitizenPlaza';
import { RoundScoreBoard, TourCompleteSummary } from './scoreboard/Scoreboard';
import { MINI_GAME_BY_ID } from '../../../game-core/minigames/minigame-registry';
import { MINI_GAME_SCREENS } from './minigames/minigame-screen-registry';
import { resolveGameplayOverlayMode } from './gameplay-overlay-mode';

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
  const fallbackSteps: TranslationKey[] = [
    'gameplay.intro.shape.step1',
    'gameplay.intro.shape.step2',
    'gameplay.intro.shape.step3',
  ];
  const steps: TranslationKey[] = [...(MINI_GAME_BY_ID[miniGame.id]?.introSteps ?? fallbackSteps)];

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
  const { snapshot } = useGame();
  const t = useTranslation();
  const phaseRemaining = Math.max(0, Math.ceil(tour.phaseRemainingMs / 1000));
  const scoringRevealKey = `${tour.tourId}:${tour.roundNumber}:${miniGame.questionId ?? 'no-question'}`;
  const [completedScoringRevealKey, setCompletedScoringRevealKey] = useState<string | null>(null);

  // Keep each game's visual answer reveal briefly, then move to the round scoreboard.
  // This preserves game-specific reveals (e.g. the Maze path and Lucky Cup result)
  // without leaving the scoreboard hidden indefinitely.
  useEffect(() => {
    if (tour.phase !== 'scoring' || !miniGame.hasRound) {
      setCompletedScoringRevealKey(null);
      return;
    }

    const revealTimer = window.setTimeout(() => setCompletedScoringRevealKey(scoringRevealKey), 4800);
    return () => window.clearTimeout(revealTimer);
  }, [miniGame.hasRound, scoringRevealKey, tour.phase]);

  const overlayMode = resolveGameplayOverlayMode(tour.phase, tour.isTourActive, shouldShowMiniGame);

  if (overlayMode === 'final-score') {
    return (
      <section className="gameplay-main-screen-overlay gameplay-main-screen-active gameplay-phase-tour_complete">
        <TourCompleteSummary citizens={citizens} tour={tour} tourAwards={tourAwards} lastRoundAwards={lastRoundAwards} />
      </section>
    );
  }

  if (overlayMode === 'round-score') {
    const isShowingAnswerReveal = miniGame.hasRound && completedScoringRevealKey !== scoringRevealKey;
    return (
      <section className="gameplay-main-screen-overlay gameplay-main-screen-active gameplay-phase-scoring">
        {isShowingAnswerReveal
          ? <MiniGamePlayScreen miniGame={miniGame} tourPhase="scoring" />
          : <RoundScoreBoard citizens={citizens} tour={tour} miniGame={miniGame} lastRoundAwards={lastRoundAwards} />}
      </section>
    );
  }

  if (overlayMode === 'tour-starting') {
    return <TourStartingScreen seconds={phaseRemaining} />;
  }

  if (overlayMode === 'lobby') {
    return <LobbyScreen />;
  }

  const phaseLabel = t(PHASE_LABEL_KEY[tour.phase] ?? 'gameplay.phase.miniGame');
  const isTourMode = snapshot.activeSessionMode === 'tour';
  const roundLabel = isTourMode && tour.totalRounds > 0 ? `${t('gameplay.round.label')} ${tour.roundNumber}/${tour.totalRounds}` : null;
  const spectatorCount = citizens.filter((citizen) => citizen.role === 'spectator').length;

  return (
    <section className={`gameplay-main-screen-overlay gameplay-main-screen-active gameplay-phase-${tour.phase}`}>
      {chaosEvent.active ? <ChaosEventBanner chaosEvent={chaosEvent} tourPhase={tour.phase} /> : null}

      <div className="gameplay-round-header">
        <span>{roundLabel ? `${roundLabel} · ${phaseLabel}` : phaseLabel}</span>
        <b>{miniGame.title}</b>
        {miniGame.questionDifficulty ? <i>{DIFFICULTY_LABEL[miniGame.questionDifficulty]}</i> : null}
        {chaosEvent.active ? <em>{'\u26A1'} {chaosEvent.badge}</em> : null}
        {phaseRemaining > 0 ? <strong>{phaseRemaining}s</strong> : null}
      </div>

      {tour.phase === 'mini_game_intro' ? <MiniGameIntro miniGame={miniGame} /> : null}

      {tour.phase === 'answer_window_open' ? (
        <MiniGamePlayScreen miniGame={miniGame} tourPhase={tour.phase} />
      ) : null}

      {!['tour_complete', 'scoring'].includes(tour.phase) ? (
        <div className="gameplay-answer-status">
          <span>{getBottomStatus(tour.phase, miniGame)}</span>
          <span>{formatAnswerParticipation(t, miniGame.officialAnswerCount, miniGame.spectatorAnswerCount, spectatorCount)}</span>
        </div>
      ) : null}
    </section>
  );
}