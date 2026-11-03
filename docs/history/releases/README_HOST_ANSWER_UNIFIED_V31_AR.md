# Ta7ady ElGeel — V31 | توحيد إجابة الهوست

**النسخة الأساسية:** `ta7adyelgeel_lucky_cup_v30_SOURCE.zip`.

## التغيير

- إزالة مكان إجابة الهوست القديم من `App.tsx` (الـ desktop overlay) نهائيًا؛ مش هيتعرض تاني في أي لعبة.
- عرض **نفس كارت إجابة الهوست الجديد V28** دائمًا من `HostMascotLayer` داخل المسرح بنسبة 16:9، ناحية شمال المسرح وبعيد عن منطقة الجمهور.
- إلغاء شرط `usesModernQuestionUi` من ظهور إجابة الهوست، بحيث تشتغل في كل الألعاب، مش فقط الألعاب ذات واجهة الأسئلة الحديثة.
- حذف الـ fallback markup القديم (HOST ONLY / Private answer) والـ prop `embedded` من مكوّن الإدخال؛ بقى فيه تصميم واحد فقط.
- تصحيح مفتاح لعبة `before-after` في عدد الاختيارات: إجابتان بدل أربعة.
- الحفاظ على إرسال الإجابة للـ GameStore، وقفل الإجابة بعد أول إرسال ناجح، وإعادة الفتح في السؤال التالي.
- **بدون تعديل** في صعوبات Lucky Cup V30 أو scoring أو gameplay.

## الألعاب المشمولة

جميع الألعاب الـ11 الموجودة بالـ registry، ومنها الثمانية العامة: Food Origin، Shape Count، Maze Gates، Before/After، Guess Logo، Count The Beat، Lucky Cup، True/Fake، بالإضافة إلى Memory Count وHangman وCouple/Siblings (QA).

## التثبيت

**لو V30 موجودة وشغّالة:** فكّ `ta7adyelgeel_host_answer_unified_v31_PATCH_ONLY.zip` وانسخ الملفات مع الحفاظ على مساراتها فوق مشروع V30، مع الموافقة على الدمج/الاستبدال. لا تنسخ فولدر `src` داخل `src`.

**لو محتاج المشروع كامل:** استخدم `ta7adyelgeel_host_answer_unified_v31_SOURCE.zip` في مجلد مشروع جديد، وثبّت اعتمادات npm المعتادة؛ لا تنسخ `node_modules` من نسخة أخرى.

## التحقق

`node scripts/verify-unified-host-answer-v31.mjs` يفحص إن فيه مكان واحد فقط لإجابة الهوست، واتصاله بالـGameStore، وإنه بيظهر من المسرح في كل الألعاب، وإن كود TSX صحيح نحويًا. اختبارات V17 وV18 وV19 وV20 وV25 وLucky Cup V27–V30 وقواعد الـ scoring والـCSS اجتازت الفحص البنيوي. العرض البصري في Electron يظل بحاجة لتجربة فعلية على الجهاز.
