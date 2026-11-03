# Casual Settings v10 — Patch فوق v9 فقط

افتحي `files/` وانسخي المحتويات إلى جذر مشروع Arcade Settings v9 مع السماح باستبدال الملفات ذات الأسماء نفسها.

بعد النسخ **احذفي** ملف الـCSS التالي من المشروع القديم:
`src/ui-react/styles/arcade-settings-v9.css`

تأكدي من استيراد `casual-settings-v10.css` في `src/ui-react/main.tsx` ثم شغّلي:
```
npm run verify:premium-settings
npm run verify:cleanup
npm run build
```
إذا كانت نسخة المشروع مختلفة عن v9، استخدمي الـFull SOURCE بدل Patch.
