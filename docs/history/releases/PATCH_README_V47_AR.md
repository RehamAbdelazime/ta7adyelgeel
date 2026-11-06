# Ta7ady ElGeel — V47 Technical Stabilization

النسخة دي تحديث **تقني** فوق V46 Visual QA، من غير إضافة محتوى أو تغيير نقاط المنافسة أو الشخصيات.

## الحاجات اللي اتصلحت في الكود

1. **12 TypeScript errors من تقرير Windows:** سبب أغلبها إن React كان بيستورد الـ`preload` التنفيذي كنوع TypeScript، مع إن الملف اسمه `preload.cts`. فصلت عقد الـElectron/React في `src/desktop-electron/bridge-contract.ts`، وخلّيت الـPreload يتقارن مع نفس العقد. ده حافظ على طريقة التشغيل الفعلية بدون استيراد Electron في الواجهة.
2. كمّلت حقول الاختبارين القديمين: `bpm` في Count The Beat و`mode/targetCount` في Shape Count.
3. أصلحت توقع اختبار إعدادات Tour: عند إدخال Rotation فارغة مع Enabled Games غير صالحة، المنطق الحالي يستبدلها **بالألعاب العامة السبع المفعلة**، مش الـRotation الأصلية من JSON (خمس ألعاب).
4. عزلت `vitest.config.ts` لاختبارات `src/**/*.test.ts` و`.tsx`، عشان اختبارات `node:test` ذات اللاحقة `.test.cjs` تتشغل بـNode فقط بدل فشل Vitest الوهمي.
5. أصلحت مصدر تحذير React 19 المرشح من `CountTheBeatScreen`: كان بيخلط خاصية `animation` المختصرة مع `animationPlayState` في نفس عنصر متغير؛ استخدمت خصائص Animation التفصيلية مع الحفاظ على شكل الحركة وتوقيت Pause/Resume.
6. قوّيت Playwright UI QA: عدد أسماء الأشخاص في لوبي صغير؛ **16** صفًا في لوحة 500 مشارك؛ عدم قلب الصفحات تلقائيًا؛ تغيير الصفحة بنقرة فعلية؛ الفصل بين Spectators/Officials؛ اسم الفائز ظاهر في النتيجة. كمان صار يرصد مشاكل React shorthand/longhand كـFAIL، ويطبع مكان تحذير Console بدل اقتطاعه.
7. خليت مرحلة Vitest في الـFull QA تشغل `npm run test:unit` فقط؛ بدون تكرار جميع الـnpm test checks داخل كل خطوة. وأضفت `npm run verify:stabilization-v47` كفحص سريع مستقل.

## اللي اتشغّل في بيئة التطوير دي

- `node --test tests/qa/*.test.cjs`: **71/71 PASS**.
- `node scripts/run-all-regressions.mjs`: **56/56 PASS** (بعد تحديث اختبار V34 لدعم كتابة `animationName`).
- `tsc -p tsconfig.quality-v38.json`: **PASS**.
- `node scripts/qa/verify-stabilization-v47.mjs`: **31 checks PASS**.
- Syntax check لملفات JS/TS المعدلة: **PASS**.

## اللي مش متحقق منه — شرط أساسي قبل اعتماد النسخة

**لم أتمكن من تشغيل `npm ci`, `npm run typecheck`, `npm run test:unit`, `npm run build` أو Playwright/Electron UI كاملة هنا**؛ لأن التبعيات الخارجية غير قابلة للتثبيت في بيئة التنفيذ. ما ينفعش نعلن إن كل الـ12 خطأ TypeScript انتهت فعلًا قبل اختبار Build Windows.

كمان بنك الصور مش مكتمل الترخيص أو التحميل المحلي. أحدث Logs مرسلة رصدت 13 صورة محلية، 23 صورة remote-only، 14 سؤالًا بلا صورة جاهزة؛ تفعيل مصدر صورة عبر الإنترنت لا يعني الحصول على حق نشرها في البث. **لم أرخِّ سياسة الأمان CSP لمجرد تحميل صور غير مرخصة**. تحذيرات `npm audit` السابقة محتاجة مراجعة أمنية مستقلة، من غير `--force` عشوائيًا.

## طريقة الاختبار على Windows

أنصح بفك **V47 FULL SOURCE** في فولدر فارغ، وفتح CMD داخل المجلد:

```
npm ci
npm run typecheck
npm run test:unit
npm run build
```

إذا الثلاثة نجحوا، شغّلي:

```
RUN_FULL_QA_WINDOWS.bat
```

النتائج داخل `qa-artifacts/index.html`، وملف الـUI داخل `qa-artifacts/ui-latest/index.html`. لو فشل Build، ابعتي `qa-artifacts/qa-step-5.log` تحديدًا (ده يكشف أي أخطاء جديدة غير الـ12 القديمة). لسه **Release Ready = NO** لحد نجاح Build وElectron وحقوق الصور والمراجعة البصرية.

مهم: الـPATCH المرفق خاص بالترقية من **V46 Visual QA النهائي** فقط. لو النسخة الحالية أقدم، استخدمي الـFull Source.
