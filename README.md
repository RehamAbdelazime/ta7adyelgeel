# Ta7ady ElGeel — Release Candidate V48

**Twitch party game for Windows** · Electron + React + TypeScript · Arabic / English

## What is in the player-facing game?

- Seven public mini-games: Food Origin, Shape Count, Maze Gates, Count the Beat, Lucky Cup, Guess the Movie, Guess the Star.
- One Game and Full Tour modes, manual reveal/scoreboard transitions, official contestants and late-joining Spectators.
- Persistent XP and levels, character reactions, scoreboards, Chaos and Golden Rewards.
- Normal Settings screen, the animated stage host and the host's in-game answer controls remain.
- **No Host Production Panel, F9 panel, QA bot buttons, or automated screenshot UI.** Those development features have been removed from the shipped UI. Test-only bot simulation remains under `tests/` for regression coverage.

## Windows setup / development

Requires Node.js 22+ and npm.

```cmd
npm ci
npm run dev
```

The game needs a Twitch connection to run in its normal live mode. `npm run dev` opens Electron with the local Vite renderer.

## Last regression before distribution

On Windows, double-click **`RUN_FINAL_REGRESSION_WINDOWS.cmd`**, or run:

```cmd
npm ci
npm run regression:final
```

This is the **last regression**, not a screenshot walkthrough. It checks release-only surfaces, source/asset integrity, legacy regressions, native Node game scenarios, Vitest, full TypeScript, Vite+Electron production build, and build outputs. It writes:

- `release-check/FINAL_REGRESSION_SUMMARY.txt`
- `release-check/FINAL_REGRESSION_REPORT.json`
- Per-step logs under `release-check/`

The command returns a failure code if any check does not pass. It does **not** silently treat a skipped build as passing. It does not launch the old Host Panel or require Playwright.

To build a Windows portable executable after a **passing regression**:

```cmd
npm run package:win
```

> A successful source regression is not a substitute for a Windows executable smoke test or a human review of actual gameplay.

## Media is intentionally deferred

The user will supply real licensed film and celebrity images later. **They are NOT included here.** Currently the clean project contains 36 image references that use external URLs and 14 entries without usable sources; licensing and offline readiness remain unresolved. Film stills/posters need explicit reuse permission as appropriate. No generated drawings have been re-added.

Supported content utilities:

```cmd
npm run visuals:status
npm run visuals:cache
npm run visuals:import -- <question-id> <local-image-path> <credit> <license>
```

The question bank lives at `src/game-core/minigames/visual-guess/visual-guess-questions.json`. Test the real images and broadcast permissions before enabling the media games in a release.

## Technical notes

- The Windows portable output is configured in `package.json` (`release-v2/`). No installer EXE is bundled in this source archive.
- Saved Twitch profiles and settings use Electron's `userData/el-geel-city/` directory; replacing this source archive does not delete that directory.
- Two internal QA-only minigames remain registered for testing but are **not selectable** from the public game picker.
- The old V45 screenshot/BAT workflow is retired. Prior change notes are archived under `docs/history/`.
- See `docs/RELEASE_READINESS_V48_AR.md` for the release checklist and limits of verification.

**Status:** release-candidate source cleaned for distribution preparation; **not certified release-ready** until the full Windows regression/build, offline image assets/rights, and executable smoke test are verified.

## V52 — Smart Poster Replay

Offline movie posters now rotate five reveal styles (blur, zoom, spotlight, puzzle, grayscale/color) with difficulty-aware timing and initial-clue-aware distractors. Local-only viewing history survives relaunch and prioritizes unseen titles. For the Arabic QA notes see `docs/V52_SMART_POSTER_REPLAY_AR.md`; run `npm run verify:posters-v49`.
