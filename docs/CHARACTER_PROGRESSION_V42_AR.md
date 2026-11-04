# Ta7ady ElGeel V42 — Character Unlocks & Level Up

## ما اتنفذ

- كل هوية Twitch User ID بتختار نفس الـCharacter Sprite حتى بعد إعادة تشغيل اللعبة. اتشال الـsession-random seed من حساب الشخصية، **من غير تعديل صيغة** `profiles.json` أو تصفير XP.
- أوامر الـUnlocks بقت بتنفذ رد فعل مرئي حقيقي فوق شخصية اللاعب، بدل رسالة Feed غير مرئية:
  - Level 2: `!wave` / `!سلام`: تلويح.
  - Level 3: `!dance` / `!رقص`: حركة رقص سريعة.
  - Level 5: `!emote`: قلب/تفاعل مرئي.
  - Level 8: `!cheer`: حركة تشجيع.
  - Level 10: `!challenge`: وضعية تحدي وعبارة Ready **كتفاعل تجميلي فقط**؛ لا ينشئ سؤالًا أو Bonus Score.
  - Level 15: `!spotlight`: Spotlight فوق الشخصية.
  - Level 20: `!victory` / `!فوز`: حركة فوز احتفالية (Unlock جديد).
- `!profile` بيعرض بطاقة صغيرة فوق الشخصية فيها Level، إجمالي XP، وشريط التقدم، لو الشخصية ظاهرة ووقت الإجابة مقفول. استجابة الأمر النصية موجودة زي ما هي.
- Level Up الحقيقي يظهر **مرة واحدة عند تسوية XP في نهاية Full Tour أو Single MiniGame**: حركة احتفال وإضاءة حول الشخصية (لمدة 6.5 ثانية)، وشارة XP/Level Up متحركة في الـFinal Scoreboard، مع اسم الأمر الجديد لو اتفتح. مفيش Level Up أثناء السؤال.
- الـOfficial Players فقط بيحصلوا على XP وفق نظام V41. لا XP للـSpectators، ولا رجوع Coins.
- كل تفاعل له مدة تلقائية، وCooldown بين الأوامر (6 ثوانٍ في العادي، و12 للـSpotlight/Level20 Victory). حد أقصى 16 تأثيرًا متزامنًا، وSpotlight رئيسي واحد في اللحظة نفسها.
- منع الحركات البصرية في وقت الإجابة حتى لا تشتت اللاعب. رجوع رسالة Feedback عند المنع. المتفرج يقدر يستخدم Cosmetics المفتوحة بمستواه القديم من غير ما يكسب XP.
- مع الزحمة (>72 شخص)، تظهر الأولوية للتفاعلات النشطة ضمن المقاعد الديناميكية، مع الحفاظ على الـ48 مكانًا الثابتين.
- Responsive CSS على 720p/1080p، واحترام `prefers-reduced-motion`، وتصميم متوافق مع الثيم العام.

## نقاط اختبار يدوي داخل Electron

1. في Lobby اكتب `!join`، وبعدها `!profile` وشوف البطاقة فوق الشخصية (اللاعب لازم يكون ظاهر بين الـ72).
2. باستخدام ملف Profile قديم Level 2+، جرّب `!wave` ثم كرره فورًا وتأكد من الـCooldown.
3. جرّب `!dance` و`!emote` و`!cheer`، وعلى Level 15 جرب `!spotlight`، وعلى Level 20 `!victory`.
4. أثناء سؤال مفتوح اكتب أمر رقص؛ المفروض يترفض لكن إجابة `!1`..`!4` تفضل شغالة.
5. وصل XP لاعب لمستوى جديد وأكمل Single Game/Full Tour: شوف LevelUp في النتيجة النهائية فقط، وشارة الـUnlock بجانب XP.
6. أعد فتح اللعبة بنفس Twitch User ID وتأكد إن Avatar ما اتغيرش. جرب Spectator وOfficial.
7. جرّب 1280×720 و1920×1080، خصوصًا Callouts في مجموعات جمهور مزدحمة.

## التحقق

- `node scripts/verify-character-progression-v42.cjs`
- `tsc -p tsconfig.quality-v38.json`
- `node scripts/run-all-regressions.mjs`
- Syntax parsing لجميع TypeScript/TSX وCSS، وسلامة ZIP ودقة Patch.

## حدود التحقق

لم يتم تشغيل Electron/Vite Build أو اختبار Render بصري فعلي، لعدم توفر تبعيات npm في بيئة البناء. لا ندّعي اكتمال جودة الشكل أو أنيميشن الشخصية قبل تجربتها.

## ملاحظات معمارية

- `characterActions` موجودة في Runtime Snapshot فقط؛ لا نحفظ مؤثرات أو Timers في `profiles.json`.
- الـXP واتفاق تسويته في نهاية الجلسة ما اتغيرش. كل Rewards تجميلية، وتكافؤ نقاط المنافسة محفوظ.
- `!challenge` الآن رد فعل تجميلي؛ أي Mini-Game Challenge حقيقي يحتاج تصميم مستقل قبل إدخاله.
