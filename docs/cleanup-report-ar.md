# Ta7ady ElGeel — تقرير تنظيف السورس والـ CSS (2 نوفمبر 2026)

## الأساس والنطاق

تم تنفيذ التغييرات على **Premium Stage/Mode v2 SOURCE** (آخر نسخة مبنية عليها التعديلات السابقة). لم نغيّر منطق التسجيل، Twitch، النقاط، حركة الجولات أو ترتيب الميني جيمز. النسخة القديمة غير معدّلة وموجودة في الأرشيف الأصلي.

## نتائج فعلية

| البند | قبل | بعد | النتيجة |
|---|---:|---:|---|
| ملفات المصدر والأصول (بدون `node_modules`) | 953 | 684 تقريبًا (بما فيها هذا التقرير) | مئات النسخ غير اللازمة أزيلت |
| الحجم الخام التقريبي | 110.49 MB | 69.81 MB | **توفير ~40.7 MB (~36.8%)** |
| ملف `src/ui-react/styles.css` | 31,561 سطر، ~852 KB | مدخل Imports حوالي 1.2 KB | لا يوجد ملف CSS واحد عملاق |
| CSS الفعلي القديم | كتلة واحدة | **17 وحدة مرتبة بنفس ترتيب الـ Cascade** | قابل للمراجعة والصيانة تدريجيًا |
| القواعد المتطابقة تمامًا | تكرارات | **حذف 19 قاعدة مكررة حرفيًا** | من غير إزالة قواعد متداخلة تختلف في السلوك |
| صور الـ sprites المكررة | 660 ملف إطار | 382 ملفًا فريدًا + 278 Alias | **نفس 660 إطارًا منطقيًا** بدون تكرار PNG |
| ملفات لها نفس محتوى SHA-256 | مجموعات كثيرة | 0 تكرارات مطابقة حرفيًا | فحص كل السورس والأصول |

ملاحظة: عدد الملفات *بعد* يشمل الوحدات الجديدة وسكربتات التحقق والتوثيق؛ المهم أن الحجم انخفض دون حذف إطارات فعلية من الأنيميشن.

## الملفات التي تم تنظيفها

- **278 ملف PNG مكرر المحتوى** داخل `characters/stage-ready`، مع خريطة تحويل دقيقة في `src/ui-react/components/gameplay/citizens/sprite-frame-aliases.generated.ts`. تم تعديل `CitizenPlaza.tsx` ليقرأ المسار الصحيح؛ لا يزال لكل شخصية 10 أرقام إطارات × 6 حركات.
- **ثلاث نسخ Public مكررة** من بنك أسئلة Before/After؛ النسخة المستخدمة فعليًا بقيت: `src/game-core/minigames/data/before-or-after-questions.json`.
- أيقونات التطبيق الإضافية غير المستخدمة `app-icon-1024.png`, `app-icon-512.png`؛ احتفظنا بالرمز المستخدم من Electron `app-icon.png` والـ favicon.
- أصول غير مستدعاة: `main_screen_loop.mp4` (احتفظنا بـ MP3 المستخدمة)، `curtain_full_1920x1080.png` (المشهد يستخدم الستارتين يمين/شمال)، وخلفيات بطاقات `before_after_card_background.png`, `maze_gates_card_background.png` و`ta7ady_landing_mascot_wave.png`.
- **Duplicate Electron preload**: تم الإبقاء على `preload.cts` الذي ينتج `preload.cjs` المستخدم فعليًا، وإزالة `preload.ts` المطابق له وظيفيًا وغير اللازم.
- حُذفت سكربتات تحويل Preload القديمة غير المشار إليها من package scripts (`build-electron-preload-cjs.cjs`, `fix-electron-main-entry.cjs`).
- نظّمت ملفات README التاريخية في `docs/history` وأضفت README موحدًا بإرشادات البناء والتدقيق.
- أصلحت `.gitignore`: لم يعد يتجاهل `package-lock.json` الضروري للبناء القابل لإعادة الإنتاج، وأصبح يتجاهل مخرجات Vite/Electron ونتيجة الـ Security Audit المولّدة.

