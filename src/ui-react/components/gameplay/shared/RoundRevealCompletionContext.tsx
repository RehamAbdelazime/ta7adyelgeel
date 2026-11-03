import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

/**
 * The answer reveal and the stage lighting must agree about when the host
 * manually opens the leaderboard. This state belongs to the UI layer: it must
 * not advance or mutate the underlying tour state machine.
 */
type RoundRevealCompletion = {
  completedScoringRevealKey: string | null;
  setCompletedScoringRevealKey: (key: string) => void;
};

const RoundRevealCompletionContext = createContext<RoundRevealCompletion | null>(null);

export function getScoringRevealKey(tourId: string | null, roundNumber: number, questionId: string | null): string {
  return `${tourId}:${roundNumber}:${questionId ?? 'no-question'}`;
}

export function RoundRevealCompletionProvider({ children }: { children: ReactNode }) {
  const [completedScoringRevealKey, setCompletedScoringRevealKey] = useState<string | null>(null);
  const value = useMemo(() => ({ completedScoringRevealKey, setCompletedScoringRevealKey }), [completedScoringRevealKey]);
  return <RoundRevealCompletionContext.Provider value={value}>{children}</RoundRevealCompletionContext.Provider>;
}

export function useRoundRevealCompletion(): RoundRevealCompletion {
  const context = useContext(RoundRevealCompletionContext);
  if (!context) throw new Error('useRoundRevealCompletion must be used inside the stage provider.');
  return context;
}
