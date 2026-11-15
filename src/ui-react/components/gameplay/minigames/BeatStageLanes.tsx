/** Shared lane guides for live play and the two-page tutorial.
 * Visual only: the generator is the single source of row coordinates. */
import { getBeatLanePositions } from '../../../../game-core/minigames/count-the-beat/count-the-beat-layout';

export function BeatStageLanes({ rows }: { rows: number }) {
  return <div className="ctb-lane-grid" aria-hidden="true">
    {getBeatLanePositions(rows).map((y) => <span className="ctb-lane" key={y} style={{ top: `${y}%` }} />)}
  </div>;
}
