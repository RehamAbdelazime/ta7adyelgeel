# Ta7ady ElGeel — Mode Picker v12 (Casual Game UI)

هذه الدفعة تُطبّق على نسخة **Bilingual Typography v11** ولا تعيد تصميم أي شاشة أخرى.

## التعديلات
- أبعاد متوازنة لكارتي Mini Game وTour، مع توزيع ثلاثي واضح للأيقونة، والوصف، وزر الاختيار.
- اقتصاص شفاف لصورتَي الأيقونات الأصليتين مع ضغط WebP دون تغيير الرسومات. تحتفظ الملفات القديمة بأماكنها.
- مساواة عرض ومساحة الزرين، وتحسين الهامش بين العنوان والوصف والزر، مع تكبير الأيقونات.
- Hover / Focus خفيف ومناسب للعبة Casual مع Reduced Motion.
- دعم أسهم اليمين واليسار بين الكارتين، مع مراعاة RTL. كما بقيت Tab/Enter/Space/Escape كما كانت.
- لا تعديل على البدء الفعلي للجولة، شروط عدد اللاعبين، إعدادات Twitch أو النقاط.

## الملفات
- `src/ui-react/components/play/MainScreenPlayFlow.tsx`
- `src/ui-react/main.tsx`
- `src/ui-react/styles/mode-picker-casual-v12.css`
- `public/assets/game/runtime/ui/main/{mini_game_mode_controller,tour_mode_trophy}_framed.webp`
- `scripts/verify-mode-picker-v12.mjs`
- `package.json` (إضافة أمر تحقق فقط)

## التشغيل
```bash
npm install
npm run verify:mode-picker
npm run dev
```

التحقق البنيوي والاختبارات البصرية في Chromium نجحت على 1280x720، و1650x928، و1920x1080 باللغتين. المعاينات مبنية باستخدام هيكل HTML/CSS وأصول المشروع وليست من Electron، وقد تختلف الخطوط المعروضة في المعاينات عن الخطوط المثبّتة داخل لعبتك. الاختبار النهائي مطلوب على Windows.
