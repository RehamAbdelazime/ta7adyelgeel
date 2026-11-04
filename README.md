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
