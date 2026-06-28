import { useMemo, useState } from 'react';
import type { HostChaosMode } from '../../../game-core/app/game-snapshot';
import type { MiniGameId } from '../../../game-core/minigames/minigame-types';
import { getTourPhaseTitleKey } from '../../../game-core';
import { useGame } from '../../context/GameContext';
import { useTranslation } from '../../i18n/useTranslation';
import { DeveloperQaPanel } from './DeveloperQaPanel';

type HostTab = 'tour' | 'minigames' | 'chaos' | 'players' | 'qa';

const MINI_GAMES: { id: MiniGameId; label: string; note: string }[] = [
  { id: 'food-origin', label: 'Food Origin', note: 'Guess the country' },
  { id: 'shape-count', label: 'Shape Count', note: 'Most repeated shape' },
  { id: 'maze-gates', label: 'Maze Gates', note: 'Pick the right entrance' },
  { id: 'guess-logo', label: 'Guess The Logo', note: 'Guess the brand clue' },
];

const CHAOS_MODES: { id: HostChaosMode; label: string; note: string }[] = [
  { id: 'off', label: 'Off', note: 'No random modifiers' },
  { id: 'normal', label: 'Normal', note: 'Balanced mayhem' },
  { id: 'high', label: 'High', note: 'More frequent chaos' },
  { id: 'madness', label: 'Madness', note: 'Maximum stream chaos' },
];

const CHAOS_EVENTS = [
  ['double_score', 'Double Score'],
  ['half_score', 'Half Score'],
  ['risk_round', 'Risk Round'],
  ['score_storm', 'Score Storm'],
  ['comeback_boost', 'Comeback Boost'],
  ['spectator_mayhem', 'Spectator Mayhem'],
  ['fast_window', 'Fast Window'],
  ['chill_window', 'Chill Window'],
] as const;

