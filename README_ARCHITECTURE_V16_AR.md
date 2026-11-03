# Ta7ady ElGeel — v16 Architecture Audit & Question Experience Direction

**Source audited:** `ta7adyelgeel_shared_back_v15_SOURCE.zip`. **Scope:** localization, 11 mini-game question screens, round/intermission/final scoreboard. **Design direction:** Casual Party Game — playful, clean, stage-led, not hardcore, not dashboard.

## 1. What is shared today?

### Questions
**Yes, but not as a simple game-data switch.** The code has a shared `QuestionScreenShell` in `src/ui-react/components/gameplay/shared/question-shell.tsx` (~421 lines). Every one of the **11 registered mini-game React screens** imports it; `minigame-screen-registry.tsx` dispatches to the correct game component. Only **8 are presently public/enabled**.

The shell owns question heading, timer, choices (up to 4), answer reveal, chat instructions, and live-answer count; `MediaCard`, `ChoiceCard`, and `ShapeMark` are also shared. Each mini-game retains its own *content renderer* because Maze Gates, Lucky Cup, Food Origin, Hangman, etc. need genuinely different interactions and timing. Thus `Game-specific body + common game-show frame` is the correct direction, **not one giant switch with identical markup for all games**.

**Technical debt:** the shared shell has many inline layout styles and a fixed `gridTemplateColumns: '1fr 320px'` when there are choices. It also coexists with a `.gameplay-round-header` outside the shell and a bottom status display, creating possible repetition and layout contention. The CSS remains dense with old overrides. Long Arabic instructions and large visual content can suffer from the rigid side rail. Current visual design has not yet been regression-tested in actual Electron gameplay for all 11 games.

### Scoreboard
**Mostly yes.** `RoundScoreBoard` and `TourCompleteSummary` both compose the same `ReusableScoreboard` from `src/ui-react/components/gameplay/scoreboard/Scoreboard.tsx` (~415 lines). Intermissions use **`RoundIntermissionScreen`**, a *different presentation* that shows top three and the next game; this is appropriate, but presentation primitives could be shared more effectively. Player row calculation is centralized in `buildReusableScoreboardRows`; pagination is in `scoreboard-pagination.ts`.

**Important defect found and corrected in v16:** tours allow up to **10 rounds**, but the scoreboard previously showed the first five round columns only, even near the final round. It now slides a five-column window to the latest rounds and keeps the actual round numbers. Total points are unchanged. It already paginates players eight per page.

## 2. Localization audit

**Do not delete the files just because their names overlap.** Each has a distinct responsibility:
- `src/game-core/localization/locale-types.ts`: TypeScript locale and translation-key types.
- `src/game-core/localization/translations.ts`: typed EN/AR fallbacks plus `translate()`.
- `public/assets/game/runtime/config/localization.json`: optional runtime overrides loaded at startup.
- `src/ui-react/context/LocalizationContext.tsx`: loads/reloads the JSON overrides.
- `src/ui-react/i18n/useTranslation.ts`: reads current locale and delegates to `translate()`.

**But this architecture currently duplicates translated values**, because the JSON mirrors almost the entire fallback dictionary. Since JSON takes precedence, an edit to `translations.ts` may look ineffective in the game. Comparing v15: **12 English and 13 Arabic overridden values diverged** from the typed text, including the approved ONE GAME / FULL SHOW labels. **Four keys were defined twice inside each TS locale dictionary**, with later definitions silently overriding earlier definitions. **The final scoreboard passed `count` while the effective translation template expected `rounds`**, which could expose a literal placeholder. Many messages use `{name}`, while the formatter previously only replaced `{{name}}`.

**v16 correction:** synchronized the differing runtime values to approved typed strings; removed duplicate TS definitions; normalized final-score placeholders to `{{count}}`; made the formatter support both `{value}` and `{{value}}`; added `npm run verify:localization-contract` to catch duplicate keys, mismatched fallback/JSON overrides, missing keys, and EN/AR parameter mismatches. This is a **safe foundation**, not the final localization refactor.

**Important separate UX issue:** selected tour games are **shuffled by the game engine** (`buildTourMiniGameQueue`), while parts of the interface implied selection order was preserved. The explanatory copy is now consistent with random-order behavior. The numeric selection badges reflect the order clicked, not necessarily the eventual playing order; this should be redesigned with the tour selection UX.

