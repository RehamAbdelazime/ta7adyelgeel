import { useState, useEffect, type CSSProperties } from 'react';
import type { MiniGameScoreAward, MiniGameSnapshot } from '../../../../game-core/minigames/minigame-types';
import type { TourAwardsSnapshot } from '../../../../game-core/awards/tour-awards';
import type { CitizenRuntime } from '../../../../game-core/citizens/citizen-types';
import type { TourPhase, TourSnapshot } from '../../../../game-core/tours/tour-types';
import { useGame } from '../../../context/GameContext';
import { useTranslation } from '../../../i18n/useTranslation';
import { getCorrectAnswerText, getMiniGameTitle, type TranslateFn } from '../shared/overlay-types';
import { formatCorrectParticipation } from '../shared/answer-helpers';

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
  const roundLabel = `${t('gameplay.round.label')} ${tour.roundNumber} / ${tour.totalRounds}`;
  const spectatorCount = citizens.filter((citizen) => citizen.role === 'spectator').length;

  if (shouldShowTourIntermission) {
    return (
      <RoundIntermissionScreen
        rows={rows}
        currentMiniGameTitle={miniGame.title}
        nextMiniGameTitle={nextMiniGameTitle}
        roundLabel={roundLabel}
        isLoading={hasPendingAnswers}
        primaryActionLabel={'START'}
        onPrimaryAction={actions.skipPhase}
      />
    );
  }

  return (
    <ReusableScoreboard
      title={isTourMode && isLastRound ? t('gameplay.score.scoreboard') : t('gameplay.score.roundScore')}
      subtitle={isTourMode && isLastRound ? `${miniGame.title} · FINAL ROUND` : `${miniGame.title} · ${roundLabel}`}
      rows={rows}
      totalRounds={tour.totalRounds}
      currentRound={tour.roundNumber}
      spectatorCount={spectatorCount}
      emptyLabel={snapshot.locale === 'ar' ? 'لا توجد نتائج بعد.' : 'No scores yet.'}
      isLoading={hasPendingAnswers}
      loadingTitle={snapshot.locale === 'ar' ? 'جاري حساب النقاط...' : 'Calculating scores...'}
      loadingSubtitle={'One small moment.'}
      primaryActionLabel={isLastRound ? ('VIEW FINAL SCORE') : ('NEXT')}
      onPrimaryAction={actions.skipPhase}
    />
  );
}

