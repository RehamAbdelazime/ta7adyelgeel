# Landing Experience Polish

## Scope

This update refines the lobby landing screen while preserving the existing stage art, game flow, settings implementation, Twitch command pipeline, and localization system.

## Brand lockup

- Added the user-supplied transparent cyan/magenta mark at `public/assets/game/runtime/ui/main/ta7ady_brand_mark.png`.
- Cleaned the supplied transparent mark by trimming its canvas, removing detached decorative fragments, and upscaling it 2× without changing its two-color design.
- Replaced the previous large illustrated landing logo in the lobby component with a localized wordmark, the new mark, and the existing localized slogan.
- Applied restrained cyan/magenta edge glow and slow drift to the mark. The source mark itself is preserved without destructive edits.
- The old logo assets remain in the project because other screens or future rollback workflows may still reference them; the lobby no longer uses them.

## Lobby actions

- The localized `!join` instruction now remains visible whether or not a player has joined.
- Added a Settings text action directly underneath Play.
- The new action dispatches `OPEN_APP_SETTINGS_EVENT`, which opens the existing global settings modal. Settings logic is not duplicated.
- The floating gear trigger is hidden while the lobby is open; it remains available during an active game/tour.

## Streamer identity and chat panel

- Removed the visible `STREAMER` label and channel `#` prefix. The channel/account name is shown plainly beside the Live Chat title.
- Removed rendered chat messages and empty-state copy from the lobby panel. Twitch chat events and game command processing remain untouched; only their visual message list was removed.
- Replaced the message area with a quiet animated equalizer treatment so the panel remains visually alive without showing chat text.

## Motion and stage host

- Added low-amplitude ambient light sweep, logo drift, subtle join-hint glow, chat-panel breathing, equalizer movement, and host idle motion.
- All motion respects `prefers-reduced-motion`.
- Host positions and sizes use `cqw`/`cqh` relative to the fixed 16:9 stage container instead of the raw desktop viewport, so the anchors remain consistent when the game stage is letterboxed or scaled.
- Lobby host remains on the right wing beside the LED screen. Intro/question/result host remains on the left wing, with feet and floor-pool aligned to the game-stage floor.
- Thinking/hurry artwork had more transparent side padding than the result artwork; its image is scaled within the same position box so its visible size is more consistent without changing its anchor.

## Responsive behavior

- The application continues to render the fixed 16:9 scene without stretching.
- Lobby layout, wordmark, join instruction, settings action, and streamer name use container-relative sizing.
- A container query compresses typography and spacing for narrower desktop stages.
- Ultrawide desktop windows retain the 16:9 scene with side letterboxing rather than distorting stage art or character positions.

## Verification

Run:

```bash
npm run verify:landing-experience
npm run verify:visual-refresh
npm run typecheck
npm test
npm run dev
```

The local structural verification scripts validate the new mark, localization hooks, Settings event bridge, message-free chat panel, responsive stage anchors, and reduced-motion behavior. TypeScript syntax and CSS parsing were checked in the working environment. A full typecheck, Vitest run, and live Electron visual check still require installing project dependencies and launching the application on a desktop runtime.
