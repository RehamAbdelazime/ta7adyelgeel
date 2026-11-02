# Ta7ady ElGeel — Premium Lobby Final Polish v5

**التاريخ:** 2 نوفمبر 2026  
**نقطة البداية:** Premium Experience v4 — لا تغيير في قواعد الألعاب أو النقاط أو ربط Twitch.

## التصور الفني (Art direction)

**Premium Arcade Game Show:** المسرح الأصلي يظل هو بطل المشهد، مع إضاءة مسرحية محسوبة، وواجهة LED هادئة وواضحة، ومجموعة جمهور لها عمق بصري. لا حاجة لإضافة لافتات ضخمة أو مجسمات تجارية على الأرض؛ تفاصيل الإضاءة أفضل لمزاج الخلفية الحالية.

- **LED:** ملمس microdot رفيع جدًا فوق محتوى الشاشة دون تظليل أزرارها أو منع النقر.
- **مقدمة المسرح:** glints خفيفة قريبة من طرفَي المسرح، دون تغطية الدرج أو الهوست.
- **أرض الجمهور:** light-cookie مصوّر بخلفية شفافة ووميض انضمام واحد مدته نحو 1.15 ثانية عند دخول مشاهد جديد، بدل لمعان مستمر.
- **عداد الجمهور:** الآن يستخدم نفس قائمة الشخصيات المعروضة، ويستبعد صاحب حساب Twitch المتصل لو كان مسجلًا في البيانات. لذا يمكن أن تكون قائمة game store = 2 بينما أرضية المسرح = 1، ولا يظهر عداد 2 أمام شخصية واحدة.
- **الجمهور المزدحم:** الانتقال تلقائيًا إلى 8 أو 10 أو 12 عمودًا حسب عدد الجمهور، مع صفوف وقياسات أصغر. تتغير أماكن الشخصيات عندما يتغير نمط الكثافة؛ هذا مقصود لتجنب تداخل الـNameplates. تظل أماكن الإجابة وحركة الميني جيمز مستقلة.
- **Motion:** التأثيرات الجديدة تحترم `prefers-reduced-motion`. لم تُضف مؤقتات رندر متواصلة.

## الملفات المعدلة

- `src/ui-react/components/gameplay/shared/visible-audience.ts` (جديد): selector مشترك للعدّاد والجمهور، بحد 72 شخصية في أرضية المسرح.
- `src/ui-react/components/gameplay/shared/citizen-helpers.ts`: إحداثيات عرض الجمهور متكيفة مع الكثافة.
- `src/ui-react/components/gameplay/citizens/CitizenPlaza.tsx`: استخدام نفس selector وحساب توزيع الجمهور.
- `src/ui-react/components/play/MainScreenPlayFlow.tsx`: العداد من المعروض فعليًا، وإضافة ملمس LED خفيف.
- `src/ui-react/components/visual/VisualWorldLayer.tsx`: إضافة صور الضوء والتأثير المحدود عند الانضمام.
- `src/ui-react/styles/lobby-final-polish.css` (جديد): CSS مستقل لا يعدّل شاشات الميني جيمز.
- `src/ui-react/main.tsx`: تحميل CSS الجديد أخيرًا.
- `public/assets/game/runtime/ui/scene-polish/`: ثلاث صور PNG شفافة وخفيفة.
- `scripts/verify-lobby-final-polish.mjs`: اختبار selector والأصول وترتيب ملفات CSS.
- `package.json`: إضافة `npm run verify:lobby-final-polish`.

## الصور المجانية والتراخيص

**المستخدم حاليًا في v5:** ثلاث صور PNG **جديدة صُممت خصيصًا لهذا المشروع** (وليست مأخوذة من مواقع خارجية). يمكن استخدامها داخل اللعبة دون الحاجة لترخيص طرف ثالث: `soft-audience-light.png`, `stage-glint.png`, `led-microdots.png`.

**مصادر مكتبات جاهزة مجانية تصلح للإضافة مستقبلًا، ولم تُضمَّن ملفاتها في أرشيف v5:**

1. [Kenney — Light Masks](https://kenney.nl/assets/light-masks) — 150 قناع إضاءة؛ **CC0** حسب صفحة الحزمة.
2. [Kenney — Particle Pack](https://kenney.nl/assets/particle-pack) — 80 تأثيرًا؛ **CC0** حسب صفحة الحزمة.
3. [Kenney — Pattern Pack](https://kenney.nl/assets/pattern-pack) — 80 نقشًا؛ **CC0** حسب صفحة الحزمة.

[Kenney — FAQ / License](https://kenney.nl/support): ينص على السماح بالاستخدام التجاري وعدم إلزامية ذكر المصدر. **لم تُحمَّل هذه الحزم إلى المشروع بسبب عدم توفر تنزيل مباشر في بيئة التنفيذ الحالية**؛ لم نستبدلها بملفات خارجية غير موثوقة. يفضّل مراجعة ملف الترخيص المرفق بالحزمة قبل أي نشر تجاري.

## نتائج QA المنفذة

- `npm run verify:cleanup` — نجح (CSS واستدعاءات الأصول ومراجعة المعايير السابقة).
- `npm run verify:lobby-final-polish` — نجح (فلترة broadcaster وحد 72، صياغة TS/TSX المعدلة، وجود PNG).
- `npm run audit:security` — **24/24** فحص بنيوي.
- اختبار بصري باستخدام **DOM/CSS fixture ساكنة** في Chromium عند 1280×720، 1650×928، 1920×1080، 2560×1440: تم التأكد أن النموذج الممثل للاعب والاسم داخل حدود الشاشة.
- **محاكاة 2 و12 و30 و72 لاعبًا** في Chromium على 1650×928: لا تداخل بين مستطيلات الـNameplates ولا خروج خارج الشاشة في نموذج المحاكاة. لكن أسماء 72 لاعبًا تظل صغيرة في عرض بث مصغّر، وتحتاج اختبارًا باللعبة الحقيقية.
- `npm test` — تم تنفيذ فحوص الأصول والألعاب والنقاط قبل مرحلة Vitest؛ **توقف عند `vitest: not found`** بسبب نقص dependencies. لم يكتمل build ولا اختبار Electron/Twitch حيّ.

**تنبيه:** المعاينة المرفقة ناتجة عن fixture HTML/CSS مع أصول المسرح الأصلية، وليست لقطة حقيقية من تشغيل React/Electron. لا نعتمد الإصدار النهائي من دون التجربة على Windows وبأحجام جمهور متعددة.

## طريقة التشغيل

1. فك SOURCE كاملًا في مجلد جديد، أو طبّق PATCH فوق **Premium Experience v4 SOURCE فقط**.
2. نفّذ `npm ci` ثم `npm run verify:cleanup && npm run verify:lobby-final-polish && npm run audit:security`.
3. نفّذ `npm run dev` أو التشغيل حسب README، وجرّب Twitch `!join`، ثم 1 و2 و12 و30 و72 لاعبًا مع عرض OBS.
4. افحص عدد الظاهرين مقارنة بعدّاد الشاشة (الستريمر لا يظهر على الأرض)، واستقرار التوزيع وحركة الانضمام، ثم اختبر Reduced Motion.
