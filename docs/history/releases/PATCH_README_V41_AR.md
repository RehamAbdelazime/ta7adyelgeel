# V41 — Character Progression: XP at session end, No Coins

**ابدئي من V40**، أو فكّي النسخة الكاملة V41 في فولدر جديد وفاضي (الأفضل).

## تركيب PATCH ONLY
- فكّي محتويات الـZIP في جذر مشروع V40 الذي يحتوي على `src` و`public` و`package.json`، مع استبدال الملفات المتطابقة.
- مفيش ملفات قديمة لازم تتحذف يدويًا في V41؛ كل التغييرات استبدال ملفات وإضافة ملفات جديدة.
- شيّكي `npm run verify:progression-v41` ثم `npm run verify:all`، وبعدها `npm run dev` في بيئة فيها dependencies مثبتة.
- لا تمسحي بيانات `profiles.json`: التقدم القديم في XP وLevel محفوظ، وCoins القديمة يتم تجاهلها ولن تحفظ مجددًا.

## القواعد
- XP فقط عند نهاية Full Tour أو جلسة Single MiniGame كاملة، حتى مع الإنهاء المبكر: لا XP عند كل سؤال.
- Final Scoreboard: +XP وLevel/LEVEL UP لكل Official شارك بإجابة واحدة على الأقل.
- الترتيب أثناء التور يظل بالنقاط العادية؛ المتفرجون لا يحصلون على XP، ولا توجد عملة داخل اقتصاد اللعبة.
- `!profile` يعرض Level / XP / الدور والـXP المطلوب للمستوى التالي، بدون Coins.
- منحنى المستويات القديم محفوظ، دون Reset.
- شرح المعادلات في `docs/PROGRESSION_V41_AR.md`.

## QA
- Core TypeScript typecheck و50/50 Regression Verifiers ناجحين؛ تشغيل Electron وواجهة المستخدم ما زال بحاجة لتجربة فعلية.
