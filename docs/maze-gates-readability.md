# Maze Gates readability update

## Why the maze was hard to read

The full maze used a 21x15 grid with 20px cells, while the wall strokes were 10px wide with a 15px dark shadow and a strong glow. At gameplay scale, the wall treatment consumed too much of each cell and the number of cells created visual noise. The board also occupied only part of the available SVG viewBox.

## Changes

- Reduced the full maze from 21x15 (315 cells) to 15x9 (135 cells).
- Increased cell size from 20px to 36px, preserving a broad board and readable corridors.
- Repositioned the 3-gate and 4-gate entrances to align with the new grid.
- Reduced wrong-gate islands from 18–29 cells to 9–13 cells so dead-end branches remain distinguishable without overwhelming the board.
- Increased the SVG viewBox height to provide room for the larger gates and EXIT marker.
- Reduced wall and shadow thickness, removed the heavy blur on walls, softened grid lines, and strengthened the contrast of the board, gates, and EXIT.
- Added focused service tests for grid geometry, gate placement, and solution reveal.

The maze still hides the correct solution during the answering phase; the path is only rendered during reveal. The answer validation, scoring, round lifecycle, and host-answer flow were not changed.
