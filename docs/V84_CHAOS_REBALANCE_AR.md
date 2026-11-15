# V84 — تعديل أحداث Chaos (من V83 Canonical)

## الأحداث الفعلية (4)

- **Double Trouble ×2** — مضاعفة نقاط الإجابات الصحيحة فقط.
- **Speed Rush** — تقليل مدة `answer_window_open` فقط بنسبة **20%**؛ مثال 20 ثانية → 16 ثانية. لا يغيّر `mini_game_intro` أو `tour_starting`، وبالتالي لا يغيّر عدد/مدة حركات الكوبايات أو رموز الإيقاع أو عرض الذاكرة. متاح في جميع الألعاب العامة.
- **Risk Round** — الإجابة الخاطئة بالكامل تخصم **20% من النقاط الأساسية للسؤال** حسب الميني جيم والصعوبة، مقربة لأقرب عدد صحيح؛ لا خصم على عدم الإجابة أو التقدير القريب. الدرع الذهبي يلغي عقوبة واحدة. رصيد اللاعب لا ينزل عن صفر.
- **Golden Round** — درع مرة وبونص 25% على الإجابة الصحيحة التالية، بحد أقصى مرة في التور وليس في السؤال الأخير.

تم حذف **Comeback ×2** و**Spectator Power ×2** من قائمة اختيار الأحداث والتشغيل الإجباري والاختبارات. لم تتغير قدرة المتفرجين على الانضمام أو الإجابة في الألعاب العادية.

### مثال لنقاط Risk Round

| اللعبة/الصعوبة | نقاط السؤال | خصم الإجابة الغلط |
|---|---:|---:|
| عد الأشكال Easy | 50 | -10 |
| عد الأشكال Medium | 100 | -20 |
| أصل الأكلة Hard | 180 | -36 |
| عد الإيقاع Hard | 240 | -48 |
| تحدي الليزر Hard | 220 | -44 |

- المبلغ **لا يعتمد على Double Trouble أو بونص الإجابة المبكرة/المتأخرة**، بل على قيمة السؤال الأساسية الثابتة في `scoring-policy.ts`.
- الـChaos **لسه Off افتراضيًا** مثل V83؛ التعديلات لا تُشغِّله تلقائيًا.
- ترجمة العربي/الإنجليزي ونوع حدث الـChaos متزامنين؛ عدد مفاتيح الترجمة **871 لكل لغة** بعد حذف مفاتيح الحدثين الملغيين.

## الاختبارات المنفذة

- `node scripts/verify-chaos-v40.cjs` — **183 assertion**، تشمل كل الألعاب العامة ومقارنة مدة `tour_starting` قبل/بعد Speed Rush ومقارنة وقت الإجابة، واختبار نسبة المخاطرة وتطبيق الدرع على GameStore فعلي.
- `node scripts/verify-v2-scoring-policy.mjs` — PASS.
- `node scripts/verify-i18n-keys-v81.cjs` — 871 EN / 871 AR، 0 أخطاء.
- `node scripts/verify-count-the-beat-playability-v76.cjs` — 2400 جولة PASS.
- `node scripts/verify-laser-challenge-v75.cjs` — 2700 تحدي PASS.
- `node scripts/verify-scoreboard-scoring-v78.cjs` و `node scripts/verify-three-level-scoreboard-v79.cjs` — PASS.
- `node --test tests/qa/core-scenarios.test.cjs tests/qa/state-and-progression.test.cjs tests/qa/score-timing-and-ranking.test.cjs` — **89/89 PASS**.
- اختبارات الـRegression: **87/87 PASS** (81 في تشغيل تجميعي قبل انتهاء وقت التنفيذ، و6 متبقية شُغّلت منفردة واجتازت). 
- `node scripts/verify-source-integrity.mjs` — PASS بعد إعادة ملفين كانت V83 قد أسقطتهما: `scripts/release/verify-release-contract.mjs` و`scripts/release/final-regression.mjs` من V82.

لم يتوفر `node_modules` لتشغيل TypeScript semantic typecheck أو Vite/Electron Production Build بشكل كامل في بيئة الاختبار. لا توجد ملفات APPLY.mjs في تحديث الملفات المباشر.
