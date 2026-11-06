# Ta7ady ElGeel — V45 Strict Quality Assurance

## الهدف

اختبار **منطق اللعب، مراحل التور، الأدوار، التحكم، النقاط، الترقيات، Chaos، الشخصيات، الـUI وغياب الملفات/الصور** دون استعمال حساب Twitch حقيقي أو بيانات مشاهدي بث فعلي. الاختبار هنا اختبار يقدر يكتشف مشاكل ويصدر دليلًا، **وليس شهادة تلقائية إن اللعبة خالية من العيوب**. لا يوجد عدد محدود من الاختبارات يثبت حرفيًا «كل السيناريوهات»؛ هذه مصفوفة عملية واسعة، وتحتاج مراجعة بشرية للصور وتجربة بث تجريبية.

> **تحديث إعداد QA:** بعد ظهور خطأ npm `edgesOut` في التثبيت القديم، تم عزل Playwright داخل `.qa-tools`. راجعي `docs/V45_QA_SETUP_HOTFIX_AR.md` قبل التشغيل.

## التشغيل على Windows — ضغطة واحدة

1. فكي ملف V45 FULL SOURCE في **فولدر جديد فارغ**. لا تضغطي تشغيل من داخل ZIP.
2. ثبتي Node.js 22 أو أحدث، وتأكدي من وجود إنترنت لأول تثبيت للاعتماديات/متصفح Chromium.
3. شغلي ملف `RUN_FULL_QA_WINDOWS.bat` بالضغط مرتين. لا تشغّليه من فولدر يحتوي بيانات/ملفات شخصية غير مرتبطة بالمشروع.
4. الأداة تثبت الاعتماديات الناقصة محليًا، وتبدأ الفحوصات واحدًا واحدًا، و**تُكمل الخطوات التالية حتى لو خطوة فشلت**.
5. عند الانتهاء سيفتح `qa-artifacts/index.html`. التقرير يحتوي Log لكل مرحلة، وروابط إلى `qa-artifacts/ui-latest/index.html` وفيها **صورة لكل شاشة جرى اختبارها**.
6. وجود ملف `qa-artifacts/electron-desktop-smoke.png` يثبت ظهور نافذة Electron الحقيقية في اختبار **الـStartup فقط**؛ أما التنقل الكامل بين الألعاب فيُجرى في Chromium باستخدام **نفس React renderer** + Mock Twitch.
7. **لا تعتمدي على Pass فقط**: افتحي معرض الصور، وقارني الإجابات/الهوست/الأزرار/الستارة في 1920×1080 و1600×900 و1280×720، وتعاملي مع FAIL/ WARN/ RELEASE BLOCKER.

### أوامر منفصلة (من Terminal داخل المشروع)

- `npm run qa:unit` — اختبارات وحدة وربط GameStore، من دون متصفح أو Twitch.
- `npm run qa:static` — فحص نحو TS/TSX وCSS وRelative Imports وAssets ومراجع الوسائط، ومرشحات Dead Code؛ التقرير في `qa-artifacts/static/source-audit.json`.
- `npm run verify:all` — مجموعة اختبارات الرجوع للخلف القديمة.
- `npm test` — اختبارات Vitest الموجودة من قبل (بعد التثبيت).
- `npm run build` — React/Vite/Electron/TypeScript build كامل (بعد التثبيت).
- `npm run qa:electron` — تشغيل Electron الحقيقي والتحقق من تحميل الـmain/preload/React؛ بدون حساب Twitch، **لا يفترض تشغيل Gameplay في هذه الخطوة**.
- `npm run qa:ui` — تشغيل Vite محليًا/Chromium headless مع Twitch Mock وعرض كافة الحالات وحفظ Screenshots.
- `npm run qa:full` — السبع مجموعات كلها بالتتابع.

## المصفوفة المنفذة

| المجال | أمثلة أساسية | الآلية |
|---|---|---|
| جميع الألعاب | 7 عامة + 2 QA-only، عربي وإنجليزي، Intro → Warmup → Answer → Reveal → Round Score → Finale → Lobby | Unit integration + GUI screenshots |
| Game States | 1،2،3،5،7،10 جولات؛ Restart/Skip/Early End؛ شرح اللعبة التالية يظهر، لكن لا يتكرر إذا بقيت اللعبة نفسها | Unit scenarios |
| إجابات الشات | قبول `!1…!4`؛ منع إجابة ثانية؛ إيقاف أثناء Pause؛ استئناف؛ الهوست الخاص | Unit + regression |
| Joining | دخول رسمي قبل أول سؤال ثم قفل القائمة؛ Late join متفرج؛ تكرار Join؛ التحويل للرسمي بعد النهاية | Unit + GUI |
| Scores/Progression | Score كل جولة؛ XP مرة عند النهاية فقط؛ الترقية؛ 0–500 مستخدم؛ pagination وScoreboard مستقل للمتفرجين | Unit + GUI |
| Test Bots | 1،5،25،72،100،300،500 بوت؛ Auto Answer؛ Pause/Resume؛ عدم خلط بروفايل وهمي ببيانات حقيقية | Unit + GUI |
| Chaos | Forced Double / Golden / Shield / Risk، Pause، وتجنب التأثيرات غير المناسبة | Regressions + GUI |
| Visual Guess | الفيلم Scene/Poster؛ المشهور Eyes/Silhouette/Zoom/Progressive Reveal | GUI لكل Mode؛ Image errors |
| Screens | Lobby، Mode، Game Picker، Settings، Host Panel tabs، QA panel، Intro، Answer، Reveal، Scoreboards | Chromium screenshots |
| Layout | 1920×1080،1600×900،1280×720؛ overflow/قص اختيارات/زر يغطي الإجابات | DOM geometry + screenshot human review |
| Source and assets | imports وTS/CSS syntax ومرشحات ملفات غير مذكورة وCSS repeated selectors | Source audit |
| Desktop | تشغيل Electron الحقيقية بعد build والتقاط صورة | Desktop smoke (ليس بثًا حقيقيًا) |