## تنظيم CSS

- `src/ui-react/styles.css` = مدخل الـ Imports بالترتيب الأصلي.
- `src/ui-react/styles/legacy/00-...` حتى `16-...` = القواعد القديمة متدرجة حسب موضعها في ملف الـ CSS الأصلي؛ **لا تغيّري ترتيبها** من غير مقارنة مرئية.
- `src/ui-react/styles/premium-lobby.css` و `premium-stage-mode.css` بقيا بعد كل وحدات legacy، بنفس الأولوية.
- تم تصحيح مسار LaboDisplay بعد نقل CSS: `../../assets/fonts/LaboDisplay.ttf`.
- تم تصحيح خلفية تسجيل Twitch إلى URL آمن بالنسبة لمسار public في Vite: `/assets/game/runtime/background/twitch_login_background.png`.
- سكربتات التحقق القديمة أصبحت تجمع CSS من كل الوحدات بدل افتراض أن القواعد كلها في ملف واحد. تم تحديث سكربت Mode Picker الذي كان يفحص توقيع CSS قديم وغير موجود حتى قبل التنظيف.

**مهم:** الـ CSS الفعلي ما زال حوالي **31.5 ألف سطر** وفي ملفات legacy حوالي **7,778 استخدامًا لـ `!important`** (بالإضافة إلى ملفات premium). تقسيمه ليس إعادة كتابة كاملة أو إثبات أن كل Selector قديم غير مستخدم. حذف قواعد تبدو قديمة/ميتة قد يغيّر ترتيب أولوية الاستايلات داخل الشاشات. تعمدنا عدم إجراء Purge أعمى. المرحلة المتقدمة ستكون تفريغ الـ overrides شاشة بشاشة مع Screenshots فعلية من Electron.

## الاختبارات المنفّذة والحدود

نجح في البيئة الحالية:

- `npm run verify:cleanup` (CSS + sprite aliases + desktop hardening + Premium Mode picker).
- `node scripts/verify-v2-minigame-baseline.mjs` — 11 مسجل، 8 متاحة.
- `node scripts/verify-v2-minigame-grid.mjs` — جريد الألعاب.
- `node scripts/verify-v2-scoring-policy.mjs` — نظام احتساب النقاط.
- `node scripts/verify-landing-experience.mjs` و `verify-v2-final-landing-identity.mjs` و `verify-visual-refresh.mjs`.
- `npm run audit:security` — **24 اختبارًا ناجحًا من 24**.
- فحص SHA-256 لجميع الملفات: لا يوجد تكرار بايت-لبايت بعد التنظيف.

**لم يتم إثبات سلامة Build / تشغيل Electron النهائي** في البيئة الحالية: الـ `node_modules` المتوفرة غير مكتملة، والاتصال بـ npm registry غير متاح (`EAI_AGAIN`). كذلك حاولنا اختبار مقارنة Computed Styles في Chromium، لكن البيئة منعت فتح صفحات local حتى عبر localhost (`ERR_BLOCKED_BY_ADMINISTRATOR`). لذا لا يوجد ادعاء أن الواجهة خالية من أي Visual Regression قبل تشغيل النسخة على Windows.

## التشغيل على Windows

```bash
npm ci
npm run verify:cleanup
npm run audit:security
npm test
npm run build
npm run start
```

ولإنتاج نسخة Portable: `npm run package:win`.

### تحذير بخصوص الـ PATCH

ملف التعديلات فقط يحتوي على **ملفات جديدة/متغيرة** وقائمة بالملفات المحذوفة. مجرد نسخ التعديلات لن يحذف الأصول القديمة من فولدر مشروعك. لو هدفك تنظيف كامل من غير ملفات زائدة، الأفضل استخراج **نسخة SOURCE الجديدة** في فولدر جديد، أو استخدام قائمة الحذف المرفقة بعد أخذ Backup.
