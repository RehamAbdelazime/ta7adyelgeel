type ScoringGuideProps = {
  exact: number;
  partial: number;
  partialTolerance: number;
  incorrect: number;
  exactLabel: string;
  partialLabel: string;
  incorrectLabel: string;
  className?: string;
};

/** Consistent points legend for numeric estimation mini-games. */
export function ScoringGuide({
  exact,
  partial,
  partialTolerance,
  incorrect,
  exactLabel,
  partialLabel,
  incorrectLabel,
  className = '',
}: ScoringGuideProps) {
  return (
    <div className={`ctb-scoring ${className}`.trim()} aria-label="Scoring">
      <div className="ctb-scoring-row ctb-scoring-exact">
        <span>✓ {exactLabel}</span>
        <strong>+{exact}</strong>
      </div>
      <div className="ctb-scoring-row ctb-scoring-partial">
        <span>≈ {partialLabel} (±{partialTolerance})</span>
        <strong>+{partial}</strong>
      </div>
      <div className="ctb-scoring-row ctb-scoring-wrong">
        <span>✕ {incorrectLabel}</span>
        <strong>{incorrect}</strong>
      </div>
    </div>
  );
}
