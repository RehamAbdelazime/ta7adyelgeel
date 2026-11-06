# Ta7ady V45 — Host Panel & QA Recovery

## لماذا كانت Host Panel فارغة؟
في CSS قديم ملف `src/ui-react/styles/legacy/06-stage-and-lobby.css` فيه `visibility: hidden !important` على `.host-production-panel` و`.developer-qa-panel`.
V45 أعادت Mount للواجهة وضبطت `display: block`، لكنها لم تلغِ `visibility: hidden`؛ وبالتالي اللوحة كانت موجودة في DOM ولكن غير مرئية.
هذا الإصلاح يفتح الظهور فقط داخل `.host-panel-v45-dialog` ويترك لوحة الـlegacy القديمة مخفية.

## ماذا تم إصلاحه؟
- إعادة ظهور Host Panel وQA Tab في CSS مع الحفاظ على إخفاء واجهة الإنتاج القديمة خارج الـmodal.
- إضافة اختبارات Browser تتحقق من الرؤية الفعلية `:visible` بدلاً من عدّ عناصر الـDOM فقط.
- تعديل regression قديم ليتعامل مع غياب مجلد صور الأفلام بعد حذف الرسومات، بدلاً من الفشل بسبب `ENOENT`.
- تبسيط `RUN_FULL_QA_WINDOWS.bat` وإضافة `RUN_QA_DIAGNOSTIC_WINDOWS.cmd` لاختبار التثبيت **بدون تنزيل شيء**.

## تشغيل التشخيص بأمان
1. فكّي المشروع الكامل في مجلد جديد، أو ادمجي ملفات الـPATCH في جذر مشروع V45 الحالي (مكان `package.json`).
2. افتحي نافذة CMD بنفسك (Windows Start → cmd) واكتبي `cd /d "مسار المشروع"`.
3. شغلي `RUN_QA_DIAGNOSTIC_WINDOWS.cmd`؛ المفروض يطبع نسخة Node ونجاح الفحوصات دون تثبيت أو الاتصال بـTwitch.
4. عند النجاح شغلي `RUN_FULL_QA_WINDOWS.bat` من *نفس نافذة CMD*؛ هتفضل نافذة CMD مفتوحة حتى عند الخطأ.
5. ابعتي `qa-artifacts\\qa-setup.log` لو التثبيت وقف، أو `qa-artifacts\\index.html` بعد التشغيل الكامل.

## حدود الاختبار هنا
تم اختبار Source Contract على الكود، وتشغيل 69 Unit/Integration tests، وتشغيل verify-visual-content-v43 بعد إصلاح `ENOENT` بنجاح. لم يتم اختبار CMD أو Electron أو Chromium على Windows فعليًا؛ لازم ذلك على جهازك.