export function HostProductionPanel() {
  const { actions, snapshot } = useGame();
  const t = useTranslation();
  const [activeTab, setActiveTab] = useState<HostTab>('tour');
  const [confirmAction, setConfirmAction] = useState<null | 'clearPlayers' | 'resetScores'>(null);
  const officialCount = snapshot.citizens.filter((citizen) => citizen.role === 'official').length;
  const spectatorCount = snapshot.citizens.filter((citizen) => citizen.role === 'spectator').length;
  const phaseLabel = t(getTourPhaseTitleKey(snapshot.tour.phase));
  const phaseSeconds = Math.max(0, Math.ceil(snapshot.tour.phaseRemainingMs / 1000));
  const currentMiniGame = MINI_GAMES.find((miniGame) => miniGame.id === snapshot.miniGame.id);

  const playerStatsLabel = spectatorCount >= 1
    ? `${officialCount} players Â· ${spectatorCount} spectators`
    : `${officialCount} players`;

  const hostStats = useMemo(() => [
    ['Tour', snapshot.tour.isTourActive ? `R${snapshot.tour.roundNumber}/${snapshot.tour.totalRounds}` : 'Lobby'],
    ['Phase', `${phaseLabel} Â· ${phaseSeconds}s`],
    ['Game', currentMiniGame?.label ?? snapshot.miniGame.title],
    ['Players', playerStatsLabel],
  ], [currentMiniGame, phaseLabel, phaseSeconds, playerStatsLabel, snapshot]);

  const tabs: { id: HostTab; label: string; icon: string }[] = [
    { id: 'tour', label: 'Tour', icon: 'ðŸŽ¬' },
    { id: 'minigames', label: 'Mini-games', icon: 'ðŸŽ®' },
    { id: 'chaos', label: 'Chaos', icon: 'âš¡' },
    { id: 'players', label: 'Players', icon: 'ðŸ‘¥' },
    { id: 'qa', label: 'QA', icon: 'ðŸ§ª' },
  ];

  return (
    <section className="host-production-panel">
      <header className="host-panel-header">
        <div>
          <span>HOST PANEL</span>
          <h2>Production Control</h2>
        </div>
        <strong>{snapshot.tour.isPaused ? 'PAUSED' : snapshot.tour.isTourActive ? 'LIVE TOUR' : 'LOBBY'}</strong>
      </header>

      <div className="host-panel-stats">
        {hostStats.map(([label, value]) => (
          <div key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>

      <nav className="host-panel-tabs" aria-label="Host production tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={activeTab === tab.id ? 'host-tab-active' : ''}
            onClick={() => setActiveTab(tab.id)}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="host-panel-body">
        {activeTab === 'tour' ? <TourControlTab /> : null}
        {activeTab === 'minigames' ? <MiniGamesTab /> : null}
        {activeTab === 'chaos' ? <ChaosTab /> : null}
        {activeTab === 'players' ? (
          <PlayersTab confirmAction={confirmAction} setConfirmAction={setConfirmAction} />
        ) : null}
        {activeTab === 'qa' ? <DeveloperQaPanel /> : null}
      </div>
    </section>
  );
}

function TourControlTab() {
  const { actions, snapshot } = useGame();
  const t = useTranslation();
  const [roundCountDraft, setRoundCountDraft] = useState(snapshot.hostSettings.tourRoundCount);
  const isCleanupActive = snapshot.tour.isCleanupActive;
  const isFinalScoreboard = snapshot.tour.phase === 'tour_complete';

  return (
    <div className="host-tab-panel">
      <div className="host-section-title">
        <strong>Tour Control</strong>
        <span>Run the live show safely.</span>
      </div>

      <div className="host-action-grid">
        {isFinalScoreboard ? (
          <button type="button" className="host-primary" onClick={actions.backToStage}>{t('ui.backToStage')}</button>
        ) : (
          <button type="button" className="host-primary" onClick={() => actions.startTour()} disabled={!snapshot.tour.canStartTour}>Start Tour</button>
        )}
        <button type="button" onClick={actions.pauseTour} disabled={!snapshot.tour.canPauseTour}>Pause</button>
        <button type="button" onClick={actions.resumeTour} disabled={!snapshot.tour.canResumeTour}>Resume</button>
        <button type="button" onClick={actions.skipPhase} disabled={!snapshot.tour.canSkipPhase}>Skip Phase</button>
        <button type="button" onClick={actions.skipRound} disabled={!snapshot.tour.isTourActive || isCleanupActive || isFinalScoreboard}>Skip Round</button>
        <button type="button" onClick={actions.restartRound} disabled={!snapshot.tour.isTourActive || isCleanupActive || isFinalScoreboard}>Restart Round</button>
        <button type="button" className="host-danger" onClick={actions.endTour} disabled={!snapshot.tour.isTourActive || isCleanupActive || isFinalScoreboard}>End Tour</button>
      </div>

      <label className="host-field">
        <span>Tour Length</span>
        <div className="host-inline-field">
          <select value={roundCountDraft} onChange={(event) => setRoundCountDraft(Number(event.target.value))} disabled={snapshot.tour.isTourActive}>
            {[3, 5, 7, 10].map((count) => <option key={count} value={count}>{count} rounds</option>)}
          </select>
          <button type="button" onClick={() => actions.setTourRoundCount(roundCountDraft)} disabled={snapshot.tour.isTourActive}>Apply</button>
        </div>
      </label>

      <p className="host-help-text">Tour length applies to the next Tour. Current active Tours keep their existing round count.</p>
    </div>
  );
}

function MiniGamesTab() {
  const { actions, snapshot } = useGame();
  const enabled = new Set(snapshot.hostSettings.enabledMiniGameIds);

  return (
    <div className="host-tab-panel">
      <div className="host-section-title">
        <strong>Mini-game Playlist</strong>
        <span>Enable games or force the next round.</span>
      </div>

      <div className="host-minigame-list">
        {MINI_GAMES.map((miniGame) => (
          <div key={miniGame.id} className="host-minigame-row">
            <label>
              <input
                type="checkbox"
                checked={enabled.has(miniGame.id)}
                onChange={(event) => actions.setMiniGameEnabled(miniGame.id, event.target.checked)}
              />
              <span>
                <strong>{miniGame.label}</strong>
                <small>{miniGame.note}</small>
              </span>
            </label>
            <button type="button" onClick={() => actions.setForcedNextMiniGame(miniGame.id)}>Force Next</button>
          </div>
        ))}
      </div>

      <div className="host-current-force">
        <span>Forced next:</span>
        <strong>{snapshot.hostSettings.forcedNextMiniGameId ?? 'Random playlist'}</strong>
        <button type="button" onClick={() => actions.setForcedNextMiniGame(null)}>Clear</button>
      </div>
    </div>
  );
}



function ChaosTab() {
  const { actions, snapshot } = useGame();
  const spectatorCount = snapshot.citizens.filter((citizen) => citizen.role === 'spectator').length;
  const visibleChaosEvents = spectatorCount >= 1
    ? CHAOS_EVENTS
    : CHAOS_EVENTS.filter(([id]) => id !== 'spectator_mayhem');

  return (
    <div className="host-tab-panel">
      <div className="host-section-title">
        <strong>Chaos Control</strong>
        <span>Control random round modifiers.</span>
      </div>

      <div className="host-chaos-mode-list">
        {CHAOS_MODES.map((mode) => (
          <button
            key={mode.id}
            type="button"
            className={snapshot.hostSettings.chaosMode === mode.id ? 'host-choice-active' : ''}
            onClick={() => actions.setChaosMode(mode.id)}
          >
            <strong>{mode.label}</strong>
            <small>{mode.note}</small>
          </button>
        ))}
      </div>

      <div className="host-section-title host-subsection-title">
        <strong>Force next Chaos Event</strong>
        <span>Used once, then clears automatically.</span>
      </div>

      <div className="host-force-grid">
        {visibleChaosEvents.map(([id, label]) => (
          <button key={id} type="button" onClick={() => actions.forceNextChaosEvent(id)}>{label}</button>
        ))}
        <button type="button" onClick={() => actions.forceNextChaosEvent(null)}>Clear Forced Event</button>
      </div>

      <div className="host-chaos-meter-note">
        <span>Chaos Meter</span>
        <strong>{snapshot.chaosPercent}%</strong>
        <small>{snapshot.chaosEvent.active ? snapshot.chaosEvent.title : 'No active event'}</small>
      </div>
    </div>
  );
}

function PlayersTab({
  confirmAction,
  setConfirmAction,
}: {
  confirmAction: null | 'clearPlayers' | 'resetScores';
  setConfirmAction: (value: null | 'clearPlayers' | 'resetScores') => void;
}) {
  const { actions, snapshot } = useGame();
  const official = snapshot.citizens.filter((citizen) => citizen.role === 'official');
  const spectators = snapshot.citizens.filter((citizen) => citizen.role === 'spectator');

  return (
    <div className="host-tab-panel">
      <div className="host-section-title">
        <strong>Players</strong>
        <span>Safe runtime player management.</span>
      </div>

      <div className="host-player-summary">
        <div><span>Players</span><strong>{official.length}</strong></div>
        {spectators.length >= 1 ? <div><span>Spectators</span><strong>{spectators.length}</strong></div> : null}
        {spectators.length >= 1 ? <div><span>Total</span><strong>{snapshot.citizens.length}</strong></div> : null}
      </div>

      <div className="host-action-grid">
        {spectators.length >= 1 ? <button type="button" onClick={actions.clearSpectators}>Clear Spectators</button> : null}
        <button type="button" className="host-danger" onClick={() => setConfirmAction('clearPlayers')} disabled={snapshot.tour.isTourActive}>Clear All Players</button>
        <button type="button" className="host-danger" onClick={() => setConfirmAction('resetScores')}>Reset Scores</button>
      </div>

      {confirmAction ? (
        <div className="host-confirm-box">
          <strong>{confirmAction === 'clearPlayers' ? 'Clear all runtime players?' : 'Reset all runtime scores?'}</strong>
          <span>This is immediate and only affects the current runtime session.</span>
          <div>
            <button type="button" onClick={() => setConfirmAction(null)}>Cancel</button>
            <button
              type="button"
              className="host-danger"
              onClick={() => {
                if (confirmAction === 'clearPlayers') {
                  actions.clearRuntimePlayers();
                } else {
                  actions.resetRuntimeScores();
                }
                setConfirmAction(null);
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
