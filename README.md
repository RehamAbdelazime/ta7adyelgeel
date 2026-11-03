# Ta7ady ElGeel — Electron + React Game Show

**Current maintenance baseline: V33 (safe code + repository cleanup, based on V32).**

A desktop Twitch-interactive game show with eleven registered mini-games, shared
question layouts, host controls, scores, a full tour, illustrated instructions,
and the Lucky Cup Turbo Finale. V33 does not change gameplay rules, question
order, scoring weights, public game eligibility, Twitch authorization, or the
Lucky Cup V30 speed curve.

## Windows setup

Extract the complete V33 source archive into a **new, empty project folder**.
Do not merge a clean-source archive on top of an old version: doing so leaves
previously removed files in place.

```powershell
npm ci
npm run verify:integrity
npm run smoke:v2
npm run verify:cleanup
npm run verify:all
npm test
npm run build
npm run audit:release
npm run dev
```

`npm run start` builds Electron's main/preload and launches the app;
`npm run package:win` creates a Windows portable release. The `dev` command
starts both the Vite renderer and Electron. `audit:release` only runs *after*
`build` because it verifies the actual output directory.

If you apply **V33 PATCH ONLY** on an existing V32 folder instead, files that
were removed in V33 still exist after copying. After taking a backup:

```powershell
npm run cleanup:v33                # dry-run; deletes nothing
npm run cleanup:v33 -- --apply     # removes only original V32 files with matching SHA-256
```

Modified files are never deleted by this helper. Re-extract into a fresh folder
if you prefer a clean project without running any cleanup command.

## Project structure

| Path | Purpose |
| --- | --- |
| `src/game-core/` | Game runtime, tour phases, mini-game services, scoring, question bank, translations |
| `src/desktop-electron/` | Electron main process, secure preload, Twitch auth and IRC |
| `src/ui-react/` | React game stage, overlays, streamer controls, accessibility, UI |
| `src/ui-react/styles.css` | Stable cascade entrypoint for seventeen legacy style modules |
| `src/ui-react/styles/` | Newer feature-scoped styles; ordering is intentionally preserved |
| `public/assets/game/runtime/` | Bundled stages, sprites, audio, game media, tuning config |
| `src/game-core/minigames/true-fake/true-fake-questions.json` | Editable bilingual question content (500 entries) |
| `scripts/` | Build checks, gameplay regression checks, release checks, safe cleanup |
| `docs/history/releases/` | Historical release notes and archived manifests (not active instructions) |
| `docs/CLEANUP_V33_AR.md` | Precise V33 cleanup changes and validation limits |

## Verification and maintenance

- `npm run verify:integrity` checks source imports, all imported CSS, static
  asset paths, JSON, package-script links, Windows path collisions, file
  signatures, duplicate public asset bytes, question bank consistency and
  host-controlled reveal/lighting synchronization. Runs without dependencies.
- `npm run smoke:v2` runs fast offline structural checks across the current game
  system. It **does not** simulate a real Twitch stream or launch Electron.
- `npm run verify:all` runs the complete historical/current source regression matrix
  (including older CSS/UI contract checks) in one command.
- `npm run verify:assets` checks all 660 logical sprite frames and their 278
  aliases (so removing a duplicate sprite never removes an animation frame).
- `npm run verify:css` checks the 17 cascade-ordered style modules.
- `npm run check:localization` verifies typed/runtime dictionaries and prints
  advisory JSX literal candidates; it never rewrites text automatically.
- `npm run audit:security` checks the Electron/Twitch boundary and static
  security assertions; output is `SECURITY_AUDIT.json` and is ignored by git.
- `npm run lint` uses TypeScript typechecking and JavaScript ESLint rules. It
  needs `npm ci` first.
- `npm test`, `npm run build` and `npm run audit:release` are the full validation
  gate **on a machine with all dependencies installed**.

### CSS and game media safety

This cleanup intentionally did **not** mass-delete selectors or reorder CSS:
legacy styles contain thousands of conflicting `!important` declarations.
Those require before/after screenshots in Electron at multiple resolutions.
Do not delete generated sprite-alias mapping entries or unpublished game assets
on the basis of filename searches; their paths can be created dynamically.

## Detailed report

See [`docs/CLEANUP_V33_AR.md`](docs/CLEANUP_V33_AR.md) for the exact refactors,
removed/moved files, validations performed, and work that still needs live QA.
