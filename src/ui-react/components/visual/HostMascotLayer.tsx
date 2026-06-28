import { useGame } from '../../context/GameContext';
import { useTwitchConnection } from '../../context/TwitchConnectionContext';

const RUNTIME = './assets/game/runtime';

const hostWelcomeOpenAsset = `${RUNTIME}/host/host_welcome_open.png`;
const hostWelcomeBlinkAsset = `${RUNTIME}/host/host_welcome_blink.png`;
const hostThinkingOpenAsset = `${RUNTIME}/host/host_thinking_open.png`;
const hostThinkingBlinkAsset = `${RUNTIME}/host/host_thinking_blink.png`;
const hostHurryOpenAsset = `${RUNTIME}/host/host_hurry_open.png`;
const hostHurryBlinkAsset = `${RUNTIME}/host/host_hurry_blink.png`;
const hostResultWinnerOpenAsset = `${RUNTIME}/host/host_result_winner_open.png`;
const hostResultWinnerBlinkAsset = `${RUNTIME}/host/host_result_winner_blink.png`;
const hostResultRunnerUpOpenAsset = `${RUNTIME}/host/host_result_runnerup_open.png`;
const hostResultRunnerUpBlinkAsset = `${RUNTIME}/host/host_result_runnerup_blink.png`;

type ScoreLikeRow = { twitchUserId: string; displayName: string; role?: string; total: number };

function resolveTopOfficialId(rows: ScoreLikeRow[], citizens: { twitchUserId: string; displayName: string; role: string; score: number }[]): string | null {
  const rowWinner = rows
    .filter((row) => row.role === undefined || row.role === 'official')
    .sort((a, b) => b.total - a.total || a.displayName.localeCompare(b.displayName))[0]?.twitchUserId ?? null;

  if (rowWinner) {
    return rowWinner;
  }

  return [...citizens]
    .filter((citizen) => citizen.role === 'official')
    .sort((a, b) => b.score - a.score || a.displayName.localeCompare(b.displayName))[0]?.twitchUserId ?? null;
}

export function HostMascotLayer({ scene }: { scene: 'lobby' | 'minigame' }) {
  const { snapshot } = useGame();
  const { status } = useTwitchConnection();
  const isLobbyHostActive = scene === 'lobby';
  const isMiniGameScene = scene === 'minigame';
  const isIntroHostActive = isMiniGameScene && snapshot.tour.phase === 'mini_game_intro';
  const isQuestionHostActive = isMiniGameScene && snapshot.tour.phase === 'answer_window_open';
  const isPresenterHostActive = isMiniGameScene && (snapshot.tour.phase === 'tour_starting' || snapshot.tour.phase === 'scoring');
  const isResultHostActive = isMiniGameScene && snapshot.tour.phase === 'tour_complete';
  const isQuestionHalfTime = isQuestionHostActive
    && snapshot.tour.phaseDurationMs > 0
    && snapshot.tour.phaseRemainingMs <= snapshot.tour.phaseDurationMs / 2;
  const questionOpenAsset = isQuestionHalfTime ? hostHurryOpenAsset : hostThinkingOpenAsset;
  const questionBlinkAsset = isQuestionHalfTime ? hostHurryBlinkAsset : hostThinkingBlinkAsset;
  const scoreRows = snapshot.tourAwards.scoreboardRows.length > 0 ? snapshot.tourAwards.scoreboardRows : snapshot.tourScoreboardRows;
  const topOfficialId = isResultHostActive ? resolveTopOfficialId(scoreRows, snapshot.citizens) : null;
  const streamerUserId = status.accountUserId;
  const didStreamerWin = Boolean(streamerUserId && topOfficialId && streamerUserId === topOfficialId);
  const resultOpenAsset = didStreamerWin ? hostResultWinnerOpenAsset : hostResultRunnerUpOpenAsset;
  const resultBlinkAsset = didStreamerWin ? hostResultWinnerBlinkAsset : hostResultRunnerUpBlinkAsset;

  const presenterOpenAsset = hostResultWinnerOpenAsset;
  const presenterBlinkAsset = hostResultWinnerBlinkAsset;

  if (!isLobbyHostActive && !isIntroHostActive && !isQuestionHostActive && !isPresenterHostActive && !isResultHostActive) {
    return null;
  }

  return (
    <>
      {isLobbyHostActive ? (
        <div className="concert-host-mascot-stage-layer" aria-hidden="true">
          <span className="concert-host-stage-beam concert-host-stage-beam-left" />
          <span className="concert-host-stage-beam concert-host-stage-beam-right" />
          <span className="concert-host-floor-pool concert-host-floor-pool-front" />
          <div className="concert-host-mascot concert-host-mascot-front">
            <span className="concert-host-mascot-shadow" />
            <img className="concert-host-mascot-pose concert-host-mascot-open" src={hostWelcomeOpenAsset} alt="" draggable={false} />
            <img className="concert-host-mascot-pose concert-host-mascot-blink" src={hostWelcomeBlinkAsset} alt="" draggable={false} />
          </div>
        </div>
      ) : null}

      {isIntroHostActive ? (
        <div className="concert-host-presenter-layer concert-host-presenter-layer-intro" aria-hidden="true">
          <span className="concert-host-presenter-floor-pool" />
          <div className="concert-host-presenter-mascot">
            <span className="concert-host-presenter-shadow" />
            <img className="concert-host-presenter-pose concert-host-presenter-open" src={presenterOpenAsset} alt="" draggable={false} />
            <img className="concert-host-presenter-pose concert-host-presenter-blink" src={presenterBlinkAsset} alt="" draggable={false} />
          </div>
        </div>
      ) : null}

      {isPresenterHostActive ? (
        <div className="concert-host-presenter-layer concert-host-presenter-layer-side" aria-hidden="true">
          <span className="concert-host-presenter-floor-pool" />
          <div className="concert-host-presenter-mascot">
            <span className="concert-host-presenter-shadow" />
            <img className="concert-host-presenter-pose concert-host-presenter-open" src={presenterOpenAsset} alt="" draggable={false} />
            <img className="concert-host-presenter-pose concert-host-presenter-blink" src={presenterBlinkAsset} alt="" draggable={false} />
          </div>
        </div>
      ) : null}

      {isQuestionHostActive ? (
        <div className={`concert-host-question-layer ${isQuestionHalfTime ? 'concert-host-question-layer-urgent' : ''}`} aria-hidden="true">
          <span className="concert-host-question-floor-pool" />
          <div className="concert-host-question-mascot">
            <span className="concert-host-question-shadow" />
            <img className="concert-host-question-pose concert-host-question-open" src={questionOpenAsset} alt="" draggable={false} />
            <img className="concert-host-question-pose concert-host-question-blink" src={questionBlinkAsset} alt="" draggable={false} />
          </div>
        </div>
      ) : null}

      {isResultHostActive ? (
        <div className={`concert-host-result-layer ${didStreamerWin ? 'concert-host-result-layer-winner' : 'concert-host-result-layer-runnerup'}`} aria-hidden="true">
          <span className="concert-host-result-floor-pool" />
          <div className="concert-host-result-mascot">
            <span className="concert-host-result-shadow" />
            <img className="concert-host-result-pose concert-host-result-open" src={resultOpenAsset} alt="" draggable={false} />
            <img className="concert-host-result-pose concert-host-result-blink" src={resultBlinkAsset} alt="" draggable={false} />
          </div>
        </div>
      ) : null}
    </>
  );
}
