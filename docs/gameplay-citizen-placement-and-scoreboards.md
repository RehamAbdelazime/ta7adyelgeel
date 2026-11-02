# Gameplay character placement and scoreboard fix

## Character placement root causes

- The citizen floor-style helper did not apply a placement, so cards fell back to the same CSS center position.
- The answer marker grid and citizen placement used different horizontal geometry.
- Characters were assigned to answer markers during both `answer_window_open` and `scoring`, so they never returned to the stage sides when the question ended.
- Non-answering viewers were removed during scoring instead of remaining visible at the sides.
- The movement effect only animated transitions toward choice/champion placements; it did not animate the return trip to the sides or transitions back to lobby crowd positions.
- Side crowd slots were consumed even by viewers already assigned to an answer marker.

## Changes

- Added consistent lobby, stage-side, answer-marker, and champion coordinates in `citizen-helpers.ts`.
- Aligned the choice marker grid to the same 20% / 60% stage-space geometry used by the citizen positions.
- Reserved deterministic left/right side slots for each citizen, so an answer submission moves only that character instead of reshuffling the whole crowd; the same slot is restored after the answer window.
- Aligned the character centre vertically as well as horizontally with the numbered spotlight image, and allowed the sprite to extend beyond the shallow floor layer without clipping.
- Kept all viewers visible during scoring and moved answerers back to side formations as soon as scoring begins.
- Animated all placement transitions and derived sprite facing from the horizontal destination.
- Included group-slot and option-count changes in placement signatures so characters move when their target cell changes. Result-state changes now update reaction animations without being mistaken for a new movement target.
- Removed obsolete duplicate citizen-position helper implementations and prevented sprite clipping at the lower stage edge.

## Scoreboard root cause

`GameplayOverlay.tsx` contained an explicit final-score suppression path: it called `backToStage()` as soon as the tour reached `tour_complete`, returned `null`, and hardcoded both `showFinalScore` and `showResult` to `false`. During scoring, `showAnswerReveal` was true whenever a round existed, which made `showRoundScore` false. As a result, neither score component could render.

## Scoreboard changes

- Added `resolveGameplayOverlayMode()` to make `scoring` and `tour_complete` priority display modes, independent of the generic `hasRound` flag.
- Preserve each game's visual answer reveal for 2.4 seconds after scoring starts when a round snapshot is still available, then render `RoundScoreBoard` immediately if the round snapshot is absent.
- Render `TourCompleteSummary` after the final phase.
- During a Tour, non-final rounds use the existing Top 3 + next-game intermission screen; a standalone game or the last round shows the full round scoreboard. The final phase shows the cumulative Tour scoreboard.
- Removed the automatic return-to-stage behavior; the host now returns from the final board using its explicit button.

## Validation

- Gameplay config, mini-game baseline, two-row grid, and final-flow verification scripts pass.
- Changed TypeScript/TSX files pass TypeScript transpilation/syntax diagnostics.
- Vitest and the full TypeScript typecheck could not be executed in this environment because dependency installation did not finish; run `npm ci`, `npm test`, and `npm run typecheck` on the development machine.

## Numbered-answer scope note

- Multiple-choice mini-games place each answering citizen at the matching numbered spotlight. Count the Beat accepts a free numeric count and has no fixed numbered spotlight cards, so its characters remain in the stage-side formation unless a dedicated visual marker set is added for that game.
