import { translate } from '../../../../game-core/localization/translations';
import { useState, useEffect } from 'react';
import type { MiniGameScoreAward, MiniGameSnapshot } from '../../../../game-core/minigames/minigame-types';
import type { TourAwardsSnapshot } from '../../../../game-core/awards/tour-awards';
import type { CitizenRuntime } from '../../../../game-core/citizens/citizen-types';
import type { ChaosPlayerReward } from '../../../../game-core/chaos/chaos-types';
import type { TourSnapshot } from '../../../../game-core/tours/tour-types';
import { useGame } from '../../../context/GameContext';
import { useTranslation } from '../../../i18n/useTranslation';
import { getCorrectAnswerText, getMiniGameTitle } from '../shared/overlay-types';
import { formatCorrectParticipation } from '../shared/answer-helpers';
import {
  clampScoreboardPage,
  getScoreboardPageCount,
  getScoreboardPageRows,
  getScoreboardParticipantSignature,
  SCOREBOARD_PAGE_SIZE,
  getVisibleScoreboardRoundIndexes,
} from './scoreboard-pagination';
import { ScoreboardPrimaryAction } from './ScoreboardPrimaryAction';
import { ScoreboardAmbientLights } from './ScoreboardAmbientLights';
import { scopeScoreboardRows, earliestAnswer } from '../../../../game-core/awards/scoreboard-levels';

export type ReusableScoreboardRow = {
  twitchUserId: string;
  displayName: string;
  roundPoints: number[];
  total: number;
  answerOrders?: number[];
};

function ChaosRewardBadges({ userId, rewards, locale }: {
  userId: string; rewards: ChaosPlayerReward[]; locale: 'en' | 'ar';
}) {
  const reward = rewards.find(item => item.twitchUserId === userId);
  if (!reward || (!reward.crown && !reward.shield && !reward.boost)) return null;
  return <span className="chaos-rewards-v40" aria-label={translate(locale, 'ui.scoreboard.goldenRoundRewards')}>
    {reward.crown ? <span title={translate(locale, 'ui.scoreboard.goldenRoundWinner')}>👑</span> : null}
    {reward.shield ? <span title={translate(locale, 'ui.scoreboard.shieldBlocksOneRiskPenalty')}>🛡️</span> : null}
    {reward.boost ? <span title={translate(locale, 'ui.scoreboard.25NextCorrectAnswer')}>✨</span> : null}
  </span>;
}

