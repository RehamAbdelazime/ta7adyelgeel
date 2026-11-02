# Ta7ady ElGeel — Desktop UX Hardening Source

هذه نسخة مصدرية معدلة مبنية على ملفات `ta7adyelgeel_source.rar` المرفوعة في 2 نوفمبر 2026، وليست ملف EXE جاهزًا للتثبيت. **لم تُبنَ حزمة نهائية** لعدم توفر dependencies محليًا في بيئة التدقيق.

للتفاصيل الدقيقة، راجع `docs/desktop-premium-ux-audit-2026-11-02.md`.

## تشغيل Windows

```powershell
npm ci
npm run verify:desktop-ux
npm run verify:gameplay-config
npm run verify:landing-experience
npm run typecheck
npm test
npm run build
npm run dev
```

إذا أردت ملف Windows portable، بعد نجاح ما سبق نفذ `npm run package:win`.

## ما لا تفعله هذه النسخة

- لا تغيّر قواعد النتائج أو نظام احتساب النقاط أو تصميم الميني جيمز الداخلي.
- لا تقدّم ضمان خلو من كل عيوب UI بدون مقارنة مرئية على Windows مع Twitch.
- لا تتضمن `dist/` أو `dist-electron/` من المصدر المرفوع لأنها مخرجات قديمة لا تعكس تغييرات هذه المراجعة؛ `npm run build` يعيد توليدها.
- تفعيل Electron renderer sandbox مرّ بفحص المصدر الأمني، لكن يلزم فحص الـ preload والـ IPC فعليًا بعد البناء على Windows.
