import { useState, useEffect } from 'react';
import type { MiniGameScoreAward, MiniGameSnapshot } from '../../../../game-core/minigames/minigame-types';
import type { TourAwardsSnapshot } from '../../../../game-core/awards/tour-awards';
import type { CitizenRuntime } from '../../../../game-core/citizens/citizen-types';
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

export type ReusableScoreboardRow = {
  twitchUserId: string;
  displayName: string;
  roundPoints: number[];
  total: number;
};

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

export function RoundScoreBoard({
  citizens,
  tour,
  miniGame,
  lastRoundAwards,
}: {
  citizens: CitizenRuntime[];
  tour: TourSnapshot;
  miniGame: MiniGameSnapshot;
  lastRoundAwards: MiniGameScoreAward[];
}) {
  const { actions, snapshot } = useGame();
  const t = useTranslation();
  const isLastRound = tour.roundNumber >= tour.totalRounds;
  const isTourMode = snapshot.activeSessionMode === 'tour';
  const shouldShowTourIntermission = isTourMode && !isLastRound;
  const hasPendingAnswers = miniGame.answerRecords.length > 0 && miniGame.status !== 'scored' && lastRoundAwards.length === 0;
  const rows = buildReusableScoreboardRows({
    citizens,
    tourRows: snapshot.tourScoreboardRows,
    lastRoundAwards,
    totalRounds: tour.totalRounds,
    currentRound: tour.roundNumber,
  });
  const nextMiniGameTitle = shouldShowTourIntermission ? getMiniGameTitle(snapshot.nextMiniGameId, snapshot.locale) : null;

  if (shouldShowTourIntermission) {
    return (
      <RoundIntermissionScreen
        rows={rows}
        currentMiniGameTitle={miniGame.title}
        nextMiniGameTitle={nextMiniGameTitle}
        roundProgress={`${tour.roundNumber}/${tour.totalRounds}`}
        isLoading={hasPendingAnswers}
        primaryActionLabel={t('ui.startRound')}
        onPrimaryAction={actions.skipPhase}
      />
    );
  }

  return (
    <ReusableScoreboard
      title={isTourMode && isLastRound ? t('gameplay.score.scoreboard') : t('gameplay.score.roundScore')}
      contextLabel={miniGame.title}
      progressLabel={isTourMode && isLastRound ? undefined : `${tour.roundNumber}/${tour.totalRounds}`}
      rows={rows}
      totalRounds={tour.totalRounds}
      currentRound={tour.roundNumber}
      emptyLabel={snapshot.locale === 'ar' ? 'لا توجد نتائج بعد.' : 'No scores yet.'}
      isLoading={hasPendingAnswers}
      loadingTitle={snapshot.locale === 'ar' ? 'جاري حساب النقاط...' : 'Calculating scores...'}
      loadingSubtitle={t('gameplay.score.calculatingHint')}
      primaryActionLabel={isLastRound ? t('gameplay.score.viewFinal') : t('gameplay.next')}
      onPrimaryAction={actions.skipPhase}
    />
  );
}

