# V46 — QA visual feedback pass (based on V45 QA Windows Fix4)

Based on the supplied screenshots:

1. Scoreboard: expanded page size 8 → 16, two-column compact ranking, retained separate official/spectator tabs and manual paging. Larger crowds require pages; users must not vanish. Pagination never auto-advances.
2. Removed decorative floor marker pseudoelements and floor circles; the small green dots require real Windows screenshot confirmation after this patch to establish their exact DOM source.
3. Stage `SHOW LEADERBOARD` button moved higher to reduce overlap with the audience at the foot of the stage. Manual host action unchanged.
4. Audience keeps the chosen answer placements throughout the full scoring/reveal phase until the host opens scoreboard (removed 4.8s timer).
5. Nameplates: enforce visible labels for real viewer characters and small crowds of QA bots; keep QA-bot nameplates hidden at heavy load so 72 visible characters do not overlap uncontrollably. For large real audiences `!profile` identifies the viewer via a temporary on-stage card.
6. The final scoreboard includes a prominent winner banner when top official has positive points and the Tour was not ended early. No winner named for zero-score or aborted Tours.
7. Added restrained shape highlights/shadows for circles and hexagons, while preserving count/answer logic. The triangle art and final proportions still need manual graphic QA; this is a small visual polish, not a complete art-redesign.
8. Kept existing host and player artwork and stage arrangement because this iteration targets legibility and regressions. A consistent character scale redesign should follow visual review, not arbitrary CSS adjustments without render inspection.

## Validation
- Native Node QA 71/71 PASS
- Legacy regressions 56/56 PASS
- Strict game-core TypeScript checked (quality TS config) via available `tsc`.
- No Windows Electron / real Playwright screenshot verification in this environment. Review on 1920x1080,1600x900,1280x720 and 5, 25, 100, 500 bots. In particular confirm winner banner does not squeeze the surface and the reveal button is clear of characters.
- User item #9 was left blank; no assumptions made.
