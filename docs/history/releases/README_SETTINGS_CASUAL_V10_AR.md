# Ta7ady ElGeel — Casual Settings v10

## اتجاه التصميم
القائمة أصبحت **نافذة إعدادات صغيرة وبسيطة** أقرب إلى ألعاب الكمبيوتر الخفيفة (casual/party games). لا قوائم جانبية، ولا كروت Dashboard، ولا رسومات cyberpunk إضافية. لمسات اللعبة موجودة في خط العنوان، إيقاع Cyan/Pink، أزرار الاختيار الواضحة، والحواف الناعمة.

## محتويات النافذة
- Music: مستوى الصوت + كتم/إلغاء كتم، من دون شاشة صوت مستقلة.
- Language: تبديل English/العربية مع RTL.
- Display Mode: Fullscreen/Borderless/Windowed؛ تظهر Resolution فقط مع Windowed.
- Twitch: حالة الربط، اسم الحساب، وزر فصل بعد التأكيد.
- أزرار Cancel / Apply، حالة التعديلات، دعم Escape وحبس التركيز داخل النافذة.
- زر إنهاء الجلسة الحالي يظل متاحًا عندما تكون هناك جولة نشطة.

## الملفات المتغيرة
1. `src/ui-react/components/settings/AppSettingsButton.tsx` (واجهة مدمجة مع الحفاظ على وظائف الإعدادات الأساسية).
2. `src/ui-react/styles/casual-settings-v10.css` (CSS مستقل).
3. `src/ui-react/main.tsx` (استيراد CSS الجديد).
4. `scripts/verify-premium-settings.mjs` (فحص بنيوي مناسب للتصميم الجديد).
5. إزالة `src/ui-react/styles/arcade-settings-v9.css` لعدم تحميل نسختين.

## التحقق المنفَّذ
- فحص TSX transpile: PASS، **ليس TypeScript typecheck كاملًا**.
- `npm run verify:premium-settings`: PASS.
- `npm run verify:cleanup`: PASS.
- `npm run verify:lighting`: PASS.
- `npm run audit:security`: 24/24.
- معاينات متصفح للمحاذاة والقص على دقتي 1280×720 و1650×928، بالعربي والإنجليزي، مع اختبار ظهور الدقة في Windowed.

## غير متحقق بعد
بناء كامل وتشغيل Electron على Windows واختبار Twitch/تغيير الشاشة والصوت فعليًا. المعاينات ثابتة وتُظهر تطبيق CSS على HTML مماثل، وليست Screenshot من تشغيل React داخل Electron.

## طريقة تطبيق الـPatch
تُطبق نسخة Patch على **Arcade Settings v9** فقط. انسخي `files/` إلى جذر v9 ثم احذفي ملف الـCSS القديم المذكور في `DELETE_THESE_FILES.txt`. لا تمسحي ملفات اللعبة أو assets الأخرى.
