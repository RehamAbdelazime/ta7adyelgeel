# تحدي الجيل — مراجعة تنظيف المشروع V48

## المطلوب من المستخدم

- لا نريد إعادة تجربة استعراض واجهة Playwright ولا إرسال Screenshots.
- لا نريد لوحة Host Panel في اللعبة النهائية.
- الصور الحقيقية للأفلام والمشاهير ستُضاف لاحقًا، ولا نُظهر رسومات بديلة عنها.
- يبقى **آخر Regression Test واحد واضح** يُشغل على Windows.

## تغييرات إصدار التنظيف

1. إزالة زر HOST ولوحة Host Production وDeveloper QA وبوتات الاختبار من واجهة React والـruntime production.
2. نقل محاكاة بوتات الاختبار إلى `tests/helpers` لتظل متاحة للاختبارات البرمجية **فقط**، دون أن تدخل التطبيق النهائي أو تسجل تقدمًا للمشاهدين.
3. إزالة سكريبت تشغيل الاختبارات البصرية الآلي (`RUN_FULL_QA_WINDOWS.bat`)، وسكريبتات Playwright القديمة، وCSS الخاصة بلوحات الاختبار، والإشارات غير المستخدمة لها في قواعد Legacy.
4. الإبقاء على شخصية الهوست **على المسرح** وإدخال إجابته وأزرار كشف الإجابة/النتائج، وعلى الإعدادات العادية؛ هذه وظائف اللعب وليست الـHost Panel المحذوفة.
5. الاحتفاظ بمنطق الـ7 ألعاب العامة، Tour/Single، الـScoreboards، Spectators، XP، Levels، Chaos، حماية البيانات المحلية.
6. عدم حذف ملفات رسومات أو أجزاء ديناميكية اعتمادًا على أدوات تخمين الكود غير المستخدم وحدها؛ تمت إزالة العناصر المرتبطة باللوحة بعد تتبع مسارات الاستيراد.
7. إضافة `RUN_FINAL_REGRESSION_WINDOWS.cmd` وفحوص إغلاق الـHost Panel في `scripts/release/verify-release-contract.mjs`.
8. تحديث الاختبار القديم الذي حاول قراءة ملف HostProductionPanel المحذوف؛ الآن يراجع مرحلة اللعب الحقيقية.
9. تجميع الملاحظات التاريخية والإبقاء على README واحدة محدثة لإصدار التنظيف.

## التحقق الذي تم داخل بيئة التنفيذ

- `node scripts/run-all-regressions.mjs`: **56 / 56 ناجح**.
- `node --test tests/qa/core-scenarios.test.cjs tests/qa/state-and-progression.test.cjs`: **71 / 71 ناجح**.
- `tsc -p tsconfig.quality-v38.json`: **ناجح** (Game Core فقط).
- `node scripts/release/verify-release-contract.mjs`: **18 / 18 ناجح**.
- `node scripts/qa/verify-stabilization-v47.mjs`: **31 / 31 ناجح**.
- `node scripts/qa/static-audit.mjs`: لا أخطاء Parse أو Import مُبلّغ عنها، لكن فيه تحذيرات تتعلق بالميديا.

لم يمكن تأكيد `npm run typecheck` الكامل أو Vitest أو Vite+Electron production build لأن npm packages غير متوفرة محليًا؛ محاولة `npm ci --offline` توقفت عند ملف غير موجود في الـnpm cache. هذا **ليس نجاحًا** ولا يتم تمريره على أنه نجاح. اختبار Windows الأخير سيحسمه.

## آخر اختبار على Windows

بعد `npm ci`، شغّلي `RUN_FINAL_REGRESSION_WINDOWS.cmd` (أو `npm run regression:final`). لا يوجد فيه اختبار صور ولا Host Panel. النتائج ستُكتب في `release-check/FINAL_REGRESSION_SUMMARY.txt`. لو فشل Build، اختبار ملفات Build يتسجل SKIPPED ولا يُعتبر PASS.

## شروط لم تتحقق بعد للإصدار الفعلي

- إتمام **Full TypeScript + Vitest + Vite + Electron** بنجاح على Windows.
- مراجعة ملف EXE النهائي بفتح التطبيق واستخدامه فعليًا؛ لا يُستدل عليه من نجاح Build فقط.
- إضافة صور حقيقية مملوكة/مصرح باستخدامها. حالة باك الصور في هذه النسخة: **0 محلية، 36 روابط خارجية، 14 بدون مصدر** (يتغير العدد بعد إضافة الصور).
- التحقق من الصور والأذونات، ومراجعة أي تنبيهات أمان لـnpm dependencies قبل التوزيع.

**النتيجة:** نسخة مصدر منظفة بهدف Release Candidate، لكنها ليست شهادة إصدار جاهز ولا تحتوي على صور مؤهلة للبث.
