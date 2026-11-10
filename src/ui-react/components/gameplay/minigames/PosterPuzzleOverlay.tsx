import { useMemo } from 'react';
import type { QuestionDifficulty } from '../../../../game-core/questions/question-types';
import type { PosterRevealPlan } from '../../../../game-core/minigames/visual-guess/poster-mystery';
import {
  isTitleTile, PUZZLE_TOTAL, tileRevealOrder, visibleSafeTiles, type PosterTitleRegion,
} from '../../../../game-core/minigames/visual-guess/poster-puzzle';

/** Shared between the real movie question and its tutorial.
 * Title-covering tiles never open — including after the host reveals the result. */
export function PosterPuzzleOverlay({ plan, titleMasks, progress, difficulty }: {
  plan: PosterRevealPlan | null | undefined;
  titleMasks: readonly PosterTitleRegion[];
  progress: number;
  difficulty: QuestionDifficulty;
}) {
  const pattern = plan?.pattern ?? 42017;
  const order = useMemo(() => tileRevealOrder(pattern, titleMasks), [pattern, titleMasks]);
  const visibleCount = visibleSafeTiles(progress, difficulty, order.length);
  const clear = new Set(order.slice(0, visibleCount));
  return <div className="v73-poster-puzzle" aria-hidden="true">
    {Array.from({ length: PUZZLE_TOTAL }, (_, i) => <span key={i}
      className={!isTitleTile(i, titleMasks) && clear.has(i) ? 'v73-puzzle-tile-clear' : ''} />)}
  </div>;
}
