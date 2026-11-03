# Ta7ady ElGeel — Scoreboard Interaction & Living Stage v21

## سبب عطل «Back To Stage»

في اللعبة، طبقة `gameplay-overlay-layer` كانت معرّفة بـ `pointer-events: none` بحيث لا تمنع التفاعل مع المسرح، بينما الـScoreboard الجديد في v19/v20 لم يفعّل `pointer-events: auto` لنفسه، عكس مكوّن الـScoreboard الأقدم. النتيجة أن الزر ظاهر لكن لا يستقبل ضغطات الماوس. منطق الرجوع في `TourStateMachine.returnToLobbyFromFinalScoreboard()` كان صحيحًا.

**الإصلاح:** السماح بالتفاعل بدقة في حالتي `tour_complete` و`scoring`، وفي مكوّن النتائج وأزراره، بدون تغيير تفاعل بقية طبقات اللعبة. تمت إضافة مكوّن واحد `ScoreboardPrimaryAction` لكل من نتائج الجولة، والفاصل بين الجولات، والنتيجة النهائية.

## تحسينات الـUX

- زر الفعل الرئيسي صار Pill بحواف ناعمة وخط Fredoka/Alexandria والألوان المستخدمة في اختيار اللعب؛ Hover وFocus واضحان.
- عند إنهاء الميني جيم يدويًا من الإعدادات، يظهر عنوان **SESSION ENDED / انتهت اللعبة** بدلاً من اعتبار الجولات غير المكتملة نتائج نهائية؛ السطر الفرعي يعرض رقم الجولة الحالي من إجمالي الجولات المخططة.
- أضيفت إضاءة Cyan/Pink خفيفة ومتحركة خلف النتائج، خصوصًا عندما يكون عدد اللاعبين قليلًا؛ زخرفتها لا تعترض الماوس.
- أضيف **MiniGameLightingRig** مستقل للمسرح الخاص بالأسئلة والنتائج، فيه 3 إضاءات علوية وكشافان متحركان مع الانعكاس الأرضي في نفس مجموعة SVG، لضمان تزامن الشعاع وبقعة الضوء. لا يحتوي على `requestAnimationFrame` أو تغييرات React مستمرة.
- يُحترم إعداد `prefers-reduced-motion`.

## الاختبارات المنفّذة هنا

- `node scripts/verify-scoreboard-stage-v21.mjs` — ناجح.
- `node scripts/verify-localization-contract.mjs` — ناجح.
- `node scripts/verify-css-modules.mjs` — ناجح.
- `node scripts/verify-v2-minigame-baseline.mjs` — ناجح (11 registered, 8 public).
- `node scripts/verify-v2-scoring-policy.mjs` — ناجح.
- `node scripts/security-audit.mjs` — 24/24 ناجح.
- تحليل TS/TSX للملفات المعدلة باستخدام TypeScript `transpileModule` — بدون أخطاء صياغة.
- تنفيذ مباشر لدورة `startTour → endTourImmediately → returnToLobbyFromFinalScoreboard` في `TourStateMachine` — تحوّل إلى `lobby_open` بشكل صحيح.
- اختبار ضغط زر النتائج من خلال Chromium في بيئة DOM تحاكي `pointer-events: none` المتوارث على دقتي 1650×928 و1280×720 — الضغط وصل بنجاح.

**تنبيه:** المعاينات محاكاة HTML/CSS وليست Screenshots من تشغيل Electron. لم يتم عمل `npm run build` كامل أو اختبار Twitch مباشر بسبب عدم تثبيت حزم المشروع في بيئة التنفيذ. اختبري أولًا نهاية الميني جيم المبكرة، والرجوع للمسرح، وتغيير اللغة ثم إنهاء جولة، والتحقق من الإضاءة وقت اللعب.

## التثبيت

الـPATCH يُطبق فوق v20 **Question Show** فقط، مع الحفاظ على نفس مسارات الملفات. يفضّل تجربة النسخة الكاملة في مجلد مستقل. يشمل PATCH ملفات تعديلات جديدة دون الحاجة لإزالة ملفات v20. `scripts/verify-scoreboard-stage-v21.mjs` اختبار بنيوي يمكن تشغيله بدون بناء Electron.
