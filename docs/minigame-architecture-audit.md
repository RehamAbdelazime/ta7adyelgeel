# Mini-game architecture audit

Baseline reviewed: `ta7adyelgeel_8games_pagination_fix.zip` (the last user-confirmed working version).

## Runtime architecture

```text
MINI_GAME_REGISTRY
  ├─ MiniGameId + title/description/icon metadata
  └─ public/QA eligibility
          |
          v
 gameplay-config.json
  ├─ enabledMiniGames
  ├─ miniGameRotation
  └─ timing / round / scoring configuration
          |
          v
       GameStore
  ├─ owns one concrete service instance per game
  ├─ chooses active game and coordinates tour phases
  ├─ adapts Twitch/host commands into game-specific answer values
  ├─ dispatches lifecycle calls through a switch
  └─ publishes a common MiniGameSnapshot
          |
          v
  MINI_GAME_SCREENS (exhaustive Record<MiniGameId, Component>)
          |
          +--> QuestionScreenShell
          |      ├─ phase timer / question metadata / helper
          |      ├─ common option cards and reveal / Next behavior
          |      └─ shared answer/reveal helpers
          +--> MediaCard / ChoiceCard / ShapeMark
```

`MiniGameServiceContract<TAnswer>` is already declared in `minigame-types.ts`, but the `GameStore` still keeps concrete service fields and a manually maintained union + switch in `getActiveMiniGameService()`. The command-to-answer adapters are also handled in game-specific methods. This is the main backend maintenance hotspot when adding a game.

## Eight public mini-games

| Game | Round/data strategy | Answer value | Shared presentation |
| --- | --- | --- | --- |
| Food Origin | Question bank + dynamic country distractors | `option-1..4` | QuestionScreenShell + MediaCard |
| Shape Count | Procedural shape grid | Shape ID (`circle`, `square`, etc.) | QuestionScreenShell + ShapeMark |
| Maze Gates | Procedural maze/path puzzle | `option-1..4` | QuestionScreenShell + SVG maze |
| Before or After | Curated comparison data | `option-1..2` | QuestionScreenShell; migrated in this pass |
| Guess Logo | Curated logo question data + shuffled choices | `option-1..4` | QuestionScreenShell |
| Count the Beat | Procedural visual counting scene | Numeric count, scored with tolerance bands | QuestionScreenShell; migrated in this pass |
| Lucky Cup | Seeded cup shuffle sequence | Cup number `1..3` | QuestionScreenShell |
| True or Fake | Localized statement question bank | `true` / `fake` | QuestionScreenShell |

Memory Count, Hangman and Couple or Siblings remain registered QA-only games. They retain their own services/screens and are not part of the eight-game public rotation.

## Findings addressed in this pass

1. **Screen registration was optional.** `Partial<Record<MiniGameId, ...>>` allowed a registered mini-game with no screen to compile and then silently render nothing. `MINI_GAME_SCREENS` is now an exhaustive `Record`, and the overlay no longer silently returns `null` for a missing screen. A registry coverage test protects this mapping.
2. **Two public games bypassed the shared question lifecycle.** Before or After used a separate header/layout, and Count the Beat had its own shell without the common phase timer and Next behavior. Both now use `QuestionScreenShell` while retaining their game-specific body mechanics.
3. **Shared reveal logic did not model all answer shapes.** The games do not all answer with a conventional option number. Shared helpers now resolve Before or After option numbers, Lucky Cup numeric cup answers and Count the Beat numeric answer text; True/Fake no longer gets used as an unsafe fallback for an unhandled answer type.
4. **The timer updated the whole question component on every animation frame.** Its local `requestAnimationFrame` state caused up to 60 shell/body renders per second. Timer repaint is isolated in `QuestionPhaseTimer` and uses a 100 ms interval, so its frequent local updates no longer originate in the parent shell. The timer handles a nullable start timestamp explicitly and exposes an appropriate accessible label in both running and ready states.
5. **Food Origin could retain a prior round's shuffled choices.** The original `useState` initializer only ran on mount. The choice shuffle is now derived with `useMemo` from the current round and dish data, so a reused screen instance follows the current question.
6. **Shared answer spotlights missed Before or After and Lucky Cup.** The common spotlight builder now exposes their choice metadata, and Lucky Cup answers map to the same one-based cup number used by the service.
7. **A common choice result state was defined but ignored.** `ChoiceCard` now honors an explicitly supplied `resultState` before falling back to its automatically inferred result.
8. **The shared shell could not customize game-specific metadata/reveals.** Optional eyebrow, helper, reveal state/text and shell/body class hooks let migrated screens retain their identifying content without duplicating the lifecycle shell.

## Shared component contract after this pass

- `QuestionScreenShell`: common question metadata, timer, phase helper/status, option cards, reveal state and Next action.
- `QuestionPhaseTimer` (internal): isolated countdown repaint; it does not own or rerender the game body on each tick.
- `MediaCard`: common media image/fallback/caption treatment.
- `ChoiceCard` and `ShapeMark`: common answer-option and shape rendering primitives.
- `answer-helpers.ts`: answer-to-option conversion, correct-option resolution, answer counts and citizen spotlight metadata.
- `overlay-types.ts`: common localized labels, phase helpers and correct-answer text for each registered game.
- `MINI_GAME_SCREENS`: compile-time exhaustive mapping from every registered game ID to its screen.

All eight public game screens now use `QuestionScreenShell`. Game-specific mechanics and layouts remain inside the respective screen components; the shared shell owns only the reusable presentation and phase lifecycle.

## Architecture risks intentionally not refactored here

1. **Manual service composition/dispatch in `GameStore`.** Adding a game touches concrete service fields, the active-service switch, answer parsing/adapters, snapshot logic and screen registry. Next backend improvement should be a typed service registry keyed by `MiniGameId`, with game-specific answer adapters kept explicit and tested. This should be a separate change so routing/scoring behavior can be regression-tested.
2. **Repeated service lifecycle bookkeeping.** Services independently implement answer de-duplication, status transitions, result resolution, scoring guards and counters. Their scoring policies differ (notably Count the Beat's tolerance bands and Lucky Cup scoring), so a generic scoring abstraction would be risky. Only common lifecycle bookkeeping should be considered for extraction after contract tests exist.
3. **Heterogeneous question generation is real, not automatically a defect.** Some games use question-bank selection, some use curated content, and others generate a puzzle procedurally. Do not force all games into one question-bank abstraction unless consistent history/exhaustion semantics become a requirement.
4. **Difficulty/scoring policies differ.** The current services do not all use one difficulty schedule or scoring curve. Agree on product rules before attempting to normalize them.
5. **Localization and CSS cleanup remain debt.** Some game-specific display strings are still hard-coded, and the stylesheet contains high-specificity legacy overrides. Broad cleanup should follow a visual regression pass in Arabic RTL and English LTR, not be bundled with the shared-component change.

## Verification added

- `answer-helpers.test.ts`: Before/After, Lucky Cup and Count the Beat answer/reveal mapping, plus safe True/Fake fallback behavior.
- `minigame-screen-registry.test.ts`: every registered `MiniGameId` must map to a screen component.

## Recommended next maintenance slice

Build the typed `MiniGameServiceRegistry` and focused service-contract tests. Keep scoring algorithms and round-generation strategies in their respective game services. Then run a visual playthrough of all eight public screens in Arabic RTL and English LTR before attempting broad visual/CSS cleanup.
