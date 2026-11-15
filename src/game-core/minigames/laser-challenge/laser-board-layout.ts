/**
 * One authoritative geometry contract for the portrait-flow laser board.
 * The ray solver still uses its original logical coordinates. Both the UI
 * and the generator's overlap-safety rules project through THIS mapping.
 */
import type { LaserPoint } from './laser-puzzle';

export const LASER_VERTICAL_BOARD = {
  width: 960,
  height: 476,
  sourceInputX: 80,
  receiverInputX: 794,
  firstInputRow: 94,
  inputRowStep: 82,
  sourceY: 61,
  receiverY: 414,
  firstReceiverX: 120,
  receiverStepX: 240,
  // Crystal mirror housing is ~48px across. Leave a visible gap.
  mirrorCenterClearance: 54,
  // No decoy's reflective housing may visually touch the illuminated ray.
  decoyBeamClearance: 31,
} as const;

export function projectLaserPoint(point: LaserPoint): LaserPoint {
  const board = LASER_VERTICAL_BOARD;
  return {
    x: board.firstReceiverX + ((point.y - board.firstInputRow) / board.inputRowStep) * board.receiverStepX,
    y: board.sourceY + ((Math.min(point.x, board.receiverInputX) - board.sourceInputX)
      / (board.receiverInputX - board.sourceInputX)) * (board.receiverY - board.sourceY),
  };
}

export function projectedLaserDistance(a: LaserPoint, b: LaserPoint): number {
  const projectedA = projectLaserPoint(a);
  const projectedB = projectLaserPoint(b);
  return Math.hypot(projectedA.x - projectedB.x, projectedA.y - projectedB.y);
}
