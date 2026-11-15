# V89 — إصلاح «أنهي شكل موجود أكتر؟»

**المرجع:** V88 Canonical Full Source.

## المشكلة
في V88 كانت أسئلة Easy تطلب الشكل الأكثر تكرارًا، بينما Medium وHard كانا يطلبان الشكل الذي تكرر **عددًا معينًا** من المرات. ده مخالف لفكرة اللعبة البصرية الأصلية.

## الحل
- **كل الصعوبات الثلاثة:** نفس السؤال «أي شكل موجود بعدد أكبر؟» / `Which shape appears the most?`.
- اللاعب يختار الشكل الأكثر ظهورًا من النظر إلى الشبكة، من غير سؤال برقم مستهدف.
- **Easy:** 3 أشكال، شبكة 5×6 (30 رمزًا)، فرق كبير يسهل ملاحظته.
- **Medium:** 4 أشكال، شبكة 5×7 (35 رمزًا)، فرق أصغر.
- **Hard:** 4 أشكال، شبكة 6×7 (42 رمزًا)، تكرارات متقاربة، لكن الفائز يظل أكثر من الثاني برمزين على الأقل.
- لا يمكن تعادل شكلين على المركز الأول؛ الاختيار الصحيح دائمًا وحيد.
- المكوّن المشترك `QuestionScreenShell` وكروت الإجابات ونظام النقاط والكشف كما هي، بدون إعادة تنفيذ.
- ألغيت فرع `exact` من توليد الأسئلة والرسالة الرقمية غير المستخدمة من الترجمة، وحُصرت `shapeGrid.mode` في `majority` على مستوى الـTypeScript.
- عدّلت شرح الصفحتين في العربي والإنجليزي لاستخدام قاعدة «الأكثر ظهورًا» فقط.

## التحقق
- `node scripts/verify-shape-majority-v89.cjs` — 4,800 جولة Easy/Medium/Hard، فحص عدد الرموز، تفرد الإجابة، أسبقية اختيار رقم الإجابة، وصحة السكور.
- `node scripts/verify-five-game-quality-v38.cjs` — 515 حالة ناجحة بعد تحديث توقعاته.
- `node scripts/verify-v35-runtime-flows.cjs` — ناجح.
- `node scripts/verify-i18n-keys-v81.cjs` و`node scripts/verify-localization-contract.mjs` — ناجحان، 873 مفتاحًا لكل لغة.
- `node --test tests/qa/core-scenarios.test.cjs tests/qa/state-and-progression.test.cjs tests/qa/score-timing-and-ranking.test.cjs` — 89/89 نجاح.
- جميع 91 فحص Regression نُفّذت بنجاح على دفعات؛ التشغيل الموحد توقف بسبب حد وقت البيئة.
- لم يُشغَّل Full TypeScript semantic typecheck أو Electron Windows build هنا.

## طريقة التثبيت
فك ملفات الـZIP الصغير داخل جذر مشروع V88، بجوار `package.json`، واختر Replace. الملفات معدلة مباشرة ولا توجد سكريبتات `APPLY.mjs`.
