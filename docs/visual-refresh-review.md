# Visual Refresh Notes

## Included changes

- Added the user-supplied Labo Display typeface as a local application asset.
- Applied Labo Display as the global Latin UI typeface so headings, gameplay labels, buttons, scoreboards, and numeric readouts share one visual voice.
- Preserved an Arabic-capable fallback stack. The supplied Labo Display file contains Latin glyphs but no Arabic glyphs (and does not include every symbol). Browsers therefore use the next font in the fallback stack per missing glyph; Arabic normally uses Tahoma or another installed Arabic-capable font on Windows. This preserves legibility but means Arabic cannot visually match the Labo Display Latin style unless an Arabic companion font is supplied.
- Replaced the lobby Play button with a text-first control. Its neon underline and subtle particles appear only on hover/focus.
- Repositioned and enlarged the lobby host on the right wing beside the LED screen. The presenter/question/result host is larger on the far-left wing of the mini-game stage so it does not occupy the answer screen; its floor pool follows the same anchor.
- Repositioned intro, answering, and result host poses on the left wing of the mini-game stage, so the pointing pose faces inward toward the screen and the feet align with the floor.
- Increased audience sprite dimensions moderately and tightened per-character visual-scale differences so the cast reads as one consistent group. Adjusted side-row vertical positions so the larger characters remain inside the 16:9 stage.
- Kept the existing bilingual logo image assets untouched. The archive still contains the previous ornate logo pair; no replacement simple-logo image was present in the supplied project/font files.

## Design notes

- The Play underline is hidden in the idle state and expands with subtle particles only on hover or keyboard focus.
- All CSS font-family declarations now use the single `--display-font` token; the question shell inline style uses the same token.

## Verification

Run:

```bash
npm run verify:visual-refresh
npm run typecheck
npm test
npm run dev
```

The visual verification script checks the font asset, Play control hooks, host placement rules, and audience calibration. It does not replace an in-app visual review at the target stream resolution.

## Logo note

The project archive used as the baseline contains `ta7ady_landing_logo_ar.png` and `ta7ady_landing_logo_en.png`; these were preserved. No separate replacement logo file was included with this visual-refresh input, so this change does not overwrite those logo assets.
