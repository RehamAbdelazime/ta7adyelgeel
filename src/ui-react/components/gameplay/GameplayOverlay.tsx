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
import { RoundRevealProvider } from './shared/RoundRevealContext';
import { getScoringRevealKey, useRoundRevealCompletion } from './shared/RoundRevealCompletionContext';
import { MiniGameIntroIllustration, INTRO_STEP_ICONS } from './shared/MiniGameIntroIllustration';

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
  const { actions, snapshot } = useGame();
  const locale = snapshot.locale;
  const t = useTranslation();
  const fallbackSteps: TranslationKey[] = [
    'gameplay.intro.shape.step1',
    'gameplay.intro.shape.step2',
    'gameplay.intro.shape.step3',
  ];
  const steps: TranslationKey[] = [...(MINI_GAME_BY_ID[miniGame.id]?.introSteps ?? fallbackSteps)];

  return (
    <div className="gameplay-intro-card">
      <header className="howto-intro-header">
        <span>{MINI_GAME_BY_ID[miniGame.id].icon}</span>
        <div><small>{locale === 'ar' ? 'إزاي نلعب؟' : 'HOW TO PLAY'}</small><h2>{miniGame.title}</h2></div>
      </header>
      <MiniGameIntroIllustration gameId={miniGame.id} />
      <div className="gameplay-intro-steps">
        {steps.map((step, index) => (
          <article className="howto-step" key={step}>
            <span className="howto-step-icon" aria-hidden="true">{INTRO_STEP_ICONS[miniGame.id][index]}</span>
            <b>{index + 1}</b>
            <p>{t(step)}</p>
          </article>
        ))}
      </div>
      <button className="gameplay-intro-continue-button" type="button" onClick={actions.skipPhase}>
        {t('ui.startRound')}
      </button>
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
  const scoringRevealKey = getScoringRevealKey(tour.tourId, tour.roundNumber, miniGame.questionId);
  // The reveal flag is shared with stage lighting: no separate 4.8-second
  // timer can flip the scenery while the host is still showing the answer.
  const { completedScoringRevealKey, setCompletedScoringRevealKey } = useRoundRevealCompletion();

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
          ? <RoundRevealProvider onContinue={() => setCompletedScoringRevealKey(scoringRevealKey)}>
              <MiniGamePlayScreen miniGame={miniGame} tourPhase="scoring" />
            </RoundRevealProvider>
          : <RoundScoreBoard citizens={citizens} tour={tour} miniGame={miniGame} lastRoundAwards={lastRoundAwards} />}
      </section>
    );
  }

  if (overlayMode === 'tour-starting') {
    // Visual preparation is actual gameplay for both games: Lucky Cup shuffles,
    // Memory Count briefly exposes the grid before the answer window hides it.
    // Never replace either with the generic countdown.
    if ((miniGame.id === 'lucky-cup' || miniGame.id === 'memory-count') && miniGame.hasRound) {
      return (
        <section className="gameplay-main-screen-overlay gameplay-main-screen-active gameplay-phase-tour_starting gameplay-lucky-cup-warmup">
          <MiniGamePlayScreen miniGame={miniGame} tourPhase="tour_starting" />
        </section>
      );
    }
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

      {tour.phase !== 'mini_game_intro' && tour.phase !== 'answer_window_open' ? <div className="gameplay-round-header">
        <span>{roundLabel ? `${roundLabel} · ${phaseLabel}` : phaseLabel}</span>
        <b>{miniGame.title}</b>
        {miniGame.questionDifficulty ? <i>{DIFFICULTY_LABEL[miniGame.questionDifficulty]}</i> : null}
        {chaosEvent.active ? <em>{'\u26A1'} {chaosEvent.badge}</em> : null}
        {phaseRemaining > 0 ? <strong>{phaseRemaining}s</strong> : null}
      </div> : null}

      {tour.phase === 'mini_game_intro' ? <MiniGameIntro miniGame={miniGame} /> : null}

      {tour.phase === 'answer_window_open' ? (
        <MiniGamePlayScreen miniGame={miniGame} tourPhase={tour.phase} />
      ) : null}

      {!['tour_complete', 'scoring', 'mini_game_intro', 'answer_window_open'].includes(tour.phase) ? (
        <div className="gameplay-answer-status">
          <span>{getBottomStatus(tour.phase, miniGame)}</span>
          <span>{formatAnswerParticipation(t, miniGame.officialAnswerCount, miniGame.spectatorAnswerCount, spectatorCount)}</span>
        </div>
      ) : null}
    </section>
  );
}