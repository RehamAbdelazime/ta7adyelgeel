/** Purely decorative, constant-cost game-show lighting. No click interception. */
export function ScoreboardAmbientLights({ celebrateLeader = false }: { celebrateLeader?: boolean }) {
  return (
    <div className={`show-score-ambient-v21 ${celebrateLeader ? 'show-score-ambient-winner-v22' : ''}`} aria-hidden="true">
      <span className="show-score-light-beam show-score-light-beam-left" />
      <span className="show-score-light-beam show-score-light-beam-right" />
      <span className="show-score-light-core show-score-light-core-left" />
      <span className="show-score-light-core show-score-light-core-right" />
      <span className="show-score-light-pool show-score-light-pool-left" />
      <span className="show-score-light-pool show-score-light-pool-right" />
      {/* Soft video-wall emission, anchored to the scoreboard's own winner area. */}
      {celebrateLeader ? <span className="show-score-winner-screen-glow-v22" /> : null}
    </div>
  );
}
