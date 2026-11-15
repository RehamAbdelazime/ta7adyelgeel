/**
 * Laser Challenge — deterministic optical puzzles, generated entirely in code.
 *
 * Easy requires FOUR real reflections (instead of the two-reflection tutorial-
 * like round). Medium requires SIX and includes a backwards horizontal leg.
 * Hard requires EIGHT with two reverse legs. Every layout is checked by the
 * independent optical tracer, including all decoy mirrors.
 *
 * This is deliberately non-trivia: no question bank, image bank or fake beam.
 */
import type { QuestionDifficulty } from '../../questions/question-types';
import { LASER_VERTICAL_BOARD, projectLaserPoint, projectedLaserDistance } from './laser-board-layout';

export type LaserPoint = { x: number; y: number };
export type LaserMirror = LaserPoint & { id: string; slash: '/' | '\\' };
export type LaserPuzzle = {
  seed: number;
  source: LaserPoint;
  targetYs: number[];
  mirrors: LaserMirror[];
  /** Server-side only, sent to clients AFTER host reveal. */
  solution: LaserPoint[];
  correctTarget: number;
  difficulty: QuestionDifficulty;
};

const ROWS = [94, 176, 258, 340] as const;
// The receiver is the small round socket *below* each numbered answer card,
// not the text itself. Both solver and SVG use the same physical coordinate.
export const LASER_RECEIVER_X = 794;
const START_X = 80;

export function laserRandom(seed: number): () => number {
  let s = seed >>> 0;
  return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 0x100000000);
}

function pickRow(excluded: readonly number[], random: () => number): number {
  const available = ROWS.filter(row => !excluded.includes(row));
  if (!available.length) throw new Error('Invalid laser puzzle row constraints');
  return available[Math.floor(random() * available.length)]!;
}
function pickX(min: number, max: number, random: () => number): number {
  return min + Math.floor(random() * (Math.floor((max - min) / 8) + 1)) * 8;
}
function shuffle<T>(array: T[], random: () => number): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [array[i], array[j]] = [array[j]!, array[i]!];
  }
  return array;
}
function distanceToSegment(p: LaserPoint, a: LaserPoint, b: LaserPoint): number {
  // All optical segments are axis-aligned. The distance is to the finite
  // segment, not the infinite line (important for honest decoy clearance).
  if (a.y === b.y) {
    const cx = Math.max(Math.min(a.x, b.x), Math.min(Math.max(a.x, b.x), p.x));
    return Math.hypot(p.x - cx, p.y - a.y);
  }
  const cy = Math.max(Math.min(a.y, b.y), Math.min(Math.max(a.y, b.y), p.y));
  return Math.hypot(p.x - a.x, p.y - cy);
}

/** Reflect a cardinal ray against a physical 45° slash or backslash. */
export function reflectLaser(dx: number, dy: number, slash: '/' | '\\'): [number, number] {
  return slash === '/' ? [-dy, -dx] : [dy, dx];
}

/** Physical ray trace: hit the NEAREST plate in the current ray direction. */
export function traceLaser(source: LaserPoint, mirrors: readonly LaserMirror[], maxBounces = 14): LaserPoint[] | null {
  let x = source.x;
  let y = source.y;
  let dx = 1;
  let dy = 0;
  const path: LaserPoint[] = [{ x, y }];
  const seen = new Set<string>();
  for (let bounces = 0; bounces <= maxBounces; bounces++) {
    const candidates = mirrors
      .filter(m => dx !== 0 ? m.y === y && (m.x - x) * dx > 0 : m.x === x && (m.y - y) * dy > 0)
      .sort((a, b) => (Math.abs(a.x - x) + Math.abs(a.y - y)) - (Math.abs(b.x - x) + Math.abs(b.y - y)));
    const next = candidates[0];
    if (!next) {
      if (dx !== 1) return null; // An exit only counts when headed right.
      path.push({ x: LASER_RECEIVER_X, y });
      return path;
    }
    const key = `${next.id}/${dx}/${dy}`;
    if (seen.has(key)) return null;
    seen.add(key);
    path.push({ x: next.x, y: next.y });
    x = next.x;
    y = next.y;
    [dx, dy] = reflectLaser(dx, dy, next.slash);
  }
  return null;
}

