# PATCH v17 — Question Experience

**قاعدة التطبيق الوحيدة:** `ta7adyelgeel_architecture_foundation_v16_SOURCE.zip` أو مشروع مطبق عليه v16 بالفعل.

انسخ الملفات داخل هذا الـPatch إلى جذر المشروع، مع الإبقاء على بنية المجلدات، وافق على استبدال الملفات المعدلة.

ثم شغّل:

```powershell
npm install
npm run verify:question-experience
npm run verify:localization-contract
npm run build
```

التغييرات تخص Food Origin وMaze Gates فقط. جميع الألعاب الأخرى والـScoreboard دون تغيير بصري.

**لا يحتوي هذا الـPatch على حذف ملفات.** اقرأ `README_QUESTION_EXPERIENCE_V17_AR.md` للاختبارات والقيود.
