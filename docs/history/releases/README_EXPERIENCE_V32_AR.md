# Ta7ady ElGeel — V32: Stage Flow & Illustrated Rules

**النسخة الأساسية:** V31 Unified Host Answer. لم يتم تعديل أي منطق نقاط أو حركة Lucky Cup V30 أو طريقة إجابة الهوست.

## تغييرات السلوك

1. **الستارة:** شاشة اللوبي أو اللعبة القديمة تفضل معروضة كـSnapshot لحد ما الستارة تقفل بالكامل. المحتوى الجديد مش بيُعرض داخل المسرح غير مع مرحلة فتح الستارة. صوت الانتقال بياخد بيانات الحالة الحية بدون تجميد.
2. **كشف الإجابة:** شِلنا مؤقت الـ4800ms. الإجابة تفضل ظاهرة لحد ما الستريمر يضغط **إظهار الترتيب**. الزرار كبير، واضح، في الركن العلوي من اللوحة، وله حالة Hover وFocus. الضغط عليه يفتح الـScoreboard داخل نفس Phase؛ وبعدها زرار الـScoreboard ينقل للجولة التالية. لا توجد مهلة تلقائية لكشف الإجابة.
3. **أماكن الاختيارات:** اختيار الإجابات لا يتحرك ولا ينزل عند كشف الإجابة لأن الزرار والإعلان أصبحا Absolute Overlay خارج حساب ارتفاع الـGrid. أرقام الأرض المكررة اختفت، مع الحفاظ على مناطق التواجد والحركة للجمهور على المسرح.
4. **توحيد الشاشات:** جميع الألعاب المسجلة الـ11 بتستخدم QuestionScreenShell بتقسيم موحد: عنوان وتايمر، مساحة محتوى، إجابات أفقية عند وجود اختيارات، وعداد. الألعاب اللي بتتطلب كتابة رقم/كلمة مباشرة (Count The Beat وHangman) تستخدم Focus View على نفس الشِل. Before Or After بقت تعرض خياراتها بالأسفل مع إزالة تكرار أرقام الأوامر من الكروت الأساسية.
5. **شاشة الشرح:** رسم توضيحي *مختلف لكل لعبة* + مثال لإجابة شات + 3 خطوات بأيقونات مخصصة. أمثلة: أطباق وبلاد، أشكال وعدّها، متاهة ومسار، تسلسل حدثين، لوجو غامض، النوتات، 3 كوبايات وكورة حقيقية من ملفات اللعبة، صح/غلط، ذاكرة وعدّ، كلمات ناقصة، علاقة شخصين. عربي/إنجليزي. تم إضافة شرح صحيح لـLucky Cup وCount The Beat بدل خطوات Shape Count القديمة.
6. **تحسينات صغيرة:** النصوص المباشرة في Hangman وTrue/Fake/Memory Count اتعدلت للعربية والإنجليزية. قواعد النقاط في Memory Count وCount The Beat ظلت موجودة؛ دليل نقاط Memory Count اتنظم داخل الشاشة بدل ما يكون عنصر Grid خارجها.

## ملفات العمل

- `src/ui-react/components/gameplay/GameplayOverlay.tsx`
- `src/ui-react/components/gameplay/shared/RoundRevealContext.tsx` (جديد)
- `src/ui-react/components/gameplay/shared/MiniGameIntroIllustration.tsx` (جديد)
- `src/ui-react/components/gameplay/shared/question-shell.tsx`
- `src/ui-react/components/gameplay/citizens/ChoiceSpotlights.tsx`
- `src/ui-react/components/gameplay/shared/modern-question-games.ts`
- `src/ui-react/context/GameContext.tsx`
- `src/ui-react/components/visual/GameSceneStage.tsx`
- `src/ui-react/styles/experience-unification-v32.css` (جديد)
- تحديثات 6 شاشات ألعاب، الترجمة، `main.tsx` واختبارات الرجوع.

## التحقق

- `node scripts/verify-experience-v32.mjs` — ناجح.
- `node scripts/verify-v2-scoring-policy.mjs` — ناجح.
- `node scripts/verify-unified-host-answer-v31.mjs` — ناجح.
- `node scripts/verify-shared-choices-v25.mjs` — ناجح بعد تحديث التوقعات القديمة بما يوافق كشف الإجابة اليدوي.
- تحقق نحو 12 من اختبارات التوافق والثبات الأخرى — ناجحة.
- مراجعة Syntax بــ TypeScript parser لملفات المشروع — ناجحة.
- **الاختبار البصري النهائي داخل Electron لم يتم في بيئة التسليم؛ تجربة المستخدم على جهازها مطلوبة خصوصاً أبعاد 720p و1080p.**

## التركيب

الـPATCH ينسخ فوق **V31** (وليس V30 أو V27). فك الضغط في جذر المشروع مع دمج `src` و`scripts` وملفات المشروع. لا تحذف ملفات Assets القديمة. النسخة الكاملة `SOURCE` تستخدم إذا كان عندك نقص في الملفات. بعد التركيب نفذي `npm run typecheck` و `npm run dev` على جهازك.
