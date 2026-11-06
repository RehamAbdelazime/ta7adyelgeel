# V45 — إصلاح توقف الـUI QA عند إضافة 5 بوتات

## السبب الجذري

كان `GameProvider` بينشئ `QaBotController` ثم ينفّذ `qaBots.destroy()` في cleanup الخاص بـ`useEffect`.
React `StrictMode` في وضع التطوير ينفّذ دورة (setup → cleanup → setup) عمدًا. ولأن كود `destroy()`
يضبط `destroyed = true` ولا توجد إعادة تفعيل عند setup التالي، فكانت `qaBots.add(5)` ترجع فورًا من غير تسجيل أي لاعب.
لذلك `visual-sweep.mjs:171` انتظر 10 ثوانٍ ثم انتهى بـ `RUNNER_FATAL`.

## الإصلاح

- إضافة `QaBotController.activate()` لاستعادة الاشتراك مع GameStore بعد cleanup.
- ربط الـsetup والـcleanup بشكل صحيح في `GameProvider` مع الحفاظ على إلغاء المؤقتات وعدم تسريب المستمعين عند الإغلاق.
- إصلاح إعادة إضافة نفس عدد بوتات الاختبار بعد Remove، عن طريق تغيير IDs في كل جيل لتجنب Cooldown التسجيل القديم.
- إضافة حالة `qaControllerActive` و`qaBots` إلى جسر الاختبار المحلي فقط، لتسهيل تشخيص التوقفات.
- تحسين رسالة خطأ تسجيل البوتات، والتقاط لقطة شاشة وحالة اللعبة حتى لو توقّف الاختبار مبكرًا.
- إضافة اختبار Unit/Integration يحاكي دورة React StrictMode، ويسجل 5 بوتات ويُجري إجابات حقيقية ثم يحذفهم.

## التشغيل على Windows

1. أغلقي اللعبة وأي نافذة Vite/npm dev مفتوحة، خصوصًا الموجودة على `127.0.0.1:5173` حتى لا يفحص Playwright نسخة قديمة.
2. خذي نسخة احتياطية، ثم انسخي محتويات PATCH فوق فولدر **V45 Host Recovery** نفسه، أو افكي النسخة الكاملة في فولدر جديد.
3. شغّلي `RUN_FULL_QA_WINDOWS.bat`؛ مكتبات اللعبة المثبتة سابقًا لا تحتاج إعادة تنزيل بالضرورة.
4. اختبري أيضًا من اللعبة: HOST (أو F9) → QA → +5 bots. يجب أن تظهر 5 شخصيات رسمية.
5. افتحي `qa-artifacts/index.html` ثم `ui-latest/index.html`. إذا فشل سيناريو لاحق، ابعتي `qa-artifacts/qa-step-7.log` مع `qa-artifacts/ui-latest/report.json`.

## حدود التحقق

تم اختبار سيناريو React StrictMode في اختبار برمجي على GameStore الحقيقي. لا يمكن اعتبار تجربة Chromium أو واجهة Electron ناجحة على Windows إلا بعد تشغيلها هناك؛ الاختبار الكامل قد يكشف مشكلات أخرى مستقلة.
