import { createContext, useContext, type ReactNode } from 'react';

/** UI-only reveal -> scoreboard handoff. Never advances the game phase itself. */
const RoundRevealContext = createContext<(() => void) | null>(null);

export function RoundRevealProvider({ onContinue, children }: { onContinue: () => void; children: ReactNode }) {
  return <RoundRevealContext.Provider value={onContinue}>{children}</RoundRevealContext.Provider>;
}

export function useRoundRevealContinue() {
  return useContext(RoundRevealContext);
}
