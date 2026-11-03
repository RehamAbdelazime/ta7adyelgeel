/** One focusable, shared primary action across round, intermission and final score. */
export function ScoreboardPrimaryAction({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      className="show-score-action show-score-action-v21"
      data-testid="scoreboard-primary-action"
      onClick={onClick}
    >
      <span>{label}</span>
    </button>
  );
}
