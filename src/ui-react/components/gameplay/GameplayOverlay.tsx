import type { TourAwardsSnapshot } from '../../../game-core/awards/tour-awards';
import type { ChampionCelebrationSnapshot } from '../../../game-core/app/game-snapshot';
import type { CitizenRuntime } from '../../../game-core/citizens/citizen-types';
import type { MiniGameScoreAward, MiniGameSnapshot } from '../../../game-core/minigames/minigame-types';
import type { TourPhase, TourSnapshot } from '../../../game-core/tours/tour-types';
import type { ChaosEventSnapshot } from '../../../game-core/chaos/chaos-types';
import { useGame } from '../../context/GameContext';
import { useTranslation } from '../../i18n/useTranslation';
import { MainScreenPlayFlow } from '../play/MainScreenPlayFlow';
import { PHASE_LABEL_KEY, DIFFICULTY_LABEL, getBottomStatus } from './shared/overlay-types';
import { formatAnswerParticipation } from './shared/answer-helpers';
import { ChoiceSpotlights } from './citizens/ChoiceSpotlights';
import { CitizenPlazaOverlay } from './citizens/CitizenPlaza';
import { RoundScoreBoard, TourCompleteSummary } from './scoreboard/Scoreboard';
import { MINI_GAME_SCREENS } from './minigames/minigame-screen-registry';
import { resolveGameplayOverlayMode } from './gameplay-overlay-mode';
import { RoundRevealProvider } from './shared/RoundRevealContext';
import { getScoringRevealKey, useRoundRevealCompletion } from './shared/RoundRevealCompletionContext';
import { MiniGameIntroDemonstration } from './shared/MiniGameIntroDemonstration';

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
  return (
    <div className="gameplay-intro-card gameplay-intro-card-v68">
      <header className="howto-intro-header howto-intro-header-v68 howto-intro-header-food-v71">
        <h2>{t('gameplay.phase.howToPlay')}</h2>

      </header>
      <MiniGameIntroDemonstration gameId={miniGame.id} locale={locale} onStart={actions.skipPhase} />
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

  if (overlayMode === 'chaos-announcement') {
    // The cinematic lives in a dedicated stage layer (GameSceneStage).
    // Do NOT mount the tutorial, quiz, countdown, or scoreboard behind it.
    return null;
  }

  if (overlayMode === 'tour-starting') {
    // Preparation is actual gameplay: Lucky Cup shuffles, Memory Count shows
    // the grid, and Count the Beat plays every symbol BEFORE answers are enabled.
    // Never replace either with the generic countdown.
    if ((miniGame.id === 'lucky-cup' || miniGame.id === 'memory-count' || miniGame.id === 'count-the-beat') && miniGame.hasRound) {
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
      {chaosEvent.active && tour.phase === 'answer_window_open' ? (
        <div className="gameplay-chaos-mini-v40 gameplay-chaos-badge-v85" role="status" aria-label={chaosEvent.title}>
          <span aria-hidden="true">⚡</span><strong>{chaosEvent.title}</strong>
        </div>
      ) : null}

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