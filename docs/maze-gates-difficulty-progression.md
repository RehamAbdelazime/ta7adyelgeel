# Maze Gates — Difficulty Progression

## What was wrong

The previous service assigned `easy`, `medium`, and `hard` by round number, but the full maze renderer used the same 15×9 grid and the same island-generation settings for every round. Difficulty mainly affected the points awarded, so the three mazes felt almost identical to players.

## New progression

The outer SVG viewport remains 720×440 and the maze stays centered. The logical grid now grows with the difficulty while individual cells remain large enough to read on a stream:

| Round | Difficulty | Grid | Cell size | Entrances | Decoy region size | Target route edges | Target internal turns |
|---|---|---:|---:|---:|---:|---:|---:|
| 1 | Easy | 11×7 | 44px | 3 | 4–6 cells | 15 | 7 |
| 2 | Medium | 13×8 | 40px | 4 | 7–9 cells | 28 | 13 |
| 3 | Hard | 15×9 | 36px | 4 | 10–13 cells | 43 | 19 |

The generator builds a deterministic pool of candidate mazes and selects the candidate closest to the difficulty profile's route length and turn count. It applies a stronger penalty when a candidate falls below the minimum complexity floor. This avoids relying on chance to make one round harder than another.

A 20-seed deterministic sample produced these median route lengths and visible turns:

| Difficulty | Median route length | Median visible turns | Median wall segments |
|---|---:|---:|---:|
| Easy | 17 cells | 8 | 45 |
| Medium | 30 cells | 14 | 55 |
| Hard | 42 cells | 22 | 72 |

The difficulty is now visible in the maze itself: Easy has fewer, larger cells and three entrances; Medium adds a grid row/column and another entrance; Hard uses the full 15×9 grid with the longest, most winding path and larger decoy regions.

## Runtime behavior

- The maze is generated once when a round starts, not on every `getSnapshot()` call.
- The correct path remains hidden until the round is resolved.
- Answer validation, scoring, Twitch commands, and host answer handling are unchanged.
- The existing high-contrast wall styling is unchanged.
- Difficulty follows Easy → Medium → Hard for a three-question single-game run.

## Regression coverage

`maze-gates-service.test.ts` verifies:

- the difficulty labels, grid dimensions, cell sizes and entrance counts for rounds 1–3;
- the solution remains hidden during intro/answering;
- median route length increases from Easy to Medium to Hard across multiple deterministic seeds;
- median turn count also increases across the same progression;
- the correct route is revealed after the round is resolved.
