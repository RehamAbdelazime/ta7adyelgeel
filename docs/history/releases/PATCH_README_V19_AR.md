# PATCH v19 — Question & Scoreboard Polish

**لازم النسخة الأساسية تكون Question Stage v18 (مش v17 أو v16).**

1. خدي نسخة احتياطية من المشروع الحالي.
2. فكي محتويات ملف PATCH v19 داخل جذر مشروع v18، مع الموافقة على استبدال الملفات المطابقة.
3. من داخل مجلد المشروع شغّلي `npm install` فقط لو تبعيات النسخة مش مثبّتة، ثم `npm run verify:game-show` و `npm run build`.
4. جربي Food Origin ثم Maze Gates وشاشة النتائج، وبعدها اختبري RTL وكثرة المتفرجين داخل Windows/Electron.

مافيش ملفات مطلوب حذفها في النسخة دي. لا تستبدلي `node_modules` من ZIP؛ هو مش مشمول عمدًا. تقارير QA موجودة في `README_QUESTION_SCOREBOARD_V19_AR.md`.
