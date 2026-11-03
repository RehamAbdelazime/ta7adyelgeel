# Ta7ady ElGeel — Arcade Settings v9

## الفكرة
إعادة بناء شاشة الإعدادات كـ **Game Options Menu** بدل تصميم Control Room / Dashboard المعتاد في مواقع الويب.

- لوحة كبيرة داخل مسرح اللعبة نفسه، بنسب مناسبة لنسخة الكمبيوتر.
- تبويبات جانبية واضحة: الشاشة، الصوت، اللغة، Twitch.
- شاشة تركيز واحدة لكل قسم، بدل بطاقات كثيرة مزدحمة.
- عناوين بخط هوية اللعبة، وحواف Arcade زاويّة، وحالات تحديد واضحة.
- اختيار Display Mode كـ 3 عناصر كبيرة، والدقات متاحة فقط في وضع Windowed.
- Audio UI فيها شريط صوت وعداد بصري (VU meter) مرتبط بقيمة الصوت.
- حفظ، إلغاء، حالة تعديلات غير محفوظة، وتأكيد فصل Twitch.
- الأسهم Up/Down/Home/End للتنقل بين تبويبات الإعدادات، وESC للخروج وTab للتنقل.
- دعم RTL، Reduced Motion، قابلية قراءة 720p و1080p، وعزل تنسيقات الشاشة عن بقية اللعبة.

## الملفات
- `src/ui-react/components/settings/AppSettingsButton.tsx` — إعادة بناء واجهة التبويبات مع الحفاظ على كل أوامر الاتصال والصوت واللغة والشاشة.
- `src/ui-react/styles/arcade-settings-v9.css` — نظام التنسيق الجديد.
- `src/ui-react/main.tsx` — تغيير استيراد CSS من v8 إلى v9.
- `scripts/verify-premium-settings.mjs` — تحديث الفحص البنيوي.
- تمت إزالة `src/ui-react/styles/premium-settings-v8.css` القديم لتجنب ازدواج التنسيقات.

## التحقق
- `npm run verify:premium-settings` **PASS**.
- `npm run verify:cleanup` **PASS**.
- `npm run audit:security` **24 PASS**.
- TypeScript/TSX transpile syntax check **PASS**.
- Visual preview على 1280×720 و1650×928، English / Arabic.
- **غير مكتمل:** فحص TypeScript الكامل والبناء داخل Electron على Windows؛ بيئة التشغيل هنا تفتقد تعريفات `vite/client` في dependencies. لا تدّعي هذه النسخة أنها Release Build معتمد.

## التجربة المطلوبة على Windows
1. فتح Settings، والتنقل بين 4 تبويبات بالماوس والكيبورد.
2. تغيير Display Mode بين Fullscreen/Borderless/Windowed، وتغيير الدقة عند Windowed، ثم Apply.
3. تغيير الصوت مع الـMute وCancel/Apply.
4. تبديل اللغة من EN إلى AR والتحقق من اتجاه RTL.
5. تأكيد Disconnect Twitch والتحقق من عدم الفصل عند Cancel.
6. اختبار ESC وإرجاع التركيز، مع 1280×720 و1920×1080.

**Patch:** يعتمد على نسخة Premium Settings v8 فقط. حذف `premium-settings-v8.css` جزء من تطبيق الـPatch.
