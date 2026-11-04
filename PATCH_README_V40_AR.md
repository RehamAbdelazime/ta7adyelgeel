# Ta7ady ElGeel V40 — Chaos V2 / Golden Rewards

بُنيت هذه النسخة على V39 Spectator Experience فقط. لو مشروعك V39 شغال، فك الـ PATCH في جذره ووافق على Merge/Replace. لا توجد ملفات محذوفة. لو نسختك مختلفة أو أقدم، استخدم Full SOURCE في فولدر فاضي جديد.

القواعد: يختار Chaos واحد قبل اللعبة، بالاحتمالات Normal 25% / High 40% / Madness 60%، والـOff هو الافتراضي. الستريمر يمكنه Force Next يدويًا حتى مع Off. ستة أحداث: Double ×2, Comeback ×2, Spectator ×2, Speed Rush, Risk Round (-30), Golden Round. حذف Half Score / Score Storm / Chill Window. الجائزة الذهبية لمشارك رسمي واحد بأعلى نقاط صحيحة (قرعة عند التعادل): Shield يمنع خصم واحد، Bonus +25% على الإجابة الصحيحة التالية، Crown تذكارية. لا يوجد نظام إقصاء في الـFull Tour، فلا توجد حماية من الإقصاء بعد.

مهم: كما في النسخ السابقة، اختبار الكود لا يغني عن تجربة العرض داخل Electron، خصوصًا مقدمة الـChaos والـScoreboard على 720p.

التحقق: node scripts/verify-chaos-v40.cjs ثم node scripts/run-all-regressions.mjs، ولتشغيل التطبيق بعد تثبيت مكتباته npm run dev.
المزيد: docs/CHAOS_V40_AR.md.
