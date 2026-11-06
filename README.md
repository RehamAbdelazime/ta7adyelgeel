# Ta7ady ElGeel — V62 Quote Gameplay

**V62:** Guess the Movie quote UX: full speaker/completion prompts from the first frame, phrase-based completion choices, no media changes. See `docs/V62_QUOTE_GAMEPLAY_UX_AR.md`.

A bilingual Arabic/English Twitch party game for Windows, built with Electron, React and TypeScript.

## Current game

Seven public mini-games: Food Origin, Shape Count, Maze Gates, Count the Beat, Lucky Cup, **Guess the Movie**, and **Guess the Star**. Supports One Game / Full Tour, live chat answers (`!1`–`!4`), official players and spectators, scoreboards, persistent progression, and an animated host with private in-game answer controls. **No Host Panel or QA controls in the player-facing product.**

## Local Guess the Movie content

The user-provided media under `public/assets/game/runtime/minigames/visual-guess/` is authoritative:

| Directory | Included | Purpose |
| --- | ---: | --- |
| `Posters/` | 81 | Local movie posters, five reveal styles |
| `Frame/` | 8 | Movie still / frame questions |
| `Quotes/` | 40 | JSON movie dialogue, Complete the Line, Who Said It? |

There are **88 registered film titles**, including **7 frame-only films** without fabricated posters. All names and files are linked via relative paths, not absolute Windows machine paths. To add more frames or quotes, use the same film ID as the question bank and run `npm run visuals:sync`. The legacy authoring formats are explained in `docs/V53_GUESS_MOVIE_FOLDERS_AR.md` and `docs/V54_RANDOM_QUOTE_GAMEPLAY_AR.md`.

**Release limitations:** Guess the Star still has 20 remote-only portraits and therefore is not guaranteed offline. Third-party film images/quotes and celebrity photo rights have **not** been individually cleared for distribution or live broadcast.

## Setup (Windows; Node.js 22+ / npm)

```cmd
npm ci
npm run visuals:sync
npm run visuals:verify
npm run dev
```

`npm run dev` launches the Vite+Electron development app; live mode needs a Twitch connection. To build, run `npm run build`, and for the Windows portable release run `npm run regression:final` then `npm run package:win`. The package command deliberately blocks release while required offline assets are missing. A green source check is **not** proof of a tested Windows EXE.

## Cleanup and verification

| Command | Purpose |
| --- | --- |
| `npm run clean:preview` | Lists disposable build/QA outputs **without deleting** |
| `npm run clean` | Removes only approved generated outputs; leaves source/media/settings untouched |
| `npm run verify:cleanup` | Checks cleanup, CSS/asset integrity, stage and controls |
| `npm run verify:all` | Full legacy and current source regression scripts |
| `npm run visuals:verify` | Validates every Poster, Frame and Quote filename, format and generated link |
| `npm run visuals:doctor` | Diagnoses missing local media |
| `npm run audit:security` | Audits source and optionally writes `SECURITY_AUDIT.json` |
| `npm run visuals:review` | Explicitly exports the V50 visual distractor editorial CSV |

The V58 cleanup pruned **396 dead CSS selector branches**, removed four genuinely unused source modules and a superseded one-time V33 deletion tool with its manifest, fixed two stale V36 regressions, and indexed movie clues efficiently for larger quote libraries. It did not delete any user-provided Poster/Frame/Quote or dynamic sprite media. See `docs/V58_COMPREHENSIVE_CLEANUP_AR.md` for the full audit and patch instructions.

## Documentation

Current authoring: `docs/V57_VISUAL_GUESS_FOLDER_SYNC_AR.md`, `docs/V53_GUESS_MOVIE_FOLDERS_AR.md`, `docs/V54_RANDOM_QUOTE_GAMEPLAY_AR.md`. Prior release and UX notes remain under `docs/` and `docs/history/` as historical references; the old README is saved at `docs/history/README_V57_PRE_CLEANUP.md`.

**Status:** source QA passed; **Windows/Electron production build and visual smoke test have not run in this environment.**


V60 installation integrity check: `npm run verify:movie-install-v60`. See `docs/V60_INSTALL_AND_IMAGE_RECOVERY_AR.md` for clean recovery after a mixed/partial ZIP extraction.


## V63 — Smart Quote Choices

يتم تبديل اختيارات «كمّل الجملة» و«مين قالها؟» من بنوك بدائل مع منع تكرار نفس الثلاثة ومكان الإجابة عبر الجولات. للمزيد راجع `docs/V63_SMART_CHOICES_ROTATION_AR.md`. اختبار: `npm run verify:quote-variety-v63`. لا تغيير على مجلدات `Posters` / `Frame` / `Quotes`.