**Remaining localization gaps to address during question redesign:** literal `TRUE OR FAKE?` in `TrueFakeScreen`, English phrases in `LuckyCupScreen`, English instructions in `HangmanScreen`, and the hardcoded English timer `aria-label`. Source text must move to typed localization keys or clearly locale-aware structured game content. Avoid direct `locale === 'ar'` strings in reusable components.

## 3. Proposed question UX redesign — shared, with meaningful variants

**Global shell layout:**
```
┌──────────────────────────────────────────────────────┐
│  Game name  ·  Round 2/5       Answers: 12    ◷ 00:18│
│          QUESTION TITLE — BILINGUAL, 1–2 LINES      │
├─────────────────────────────────────┬────────────────┤
│                                     │  !1 OPTION A   │
│   GAME-SPECIFIC VISUAL / BOARD      │  !2 OPTION B   │
│   (IMAGE, MAZE, COUNT, CUPS, ...)   │  !3 OPTION C   │
│                                     │  !4 OPTION D   │
├─────────────────────────────────────┴────────────────┤
│  CHAT HINT  •  !1 to !4        RESULTS/STATUS       │
└──────────────────────────────────────────────────────┘
```

**Do not apply this exact grid to everything.** Adopt three presentation variants behind the same component API:
1. `choice`: food origin, logo, true/false, couples, shapes — large media/board + readable options.
2. `focus`: memory count, beat count, before/after, hangman — centered visual with instructions below and no wasted empty option column.
3. `interactive`: maze and lucky cup — theater-first, maximal board width, game-specific animation and reveal. 

The shell should own *one* timer/status source, consistent results/reveal, accessibility, safe areas, responsive column widths and typography. Games supply their data and visual components, not their own headers and global button styles. Keep chat controls outside the spectator screen. Match all screens to the familiar cyan/pink and Fredoka/Alexandria, restrained accents, and the physical stage lighting.

**After each answer:** show the correct answer clearly, optionally highlight the right option, count correct answers, and smoothly transition into scoreboard. Don't let a permanent glow obscure answer content. For OBS 720p viewers, all meaningful labels must remain legible after downscaling.

## 4. Scoreboard redesign direction

Preserve `ReusableScoreboard` data API and ranking/pagination. Redesign **3 visual states**, not 3 independent scoring implementations:
- **Round result:** concise winner/highlight + rank/points change for this round, no table overload.
- **Intermission:** top three podium + upcoming game + ONE clear next-round action.
- **Final:** prominent winner, top-three focus, scroll/paginate remaining players, total points and last-five round breakdown.

Separate row calculation from presentational components when refactoring. Support arbitrary player counts, 1–10 round tours, long names, both languages, and no-result states; do not mutate scoring or Twitch messages for design changes.

## 5. Priority / safe rollout

**P0 (done in v16):** translation precedence bugs, interpolation mismatch, duplicated keys, five-round scoreboard window, localization contract tests.

**P1 (next UI pass):** shared QuestionShell with layout variants and spacing tokens; first visual pass on one choice-based and one interaction-heavy game; 720p/1080p/1440p + RTL screenshots inside Electron. Then propagate with the shared shell to the other nine.

**P2:** split scoreboard view into reusable `ScoreboardHero`, `ScoreboardTable`, `Podium`, `Pagination` parts; add responsive handling and transitions. Handle remaining hardcoded strings per game and redesign tour order badges to communicate actual shuffle behavior.

## 6. Verification and limitations

Passed standalone checks: `verify:localization-contract`, `verify-game-picker-v14`, `verify-v2-minigame-baseline`, `verify-v2-minigame-grid`, `verify-v2-scoring-policy`, `verify-v2-final-flow-lock`, `verify-shared-back-button`, `verify-typography-system`, `verify-css-modules`, and direct Node execution of the scoreboard round-window scenarios plus translated `{name}` / `{{count}}` outputs.

**Full React/Electron build not run** here: project dependencies are absent, and global `tsc --noEmit` reports missing `vite/client`. This v16 patch changes localization and scoreboard correctness only. **It does not claim that the complete question redesign has been implemented or visually validated.**