## مشكلات فعلية اتكشفت واتصلحت في V45

1. **Host/QA Panel كان عنده ملفات React، لكنه غير مربوط بالواجهة الأساسية أصلاً.** الآن زر `HOST` فوق المسرح أو `F9` يفتح لوحة تحكم فيها تبويب `QA`، و`Esc` يقفلها. ده مهم جدًا لأن أزرار الاختبار الجديدة كانت ممكن تبقى غير مرئية.
2. **الانتقال إلى لعبة مختلفة في Full Tour كان أحيانًا يتخطّى شاشة الشرح المصور الجديدة.** أصلحنا اختيار `mini_game_intro` عندما تختلف اللعبة، مع عدم إعادة الشرح بين أسئلة اللعبة الواحدة.
3. **بوتات الاختبار ظهرت ضمن قائمة ترقيات XP المؤقتة عند النتيجة** (رغم أن بياناتها لم تكن تحفظ كملف شخصي). تم استبعادها كذلك من منح مكافآت المراكز وتقرير الـXP النهائي.

## فجوات وRelease Blockers لم يجرِ إخفاؤها

- **بنك الصور الفوتوغرافية V44 ليس مكتملًا:** صفر صورة محلية، 36 سؤالًا يعتمد على صورة خارجية، 14 سؤالًا بلا مصدر صورة قابل للاستعمال. الاتصال بالمصدر لا يضمن نجاح عرض الصورة أثناء البث. ملفات الوسائط هذه **ليست مضمنة داخل V45** أيضًا.
- **حقوق مشاهد الأفلام والبوسترات وصور النجوم تحتاج تحققًا مستقلًا لكل ملف** قبل استخدام الصور في بث/توزيع عام. لا يكفي كون الصورة منشورة على الويب.
- فحص المصدر أعاد **10 أصول قد تكون غير مستخدمة** و**39 ملف TS قد يكون غير متصل بجذر الواجهة**، و**62 قاعدة CSS مكررة كثيرًا**. دي ترشيحات مراجعة **ليست دليلًا قطعيًا** لأن بعض الملفات تتحمّل ديناميكيًا، لذلك **لم نحذفها تلقائيًا**.
- لا يمكن للمتصفح التأكد وحده من المتعة/الوضوح الفني/التشابه البصري في كل Frame. راجعي Screenshots بعينك، وتأكدي من اختبار حركة الستارة، Cup Shuffle على بث فعلي، والـPerformance والسمع.
- بعض الواجهات تعتمد على خدمات Electron/Twitch: Chromium Mock يغطي منطق اللعب المرئي دون إرسال أي رسائل Twitch؛ **لا يختبر اتصال Twitch OAuth الحقيقي أو جودة الشبكة**. اختبار Desktop Smoke منفصل لتجنب أي إرسال حقيقي.

## نتيجة التحقق في بيئة التحضير

- **69 من 69** اختبار Node unit/integration نجح.
- **55 من 55** Regression Script نجح.
- `tsc -p tsconfig.quality-v38.json` نجح؛ ده TypeScript للـcore وليس بديلًا لفحص `npm run build` الكامل.
- فحص static: **135 ملف TS/TSX، 51 ملف CSS، 510 Asset** دون Import/Syntax error؛ لكن **3 Release Blockers** للصور/حقوق الاستخدام.
- نسبة التغطية المحسوبة من الاختبار الجديد تخص **الـmodules المحمّلة في الاختبار فقط** (حوالي 79.6% statements) ولا تعني تغطية المشروع/واجهة React بالكامل.
- **لم نستطع تشغيل Vite/React/Vitest/Electron GUI فعليًا هنا** لأن `node_modules` غير متوفرة والتحميل من registry غير متاح؛ لهذا السبب توجد الأداة المحلية وتشخيص واضح لكل خطوة لم تنجح.

## Definition of Done

لا تعتبر نسخة Release Ready قبل: نجاح `qa:full` على جهاز Windows؛ ومعالجة كل `FAIL` وكل `Release Blocker`؛ ومراجعة صور الواجهات كلها بدون قص أو تكرار أو نص مخفي؛ اختبار حقيقي قصير على Twitch مع ناس فعلية في ظروف البث؛ والتأكد من حقوق الصور والتخزين والنسخ الاحتياطي للبروفايلات.
