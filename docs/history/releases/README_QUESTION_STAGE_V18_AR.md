# Ta7ady ElGeel — Stage Question Polish v18

## الهدف
إصلاح مشكلات شاشة الأسئلة الحقيقية الظاهرة في Electron، مع الحفاظ على منطق اللعبة والمحتوى وتزامن إجابات Twitch والنقاط. **هذا تحديث للمشروع نفسه** وليس صورة تصميم فقط. مبني مباشرةً على Question Experience v17.

## 1. إصلاح ترتيب الإجابات (P0)
- **السبب المؤكد:** `FoodOriginScreen.tsx` كان يستعمل `seededShuffle(food.choices, seed)` مجددًا في الـUI، بينما `FoodOriginMiniGameService` رتّب الإجابات وأعطاها أوامر `!1…!4` مسبقًا. هذا كان يفصل ترتيب العرض عن إجابة Twitch الصحيحة.
- أُزيل الترتيب العشوائي الثاني بالكامل. العرض يرتّب الخيارات عبر `optionNumber` فقط، من دون تغيير الأرقام التي ينتجها الـService.
- أضيف ترتيب موحّد في `QuestionScreenShell` عبر الرقم المستخرج من أمر الإجابة؛ والصفوف الأرضية تُرتّب بالطريقة نفسها. الـUI لا يغيّر ارتباط رقم الاختيار بإجابة المستخدم أو نقاطه.

## 2. تنظيم السؤال في Food Origin / Maze Gates
- تحسين الهرمية البصرية للسطر الأعلى: اسم اللعبة، رقم السؤال، المؤقت.
- تكبير نص السؤال وأرقام الأوامر وأسماء الاختيارات مع الألوان المتجانسة.
- مساحة صورة كبيرة يسار/يمين الاختيارات حسب اللغة (Food Origin)، ومساحة أفقية للمتاهة (Maze Gates).
- تمييز الاختيار الصحيح بإطار أخضر واضح وعلامة ✓ وتخفيف غير الصحيح.
- شريط الإجابة الصحيح صار أوضح، مع مدة عرض **4.8 ثانية** قبل الانتقال المرئي إلى شاشة نتائج الجولة. مرحلة الـScoring ذاتها لا تتغير ولا تبدأ تلقائيًا.

## 3. إجابة الهوست
- في **Food Origin وMaze Gates فقط**: نُقل إدخال إجابة الهوست من منطقة عائمة تُزاحم الشخصية وأرقام الأرض، إلى الجزء السفلي من اللوحة الرئيسية بجانب تعليمات Twitch وعدد الإجابات.
- إزالة «HOST ONLY / PRIVATE ANSWER» والنصوص المتكررة في العرض المدمج، والاكتفاء بـ «إجابة الهوست» وحقل ورمز إرسال.
- الحقل ما زال `type=password`، والوظيفة تستعمل **نفس** `submitPrivateStreamerAnswer`، ونفس التحقق من عدد الاختيارات.
- الألعاب الأخرى تحتفظ حاليًا بالـDock القديم إلى أن تُجرَّب بشكل مستقل.

## 4. أرضية المسرح
- تصميم جديد لمكوّن `ChoiceSpotlights` المشترك، دون صور الدوائر ذات الأرقام القديمة.
- قواعد بيضاوية بإضاءة رفيعة، رقم كبير، وفوقه عداد صغير للإجابات، مع إظهار اختيار الإجابة الصحيحة في مرحلة الكشف.
- أضيف ملف **`answer-stage-layout.ts`** مصدر وحيد لإحداثيات الصف؛ **شخصيات الجمهور والدوائر يستخدمان نفس القيم** (اليسار 20% والعرض 60%، أعلى 84.2% وارتفاع 13.4%). هذا يحل أيضًا الاختلاف القديم بين مركز الدائرة ومركز وقوف اللاعب.
- ترتيب 1→4 الأرضي يظل LTR حتى لو كانت لغة القوائم عربية، حتى يطابق إحداثيات حركة الشخصيات الثابتة.
- التغييرات هنا **مشتركة بين الألعاب** التي تعرض خيارات رقمية على الأرض.

## 5. الإضاءة
- إضافة 3 أشعة علوية هادئة وحركتين ضوئيتين أرضيتين خلف محتوى السؤال في **مشهد الميني جيم فقط**.
- مؤثرات CSS بسيطة، `pointer-events:none`، لا تحتاج صور أو إنترنت، وتحترم `prefers-reduced-motion`.

