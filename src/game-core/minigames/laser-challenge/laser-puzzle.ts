/**
 * Laser Challenge — deterministic 90-degree reflection puzzle.
 * No image bank, no physics engine and no client-side answer computation.
 * Mirrors have actual '/' or '\\' geometry. All distractor mirrors are
 * physically off the solved beam; the independent tracer validates every plan.
 */
import type { QuestionDifficulty } from '../../questions/question-types';

export type LaserPoint = { x: number; y: number };
export type LaserMirror = LaserPoint & { id: string; slash: '/' | '\\' };
export type LaserPuzzle = {
  seed: number;
  source: LaserPoint;
  targetYs: number[];
  mirrors: LaserMirror[];
  /** Authoritative data: service holds this privately until scoring. */
  solution: LaserPoint[];
  correctTarget: number;
  difficulty: QuestionDifficulty;
};

const ROWS = [94, 176, 258, 340] as const;
const X_COLUMNS = [235, 386, 537] as const;
const END_X = 814;
const START_X = 80;

export function laserRandom(seed: number): () => number {
  let s = seed >>> 0;
  return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 0x100000000);
}
function otherRow(except: number, random: () => number): number {
  const choices = ROWS.filter(y => y !== except);
  return choices[Math.floor(random() * choices.length)]!;
}
function shuffle<T>(array: T[], random: () => number): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [array[i], array[j]] = [array[j]!, array[i]!];
  }
  return array;
}
function isOnSegment(p: LaserPoint, a: LaserPoint, b: LaserPoint): boolean {
  return a.x === b.x
    ? p.x === a.x && p.y >= Math.min(a.y, b.y) && p.y <= Math.max(a.y, b.y)
    : a.y === b.y && p.y === a.y && p.x >= Math.min(a.x, b.x) && p.x <= Math.max(a.x, b.x);
}

/** Reflect cardinal directions across a 45-degree mirror. */
export function reflectLaser(dx: number, dy: number, slash: '/' | '\\'): [number, number] {
  return slash === '/' ? [-dy, -dx] : [dy, dx];
}

/** Independent optical simulation: hits the nearest mirror along the current ray. */
export function traceLaser(source: LaserPoint, mirrors: readonly LaserMirror[], maxBounces = 14): LaserPoint[] | null {
  let x = source.x;
  let y = source.y;
  let dx = 1;
  let dy = 0;
  const path: LaserPoint[] = [{ x, y }];
  const seen = new Set<string>();
  for (let bounces = 0; bounces <= maxBounces; bounces++) {
    const candidates = mirrors
      .filter(m => (dx !== 0 ? m.y === y && (m.x - x) * dx > 0 : m.x === x && (m.y - y) * dy > 0))
      .sort((a, b) => (Math.abs(a.x - x) + Math.abs(a.y - y)) - (Math.abs(b.x - x) + Math.abs(b.y - y)));
    const next = candidates[0];
    if (!next) {
      // A correct exit requires the beam to travel RIGHT out of the board.
      if (dx !== 1) return null;
      path.push({ x: END_X, y });
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
  const sourceY = ROWS[Math.floor(rand() * ROWS.length)]!;
  const target = otherRow(sourceY, rand);
  const bendPairs = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3;
  const bends = X_COLUMNS.slice(0, bendPairs);
  const waypoints: LaserPoint[] = [{ x: START_X, y: sourceY }];
  const usedRows = [sourceY];
  for (let i = 0; i < bendPairs; i++) {
    const row = i === bendPairs - 1 ? target
      : shuffle(ROWS.filter(y => y !== usedRows[i] && y !== target), rand)[0]!;
    const x = bends[i]!;
    waypoints.push({ x, y: usedRows[i]! }, { x, y: row });
    usedRows.push(row);
  }
  waypoints.push({ x: END_X, y: target });
  const mirrors: LaserMirror[] = [];
  for (let i = 1; i < waypoints.length - 1; i++) {
    const prev = waypoints[i - 1]!;
    const p = waypoints[i]!;
    const next = waypoints[i + 1]!;
    // Both correct geometries have a unique reflection between incoming and outgoing vectors.
    const inDx = Math.sign(p.x - prev.x);
    const inDy = Math.sign(p.y - prev.y);
    const outDx = Math.sign(next.x - p.x);
    const outDy = Math.sign(next.y - p.y);
    const slash = (outDx === -inDy && outDy === -inDx) ? '/' : '\\';
    mirrors.push({ ...p, slash, id: `m${i}` });
  }

  // Extra plates are true decoys: none may lie along ANY ray segment, even
  // before the mirrors, otherwise they would change the physical answer.
  const forbidden = (p: LaserPoint) => waypoints.some((a, index) => index + 1 < waypoints.length && isOnSegment(p, a, waypoints[index + 1]!));
  const candidates: LaserMirror[] = [];
  for (const x of [166, ...X_COLUMNS, 307, 459, 620, 690]) {
    for (const y of ROWS) {
      const point = { x, y };
      if (forbidden(point)) continue;
      candidates.push({ ...point, id: `d${x}-${y}`, slash: rand() < .5 ? '/' : '\\' });
    }
  }
  const decoyCount = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 6 : 9;
  const fullMirrors = shuffle([...mirrors, ...shuffle(candidates, rand).slice(0, decoyCount)], rand);
  const realTrace = traceLaser(waypoints[0]!, fullMirrors);
  if (!realTrace || JSON.stringify(realTrace) !== JSON.stringify(waypoints)) {
    throw new Error(`Laser optical simulation mismatch for seed ${seed}`);
  }
  return {
    seed, source: waypoints[0]!, targetYs: [...ROWS], mirrors: fullMirrors,
    solution: waypoints,
    correctTarget: ROWS.indexOf(target) + 1,
    difficulty,
  };
}
