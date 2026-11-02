# Lobby visual QA and rework

## Scope

This pass is based on the latest working Ta7ady ElGeel maintenance baseline and the user's screenshot of the running 16:9 lobby. It addresses the lobby composition and visual hierarchy only; it does not change game rules, scoring, question flow, Twitch command handling, or the mini-game grid.

## Problems observed in the supplied running-screen capture

- The supplied brand image contained a low-contrast dark wordmark beneath the cyan/magenta mark. On the dark LED background that second wordmark appeared as a ghost logo and visually collided with the separate localized title.
- The brand block was too wide for its panel, which made the logo/title hierarchy feel crowded.
- `LIVE CHAT` and the streamer name occupied one visual row and overlapped at common stage sizes.
- The settings control still looked like a boxed settings badge rather than a secondary lobby action.
- The host was too small and did not look firmly grounded on the stage wing.
- The lobby floor and empty chat panel did not have enough restrained ambient movement to make the set feel active.

## Changes made

### Brand mark and title

- Rebuilt `public/assets/game/runtime/ui/main/ta7ady_brand_mark.png` from the exact mark supplied by the user.
- Removed dark/low-saturation pixels from the mark asset that produced the ghost wordmark. The colorful cyan/magenta stripes remain; the localized product name is rendered once as live text beneath it.
- Kept the brand title on one line within the available LED panel width and maintained a clear hierarchy: mark, product name, slogan, join instruction, primary action.
- Continued using the local Labo Display face for Latin display text. The font asset does not provide Arabic glyphs, so Arabic text falls back to system Arabic-capable faces rather than showing missing-glyph boxes.

### Join guidance and lobby actions

- Kept the localized `!join` instruction visible as a persistent lobby instruction, not only before the first player joins.
- Highlighted `!join` as a distinct LTR token inside the localized sentence for both Arabic and English layouts.
- Kept Play as the primary action and Settings directly beneath it as a quieter text-first link using a simple sliders icon.
- The Settings link reuses the existing application settings event/modal; no second settings implementation was introduced.

### Live chat panel

- Split `LIVE CHAT` and the configured Twitch channel name into separate rows so they cannot collide.
- Removed the extra `STREAMER` label and removed the synthetic `@` prefix. The channel name is shown only when a configured channel name exists.
- Removed chat message/placeholder copy from the lobby panel. The panel now uses restrained animated ambient rings, a center light, and an equalizer motif as visual texture only; Twitch event handling and `!join` command processing remain unchanged.

### Host and stage atmosphere

- Repositioned and enlarged the lobby host to the right stage wing and aligned the sprite's visual baseline with the stage deck.
- Added subtle lobby-only lighting/sparkle motion, a low-intensity light sweep, and ambient panel motion. These are decorative and do not alter gameplay character positioning.
- Expanded the lobby floor sparkle distribution to 18 particles to create more depth while keeping the central play area readable.
- Added reduced-motion handling so users who request reduced animation receive a still presentation.

### Responsive behavior

- Tuned the composition relative to the existing 16:9 stage container using container-relative sizing and breakpoints for narrower and shorter stage viewports.
- Kept the LED panels, host, brand block, and actions tied to the stage coordinate system rather than the physical desktop viewport. This preserves proportions across common desktop resolutions without stretching the stage art.
- Ultra-wide viewports continue to preserve the 16:9 stage composition rather than distorting the stage background.

## Verification

The following source-level checks passed after this rework:

- `node scripts/generate-runtime-game-config.mjs`
- `node scripts/verify-v2-minigame-baseline.mjs`
- `node scripts/verify-v2-minigame-grid.mjs`
- `node scripts/verify-v2-scoring-policy.mjs`
- `node scripts/verify-landing-experience.mjs`
- `node scripts/verify-v2-final-flow-lock.mjs`
- `node scripts/verify-v2-final-landing-identity.mjs`
- `node scripts/verify-visual-refresh.mjs`
- TypeScript transpile/syntax check for the modified TSX modules
- CSS parser check for `src/ui-react/styles.css`
- ZIP archive integrity check

The image at `ta7adyelgeel_lobby_visual_preview.png` is a composed design preview using the actual project stage background, cleaned brand mark, and corresponding overlay assets/positions. It is not a screenshot captured from a running Electron process.

A full Vite/Electron runtime session, full TypeScript project check, and Vitest suite were not run in this environment because the project dependencies were not fully available here. They should be run on the development machine after `npm ci`.

## Files changed in this pass

- `public/assets/game/runtime/ui/main/ta7ady_brand_mark.png`
- `src/ui-react/components/play/MainScreenPlayFlow.tsx`
- `src/ui-react/components/visual/VisualWorldLayer.tsx`
- `src/ui-react/styles.css`
- `scripts/verify-landing-experience.mjs`
- `docs/lobby-visual-qa-review.md`

No scoring, mini-game service, answer validation, or gameplay lifecycle files were changed in this visual pass.
