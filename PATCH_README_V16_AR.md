# PATCH v16 — Architecture Foundation (apply above Shared Back v15 only)

This patch corrects localization drift, duplicate translation keys, placeholder interpolation, and the scoreboard's 5-round window for long tours. It does **not** redesign gameplay screens yet.

Copy all folders and files from the ZIP into the root of `ta7adyelgeel_source`, **preserving folder structure**. Keep a backup of v15 first.

Check with:

```powershell
npm run verify:localization-contract
node scripts/verify-v2-scoring-policy.mjs
npm run typecheck
```

`npm run typecheck` and complete Electron checks require all `npm install` dependencies, and cannot be certified by this patch alone.

Do **not** delete `translations.ts`, `localization.json`, the localization context, or `useTranslation` — they currently play different runtime/type roles despite duplicated values.
