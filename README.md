> **V42 — Character actions and final Level Up:** see `docs/CHARACTER_PROGRESSION_V42_AR.md`.

**V41:** XP is committed only on the final scoreboard (at the end of a Full Tour or a single MiniGame session). The Coins economy was removed. Older `profiles.json` files retain their XP, Level and wins; obsolete currency fields are ignored and not written back. See `docs/PROGRESSION_V41_AR.md`.

## V39 — Spectator joining and scoreboards

Official joins remain open until the **first actual question** begins. After that, late viewers join as Spectators with a separate score and no XP. Intermission and final scoreboards now have independent **Players / Spectators** tabs. Score resets each new Tour (persistent progression stays). See `docs/SPECTATOR_EXPERIENCE_V39_AR.md` for full Arabic rules and testing.

# Ta7ady ElGeel — V37

Electron + React + TypeScript party game for interactive Twitch shows.

## Mini-games

**Public (7):** Food Origin, Shape Count, Maze Gates, Count the Beat, Lucky Cup, Guess the Movie, Guess the Star.

**QA-only (2):** Memory Count, Couple or Siblings. These are registered but not public.

Four retired games were completely removed from **code, content, assets, screen registries, configuration, styles, translation entries, and tests**. This version starts from the V36 source.

## Run locally

```bash
npm ci
npm run dev
```

Check: `npm run verify:all`, `npm run test`, `npm run build`.

The Visual Guess image bank includes remote sample image references. When online, `npm run visuals:cache` can cache the media locally. The media licenses must be reviewed before broadcast.

For the full deletion rationale and installation instructions, see `docs/REMOVED_MINIGAMES_V37_AR.md`.

## V38 Gameplay Quality Pass

خمس تحسينات للألعاب الحالية (Count the Beat / Maze Gates / Shape Count / Food Origin / Lucky Cup). التفاصيل ومعايير التحقق في `docs/GAMEPLAY_QUALITY_V38_AR.md`.

شغّل `npm run verify:quality-v38` (يتطلب Node وTypeScript)، أو `node scripts/verify-five-game-quality-v38.cjs` لاختبارات اللعب المنطقية.


## V43 — Egyptian Visual Guess content

The Guess the Movie bank contains 30 OFFLINE original SVG visual clues (not actual copyrighted film posters/stills), and the Guess the Star bank contains 20 Commons portrait references with license credits. Portrait files are not bundled; run `npm run visuals:cache` while online before streaming. More info: `docs/V43_EGYPTIAN_VISUAL_BANK_AR.md` and `docs/V43_VISUAL_MEDIA_ATTRIBUTION.csv`.