## الملفات
**الجديدة:**
- `src/ui-react/components/gameplay/shared/answer-stage-layout.ts`
- `src/ui-react/styles/question-stage-v18.css`
- `scripts/verify-question-stage-v18.mjs`
- `README_QUESTION_STAGE_V18_AR.md`

**المعدلة:**
- `src/ui-react/components/gameplay/minigames/FoodOriginScreen.tsx`
- `src/ui-react/components/gameplay/minigames/MazeGatesScreen.tsx`
- `src/ui-react/components/gameplay/shared/question-shell.tsx`
- `src/ui-react/components/gameplay/shared/citizen-helpers.ts`
- `src/ui-react/components/gameplay/shared/answer-helpers.ts`
- `src/ui-react/components/gameplay/citizens/ChoiceSpotlights.tsx`
- `src/ui-react/components/streamer/PrivateStreamerAnswerDock.tsx`
- `src/ui-react/components/gameplay/GameplayOverlay.tsx`
- `src/ui-react/components/visual/VisualWorldLayer.tsx`
- `src/ui-react/App.tsx`
- `src/ui-react/main.tsx`
- `package.json`

## الاختبارات المنفذة
- ✅ `verify-question-stage-v18.mjs` — ترتيب الأوامر، ثبات تعيين الإجابات، وتماثل إحداثيات الدوائر وحركة الجمهور، وموضع إدخال الهوست والإضاءة.
- ✅ `verify-question-experience-v17.mjs`.
- ✅ `verify-localization-contract.mjs`.
- ✅ `verify-v2-scoring-policy.mjs`، و`verify-v2-final-flow-lock.mjs`.
- ✅ `verify-css-modules.mjs`، و`verify-sprite-frame-aliases.mjs`.
- ✅ `security-audit.mjs` — **24 ناجح / 0 فشل**.
- ✅ فحص صياغة **12 ملف TS/TSX**، وفحص Parse لملف CSS الجديد بـPostCSS.
- ⚠️ `npm run typecheck` لم يكتمل لأن حزم `node_modules` **ليست مثبتة كاملة في بيئة التنفيذ**؛ الخطأ `TS2688 Cannot find type definition file for vite/client`. محاولة `npm ci` هنا لم تكتمل بسبب توقف عملية تنزيل التبعيات. هذا ليس إثبات نجاح Build أو Electron.
- ⚠️ محاكاة Chrome لم تُكمل التقاط Screenshots، ولذلك لم أعتمد أي صورة معاينة على أنها تشغيل فعلي. يُرجى تجربة التعديلات على Windows وتقييمها بصريًا.

## سيناريوهات QA على Windows
1. **Food Origin قبل انتهاء الوقت:** تظهر أرقام `!1`, `!2`, `!3`, `!4` بالترتيب داخل اللوحة، وكل بلد بجانب رقمها الثابت من الـService.
2. أرسل من Twitch أمرًا مثل `!2` وتأكد أن اللاعب يقف على **الدائرة 2**، وأن نتيجة الإجابة تحسب على اختيار 2 المعلن، لا على ترتيب عشوائي آخر.
3. أدخل إجابة الهوست من أسفل اللوحة الجديدة؛ تأكد من وصولها، وأن الحقل يُفرَّغ والرسالة لا تكشف الإجابة علنًا.
4. في مرحلة Scoring: راجع لافتة الإجابة الصحيحة باللغتين، العلامة الخضراء، العلامة الأرضية، والانتقال إلى الـScoreboard بعد 4.8 ثانية.
5. جرّب Maze Gates، و2/3/4 اختيارات، وخصوصًا انتقال المواطنين إلى نفس مركز دوائر إجاباتهم.
6. جرّب 1280×720 و1920×1080، مع العربية وRTL والإنجليزية، وOBS وعشرات اللاعبين للتأكد من المقروئية وتوزيع العناصر.
7. جرّب `prefers-reduced-motion` للتأكد من إيقاف حركات الضوء الاختيارية.

**تنبيه:** هذا التحديث يُحسّن Food Origin وMaze Gates بصريًا، ويحدث أرضية الاختيارات المشتركة. بقية شاشات الأسئلة تبقى بتخطيطها القديم مؤقتًا حتى تعتمد التجربة الجديدة. لم نغيّر حساب النقاط أو قواعد Twitch أو الـScoreboard.
