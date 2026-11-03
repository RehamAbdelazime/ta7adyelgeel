# Ta7ady ElGeel — Question Experience v17 (مرحلة تجريبية مضبوطة)

## الهدف
إعادة تنظيم شاشة السؤال المشتركة بأسلوب **Casual Game Show** يندمج مع المسرح، مع ضبط القراءة بالعربي والإنجليزي في البث، ومن غير نسخ الواجهة 11 مرة أو التأثير على حساب النقاط.

## المعمارية
- ما زال `QuestionScreenShell` هو المكون المشترك الوحيد لعنوان السؤال والمُؤقت والاختيارات وكشف الإجابة وإرشادات Twitch وعدد الإجابات.
- أُضيفت واجهة اختيارية `layout: 'legacy' | 'choice' | 'focus' | 'interactive'`، والافتراضي **legacy** لتظل الألعاب التسع الأخرى دون تغيير بصري إلى أن تُختبر.
- **Food Origin** أول شاشة بنمط `choice`: صورة أكبر في المنطقة الرئيسية واختيارات واضحة على الجانب وتلميح بالصورة.
- **Maze Gates** أول شاشة بنمط `interactive`: مسار المتاهة يأخذ عرض الشاشة والاختيارات تظهر أسفلها بشكل أفقي، بدل شريط ثابت بعرض 320px.
- نمط `focus` موجود في الـAPI والتخطيط الأساسي لكن **لم يُفعّل بعد على لعبة**؛ يُخصص لألعاب العدّ والتركيز بعد اختبار المحتوى.
- لم نغيّر بروتوكول Twitch أو استلام الإجابات أو سياسة تسجيل النقاط أو الـScoreboard.

## التصميم
- رأس مُدمج لاسم اللعبة (من مفتاح الترجمة في Registry)، رقم السؤال/الجولة، والمؤقت.
- عنوان واضح بالخطين **Fredoka + Alexandria** من نظام v11.
- مساحات محتوى متكيفة مع نوع التحدي؛ Card للخيارات مع أوامر `!1…!4` قابلة للتمييز بصريًا.
- سطر سفلي واحد لإرشادات Twitch وعدد الإجابات. زر **التالي** داخل السطر السفلي عند كشف الإجابة، بدل وجوده كعنصر طافٍ يغطي المحتوى.
- إبراز الإجابة الصحيحة وتعتيم الخيارات الخاطئة باستخدام منطق الكشف المشترك الموجود بالفعل.
- CSS جديد في `src/ui-react/styles/question-experience-v17.css` **مقيّد كليًا** بـ`.qshell-v17` حتى لا يغيّر بقية الألعاب والـScoreboard.
- دعم `prefers-reduced-motion`. تم تعريب وصف الوقت المتبقي لقارئ الشاشة، وكذلك وصف لوحة المتاهة.

## الملفات المعدلة
- `src/ui-react/components/gameplay/shared/question-shell.tsx`
- `src/ui-react/components/gameplay/minigames/FoodOriginScreen.tsx`
- `src/ui-react/components/gameplay/minigames/MazeGatesScreen.tsx`
- `src/ui-react/main.tsx`
- `src/game-core/localization/translations.ts`
- `src/game-core/localization/locale-types.ts`
- `package.json`

## الملفات الجديدة
- `src/ui-react/styles/question-experience-v17.css`
- `scripts/verify-question-experience-v17.mjs`
- `README_QUESTION_EXPERIENCE_V17_AR.md`

## التحقق
- ✅ TypeScript / TSX parsing (6 ملفات معدّلة) باستخدام TypeScript transpilation.
- ✅ CSS Parsing.
- ✅ `node scripts/verify-question-experience-v17.mjs`.
- ✅ `node scripts/verify-localization-contract.mjs`.
- ✅ `node scripts/verify-css-modules.mjs`.
- ✅ `node scripts/verify-v2-minigame-baseline.mjs` — 11 لعبة مسجلة، 8 عامة.
- ✅ `node scripts/verify-v2-scoring-policy.mjs` و`node scripts/verify-v2-final-flow-lock.mjs`.
- ✅ `node scripts/security-audit.mjs` — 24/24.
- ✅ `verify-game-picker-v14` و`verify-mode-picker-v13`.
- ⚠️ **فحص `tsc --noEmit` لم يكتمل**: المشروع لا يحتوي على التبعيات المثبتة كاملة في بيئة التنفيذ، والخطأ `TS2688 Cannot find type definition file for 'vite/client'`. لا نقول إن Build أو تشغيل Electron نجح.
- ⚠️ لم يكتمل التقاط لقطة Chromium من تشغيل الواجهة، ولا توجد معاينة معتمدة بصريًا داخل Electron. يلزم فتح Food Origin وMaze Gates على 1280×720 / 1920×1080، عربي وإنجليزي، في مراحل الإجابة والكشف.

## طريقة التطبيق
الـPatch يطبّق على `Architecture Foundation v16` فقط. انسخ محتوياته فوق جذر المشروع، ثم نفذ:

```bash
npm install
npm run verify:question-experience
npm run verify:localization-contract
npm run build
```

جرّب أولًا **Food Origin** ثم **Maze Gates** في بداية السؤال وقبل/بعد انتهاء الوقت، مع RTL والكيبورد. باقي الألعاب والـScoreboard تظل على العرض السابق لحين إقرار الشكل الجديد.

## الخطوة التالية
بعد مراجعة الصورتين الحقيقيتين من Electron نثبت مقياس المساحات ثم نفعّل نمط `focus` على لعبة عدّ، وبعدها نطبّق الأنماط على الباقي ونبدأ إعادة تصميم الـScoreboard دون المساس بالحسابات.