export function RoundIntermissionScreen({
  rows,
  currentMiniGameTitle,
  nextMiniGameTitle,
  roundProgress,
  isLoading,
  primaryActionLabel,
  onPrimaryAction,
}: {
  rows: ReusableScoreboardRow[];
  currentMiniGameTitle: string;
  nextMiniGameTitle: string | null;
  roundProgress: string;
  isLoading: boolean;
  primaryActionLabel: string;
  onPrimaryAction: () => void;
}) {
  const t = useTranslation();
  const { snapshot } = useGame();
  const topRows = rows.slice(0, 3);

  return (
    <div className="show-intermission-v19 show-intermission-v21" dir={snapshot.direction}>
      <ScoreboardAmbientLights celebrateLeader={!isLoading && (topRows[0]?.total ?? 0) > 0} />
      <ScoreboardHero title={t('gameplay.score.topThree')} contextLabel={currentMiniGameTitle} progressLabel={roundProgress} />
      <div className="show-intermission-body">
        {isLoading ? (
          <div className="show-score-loading" role="status">{t('gameplay.score.calculating')}</div>
        ) : topRows.length === 0 ? (
          <div className="show-score-empty">{t('ui.noScores')}</div>
        ) : (
          <div className="show-intermission-podium" aria-label={t('gameplay.score.topThree')}>
            {topRows.map((row, index) => (
              <article key={row.twitchUserId} className={`show-intermission-player show-intermission-player-${index + 1}`}>
                <span className="show-intermission-place">#{index + 1}</span>
                <span className="show-intermission-avatar" aria-hidden="true">{row.displayName.trim().slice(0, 2).toUpperCase()}</span>
                <strong title={row.displayName}>{row.displayName}</strong>
                <b>{row.total}<small> {t('gameplay.score.pointsShort')}</small></b>
              </article>
            ))}
          </div>
        )}
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
  const rows = buildReusableScoreboardRows({
    citizens,
    tourRows: tourAwards.scoreboardRows.length > 0 ? tourAwards.scoreboardRows : snapshot.tourScoreboardRows,
    lastRoundAwards,
    totalRounds: tour.totalRounds,
    currentRound: tour.roundNumber,
  });
  const wasEndedFromSettings = snapshot.activeSessionMode === null;

  return (
    <ReusableScoreboard
      title={wasEndedFromSettings ? t('gameplay.score.sessionEnded') : t('gameplay.score.scoreboard')}
      contextLabel={snapshot.locale === 'ar' ? 'تحدي الجيل' : 'Ta7ady ElGeel'}
      progressLabel={wasEndedFromSettings ? `${tour.roundNumber}/${Math.max(1, tour.totalRounds)}` : undefined}
      rows={rows}
      totalRounds={tour.totalRounds}
      currentRound={wasEndedFromSettings ? tour.roundNumber : tour.totalRounds}
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
}: {
  citizens: CitizenRuntime[];
  tourRows: { twitchUserId: string; displayName: string; role: string; roundPoints: number[]; total: number }[];
  lastRoundAwards: MiniGameScoreAward[];
  totalRounds: number;
  currentRound: number;
}): ReusableScoreboardRow[] {
  const roundCount = Math.max(1, totalRounds || currentRound || 1);
  const currentRoundIndex = Math.max(0, currentRound - 1);
  const tourRowsById = new Map(tourRows.filter((row) => row.role === 'official').map((row) => [row.twitchUserId, row]));
  const awardPointsById = new Map<string, number>();

  for (const award of lastRoundAwards.filter((entry) => entry.role === 'official')) {
    awardPointsById.set(award.twitchUserId, (awardPointsById.get(award.twitchUserId) ?? 0) + award.points);
  }

  const baseRows = citizens
    .filter((citizen) => citizen.role === 'official')
    .map((citizen) => {
      const sourceRow = tourRowsById.get(citizen.twitchUserId);
      const roundPoints = Array.from({ length: roundCount }, (_, index) => sourceRow?.roundPoints[index] ?? 0);
      const currentAward = awardPointsById.get(citizen.twitchUserId);

      if (currentAward !== undefined && roundPoints[currentRoundIndex] === 0) {
        roundPoints[currentRoundIndex] = currentAward;
      }

      const total = (sourceRow?.total ?? roundPoints.reduce((sum, value) => sum + value, 0)) || citizen.score;

      return {
        twitchUserId: citizen.twitchUserId,
        displayName: sourceRow?.displayName ?? citizen.displayName,
        roundPoints,
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
      total: sourceRow.total,
    });
  }

  return baseRows.sort((a, b) => b.total - a.total || a.displayName.localeCompare(b.displayName));
}

export function ReusableScoreboard({
  title,
  contextLabel,
  progressLabel,
  rows,
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
}: {
  title: string;
  contextLabel: string;
  progressLabel?: string;
  rows: ReusableScoreboardRow[];
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
}) {
  const { snapshot } = useGame();
  const t = useTranslation();
  const roundIndexes = getVisibleScoreboardRoundIndexes(totalRounds, currentRound);
  const pageCount = getScoreboardPageCount(rows.length, SCOREBOARD_PAGE_SIZE);
  const [page, setPage] = useState(0);
  const participantSignature = getScoreboardParticipantSignature(rows);
  const safePage = clampScoreboardPage(page, pageCount);
  const isArabic = snapshot.locale === 'ar';

  useEffect(() => setPage(0), [participantSignature, currentRound]);
  useEffect(() => {
    setPage((currentPage) => clampScoreboardPage(currentPage, pageCount));
  }, [pageCount]);
  // For large Twitch crowds, cycle through pages on stream without requiring
  // the host to manually click eight pages. The controls remain available.
  useEffect(() => {
    if (pageCount <= 1 || isLoading) return undefined;
    const id = window.setInterval(() => setPage((currentPage) => (currentPage + 1) % pageCount), 8500);
    return () => window.clearInterval(id);
  }, [isLoading, pageCount, participantSignature]);

  const visibleRows = getScoreboardPageRows(rows, safePage, SCOREBOARD_PAGE_SIZE);
  const pageStart = safePage * SCOREBOARD_PAGE_SIZE;
  const leader = safePage === 0 ? visibleRows[0] : undefined;
  const detailRows = leader ? visibleRows.slice(1) : visibleRows;
  const leaderInitials = leader?.displayName.trim().slice(0, 2).toUpperCase() || 'P';

  return (
    <section className={`show-scoreboard-v19 show-scoreboard-v21 ${isFinal ? 'show-scoreboard-final' : ''} ${isEndedEarly ? 'show-scoreboard-ended-early' : ''} ${rows.some((row) => row.total > 0) ? 'show-scoreboard-has-points' : ''} ${rows.length >= 5 ? 'show-scoreboard-crowded' : ''} ${rows.length === 1 ? 'show-scoreboard-solo' : ''} ${!isLoading && !isEndedEarly && safePage === 0 && (leader?.total ?? 0) > 0 ? 'show-scoreboard-winner-v22' : ''}`} dir={snapshot.direction}>
      <ScoreboardAmbientLights celebrateLeader={!isLoading && !isEndedEarly && safePage === 0 && (leader?.total ?? 0) > 0} />
      <ScoreboardHero title={title} contextLabel={contextLabel} progressLabel={progressLabel} />
      <div className="show-scoreboard-surface">
        {isLoading ? (
          <div className="show-score-loading" role="status"><strong>{loadingTitle}</strong><small>{loadingSubtitle}</small></div>
        ) : rows.length === 0 ? (
          <div className="show-score-empty">{emptyLabel}</div>
        ) : (
          <div className="show-scoreboard-body">
            {leader ? (
              <div className="show-score-leader" aria-label={`${t('gameplay.score.rank')} 1: ${leader.displayName}`}>
                <span className="show-score-place">#1</span>
                <div className="show-score-avatar" aria-hidden="true">{leaderInitials}</div>
                <div className="show-score-leader-identity">
                  <strong title={leader.displayName}>{leader.displayName}</strong>
                  <span className="show-score-rounds show-score-rounds-sr-v23">
                    {roundIndexes.map((roundIndex) => (
                      <span key={roundIndex}>
                        {isArabic ? 'الجولة' : 'Round'} {roundIndex + 1}: {leader.roundPoints[roundIndex] ?? 0}.
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
                      <span title={row.displayName}>{row.displayName}</span>
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
            <nav aria-label={isArabic ? 'صفحات النتائج' : 'Scoreboard pages'}>
              <button type="button" disabled={safePage === 0} onClick={() => setPage((p) => clampScoreboardPage(p - 1, pageCount))} aria-label={isArabic ? 'السابق' : 'Previous'}>‹</button>
              <strong aria-live="polite">{safePage + 1} / {pageCount}</strong>
              <button type="button" disabled={safePage === pageCount - 1} onClick={() => setPage((p) => clampScoreboardPage(p + 1, pageCount))} aria-label={isArabic ? 'التالي' : 'Next'}>›</button>
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
