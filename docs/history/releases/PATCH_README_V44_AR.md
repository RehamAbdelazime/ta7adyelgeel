# V44 — REAL PHOTOS & QA BOTS

**Full clean source in a NEW EMPTY folder is recommended.**

V44 removes the 30 generated movie SVG illustrations. Movie entries now reference 16 candidate genuine movie stills/posters on third-party sites (NOT licensed for redistribution/streaming), and 14 missing licensed stills remain inactive. 20 real Commons star photos are sourced with per-file attribution and can be downloaded online on the user's PC with `npm run visuals:cache`. None of these third-party photo binaries are bundled in this ZIP.

Eyes Only is a CSS photo crop with no generated portraits. Crop focus needs actual GUI verification.

Host Panel -> QA: +5, +25, +100, +300 or custom 1-500. Auto answer via simulated Twitch chat; remove bots after Tour; Spectator joins after Tour lock; no QA profiles or history persisted.

IMPORTANT: This incremental patch needs removal of old SVG files. To apply, extract this PATCH separately and run `node APPLY_V44.mjs "D:/MyWork/Ta7adyElgeel/ta7adyelgeel_source"` from the folder containing APPLY_V44.mjs; it checks SHA-256 before removing old illustrations and copies changed files only. Back up your working source first. For a clean new installation use the FULL SOURCE ZIP instead.

See `docs/V44_REAL_PHOTOS_AND_QA_BOTS_AR.md`, `docs/V44_REAL_PHOTO_SOURCES_AND_RIGHTS.csv` and `npm run visuals:status`.