export function generateLaserPuzzle(difficulty: QuestionDifficulty, seed: number): LaserPuzzle {
  const rand = laserRandom(seed);
  const startY = pickRow([], rand);
  const targetY = pickRow([startY], rand);
  // Use each of the other rows as genuine optical detours. This avoids an
  // 'easy' answer that's legible at a glance from two adjacent plates.
  const viaA = pickRow([startY, targetY], rand);
  const viaB = pickRow([startY, targetY, viaA], rand);
  const source: LaserPoint = { x: START_X, y: startY };
  let waypoints: LaserPoint[];

  if (difficulty === 'easy') {
    const a = pickX(222, 270, rand);
    const b = pickX(504, 568, rand);
    // 4 reflections, two separate vertical direction changes.
    waypoints = [source, { x: a, y: startY }, { x: a, y: viaA },
      { x: b, y: viaA }, { x: b, y: targetY }, { x: LASER_RECEIVER_X, y: targetY }];
  } else if (difficulty === 'medium') {
    const a = pickX(332, 380, rand);
    const b = pickX(174, 222, rand);
    const c = pickX(592, 648, rand);
    // 6 reflections; after the first vertical leg, the ray goes LEFT.
    waypoints = [source, { x: a, y: startY }, { x: a, y: viaA },
      { x: b, y: viaA }, { x: b, y: viaB },
      { x: c, y: viaB }, { x: c, y: targetY }, { x: LASER_RECEIVER_X, y: targetY }];
  } else {
    // Keep the reverse-leg mirrors apart AFTER V80's vertical projection:
    // the former minimum 96 logical px shrank to 47 screen px, so the
    // reflective housings overlapped in some Hard layouts.
    const a = pickX(340, 380, rand);
    const b = pickX(170, 210, rand);
    const c = pickX(508, 556, rand);
    const d = pickX(670, 702, rand);
    const viaC = rand() < .5 ? startY : viaA;
    // 8 reflections with TWO reverse horizontal legs. No accidental mirrors
    // are ever allowed to lie on the traced solution, including at crossings.
    waypoints = [source, { x: a, y: startY }, { x: a, y: viaA },
      { x: b, y: viaA }, { x: b, y: viaB },
      { x: d, y: viaB }, { x: d, y: viaC },
      { x: c, y: viaC }, { x: c, y: targetY },
      { x: LASER_RECEIVER_X, y: targetY }];
  }

  const solutionMirrors: LaserMirror[] = [];
  for (let i = 1; i < waypoints.length - 1; i++) {
    const prev = waypoints[i - 1]!;
    const at = waypoints[i]!;
    const next = waypoints[i + 1]!;
    const inDx = Math.sign(at.x - prev.x);
    const inDy = Math.sign(at.y - prev.y);
    const outDx = Math.sign(next.x - at.x);
    const outDy = Math.sign(next.y - at.y);
    if (Math.abs(inDx) + Math.abs(inDy) !== 1 || Math.abs(outDx) + Math.abs(outDy) !== 1 || inDx * outDx + inDy * outDy !== 0) {
      throw new Error('Laser generator made a non-perpendicular turn');
    }
    const slash = (outDx === -inDy && outDy === -inDx) ? '/' : '\\';
    solutionMirrors.push({ ...at, slash, id: `m${i}` });
  }

  // Physically honest decoys are kept AWAY from the beam (including the
  // 25px-radius glass plate). They don't invisibly absorb or alter a ray.
  const candidateYs = [...ROWS, 135, 217, 299];
  const candidateXs = [155, 180, 210, 240, 275, 300, 340, 375, 415,
    445, 480, 515, 550, 580, 615, 650, 685, 720];
  const candidates: LaserMirror[] = [];
  for (const x of candidateXs) for (const y of candidateYs) {
    const point = { x, y };
    if (waypoints.some((a, i) => i + 1 < waypoints.length && (
      distanceToSegment(point, a, waypoints[i + 1]!) < 38
      || distanceToSegment(projectLaserPoint(point), projectLaserPoint(a), projectLaserPoint(waypoints[i + 1]!))
        < LASER_VERTICAL_BOARD.decoyBeamClearance
    ))) continue;
    if (solutionMirrors.some(m => projectedLaserDistance(m, point) < LASER_VERTICAL_BOARD.mirrorCenterClearance)) continue;
    candidates.push({ ...point, id: `d${x}-${y}`, slash: rand() < .5 ? '/' : '\\' });
  }
  // Keep distractors spaced so circles don't overlap each other. Try all
  // shuffled candidates; the constraint is deterministic for a given seed.
  const decoyTarget = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 7 : 8;
  let decoys: LaserMirror[] = [];
  // Greedy selection is order-sensitive. Retry different deterministic orders
  // before declaring a layout impossible; first-fit alone failed on some Hard
  // seeds after enforcing actual V80 screen-space mirror clearance.
  for (let attempt = 0; attempt < 24 && decoys.length < decoyTarget; attempt++) {
    const selected: LaserMirror[] = [];
    for (const candidate of shuffle([...candidates], rand)) {
      if (selected.length >= decoyTarget) break;
      if (selected.some(m => projectedLaserDistance(m, candidate) < LASER_VERTICAL_BOARD.mirrorCenterClearance)) continue;
      selected.push(candidate);
    }
    if (selected.length > decoys.length) decoys = selected;
  }
  if (decoys.length !== decoyTarget) throw new Error(`Not enough safe decoys for laser seed ${seed}`);
  const mirrors = shuffle([...solutionMirrors, ...decoys], rand);
  const traced = traceLaser(source, mirrors);
  if (!traced || JSON.stringify(traced) !== JSON.stringify(waypoints)) {
    throw new Error(`Laser optical simulation mismatch for seed ${seed}`);
  }
  return { seed, source, targetYs: [...ROWS], mirrors, solution: waypoints,
    correctTarget: ROWS.findIndex((row) => row === targetY) + 1, difficulty };
}
