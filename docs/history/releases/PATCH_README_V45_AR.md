# V45 Strict QA — تحديث V44

1. هذه نسخة PATCH **تُطبق على V44 الأصلية فقط**. انسخي محتويات هذا الـZIP بجانب ملفات V44 ووافقي على Merge/Replace.
2. لا يحذف التحديث ملفات ألعاب أو صور. ويضيف ملفات `scripts/qa/` و`tests/qa/` و`RUN_FULL_QA_WINDOWS.bat` و`docs/STRICT_QA_V45_AR.md`.
3. لو ما عندكيش V44 كاملة، استخدمي V45 FULL SOURCE في فولدر جديد وفارغ.
4. للتشغيل اضغطي مرتين على `RUN_FULL_QA_WINDOWS.bat` بعد فك الضغط؛ التقرير في `qa-artifacts/index.html`.
5. الإصلاحات الإنتاجية المضمّنة: إتاحة Host/QA Panel بزر HOST/F9، عدم تخطي شاشة شرح اللعبة عند تغييرها داخل Full Tour، منع احتساب QA bots ضمن XP النهائي.
6. نتائج الاختبار المحلية تمثل Node/core/regression/static فقط؛ فحص الواجهة الكامل سيجري على جهازك باستخدام Chromium محلي وMock Twitch، وتُعرض النتيجة **بأخطاء فعلية ولو لم تنجح**.
