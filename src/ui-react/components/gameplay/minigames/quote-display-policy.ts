/** Fair quote gameplay: the prompt is available immediately for answer-type rounds. */
import type { TourPhase } from '../../../../game-core/tours/tour-types';
import type { MiniGameSnapshot } from '../../../../game-core/minigames/minigame-types';

type QuoteMode = NonNullable<NonNullable<MiniGameSnapshot['visualGuess']>['movieQuoteMode']>;

export function visibleQuoteWordCount(
  mode: QuoteMode | null,
  total: number,
  initialShare: number,
  progress: number,
  showingResult: boolean,
  remainingMs: number,
  phase: TourPhase,
): number {
  if (!total) return 0;
  // The line itself is the clue in these two formats. Delaying the prompt
  // makes the question confusing, not challenging. Never time-gate it.
  if (mode === 'speaker' || mode === 'complete') return total;
  // Legacy "Which film was this quote from?" keeps the timed reveal.
  if (showingResult || (phase === 'answer_window_open' && remainingMs <= 1000)) return total;
  if (phase !== 'answer_window_open') return Math.min(total, Math.max(1, Math.ceil(total * initialShare)));
  return Math.min(total, Math.max(1, Math.ceil(total * (initialShare + (1 - initialShare) * progress))));
}