function XpFinishBadge({ userId }: { userId: string }) {
  const { snapshot } = useGame();
  const result = snapshot.sessionProgressionAwards.find(entry => entry.twitchUserId === userId);
  if (!result) return null;
  const leveledUp = result.newLevel > result.previousLevel;
  const newUnlock = result.unlockedCommandIds
    .map(id => snapshot.progression.commandUnlocks.find(item => item.id === id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const unlockNames = newUnlock.map(unlock => unlock.primaryCommand).join(', ');
  return <span className={`score-xp-finish-v41 ${leveledUp ? 'score-xp-levelup-v41 score-xp-levelup-v42' : ''}`}
    title={`${result.totalXp} XP · ${Math.round(result.progressPercent)}%${unlockNames ? ` · ${translate(snapshot.locale, 'gameplay.score.xpUnlocked', { items: unlockNames })}` : ''}`}>
    <b>+{result.xpEarned} XP</b>
    <small>{leveledUp ? (translate(snapshot.locale, 'ui.scoreboard.levelUpLv', { p0: String(result.newLevel) }))
      : `Lv.${result.newLevel}`}</small>
    {newUnlock.length > 0 ? <span className="score-xp-new-unlock-v42">✦ {newUnlock[0].primaryCommand}</span> : null}
  </span>;
}

export function RoundResult({ miniGame }: { miniGame: MiniGameSnapshot }) {
  const t = useTranslation();
  const correctText = getCorrectAnswerText(miniGame, t);

  return (
    <div className="gameplay-result-card">
      <span>{t('gameplay.answer.correct')}</span>
      <strong>{correctText}</strong>
      <small>{formatCorrectParticipation(t, miniGame.correctOfficialCount, miniGame.correctSpectatorCount)}</small>
    </div>
  );
}

/** All scoreboards use the SAME vetted component, with a different scope.
 * Never show the accumulated Tour total before the actual Tour finale. */
export function RoundScoreBoard({
  citizens, tour, miniGame, lastRoundAwards,
}: {
  citizens: CitizenRuntime[];
  tour: TourSnapshot;
  miniGame: MiniGameSnapshot;
  lastRoundAwards: MiniGameScoreAward[];
}) {
  const { actions, snapshot } = useGame();
  const t = useTranslation();
  const segment = snapshot.miniGameSegment;
  const isTour = snapshot.activeSessionMode === 'tour';
  const isEndOfGame = Boolean(segment && tour.roundNumber === segment.lastRound);
  const isLastQuestion = tour.roundNumber >= tour.totalRounds;
  const [showMiniGameResult, setShowMiniGameResult] = useState(false);
  const base = {
    citizens,
    tourRows: snapshot.tourScoreboardRows,
    lastRoundAwards,
    totalRounds: tour.totalRounds,
    currentRound: tour.roundNumber,
  };
  const isLoading = miniGame.answerRecords.length > 0 && miniGame.status !== 'scored' && lastRoundAwards.length === 0;

  // The final Single Game result is displayed on TourCompleteSummary to avoid
  // showing the same mini-game total twice.
  const canShowGameResult = isTour && isEndOfGame;
  const scope = showMiniGameResult && segment
    ? { kind: 'mini-game' as const, firstRound: segment.firstRound, lastRound: segment.lastRound }
    : { kind: 'question' as const, round: tour.roundNumber };
  const players = scopeScoreboardRows(buildReusableScoreboardRows({ ...base }), scope);
  const spectators = scopeScoreboardRows(buildReusableScoreboardRows({ ...base, role: 'spectator' }), scope);
  const gameName = miniGame.title;
  const progressValue = segment ? `${segment.questionNumber}/${segment.questionCount}` : `${tour.roundNumber}/${tour.totalRounds}`;
  const label = showMiniGameResult
    ? (translate(snapshot.locale, 'ui.scoreboard.result', { p0: String(gameName) }))
    : (translate(snapshot.locale, 'ui.scoreboard.questionResult', { p0: String(progressValue) }));
  const action = showMiniGameResult
    ? (isLastQuestion ? (translate(snapshot.locale, 'ui.scoreboard.revealTourWinner')) : t('gameplay.next'))
    : canShowGameResult
      ? (translate(snapshot.locale, 'ui.scoreboard.miniGameResult'))
      : isLastQuestion ? (translate(snapshot.locale, 'ui.scoreboard.miniGameResult2')) : t('gameplay.next');
  const advance = () => {
    if (!showMiniGameResult && canShowGameResult) { setShowMiniGameResult(true); return; }
    actions.skipPhase();
  };
  const displayCount = showMiniGameResult ? (segment?.questionCount ?? 1) : 1;

  return <ReusableScoreboard
    title={translate(snapshot.locale, 'ui.scoreboard.ranking')}
    scopeLabel={label}
    contextLabel={gameName}
    progressLabel={showMiniGameResult ? `${segment?.questionCount ?? 1} ${translate(snapshot.locale, 'ui.scoreboard.questions')}` : undefined}
    rows={players}
    spectatorRows={spectators}
    totalRounds={displayCount}
    currentRound={displayCount}
    emptyLabel={translate(snapshot.locale, 'ui.scoreboard.noScoresYet')}
    isLoading={isLoading}
    loadingTitle={translate(snapshot.locale, 'ui.scoreboard.calculatingScores')}
    loadingSubtitle={t('gameplay.score.calculatingHint')}
    primaryActionLabel={action}
    onPrimaryAction={advance}
  />;
}

export function RoundIntermissionScreen({
  rows,
  spectatorRows,
  currentMiniGameTitle,
  nextMiniGameTitle,
  roundProgress,
  isLoading,
  primaryActionLabel,
  onPrimaryAction,
}: {
  rows: ReusableScoreboardRow[];
  spectatorRows: ReusableScoreboardRow[];
  currentMiniGameTitle: string;
  nextMiniGameTitle: string | null;
  roundProgress: string;
  isLoading: boolean;
  primaryActionLabel: string;
  onPrimaryAction: () => void;
}) {
  const t = useTranslation();
  const { snapshot } = useGame();
  const [selectedBoard, setSelectedBoard] = useState<'official' | 'spectator'>('official');
  const displayedRows = selectedBoard === 'official' ? rows : spectatorRows;
  const topRows = displayedRows.slice(0, 3);
  useEffect(() => setSelectedBoard('official'), [roundProgress]);

  return (
    <div className="show-intermission-v19 show-intermission-v21" dir={snapshot.direction}>
      <ScoreboardAmbientLights celebrateLeader={!isLoading && (topRows[0]?.total ?? 0) > 0} />
      <ScoreboardHero title={selectedBoard === 'spectator'
        ? (translate(snapshot.locale, 'ui.scoreboard.top3Spectators'))
        : t('gameplay.score.topThree')} contextLabel={currentMiniGameTitle} progressLabel={roundProgress} />
      <div className="show-intermission-body">
        <nav className="show-scoreboard-roles-v39 show-intermission-roles-v39" aria-label={translate(snapshot.locale, 'ui.scoreboard.chooseScoreboard')}>
          <button type="button" className={selectedBoard === 'official' ? 'selected' : ''} aria-pressed={selectedBoard === 'official'} onClick={() => setSelectedBoard('official')}>
            {translate(snapshot.locale, 'ui.scoreboard.players')} <span>{rows.length}</span>
          </button>
          <button type="button" className={selectedBoard === 'spectator' ? 'selected' : ''} aria-pressed={selectedBoard === 'spectator'} onClick={() => setSelectedBoard('spectator')}>
            {translate(snapshot.locale, 'ui.scoreboard.spectators')} <span>{spectatorRows.length}</span>
          </button>
        </nav>
        {isLoading ? (
          <div className="show-score-loading" role="status">{t('gameplay.score.calculating')}</div>
        ) : topRows.length === 0 ? (
          <div className="show-score-empty">{selectedBoard === 'spectator'
            ? (translate(snapshot.locale, 'ui.scoreboard.noSpectatorsYet'))
            : t('ui.noScores')}</div>
        ) : (
          <div className="show-intermission-podium" aria-label={selectedBoard === 'spectator' ? (translate(snapshot.locale, 'ui.scoreboard.topSpectators')) : t('gameplay.score.topThree')}>
            {topRows.map((row, index) => (
              <article key={row.twitchUserId} className={`show-intermission-player show-intermission-player-${index + 1}`}>
                <span className="show-intermission-place">#{index + 1}</span>
                <span className="show-intermission-avatar" aria-hidden="true">{row.displayName.trim().slice(0, 2).toUpperCase()}</span>
                <strong title={row.displayName}>{row.displayName} {selectedBoard === 'official' ? <ChaosRewardBadges userId={row.twitchUserId} rewards={snapshot.chaosRewards} locale={snapshot.locale} /> : null}</strong>
                <b>{row.total}<small> {t('gameplay.score.pointsShort')}</small></b>
              </article>
            ))}
          </div>
        )}
        {selectedBoard === 'official' && spectatorRows.length > 0 ? (
          <div className="show-intermission-spectator-v39" aria-label={translate(snapshot.locale, 'ui.scoreboard.spectatorRankings')}>
            <span>{translate(snapshot.locale, 'ui.scoreboard.topSpectator')}</span>
            <strong>{spectatorRows[0].total > 0 ? spectatorRows[0].displayName : (translate(snapshot.locale, 'ui.scoreboard.noPointsYet'))}</strong>
            <b>{spectatorRows[0].total > 0 ? spectatorRows[0].total : 0} {t('gameplay.score.pointsShort')}</b>
            <small>{translate(snapshot.locale, 'ui.scoreboard.spectators2', { p0: String(spectatorRows.length) })}</small>
          </div>
        ) : null}
        <div className="show-intermission-next">
          <span>{t('gameplay.score.nextMiniGame')}</span>
          <strong>{nextMiniGameTitle ?? t('gameplay.score.finalScoreboard')}</strong>
        </div>
      </div>
      <ScoreboardPrimaryAction label={primaryActionLabel} onClick={onPrimaryAction} />
    </div>
  );
}

export function TourCompleteSummary({
  citizens,
  tour,
  tourAwards,
  lastRoundAwards,
}: {
  citizens: CitizenRuntime[];
  tour: TourSnapshot;
  tourAwards: TourAwardsSnapshot;
  lastRoundAwards: MiniGameScoreAward[];
}) {
  const { actions, snapshot } = useGame();
  const t = useTranslation();
  // The final result is frozen when TourComplete is entered. New !join commands
  // while the final stage is visible must not rewrite the finished ranking.
  const finalParticipants = tourAwards.scoreboardRows.length > 0
    ? citizens.filter((citizen) => tourAwards.scoreboardRows.some((row) => row.twitchUserId === citizen.twitchUserId))
    : citizens;
  const rows = buildReusableScoreboardRows({
    citizens: finalParticipants,
    tourRows: tourAwards.scoreboardRows.length > 0 ? tourAwards.scoreboardRows : snapshot.tourScoreboardRows,
    lastRoundAwards,
    totalRounds: tour.totalRounds,
    currentRound: tour.roundNumber,
  });
  const spectatorRows = buildReusableScoreboardRows({
    citizens: finalParticipants,
    tourRows: tourAwards.scoreboardRows.length > 0 ? tourAwards.scoreboardRows : snapshot.tourScoreboardRows,
    lastRoundAwards,
    totalRounds: tour.totalRounds,
    currentRound: tour.roundNumber,
    role: 'spectator',
  });
  const wasEndedFromSettings = snapshot.activeSessionMode === null;
  const isSingleGame = snapshot.activeSessionMode === 'mini-game';
  const scope = isSingleGame && snapshot.miniGameSegment
    ? { kind: 'mini-game' as const, firstRound: snapshot.miniGameSegment.firstRound, lastRound: snapshot.miniGameSegment.lastRound }
    : { kind: 'tour' as const };
  const displayRows = scopeScoreboardRows(rows, scope);
  const displaySpectators = scopeScoreboardRows(spectatorRows, scope);
  const title = isSingleGame
    ? (translate(snapshot.locale, 'ui.scoreboard.result2', { p0: String(snapshot.miniGame.title) }))
    : wasEndedFromSettings ? t('gameplay.score.sessionEnded')
    : (translate(snapshot.locale, 'ui.scoreboard.tourFinalResult'));

  return (
    <ReusableScoreboard
      title={title}
      scopeLabel={title}
      contextLabel={isSingleGame ? snapshot.miniGame.title : translate(snapshot.locale, 'ui.landing.brand')}
      progressLabel={wasEndedFromSettings ? `${tour.roundNumber}/${Math.max(1, tour.totalRounds)}` : undefined}
      rows={displayRows}
      spectatorRows={displaySpectators}
      totalRounds={isSingleGame ? snapshot.miniGameSegment?.questionCount ?? tour.totalRounds : tour.totalRounds}
      currentRound={isSingleGame ? snapshot.miniGameSegment?.questionCount ?? tour.totalRounds : wasEndedFromSettings ? tour.roundNumber : tour.totalRounds}
      emptyLabel={t('ui.noScores')}
      primaryActionLabel={t('ui.backToStage')}
      onPrimaryAction={actions.backToStage}
      isFinal
      isEndedEarly={wasEndedFromSettings}
    />
  );
}

export function buildReusableScoreboardRows({
  citizens,
  tourRows,
  lastRoundAwards,
  totalRounds,
  currentRound,
  role = 'official',
}: {
  citizens: CitizenRuntime[];
  role?: 'official' | 'spectator';
  tourRows: { twitchUserId: string; displayName: string; role: string; roundPoints: number[]; answerOrders?: number[]; total: number }[];
  lastRoundAwards: MiniGameScoreAward[];
  totalRounds: number;
  currentRound: number;
}): ReusableScoreboardRow[] {
  const roundCount = Math.max(1, totalRounds || currentRound || 1);
  const currentRoundIndex = Math.max(0, currentRound - 1);
  const tourRowsById = new Map(tourRows.filter((row) => row.role === role).map((row) => [row.twitchUserId, row]));
  const awardPointsById = new Map<string, number>();

  for (const award of lastRoundAwards.filter((entry) => entry.role === role)) {
    awardPointsById.set(award.twitchUserId, (awardPointsById.get(award.twitchUserId) ?? 0) + award.points);
  }

  const baseRows = citizens
    .filter((citizen) => citizen.role === role)
    .map((citizen) => {
      const sourceRow = tourRowsById.get(citizen.twitchUserId);
      const roundPoints = Array.from({ length: roundCount }, (_, index) => sourceRow?.roundPoints[index] ?? 0);
      const currentAward = awardPointsById.get(citizen.twitchUserId);

      // A tracked zero can be intentional (score clamps/Chaos penalties). Only
      // fall back to the raw award when the canonical Tour row is unavailable.
      if (!sourceRow && currentAward !== undefined) {
        roundPoints[currentRoundIndex] = currentAward;
      }

      const total = sourceRow?.total ?? roundPoints.reduce((sum, value) => sum + value, 0);

      return {
        twitchUserId: citizen.twitchUserId,
        displayName: sourceRow?.displayName ?? citizen.displayName,
        roundPoints,
        answerOrders: sourceRow?.answerOrders ?? [],
        total,
      };
    });

  for (const sourceRow of tourRowsById.values()) {
    if (baseRows.some((row) => row.twitchUserId === sourceRow.twitchUserId)) {
      continue;
    }

    baseRows.push({
      twitchUserId: sourceRow.twitchUserId,
      displayName: sourceRow.displayName,
      roundPoints: Array.from({ length: roundCount }, (_, index) => sourceRow.roundPoints[index] ?? 0),
      answerOrders: sourceRow.answerOrders ?? [],
      total: sourceRow.total,
    });
  }

  return baseRows.sort((a, b) => b.total - a.total || earliestAnswer(a) - earliestAnswer(b)
    || a.displayName.localeCompare(b.displayName));
}

export function ReusableScoreboard({
  title,
  contextLabel,
  progressLabel,
  rows,
  spectatorRows = [],
  totalRounds,
  currentRound,
  primaryActionLabel,
  onPrimaryAction,
  emptyLabel = 'No scores yet.',
  isLoading = false,
  loadingTitle = 'Calculating scores...',
  loadingSubtitle = 'One small moment.',
  isFinal = false,
  isEndedEarly = false,
  scopeLabel,
}: {
  title: string;
  contextLabel: string;
  progressLabel?: string;
  rows: ReusableScoreboardRow[];
  spectatorRows?: ReusableScoreboardRow[];
  totalRounds: number;
  currentRound: number;
  primaryActionLabel: string;
  onPrimaryAction: () => void;
  emptyLabel?: string;
  isLoading?: boolean;
  loadingTitle?: string;
  loadingSubtitle?: string;
  isFinal?: boolean;
  isEndedEarly?: boolean;
  scopeLabel?: string;
}) {
  const { snapshot } = useGame();
  const t = useTranslation();
  const roundIndexes = getVisibleScoreboardRoundIndexes(totalRounds, currentRound);
  const [selectedBoard, setSelectedBoard] = useState<'official' | 'spectator'>('official');
  const displayedRows = selectedBoard === 'spectator' ? spectatorRows : rows;
  const pageCount = getScoreboardPageCount(displayedRows.length, SCOREBOARD_PAGE_SIZE);
  const [page, setPage] = useState(0);
  const participantSignature = getScoreboardParticipantSignature(displayedRows);
  const safePage = clampScoreboardPage(page, pageCount);
  const isArabic = snapshot.locale === 'ar';

  useEffect(() => setPage(0), [participantSignature, currentRound, selectedBoard]);
  useEffect(() => {
    setPage((currentPage) => clampScoreboardPage(currentPage, pageCount));
  }, [pageCount]);
  // The host owns scoreboard pagination. Never change pages automatically;
  // spectators need time to find their name and read their score.

  const visibleRows = getScoreboardPageRows(displayedRows, safePage, SCOREBOARD_PAGE_SIZE);
  const pageStart = safePage * SCOREBOARD_PAGE_SIZE;
  const leader = safePage === 0 ? visibleRows[0] : undefined;
  const detailRows = leader ? visibleRows.slice(1) : visibleRows;
  const leaderInitials = leader?.displayName.trim().slice(0, 2).toUpperCase() || 'P';

  return (
    <section className={`show-scoreboard-v19 show-scoreboard-v21 ${isFinal ? 'show-scoreboard-final' : ''} ${selectedBoard === 'spectator' ? 'show-scoreboard-spectators-v39' : ''} ${isEndedEarly ? 'show-scoreboard-ended-early' : ''} ${displayedRows.some((row) => row.total > 0) ? 'show-scoreboard-has-points' : ''} ${displayedRows.length >= 5 ? 'show-scoreboard-crowded' : ''} ${displayedRows.length === 1 ? 'show-scoreboard-solo' : ''} ${!isLoading && !isEndedEarly && selectedBoard === 'official' && safePage === 0 && (leader?.total ?? 0) > 0 ? 'show-scoreboard-winner-v22' : ''}`} dir={snapshot.direction}>
      <ScoreboardAmbientLights celebrateLeader={!isLoading && !isEndedEarly && selectedBoard === 'official' && safePage === 0 && (leader?.total ?? 0) > 0} />
      <ScoreboardHero title={title} contextLabel={contextLabel} progressLabel={progressLabel} />
      <nav className="show-scoreboard-roles-v39" aria-label={translate((isArabic ? 'ar' : 'en'), 'ui.scoreboard.chooseScoreboard2')}>
        <button type="button" className={selectedBoard === 'official' ? 'selected' : ''} aria-pressed={selectedBoard === 'official'} onClick={() => { setSelectedBoard('official'); setPage(0); }}>
          {translate((isArabic ? 'ar' : 'en'), 'ui.scoreboard.players2')} <span>{rows.length}</span>
        </button>
        <button type="button" className={selectedBoard === 'spectator' ? 'selected' : ''} aria-pressed={selectedBoard === 'spectator'} onClick={() => { setSelectedBoard('spectator'); setPage(0); }}>
          {translate((isArabic ? 'ar' : 'en'), 'ui.scoreboard.spectators3')} <span>{spectatorRows.length}</span>
        </button>
      </nav>
      {isFinal && !isEndedEarly && selectedBoard === 'official' && rows[0] && rows[0].total > 0 ? (
        <div className="show-score-winner-banner-v46" role="status" aria-label={translate((isArabic ? 'ar' : 'en'), 'ui.scoreboard.winner', { p0: String(rows[0].displayName) })}>
          <span aria-hidden="true">🏆</span><strong>{translate((isArabic ? 'ar' : 'en'), 'ui.scoreboard.winner2')}</strong><b title={rows[0].displayName}>{rows[0].displayName}</b>
        </div>
      ) : null}
      <div className="show-scoreboard-surface">
        {isLoading ? (
          <div className="show-score-loading" role="status"><strong>{loadingTitle}</strong><small>{loadingSubtitle}</small></div>
        ) : displayedRows.length === 0 ? (
          <div className="show-score-empty">{selectedBoard === 'spectator'
            ? (translate((isArabic ? 'ar' : 'en'), 'ui.scoreboard.noSpectatorsTourYet'))
            : emptyLabel}</div>
        ) : (
          <div className="show-scoreboard-body">
            {scopeLabel ? <div className="scoreboard-scope-label-v79" aria-label={scopeLabel}>{scopeLabel}</div> : null}
            {leader ? (
              <div className="show-score-leader" aria-label={`${selectedBoard === 'spectator' ? (translate((isArabic ? 'ar' : 'en'), 'ui.scoreboard.topSpectator2')) : t('gameplay.score.rank')} 1: ${leader.displayName}`}>
                <span className="show-score-place">{selectedBoard === 'spectator' && leader.total > 0 ? '★' : '#1'}</span>
                <div className="show-score-avatar" aria-hidden="true">{leaderInitials}</div>
                <div className="show-score-leader-identity">
                  {selectedBoard === 'spectator' && leader.total > 0
                    ? <small className="show-scoreboard-best-spectator-v39">{translate((isArabic ? 'ar' : 'en'), 'ui.scoreboard.bestSpectator')}</small>
                    : null}
                  <strong title={leader.displayName}>{leader.displayName} {selectedBoard === 'official' ? <ChaosRewardBadges userId={leader.twitchUserId} rewards={snapshot.chaosRewards} locale={snapshot.locale} /> : null}</strong>
                  {isFinal && selectedBoard === 'official' ? <XpFinishBadge userId={leader.twitchUserId} /> : null}
                  <span className="show-score-rounds show-score-rounds-sr-v23">
                    {roundIndexes.map((roundIndex) => (
                      <span key={roundIndex}>
                        {translate((isArabic ? 'ar' : 'en'), 'ui.scoreboard.round')} {roundIndex + 1}: {leader.roundPoints[roundIndex] ?? 0}.
                      </span>
                    ))}
                  </span>
                </div>
                <div className="show-score-leader-points" aria-label={`${leader.total} ${t('gameplay.score.pointsShort')}`}><b>{leader.total}</b></div>
              </div>
            ) : null}
            {detailRows.length > 0 ? (
              <div className="show-score-ranking" aria-label={t('gameplay.score.playerList')}>
                {detailRows.map((row, index) => {
                  const rank = (leader ? 1 : 0) + pageStart + index + 1;
                  return (
                    <div className="show-score-ranking-row" key={row.twitchUserId}>
                      <b>#{rank}</b>
                      <span className="scoreboard-name-badges-v40"><span title={row.displayName}>{row.displayName}</span>{selectedBoard === 'official' ? <ChaosRewardBadges userId={row.twitchUserId} rewards={snapshot.chaosRewards} locale={snapshot.locale} /> : null}{isFinal && selectedBoard === 'official' ? <XpFinishBadge userId={row.twitchUserId} /> : null}</span>
                      <strong>{row.total}</strong>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        )}
      </div>
      <div className="show-score-footer">
        <div className="show-score-pages">
          {pageCount > 1 ? (
            <nav aria-label={translate((isArabic ? 'ar' : 'en'), 'ui.scoreboard.scoreboardPages')}>
              <button type="button" disabled={safePage === 0} onClick={() => setPage((p) => clampScoreboardPage(p - 1, pageCount))} aria-label={translate((isArabic ? 'ar' : 'en'), 'ui.scoreboard.previous')}>‹</button>
              <strong aria-live="polite">{safePage + 1} / {pageCount}</strong>
              <button type="button" disabled={safePage === pageCount - 1} onClick={() => setPage((p) => clampScoreboardPage(p + 1, pageCount))} aria-label={translate((isArabic ? 'ar' : 'en'), 'ui.scoreboard.next')}>›</button>
            </nav>
          ) : null}
        </div>
        <ScoreboardPrimaryAction label={primaryActionLabel} onClick={onPrimaryAction} />
      </div>
    </section>
  );
}

/** Same two-part screen banner as the shared question HUD: game | result phase. */
export function ScoreboardHero({ title, contextLabel, progressLabel }: {
  title: string;
  contextLabel: string;
  progressLabel?: string;
}) {
  return (
    <header className="show-score-hero show-score-hero-v23">
      <div className="show-score-banner-v23" role="heading" aria-level={2}>
        <span className="show-score-banner-context-v23">{contextLabel}</span>
        <span className="show-score-banner-title-v23">
          <span className="show-score-banner-star-v23" aria-hidden="true">✦</span>
          <span>{title}{progressLabel ? <> <bdi className="show-score-banner-progress-v23">{progressLabel}</bdi></> : null}</span>
          <span className="show-score-banner-star-v23" aria-hidden="true">✦</span>
        </span>
      </div>
    </header>
  );
}
