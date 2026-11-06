# إصلاح تشغيل اختبارات V45 على Windows (QA Setup Hotfix)

## المشكلة

في ملف `RUN_FULL_QA_WINDOWS.bat` القديم، كان التثبيت يبدأ بـ`npm ci` ثم يشغّل `npm install --no-save --no-package-lock playwright` داخل **جذر مشروع اللعبة**. npm أظهر رسالة `Cannot read properties of null (reading 'edgesOut')` أثناء حل شجرة الاعتماديات. `npm ci` نفسه نجح؛ المشكلة في تثبيت Playwright الإضافي بهذه الطريقة، وليست في منطق الألعاب أو في صورها.

تحذيرات `deprecated` و `npm audit` موضوع مختلف: لا تشغّلي `npm audit fix --force` كطريقة لعلاج خطأ التثبيت؛ التغييرات الإجبارية قد تكسّر المشروع.

## الإصلاح

1. Playwright يُثبت في `.qa-tools` **منفصلًا عن `node_modules` الخاص باللعبة**. لا تتغير `package.json` أو `package-lock.json`.
2. اختبارات Chromium وElectron تستخدم `scripts/qa/load-playwright.mjs` لاستيراد Playwright من المشروع إن كان موجودًا، أو من `.qa-tools` بديلًا.
3. كل تشغيل يراجع تثبيت Chromium من خلال أداة Playwright بدل الاكتفاء بوجود فولدر `ms-playwright`، إذ قد يكون الفولدر موجودًا والمتصفح نفسه ناقصًا.
4. `.qa-tools` مُستثنى من ملفات Git/الحزم، ولا يحتوي على بيانات المشاهدين.

## خطوات التنفيذ

- لو أنتِ على V45 بالفعل: فكّي **Hotfix PATCH** ثم انسخي الملفات داخل فولدر V45 الحالي مع الموافقة على الاستبدال.
- شغّلي `RUN_FULL_QA_WINDOWS.bat` مرة أخرى. تثبيت اللعبة السابق بـ`npm ci` لن يتكرر إذا كانت `node_modules\vite` موجودة.
- يلزم إنترنت أول مرة لتنزيل Playwright وChromium. ممكن التنزيل الأول للمتصفح يكون كبيرًا.
- لو واجهتي نفس خطأ npm داخل فولدر `.qa-tools` نفسه: ابعتي ناتج `node -v` و`npm -v` وآخر 25 سطر من سجل npm الظاهر في الخطأ.
- بعدها افتحي `qa-artifacts/index.html` وراجعي `qa-artifacts/ui-latest/index.html` والصور؛ نجاح الـUnit Tests لا يضمن جودة الشكل.

## حدود الإصلاح

لا يغير Gameplay أو Twitch أو بيانات XP أو Chaos أو واجهة اللعب. هو تصحيح لتجهيز وتشغيل منظومة QA فقط. **لم يُجرّب تثبيت Playwright/Chromium من الإنترنت أو تشغيل الواجهة على Windows في بيئة التحضير؛** يجب اختبار ذلك عندك.
