# Ta7ady ElGeel — Question & Scoreboard Polish v19

**Baseline:** Question Stage v18.  **Platform:** Desktop React + TypeScript + Electron.  **Visual intent:** casual premium game show, not web dashboard or hardcore UI.

## تنفيذ النقاط السبع

1. **ترتيب الاختيارات**: احتفظنا بإصلاح v18؛ الواجهة تعرض الاختيارات بترتيب رقم الأمر (`!1` إلى `!4`) من غير Shuffle ثانٍ بعد تثبيت أرقام الإجابات في الـGame Core.
2. **ألوان أرقام الإجابات**: كل الاختيارات تستخدم نفس Accent السماوي أثناء وقت الإجابة. اللون الأخضر يظهر فقط للكشف عن الإجابة الصحيحة، ويُخفّف الآخرون.
3. **الكم الكبير من الكلام**: عنوان سؤال Food Origin بالإنجليزي «Where is this dish from?» وبالعربي «الأكلة دي منين؟». نص التلميح مختصر، والتعليمات في الأسفل صارت «Answer in chat: !1–!4» أو «جاوب في الشات: !1–!4» بدل جملة طويلة. اسم اللعبة/السؤال والمؤقت في شريط واحد.
4. **إجابة الهوست**: تحكم الإجابة الخاصة بالهوست أصبح داخل الهيدر المحجوز في شاشة الأسئلة، بجوار المؤقت لا على أرض الجمهور ولا فوق الشخصيات؛ صارت الواجهة حقل إجابة وزر إرسال فقط مع حالة إتمام صغيرة. النسخة العائمة القديمة تُخفى *فقط* أثناء Food Origin / Maze Gates لحظة استقبال الإجابات، وبقية الألعاب تحتفظ بسلوكها الحالي.
5. **الهوية البصرية**: CSS جديد واحد منظم باسم `src/ui-react/styles/game-show-polish-v19.css` ويستخدم Cyan وPink ودرجات داكنة موحدة وخطوط اللعبة المعتمدة؛ لا تغيير لمنطق Twitch أو التقييم.
6. **Scoreboard**: إعادة بناء لواجهة `ReusableScoreboard` لعرض المتصدر في Hero Card، ثم بقية ترتيب اللاعبين في قائمة مختصرة من عمودين. هناك تحكم صفحات وتدوير تلقائي كل 8.5 ثانية للأعداد الكبيرة، ونسخة مستقلة متناسقة `RoundIntermissionScreen` لأفضل ثلاثة واللعبة القادمة. كل حسابات النقاط والصفوف الأصلية تظل مشتركة.
7. **دوائر أرقام الأرض والعدد الكبير**: تم استبدالها بعلامات أرضية موحدة للتوجيه (1–4) من دون عدّاد فوق أرضية الجمهور؛ عدّاد كل اختيار انتقل داخل الاختيار نفسه على شاشة السؤال. `ANSWER_STAGE_LAYOUT` أصبح هو مصدر إحداثيات العلامات واللاعبين؛ تمت إضافة توزيع جماعي متعدد الصفوف بدلاً من تجميع الجميع فوق دائرة واحدة. لا يتم عرض رقم الإجابات على أرضية قد تُغطّى عند وجود عدد كبير.

## نطاق التفعيل / السلامة

- تحسينات `QuestionScreenShell` الجديدة ما زالت **opt-in** على Food Origin وMaze Gates فقط، امتدادًا لـv17/v18. باقي الألعاب ما زالت على التخطيط Legacy، وتحتاج نقلًا واختبارًا تدريجيًا.
- Scoreboard يعاد استخدامه في النتائج المجمعة والنهائية، و`RoundIntermissionScreen` تشارك نفس هوية التصميم.
- النموذج لا يخفي حالات الإجابة أو يغيّر توقيت استقبالها. مؤقت الأسئلة بقي في مكون مستقل.
- عدد المشاركين الكبير: تعرض النتائج 8 أسماء في الصفحة، بما فيها المتصدر في الصفحة الأولى. مثال 72 مشاركًا = 9 صفحات؛ يوجد تنقل يدوي وتدوير تلقائي. ازدحام رسومات الشخصيات نفسها عند 72 شخصًا يحتاج اختبارًا فعليًا في Electron/OBS؛ فحوص التخطيط وحدها ليست إثباتًا كاملًا.

## الملفات المهمة

- `src/ui-react/components/gameplay/shared/question-shell.tsx`
- `src/ui-react/components/streamer/PrivateStreamerAnswerDock.tsx`
- `src/ui-react/components/gameplay/GameplayOverlay.tsx`
- `src/ui-react/components/gameplay/citizens/ChoiceSpotlights.tsx`
- `src/ui-react/components/gameplay/shared/citizen-helpers.ts`
- `src/ui-react/components/gameplay/minigames/FoodOriginScreen.tsx`
- `src/game-core/minigames/food-origin/food-origin-content.ts`
- `src/ui-react/components/gameplay/scoreboard/Scoreboard.tsx`
- `src/ui-react/styles/game-show-polish-v19.css`
- ملفات الترجمة و `src/ui-react/main.tsx`

## الاختبارات التي نُفّذت

- `npm run verify:game-show`: **26/26** فحص بنيوي.
- `node scripts/verify-localization-contract.mjs`: **نجح**.
- v17 / v18 question verifiers: **نجحا**.
- scoring policy / final-flow / CSS modules / sprite aliases: **نجحت**.
- Security audit: **24/24**.
- فحص تركيب TypeScript/TSX للملفات المعدلة، وصحة CSS parsing: **نجح**.
- معاينات **HTML/CSS محاكية** مع أصول المشروع على 1650×928 و1280×720، عربي/إنجليزي، سؤال/كشف/Scoreboard، ولم يُرصد خروج العناصر الرئيسية من مساحة المسرح في هذه المحاكاة. هذه المعاينات **ليست لقطات من Electron**.
- تجربة `npm run typecheck` لم تكتمل بسبب غياب `vite/client` من بيئة Node المتاحة هنا (TS2688). **لا يوجد إثبات نجاح build كامل أو تشغيل Electron على Windows أو اختبار Twitch مباشر**.

## مراجعة فعلية مطلوبة في Windows

- امتحان ترتيب `!1..!4` وارتباط الأوامر بالنقاط.
- استعمال حقل إجابة الهوست في توقيت شديد السرعة مع وجود Twitch chat نشط؛ التأكد من عدم تكرار الحقل العائم.
- كشف الإجابة بعد انتهاء الوقت في العربي والإنجليزي، والتأكد من أن محتوى السؤال لا يقفز.
- اختبار الجمهور 1، 8، 30، 72، ومراجعة أحجام/تداخل الرسومات ووضوح اختيار الأرض وعدّاد كل اختيار داخل OBS.
- تجربة Scoreboard بعد 1، 8، 30، 72 متسابق، وصفحات النتائج والانتقالات والاتجاه RTL.