export function RoundIntermissionScreen({
  rows,
  currentMiniGameTitle,
  nextMiniGameTitle,
  roundLabel,
  isLoading,
  primaryActionLabel,
  onPrimaryAction,
}: {
  rows: ReusableScoreboardRow[];
  currentMiniGameTitle: string;
  nextMiniGameTitle: string | null;
  roundLabel: string;
  isLoading: boolean;
  primaryActionLabel: string;
  onPrimaryAction: () => void;
}) {
  const t = useTranslation();
  const topRows = rows.slice(0, 3);

  return (
    <div className="gameplay-round-intermission">
      <ScoreboardHero title={primaryActionLabel === 'START' ? 'TOP 3' : 'TOP 3'} subtitle={roundLabel} />
      <div className="gameplay-round-intermission-panel">
        <span className="gameplay-round-finished-label">{currentMiniGameTitle}</span>
        <div className="gameplay-round-intermission-content">
          {isLoading ? (
            <div className="gameplay-score-loader gameplay-reusable-score-loader" role="status">
              <strong>{primaryActionLabel}</strong>
              <small />
            </div>
          ) : topRows.length === 0 ? (
            <p className="gameplay-scoreboard-empty">{primaryActionLabel}</p>
          ) : (
            <div className="gameplay-round-top3-list" aria-label="Top three players">
              {topRows.map((row, index) => (
                <article key={row.twitchUserId} className={`gameplay-round-top3-card gameplay-round-top3-${index + 1}`}>
                  <b>#{index + 1}</b>
                  <strong>{row.displayName}</strong>
                  <span>{row.total} pts</span>
                </article>
              ))}
            </div>
          )}
          <div className="gameplay-next-mini-game-card">
            <small>{t('gameplay.score.nextMiniGame')}</small>
            <strong>{nextMiniGameTitle ?? t('gameplay.score.finalScoreboard')}</strong>
          </div>
        </div>
        <button className="gameplay-scoreboard-back-button gameplay-show-final-button gameplay-round-intermission-start" type="button" onClick={onPrimaryAction}>{primaryActionLabel}</button>
      </div>
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
  const spectatorCount = citizens.filter((citizen) => citizen.role === 'spectator').length;

  return (
    <ReusableScoreboard
      title={t('gameplay.score.scoreboard')}
      subtitle={tour.totalRounds > 0 ? `FINAL · ${tour.totalRounds} ROUNDS` : t('ui.finalScoreboard')}
      rows={rows}
      totalRounds={tour.totalRounds}
      currentRound={tour.totalRounds}
      spectatorCount={spectatorCount}
      emptyLabel={t('ui.noScores')}
      primaryActionLabel={t('ui.backToStage')}
      onPrimaryAction={actions.backToStage}
      isFinal
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
  subtitle,
  rows,
  totalRounds,
  currentRound,
  primaryActionLabel,
  onPrimaryAction,
  emptyLabel = 'No scores yet.',
  spectatorCount = 0,
  isLoading = false,
  loadingTitle = 'Calculating scores...',
  loadingSubtitle = 'One small moment.',
  isFinal = false,
}: {
  title: string;
  subtitle: string;
  rows: ReusableScoreboardRow[];
  totalRounds: number;
  currentRound: number;
  primaryActionLabel: string;
  onPrimaryAction: () => void;
  emptyLabel?: string;
  spectatorCount?: number;
  isLoading?: boolean;
  loadingTitle?: string;
  loadingSubtitle?: string;
  isFinal?: boolean;
}) {
  const t = useTranslation();
  const visibleRoundCount = Math.max(1, Math.min(5, totalRounds || currentRound || 1));
  const pageSize = 8;
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const [page, setPage] = useState(0);
  const rowsSignature = rows.map((row) => `${row.twitchUserId}:${row.total}:${row.roundPoints.join(',')}`).join('|');

  useEffect(() => {
    setPage(0);
  }, [rowsSignature, visibleRoundCount]);

  useEffect(() => {
    setPage((currentPage: number) => Math.min(currentPage, pageCount - 1));
  }, [pageCount]);

  const pageStart = page * pageSize;
  const visibleRows = rows.slice(pageStart, pageStart + pageSize);
  const roundIndexes = Array.from({ length: visibleRoundCount }, (_, index) => index);

  return (
    <div className={`gameplay-reusable-scoreboard ${isFinal ? 'gameplay-reusable-scoreboard-final' : 'gameplay-reusable-scoreboard-round'}`} style={{ '--score-round-count': visibleRoundCount } as CSSProperties}>
      <ScoreboardHero title={title} subtitle={subtitle} />

      <div className="gameplay-reusable-scoreboard-panel">
        <div className="gameplay-reusable-scoreboard-topline" />
        <div className="gameplay-reusable-scoreboard-head" aria-hidden="true">
          <b>{t('gameplay.score.rank')}</b>
          <span>{t('gameplay.score.player')}</span>
          {roundIndexes.map((roundIndex) => <i key={roundIndex}>R{roundIndex + 1}</i>)}
          <strong>{t('gameplay.score.total')}</strong>
        </div>

        {isLoading ? (
          <div className="gameplay-score-loader gameplay-reusable-score-loader" role="status">
            <strong>{loadingTitle}</strong>
            <small>{loadingSubtitle}</small>
          </div>
        ) : rows.length === 0 ? (
          <p className="gameplay-scoreboard-empty">{emptyLabel}</p>
        ) : (
          <div className="gameplay-reusable-scoreboard-list" aria-label="Player scoreboard">
            {visibleRows.map((row, index) => {
              const rank = pageStart + index + 1;
              const initials = row.displayName.trim().slice(0, 2).toUpperCase() || 'P';
              const highlightedRoundIndex = Math.max(0, Math.min(visibleRoundCount - 1, currentRound - 1));

              return (
                <div key={row.twitchUserId} className={`gameplay-reusable-scoreboard-row gameplay-score-rank-${rank <= 3 ? rank : 'normal'}`}>
                  <b><span>{rank}</span></b>
                  <div className="gameplay-score-player-cell">
                    <em>{initials}</em>
                    <span>{row.displayName}</span>
                  </div>
                  {roundIndexes.map((roundIndex) => {
                    const value = row.roundPoints[roundIndex] ?? 0;
                    return (
                      <i key={roundIndex} className={roundIndex === highlightedRoundIndex && value > 0 ? 'gameplay-score-current-round' : ''}>
                        {value > 0 ? value : '·'}
                      </i>
                    );
                  })}
                  <strong>{row.total}</strong>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="gameplay-scoreboard-bottom-bar">
        {pageCount > 1 ? (
          <div className="gameplay-scoreboard-pagination" aria-label="Scoreboard pages">
            <button type="button" onClick={() => setPage((currentPage: number) => Math.max(0, currentPage - 1))} disabled={page === 0}>‹</button>
            <strong>{page + 1}/{pageCount}</strong>
            <button type="button" onClick={() => setPage((currentPage: number) => Math.min(pageCount - 1, currentPage + 1))} disabled={page === pageCount - 1}>›</button>
          </div>
        ) : <div className="gameplay-scoreboard-pagination-placeholder" />}

        {spectatorCount >= 1 ? <small className="gameplay-scoreboard-spectator-note">{t('gameplay.score.spectators', { count: String(spectatorCount) })}</small> : null}

        <button className="gameplay-scoreboard-back-button gameplay-show-final-button" type="button" onClick={onPrimaryAction}>
          {primaryActionLabel}
        </button>
      </div>
    </div>
  );
}

export function ScoreboardHero({ title, subtitle }: { title: string; subtitle: string }) {
  const titleParts = title.split('BOARD');

  return (
    <div className="gameplay-scoreboard-hero" aria-label={`${title} ${subtitle}`}>
      <i className="gameplay-scoreboard-confetti gameplay-scoreboard-confetti-1" aria-hidden="true">★</i>
      <i className="gameplay-scoreboard-confetti gameplay-scoreboard-confetti-2" aria-hidden="true">✦</i>
      <i className="gameplay-scoreboard-confetti gameplay-scoreboard-confetti-3" aria-hidden="true">●</i>
      <i className="gameplay-scoreboard-confetti gameplay-scoreboard-confetti-4" aria-hidden="true">★</i>
      <i className="gameplay-scoreboard-confetti gameplay-scoreboard-confetti-5" aria-hidden="true">✦</i>
      <i className="gameplay-scoreboard-confetti gameplay-scoreboard-confetti-6" aria-hidden="true">●</i>
      <strong>
        {titleParts.length > 1 ? (
          <>
            <span>{titleParts[0]}</span>
            <span>BOARD</span>
          </>
        ) : (
          <span>{title}</span>
        )}
      </strong>
      <em>{subtitle}</em>
    </div>
  );
}
