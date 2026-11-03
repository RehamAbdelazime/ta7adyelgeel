# Ta7ady ElGeel — Desktop (Electron / React)

This is the complete Windows desktop game source, with the Premium Stage/Mode UI and the non-destructive cleanup pass.

## Local setup

```bash
npm ci
npm run verify:cleanup
npm test
npm run build
npm run start
```

> `npm run start` builds the Electron main/preload and opens the application.
> `npm run package:win` produces the portable Windows release (on a supported build host).

## Architecture

- `src/game-core/` — game logic, mini-games, scoring, localization, question bank.
- `src/desktop-electron/` — Electron main process, Twitch auth/IRC, and the **single** active `preload.cts` bridge.
- `src/ui-react/` — React UI, components, contexts, styles.
- `src/ui-react/styles.css` — **ordered CSS entrypoint**, containing 17 local imports.
- `src/ui-react/styles/legacy/` — legacy rules split by ordered cascade phase; edit carefully.
- `src/ui-react/styles/premium-lobby.css` and `premium-stage-mode.css` — premium overrides, intentionally loaded last.
- `public/assets/game/runtime/characters/stage-ready/` — unique PNG frames; duplicate bytes removed.
- `src/ui-react/components/gameplay/citizens/sprite-frame-aliases.generated.ts` — maps all removed duplicate frames to byte-identical surviving assets. Every animation still runs ten logical frames.

### Asset or CSS changes

Run `npm run verify:assets` whenever adding/updating character animations. If replacing a surviving PNG, regenerate/check its dependent aliases before releasing; alias frames intentionally share a single file.

Run `npm run verify:css` and `npm run verify:landing-experience` after editing CSS. **Cascade order is behavior:** don't sort legacy imports alphabetically or move premium styles above legacy.

## Validation

- `npm run verify:cleanup` — CSS order, frame aliases, previous UI hardening checks.
- `npm run verify:assets` — validates 660 logical sprite-frame URLs.
- `npm run verify:css` — validates all 17 CSS modules and resource links.
- `npm run audit:security` — Electron/security static scan (generates ignored `SECURITY_AUDIT.json`).
- `npm test` — game/test suite when dependencies are installed.
- `npm run build` — actual React/Electron bundle when dependencies are installed.

For previous iterations see `docs/history/`; the current cleanup report is `docs/cleanup-report-ar.md`.
