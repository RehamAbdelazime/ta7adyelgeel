# V45 QA Fix 3 — تشغيل بوتات الاختبار داخل React StrictMode

## لماذا توقف عند visual-sweep.mjs:171؟

React StrictMode في وضع التطوير يكرّر setup/cleanup للـeffects. كان GameProvider
يستدعي `qaBots.destroy()` في أول cleanup ثم لا يعيد تفعيل الـcontroller،
فتتحول `addBots(5)` إلى no-op، ويبقى العدد صفر حتى تنتهي مهلة 10 ثوانٍ.

## ما الذي أصلحناه؟

- إضافة تفعيل حقيقي `activate()` لكل مرة يعاود React تركيب الـeffect.
- الاحتفاظ بإلغاء المؤقتات والمستمعين عند الإزالة الفعلية للمكون.
- منع مشكلة جديدة ظهرت في الاختبار: عند Remove ثم Add مباشرة، كانت نفس IDs
  القديمة تصطدم بـcooldown أوامر !join؛ الآن كل جيل بوتات له IDs جديدة.
- إظهار معلومات `qaBots` و`qaControllerActive` في جسر QA المحلي.
- عزل Vite الخاص بالـvisual sweep في المنفذ 5187 بدل إعادة استخدام خادم قديم
  على 5173؛ وإضافة screenshot + diagnostics عند أي فشل مبكر.
- إضافة اختبارين جديدين لدورة StrictMode وتوصيل GameProvider.

## التطبيق

- هذا التحديث فوق **V45 QA HOST RECOVERY** (آخر نسخة كاملة تم تسليمها)،
  وليس فوق V43 أو V44 مباشرة.
- أغلقي نوافذ npm dev/Vite القديمة، ويفضّل أيضًا Electron قبل التشغيل.
- انسخي ملفات الـPATCH داخل جذر مشروع V45 مع الاستبدال.
- شغّلي `RUN_FULL_QA_WINDOWS.bat` المعتاد، أو لتجربة الواجهة فقط `npm run qa:ui`.
- من اللعبة نفسها جربي HOST/F9 → QA → +5 bots.
- عند حدوث فشل، أرسلي `qa-artifacts/qa-step-7.log` و
  `qa-artifacts/ui-latest/report.json` وصورة `RUNNER_FATAL_debug` إن وُجدت.

## حدود الاختبار

اختبارات GameStore وQaBotController وفحص TypeScript النواة وNode syntax نجحت.
أما تشغيل Playwright/Chromium GUI على Windows فلم يحدث في بيئة التسليم، لذلك
قد تكشف جولتك المحلية مشكلات أخرى غير هذه المشكلة المحددة.
