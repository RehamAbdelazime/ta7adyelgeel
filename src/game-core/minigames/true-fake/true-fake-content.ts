import type { GameQuestionBase } from '../../questions/question-types';
import type { TrueFakeAnswer } from '../minigame-types';

export type TrueFakeQuestion = GameQuestionBase<TrueFakeAnswer>;

export const TRUE_FAKE_QUESTIONS = [
  {
    "id": "tf_octopus_hearts_true",
    "answer": "true",
    "statement": {
      "en": "An octopus has three hearts.",
      "ar": "الأخطبوط لديه ثلاثة قلوب."
    },
    "category": "science",
    "difficulty": "easy",
    "tags": [
      "animals",
      "octopus"
    ],
    "similarityGroup": "octopus_hearts"
  },
  {
    "id": "tf_octopus_hearts_fake",
    "answer": "fake",
    "statement": {
      "en": "An octopus has one heart like humans.",
      "ar": "الأخطبوط لديه قلب واحد مثل الإنسان."
    },
    "category": "science",
    "difficulty": "easy",
    "tags": [
      "animals",
      "octopus"
    ],
    "similarityGroup": "octopus_hearts"
  },
  {
    "id": "tf_cat_sweet_taste_true",
    "answer": "true",
    "statement": {
      "en": "Cats cannot taste sweetness the way humans do.",
      "ar": "القطط لا تتذوق الحلاوة بالطريقة التي يتذوقها البشر."
    },
    "category": "animals",
    "difficulty": "medium",
    "tags": [
      "cats",
      "taste"
    ],
    "similarityGroup": "cat_sweet_taste"
  },
  {
    "id": "tf_cat_sweet_taste_fake",
    "answer": "fake",
    "statement": {
      "en": "Cats taste sweet flavors better than humans.",
      "ar": "القطط تتذوق الطعم الحلو أفضل من البشر."
    },
    "category": "animals",
    "difficulty": "medium",
    "tags": [
      "cats",
      "taste"
    ],
    "similarityGroup": "cat_sweet_taste"
  },
  {
    "id": "tf_banana_plant_true",
    "answer": "true",
    "statement": {
      "en": "Bananas grow on large herbaceous plants, not wooden trees.",
      "ar": "الموز ينمو على نباتات عشبية كبيرة وليس على أشجار خشبية."
    },
    "category": "food",
    "difficulty": "easy",
    "tags": [
      "banana",
      "plants"
    ],
    "similarityGroup": "banana_plant"
  },
  {
    "id": "tf_banana_plant_fake",
    "answer": "fake",
    "statement": {
      "en": "Bananas grow on wooden trees like apples.",
      "ar": "الموز ينمو على أشجار خشبية مثل التفاح."
    },
    "category": "food",
    "difficulty": "easy",
    "tags": [
      "banana",
      "plants"
    ],
    "similarityGroup": "banana_plant"
  },
  {
    "id": "tf_eiffel_heat_true",
    "answer": "true",
    "statement": {
      "en": "The Eiffel Tower can become slightly taller in hot weather.",
      "ar": "برج إيفل يمكن أن يزيد طوله قليلًا في الطقس الحار."
    },
    "category": "science",
    "difficulty": "easy",
    "tags": [
      "metal",
      "heat"
    ],
    "similarityGroup": "eiffel_heat"
  },
  {
    "id": "tf_eiffel_heat_fake",
    "answer": "fake",
    "statement": {
      "en": "The Eiffel Tower becomes shorter in hot weather because metal shrinks.",
      "ar": "برج إيفل يصبح أقصر في الطقس الحار لأن المعدن ينكمش."
    },
    "category": "science",
    "difficulty": "easy",
    "tags": [
      "metal",
      "heat"
    ],
    "similarityGroup": "eiffel_heat"
  },
  {
    "id": "tf_goldfish_memory_true",
    "answer": "true",
    "statement": {
      "en": "Goldfish can remember things for longer than three seconds.",
      "ar": "السمك الذهبي يستطيع تذكر أشياء لأكثر من ثلاث ثوانٍ."
    },
    "category": "animals",
    "difficulty": "easy",
    "tags": [
      "fish",
      "memory"
    ],
    "similarityGroup": "goldfish_memory"
  },
  {
    "id": "tf_goldfish_memory_fake",
    "answer": "fake",
    "statement": {
      "en": "Goldfish can only remember things for three seconds.",
      "ar": "السمك الذهبي لا يتذكر الأشياء إلا لمدة ثلاث ثوانٍ فقط."
    },
    "category": "animals",
    "difficulty": "easy",
    "tags": [
      "fish",
      "memory"
    ],
    "similarityGroup": "goldfish_memory"
  },
  {
    "id": "tf_lightning_heat_true",
    "answer": "true",
    "statement": {
      "en": "A lightning bolt can be hotter than the surface of the sun.",
      "ar": "قد تكون ضربة البرق أسخن من سطح الشمس."
    },
    "category": "science",
    "difficulty": "easy",
    "tags": [
      "weather",
      "lightning"
    ],
    "similarityGroup": "lightning_heat"
  },
  {
    "id": "tf_lightning_heat_fake",
    "answer": "fake",
    "statement": {
      "en": "Lightning is always colder than boiling water.",
      "ar": "البرق دائمًا أبرد من الماء المغلي."
    },
    "category": "science",
    "difficulty": "easy",
    "tags": [
      "weather",
      "lightning"
    ],
    "similarityGroup": "lightning_heat"
  },
  {
    "id": "tf_venus_day_year_true",
    "answer": "true",
    "statement": {
      "en": "A day on Venus is longer than a year on Venus.",
      "ar": "اليوم على كوكب الزهرة أطول من السنة على كوكب الزهرة."
    },
    "category": "space",
    "difficulty": "medium",
    "tags": [
      "venus",
      "planets"
    ],
    "similarityGroup": "venus_day_year"
  },
  {
    "id": "tf_venus_day_year_fake",
    "answer": "fake",
    "statement": {
      "en": "A day on Venus lasts exactly 24 Earth hours.",
      "ar": "اليوم على كوكب الزهرة يساوي بالضبط 24 ساعة أرضية."
    },
    "category": "space",
    "difficulty": "medium",
    "tags": [
      "venus",
      "planets"
    ],
    "similarityGroup": "venus_day_year"
  },
  {
    "id": "tf_mars_moons_true",
    "answer": "true",
    "statement": {
      "en": "Mars has two moons.",
      "ar": "للمريخ قمران."
    },
    "category": "space",
    "difficulty": "easy",
    "tags": [
      "mars",
      "moons"
    ],
    "similarityGroup": "mars_moons"
  },
  {
    "id": "tf_mars_moons_fake",
    "answer": "fake",
    "statement": {
      "en": "Mars has no moons at all.",
      "ar": "ليس للمريخ أي أقمار إطلاقًا."
    },
    "category": "space",
    "difficulty": "easy",
    "tags": [
      "mars",
      "moons"
    ],
    "similarityGroup": "mars_moons"
  },
  {
    "id": "tf_jupiter_largest_true",
    "answer": "true",
    "statement": {
      "en": "Jupiter is the largest planet in our solar system.",
      "ar": "المشتري هو أكبر كوكب في نظامنا الشمسي."
    },
    "category": "space",
    "difficulty": "easy",
    "tags": [
      "jupiter",
      "planets"
    ],
    "similarityGroup": "jupiter_largest"
  },
  {
    "id": "tf_jupiter_largest_fake",
    "answer": "fake",
    "statement": {
      "en": "Mercury is the largest planet in our solar system.",
      "ar": "عطارد هو أكبر كوكب في نظامنا الشمسي."
    },
    "category": "space",
    "difficulty": "easy",
    "tags": [
      "jupiter",
      "planets"
    ],
    "similarityGroup": "jupiter_largest"
  },
  {
    "id": "tf_saturn_rings_true",
    "answer": "true",
    "statement": {
      "en": "Saturn is famous for its large ring system.",
      "ar": "زحل مشهور بنظام حلقاته الكبير."
    },
    "category": "space",
    "difficulty": "easy",
    "tags": [
      "saturn",
      "rings"
    ],
    "similarityGroup": "saturn_rings"
  },
  {
    "id": "tf_saturn_rings_fake",
    "answer": "fake",
    "statement": {
      "en": "Saturn has no rings.",
      "ar": "زحل لا يملك حلقات."
    },
    "category": "space",
    "difficulty": "easy",
    "tags": [
      "saturn",
      "rings"
    ],
    "similarityGroup": "saturn_rings"
  },
  {
    "id": "tf_sound_space_true",
    "answer": "true",
    "statement": {
      "en": "Sound cannot travel through the vacuum of space.",
      "ar": "الصوت لا ينتقل في فراغ الفضاء."
    },
    "category": "space",
    "difficulty": "easy",
    "tags": [
      "sound",
      "vacuum"
    ],
    "similarityGroup": "sound_space"
  },
  {
    "id": "tf_sound_space_fake",
    "answer": "fake",
    "statement": {
      "en": "Sound travels faster in empty space than in air.",
      "ar": "الصوت ينتقل أسرع في الفضاء الفارغ من الهواء."
    },
    "category": "space",
    "difficulty": "easy",
    "tags": [
      "sound",
      "vacuum"
    ],
    "similarityGroup": "sound_space"
  },
  {
    "id": "tf_moon_gravity_true",
    "answer": "true",
    "statement": {
      "en": "The Moon has weaker gravity than Earth.",
      "ar": "جاذبية القمر أضعف من جاذبية الأرض."
    },
    "category": "space",
    "difficulty": "easy",
    "tags": [
      "moon",
      "gravity"
    ],
    "similarityGroup": "moon_gravity"
  },
  {
    "id": "tf_moon_gravity_fake",
    "answer": "fake",
    "statement": {
      "en": "The Moon has stronger gravity than Earth.",
      "ar": "جاذبية القمر أقوى من جاذبية الأرض."
    },
    "category": "space",
    "difficulty": "easy",
    "tags": [
      "moon",
      "gravity"
    ],
    "similarityGroup": "moon_gravity"
  },
  {
    "id": "tf_sharks_bones_true",
    "answer": "true",
    "statement": {
      "en": "Shark skeletons are made mostly of cartilage.",
      "ar": "هياكل أسماك القرش مكونة غالبًا من الغضاريف."
    },
    "category": "animals",
    "difficulty": "medium",
    "tags": [
      "sharks",
      "cartilage"
    ],
    "similarityGroup": "sharks_bones"
  },
  {
    "id": "tf_sharks_bones_fake",
    "answer": "fake",
    "statement": {
      "en": "Sharks have skeletons made mostly of iron.",
      "ar": "هياكل أسماك القرش مكونة غالبًا من الحديد."
    },
    "category": "animals",
    "difficulty": "medium",
    "tags": [
      "sharks",
      "cartilage"
    ],
    "similarityGroup": "sharks_bones"
  },
  {
    "id": "tf_whale_mammal_true",
    "answer": "true",
    "statement": {
      "en": "Whales are mammals.",
      "ar": "الحيتان من الثدييات."
    },
    "category": "animals",
    "difficulty": "easy",
    "tags": [
      "whales",
      "mammals"
    ],
    "similarityGroup": "whale_mammal"
  },
  {
    "id": "tf_whale_mammal_fake",
    "answer": "fake",
    "statement": {
      "en": "Whales are insects.",
      "ar": "الحيتان حشرات."
    },
    "category": "animals",
    "difficulty": "easy",
    "tags": [
      "whales",
      "mammals"
    ],
    "similarityGroup": "whale_mammal"
  },
  {
    "id": "tf_penguins_fly_true",
    "answer": "true",
    "statement": {
      "en": "Penguins are birds, but they cannot fly.",
      "ar": "البطاريق طيور لكنها لا تستطيع الطيران."
    },
    "category": "animals",
    "difficulty": "easy",
    "tags": [
      "penguins",
      "birds"
    ],
    "similarityGroup": "penguins_fly"
  },
  {
    "id": "tf_penguins_fly_fake",
    "answer": "fake",
    "statement": {
      "en": "Penguins are mammals that can fly.",
      "ar": "البطاريق ثدييات تستطيع الطيران."
    },
    "category": "animals",
    "difficulty": "easy",
    "tags": [
      "penguins",
      "birds"
    ],
    "similarityGroup": "penguins_fly"
  },
  {
    "id": "tf_ostrich_egg_true",
    "answer": "true",
    "statement": {
      "en": "Ostriches lay very large eggs.",
      "ar": "النعام يضع بيضًا كبيرًا جدًا."
    },
    "category": "animals",
    "difficulty": "easy",
    "tags": [
      "birds",
      "ostrich"
    ],
    "similarityGroup": "ostrich_egg"
  },
  {
    "id": "tf_ostrich_egg_fake",
    "answer": "fake",
    "statement": {
      "en": "Ostriches give birth to live babies like cats.",
      "ar": "النعام يلد صغارًا مثل القطط."
    },
    "category": "animals",
    "difficulty": "easy",
    "tags": [
      "birds",
      "ostrich"
    ],
    "similarityGroup": "ostrich_egg"
  },
  {
    "id": "tf_honey_never_spoils_true",
    "answer": "true",
    "statement": {
      "en": "Honey can stay edible for a very long time when stored properly.",
      "ar": "يمكن أن يبقى العسل صالحًا للأكل لفترة طويلة جدًا إذا حُفظ جيدًا."
    },
    "category": "food",
    "difficulty": "medium",
    "tags": [
      "honey",
      "food"
    ],
    "similarityGroup": "honey_never_spoils"
  },
  {
    "id": "tf_honey_never_spoils_fake",
    "answer": "fake",
    "statement": {
      "en": "Honey always spoils within one week.",
      "ar": "العسل يفسد دائمًا خلال أسبوع واحد."
    },
    "category": "food",
    "difficulty": "medium",
    "tags": [
      "honey",
      "food"
    ],
    "similarityGroup": "honey_never_spoils"
  },
  {
    "id": "tf_tomato_fruit_true",
    "answer": "true",
    "statement": {
      "en": "Botanically, a tomato is a fruit.",
      "ar": "من الناحية النباتية، الطماطم ثمرة."
    },
    "category": "food",
    "difficulty": "easy",
    "tags": [
      "tomato",
      "fruit"
    ],
    "similarityGroup": "tomato_fruit"
  },
  {
    "id": "tf_tomato_fruit_fake",
    "answer": "fake",
    "statement": {
      "en": "Botanically, a tomato is a mineral.",
      "ar": "من الناحية النباتية، الطماطم معدن."
    },
    "category": "food",
    "difficulty": "easy",
    "tags": [
      "tomato",
      "fruit"
    ],
    "similarityGroup": "tomato_fruit"
  },
  {
    "id": "tf_peanuts_legumes_true",
    "answer": "true",
    "statement": {
      "en": "Peanuts are legumes, not true tree nuts.",
      "ar": "الفول السوداني من البقوليات وليس من المكسرات الشجرية الحقيقية."
    },
    "category": "food",
    "difficulty": "medium",
    "tags": [
      "peanuts",
      "legumes"
    ],
    "similarityGroup": "peanuts_legumes"
  },
  {
    "id": "tf_peanuts_legumes_fake",
    "answer": "fake",
    "statement": {
      "en": "Peanuts grow inside pine cones.",
      "ar": "الفول السوداني ينمو داخل مخاريط الصنوبر."
    },
    "category": "food",
    "difficulty": "medium",
    "tags": [
      "peanuts",
      "legumes"
    ],
    "similarityGroup": "peanuts_legumes"
  },
  {
    "id": "tf_coffee_bean_seed_true",
    "answer": "true",
    "statement": {
      "en": "A coffee bean is actually a seed.",
      "ar": "حبة القهوة هي في الحقيقة بذرة."
    },
    "category": "food",
    "difficulty": "easy",
    "tags": [
      "coffee",
      "seeds"
    ],
    "similarityGroup": "coffee_bean_seed"
  },
  {
    "id": "tf_coffee_bean_seed_fake",
    "answer": "fake",
    "statement": {
      "en": "A coffee bean is a small animal egg.",
      "ar": "حبة القهوة هي بيضة حيوان صغيرة."
    },
    "category": "food",
    "difficulty": "easy",
    "tags": [
      "coffee",
      "seeds"
    ],
    "similarityGroup": "coffee_bean_seed"
  },
  {
    "id": "tf_water_boiling_true",
    "answer": "true",
    "statement": {
      "en": "At sea level, water boils at about 100°C.",
      "ar": "عند مستوى سطح البحر، يغلي الماء عند حوالي 100 درجة مئوية."
    },
    "category": "science",
    "difficulty": "easy",
    "tags": [
      "water",
      "temperature"
    ],
    "similarityGroup": "water_boiling"
  },
  {
    "id": "tf_water_boiling_fake",
    "answer": "fake",
    "statement": {
      "en": "At sea level, water boils at about 10°C.",
      "ar": "عند مستوى سطح البحر، يغلي الماء عند حوالي 10 درجات مئوية."
    },
    "category": "science",
    "difficulty": "easy",
    "tags": [
      "water",
      "temperature"
    ],
    "similarityGroup": "water_boiling"
  },
  {
    "id": "tf_human_bones_true",
    "answer": "true",
    "statement": {
      "en": "Most adult humans have 206 bones.",
      "ar": "معظم البالغين لديهم 206 عظمة."
    },
    "category": "science",
    "difficulty": "easy",
    "tags": [
      "human",
      "bones"
    ],
    "similarityGroup": "human_bones"
  },
  {
    "id": "tf_human_bones_fake",
    "answer": "fake",
    "statement": {
      "en": "Most adult humans have exactly 20 bones.",
      "ar": "معظم البالغين لديهم بالضبط 20 عظمة."
    },
    "category": "science",
    "difficulty": "easy",
    "tags": [
      "human",
      "bones"
    ],
    "similarityGroup": "human_bones"
  },
  {
    "id": "tf_blood_color_true",
    "answer": "true",
    "statement": {
      "en": "Human blood is red because of hemoglobin.",
      "ar": "دم الإنسان أحمر بسبب الهيموغلوبين."
    },
    "category": "science",
    "difficulty": "easy",
    "tags": [
      "human",
      "blood"
    ],
    "similarityGroup": "blood_color"
  },
  {
    "id": "tf_blood_color_fake",
    "answer": "fake",
    "statement": {
      "en": "Human blood is naturally blue inside the body.",
      "ar": "دم الإنسان أزرق طبيعيًا داخل الجسم."
    },
    "category": "science",
    "difficulty": "easy",
    "tags": [
      "human",
      "blood"
    ],
    "similarityGroup": "blood_color"
  },
  {
    "id": "tf_diamond_carbon_true",
    "answer": "true",
    "statement": {
      "en": "Diamond is made of carbon atoms arranged in a crystal structure.",
      "ar": "الألماس مكون من ذرات كربون مرتبة في بنية بلورية."
    },
    "category": "science",
    "difficulty": "medium",
    "tags": [
      "diamond",
      "carbon"
    ],
    "similarityGroup": "diamond_carbon"
  },
  {
    "id": "tf_diamond_carbon_fake",
    "answer": "fake",
    "statement": {
      "en": "Diamond is made mostly of frozen water.",
      "ar": "الألماس مكون غالبًا من ماء متجمد."
    },
    "category": "science",
    "difficulty": "medium",
    "tags": [
      "diamond",
      "carbon"
    ],
    "similarityGroup": "diamond_carbon"
  },
  {
    "id": "tf_earth_rotation_true",
    "answer": "true",
    "statement": {
      "en": "Earth rotates around its axis.",
      "ar": "تدور الأرض حول محورها."
    },
    "category": "science",
    "difficulty": "easy",
    "tags": [
      "earth",
      "rotation"
    ],
    "similarityGroup": "earth_rotation"
  },
  {
    "id": "tf_earth_rotation_fake",
    "answer": "fake",
    "statement": {
      "en": "Earth does not rotate at all.",
      "ar": "الأرض لا تدور إطلاقًا."
    },
    "category": "science",
    "difficulty": "easy",
    "tags": [
      "earth",
      "rotation"
    ],
    "similarityGroup": "earth_rotation"
  },
  {
    "id": "tf_compass_north_true",
    "answer": "true",
    "statement": {
      "en": "A compass needle aligns with Earth’s magnetic field.",
      "ar": "تتجه إبرة البوصلة مع المجال المغناطيسي للأرض."
    },
    "category": "science",
    "difficulty": "medium",
    "tags": [
      "compass",
      "magnetism"
    ],
    "similarityGroup": "compass_north"
  },
  {
    "id": "tf_compass_north_fake",
    "answer": "fake",
    "statement": {
      "en": "A compass works by smelling the north pole.",
      "ar": "تعمل البوصلة عن طريق شم القطب الشمالي."
    },
    "category": "science",
    "difficulty": "medium",
    "tags": [
      "compass",
      "magnetism"
    ],
    "similarityGroup": "compass_north"
  },
  {
    "id": "tf_rome_italy_true",
    "answer": "true",
    "statement": {
      "en": "Ancient Rome began in what is now Italy.",
      "ar": "بدأت روما القديمة في ما يعرف الآن بإيطاليا."
    },
    "category": "history",
    "difficulty": "easy",
    "tags": [
      "rome",
      "italy"
    ],
    "similarityGroup": "rome_italy"
  },
  {
    "id": "tf_rome_italy_fake",
    "answer": "fake",
    "statement": {
      "en": "Ancient Rome began on the Moon.",
      "ar": "بدأت روما القديمة على القمر."
    },
    "category": "history",
    "difficulty": "easy",
    "tags": [
      "rome",
      "italy"
    ],
    "similarityGroup": "rome_italy"
  },
  {
    "id": "tf_pyramids_egypt_true",
    "answer": "true",
    "statement": {
      "en": "The Great Pyramid of Giza is in Egypt.",
      "ar": "الهرم الأكبر في الجيزة موجود في مصر."
    },
    "category": "history",
    "difficulty": "easy",
    "tags": [
      "egypt",
      "pyramids"
    ],
    "similarityGroup": "pyramids_egypt"
  },
  {
    "id": "tf_pyramids_egypt_fake",
    "answer": "fake",
    "statement": {
      "en": "The Great Pyramid of Giza is in Iceland.",
      "ar": "الهرم الأكبر في الجيزة موجود في آيسلندا."
    },
    "category": "history",
    "difficulty": "easy",
    "tags": [
      "egypt",
      "pyramids"
    ],
    "similarityGroup": "pyramids_egypt"
  },
  {
    "id": "tf_paper_china_true",
    "answer": "true",
    "statement": {
      "en": "Paper was invented in ancient China.",
      "ar": "اختُرع الورق في الصين القديمة."
    },
    "category": "history",
    "difficulty": "medium",
    "tags": [
      "paper",
      "china"
    ],
    "similarityGroup": "paper_china"
  },
  {
    "id": "tf_paper_china_fake",
    "answer": "fake",
    "statement": {
      "en": "Paper was invented by pirates in Antarctica.",
      "ar": "اختُرع الورق بواسطة قراصنة في القارة القطبية الجنوبية."
    },
    "category": "history",
    "difficulty": "medium",
    "tags": [
      "paper",
      "china"
    ],
    "similarityGroup": "paper_china"
  },
  {
    "id": "tf_printing_press_true",
    "answer": "true",
    "statement": {
      "en": "Johannes Gutenberg is associated with the movable-type printing press in Europe.",
      "ar": "يرتبط يوهانس غوتنبرغ بالمطبعة ذات الحروف المتحركة في أوروبا."
    },
    "category": "history",
    "difficulty": "medium",
    "tags": [
      "printing",
      "gutenberg"
    ],
    "similarityGroup": "printing_press"
  },
  {
    "id": "tf_printing_press_fake",
    "answer": "fake",
    "statement": {
      "en": "Johannes Gutenberg invented the first video game console.",
      "ar": "اخترع يوهانس غوتنبرغ أول جهاز ألعاب فيديو."
    },
    "category": "history",
    "difficulty": "medium",
    "tags": [
      "printing",
      "gutenberg"
    ],
    "similarityGroup": "printing_press"
  },
  {
    "id": "tf_pacman_1980_true",
    "answer": "true",
    "statement": {
      "en": "Pac-Man was released in 1980.",
      "ar": "صدرت لعبة Pac-Man عام 1980."
    },
    "category": "games",
    "difficulty": "easy",
    "tags": [
      "pacman",
      "arcade"
    ],
    "similarityGroup": "pacman_1980"
  },
  {
    "id": "tf_pacman_1980_fake",
    "answer": "fake",
    "statement": {
      "en": "Pac-Man was released in ancient Egypt.",
      "ar": "صدرت لعبة Pac-Man في مصر القديمة."
    },
    "category": "games",
    "difficulty": "easy",
    "tags": [
      "pacman",
      "arcade"
    ],
    "similarityGroup": "pacman_1980"
  },
  {
    "id": "tf_minecraft_blocks_true",
    "answer": "true",
    "statement": {
      "en": "Minecraft is known for its block-based world.",
      "ar": "تشتهر Minecraft بعالمها المبني من المكعبات."
    },
    "category": "games",
    "difficulty": "easy",
    "tags": [
      "minecraft",
      "sandbox"
    ],
    "similarityGroup": "minecraft_blocks"
  },
  {
    "id": "tf_minecraft_blocks_fake",
    "answer": "fake",
    "statement": {
      "en": "Minecraft is known for having no blocks at all.",
      "ar": "تشتهر Minecraft بأنها لا تحتوي على مكعبات إطلاقًا."
    },
    "category": "games",
    "difficulty": "easy",
    "tags": [
      "minecraft",
      "sandbox"
    ],
    "similarityGroup": "minecraft_blocks"
  },
  {
    "id": "tf_mario_plumber_true",
    "answer": "true",
    "statement": {
      "en": "Mario is commonly known as a plumber.",
      "ar": "ماريو معروف عادةً بأنه سباك."
    },
    "category": "games",
    "difficulty": "easy",
    "tags": [
      "mario",
      "nintendo"
    ],
    "similarityGroup": "mario_plumber"
  },
  {
    "id": "tf_mario_plumber_fake",
    "answer": "fake",
    "statement": {
      "en": "Mario is commonly known as a real-world astronaut.",
      "ar": "ماريو معروف عادةً بأنه رائد فضاء حقيقي."
    },
    "category": "games",
    "difficulty": "easy",
    "tags": [
      "mario",
      "nintendo"
    ],
    "similarityGroup": "mario_plumber"
  },
  {
    "id": "tf_tetris_blocks_true",
    "answer": "true",
    "statement": {
      "en": "Tetris is a puzzle game about fitting falling blocks.",
      "ar": "Tetris لعبة ألغاز تعتمد على ترتيب القطع الساقطة."
    },
    "category": "games",
    "difficulty": "easy",
    "tags": [
      "tetris",
      "puzzle"
    ],
    "similarityGroup": "tetris_blocks"
  },
  {
    "id": "tf_tetris_blocks_fake",
    "answer": "fake",
    "statement": {
      "en": "Tetris is a cooking simulator about soup.",
      "ar": "Tetris لعبة طبخ عن الشوربة."
    },
    "category": "games",
    "difficulty": "easy",
    "tags": [
      "tetris",
      "puzzle"
    ],
    "similarityGroup": "tetris_blocks"
  },
  {
    "id": "tf_chess_board_true",
    "answer": "true",
    "statement": {
      "en": "A standard chessboard has 64 squares.",
      "ar": "لوحة الشطرنج القياسية تحتوي على 64 مربعًا."
    },
    "category": "games",
    "difficulty": "easy",
    "tags": [
      "chess",
      "board"
    ],
    "similarityGroup": "chess_board"
  },
  {
    "id": "tf_chess_board_fake",
    "answer": "fake",
    "statement": {
      "en": "A standard chessboard has 65 squares.",
      "ar": "لوحة الشطرنج القياسية تحتوي على 65 مربعًا."
    },
    "category": "games",
    "difficulty": "easy",
    "tags": [
      "chess",
      "board"
    ],
    "similarityGroup": "chess_board"
  },
  {
    "id": "tf_monopoly_money_true",
    "answer": "true",
    "statement": {
      "en": "Monopoly uses play money as part of the game.",
      "ar": "تستخدم Monopoly نقودًا وهمية كجزء من اللعبة."
    },
    "category": "games",
    "difficulty": "easy",
    "tags": [
      "boardgames",
      "monopoly"
    ],
    "similarityGroup": "monopoly_money"
  },
  {
    "id": "tf_monopoly_money_fake",
    "answer": "fake",
    "statement": {
      "en": "Monopoly is played only with real bank transfers.",
      "ar": "تُلعب Monopoly فقط بتحويلات بنكية حقيقية."
    },
    "category": "games",
    "difficulty": "easy",
    "tags": [
      "boardgames",
      "monopoly"
    ],
    "similarityGroup": "monopoly_money"
  },
  {
    "id": "tf_egypt_africa_true",
    "answer": "true",
    "statement": {
      "en": "Egypt is in northeastern Africa.",
      "ar": "تقع مصر في شمال شرق أفريقيا."
    },
    "category": "geography",
    "difficulty": "easy",
    "tags": [
      "egypt",
      "africa"
    ],
    "similarityGroup": "egypt_africa"
  },
  {
    "id": "tf_egypt_africa_fake",
    "answer": "fake",
    "statement": {
      "en": "Egypt is in South America.",
      "ar": "تقع مصر في أمريكا الجنوبية."
    },
    "category": "geography",
    "difficulty": "easy",
    "tags": [
      "egypt",
      "africa"
    ],
    "similarityGroup": "egypt_africa"
  },
  {
    "id": "tf_nile_river_true",
    "answer": "true",
    "statement": {
      "en": "The Nile is a major river in Africa.",
      "ar": "النيل نهر رئيسي في أفريقيا."
    },
    "category": "geography",
    "difficulty": "easy",
    "tags": [
      "nile",
      "river"
    ],
    "similarityGroup": "nile_river"
  },
  {
    "id": "tf_nile_river_fake",
    "answer": "fake",
    "statement": {
      "en": "The Nile is a mountain on Mars.",
      "ar": "النيل جبل على كوكب المريخ."
    },
    "category": "geography",
    "difficulty": "easy",
    "tags": [
      "nile",
      "river"
    ],
    "similarityGroup": "nile_river"
  },
  {
    "id": "tf_sahara_desert_true",
    "answer": "true",
    "statement": {
      "en": "The Sahara is a large desert in Africa.",
      "ar": "الصحراء الكبرى صحراء واسعة في أفريقيا."
    },
    "category": "geography",
    "difficulty": "easy",
    "tags": [
      "sahara",
      "desert"
    ],
    "similarityGroup": "sahara_desert"
  },
  {
    "id": "tf_sahara_desert_fake",
    "answer": "fake",
    "statement": {
      "en": "The Sahara is a rainforest in Antarctica.",
      "ar": "الصحراء الكبرى غابة مطيرة في القارة القطبية الجنوبية."
    },
    "category": "geography",
    "difficulty": "easy",
    "tags": [
      "sahara",
      "desert"
    ],
    "similarityGroup": "sahara_desert"
  },
  {
    "id": "tf_amazon_river_true",
    "answer": "true",
    "statement": {
      "en": "The Amazon River is in South America.",
      "ar": "نهر الأمازون في أمريكا الجنوبية."
    },
    "category": "geography",
    "difficulty": "medium",
    "tags": [
      "amazon",
      "river"
    ],
    "similarityGroup": "amazon_river"
  },
  {
    "id": "tf_amazon_river_fake",
    "answer": "fake",
    "statement": {
      "en": "The Amazon River flows through the Moon.",
      "ar": "نهر الأمازون يجري على القمر."
    },
    "category": "geography",
    "difficulty": "medium",
    "tags": [
      "amazon",
      "river"
    ],
    "similarityGroup": "amazon_river"
  },
  {
    "id": "tf_mount_everest_true",
    "answer": "true",
    "statement": {
      "en": "Mount Everest is the highest mountain above sea level.",
      "ar": "جبل إيفرست هو أعلى جبل فوق مستوى سطح البحر."
    },
    "category": "geography",
    "difficulty": "easy",
    "tags": [
      "everest",
      "mountain"
    ],
    "similarityGroup": "mount_everest"
  },
  {
    "id": "tf_mount_everest_fake",
    "answer": "fake",
    "statement": {
      "en": "Mount Everest is below the ocean floor.",
      "ar": "جبل إيفرست أسفل قاع المحيط."
    },
    "category": "geography",
    "difficulty": "easy",
    "tags": [
      "everest",
      "mountain"
    ],
    "similarityGroup": "mount_everest"
  },
  {
    "id": "tf_australia_continent_true",
    "answer": "true",
    "statement": {
      "en": "Australia is both a country and a continent region.",
      "ar": "أستراليا تُعد دولة ومنطقة قارية."
    },
    "category": "geography",
    "difficulty": "easy",
    "tags": [
      "australia",
      "continent"
    ],
    "similarityGroup": "australia_continent"
  },
  {
    "id": "tf_australia_continent_fake",
    "answer": "fake",
    "statement": {
      "en": "Australia is a small village in Norway.",
      "ar": "أستراليا قرية صغيرة في النرويج."
    },
    "category": "geography",
    "difficulty": "easy",
    "tags": [
      "australia",
      "continent"
    ],
    "similarityGroup": "australia_continent"
  },
  {
    "id": "tf_olympic_rings_true",
    "answer": "true",
    "statement": {
      "en": "The Olympic symbol has five interlocking rings.",
      "ar": "رمز الأولمبياد يحتوي على خمس حلقات متداخلة."
    },
    "category": "sports",
    "difficulty": "easy",
    "tags": [
      "olympics",
      "rings"
    ],
    "similarityGroup": "olympic_rings"
  },
  {
    "id": "tf_olympic_rings_fake",
    "answer": "fake",
    "statement": {
      "en": "The Olympic symbol has exactly one triangle.",
      "ar": "رمز الأولمبياد يحتوي على مثلث واحد بالضبط."
    },
    "category": "sports",
    "difficulty": "easy",
    "tags": [
      "olympics",
      "rings"
    ],
    "similarityGroup": "olympic_rings"
  },
  {
    "id": "tf_football_players_true",
    "answer": "true",
    "statement": {
      "en": "A standard association football team has 11 players on the field.",
      "ar": "فريق كرة القدم القياسي يلعب بـ11 لاعبًا في الملعب."
    },
    "category": "sports",
    "difficulty": "easy",
    "tags": [
      "football",
      "soccer"
    ],
    "similarityGroup": "football_players"
  },
  {
    "id": "tf_football_players_fake",
    "answer": "fake",
    "statement": {
      "en": "A standard football team has 100 players on the field at once.",
      "ar": "فريق كرة القدم القياسي يلعب بـ100 لاعب في الملعب في نفس الوقت."
    },
    "category": "sports",
    "difficulty": "easy",
    "tags": [
      "football",
      "soccer"
    ],
    "similarityGroup": "football_players"
  },
  {
    "id": "tf_basketball_hoop_true",
    "answer": "true",
    "statement": {
      "en": "Basketball is played by shooting the ball through a hoop.",
      "ar": "تُلعب كرة السلة بإدخال الكرة في السلة."
    },
    "category": "sports",
    "difficulty": "easy",
    "tags": [
      "basketball",
      "hoop"
    ],
    "similarityGroup": "basketball_hoop"
  },
  {
    "id": "tf_basketball_hoop_fake",
    "answer": "fake",
    "statement": {
      "en": "Basketball is scored by hiding the ball under sand.",
      "ar": "تُسجل نقاط كرة السلة بإخفاء الكرة تحت الرمل."
    },
    "category": "sports",
    "difficulty": "easy",
    "tags": [
      "basketball",
      "hoop"
    ],
    "similarityGroup": "basketball_hoop"
  },
  {
    "id": "tf_tennis_scoring_true",
    "answer": "true",
    "statement": {
      "en": "Tennis uses score terms like love, 15, 30, and 40.",
      "ar": "تستخدم التنس مصطلحات مثل love و15 و30 و40 في التسجيل."
    },
    "category": "sports",
    "difficulty": "medium",
    "tags": [
      "tennis",
      "scoring"
    ],
    "similarityGroup": "tennis_scoring"
  },
  {
    "id": "tf_tennis_scoring_fake",
    "answer": "fake",
    "statement": {
      "en": "Tennis scores are counted only with Roman emperors’ names.",
      "ar": "يتم حساب نقاط التنس فقط بأسماء أباطرة الرومان."
    },
    "category": "sports",
    "difficulty": "medium",
    "tags": [
      "tennis",
      "scoring"
    ],
    "similarityGroup": "tennis_scoring"
  },
  {
    "id": "tf_internet_www_true",
    "answer": "true",
    "statement": {
      "en": "The World Wide Web is not the same thing as the entire internet.",
      "ar": "الشبكة العالمية ليست هي نفس الإنترنت بالكامل."
    },
    "category": "internet",
    "difficulty": "easy",
    "tags": [
      "web",
      "internet"
    ],
    "similarityGroup": "internet_www"
  },
  {
    "id": "tf_internet_www_fake",
    "answer": "fake",
    "statement": {
      "en": "The World Wide Web existed before electricity.",
      "ar": "كانت الشبكة العالمية موجودة قبل الكهرباء."
    },
    "category": "internet",
    "difficulty": "easy",
    "tags": [
      "web",
      "internet"
    ],
    "similarityGroup": "internet_www"
  },
  {
    "id": "tf_email_at_symbol_true",
    "answer": "true",
    "statement": {
      "en": "Email addresses commonly contain the @ symbol.",
      "ar": "تحتوي عناوين البريد الإلكتروني عادةً على الرمز @."
    },
    "category": "internet",
    "difficulty": "easy",
    "tags": [
      "email",
      "symbols"
    ],
    "similarityGroup": "email_at_symbol"
  },
  {
    "id": "tf_email_at_symbol_fake",
    "answer": "fake",
    "statement": {
      "en": "Email addresses cannot contain any symbols.",
      "ar": "عناوين البريد الإلكتروني لا يمكن أن تحتوي على أي رموز."
    },
    "category": "internet",
    "difficulty": "easy",
    "tags": [
      "email",
      "symbols"
    ],
    "similarityGroup": "email_at_symbol"
  },
  {
    "id": "tf_emoji_origin_true",
    "answer": "true",
    "statement": {
      "en": "Emoji characters are standardized so they can work across many devices.",
      "ar": "يتم توحيد رموز الإيموجي لتعمل على أجهزة كثيرة."
    },
    "category": "internet",
    "difficulty": "medium",
    "tags": [
      "emoji",
      "unicode"
    ],
    "similarityGroup": "emoji_origin"
  },
  {
    "id": "tf_emoji_origin_fake",
    "answer": "fake",
    "statement": {
      "en": "Emoji only work on one computer in the world.",
      "ar": "الإيموجي تعمل فقط على جهاز كمبيوتر واحد في العالم."
    },
    "category": "internet",
    "difficulty": "medium",
    "tags": [
      "emoji",
      "unicode"
    ],
    "similarityGroup": "emoji_origin"
  },
  {
    "id": "tf_hashtag_true",
    "answer": "true",
    "statement": {
      "en": "A hashtag usually starts with the # symbol.",
      "ar": "الهاشتاج يبدأ عادةً بالرمز #."
    },
    "category": "internet",
    "difficulty": "easy",
    "tags": [
      "hashtag",
      "social"
    ],
    "similarityGroup": "hashtag"
  },
  {
    "id": "tf_hashtag_fake",
    "answer": "fake",
    "statement": {
      "en": "A hashtag usually starts with a banana peel.",
      "ar": "الهاشتاج يبدأ عادةً بقشرة موز."
    },
    "category": "internet",
    "difficulty": "easy",
    "tags": [
      "hashtag",
      "social"
    ],
    "similarityGroup": "hashtag"
  },
  {
    "id": "tf_alphabet_english_true",
    "answer": "true",
    "statement": {
      "en": "The modern English alphabet has 26 letters.",
      "ar": "الأبجدية الإنجليزية الحديثة تحتوي على 26 حرفًا."
    },
    "category": "language",
    "difficulty": "easy",
    "tags": [
      "alphabet",
      "english"
    ],
    "similarityGroup": "alphabet_english"
  },
  {
    "id": "tf_alphabet_english_fake",
    "answer": "fake",
    "statement": {
      "en": "The modern English alphabet has 1000 letters.",
      "ar": "الأبجدية الإنجليزية الحديثة تحتوي على 1000 حرف."
    },
    "category": "language",
    "difficulty": "easy",
    "tags": [
      "alphabet",
      "english"
    ],
    "similarityGroup": "alphabet_english"
  },
  {
    "id": "tf_arabic_rtl_true",
    "answer": "true",
    "statement": {
      "en": "Arabic is commonly written from right to left.",
      "ar": "تُكتب العربية عادةً من اليمين إلى اليسار."
    },
    "category": "language",
    "difficulty": "easy",
    "tags": [
      "arabic",
      "rtl"
    ],
    "similarityGroup": "arabic_rtl"
  },
  {
    "id": "tf_arabic_rtl_fake",
    "answer": "fake",
    "statement": {
      "en": "Arabic is commonly written upside down only.",
      "ar": "تُكتب العربية عادةً مقلوبة فقط."
    },
    "category": "language",
    "difficulty": "easy",
    "tags": [
      "arabic",
      "rtl"
    ],
    "similarityGroup": "arabic_rtl"
  },
  {
    "id": "tf_palindrome_true",
    "answer": "true",
    "statement": {
      "en": "A palindrome reads the same forward and backward.",
      "ar": "الكلمة أو العبارة المتناظرة تُقرأ نفسها من الأمام والخلف."
    },
    "category": "language",
    "difficulty": "medium",
    "tags": [
      "words",
      "palindrome"
    ],
    "similarityGroup": "palindrome"
  },
  {
    "id": "tf_palindrome_fake",
    "answer": "fake",
    "statement": {
      "en": "A palindrome is a word that must contain only numbers.",
      "ar": "الكلمة المتناظرة يجب أن تحتوي على أرقام فقط."
    },
    "category": "language",
    "difficulty": "medium",
    "tags": [
      "words",
      "palindrome"
    ],
    "similarityGroup": "palindrome"
  },
  {
    "id": "tf_vowels_english_true",
    "answer": "true",
    "statement": {
      "en": "English has vowel letters such as A, E, I, O, and U.",
      "ar": "تحتوي الإنجليزية على حروف علة مثل A وE وI وO وU."
    },
    "category": "language",
    "difficulty": "easy",
    "tags": [
      "english",
      "vowels"
    ],
    "similarityGroup": "vowels_english"
  },
  {
    "id": "tf_vowels_english_fake",
    "answer": "fake",
    "statement": {
      "en": "English has no vowel letters at all.",
      "ar": "الإنجليزية لا تحتوي على أي حروف علة إطلاقًا."
    },
    "category": "language",
    "difficulty": "easy",
    "tags": [
      "english",
      "vowels"
    ],
    "similarityGroup": "vowels_english"
  },
  {
    "id": "tf_glass_liquid_true",
    "answer": "true",
    "statement": {
      "en": "Glass is an amorphous solid, not a normal liquid at room temperature.",
      "ar": "الزجاج صلب غير متبلور وليس سائلًا عاديًا في درجة حرارة الغرفة."
    },
    "category": "weird",
    "difficulty": "medium",
    "tags": [
      "glass",
      "materials"
    ],
    "similarityGroup": "glass_liquid"
  },
  {
    "id": "tf_glass_liquid_fake",
    "answer": "fake",
    "statement": {
      "en": "Window glass flows quickly like water during the day.",
      "ar": "زجاج النوافذ يجري بسرعة مثل الماء خلال النهار."
    },
    "category": "weird",
    "difficulty": "medium",
    "tags": [
      "glass",
      "materials"
    ],
    "similarityGroup": "glass_liquid"
  },
  {
    "id": "tf_hot_water_freeze_true",
    "answer": "true",
    "statement": {
      "en": "Under some conditions, hot water can freeze faster than cold water.",
      "ar": "في بعض الظروف، قد يتجمد الماء الساخن أسرع من الماء البارد."
    },
    "category": "weird",
    "difficulty": "hard",
    "tags": [
      "water",
      "mpemba"
    ],
    "similarityGroup": "hot_water_freeze"
  },
  {
    "id": "tf_hot_water_freeze_fake",
    "answer": "fake",
    "statement": {
      "en": "Hot water can never freeze under any condition.",
      "ar": "الماء الساخن لا يمكن أن يتجمد تحت أي ظرف."
    },
    "category": "weird",
    "difficulty": "hard",
    "tags": [
      "water",
      "mpemba"
    ],
    "similarityGroup": "hot_water_freeze"
  },
  {
    "id": "tf_left_handed_true",
    "answer": "true",
    "statement": {
      "en": "Some people are naturally left-handed.",
      "ar": "بعض الناس يستخدمون اليد اليسرى بشكل طبيعي."
    },
    "category": "weird",
    "difficulty": "easy",
    "tags": [
      "humans",
      "left-handed"
    ],
    "similarityGroup": "left_handed"
  },
  {
    "id": "tf_left_handed_fake",
    "answer": "fake",
    "statement": {
      "en": "No human has ever been left-handed.",
      "ar": "لم يوجد أي إنسان أعسر في التاريخ."
    },
    "category": "weird",
    "difficulty": "easy",
    "tags": [
      "humans",
      "left-handed"
    ],
    "similarityGroup": "left_handed"
  },
  {
    "id": "tf_dreams_sleep_true",
    "answer": "true",
    "statement": {
      "en": "People can dream during sleep.",
      "ar": "يمكن للناس أن يحلموا أثناء النوم."
    },
    "category": "weird",
    "difficulty": "easy",
    "tags": [
      "sleep",
      "dreams"
    ],
    "similarityGroup": "dreams_sleep"
  },
  {
    "id": "tf_dreams_sleep_fake",
    "answer": "fake",
    "statement": {
      "en": "People can only dream while eating onions.",
      "ar": "لا يحلم الناس إلا أثناء أكل البصل."
    },
    "category": "weird",
    "difficulty": "easy",
    "tags": [
      "sleep",
      "dreams"
    ],
    "similarityGroup": "dreams_sleep"
  },
  {
    "id": "tf_vampire_bats_true",
    "answer": "true",
    "statement": {
      "en": "Vampire bats are real animals that feed on blood.",
      "ar": "خفافيش مصاصة الدماء حيوانات حقيقية تتغذى على الدم."
    },
    "category": "horror",
    "difficulty": "medium",
    "tags": [
      "bats",
      "vampire"
    ],
    "similarityGroup": "vampire_bats"
  },
  {
    "id": "tf_vampire_bats_fake",
    "answer": "fake",
    "statement": {
      "en": "Vampire bats are fictional robots from the future.",
      "ar": "خفافيش مصاصة الدماء روبوتات خيالية من المستقبل."
    },
    "category": "horror",
    "difficulty": "medium",
    "tags": [
      "bats",
      "vampire"
    ],
    "similarityGroup": "vampire_bats"
  },
  {
    "id": "tf_halloween_oct31_true",
    "answer": "true",
    "statement": {
      "en": "Halloween is commonly celebrated on October 31.",
      "ar": "يُحتفل بالهالوين عادةً في 31 أكتوبر."
    },
    "category": "horror",
    "difficulty": "easy",
    "tags": [
      "halloween",
      "date"
    ],
    "similarityGroup": "halloween_oct31"
  },
  {
    "id": "tf_halloween_oct31_fake",
    "answer": "fake",
    "statement": {
      "en": "Halloween is commonly celebrated on February 31.",
      "ar": "يُحتفل بالهالوين عادةً في 31 فبراير."
    },
    "category": "horror",
    "difficulty": "easy",
    "tags": [
      "halloween",
      "date"
    ],
    "similarityGroup": "halloween_oct31"
  },
  {
    "id": "tf_bats_blind_true",
    "answer": "true",
    "statement": {
      "en": "Bats are not completely blind.",
      "ar": "الخفافيش ليست عمياء تمامًا."
    },
    "category": "horror",
    "difficulty": "easy",
    "tags": [
      "bats",
      "myth"
    ],
    "similarityGroup": "bats_blind"
  },
  {
    "id": "tf_bats_blind_fake",
    "answer": "fake",
    "statement": {
      "en": "All bats are completely blind and have no eyes.",
      "ar": "كل الخفافيش عمياء تمامًا ولا تملك عيونًا."
    },
    "category": "horror",
    "difficulty": "easy",
    "tags": [
      "bats",
      "myth"
    ],
    "similarityGroup": "bats_blind"
  },
  {
    "id": "tf_pumpkin_fruit_true",
    "answer": "true",
    "statement": {
      "en": "A pumpkin is botanically a fruit.",
      "ar": "اليقطين من الناحية النباتية ثمرة."
    },
    "category": "horror",
    "difficulty": "easy",
    "tags": [
      "pumpkin",
      "food"
    ],
    "similarityGroup": "pumpkin_fruit"
  },
  {
    "id": "tf_pumpkin_fruit_fake",
    "answer": "fake",
    "statement": {
      "en": "A pumpkin is a type of metal.",
      "ar": "اليقطين نوع من المعادن."
    },
    "category": "horror",
    "difficulty": "easy",
    "tags": [
      "pumpkin",
      "food"
    ],
    "similarityGroup": "pumpkin_fruit"
  },
  {
    "id": "tf_venus_hotter_than_mercury_true",
    "answer": "true",
    "statement": {
      "en": "Venus is hotter on average than Mercury.",
      "ar": "الزهرة أسخن في المتوسط من عطارد."
    },
    "category": "space",
    "difficulty": "easy",
    "tags": [
      "planets",
      "temperature"
    ],
    "similarityGroup": "venus_hotter_than_mercury"
  },
  {
    "id": "tf_venus_hotter_than_mercury_fake",
    "answer": "fake",
    "statement": {
      "en": "Mercury is always the hottest planet because it is closest to the Sun.",
      "ar": "عطارد هو دائمًا أسخن كوكب لأنه الأقرب إلى الشمس."
    },
    "category": "space",
    "difficulty": "easy",
    "tags": [
      "planets",
      "temperature"
    ],
    "similarityGroup": "venus_hotter_than_mercury"
  },
  {
    "id": "tf_mars_red_planet_true",
    "answer": "true",
    "statement": {
      "en": "Mars is often called the Red Planet.",
      "ar": "المريخ يُسمى غالبًا الكوكب الأحمر."
    },
    "category": "space",
    "difficulty": "easy",
    "tags": [
      "mars",
      "planets"
    ],
    "similarityGroup": "mars_red_planet"
  },
  {
    "id": "tf_mars_red_planet_fake",
    "answer": "fake",
    "statement": {
      "en": "Mars is often called the Blue Planet.",
      "ar": "المريخ يُسمى غالبًا الكوكب الأزرق."
    },
    "category": "space",
    "difficulty": "easy",
    "tags": [
      "mars",
      "planets"
    ],
    "similarityGroup": "mars_red_planet"
  },
  {
    "id": "tf_jupiter_largest_planet_true",
    "answer": "true",
    "statement": {
      "en": "Jupiter is the largest planet in the Solar System.",
      "ar": "المشتري هو أكبر كوكب في المجموعة الشمسية."
    },
    "category": "space",
    "difficulty": "easy",
    "tags": [
      "jupiter",
      "planets"
    ],
    "similarityGroup": "jupiter_largest_planet"
  },
  {
    "id": "tf_jupiter_largest_planet_fake",
    "answer": "fake",
    "statement": {
      "en": "Earth is the largest planet in the Solar System.",
      "ar": "الأرض هي أكبر كوكب في المجموعة الشمسية."
    },
    "category": "space",
    "difficulty": "easy",
    "tags": [
      "jupiter",
      "planets"
    ],
    "similarityGroup": "jupiter_largest_planet"
  },
  {
    "id": "tf_saturn_rings_visible_true",
    "answer": "true",
    "statement": {
      "en": "Saturn is famous for its large ring system.",
      "ar": "زحل مشهور بنظام حلقاته الكبير."
    },
    "category": "space",
    "difficulty": "easy",
    "tags": [
      "saturn",
      "rings"
    ],
    "similarityGroup": "saturn_rings_visible"
  },
  {
    "id": "tf_saturn_rings_visible_fake",
    "answer": "fake",
    "statement": {
      "en": "Saturn is the only planet with no rings at all.",
      "ar": "زحل هو الكوكب الوحيد الذي لا يملك حلقات إطلاقًا."
    },
    "category": "space",
    "difficulty": "easy",
    "tags": [
      "saturn",
      "rings"
    ],
    "similarityGroup": "saturn_rings_visible"
  },
  {
    "id": "tf_moon_reflects_sunlight_true",
    "answer": "true",
    "statement": {
      "en": "The Moon shines mainly by reflecting sunlight.",
      "ar": "القمر يضيء أساسًا لأنه يعكس ضوء الشمس."
    },
    "category": "space",
    "difficulty": "easy",
    "tags": [
      "moon",
      "light"
    ],
    "similarityGroup": "moon_reflects_sunlight"
  },
  {
    "id": "tf_moon_reflects_sunlight_fake",
    "answer": "fake",
    "statement": {
      "en": "The Moon produces its own light like a small star.",
      "ar": "القمر ينتج ضوءه بنفسه مثل نجم صغير."
    },
    "category": "space",
    "difficulty": "easy",
    "tags": [
      "moon",
      "light"
    ],
    "similarityGroup": "moon_reflects_sunlight"
  },
  {
    "id": "tf_earth_roughly_spherical_true",
    "answer": "true",
    "statement": {
      "en": "Earth is roughly spherical, not flat.",
      "ar": "الأرض شبه كروية وليست مسطحة."
    },
    "category": "space",
    "difficulty": "easy",
    "tags": [
      "earth",
      "shape"
    ],
    "similarityGroup": "earth_roughly_spherical"
  },
  {
    "id": "tf_earth_roughly_spherical_fake",
    "answer": "fake",
    "statement": {
      "en": "Earth is a perfectly flat disk.",
      "ar": "الأرض قرص مسطح تمامًا."
    },
    "category": "space",
    "difficulty": "easy",
    "tags": [
      "earth",
      "shape"
    ],
    "similarityGroup": "earth_roughly_spherical"
  },
  {
    "id": "tf_sun_is_star_true",
    "answer": "true",
    "statement": {
      "en": "The Sun is a star.",
      "ar": "الشمس نجم."
    },
    "category": "space",
    "difficulty": "easy",
    "tags": [
      "sun",
      "stars"
    ],
    "similarityGroup": "sun_is_star"
  },
  {
    "id": "tf_sun_is_star_fake",
    "answer": "fake",
    "statement": {
      "en": "The Sun is a planet.",
      "ar": "الشمس كوكب."
    },
    "category": "space",
    "difficulty": "easy",
    "tags": [
      "sun",
      "stars"
    ],
    "similarityGroup": "sun_is_star"
  },
  {
    "id": "tf_water_boils_100_sea_level_true",
    "answer": "true",
    "statement": {
      "en": "Pure water boils at about 100°C at sea level.",
      "ar": "الماء النقي يغلي عند حوالي 100 درجة مئوية عند مستوى سطح البحر."
    },
    "category": "science",
    "difficulty": "easy",
    "tags": [
      "water",
      "temperature"
    ],
    "similarityGroup": "water_boils_100_sea_level"
  },
  {
    "id": "tf_water_boils_100_sea_level_fake",
    "answer": "fake",
    "statement": {
      "en": "Pure water boils at about 10°C at sea level.",
      "ar": "الماء النقي يغلي عند حوالي 10 درجات مئوية عند مستوى سطح البحر."
    },
    "category": "science",
    "difficulty": "easy",
    "tags": [
      "water",
      "temperature"
    ],
    "similarityGroup": "water_boils_100_sea_level"
  },
  {
    "id": "tf_ice_less_dense_than_water_true",
    "answer": "true",
    "statement": {
      "en": "Ice is less dense than liquid water, so it can float.",
      "ar": "الجليد أقل كثافة من الماء السائل لذلك يمكنه الطفو."
    },
    "category": "science",
    "difficulty": "easy",
    "tags": [
      "ice",
      "density"
    ],
    "similarityGroup": "ice_less_dense_than_water"
  },
  {
    "id": "tf_ice_less_dense_than_water_fake",
    "answer": "fake",
    "statement": {
      "en": "Ice is much denser than liquid water, so it always sinks.",
      "ar": "الجليد أكثر كثافة بكثير من الماء السائل لذلك يغرق دائمًا."
    },
    "category": "science",
    "difficulty": "easy",
    "tags": [
      "ice",
      "density"
    ],
    "similarityGroup": "ice_less_dense_than_water"
  },
  {
    "id": "tf_sound_needs_medium_true",
    "answer": "true",
    "statement": {
      "en": "Sound needs a medium such as air, water, or solid material to travel.",
      "ar": "الصوت يحتاج وسطًا مثل الهواء أو الماء أو مادة صلبة لينتقل."
    },
    "category": "science",
    "difficulty": "easy",
    "tags": [
      "sound",
      "physics"
    ],
    "similarityGroup": "sound_needs_medium"
  },
  {
    "id": "tf_sound_needs_medium_fake",
    "answer": "fake",
    "statement": {
      "en": "Sound travels perfectly through empty space.",
      "ar": "الصوت ينتقل بشكل مثالي في الفراغ التام."
    },
    "category": "science",
    "difficulty": "easy",
    "tags": [
      "sound",
      "physics"
    ],
    "similarityGroup": "sound_needs_medium"
  },
  {
    "id": "tf_magnets_have_poles_true",
    "answer": "true",
    "statement": {
      "en": "Magnets have north and south poles.",
      "ar": "للمغناطيس قطبان شمالي وجنوبي."
    },
    "category": "science",
    "difficulty": "easy",
    "tags": [
      "magnets",
      "physics"
    ],
    "similarityGroup": "magnets_have_poles"
  },
  {
    "id": "tf_magnets_have_poles_fake",
    "answer": "fake",
    "statement": {
      "en": "Magnets have only one pole.",
      "ar": "المغناطيس له قطب واحد فقط."
    },
    "category": "science",
    "difficulty": "easy",
    "tags": [
      "magnets",
      "physics"
    ],
    "similarityGroup": "magnets_have_poles"
  },
  {
    "id": "tf_plants_need_light_true",
    "answer": "true",
    "statement": {
      "en": "Most green plants need light for photosynthesis.",
      "ar": "معظم النباتات الخضراء تحتاج الضوء لعملية البناء الضوئي."
    },
    "category": "science",
    "difficulty": "easy",
    "tags": [
      "plants",
      "photosynthesis"
    ],
    "similarityGroup": "plants_need_light"
  },
  {
    "id": "tf_plants_need_light_fake",
    "answer": "fake",
    "statement": {
      "en": "Most green plants grow normally without any light forever.",
      "ar": "معظم النباتات الخضراء تنمو طبيعيًا إلى الأبد بدون أي ضوء."
    },
    "category": "science",
    "difficulty": "easy",
    "tags": [
      "plants",
      "photosynthesis"
    ],
    "similarityGroup": "plants_need_light"
  },
  {
    "id": "tf_human_adult_206_bones_true",
    "answer": "true",
    "statement": {
      "en": "An adult human body has about 206 bones.",
      "ar": "جسم الإنسان البالغ يحتوي على حوالي 206 عظمة."
    },
    "category": "science",
    "difficulty": "easy",
    "tags": [
      "human_body",
      "bones"
    ],
    "similarityGroup": "human_adult_206_bones"
  },
  {
    "id": "tf_human_adult_206_bones_fake",
    "answer": "fake",
    "statement": {
      "en": "An adult human body has about 20 bones.",
      "ar": "جسم الإنسان البالغ يحتوي على حوالي 20 عظمة."
    },
    "category": "science",
    "difficulty": "easy",
    "tags": [
      "human_body",
      "bones"
    ],
    "similarityGroup": "human_adult_206_bones"
  },
  {
    "id": "tf_heart_pumps_blood_true",
    "answer": "true",
    "statement": {
      "en": "The human heart pumps blood through the body.",
      "ar": "القلب البشري يضخ الدم في الجسم."
    },
    "category": "science",
    "difficulty": "easy",
    "tags": [
      "human_body",
      "heart"
    ],
    "similarityGroup": "heart_pumps_blood"
  },
  {
    "id": "tf_heart_pumps_blood_fake",
    "answer": "fake",
    "statement": {
      "en": "The human heart mainly digests food.",
      "ar": "القلب البشري وظيفته الأساسية هضم الطعام."
    },
    "category": "science",
    "difficulty": "easy",
    "tags": [
      "human_body",
      "heart"
    ],
    "similarityGroup": "heart_pumps_blood"
  },
  {
    "id": "tf_brain_controls_body_true",
    "answer": "true",
    "statement": {
      "en": "The brain helps control the body and process information.",
      "ar": "الدماغ يساعد في التحكم بالجسم ومعالجة المعلومات."
    },
    "category": "science",
    "difficulty": "easy",
    "tags": [
      "human_body",
      "brain"
    ],
    "similarityGroup": "brain_controls_body"
  },
  {
    "id": "tf_brain_controls_body_fake",
    "answer": "fake",
    "statement": {
      "en": "The brain only stores water and has no role in control.",
      "ar": "الدماغ يخزن الماء فقط ولا دور له في التحكم."
    },
    "category": "science",
    "difficulty": "easy",
    "tags": [
      "human_body",
      "brain"
    ],
    "similarityGroup": "brain_controls_body"
  },
  {
    "id": "tf_bees_make_honey_true",
    "answer": "true",
    "statement": {
      "en": "Honeybees make honey.",
      "ar": "نحل العسل يصنع العسل."
    },
    "category": "animals",
    "difficulty": "easy",
    "tags": [
      "bees",
      "honey"
    ],
    "similarityGroup": "bees_make_honey"
  },
  {
    "id": "tf_bees_make_honey_fake",
    "answer": "fake",
    "statement": {
      "en": "Honeybees make plastic inside the hive.",
      "ar": "نحل العسل يصنع البلاستيك داخل الخلية."
    },
    "category": "animals",
    "difficulty": "easy",
    "tags": [
      "bees",
      "honey"
    ],
    "similarityGroup": "bees_make_honey"
  },
  {
    "id": "tf_penguins_birds_true",
    "answer": "true",
    "statement": {
      "en": "Penguins are birds, even though most species cannot fly.",
      "ar": "البطاريق طيور رغم أن معظم الأنواع لا تطير."
    },
    "category": "animals",
    "difficulty": "easy",
    "tags": [
      "penguins",
      "birds"
    ],
    "similarityGroup": "penguins_birds"
  },
  {
    "id": "tf_penguins_birds_fake",
    "answer": "fake",
    "statement": {
      "en": "Penguins are fish because they swim.",
      "ar": "البطاريق أسماك لأنها تسبح."
    },
    "category": "animals",
    "difficulty": "easy",
    "tags": [
      "penguins",
      "birds"
    ],
    "similarityGroup": "penguins_birds"
  },
  {
    "id": "tf_whales_mammals_true",
    "answer": "true",
    "statement": {
      "en": "Whales are mammals.",
      "ar": "الحيتان ثدييات."
    },
    "category": "animals",
    "difficulty": "easy",
    "tags": [
      "whales",
      "mammals"
    ],
    "similarityGroup": "whales_mammals"
  },
  {
    "id": "tf_whales_mammals_fake",
    "answer": "fake",
    "statement": {
      "en": "Whales are insects.",
      "ar": "الحيتان حشرات."
    },
    "category": "animals",
    "difficulty": "easy",
    "tags": [
      "whales",
      "mammals"
    ],
    "similarityGroup": "whales_mammals"
  },
  {
    "id": "tf_sharks_fish_true",
    "answer": "true",
    "statement": {
      "en": "Sharks are fish.",
      "ar": "أسماك القرش من الأسماك."
    },
    "category": "animals",
    "difficulty": "easy",
    "tags": [
      "sharks",
      "fish"
    ],
    "similarityGroup": "sharks_fish"
  },
  {
    "id": "tf_sharks_fish_fake",
    "answer": "fake",
    "statement": {
      "en": "Sharks are reptiles.",
      "ar": "أسماك القرش من الزواحف."
    },
    "category": "animals",
    "difficulty": "easy",
    "tags": [
      "sharks",
      "fish"
    ],
    "similarityGroup": "sharks_fish"
  },
  {
    "id": "tf_butterflies_insects_true",
    "answer": "true",
    "statement": {
      "en": "Butterflies are insects.",
      "ar": "الفراشات حشرات."
    },
    "category": "animals",
    "difficulty": "easy",
    "tags": [
      "butterflies",
      "insects"
    ],
    "similarityGroup": "butterflies_insects"
  },
  {
    "id": "tf_butterflies_insects_fake",
    "answer": "fake",
    "statement": {
      "en": "Butterflies are mammals with wings.",
      "ar": "الفراشات ثدييات لها أجنحة."
    },
    "category": "animals",
    "difficulty": "easy",
    "tags": [
      "butterflies",
      "insects"
    ],
    "similarityGroup": "butterflies_insects"
  },
  {
    "id": "tf_spiders_eight_legs_true",
    "answer": "true",
    "statement": {
      "en": "Spiders usually have eight legs.",
      "ar": "العناكب عادةً لها ثمانية أرجل."
    },
    "category": "animals",
    "difficulty": "easy",
    "tags": [
      "spiders",
      "legs"
    ],
    "similarityGroup": "spiders_eight_legs"
  },
  {
    "id": "tf_spiders_eight_legs_fake",
    "answer": "fake",
    "statement": {
      "en": "Spiders usually have six legs like insects.",
      "ar": "العناكب عادةً لها ست أرجل مثل الحشرات."
    },
    "category": "animals",
    "difficulty": "easy",
    "tags": [
      "spiders",
      "legs"
    ],
    "similarityGroup": "spiders_eight_legs"
  },
  {
    "id": "tf_giraffe_long_neck_true",
    "answer": "true",
    "statement": {
      "en": "Giraffes are known for their long necks.",
      "ar": "الزرافات معروفة بأعناقها الطويلة."
    },
    "category": "animals",
    "difficulty": "easy",
    "tags": [
      "giraffes",
      "neck"
    ],
    "similarityGroup": "giraffe_long_neck"
  },
  {
    "id": "tf_giraffe_long_neck_fake",
    "answer": "fake",
    "statement": {
      "en": "Giraffes are known for having no neck at all.",
      "ar": "الزرافات معروفة بأنها بلا رقبة إطلاقًا."
    },
    "category": "animals",
    "difficulty": "easy",
    "tags": [
      "giraffes",
      "neck"
    ],
    "similarityGroup": "giraffe_long_neck"
  },
  {
    "id": "tf_camel_desert_adaptation_true",
    "answer": "true",
    "statement": {
      "en": "Camels are well adapted to dry desert environments.",
      "ar": "الجمال متكيفة جيدًا مع بيئات الصحراء الجافة."
    },
    "category": "animals",
    "difficulty": "easy",
    "tags": [
      "camels",
      "desert"
    ],
    "similarityGroup": "camel_desert_adaptation"
  },
  {
    "id": "tf_camel_desert_adaptation_fake",
    "answer": "fake",
    "statement": {
      "en": "Camels can only survive in icy oceans.",
      "ar": "الجمال لا تعيش إلا في المحيطات الجليدية."
    },
    "category": "animals",
    "difficulty": "easy",
    "tags": [
      "camels",
      "desert"
    ],
    "similarityGroup": "camel_desert_adaptation"
  },
  {
    "id": "tf_pizza_from_italy_true",
    "answer": "true",
    "statement": {
      "en": "Pizza is strongly associated with Italian cuisine.",
      "ar": "البيتزا مرتبطة بقوة بالمطبخ الإيطالي."
    },
    "category": "food",
    "difficulty": "easy",
    "tags": [
      "pizza",
      "italy"
    ],
    "similarityGroup": "pizza_from_italy"
  },
  {
    "id": "tf_pizza_from_italy_fake",
    "answer": "fake",
    "statement": {
      "en": "Pizza is traditionally a type of ancient computer.",
      "ar": "البيتزا تقليديًا نوع من أجهزة الكمبيوتر القديمة."
    },
    "category": "food",
    "difficulty": "easy",
    "tags": [
      "pizza",
      "italy"
    ],
    "similarityGroup": "pizza_from_italy"
  },
  {
    "id": "tf_sushi_japan_true",
    "answer": "true",
    "statement": {
      "en": "Sushi is strongly associated with Japanese cuisine.",
      "ar": "السوشي مرتبط بقوة بالمطبخ الياباني."
    },
    "category": "food",
    "difficulty": "easy",
    "tags": [
      "sushi",
      "japan"
    ],
    "similarityGroup": "sushi_japan"
  },
  {
    "id": "tf_sushi_japan_fake",
    "answer": "fake",
    "statement": {
      "en": "Sushi is a traditional Egyptian dessert made only of sugar.",
      "ar": "السوشي حلوى مصرية تقليدية مصنوعة فقط من السكر."
    },
    "category": "food",
    "difficulty": "easy",
    "tags": [
      "sushi",
      "japan"
    ],
    "similarityGroup": "sushi_japan"
  },
  {
    "id": "tf_rice_grain_true",
    "answer": "true",
    "statement": {
      "en": "Rice is a grain.",
      "ar": "الأرز من الحبوب."
    },
    "category": "food",
    "difficulty": "easy",
    "tags": [
      "rice",
      "grain"
    ],
    "similarityGroup": "rice_grain"
  },
  {
    "id": "tf_rice_grain_fake",
    "answer": "fake",
    "statement": {
      "en": "Rice is a type of metal.",
      "ar": "الأرز نوع من المعادن."
    },
    "category": "food",
    "difficulty": "easy",
    "tags": [
      "rice",
      "grain"
    ],
    "similarityGroup": "rice_grain"
  },
  {
    "id": "tf_bread_flour_true",
    "answer": "true",
    "statement": {
      "en": "Bread is commonly made from flour and water.",
      "ar": "الخبز غالبًا يُصنع من الدقيق والماء."
    },
    "category": "food",
    "difficulty": "easy",
    "tags": [
      "bread",
      "flour"
    ],
    "similarityGroup": "bread_flour"
  },
  {
    "id": "tf_bread_flour_fake",
    "answer": "fake",
    "statement": {
      "en": "Bread is commonly made from glass and sand.",
      "ar": "الخبز غالبًا يُصنع من الزجاج والرمل."
    },
    "category": "food",
    "difficulty": "easy",
    "tags": [
      "bread",
      "flour"
    ],
    "similarityGroup": "bread_flour"
  },
  {
    "id": "tf_coffee_beans_true",
    "answer": "true",
    "statement": {
      "en": "Coffee is commonly made from roasted coffee beans.",
      "ar": "القهوة تُصنع غالبًا من حبوب البن المحمصة."
    },
    "category": "food",
    "difficulty": "easy",
    "tags": [
      "coffee",
      "beans"
    ],
    "similarityGroup": "coffee_beans"
  },
  {
    "id": "tf_coffee_beans_fake",
    "answer": "fake",
    "statement": {
      "en": "Coffee is commonly made from melted plastic.",
      "ar": "القهوة تُصنع غالبًا من البلاستيك المذاب."
    },
    "category": "food",
    "difficulty": "easy",
    "tags": [
      "coffee",
      "beans"
    ],
    "similarityGroup": "coffee_beans"
  },
  {
    "id": "tf_tokyo_capital_japan_true",
    "answer": "true",
    "statement": {
      "en": "Tokyo is the capital of Japan.",
      "ar": "طوكيو هي عاصمة اليابان."
    },
    "category": "geography",
    "difficulty": "easy",
    "tags": [
      "capital",
      "japan"
    ],
    "similarityGroup": "tokyo_capital_japan"
  },
  {
    "id": "tf_tokyo_capital_japan_fake",
    "answer": "fake",
    "statement": {
      "en": "Osaka is the capital of Japan.",
      "ar": "أوساكا هي عاصمة اليابان."
    },
    "category": "geography",
    "difficulty": "easy",
    "tags": [
      "capital",
      "japan"
    ],
    "similarityGroup": "tokyo_capital_japan"
  },
  {
    "id": "tf_cairo_capital_egypt_true",
    "answer": "true",
    "statement": {
      "en": "Cairo is the capital of Egypt.",
      "ar": "القاهرة هي عاصمة مصر."
    },
    "category": "geography",
    "difficulty": "easy",
    "tags": [
      "capital",
      "egypt"
    ],
    "similarityGroup": "cairo_capital_egypt"
  },
  {
    "id": "tf_cairo_capital_egypt_fake",
    "answer": "fake",
    "statement": {
      "en": "Alexandria is the capital of Egypt.",
      "ar": "الإسكندرية هي عاصمة مصر."
    },
    "category": "geography",
    "difficulty": "easy",
    "tags": [
      "capital",
      "egypt"
    ],
    "similarityGroup": "cairo_capital_egypt"
  },
  {
    "id": "tf_paris_capital_france_true",
    "answer": "true",
    "statement": {
      "en": "Paris is the capital of France.",
      "ar": "باريس هي عاصمة فرنسا."
    },
    "category": "geography",
    "difficulty": "easy",
    "tags": [
      "capital",
      "france"
    ],
    "similarityGroup": "paris_capital_france"
  },
  {
    "id": "tf_paris_capital_france_fake",
    "answer": "fake",
    "statement": {
      "en": "Lyon is the capital of France.",
      "ar": "ليون هي عاصمة فرنسا."
    },
    "category": "geography",
    "difficulty": "easy",
    "tags": [
      "capital",
      "france"
    ],
    "similarityGroup": "paris_capital_france"
  },
  {
    "id": "tf_rome_capital_italy_true",
    "answer": "true",
    "statement": {
      "en": "Rome is the capital of Italy.",
      "ar": "روما هي عاصمة إيطاليا."
    },
    "category": "geography",
    "difficulty": "easy",
    "tags": [
      "capital",
      "italy"
    ],
    "similarityGroup": "rome_capital_italy"
  },
  {
    "id": "tf_rome_capital_italy_fake",
    "answer": "fake",
    "statement": {
      "en": "Milan is the capital of Italy.",
      "ar": "ميلانو هي عاصمة إيطاليا."
    },
    "category": "geography",
    "difficulty": "easy",
    "tags": [
      "capital",
      "italy"
    ],
    "similarityGroup": "rome_capital_italy"
  },
  {
    "id": "tf_amazon_river_south_america_true",
    "answer": "true",
    "statement": {
      "en": "The Amazon River is in South America.",
      "ar": "نهر الأمازون يقع في أمريكا الجنوبية."
    },
    "category": "geography",
    "difficulty": "easy",
    "tags": [
      "rivers",
      "amazon"
    ],
    "similarityGroup": "amazon_river_south_america"
  },
  {
    "id": "tf_amazon_river_south_america_fake",
    "answer": "fake",
    "statement": {
      "en": "The Amazon River is in Antarctica.",
      "ar": "نهر الأمازون يقع في القارة القطبية الجنوبية."
    },
    "category": "geography",
    "difficulty": "easy",
    "tags": [
      "rivers",
      "amazon"
    ],
    "similarityGroup": "amazon_river_south_america"
  },
  {
    "id": "tf_sahara_africa_true",
    "answer": "true",
    "statement": {
      "en": "The Sahara Desert is in Africa.",
      "ar": "الصحراء الكبرى تقع في أفريقيا."
    },
    "category": "geography",
    "difficulty": "easy",
    "tags": [
      "desert",
      "africa"
    ],
    "similarityGroup": "sahara_africa"
  },
  {
    "id": "tf_sahara_africa_fake",
    "answer": "fake",
    "statement": {
      "en": "The Sahara Desert is in northern Europe.",
      "ar": "الصحراء الكبرى تقع في شمال أوروبا."
    },
    "category": "geography",
    "difficulty": "easy",
    "tags": [
      "desert",
      "africa"
    ],
    "similarityGroup": "sahara_africa"
  },
  {
    "id": "tf_nile_africa_true",
    "answer": "true",
    "statement": {
      "en": "The Nile River flows through northeastern Africa.",
      "ar": "نهر النيل يجري في شمال شرق أفريقيا."
    },
    "category": "geography",
    "difficulty": "easy",
    "tags": [
      "nile",
      "africa"
    ],
    "similarityGroup": "nile_africa"
  },
  {
    "id": "tf_nile_africa_fake",
    "answer": "fake",
    "statement": {
      "en": "The Nile River flows through the Moon.",
      "ar": "نهر النيل يجري على سطح القمر."
    },
    "category": "geography",
    "difficulty": "easy",
    "tags": [
      "nile",
      "africa"
    ],
    "similarityGroup": "nile_africa"
  },
  {
    "id": "tf_everest_himalayas_true",
    "answer": "true",
    "statement": {
      "en": "Mount Everest is in the Himalayas.",
      "ar": "جبل إيفرست يقع في جبال الهيمالايا."
    },
    "category": "geography",
    "difficulty": "easy",
    "tags": [
      "mountains",
      "everest"
    ],
    "similarityGroup": "everest_himalayas"
  },
  {
    "id": "tf_everest_himalayas_fake",
    "answer": "fake",
    "statement": {
      "en": "Mount Everest is in the Sahara Desert.",
      "ar": "جبل إيفرست يقع في الصحراء الكبرى."
    },
    "category": "geography",
    "difficulty": "easy",
    "tags": [
      "mountains",
      "everest"
    ],
    "similarityGroup": "everest_himalayas"
  },
  {
    "id": "tf_alphabet_english_26_true",
    "answer": "true",
    "statement": {
      "en": "The modern English alphabet has 26 letters.",
      "ar": "الأبجدية الإنجليزية الحديثة تحتوي على 26 حرفًا."
    },
    "category": "language",
    "difficulty": "easy",
    "tags": [
      "english",
      "alphabet"
    ],
    "similarityGroup": "alphabet_english_26"
  },
  {
    "id": "tf_alphabet_english_26_fake",
    "answer": "fake",
    "statement": {
      "en": "The modern English alphabet has 260 letters.",
      "ar": "الأبجدية الإنجليزية الحديثة تحتوي على 260 حرفًا."
    },
    "category": "language",
    "difficulty": "easy",
    "tags": [
      "english",
      "alphabet"
    ],
    "similarityGroup": "alphabet_english_26"
  },
  {
    "id": "tf_arabic_written_right_to_left_true",
    "answer": "true",
    "statement": {
      "en": "Arabic is written from right to left.",
      "ar": "العربية تُكتب من اليمين إلى اليسار."
    },
    "category": "language",
    "difficulty": "easy",
    "tags": [
      "arabic",
      "writing"
    ],
    "similarityGroup": "arabic_written_right_to_left"
  },
  {
    "id": "tf_arabic_written_right_to_left_fake",
    "answer": "fake",
    "statement": {
      "en": "Arabic is always written from bottom to top.",
      "ar": "العربية تُكتب دائمًا من الأسفل إلى الأعلى."
    },
    "category": "language",
    "difficulty": "easy",
    "tags": [
      "arabic",
      "writing"
    ],
    "similarityGroup": "arabic_written_right_to_left"
  },
  {
    "id": "tf_spanish_romance_language_true",
    "answer": "true",
    "statement": {
      "en": "Spanish is a Romance language.",
      "ar": "الإسبانية من اللغات الرومانسية."
    },
    "category": "language",
    "difficulty": "easy",
    "tags": [
      "spanish",
      "language_family"
    ],
    "similarityGroup": "spanish_romance_language"
  },
  {
    "id": "tf_spanish_romance_language_fake",
    "answer": "fake",
    "statement": {
      "en": "Spanish is a programming language only used by robots.",
      "ar": "الإسبانية لغة برمجة لا يستخدمها إلا الروبوتات."
    },
    "category": "language",
    "difficulty": "easy",
    "tags": [
      "spanish",
      "language_family"
    ],
    "similarityGroup": "spanish_romance_language"
  },
  {
    "id": "tf_chess_king_important_true",
    "answer": "true",
    "statement": {
      "en": "In chess, the king is the piece that must be protected from checkmate.",
      "ar": "في الشطرنج، الملك هو القطعة التي يجب حمايتها من الكش مات."
    },
    "category": "games",
    "difficulty": "easy",
    "tags": [
      "chess",
      "rules"
    ],
    "similarityGroup": "chess_king_important"
  },
  {
    "id": "tf_chess_king_important_fake",
    "answer": "fake",
    "statement": {
      "en": "In chess, the king is removed before the game begins.",
      "ar": "في الشطرنج، يتم إزالة الملك قبل بداية اللعبة."
    },
    "category": "games",
    "difficulty": "easy",
    "tags": [
      "chess",
      "rules"
    ],
    "similarityGroup": "chess_king_important"
  },
  {
    "id": "tf_chess_board_64_true",
    "answer": "true",
    "statement": {
      "en": "A standard chessboard has 64 squares.",
      "ar": "رقعة الشطرنج القياسية فيها 64 مربعًا."
    },
    "category": "games",
    "difficulty": "easy",
    "tags": [
      "chess",
      "board"
    ],
    "similarityGroup": "chess_board_64"
  },
  {
    "id": "tf_chess_board_64_fake",
    "answer": "fake",
    "statement": {
      "en": "رقعة الشطرنج القياسية فيها 63 مربعًا.",
      "ar": "رقعة الشطرنج القياسية فيها 63 مربعًا."
    },
    "category": "games",
    "difficulty": "easy",
    "tags": [
      "chess",
      "board"
    ],
    "similarityGroup": "chess_board_64"
  },
  {
    "id": "tf_soccer_team_11_true",
    "answer": "true",
    "statement": {
      "en": "A standard association football team has 11 players on the field.",
      "ar": "فريق كرة القدم القياسي يضم 11 لاعبًا في الملعب."
    },
    "category": "sports",
    "difficulty": "easy",
    "tags": [
      "football",
      "rules"
    ],
    "similarityGroup": "soccer_team_11"
  },
  {
    "id": "tf_soccer_team_11_fake",
    "answer": "fake",
    "statement": {
      "en": "فريق كرة القدم القياسي يضم 3 لاعبين فقط في الملعب.",
      "ar": "فريق كرة القدم القياسي يضم 3 لاعبين فقط في الملعب."
    },
    "category": "sports",
    "difficulty": "easy",
    "tags": [
      "football",
      "rules"
    ],
    "similarityGroup": "soccer_team_11"
  },
  {
    "id": "tf_basketball_hoop_height_true",
    "answer": "true",
    "statement": {
      "en": "A standard basketball hoop is 10 feet high.",
      "ar": "ارتفاع سلة كرة السلة القياسية 10 أقدام."
    },
    "category": "sports",
    "difficulty": "easy",
    "tags": [
      "basketball",
      "rules"
    ],
    "similarityGroup": "basketball_hoop_height"
  },
  {
    "id": "tf_basketball_hoop_height_fake",
    "answer": "fake",
    "statement": {
      "en": "ارتفاع سلة كرة السلة القياسية قدم واحد فقط.",
      "ar": "ارتفاع سلة كرة السلة القياسية قدم واحد فقط."
    },
    "category": "sports",
    "difficulty": "easy",
    "tags": [
      "basketball",
      "rules"
    ],
    "similarityGroup": "basketball_hoop_height"
  },
  {
    "id": "tf_tennis_love_zero_true",
    "answer": "true",
    "statement": {
      "en": "In tennis scoring, love means zero.",
      "ar": "في نقاط التنس، كلمة love تعني صفر."
    },
    "category": "sports",
    "difficulty": "easy",
    "tags": [
      "tennis",
      "scoring"
    ],
    "similarityGroup": "tennis_love_zero"
  },
  {
    "id": "tf_tennis_love_zero_fake",
    "answer": "fake",
    "statement": {
      "en": "In tennis scoring, love means ten points.",
      "ar": "في نقاط التنس، كلمة love تعني عشر نقاط."
    },
    "category": "sports",
    "difficulty": "easy",
    "tags": [
      "tennis",
      "scoring"
    ],
    "similarityGroup": "tennis_love_zero"
  },
  {
    "id": "tf_olympic_rings_five_true",
    "answer": "true",
    "statement": {
      "en": "The Olympic symbol has five interlocking rings.",
      "ar": "رمز الأولمبياد يحتوي على خمس حلقات متداخلة."
    },
    "category": "sports",
    "difficulty": "easy",
    "tags": [
      "olympics",
      "symbol"
    ],
    "similarityGroup": "olympic_rings_five"
  },
  {
    "id": "tf_olympic_rings_five_fake",
    "answer": "fake",
    "statement": {
      "en": "رمز الأولمبياد يحتوي على حلقة واحدة فقط.",
      "ar": "رمز الأولمبياد يحتوي على حلقة واحدة فقط."
    },
    "category": "sports",
    "difficulty": "easy",
    "tags": [
      "olympics",
      "symbol"
    ],
    "similarityGroup": "olympic_rings_five"
  },
  {
    "id": "tf_email_uses_at_symbol_true",
    "answer": "true",
    "statement": {
      "en": "Email addresses commonly contain the @ symbol.",
      "ar": "عناوين البريد الإلكتروني غالبًا تحتوي على رمز @."
    },
    "category": "internet",
    "difficulty": "easy",
    "tags": [
      "email",
      "symbol"
    ],
    "similarityGroup": "email_uses_at_symbol"
  },
  {
    "id": "tf_email_uses_at_symbol_fake",
    "answer": "fake",
    "statement": {
      "en": "Email addresses cannot contain the @ symbol.",
      "ar": "عناوين البريد الإلكتروني لا يمكن أن تحتوي على رمز @."
    },
    "category": "internet",
    "difficulty": "easy",
    "tags": [
      "email",
      "symbol"
    ],
    "similarityGroup": "email_uses_at_symbol"
  },
  {
    "id": "tf_url_web_address_true",
    "answer": "true",
    "statement": {
      "en": "A URL is a web address.",
      "ar": "الـ URL هو عنوان ويب."
    },
    "category": "internet",
    "difficulty": "easy",
    "tags": [
      "web",
      "url"
    ],
    "similarityGroup": "url_web_address"
  },
  {
    "id": "tf_url_web_address_fake",
    "answer": "fake",
    "statement": {
      "en": "A URL is a type of sandwich.",
      "ar": "الـ URL نوع من الساندويتش."
    },
    "category": "internet",
    "difficulty": "easy",
    "tags": [
      "web",
      "url"
    ],
    "similarityGroup": "url_web_address"
  },
  {
    "id": "tf_html_web_pages_true",
    "answer": "true",
    "statement": {
      "en": "HTML is used to structure web pages.",
      "ar": "HTML تُستخدم لبناء هيكل صفحات الويب."
    },
    "category": "internet",
    "difficulty": "easy",
    "tags": [
      "html",
      "web"
    ],
    "similarityGroup": "html_web_pages"
  },
  {
    "id": "tf_html_web_pages_fake",
    "answer": "fake",
    "statement": {
      "en": "HTML is only used to bake bread.",
      "ar": "HTML تُستخدم فقط لخبز الخبز."
    },
    "category": "internet",
    "difficulty": "easy",
    "tags": [
      "html",
      "web"
    ],
    "similarityGroup": "html_web_pages"
  },
  {
    "id": "tf_mario_nintendo_true",
    "answer": "true",
    "statement": {
      "en": "Mario is strongly associated with Nintendo.",
      "ar": "ماريو مرتبط بقوة بشركة نينتندو."
    },
    "category": "games",
    "difficulty": "easy",
    "tags": [
      "mario",
      "nintendo"
    ],
    "similarityGroup": "mario_nintendo"
  },
  {
    "id": "tf_mario_nintendo_fake",
    "answer": "fake",
    "statement": {
      "en": "Mario is strongly associated with ancient Roman currency.",
      "ar": "ماريو مرتبط بقوة بعملة رومانية قديمة."
    },
    "category": "games",
    "difficulty": "easy",
    "tags": [
      "mario",
      "nintendo"
    ],
    "similarityGroup": "mario_nintendo"
  },
  {
    "id": "tf_pacman_eats_pellets_true",
    "answer": "true",
    "statement": {
      "en": "Pac-Man is known for eating pellets in a maze.",
      "ar": "باك-مان معروف بأكل النقاط داخل متاهة."
    },
    "category": "games",
    "difficulty": "easy",
    "tags": [
      "pacman",
      "arcade"
    ],
    "similarityGroup": "pacman_eats_pellets"
  },
  {
    "id": "tf_pacman_eats_pellets_fake",
    "answer": "fake",
    "statement": {
      "en": "Pac-Man is known for typing emails in a spreadsheet.",
      "ar": "باك-مان معروف بكتابة الإيميلات داخل جدول بيانات."
    },
    "category": "games",
    "difficulty": "easy",
    "tags": [
      "pacman",
      "arcade"
    ],
    "similarityGroup": "pacman_eats_pellets"
  },
  {
    "id": "tf_vampire_garlic_myth_true",
    "answer": "true",
    "statement": {
      "en": "In many vampire stories, garlic is used to repel vampires.",
      "ar": "في كثير من قصص مصاصي الدماء يُستخدم الثوم لإبعادهم."
    },
    "category": "horror",
    "difficulty": "easy",
    "tags": [
      "vampires",
      "myth"
    ],
    "similarityGroup": "vampire_garlic_myth"
  },
  {
    "id": "tf_vampire_garlic_myth_fake",
    "answer": "fake",
    "statement": {
      "en": "In vampire stories, garlic usually makes vampires stronger.",
      "ar": "في قصص مصاصي الدماء، الثوم عادةً يجعلهم أقوى."
    },
    "category": "horror",
    "difficulty": "easy",
    "tags": [
      "vampires",
      "myth"
    ],
    "similarityGroup": "vampire_garlic_myth"
  },
  {
    "id": "tf_werewolf_full_moon_true",
    "answer": "true",
    "statement": {
      "en": "Werewolves are often linked to the full moon in folklore.",
      "ar": "المستذئبون غالبًا مرتبطون بالبدر في الفلكلور."
    },
    "category": "horror",
    "difficulty": "easy",
    "tags": [
      "werewolves",
      "folklore"
    ],
    "similarityGroup": "werewolf_full_moon"
  },
  {
    "id": "tf_werewolf_full_moon_fake",
    "answer": "fake",
    "statement": {
      "en": "Werewolves are usually linked to calculators in folklore.",
      "ar": "المستذئبون غالبًا مرتبطون بالآلات الحاسبة في الفلكلور."
    },
    "category": "horror",
    "difficulty": "easy",
    "tags": [
      "werewolves",
      "folklore"
    ],
    "similarityGroup": "werewolf_full_moon"
  },
  {
    "id": "tf_mummy_ancient_egypt_true",
    "answer": "true",
    "statement": {
      "en": "Mummies are strongly associated with ancient Egypt in popular culture.",
      "ar": "المومياوات مرتبطة بقوة بمصر القديمة في الثقافة الشعبية."
    },
    "category": "horror",
    "difficulty": "easy",
    "tags": [
      "mummies",
      "egypt"
    ],
    "similarityGroup": "mummy_ancient_egypt"
  },
  {
    "id": "tf_mummy_ancient_egypt_fake",
    "answer": "fake",
    "statement": {
      "en": "Mummies are strongly associated with modern smartphones only.",
      "ar": "المومياوات مرتبطة فقط بالهواتف الذكية الحديثة."
    },
    "category": "horror",
    "difficulty": "easy",
    "tags": [
      "mummies",
      "egypt"
    ],
    "similarityGroup": "mummy_ancient_egypt"
  },
  {
    "id": "tf_ghost_transparent_fiction_true",
    "answer": "true",
    "statement": {
      "en": "Ghosts are often shown as transparent in fiction.",
      "ar": "الأشباح غالبًا تُعرض شفافة في الخيال."
    },
    "category": "horror",
    "difficulty": "easy",
    "tags": [
      "ghosts",
      "fiction"
    ],
    "similarityGroup": "ghost_transparent_fiction"
  },
  {
    "id": "tf_ghost_transparent_fiction_fake",
    "answer": "fake",
    "statement": {
      "en": "Ghosts are usually shown as bicycles in fiction.",
      "ar": "الأشباح عادةً تُعرض كدراجات في الخيال."
    },
    "category": "horror",
    "difficulty": "easy",
    "tags": [
      "ghosts",
      "fiction"
    ],
    "similarityGroup": "ghost_transparent_fiction"
  },
  {
    "id": "tf_mercury_no_moon_true",
    "answer": "true",
    "statement": {
      "en": "Mercury has no natural moons.",
      "ar": "عطارد لا يملك أقمارًا طبيعية."
    },
    "category": "space",
    "difficulty": "medium",
    "tags": [
      "mercury",
      "moons"
    ],
    "similarityGroup": "mercury_no_moon"
  },
  {
    "id": "tf_mercury_no_moon_fake",
    "answer": "fake",
    "statement": {
      "en": "Mercury has more natural moons than Jupiter.",
      "ar": "عطارد يملك أقمارًا طبيعية أكثر من المشتري."
    },
    "category": "space",
    "difficulty": "medium",
    "tags": [
      "mercury",
      "moons"
    ],
    "similarityGroup": "mercury_no_moon"
  },
  {
    "id": "tf_venus_rotates_backward_true",
    "answer": "true",
    "statement": {
      "en": "Venus rotates in the opposite direction to most planets in the Solar System.",
      "ar": "الزهرة يدور عكس اتجاه معظم كواكب المجموعة الشمسية."
    },
    "category": "space",
    "difficulty": "medium",
    "tags": [
      "venus",
      "rotation"
    ],
    "similarityGroup": "venus_rotates_backward"
  },
  {
    "id": "tf_venus_rotates_backward_fake",
    "answer": "fake",
    "statement": {
      "en": "Venus rotates in exactly the same way as Earth with a 24-hour day.",
      "ar": "الزهرة يدور تمامًا مثل الأرض بيوم من 24 ساعة."
    },
    "category": "space",
    "difficulty": "medium",
    "tags": [
      "venus",
      "rotation"
    ],
    "similarityGroup": "venus_rotates_backward"
  },
  {
    "id": "tf_uranus_sideways_true",
    "answer": "true",
    "statement": {
      "en": "Uranus rotates on its side compared with most planets.",
      "ar": "أورانوس يدور على جانبه مقارنة بمعظم الكواكب."
    },
    "category": "space",
    "difficulty": "medium",
    "tags": [
      "uranus",
      "tilt"
    ],
    "similarityGroup": "uranus_sideways"
  },
  {
    "id": "tf_uranus_sideways_fake",
    "answer": "fake",
    "statement": {
      "en": "Uranus has no unusual axial tilt compared with Earth.",
      "ar": "أورانوس لا يملك ميلًا محوريًا غير عادي مقارنة بالأرض."
    },
    "category": "space",
    "difficulty": "medium",
    "tags": [
      "uranus",
      "tilt"
    ],
    "similarityGroup": "uranus_sideways"
  },
  {
    "id": "tf_neptune_winds_true",
    "answer": "true",
    "statement": {
      "en": "Neptune has extremely fast winds.",
      "ar": "نبتون لديه رياح شديدة السرعة."
    },
    "category": "space",
    "difficulty": "medium",
    "tags": [
      "neptune",
      "weather"
    ],
    "similarityGroup": "neptune_winds"
  },
  {
    "id": "tf_neptune_winds_fake",
    "answer": "fake",
    "statement": {
      "en": "Neptune has no atmosphere and therefore no winds.",
      "ar": "نبتون ليس لديه غلاف جوي وبالتالي لا توجد رياح."
    },
    "category": "space",
    "difficulty": "medium",
    "tags": [
      "neptune",
      "weather"
    ],
    "similarityGroup": "neptune_winds"
  },
  {
    "id": "tf_sunlight_earth_minutes_true",
    "answer": "true",
    "statement": {
      "en": "Sunlight takes about eight minutes to reach Earth.",
      "ar": "يستغرق ضوء الشمس حوالي ثماني دقائق ليصل إلى الأرض."
    },
    "category": "space",
    "difficulty": "medium",
    "tags": [
      "sunlight",
      "earth"
    ],
    "similarityGroup": "sunlight_earth_minutes"
  },
  {
    "id": "tf_sunlight_earth_minutes_fake",
    "answer": "fake",
    "statement": {
      "en": "Sunlight reaches Earth instantly with no travel time.",
      "ar": "يصل ضوء الشمس إلى الأرض فورًا دون أي زمن انتقال."
    },
    "category": "space",
    "difficulty": "medium",
    "tags": [
      "sunlight",
      "earth"
    ],
    "similarityGroup": "sunlight_earth_minutes"
  },
  {
    "id": "tf_milky_way_galaxy_true",
    "answer": "true",
    "statement": {
      "en": "The Solar System is in the Milky Way galaxy.",
      "ar": "تقع المجموعة الشمسية في مجرة درب التبانة."
    },
    "category": "space",
    "difficulty": "medium",
    "tags": [
      "milky_way",
      "solar_system"
    ],
    "similarityGroup": "milky_way_galaxy"
  },
  {
    "id": "tf_milky_way_galaxy_fake",
    "answer": "fake",
    "statement": {
      "en": "The Solar System is outside every galaxy.",
      "ar": "المجموعة الشمسية خارج كل المجرات."
    },
    "category": "space",
    "difficulty": "medium",
    "tags": [
      "milky_way",
      "solar_system"
    ],
    "similarityGroup": "milky_way_galaxy"
  },
  {
    "id": "tf_seasons_tilt_true",
    "answer": "true",
    "statement": {
      "en": "Earth’s seasons are mainly caused by its axial tilt.",
      "ar": "فصول الأرض سببها الأساسي ميل محورها."
    },
    "category": "space",
    "difficulty": "medium",
    "tags": [
      "seasons",
      "earth"
    ],
    "similarityGroup": "seasons_tilt"
  },
  {
    "id": "tf_seasons_tilt_fake",
    "answer": "fake",
    "statement": {
      "en": "Earth’s seasons are mainly caused by the Moon changing color.",
      "ar": "فصول الأرض سببها الأساسي تغير لون القمر."
    },
    "category": "space",
    "difficulty": "medium",
    "tags": [
      "seasons",
      "earth"
    ],
    "similarityGroup": "seasons_tilt"
  },
  {
    "id": "tf_tides_moon_gravity_true",
    "answer": "true",
    "statement": {
      "en": "The Moon’s gravity helps cause tides on Earth.",
      "ar": "جاذبية القمر تساعد في حدوث المد والجزر على الأرض."
    },
    "category": "space",
    "difficulty": "medium",
    "tags": [
      "moon",
      "tides"
    ],
    "similarityGroup": "tides_moon_gravity"
  },
  {
    "id": "tf_tides_moon_gravity_fake",
    "answer": "fake",
    "statement": {
      "en": "Tides on Earth are caused only by people swimming.",
      "ar": "المد والجزر على الأرض يحدث فقط بسبب سباحة الناس."
    },
    "category": "space",
    "difficulty": "medium",
    "tags": [
      "moon",
      "tides"
    ],
    "similarityGroup": "tides_moon_gravity"
  },
  {
    "id": "tf_dna_double_helix_true",
    "answer": "true",
    "statement": {
      "en": "DNA is commonly described as a double helix.",
      "ar": "يوصف DNA غالبًا بأنه حلزون مزدوج."
    },
    "category": "science",
    "difficulty": "medium",
    "tags": [
      "dna",
      "biology"
    ],
    "similarityGroup": "dna_double_helix"
  },
  {
    "id": "tf_dna_double_helix_fake",
    "answer": "fake",
    "statement": {
      "en": "DNA is commonly described as a perfect cube made of stone.",
      "ar": "يوصف DNA غالبًا بأنه مكعب حجري مثالي."
    },
    "category": "science",
    "difficulty": "medium",
    "tags": [
      "dna",
      "biology"
    ],
    "similarityGroup": "dna_double_helix"
  },
  {
    "id": "tf_blood_type_o_universal_red_cells_true",
    "answer": "true",
    "statement": {
      "en": "Type O negative blood is often called the universal red-cell donor type.",
      "ar": "فصيلة O سالب تُسمى غالبًا المتبرع العام لكريات الدم الحمراء."
    },
    "category": "science",
    "difficulty": "medium",
    "tags": [
      "blood",
      "medicine"
    ],
    "similarityGroup": "blood_type_o_universal_red_cells"
  },
  {
    "id": "tf_blood_type_o_universal_red_cells_fake",
    "answer": "fake",
    "statement": {
      "en": "Type O negative blood can only be donated to O negative people.",
      "ar": "فصيلة O سالب لا يمكن التبرع بها إلا لأصحاب O سالب."
    },
    "category": "science",
    "difficulty": "medium",
    "tags": [
      "blood",
      "medicine"
    ],
    "similarityGroup": "blood_type_o_universal_red_cells"
  },
  {
    "id": "tf_antibiotics_bacteria_not_viruses_true",
    "answer": "true",
    "statement": {
      "en": "Antibiotics work against bacteria, not ordinary viral infections.",
      "ar": "المضادات الحيوية تعمل ضد البكتيريا وليس العدوى الفيروسية العادية."
    },
    "category": "science",
    "difficulty": "medium",
    "tags": [
      "medicine",
      "antibiotics"
    ],
    "similarityGroup": "antibiotics_bacteria_not_viruses"
  },
  {
    "id": "tf_antibiotics_bacteria_not_viruses_fake",
    "answer": "fake",
    "statement": {
      "en": "Antibiotics kill every virus instantly.",
      "ar": "المضادات الحيوية تقتل كل الفيروسات فورًا."
    },
    "category": "science",
    "difficulty": "medium",
    "tags": [
      "medicine",
      "antibiotics"
    ],
    "similarityGroup": "antibiotics_bacteria_not_viruses"
  },
  {
    "id": "tf_light_faster_sound_true",
    "answer": "true",
    "statement": {
      "en": "Light travels faster than sound.",
      "ar": "الضوء ينتقل أسرع من الصوت."
    },
    "category": "science",
    "difficulty": "medium",
    "tags": [
      "physics",
      "light"
    ],
    "similarityGroup": "light_faster_sound"
  },
  {
    "id": "tf_light_faster_sound_fake",
    "answer": "fake",
    "statement": {
      "en": "Sound travels faster than light.",
      "ar": "الصوت ينتقل أسرع من الضوء."
    },
    "category": "science",
    "difficulty": "medium",
    "tags": [
      "physics",
      "light"
    ],
    "similarityGroup": "light_faster_sound"
  },
  {
    "id": "tf_gold_chemical_symbol_true",
    "answer": "true",
    "statement": {
      "en": "The chemical symbol for gold is Au.",
      "ar": "الرمز الكيميائي للذهب هو Au."
    },
    "category": "science",
    "difficulty": "medium",
    "tags": [
      "chemistry",
      "gold"
    ],
    "similarityGroup": "gold_chemical_symbol"
  },
  {
    "id": "tf_gold_chemical_symbol_fake",
    "answer": "fake",
    "statement": {
      "en": "الرمز الكيميائي للذهب هو Gd.",
      "ar": "الرمز الكيميائي للذهب هو Gd."
    },
    "category": "science",
    "difficulty": "medium",
    "tags": [
      "chemistry",
      "gold"
    ],
    "similarityGroup": "gold_chemical_symbol"
  },
  {
    "id": "tf_iron_symbol_fe_true",
    "answer": "true",
    "statement": {
      "en": "The chemical symbol for iron is Fe.",
      "ar": "الرمز الكيميائي للحديد هو Fe."
    },
    "category": "science",
    "difficulty": "medium",
    "tags": [
      "chemistry",
      "iron"
    ],
    "similarityGroup": "iron_symbol_fe"
  },
  {
    "id": "tf_iron_symbol_fe_fake",
    "answer": "fake",
    "statement": {
      "en": "الرمز الكيميائي للحديد هو Ir.",
      "ar": "الرمز الكيميائي للحديد هو Ir."
    },
    "category": "science",
    "difficulty": "medium",
    "tags": [
      "chemistry",
      "iron"
    ],
    "similarityGroup": "iron_symbol_fe"
  },
  {
    "id": "tf_water_chemical_formula_true",
    "answer": "true",
    "statement": {
      "en": "The chemical formula for water is H₂O.",
      "ar": "الصيغة الكيميائية للماء هي H₂O."
    },
    "category": "science",
    "difficulty": "medium",
    "tags": [
      "chemistry",
      "water"
    ],
    "similarityGroup": "water_chemical_formula"
  },
  {
    "id": "tf_water_chemical_formula_fake",
    "answer": "fake",
    "statement": {
      "en": "الصيغة الكيميائية للماء هي CO₂.",
      "ar": "الصيغة الكيميائية للماء هي CO₂."
    },
    "category": "science",
    "difficulty": "medium",
    "tags": [
      "chemistry",
      "water"
    ],
    "similarityGroup": "water_chemical_formula"
  },
  {
    "id": "tf_carbon_dioxide_formula_true",
    "answer": "true",
    "statement": {
      "en": "Carbon dioxide has the chemical formula CO₂.",
      "ar": "ثاني أكسيد الكربون صيغته الكيميائية CO₂."
    },
    "category": "science",
    "difficulty": "medium",
    "tags": [
      "chemistry",
      "co2"
    ],
    "similarityGroup": "carbon_dioxide_formula"
  },
  {
    "id": "tf_carbon_dioxide_formula_fake",
    "answer": "fake",
    "statement": {
      "en": "ثاني أكسيد الكربون صيغته الكيميائية H₂O.",
      "ar": "ثاني أكسيد الكربون صيغته الكيميائية H₂O."
    },
    "category": "science",
    "difficulty": "medium",
    "tags": [
      "chemistry",
      "co2"
    ],
    "similarityGroup": "carbon_dioxide_formula"
  },
  {
    "id": "tf_chlorophyll_green_true",
    "answer": "true",
    "statement": {
      "en": "Chlorophyll helps give many plants their green color.",
      "ar": "الكلوروفيل يساعد في إعطاء كثير من النباتات لونها الأخضر."
    },
    "category": "science",
    "difficulty": "medium",
    "tags": [
      "plants",
      "chlorophyll"
    ],
    "similarityGroup": "chlorophyll_green"
  },
  {
    "id": "tf_chlorophyll_green_fake",
    "answer": "fake",
    "statement": {
      "en": "الكلوروفيل يجعل كل النباتات زرقاء لامعة.",
      "ar": "الكلوروفيل يجعل كل النباتات زرقاء لامعة."
    },
    "category": "science",
    "difficulty": "medium",
    "tags": [
      "plants",
      "chlorophyll"
    ],
    "similarityGroup": "chlorophyll_green"
  },
  {
    "id": "tf_plate_tectonics_earthquakes_true",
    "answer": "true",
    "statement": {
      "en": "Many earthquakes happen near tectonic plate boundaries.",
      "ar": "كثير من الزلازل يحدث قرب حدود الصفائح التكتونية."
    },
    "category": "science",
    "difficulty": "medium",
    "tags": [
      "geology",
      "earthquakes"
    ],
    "similarityGroup": "plate_tectonics_earthquakes"
  },
  {
    "id": "tf_plate_tectonics_earthquakes_fake",
    "answer": "fake",
    "statement": {
      "en": "Earthquakes happen only because clouds bump into mountains.",
      "ar": "الزلازل تحدث فقط لأن السحب تصطدم بالجبال."
    },
    "category": "science",
    "difficulty": "medium",
    "tags": [
      "geology",
      "earthquakes"
    ],
    "similarityGroup": "plate_tectonics_earthquakes"
  },
  {
    "id": "tf_sharks_cartilage_true",
    "answer": "true",
    "statement": {
      "en": "Sharks have skeletons made mostly of cartilage.",
      "ar": "أسماك القرش لها هياكل عظمية معظمها من الغضاريف."
    },
    "category": "animals",
    "difficulty": "medium",
    "tags": [
      "sharks",
      "cartilage"
    ],
    "similarityGroup": "sharks_cartilage"
  },
  {
    "id": "tf_sharks_cartilage_fake",
    "answer": "fake",
    "statement": {
      "en": "Sharks have skeletons made mostly of solid gold.",
      "ar": "أسماك القرش لها هياكل عظمية معظمها من الذهب الخالص."
    },
    "category": "animals",
    "difficulty": "medium",
    "tags": [
      "sharks",
      "cartilage"
    ],
    "similarityGroup": "sharks_cartilage"
  },
  {
    "id": "tf_owl_neck_rotation_true",
    "answer": "true",
    "statement": {
      "en": "Owls can rotate their heads far, but not a full 360 degrees.",
      "ar": "البوم يستطيع تدوير رأسه كثيرًا، لكن ليس 360 درجة كاملة."
    },
    "category": "animals",
    "difficulty": "medium",
    "tags": [
      "owls",
      "neck"
    ],
    "similarityGroup": "owl_neck_rotation"
  },
  {
    "id": "tf_owl_neck_rotation_fake",
    "answer": "fake",
    "statement": {
      "en": "Owls can rotate their heads an unlimited number of full circles.",
      "ar": "البوم يستطيع تدوير رأسه دوائر كاملة بلا حدود."
    },
    "category": "animals",
    "difficulty": "medium",
    "tags": [
      "owls",
      "neck"
    ],
    "similarityGroup": "owl_neck_rotation"
  },
  {
    "id": "tf_dolphins_mammals_breathe_air_true",
    "answer": "true",
    "statement": {
      "en": "Dolphins are mammals and breathe air.",
      "ar": "الدلافين ثدييات وتتنفس الهواء."
    },
    "category": "animals",
    "difficulty": "medium",
    "tags": [
      "dolphins",
      "mammals"
    ],
    "similarityGroup": "dolphins_mammals_breathe_air"
  },
  {
    "id": "tf_dolphins_mammals_breathe_air_fake",
    "answer": "fake",
    "statement": {
      "en": "Dolphins are plants and breathe through leaves.",
      "ar": "الدلافين نباتات وتتنفس عبر الأوراق."
    },
    "category": "animals",
    "difficulty": "medium",
    "tags": [
      "dolphins",
      "mammals"
    ],
    "similarityGroup": "dolphins_mammals_breathe_air"
  },
  {
    "id": "tf_kangaroos_marsupials_true",
    "answer": "true",
    "statement": {
      "en": "Kangaroos are marsupials.",
      "ar": "الكنغر من الجرابيات."
    },
    "category": "animals",
    "difficulty": "medium",
    "tags": [
      "kangaroo",
      "marsupials"
    ],
    "similarityGroup": "kangaroos_marsupials"
  },
  {
    "id": "tf_kangaroos_marsupials_fake",
    "answer": "fake",
    "statement": {
      "en": "Kangaroos are amphibians that hatch from fish eggs.",
      "ar": "الكنغر برمائيات تفقس من بيض السمك."
    },
    "category": "animals",
    "difficulty": "medium",
    "tags": [
      "kangaroo",
      "marsupials"
    ],
    "similarityGroup": "kangaroos_marsupials"
  },
  {
    "id": "tf_platypus_lays_eggs_true",
    "answer": "true",
    "statement": {
      "en": "The platypus is a mammal that lays eggs.",
      "ar": "خلد الماء ثديي يضع البيض."
    },
    "category": "animals",
    "difficulty": "medium",
    "tags": [
      "platypus",
      "eggs"
    ],
    "similarityGroup": "platypus_lays_eggs"
  },
  {
    "id": "tf_platypus_lays_eggs_fake",
    "answer": "fake",
    "statement": {
      "en": "The platypus is a bird that grows tree leaves.",
      "ar": "خلد الماء طائر تنمو عليه أوراق الأشجار."
    },
    "category": "animals",
    "difficulty": "medium",
    "tags": [
      "platypus",
      "eggs"
    ],
    "similarityGroup": "platypus_lays_eggs"
  },
  {
    "id": "tf_sea_turtles_lay_eggs_land_true",
    "answer": "true",
    "statement": {
      "en": "Sea turtles lay their eggs on land.",
      "ar": "السلاحف البحرية تضع بيضها على اليابسة."
    },
    "category": "animals",
    "difficulty": "medium",
    "tags": [
      "turtles",
      "eggs"
    ],
    "similarityGroup": "sea_turtles_lay_eggs_land"
  },
  {
    "id": "tf_sea_turtles_lay_eggs_land_fake",
    "answer": "fake",
    "statement": {
      "en": "Sea turtles lay their eggs in clouds.",
      "ar": "السلاحف البحرية تضع بيضها داخل السحب."
    },
    "category": "animals",
    "difficulty": "medium",
    "tags": [
      "turtles",
      "eggs"
    ],
    "similarityGroup": "sea_turtles_lay_eggs_land"
  },
  {
    "id": "tf_chameleons_eyes_true",
    "answer": "true",
    "statement": {
      "en": "Chameleons can move their eyes independently.",
      "ar": "الحرباء تستطيع تحريك عينيها بشكل مستقل."
    },
    "category": "animals",
    "difficulty": "medium",
    "tags": [
      "chameleons",
      "eyes"
    ],
    "similarityGroup": "chameleons_eyes"
  },
  {
    "id": "tf_chameleons_eyes_fake",
    "answer": "fake",
    "statement": {
      "en": "Chameleons have only one eye in the middle of the tail.",
      "ar": "الحرباء لها عين واحدة فقط في منتصف الذيل."
    },
    "category": "animals",
    "difficulty": "medium",
    "tags": [
      "chameleons",
      "eyes"
    ],
    "similarityGroup": "chameleons_eyes"
  },
  {
    "id": "tf_electric_eels_generate_electricity_true",
    "answer": "true",
    "statement": {
      "en": "Electric eels can produce electric shocks.",
      "ar": "ثعابين السمك الكهربائية تستطيع إنتاج صدمات كهربائية."
    },
    "category": "animals",
    "difficulty": "medium",
    "tags": [
      "electric_eels",
      "electricity"
    ],
    "similarityGroup": "electric_eels_generate_electricity"
  },
  {
    "id": "tf_electric_eels_generate_electricity_fake",
    "answer": "fake",
    "statement": {
      "en": "Electric eels are called electric because they need charging cables.",
      "ar": "تسمى ثعابين السمك الكهربائية كذلك لأنها تحتاج كابلات شحن."
    },
    "category": "animals",
    "difficulty": "medium",
    "tags": [
      "electric_eels",
      "electricity"
    ],
    "similarityGroup": "electric_eels_generate_electricity"
  },
  {
    "id": "tf_honey_long_shelf_life_true",
    "answer": "true",
    "statement": {
      "en": "Honey can last a very long time if stored properly.",
      "ar": "العسل يمكن أن يبقى صالحًا لفترة طويلة جدًا إذا خُزن جيدًا."
    },
    "category": "food",
    "difficulty": "medium",
    "tags": [
      "honey",
      "storage"
    ],
    "similarityGroup": "honey_long_shelf_life"
  },
  {
    "id": "tf_honey_long_shelf_life_fake",
    "answer": "fake",
    "statement": {
      "en": "Honey always spoils completely after one hour.",
      "ar": "العسل يفسد تمامًا دائمًا بعد ساعة واحدة."
    },
    "category": "food",
    "difficulty": "medium",
    "tags": [
      "honey",
      "storage"
    ],
    "similarityGroup": "honey_long_shelf_life"
  },
  {
    "id": "tf_tomato_fruit_botany_true",
    "answer": "true",
    "statement": {
      "en": "A tomato is botanically a fruit.",
      "ar": "الطماطم من الناحية النباتية ثمرة."
    },
    "category": "food",
    "difficulty": "medium",
    "tags": [
      "tomato",
      "botany"
    ],
    "similarityGroup": "tomato_fruit_botany"
  },
  {
    "id": "tf_tomato_fruit_botany_fake",
    "answer": "fake",
    "statement": {
      "en": "A tomato is botanically a mineral.",
      "ar": "الطماطم من الناحية النباتية معدن."
    },
    "category": "food",
    "difficulty": "medium",
    "tags": [
      "tomato",
      "botany"
    ],
    "similarityGroup": "tomato_fruit_botany"
  },
  {
    "id": "tf_peanut_legume_true",
    "answer": "true",
    "statement": {
      "en": "Peanuts are legumes, not true tree nuts.",
      "ar": "الفول السوداني من البقوليات وليس من المكسرات الشجرية الحقيقية."
    },
    "category": "food",
    "difficulty": "medium",
    "tags": [
      "peanuts",
      "legumes"
    ],
    "similarityGroup": "peanut_legume"
  },
  {
    "id": "tf_peanut_legume_fake",
    "answer": "fake",
    "statement": {
      "en": "Peanuts grow from ocean coral.",
      "ar": "الفول السوداني ينمو من الشعاب المرجانية."
    },
    "category": "food",
    "difficulty": "medium",
    "tags": [
      "peanuts",
      "legumes"
    ],
    "similarityGroup": "peanut_legume"
  },
  {
    "id": "tf_cocoa_chocolate_true",
    "answer": "true",
    "statement": {
      "en": "Chocolate is made from cocoa beans.",
      "ar": "الشوكولاتة تُصنع من حبوب الكاكاو."
    },
    "category": "food",
    "difficulty": "medium",
    "tags": [
      "chocolate",
      "cocoa"
    ],
    "similarityGroup": "cocoa_chocolate"
  },
  {
    "id": "tf_cocoa_chocolate_fake",
    "answer": "fake",
    "statement": {
      "en": "Chocolate is made from pure sand.",
      "ar": "الشوكولاتة تُصنع من الرمل الخالص."
    },
    "category": "food",
    "difficulty": "medium",
    "tags": [
      "chocolate",
      "cocoa"
    ],
    "similarityGroup": "cocoa_chocolate"
  },
  {
    "id": "tf_saffron_spice_true",
    "answer": "true",
    "statement": {
      "en": "Saffron is a spice made from crocus flower stigmas.",
      "ar": "الزعفران توابل تُصنع من مياسم زهرة الزعفران."
    },
    "category": "food",
    "difficulty": "medium",
    "tags": [
      "saffron",
      "spice"
    ],
    "similarityGroup": "saffron_spice"
  },
  {
    "id": "tf_saffron_spice_fake",
    "answer": "fake",
    "statement": {
      "en": "Saffron is a type of computer cable.",
      "ar": "الزعفران نوع من كابلات الكمبيوتر."
    },
    "category": "food",
    "difficulty": "medium",
    "tags": [
      "saffron",
      "spice"
    ],
    "similarityGroup": "saffron_spice"
  },
  {
    "id": "tf_wasabi_plant_true",
    "answer": "true",
    "statement": {
      "en": "Real wasabi comes from a plant in the mustard family.",
      "ar": "الواسابي الحقيقي يأتي من نبات من فصيلة الخردل."
    },
    "category": "food",
    "difficulty": "medium",
    "tags": [
      "wasabi",
      "plant"
    ],
    "similarityGroup": "wasabi_plant"
  },
  {
    "id": "tf_wasabi_plant_fake",
    "answer": "fake",
    "statement": {
      "en": "Real wasabi is mined from volcano rocks.",
      "ar": "الواسابي الحقيقي يُستخرج من صخور البراكين."
    },
    "category": "food",
    "difficulty": "medium",
    "tags": [
      "wasabi",
      "plant"
    ],
    "similarityGroup": "wasabi_plant"
  },
  {
    "id": "tf_quinoa_seed_true",
    "answer": "true",
    "statement": {
      "en": "Quinoa is commonly eaten like a grain but is technically a seed.",
      "ar": "الكينوا تؤكل غالبًا كحبوب لكنها تقنيًا بذرة."
    },
    "category": "food",
    "difficulty": "medium",
    "tags": [
      "quinoa",
      "seed"
    ],
    "similarityGroup": "quinoa_seed"
  },
  {
    "id": "tf_quinoa_seed_fake",
    "answer": "fake",
    "statement": {
      "en": "Quinoa is a kind of metal screw.",
      "ar": "الكينوا نوع من البراغي المعدنية."
    },
    "category": "food",
    "difficulty": "medium",
    "tags": [
      "quinoa",
      "seed"
    ],
    "similarityGroup": "quinoa_seed"
  },
  {
    "id": "tf_vanilla_orchid_true",
    "answer": "true",
    "statement": {
      "en": "Vanilla comes from orchids.",
      "ar": "الفانيليا تأتي من نباتات الأوركيد."
    },
    "category": "food",
    "difficulty": "medium",
    "tags": [
      "vanilla",
      "orchid"
    ],
    "similarityGroup": "vanilla_orchid"
  },
  {
    "id": "tf_vanilla_orchid_fake",
    "answer": "fake",
    "statement": {
      "en": "Vanilla comes from underground diamonds.",
      "ar": "الفانيليا تأتي من ألماس تحت الأرض."
    },
    "category": "food",
    "difficulty": "medium",
    "tags": [
      "vanilla",
      "orchid"
    ],
    "similarityGroup": "vanilla_orchid"
  },
  {
    "id": "tf_canada_largest_coastline_true",
    "answer": "true",
    "statement": {
      "en": "Canada has the longest coastline of any country.",
      "ar": "كندا لديها أطول خط ساحلي بين الدول."
    },
    "category": "geography",
    "difficulty": "medium",
    "tags": [
      "canada",
      "coastline"
    ],
    "similarityGroup": "canada_largest_coastline"
  },
  {
    "id": "tf_canada_largest_coastline_fake",
    "answer": "fake",
    "statement": {
      "en": "Switzerland has the longest coastline of any country.",
      "ar": "سويسرا لديها أطول خط ساحلي بين الدول."
    },
    "category": "geography",
    "difficulty": "medium",
    "tags": [
      "canada",
      "coastline"
    ],
    "similarityGroup": "canada_largest_coastline"
  },
  {
    "id": "tf_australia_country_continent_true",
    "answer": "true",
    "statement": {
      "en": "Australia is both a country and commonly described as a continent.",
      "ar": "أستراليا دولة وتوصف غالبًا بأنها قارة أيضًا."
    },
    "category": "geography",
    "difficulty": "medium",
    "tags": [
      "australia",
      "continent"
    ],
    "similarityGroup": "australia_country_continent"
  },
  {
    "id": "tf_australia_country_continent_fake",
    "answer": "fake",
    "statement": {
      "en": "Australia is a small village inside Antarctica.",
      "ar": "أستراليا قرية صغيرة داخل القارة القطبية الجنوبية."
    },
    "category": "geography",
    "difficulty": "medium",
    "tags": [
      "australia",
      "continent"
    ],
    "similarityGroup": "australia_country_continent"
  },
  {
    "id": "tf_greenland_largest_island_true",
    "answer": "true",
    "statement": {
      "en": "Greenland is the world’s largest island that is not a continent.",
      "ar": "غرينلاند أكبر جزيرة في العالم إذا استثنينا القارات."
    },
    "category": "geography",
    "difficulty": "medium",
    "tags": [
      "greenland",
      "islands"
    ],
    "similarityGroup": "greenland_largest_island"
  },
  {
    "id": "tf_greenland_largest_island_fake",
    "answer": "fake",
    "statement": {
      "en": "Greenland is smaller than most city parks.",
      "ar": "غرينلاند أصغر من معظم حدائق المدن."
    },
    "category": "geography",
    "difficulty": "medium",
    "tags": [
      "greenland",
      "islands"
    ],
    "similarityGroup": "greenland_largest_island"
  },
  {
    "id": "tf_dead_sea_salty_true",
    "answer": "true",
    "statement": {
      "en": "The Dead Sea is extremely salty.",
      "ar": "البحر الميت شديد الملوحة."
    },
    "category": "geography",
    "difficulty": "medium",
    "tags": [
      "dead_sea",
      "salt"
    ],
    "similarityGroup": "dead_sea_salty"
  },
  {
    "id": "tf_dead_sea_salty_fake",
    "answer": "fake",
    "statement": {
      "en": "The Dead Sea is famous for being pure fresh water.",
      "ar": "البحر الميت مشهور بأنه ماء عذب تمامًا."
    },
    "category": "geography",
    "difficulty": "medium",
    "tags": [
      "dead_sea",
      "salt"
    ],
    "similarityGroup": "dead_sea_salty"
  },
  {
    "id": "tf_panama_canal_connects_oceans_true",
    "answer": "true",
    "statement": {
      "en": "The Panama Canal connects the Atlantic and Pacific Oceans.",
      "ar": "قناة بنما تصل بين المحيطين الأطلسي والهادئ."
    },
    "category": "geography",
    "difficulty": "medium",
    "tags": [
      "panama_canal",
      "oceans"
    ],
    "similarityGroup": "panama_canal_connects_oceans"
  },
  {
    "id": "tf_panama_canal_connects_oceans_fake",
    "answer": "fake",
    "statement": {
      "en": "The Panama Canal connects the Moon to Mars.",
      "ar": "قناة بنما تصل القمر بالمريخ."
    },
    "category": "geography",
    "difficulty": "medium",
    "tags": [
      "panama_canal",
      "oceans"
    ],
    "similarityGroup": "panama_canal_connects_oceans"
  },
  {
    "id": "tf_suez_canal_connects_seas_true",
    "answer": "true",
    "statement": {
      "en": "The Suez Canal connects the Mediterranean Sea and the Red Sea.",
      "ar": "قناة السويس تصل البحر المتوسط بالبحر الأحمر."
    },
    "category": "geography",
    "difficulty": "medium",
    "tags": [
      "suez_canal",
      "egypt"
    ],
    "similarityGroup": "suez_canal_connects_seas"
  },
  {
    "id": "tf_suez_canal_connects_seas_fake",
    "answer": "fake",
    "statement": {
      "en": "قناة السويس تصل البحر الكاريبي ببحر الشمال.",
      "ar": "The Suez Canal connects the Caribbean Sea to the North Sea."
    },
    "category": "geography",
    "difficulty": "medium",
    "tags": [
      "suez_canal",
      "egypt"
    ],
    "similarityGroup": "suez_canal_connects_seas"
  },
  {
    "id": "tf_mauna_kea_tall_base_true",
    "answer": "true",
    "statement": {
      "en": "Measured from its ocean base, Mauna Kea is taller than Mount Everest.",
      "ar": "إذا قيس من قاعدته في المحيط، فإن ماونا كيا أطول من إيفرست."
    },
    "category": "geography",
    "difficulty": "medium",
    "tags": [
      "mauna_kea",
      "mountains"
    ],
    "similarityGroup": "mauna_kea_tall_base"
  },
  {
    "id": "tf_mauna_kea_tall_base_fake",
    "answer": "fake",
    "statement": {
      "en": "Mauna Kea is a tiny hill inside a shopping mall.",
      "ar": "ماونا كيا تل صغير داخل مركز تجاري."
    },
    "category": "geography",
    "difficulty": "medium",
    "tags": [
      "mauna_kea",
      "mountains"
    ],
    "similarityGroup": "mauna_kea_tall_base"
  },
  {
    "id": "tf_istanbul_two_continents_true",
    "answer": "true",
    "statement": {
      "en": "Istanbul spans areas associated with both Europe and Asia.",
      "ar": "إسطنبول تمتد في مناطق مرتبطة بأوروبا وآسيا."
    },
    "category": "geography",
    "difficulty": "medium",
    "tags": [
      "istanbul",
      "continents"
    ],
    "similarityGroup": "istanbul_two_continents"
  },
  {
    "id": "tf_istanbul_two_continents_fake",
    "answer": "fake",
    "statement": {
      "en": "Istanbul is located entirely on Antarctica.",
      "ar": "إسطنبول تقع بالكامل في القارة القطبية الجنوبية."
    },
    "category": "geography",
    "difficulty": "medium",
    "tags": [
      "istanbul",
      "continents"
    ],
    "similarityGroup": "istanbul_two_continents"
  },
  {
    "id": "tf_latin_alphabet_roman_roots_true",
    "answer": "true",
    "statement": {
      "en": "The Latin alphabet has roots in ancient Roman writing.",
      "ar": "الأبجدية اللاتينية لها جذور في الكتابة الرومانية القديمة."
    },
    "category": "language",
    "difficulty": "medium",
    "tags": [
      "latin",
      "alphabet"
    ],
    "similarityGroup": "latin_alphabet_roman_roots"
  },
  {
    "id": "tf_latin_alphabet_roman_roots_fake",
    "answer": "fake",
    "statement": {
      "en": "The Latin alphabet was invented for video games in 2020.",
      "ar": "الأبجدية اللاتينية اختُرعت لألعاب الفيديو في عام 2020."
    },
    "category": "language",
    "difficulty": "medium",
    "tags": [
      "latin",
      "alphabet"
    ],
    "similarityGroup": "latin_alphabet_roman_roots"
  },
  {
    "id": "tf_japanese_three_scripts_true",
    "answer": "true",
    "statement": {
      "en": "Modern Japanese commonly uses kanji, hiragana, and katakana.",
      "ar": "اليابانية الحديثة تستخدم غالبًا كانجي وهيراغانا وكاتاكانا."
    },
    "category": "language",
    "difficulty": "medium",
    "tags": [
      "japanese",
      "scripts"
    ],
    "similarityGroup": "japanese_three_scripts"
  },
  {
    "id": "tf_japanese_three_scripts_fake",
    "answer": "fake",
    "statement": {
      "en": "Modern Japanese uses only one symbol for every sentence.",
      "ar": "اليابانية الحديثة تستخدم رمزًا واحدًا فقط لكل جملة."
    },
    "category": "language",
    "difficulty": "medium",
    "tags": [
      "japanese",
      "scripts"
    ],
    "similarityGroup": "japanese_three_scripts"
  },
  {
    "id": "tf_korean_hangul_true",
    "answer": "true",
    "statement": {
      "en": "Hangul is the writing system used for Korean.",
      "ar": "هانغول هو نظام الكتابة المستخدم للكورية."
    },
    "category": "language",
    "difficulty": "medium",
    "tags": [
      "korean",
      "hangul"
    ],
    "similarityGroup": "korean_hangul"
  },
  {
    "id": "tf_korean_hangul_fake",
    "answer": "fake",
    "statement": {
      "en": "Hangul is a type of pizza topping.",
      "ar": "هانغول نوع من إضافات البيتزا."
    },
    "category": "language",
    "difficulty": "medium",
    "tags": [
      "korean",
      "hangul"
    ],
    "similarityGroup": "korean_hangul"
  },
  {
    "id": "tf_morse_code_dots_dashes_true",
    "answer": "true",
    "statement": {
      "en": "Morse code uses dots and dashes.",
      "ar": "شفرة مورس تستخدم النقاط والشرطات."
    },
    "category": "language",
    "difficulty": "medium",
    "tags": [
      "morse",
      "code"
    ],
    "similarityGroup": "morse_code_dots_dashes"
  },
  {
    "id": "tf_morse_code_dots_dashes_fake",
    "answer": "fake",
    "statement": {
      "en": "شفرة مورس تستخدم فقط ألوان قوس قزح.",
      "ar": "شفرة مورس تستخدم ألوان قوس قزح فقط."
    },
    "category": "language",
    "difficulty": "medium",
    "tags": [
      "morse",
      "code"
    ],
    "similarityGroup": "morse_code_dots_dashes"
  },
  {
    "id": "tf_palindrome_same_backward_true",
    "answer": "true",
    "statement": {
      "en": "A palindrome reads the same backward and forward.",
      "ar": "الكلمة أو العبارة palindrome تُقرأ نفسها من الأمام والخلف."
    },
    "category": "language",
    "difficulty": "medium",
    "tags": [
      "palindrome",
      "words"
    ],
    "similarityGroup": "palindrome_same_backward"
  },
  {
    "id": "tf_palindrome_same_backward_fake",
    "answer": "fake",
    "statement": {
      "en": "A palindrome must always be a kind of animal.",
      "ar": "الـ palindrome يجب أن يكون دائمًا نوعًا من الحيوانات."
    },
    "category": "language",
    "difficulty": "medium",
    "tags": [
      "palindrome",
      "words"
    ],
    "similarityGroup": "palindrome_same_backward"
  },
  {
    "id": "tf_chess_queen_moves_true",
    "answer": "true",
    "statement": {
      "en": "In chess, the queen can move horizontally, vertically, or diagonally.",
      "ar": "في الشطرنج، يمكن للملكة التحرك أفقيًا أو عموديًا أو قطريًا."
    },
    "category": "games",
    "difficulty": "medium",
    "tags": [
      "chess",
      "queen"
    ],
    "similarityGroup": "chess_queen_moves"
  },
  {
    "id": "tf_chess_queen_moves_fake",
    "answer": "fake",
    "statement": {
      "en": "In chess, the queen can only move one square forward like a pawn.",
      "ar": "في الشطرنج، الملكة تتحرك مربعًا واحدًا للأمام فقط مثل البيدق."
    },
    "category": "games",
    "difficulty": "medium",
    "tags": [
      "chess",
      "queen"
    ],
    "similarityGroup": "chess_queen_moves"
  },
  {
    "id": "tf_go_board_game_true",
    "answer": "true",
    "statement": {
      "en": "Go is a board game that originated in East Asia.",
      "ar": "غو لعبة لوحية نشأت في شرق آسيا."
    },
    "category": "games",
    "difficulty": "medium",
    "tags": [
      "go",
      "board_game"
    ],
    "similarityGroup": "go_board_game"
  },
  {
    "id": "tf_go_board_game_fake",
    "answer": "fake",
    "statement": {
      "en": "Go is only a command for turning off a toaster.",
      "ar": "Go هي فقط أمر لإطفاء محمصة."
    },
    "category": "games",
    "difficulty": "medium",
    "tags": [
      "go",
      "board_game"
    ],
    "similarityGroup": "go_board_game"
  },
  {
    "id": "tf_pokemon_collect_creatures_true",
    "answer": "true",
    "statement": {
      "en": "Pokémon games center on collecting and battling creatures.",
      "ar": "ألعاب بوكيمون تدور حول جمع الكائنات وخوض المعارك بها."
    },
    "category": "games",
    "difficulty": "medium",
    "tags": [
      "pokemon",
      "rpg"
    ],
    "similarityGroup": "pokemon_collect_creatures"
  },
  {
    "id": "tf_pokemon_collect_creatures_fake",
    "answer": "fake",
    "statement": {
      "en": "Pokémon games center on filing taxes in a spreadsheet.",
      "ar": "ألعاب بوكيمون تدور حول ملء الضرائب في جدول بيانات."
    },
    "category": "games",
    "difficulty": "medium",
    "tags": [
      "pokemon",
      "rpg"
    ],
    "similarityGroup": "pokemon_collect_creatures"
  },
  {
    "id": "tf_zelda_link_hero_true",
    "answer": "true",
    "statement": {
      "en": "In many Zelda games, Link is the main playable hero.",
      "ar": "في كثير من ألعاب زيلدا، لينك هو البطل القابل للعب."
    },
    "category": "games",
    "difficulty": "medium",
    "tags": [
      "zelda",
      "link"
    ],
    "similarityGroup": "zelda_link_hero"
  },
  {
    "id": "tf_zelda_link_hero_fake",
    "answer": "fake",
    "statement": {
      "en": "In every Zelda game, the main playable hero is always Pac-Man.",
      "ar": "في كل ألعاب زيلدا، البطل القابل للعب هو دائمًا باك-مان."
    },
    "category": "games",
    "difficulty": "medium",
    "tags": [
      "zelda",
      "link"
    ],
    "similarityGroup": "zelda_link_hero"
  },
  {
    "id": "tf_sonic_speed_true",
    "answer": "true",
    "statement": {
      "en": "Sonic the Hedgehog is known for speed.",
      "ar": "سونيك القنفذ معروف بالسرعة."
    },
    "category": "games",
    "difficulty": "medium",
    "tags": [
      "sonic",
      "sega"
    ],
    "similarityGroup": "sonic_speed"
  },
  {
    "id": "tf_sonic_speed_fake",
    "answer": "fake",
    "statement": {
      "en": "Sonic the Hedgehog is known for being a slow turtle.",
      "ar": "سونيك القنفذ معروف بأنه سلحفاة بطيئة."
    },
    "category": "games",
    "difficulty": "medium",
    "tags": [
      "sonic",
      "sega"
    ],
    "similarityGroup": "sonic_speed"
  },
  {
    "id": "tf_pong_early_video_game_true",
    "answer": "true",
    "statement": {
      "en": "Pong is one of the early arcade video games.",
      "ar": "بونغ من ألعاب الأركيد المبكرة."
    },
    "category": "games",
    "difficulty": "medium",
    "tags": [
      "pong",
      "arcade"
    ],
    "similarityGroup": "pong_early_video_game"
  },
  {
    "id": "tf_pong_early_video_game_fake",
    "answer": "fake",
    "statement": {
      "en": "Pong was invented as a smartphone app in 2099.",
      "ar": "بونغ اختُرعت كتطبيق هاتف في عام 2099."
    },
    "category": "games",
    "difficulty": "medium",
    "tags": [
      "pong",
      "arcade"
    ],
    "similarityGroup": "pong_early_video_game"
  },
  {
    "id": "tf_internet_packet_switching_true",
    "answer": "true",
    "statement": {
      "en": "The internet sends data in packets.",
      "ar": "الإنترنت يرسل البيانات على شكل حزم."
    },
    "category": "internet",
    "difficulty": "medium",
    "tags": [
      "internet",
      "packets"
    ],
    "similarityGroup": "internet_packet_switching"
  },
  {
    "id": "tf_internet_packet_switching_fake",
    "answer": "fake",
    "statement": {
      "en": "The internet sends data only by paper mail.",
      "ar": "الإنترنت يرسل البيانات فقط بالبريد الورقي."
    },
    "category": "internet",
    "difficulty": "medium",
    "tags": [
      "internet",
      "packets"
    ],
    "similarityGroup": "internet_packet_switching"
  },
  {
    "id": "tf_https_encryption_true",
    "answer": "true",
    "statement": {
      "en": "HTTPS helps encrypt communication between a browser and a website.",
      "ar": "HTTPS يساعد على تشفير الاتصال بين المتصفح والموقع."
    },
    "category": "internet",
    "difficulty": "medium",
    "tags": [
      "https",
      "security"
    ],
    "similarityGroup": "https_encryption"
  },
  {
    "id": "tf_https_encryption_fake",
    "answer": "fake",
    "statement": {
      "en": "HTTPS is a type of sandwich sauce.",
      "ar": "HTTPS نوع من صلصة الساندويتش."
    },
    "category": "internet",
    "difficulty": "medium",
    "tags": [
      "https",
      "security"
    ],
    "similarityGroup": "https_encryption"
  },
  {
    "id": "tf_wifi_radio_waves_true",
    "answer": "true",
    "statement": {
      "en": "Wi‑Fi uses radio waves to transmit data wirelessly.",
      "ar": "الواي فاي يستخدم موجات راديو لنقل البيانات لاسلكيًا."
    },
    "category": "internet",
    "difficulty": "medium",
    "tags": [
      "wifi",
      "radio"
    ],
    "similarityGroup": "wifi_radio_waves"
  },
  {
    "id": "tf_wifi_radio_waves_fake",
    "answer": "fake",
    "statement": {
      "en": "Wi‑Fi works by sending tiny paper notes through the air.",
      "ar": "الواي فاي يعمل بإرسال أوراق صغيرة في الهواء."
    },
    "category": "internet",
    "difficulty": "medium",
    "tags": [
      "wifi",
      "radio"
    ],
    "similarityGroup": "wifi_radio_waves"
  },
  {
    "id": "tf_domain_name_dns_true",
    "answer": "true",
    "statement": {
      "en": "DNS helps translate domain names into IP addresses.",
      "ar": "DNS يساعد في ترجمة أسماء النطاقات إلى عناوين IP."
    },
    "category": "internet",
    "difficulty": "medium",
    "tags": [
      "dns",
      "web"
    ],
    "similarityGroup": "domain_name_dns"
  },
  {
    "id": "tf_domain_name_dns_fake",
    "answer": "fake",
    "statement": {
      "en": "DNS is a kitchen tool used only for cutting bread.",
      "ar": "DNS أداة مطبخ تستخدم فقط لتقطيع الخبز."
    },
    "category": "internet",
    "difficulty": "medium",
    "tags": [
      "dns",
      "web"
    ],
    "similarityGroup": "domain_name_dns"
  },
  {
    "id": "tf_qr_code_two_dimensional_true",
    "answer": "true",
    "statement": {
      "en": "A QR code is a two-dimensional barcode.",
      "ar": "رمز QR هو باركود ثنائي الأبعاد."
    },
    "category": "internet",
    "difficulty": "medium",
    "tags": [
      "qr",
      "barcode"
    ],
    "similarityGroup": "qr_code_two_dimensional"
  },
  {
    "id": "tf_qr_code_two_dimensional_fake",
    "answer": "fake",
    "statement": {
      "en": "رمز QR هو نوع من الأسماك.",
      "ar": "A QR code is a type of fish."
    },
    "category": "internet",
    "difficulty": "medium",
    "tags": [
      "qr",
      "barcode"
    ],
    "similarityGroup": "qr_code_two_dimensional"
  },
  {
    "id": "tf_bluetooth_short_range_true",
    "answer": "true",
    "statement": {
      "en": "Bluetooth is commonly used for short-range wireless communication.",
      "ar": "البلوتوث يُستخدم غالبًا للاتصال اللاسلكي قصير المدى."
    },
    "category": "internet",
    "difficulty": "medium",
    "tags": [
      "bluetooth",
      "wireless"
    ],
    "similarityGroup": "bluetooth_short_range"
  },
  {
    "id": "tf_bluetooth_short_range_fake",
    "answer": "fake",
    "statement": {
      "en": "Bluetooth only works between planets.",
      "ar": "البلوتوث يعمل فقط بين الكواكب."
    },
    "category": "internet",
    "difficulty": "medium",
    "tags": [
      "bluetooth",
      "wireless"
    ],
    "similarityGroup": "bluetooth_short_range"
  },
  {
    "id": "tf_rugby_ball_oval_true",
    "answer": "true",
    "statement": {
      "en": "A rugby ball is oval-shaped.",
      "ar": "كرة الرجبي بيضاوية الشكل."
    },
    "category": "sports",
    "difficulty": "medium",
    "tags": [
      "rugby",
      "ball"
    ],
    "similarityGroup": "rugby_ball_oval"
  },
  {
    "id": "tf_rugby_ball_oval_fake",
    "answer": "fake",
    "statement": {
      "en": "كرة الرجبي مكعبة الشكل دائمًا.",
      "ar": "A rugby ball is always cube-shaped."
    },
    "category": "sports",
    "difficulty": "medium",
    "tags": [
      "rugby",
      "ball"
    ],
    "similarityGroup": "rugby_ball_oval"
  },
  {
    "id": "tf_baseball_nine_players_true",
    "answer": "true",
    "statement": {
      "en": "A baseball team fields nine players at a time.",
      "ar": "فريق البيسبول يضع تسعة لاعبين في الملعب في نفس الوقت."
    },
    "category": "sports",
    "difficulty": "medium",
    "tags": [
      "baseball",
      "rules"
    ],
    "similarityGroup": "baseball_nine_players"
  },
  {
    "id": "tf_baseball_nine_players_fake",
    "answer": "fake",
    "statement": {
      "en": "A baseball team fields ninety players at a time.",
      "ar": "فريق البيسبول يضع تسعين لاعبًا في الملعب في نفس الوقت."
    },
    "category": "sports",
    "difficulty": "medium",
    "tags": [
      "baseball",
      "rules"
    ],
    "similarityGroup": "baseball_nine_players"
  },
  {
    "id": "tf_volleyball_six_players_true",
    "answer": "true",
    "statement": {
      "en": "An indoor volleyball team usually has six players on the court.",
      "ar": "فريق الكرة الطائرة داخل الصالات يضم عادة ستة لاعبين في الملعب."
    },
    "category": "sports",
    "difficulty": "medium",
    "tags": [
      "volleyball",
      "rules"
    ],
    "similarityGroup": "volleyball_six_players"
  },
  {
    "id": "tf_volleyball_six_players_fake",
    "answer": "fake",
    "statement": {
      "en": "فريق الكرة الطائرة داخل الصالات يضم عادة لاعبًا واحدًا فقط.",
      "ar": "An indoor volleyball team usually has only one player on the court."
    },
    "category": "sports",
    "difficulty": "medium",
    "tags": [
      "volleyball",
      "rules"
    ],
    "similarityGroup": "volleyball_six_players"
  },
  {
    "id": "tf_marathon_42km_true",
    "answer": "true",
    "statement": {
      "en": "A marathon is 42.195 kilometers long.",
      "ar": "الماراثون طوله 42.195 كيلومترًا."
    },
    "category": "sports",
    "difficulty": "medium",
    "tags": [
      "marathon",
      "distance"
    ],
    "similarityGroup": "marathon_42km"
  },
  {
    "id": "tf_marathon_42km_fake",
    "answer": "fake",
    "statement": {
      "en": "الماراثون طوله كيلومتر واحد فقط رسميًا.",
      "ar": "A marathon is officially only one kilometer long."
    },
    "category": "sports",
    "difficulty": "medium",
    "tags": [
      "marathon",
      "distance"
    ],
    "similarityGroup": "marathon_42km"
  },
  {
    "id": "tf_formula_one_open_wheel_true",
    "answer": "true",
    "statement": {
      "en": "Formula One cars are open-wheel racing cars.",
      "ar": "سيارات فورمولا 1 سيارات سباق مفتوحة العجلات."
    },
    "category": "sports",
    "difficulty": "medium",
    "tags": [
      "formula_one",
      "racing"
    ],
    "similarityGroup": "formula_one_open_wheel"
  },
  {
    "id": "tf_formula_one_open_wheel_fake",
    "answer": "fake",
    "statement": {
      "en": "سيارات فورمولا 1 هي قوارب شراعية.",
      "ar": "Formula One cars are sailing boats."
    },
    "category": "sports",
    "difficulty": "medium",
    "tags": [
      "formula_one",
      "racing"
    ],
    "similarityGroup": "formula_one_open_wheel"
  },
  {
    "id": "tf_golf_low_score_true",
    "answer": "true",
    "statement": {
      "en": "In golf, a lower score is better.",
      "ar": "في الجولف، النتيجة الأقل أفضل."
    },
    "category": "sports",
    "difficulty": "medium",
    "tags": [
      "golf",
      "rules"
    ],
    "similarityGroup": "golf_low_score"
  },
  {
    "id": "tf_golf_low_score_fake",
    "answer": "fake",
    "statement": {
      "en": "في الجولف، الفائز دائمًا هو صاحب أعلى عدد ضربات.",
      "ar": "In golf, the winner is always the player with the most strokes."
    },
    "category": "sports",
    "difficulty": "medium",
    "tags": [
      "golf",
      "rules"
    ],
    "similarityGroup": "golf_low_score"
  },
  {
    "id": "tf_zombie_modern_horror_true",
    "answer": "true",
    "statement": {
      "en": "Zombies are a major creature type in modern horror fiction.",
      "ar": "الزومبي من الكائنات الرئيسية في خيال الرعب الحديث."
    },
    "category": "horror",
    "difficulty": "medium",
    "tags": [
      "zombies",
      "horror"
    ],
    "similarityGroup": "zombie_modern_horror"
  },
  {
    "id": "tf_zombie_modern_horror_fake",
    "answer": "fake",
    "statement": {
      "en": "Zombies are usually used only as symbols of cooking competitions.",
      "ar": "الزومبي يُستخدمون عادة فقط كرموز لمسابقات الطبخ."
    },
    "category": "horror",
    "difficulty": "medium",
    "tags": [
      "zombies",
      "horror"
    ],
    "similarityGroup": "zombie_modern_horror"
  },
  {
    "id": "tf_dracula_bram_stoker_true",
    "answer": "true",
    "statement": {
      "en": "Dracula was written by Bram Stoker.",
      "ar": "رواية دراكولا كتبها برام ستوكر."
    },
    "category": "horror",
    "difficulty": "medium",
    "tags": [
      "dracula",
      "literature"
    ],
    "similarityGroup": "dracula_bram_stoker"
  },
  {
    "id": "tf_dracula_bram_stoker_fake",
    "answer": "fake",
    "statement": {
      "en": "Dracula was written by a toaster.",
      "ar": "دراكولا كتبها جهاز تحميص خبز."
    },
    "category": "horror",
    "difficulty": "medium",
    "tags": [
      "dracula",
      "literature"
    ],
    "similarityGroup": "dracula_bram_stoker"
  },
  {
    "id": "tf_frankenstein_mary_shelley_true",
    "answer": "true",
    "statement": {
      "en": "Frankenstein was written by Mary Shelley.",
      "ar": "فرانكنشتاين كتبته ماري شيلي."
    },
    "category": "horror",
    "difficulty": "medium",
    "tags": [
      "frankenstein",
      "literature"
    ],
    "similarityGroup": "frankenstein_mary_shelley"
  },
  {
    "id": "tf_frankenstein_mary_shelley_fake",
    "answer": "fake",
    "statement": {
      "en": "فرانكنشتاين كتبه أحد الديناصورات.",
      "ar": "Frankenstein was written by a dinosaur."
    },
    "category": "horror",
    "difficulty": "medium",
    "tags": [
      "frankenstein",
      "literature"
    ],
    "similarityGroup": "frankenstein_mary_shelley"
  },
  {
    "id": "tf_jack_o_lantern_pumpkin_true",
    "answer": "true",
    "statement": {
      "en": "Jack-o’-lanterns are commonly carved from pumpkins.",
      "ar": "فوانيس الهالوين غالبًا تُنحت من اليقطين."
    },
    "category": "horror",
    "difficulty": "medium",
    "tags": [
      "halloween",
      "pumpkin"
    ],
    "similarityGroup": "jack_o_lantern_pumpkin"
  },
  {
    "id": "tf_jack_o_lantern_pumpkin_fake",
    "answer": "fake",
    "statement": {
      "en": "Jack-o’-lanterns are commonly carved from ice cream.",
      "ar": "فوانيس الهالوين غالبًا تُنحت من الآيس كريم."
    },
    "category": "horror",
    "difficulty": "medium",
    "tags": [
      "halloween",
      "pumpkin"
    ],
    "similarityGroup": "jack_o_lantern_pumpkin"
  },
  {
    "id": "tf_bats_echolocation_true",
    "answer": "true",
    "statement": {
      "en": "Many bats use echolocation.",
      "ar": "كثير من الخفافيش تستخدم تحديد الموقع بالصدى."
    },
    "category": "horror",
    "difficulty": "medium",
    "tags": [
      "bats",
      "echolocation"
    ],
    "similarityGroup": "bats_echolocation"
  },
  {
    "id": "tf_bats_echolocation_fake",
    "answer": "fake",
    "statement": {
      "en": "All bats navigate by reading street signs only.",
      "ar": "كل الخفافيش تتنقل فقط بقراءة لافتات الشوارع."
    },
    "category": "horror",
    "difficulty": "medium",
    "tags": [
      "bats",
      "echolocation"
    ],
    "similarityGroup": "bats_echolocation"
  },
  {
    "id": "tf_black_cats_superstition_true",
    "answer": "true",
    "statement": {
      "en": "Black cats are linked to superstition in some cultures.",
      "ar": "القطط السوداء مرتبطة بالخرافات في بعض الثقافات."
    },
    "category": "horror",
    "difficulty": "medium",
    "tags": [
      "black_cats",
      "superstition"
    ],
    "similarityGroup": "black_cats_superstition"
  },
  {
    "id": "tf_black_cats_superstition_fake",
    "answer": "fake",
    "statement": {
      "en": "Black cats are legally required to be astronauts.",
      "ar": "القطط السوداء ملزمة قانونيًا بأن تكون رواد فضاء."
    },
    "category": "horror",
    "difficulty": "medium",
    "tags": [
      "black_cats",
      "superstition"
    ],
    "similarityGroup": "black_cats_superstition"
  },
  {
    "id": "tf_emojis_unicode_true",
    "answer": "true",
    "statement": {
      "en": "Many emojis are standardized through Unicode.",
      "ar": "كثير من الإيموجي يتم توحيده عبر يونيكود."
    },
    "category": "internet",
    "difficulty": "medium",
    "tags": [
      "emoji",
      "unicode"
    ],
    "similarityGroup": "emojis_unicode"
  },
  {
    "id": "tf_emojis_unicode_fake",
    "answer": "fake",
    "statement": {
      "en": "Emojis are standardized only by weather forecasts.",
      "ar": "الإيموجي يتم توحيده فقط بواسطة نشرات الطقس."
    },
    "category": "internet",
    "difficulty": "medium",
    "tags": [
      "emoji",
      "unicode"
    ],
    "similarityGroup": "emojis_unicode"
  },
  {
    "id": "tf_hashtag_symbol_true",
    "answer": "true",
    "statement": {
      "en": "A hashtag uses the # symbol.",
      "ar": "الهاشتاغ يستخدم رمز #."
    },
    "category": "internet",
    "difficulty": "medium",
    "tags": [
      "hashtag",
      "social"
    ],
    "similarityGroup": "hashtag_symbol"
  },
  {
    "id": "tf_hashtag_symbol_fake",
    "answer": "fake",
    "statement": {
      "en": "الهاشتاغ يستخدم رمز القمر فقط.",
      "ar": "A hashtag uses only the moon symbol."
    },
    "category": "internet",
    "difficulty": "medium",
    "tags": [
      "hashtag",
      "social"
    ],
    "similarityGroup": "hashtag_symbol"
  },
  {
    "id": "tf_jupiter_ganymede_largest_moon_true",
    "answer": "true",
    "statement": {
      "en": "Ganymede, a moon of Jupiter, is the largest moon in the Solar System.",
      "ar": "غانيميد، قمر المشتري، هو أكبر قمر في المجموعة الشمسية."
    },
    "category": "space",
    "difficulty": "hard",
    "tags": [
      "ganymede",
      "moons"
    ],
    "similarityGroup": "jupiter_ganymede_largest_moon"
  },
  {
    "id": "tf_jupiter_ganymede_largest_moon_fake",
    "answer": "fake",
    "statement": {
      "en": "Phobos, a moon of Mars, is the largest moon in the Solar System.",
      "ar": "فوبوس، قمر المريخ، هو أكبر قمر في المجموعة الشمسية."
    },
    "category": "space",
    "difficulty": "hard",
    "tags": [
      "ganymede",
      "moons"
    ],
    "similarityGroup": "jupiter_ganymede_largest_moon"
  },
  {
    "id": "tf_titan_thick_atmosphere_true",
    "answer": "true",
    "statement": {
      "en": "Titan, Saturn’s largest moon, has a thick atmosphere.",
      "ar": "تيتان، أكبر أقمار زحل، له غلاف جوي كثيف."
    },
    "category": "space",
    "difficulty": "hard",
    "tags": [
      "titan",
      "saturn"
    ],
    "similarityGroup": "titan_thick_atmosphere"
  },
  {
    "id": "tf_titan_thick_atmosphere_fake",
    "answer": "fake",
    "statement": {
      "en": "Titan has no atmosphere at all.",
      "ar": "تيتان لا يملك أي غلاف جوي إطلاقًا."
    },
    "category": "space",
    "difficulty": "hard",
    "tags": [
      "titan",
      "saturn"
    ],
    "similarityGroup": "titan_thick_atmosphere"
  },
  {
    "id": "tf_pluto_dwarf_planet_true",
    "answer": "true",
    "statement": {
      "en": "Pluto is classified as a dwarf planet.",
      "ar": "بلوتو مصنف ككوكب قزم."
    },
    "category": "space",
    "difficulty": "hard",
    "tags": [
      "pluto",
      "dwarf_planet"
    ],
    "similarityGroup": "pluto_dwarf_planet"
  },
  {
    "id": "tf_pluto_dwarf_planet_fake",
    "answer": "fake",
    "statement": {
      "en": "Pluto is currently classified as a gas giant planet.",
      "ar": "بلوتو مصنف حاليًا ككوكب غازي عملاق."
    },
    "category": "space",
    "difficulty": "hard",
    "tags": [
      "pluto",
      "dwarf_planet"
    ],
    "similarityGroup": "pluto_dwarf_planet"
  },
  {
    "id": "tf_ceres_dwarf_planet_true",
    "answer": "true",
    "statement": {
      "en": "Ceres is classified as a dwarf planet.",
      "ar": "سيريس مصنف ككوكب قزم."
    },
    "category": "space",
    "difficulty": "hard",
    "tags": [
      "ceres",
      "dwarf_planet"
    ],
    "similarityGroup": "ceres_dwarf_planet"
  },
  {
    "id": "tf_ceres_dwarf_planet_fake",
    "answer": "fake",
    "statement": {
      "en": "Ceres is classified as a star larger than the Sun.",
      "ar": "سيريس مصنف كنجم أكبر من الشمس."
    },
    "category": "space",
    "difficulty": "hard",
    "tags": [
      "ceres",
      "dwarf_planet"
    ],
    "similarityGroup": "ceres_dwarf_planet"
  },
  {
    "id": "tf_sun_mass_solar_system_true",
    "answer": "true",
    "statement": {
      "en": "The Sun contains the vast majority of the Solar System’s mass.",
      "ar": "الشمس تحتوي على الغالبية العظمى من كتلة المجموعة الشمسية."
    },
    "category": "space",
    "difficulty": "hard",
    "tags": [
      "sun",
      "mass"
    ],
    "similarityGroup": "sun_mass_solar_system"
  },
  {
    "id": "tf_sun_mass_solar_system_fake",
    "answer": "fake",
    "statement": {
      "en": "The asteroid belt contains more mass than the Sun.",
      "ar": "حزام الكويكبات يحتوي على كتلة أكبر من الشمس."
    },
    "category": "space",
    "difficulty": "hard",
    "tags": [
      "sun",
      "mass"
    ],
    "similarityGroup": "sun_mass_solar_system"
  },
  {
    "id": "tf_absolute_zero_true",
    "answer": "true",
    "statement": {
      "en": "Absolute zero is 0 kelvin.",
      "ar": "الصفر المطلق هو 0 كلفن."
    },
    "category": "science",
    "difficulty": "hard",
    "tags": [
      "physics",
      "temperature"
    ],
    "similarityGroup": "absolute_zero"
  },
  {
    "id": "tf_absolute_zero_fake",
    "answer": "fake",
    "statement": {
      "en": "Absolute zero is exactly 100 degrees Celsius.",
      "ar": "الصفر المطلق يساوي بالضبط 100 درجة مئوية."
    },
    "category": "science",
    "difficulty": "hard",
    "tags": [
      "physics",
      "temperature"
    ],
    "similarityGroup": "absolute_zero"
  },
  {
    "id": "tf_speed_of_light_vacuum_true",
    "answer": "true",
    "statement": {
      "en": "Light in a vacuum travels at about 299,792 kilometers per second.",
      "ar": "ينتقل الضوء في الفراغ بسرعة حوالي 299,792 كيلومترًا في الثانية."
    },
    "category": "science",
    "difficulty": "hard",
    "tags": [
      "physics",
      "light"
    ],
    "similarityGroup": "speed_of_light_vacuum"
  },
  {
    "id": "tf_speed_of_light_vacuum_fake",
    "answer": "fake",
    "statement": {
      "en": "Light in a vacuum travels at about 3 kilometers per hour.",
      "ar": "ينتقل الضوء في الفراغ بسرعة حوالي 3 كيلومترات في الساعة."
    },
    "category": "science",
    "difficulty": "hard",
    "tags": [
      "physics",
      "light"
    ],
    "similarityGroup": "speed_of_light_vacuum"
  },
  {
    "id": "tf_helium_atomic_number_true",
    "answer": "true",
    "statement": {
      "en": "Helium has atomic number 2.",
      "ar": "الهيليوم عدده الذري 2."
    },
    "category": "science",
    "difficulty": "hard",
    "tags": [
      "chemistry",
      "helium"
    ],
    "similarityGroup": "helium_atomic_number"
  },
  {
    "id": "tf_helium_atomic_number_fake",
    "answer": "fake",
    "statement": {
      "en": "Helium has atomic number 200.",
      "ar": "الهيليوم عدده الذري 200."
    },
    "category": "science",
    "difficulty": "hard",
    "tags": [
      "chemistry",
      "helium"
    ],
    "similarityGroup": "helium_atomic_number"
  },
  {
    "id": "tf_sodium_symbol_na_true",
    "answer": "true",
    "statement": {
      "en": "The chemical symbol for sodium is Na.",
      "ar": "الرمز الكيميائي للصوديوم هو Na."
    },
    "category": "science",
    "difficulty": "hard",
    "tags": [
      "chemistry",
      "sodium"
    ],
    "similarityGroup": "sodium_symbol_na"
  },
  {
    "id": "tf_sodium_symbol_na_fake",
    "answer": "fake",
    "statement": {
      "en": "The chemical symbol for sodium is So.",
      "ar": "الرمز الكيميائي للصوديوم هو So."
    },
    "category": "science",
    "difficulty": "hard",
    "tags": [
      "chemistry",
      "sodium"
    ],
    "similarityGroup": "sodium_symbol_na"
  },
  {
    "id": "tf_potassium_symbol_k_true",
    "answer": "true",
    "statement": {
      "en": "The chemical symbol for potassium is K.",
      "ar": "الرمز الكيميائي للبوتاسيوم هو K."
    },
    "category": "science",
    "difficulty": "hard",
    "tags": [
      "chemistry",
      "potassium"
    ],
    "similarityGroup": "potassium_symbol_k"
  },
  {
    "id": "tf_potassium_symbol_k_fake",
    "answer": "fake",
    "statement": {
      "en": "The chemical symbol for potassium is Pt.",
      "ar": "الرمز الكيميائي للبوتاسيوم هو Pt."
    },
    "category": "science",
    "difficulty": "hard",
    "tags": [
      "chemistry",
      "potassium"
    ],
    "similarityGroup": "potassium_symbol_k"
  },
  {
    "id": "tf_mitochondria_own_dna_true",
    "answer": "true",
    "statement": {
      "en": "Mitochondria have their own DNA.",
      "ar": "الميتوكوندريا لديها DNA خاص بها."
    },
    "category": "science",
    "difficulty": "hard",
    "tags": [
      "biology",
      "mitochondria"
    ],
    "similarityGroup": "mitochondria_own_dna"
  },
  {
    "id": "tf_mitochondria_own_dna_fake",
    "answer": "fake",
    "statement": {
      "en": "Mitochondria are made entirely of glass and have no DNA.",
      "ar": "الميتوكوندريا مصنوعة بالكامل من الزجاج ولا تملك DNA."
    },
    "category": "science",
    "difficulty": "hard",
    "tags": [
      "biology",
      "mitochondria"
    ],
    "similarityGroup": "mitochondria_own_dna"
  },
  {
    "id": "tf_human_chromosomes_46_true",
    "answer": "true",
    "statement": {
      "en": "Most human body cells have 46 chromosomes.",
      "ar": "معظم خلايا جسم الإنسان تحتوي على 46 كروموسومًا."
    },
    "category": "science",
    "difficulty": "hard",
    "tags": [
      "biology",
      "chromosomes"
    ],
    "similarityGroup": "human_chromosomes_46"
  },
  {
    "id": "tf_human_chromosomes_46_fake",
    "answer": "fake",
    "statement": {
      "en": "Most human body cells have exactly 4,600 chromosomes.",
      "ar": "معظم خلايا جسم الإنسان تحتوي بالضبط على 4600 كروموسوم."
    },
    "category": "science",
    "difficulty": "hard",
    "tags": [
      "biology",
      "chromosomes"
    ],
    "similarityGroup": "human_chromosomes_46"
  },
  {
    "id": "tf_noble_gases_low_reactivity_true",
    "answer": "true",
    "statement": {
      "en": "Noble gases are generally very unreactive compared with many other elements.",
      "ar": "الغازات النبيلة قليلة التفاعل عمومًا مقارنة بكثير من العناصر الأخرى."
    },
    "category": "science",
    "difficulty": "hard",
    "tags": [
      "chemistry",
      "noble_gases"
    ],
    "similarityGroup": "noble_gases_low_reactivity"
  },
  {
    "id": "tf_noble_gases_low_reactivity_fake",
    "answer": "fake",
    "statement": {
      "en": "Noble gases are named that because they are all liquid metals.",
      "ar": "سميت الغازات النبيلة كذلك لأنها كلها معادن سائلة."
    },
    "category": "science",
    "difficulty": "hard",
    "tags": [
      "chemistry",
      "noble_gases"
    ],
    "similarityGroup": "noble_gases_low_reactivity"
  },
  {
    "id": "tf_ph_scale_acid_low_true",
    "answer": "true",
    "statement": {
      "en": "On the pH scale, lower values are more acidic.",
      "ar": "في مقياس pH، القيم الأقل تكون أكثر حموضة."
    },
    "category": "science",
    "difficulty": "hard",
    "tags": [
      "chemistry",
      "ph"
    ],
    "similarityGroup": "ph_scale_acid_low"
  },
  {
    "id": "tf_ph_scale_acid_low_fake",
    "answer": "fake",
    "statement": {
      "en": "On the pH scale, lower values are always more basic.",
      "ar": "في مقياس pH، القيم الأقل دائمًا أكثر قاعدية."
    },
    "category": "science",
    "difficulty": "hard",
    "tags": [
      "chemistry",
      "ph"
    ],
    "similarityGroup": "ph_scale_acid_low"
  },
  {
    "id": "tf_blood_plasma_component_true",
    "answer": "true",
    "statement": {
      "en": "Plasma is the liquid component of blood.",
      "ar": "البلازما هي المكون السائل في الدم."
    },
    "category": "science",
    "difficulty": "hard",
    "tags": [
      "biology",
      "blood"
    ],
    "similarityGroup": "blood_plasma_component"
  },
  {
    "id": "tf_blood_plasma_component_fake",
    "answer": "fake",
    "statement": {
      "en": "Plasma is the bone inside every red blood cell.",
      "ar": "البلازما هي العظمة داخل كل خلية دم حمراء."
    },
    "category": "science",
    "difficulty": "hard",
    "tags": [
      "biology",
      "blood"
    ],
    "similarityGroup": "blood_plasma_component"
  },
  {
    "id": "tf_koala_fingerprints_true",
    "answer": "true",
    "statement": {
      "en": "Koalas have fingerprints that can look surprisingly similar to human fingerprints.",
      "ar": "للكوالا بصمات أصابع قد تبدو مشابهة بشكل مفاجئ لبصمات الإنسان."
    },
    "category": "animals",
    "difficulty": "hard",
    "tags": [
      "koala",
      "fingerprints"
    ],
    "similarityGroup": "koala_fingerprints"
  },
  {
    "id": "tf_koala_fingerprints_fake",
    "answer": "fake",
    "statement": {
      "en": "Koalas have no fingers or toes at all.",
      "ar": "الكوالا لا يملك أصابع يد أو قدم إطلاقًا."
    },
    "category": "animals",
    "difficulty": "hard",
    "tags": [
      "koala",
      "fingerprints"
    ],
    "similarityGroup": "koala_fingerprints"
  },
  {
    "id": "tf_sloths_slow_metabolism_true",
    "answer": "true",
    "statement": {
      "en": "Sloths are known for slow movement and slow metabolism.",
      "ar": "الكسلان معروف بحركته البطيئة وأيضه البطيء."
    },
    "category": "animals",
    "difficulty": "hard",
    "tags": [
      "sloths",
      "metabolism"
    ],
    "similarityGroup": "sloths_slow_metabolism"
  },
  {
    "id": "tf_sloths_slow_metabolism_fake",
    "answer": "fake",
    "statement": {
      "en": "Sloths are known for being the fastest land animals.",
      "ar": "الكسلان معروف بأنه أسرع الحيوانات البرية."
    },
    "category": "animals",
    "difficulty": "hard",
    "tags": [
      "sloths",
      "metabolism"
    ],
    "similarityGroup": "sloths_slow_metabolism"
  },
  {
    "id": "tf_axolotl_regeneration_true",
    "answer": "true",
    "statement": {
      "en": "Axolotls are known for strong regenerative abilities.",
      "ar": "الأكسولوتل معروف بقدرات تجدد قوية."
    },
    "category": "animals",
    "difficulty": "hard",
    "tags": [
      "axolotl",
      "regeneration"
    ],
    "similarityGroup": "axolotl_regeneration"
  },
  {
    "id": "tf_axolotl_regeneration_fake",
    "answer": "fake",
    "statement": {
      "en": "Axolotls are famous because they cannot heal any tissue.",
      "ar": "الأكسولوتل مشهور بأنه لا يستطيع شفاء أي نسيج."
    },
    "category": "animals",
    "difficulty": "hard",
    "tags": [
      "axolotl",
      "regeneration"
    ],
    "similarityGroup": "axolotl_regeneration"
  },
  {
    "id": "tf_mantis_shrimp_vision_true",
    "answer": "true",
    "statement": {
      "en": "Mantis shrimp are famous for complex vision.",
      "ar": "روبيان السرعوف مشهور برؤية معقدة."
    },
    "category": "animals",
    "difficulty": "hard",
    "tags": [
      "mantis_shrimp",
      "vision"
    ],
    "similarityGroup": "mantis_shrimp_vision"
  },
  {
    "id": "tf_mantis_shrimp_vision_fake",
    "answer": "fake",
    "statement": {
      "en": "Mantis shrimp are blind and have no eyes.",
      "ar": "روبيان السرعوف أعمى ولا يملك عيونًا."
    },
    "category": "animals",
    "difficulty": "hard",
    "tags": [
      "mantis_shrimp",
      "vision"
    ],
    "similarityGroup": "mantis_shrimp_vision"
  },
  {
    "id": "tf_tardigrades_extreme_survival_true",
    "answer": "true",
    "statement": {
      "en": "Tardigrades can survive extreme conditions.",
      "ar": "بطيئات المشية تستطيع البقاء في ظروف قاسية."
    },
    "category": "animals",
    "difficulty": "hard",
    "tags": [
      "tardigrades",
      "survival"
    ],
    "similarityGroup": "tardigrades_extreme_survival"
  },
  {
    "id": "tf_tardigrades_extreme_survival_fake",
    "answer": "fake",
    "statement": {
      "en": "Tardigrades instantly disappear in normal room temperature.",
      "ar": "بطيئات المشية تختفي فورًا في درجة حرارة الغرفة العادية."
    },
    "category": "animals",
    "difficulty": "hard",
    "tags": [
      "tardigrades",
      "survival"
    ],
    "similarityGroup": "tardigrades_extreme_survival"
  },
  {
    "id": "tf_horseshoe_crab_blue_blood_true",
    "answer": "true",
    "statement": {
      "en": "Horseshoe crabs have blue blood.",
      "ar": "سلطعونات حدوة الحصان لها دم أزرق."
    },
    "category": "animals",
    "difficulty": "hard",
    "tags": [
      "horseshoe_crab",
      "blood"
    ],
    "similarityGroup": "horseshoe_crab_blue_blood"
  },
  {
    "id": "tf_horseshoe_crab_blue_blood_fake",
    "answer": "fake",
    "statement": {
      "en": "Horseshoe crabs have green wooden blood.",
      "ar": "سلطعونات حدوة الحصان لها دم خشبي أخضر."
    },
    "category": "animals",
    "difficulty": "hard",
    "tags": [
      "horseshoe_crab",
      "blood"
    ],
    "similarityGroup": "horseshoe_crab_blue_blood"
  },
  {
    "id": "tf_pufferfish_poison_true",
    "answer": "true",
    "statement": {
      "en": "Some pufferfish contain a powerful toxin.",
      "ar": "بعض أسماك الفوغو تحتوي على سم قوي."
    },
    "category": "animals",
    "difficulty": "hard",
    "tags": [
      "pufferfish",
      "toxin"
    ],
    "similarityGroup": "pufferfish_poison"
  },
  {
    "id": "tf_pufferfish_poison_fake",
    "answer": "fake",
    "statement": {
      "en": "All pufferfish are made of cotton candy.",
      "ar": "كل أسماك الفوغو مصنوعة من غزل البنات."
    },
    "category": "animals",
    "difficulty": "hard",
    "tags": [
      "pufferfish",
      "toxin"
    ],
    "similarityGroup": "pufferfish_poison"
  },
  {
    "id": "tf_lyrebird_mimicry_true",
    "answer": "true",
    "statement": {
      "en": "Lyrebirds are known for impressive sound mimicry.",
      "ar": "طيور الليرا معروفة بقدرتها المدهشة على تقليد الأصوات."
    },
    "category": "animals",
    "difficulty": "hard",
    "tags": [
      "lyrebird",
      "mimicry"
    ],
    "similarityGroup": "lyrebird_mimicry"
  },
  {
    "id": "tf_lyrebird_mimicry_fake",
    "answer": "fake",
    "statement": {
      "en": "Lyrebirds are known for never making any sound.",
      "ar": "طيور الليرا معروفة بأنها لا تصدر أي صوت إطلاقًا."
    },
    "category": "animals",
    "difficulty": "hard",
    "tags": [
      "lyrebird",
      "mimicry"
    ],
    "similarityGroup": "lyrebird_mimicry"
  },
  {
    "id": "tf_rhubarb_leaves_toxic_true",
    "answer": "true",
    "statement": {
      "en": "Rhubarb leaves contain toxic compounds and should not be eaten.",
      "ar": "أوراق الراوند تحتوي على مركبات سامة ولا ينبغي أكلها."
    },
    "category": "food",
    "difficulty": "hard",
    "tags": [
      "rhubarb",
      "toxicity"
    ],
    "similarityGroup": "rhubarb_leaves_toxic"
  },
  {
    "id": "tf_rhubarb_leaves_toxic_fake",
    "answer": "fake",
    "statement": {
      "en": "Rhubarb leaves are the safest part to eat in unlimited amounts.",
      "ar": "أوراق الراوند هي أكثر جزء آمن للأكل بلا حدود."
    },
    "category": "food",
    "difficulty": "hard",
    "tags": [
      "rhubarb",
      "toxicity"
    ],
    "similarityGroup": "rhubarb_leaves_toxic"
  },
  {
    "id": "tf_nutmeg_toxic_large_amounts_true",
    "answer": "true",
    "statement": {
      "en": "Nutmeg can be toxic in large amounts.",
      "ar": "جوزة الطيب يمكن أن تكون سامة بكميات كبيرة."
    },
    "category": "food",
    "difficulty": "hard",
    "tags": [
      "nutmeg",
      "toxicity"
    ],
    "similarityGroup": "nutmeg_toxic_large_amounts"
  },
  {
    "id": "tf_nutmeg_toxic_large_amounts_fake",
    "answer": "fake",
    "statement": {
      "en": "Nutmeg is completely harmless in any amount.",
      "ar": "جوزة الطيب غير ضارة إطلاقًا بأي كمية."
    },
    "category": "food",
    "difficulty": "hard",
    "tags": [
      "nutmeg",
      "toxicity"
    ],
    "similarityGroup": "nutmeg_toxic_large_amounts"
  },
  {
    "id": "tf_cashews_seed_true",
    "answer": "true",
    "statement": {
      "en": "Cashews are seeds that grow from the cashew apple.",
      "ar": "الكاجو بذور تنمو من تفاحة الكاجو."
    },
    "category": "food",
    "difficulty": "hard",
    "tags": [
      "cashew",
      "seed"
    ],
    "similarityGroup": "cashews_seed"
  },
  {
    "id": "tf_cashews_seed_fake",
    "answer": "fake",
    "statement": {
      "en": "Cashews grow as tiny fish scales.",
      "ar": "الكاجو ينمو كقشور سمك صغيرة."
    },
    "category": "food",
    "difficulty": "hard",
    "tags": [
      "cashew",
      "seed"
    ],
    "similarityGroup": "cashews_seed"
  },
  {
    "id": "tf_cinnamon_bark_true",
    "answer": "true",
    "statement": {
      "en": "Cinnamon comes from tree bark.",
      "ar": "القرفة تأتي من لحاء الشجر."
    },
    "category": "food",
    "difficulty": "hard",
    "tags": [
      "cinnamon",
      "bark"
    ],
    "similarityGroup": "cinnamon_bark"
  },
  {
    "id": "tf_cinnamon_bark_fake",
    "answer": "fake",
    "statement": {
      "en": "Cinnamon comes from whale feathers.",
      "ar": "القرفة تأتي من ريش الحيتان."
    },
    "category": "food",
    "difficulty": "hard",
    "tags": [
      "cinnamon",
      "bark"
    ],
    "similarityGroup": "cinnamon_bark"
  },
  {
    "id": "tf_pineapple_multiple_fruit_true",
    "answer": "true",
    "statement": {
      "en": "A pineapple is a multiple fruit formed from many flowers.",
      "ar": "الأناناس ثمرة مركبة تتكون من أزهار كثيرة."
    },
    "category": "food",
    "difficulty": "hard",
    "tags": [
      "pineapple",
      "botany"
    ],
    "similarityGroup": "pineapple_multiple_fruit"
  },
  {
    "id": "tf_pineapple_multiple_fruit_fake",
    "answer": "fake",
    "statement": {
      "en": "A pineapple is a single metal bolt grown underground.",
      "ar": "الأناناس مسمار معدني واحد ينمو تحت الأرض."
    },
    "category": "food",
    "difficulty": "hard",
    "tags": [
      "pineapple",
      "botany"
    ],
    "similarityGroup": "pineapple_multiple_fruit"
  },
  {
    "id": "tf_alaska_west_east_true",
    "answer": "true",
    "statement": {
      "en": "Alaska extends far enough west to cross the 180th meridian.",
      "ar": "ألاسكا تمتد غربًا بما يكفي لعبور خط الطول 180."
    },
    "category": "geography",
    "difficulty": "hard",
    "tags": [
      "alaska",
      "longitude"
    ],
    "similarityGroup": "alaska_west_east"
  },
  {
    "id": "tf_alaska_west_east_fake",
    "answer": "fake",
    "statement": {
      "en": "Alaska is located entirely inside the Mediterranean Sea.",
      "ar": "ألاسكا تقع بالكامل داخل البحر المتوسط."
    },
    "category": "geography",
    "difficulty": "hard",
    "tags": [
      "alaska",
      "longitude"
    ],
    "similarityGroup": "alaska_west_east"
  },
  {
    "id": "tf_lake_baikal_deepest_true",
    "answer": "true",
    "statement": {
      "en": "Lake Baikal is often cited as the world’s deepest lake.",
      "ar": "بحيرة بايكال تُذكر غالبًا كأعمق بحيرة في العالم."
    },
    "category": "geography",
    "difficulty": "hard",
    "tags": [
      "baikal",
      "lake"
    ],
    "similarityGroup": "lake_baikal_deepest"
  },
  {
    "id": "tf_lake_baikal_deepest_fake",
    "answer": "fake",
    "statement": {
      "en": "Lake Baikal is a shallow puddle inside a stadium.",
      "ar": "بحيرة بايكال بركة ضحلة داخل ملعب."
    },
    "category": "geography",
    "difficulty": "hard",
    "tags": [
      "baikal",
      "lake"
    ],
    "similarityGroup": "lake_baikal_deepest"
  },
  {
    "id": "tf_ethiopia_not_colonized_italy_longterm_true",
    "answer": "true",
    "statement": {
      "en": "Ethiopia is widely noted for avoiding long-term European colonization.",
      "ar": "إثيوبيا تُذكر على نطاق واسع بأنها تجنبت الاستعمار الأوروبي طويل الأمد."
    },
    "category": "history",
    "difficulty": "hard",
    "tags": [
      "ethiopia",
      "colonial_history"
    ],
    "similarityGroup": "ethiopia_not_colonized_italy_longterm"
  },
  {
    "id": "tf_ethiopia_not_colonized_italy_longterm_fake",
    "answer": "fake",
    "statement": {
      "en": "Ethiopia was located in North America during the Roman Empire.",
      "ar": "كانت إثيوبيا تقع في أمريكا الشمالية أثناء الإمبراطورية الرومانية."
    },
    "category": "history",
    "difficulty": "hard",
    "tags": [
      "ethiopia",
      "colonial_history"
    ],
    "similarityGroup": "ethiopia_not_colonized_italy_longterm"
  },
  {
    "id": "tf_rosetta_stone_scripts_true",
    "answer": "true",
    "statement": {
      "en": "The Rosetta Stone has text in three scripts.",
      "ar": "حجر رشيد يحتوي على نصوص بثلاثة خطوط."
    },
    "category": "history",
    "difficulty": "hard",
    "tags": [
      "rosetta_stone",
      "egypt"
    ],
    "similarityGroup": "rosetta_stone_scripts"
  },
  {
    "id": "tf_rosetta_stone_scripts_fake",
    "answer": "fake",
    "statement": {
      "en": "حجر رشيد مكتوب بلغة برمجة حديثة فقط.",
      "ar": "The Rosetta Stone is written only in a modern programming language."
    },
    "category": "history",
    "difficulty": "hard",
    "tags": [
      "rosetta_stone",
      "egypt"
    ],
    "similarityGroup": "rosetta_stone_scripts"
  },
  {
    "id": "tf_printing_press_gutenberg_true",
    "answer": "true",
    "statement": {
      "en": "Johannes Gutenberg is associated with the movable-type printing press in Europe.",
      "ar": "يوهانس غوتنبرغ مرتبط بالمطبعة ذات الحروف المتحركة في أوروبا."
    },
    "category": "history",
    "difficulty": "hard",
    "tags": [
      "gutenberg",
      "printing"
    ],
    "similarityGroup": "printing_press_gutenberg"
  },
  {
    "id": "tf_printing_press_gutenberg_fake",
    "answer": "fake",
    "statement": {
      "en": "Johannes Gutenberg is mainly known for inventing basketball.",
      "ar": "يوهانس غوتنبرغ معروف أساسًا باختراع كرة السلة."
    },
    "category": "history",
    "difficulty": "hard",
    "tags": [
      "gutenberg",
      "printing"
    ],
    "similarityGroup": "printing_press_gutenberg"
  },
  {
    "id": "tf_magna_carta_1215_true",
    "answer": "true",
    "statement": {
      "en": "Magna Carta was issued in 1215.",
      "ar": "صدرت الماغنا كارتا عام 1215."
    },
    "category": "history",
    "difficulty": "hard",
    "tags": [
      "magna_carta",
      "medieval"
    ],
    "similarityGroup": "magna_carta_1215"
  },
  {
    "id": "tf_magna_carta_1215_fake",
    "answer": "fake",
    "statement": {
      "en": "صدرت الماغنا كارتا عام 2025.",
      "ar": "Magna Carta was issued in 2025."
    },
    "category": "history",
    "difficulty": "hard",
    "tags": [
      "magna_carta",
      "medieval"
    ],
    "similarityGroup": "magna_carta_1215"
  },
  {
    "id": "tf_tutankhamun_tomb_1922_true",
    "answer": "true",
    "statement": {
      "en": "Tutankhamun’s tomb was discovered in 1922.",
      "ar": "اكتُشفت مقبرة توت عنخ آمون عام 1922."
    },
    "category": "history",
    "difficulty": "hard",
    "tags": [
      "tutankhamun",
      "egypt"
    ],
    "similarityGroup": "tutankhamun_tomb_1922"
  },
  {
    "id": "tf_tutankhamun_tomb_1922_fake",
    "answer": "fake",
    "statement": {
      "en": "اكتُشفت مقبرة توت عنخ آمون عام 22 قبل الميلاد بواسطة هاتف ذكي.",
      "ar": "Tutankhamun’s tomb was discovered in 22 BC by a smartphone."
    },
    "category": "history",
    "difficulty": "hard",
    "tags": [
      "tutankhamun",
      "egypt"
    ],
    "similarityGroup": "tutankhamun_tomb_1922"
  },
  {
    "id": "tf_byzantium_constantinople_istanbul_true",
    "answer": "true",
    "statement": {
      "en": "The city now called Istanbul was formerly known as Constantinople.",
      "ar": "المدينة المعروفة الآن بإسطنبول كانت تُعرف سابقًا بالقسطنطينية."
    },
    "category": "history",
    "difficulty": "hard",
    "tags": [
      "istanbul",
      "constantinople"
    ],
    "similarityGroup": "byzantium_constantinople_istanbul"
  },
  {
    "id": "tf_byzantium_constantinople_istanbul_fake",
    "answer": "fake",
    "statement": {
      "en": "The city now called Istanbul was formerly known as Minecraft City.",
      "ar": "المدينة المعروفة الآن بإسطنبول كانت تُعرف سابقًا باسم ماينكرافت سيتي."
    },
    "category": "history",
    "difficulty": "hard",
    "tags": [
      "istanbul",
      "constantinople"
    ],
    "similarityGroup": "byzantium_constantinople_istanbul"
  },
  {
    "id": "tf_ampersand_et_true",
    "answer": "true",
    "statement": {
      "en": "The ampersand symbol evolved from the Latin word “et”.",
      "ar": "رمز & تطور من الكلمة اللاتينية “et”."
    },
    "category": "language",
    "difficulty": "hard",
    "tags": [
      "ampersand",
      "latin"
    ],
    "similarityGroup": "ampersand_et"
  },
  {
    "id": "tf_ampersand_et_fake",
    "answer": "fake",
    "statement": {
      "en": "رمز & تطور من صورة بطاطس مقلية.",
      "ar": "The ampersand symbol evolved from a picture of french fries."
    },
    "category": "language",
    "difficulty": "hard",
    "tags": [
      "ampersand",
      "latin"
    ],
    "similarityGroup": "ampersand_et"
  },
  {
    "id": "tf_arabic_abjad_roots_true",
    "answer": "true",
    "statement": {
      "en": "Arabic script is an abjad, where consonants are central to the writing system.",
      "ar": "الخط العربي أبجد، حيث تكون الحروف الساكنة مركزية في نظام الكتابة."
    },
    "category": "language",
    "difficulty": "hard",
    "tags": [
      "arabic",
      "abjad"
    ],
    "similarityGroup": "arabic_abjad_roots"
  },
  {
    "id": "tf_arabic_abjad_roots_fake",
    "answer": "fake",
    "statement": {
      "en": "Arabic script uses only emoji and no letters.",
      "ar": "الخط العربي يستخدم الإيموجي فقط ولا يستخدم حروفًا."
    },
    "category": "language",
    "difficulty": "hard",
    "tags": [
      "arabic",
      "abjad"
    ],
    "similarityGroup": "arabic_abjad_roots"
  },
  {
    "id": "tf_esperanto_constructed_language_true",
    "answer": "true",
    "statement": {
      "en": "Esperanto is a constructed international auxiliary language.",
      "ar": "الإسبرانتو لغة مصطنعة مساعدة دولية."
    },
    "category": "language",
    "difficulty": "hard",
    "tags": [
      "esperanto",
      "constructed_language"
    ],
    "similarityGroup": "esperanto_constructed_language"
  },
  {
    "id": "tf_esperanto_constructed_language_fake",
    "answer": "fake",
    "statement": {
      "en": "Esperanto is a natural rock found only in volcanoes.",
      "ar": "الإسبرانتو صخرة طبيعية توجد فقط في البراكين."
    },
    "category": "language",
    "difficulty": "hard",
    "tags": [
      "esperanto",
      "constructed_language"
    ],
    "similarityGroup": "esperanto_constructed_language"
  },
  {
    "id": "tf_cyrillic_used_russian_true",
    "answer": "true",
    "statement": {
      "en": "Russian is written using the Cyrillic script.",
      "ar": "الروسية تُكتب باستخدام الأبجدية السيريلية."
    },
    "category": "language",
    "difficulty": "hard",
    "tags": [
      "russian",
      "cyrillic"
    ],
    "similarityGroup": "cyrillic_used_russian"
  },
  {
    "id": "tf_cyrillic_used_russian_fake",
    "answer": "fake",
    "statement": {
      "en": "Russian is written only with musical notes.",
      "ar": "الروسية تُكتب فقط بالنوتات الموسيقية."
    },
    "category": "language",
    "difficulty": "hard",
    "tags": [
      "russian",
      "cyrillic"
    ],
    "similarityGroup": "cyrillic_used_russian"
  },
  {
    "id": "tf_braille_tactile_true",
    "answer": "true",
    "statement": {
      "en": "Braille is a tactile writing system.",
      "ar": "برايل نظام كتابة لمسي."
    },
    "category": "language",
    "difficulty": "hard",
    "tags": [
      "braille",
      "accessibility"
    ],
    "similarityGroup": "braille_tactile"
  },
  {
    "id": "tf_braille_tactile_fake",
    "answer": "fake",
    "statement": {
      "en": "برايل نظام طيران للطائرات الورقية فقط.",
      "ar": "Braille is a kite-flying system only."
    },
    "category": "language",
    "difficulty": "hard",
    "tags": [
      "braille",
      "accessibility"
    ],
    "similarityGroup": "braille_tactile"
  },
  {
    "id": "tf_first_video_game_tennis_for_two_true",
    "answer": "true",
    "statement": {
      "en": "Tennis for Two is often cited among the earliest video games.",
      "ar": "تُذكر Tennis for Two غالبًا ضمن أوائل ألعاب الفيديو."
    },
    "category": "games",
    "difficulty": "hard",
    "tags": [
      "video_games",
      "history"
    ],
    "similarityGroup": "first_video_game_tennis_for_two"
  },
  {
    "id": "tf_first_video_game_tennis_for_two_fake",
    "answer": "fake",
    "statement": {
      "en": "Tennis for Two is a medieval sword used by knights.",
      "ar": "Tennis for Two سيف من العصور الوسطى استخدمه الفرسان."
    },
    "category": "games",
    "difficulty": "hard",
    "tags": [
      "video_games",
      "history"
    ],
    "similarityGroup": "first_video_game_tennis_for_two"
  },
  {
    "id": "tf_doom_1993_true",
    "answer": "true",
    "statement": {
      "en": "Doom was released in 1993.",
      "ar": "صدرت لعبة Doom في عام 1993."
    },
    "category": "games",
    "difficulty": "hard",
    "tags": [
      "doom",
      "fps"
    ],
    "similarityGroup": "doom_1993"
  },
  {
    "id": "tf_doom_1993_fake",
    "answer": "fake",
    "statement": {
      "en": "صدرت لعبة Doom في عام 1493 على جهاز بلايستيشن 9.",
      "ar": "Doom was released in 1493 on PlayStation 9."
    },
    "category": "games",
    "difficulty": "hard",
    "tags": [
      "doom",
      "fps"
    ],
    "similarityGroup": "doom_1993"
  },
  {
    "id": "tf_pokemon_red_green_japan_true",
    "answer": "true",
    "statement": {
      "en": "The first Pokémon games in Japan were Red and Green.",
      "ar": "أول ألعاب بوكيمون في اليابان كانت Red وGreen."
    },
    "category": "games",
    "difficulty": "hard",
    "tags": [
      "pokemon",
      "history"
    ],
    "similarityGroup": "pokemon_red_green_japan"
  },
  {
    "id": "tf_pokemon_red_green_japan_fake",
    "answer": "fake",
    "statement": {
      "en": "أول ألعاب بوكيمون في اليابان كانت Pizza وKeyboard.",
      "ar": "The first Pokémon games in Japan were Pizza and Keyboard."
    },
    "category": "games",
    "difficulty": "hard",
    "tags": [
      "pokemon",
      "history"
    ],
    "similarityGroup": "pokemon_red_green_japan"
  },
  {
    "id": "tf_minecraft_creator_notch_true",
    "answer": "true",
    "statement": {
      "en": "Minecraft was originally created by Markus “Notch” Persson.",
      "ar": "ماينكرافت أنشأها في الأصل ماركوس “نوتش” بيرسون."
    },
    "category": "games",
    "difficulty": "hard",
    "tags": [
      "minecraft",
      "creator"
    ],
    "similarityGroup": "minecraft_creator_notch"
  },
  {
    "id": "tf_minecraft_creator_notch_fake",
    "answer": "fake",
    "statement": {
      "en": "Minecraft was originally created by the Eiffel Tower.",
      "ar": "ماينكرافت أنشأها في الأصل برج إيفل."
    },
    "category": "games",
    "difficulty": "hard",
    "tags": [
      "minecraft",
      "creator"
    ],
    "similarityGroup": "minecraft_creator_notch"
  },
  {
    "id": "tf_tetris_creator_pajitnov_true",
    "answer": "true",
    "statement": {
      "en": "Tetris was created by Alexey Pajitnov.",
      "ar": "تتريس أنشأها أليكسي باجيتنوف."
    },
    "category": "games",
    "difficulty": "hard",
    "tags": [
      "tetris",
      "creator"
    ],
    "similarityGroup": "tetris_creator_pajitnov"
  },
  {
    "id": "tf_tetris_creator_pajitnov_fake",
    "answer": "fake",
    "statement": {
      "en": "Tetris was created by a sandwich shop menu.",
      "ar": "تتريس أنشأتها قائمة مطعم ساندويتشات."
    },
    "category": "games",
    "difficulty": "hard",
    "tags": [
      "tetris",
      "creator"
    ],
    "similarityGroup": "tetris_creator_pajitnov"
  },
  {
    "id": "tf_url_uniform_resource_locator_true",
    "answer": "true",
    "statement": {
      "en": "URL stands for Uniform Resource Locator.",
      "ar": "URL اختصار لعبارة Uniform Resource Locator."
    },
    "category": "internet",
    "difficulty": "hard",
    "tags": [
      "url",
      "web"
    ],
    "similarityGroup": "url_uniform_resource_locator"
  },
  {
    "id": "tf_url_uniform_resource_locator_fake",
    "answer": "fake",
    "statement": {
      "en": "URL stands for Ultra Rainbow Lemonade.",
      "ar": "URL اختصار لعبارة Ultra Rainbow Lemonade."
    },
    "category": "internet",
    "difficulty": "hard",
    "tags": [
      "url",
      "web"
    ],
    "similarityGroup": "url_uniform_resource_locator"
  },
  {
    "id": "tf_http_stateless_protocol_true",
    "answer": "true",
    "statement": {
      "en": "HTTP is generally described as a stateless protocol.",
      "ar": "HTTP يوصف عمومًا كبروتوكول عديم الحالة."
    },
    "category": "internet",
    "difficulty": "hard",
    "tags": [
      "http",
      "protocol"
    ],
    "similarityGroup": "http_stateless_protocol"
  },
  {
    "id": "tf_http_stateless_protocol_fake",
    "answer": "fake",
    "statement": {
      "en": "HTTP is a type of tropical fruit.",
      "ar": "HTTP نوع من الفاكهة الاستوائية."
    },
    "category": "internet",
    "difficulty": "hard",
    "tags": [
      "http",
      "protocol"
    ],
    "similarityGroup": "http_stateless_protocol"
  },
  {
    "id": "tf_ipv6_128bit_true",
    "answer": "true",
    "statement": {
      "en": "IPv6 addresses are 128 bits long.",
      "ar": "عناوين IPv6 طولها 128 بت."
    },
    "category": "internet",
    "difficulty": "hard",
    "tags": [
      "ipv6",
      "networking"
    ],
    "similarityGroup": "ipv6_128bit"
  },
  {
    "id": "tf_ipv6_128bit_fake",
    "answer": "fake",
    "statement": {
      "en": "عناوين IPv6 طولها 8 بت فقط دائمًا.",
      "ar": "IPv6 addresses are always only 8 bits long."
    },
    "category": "internet",
    "difficulty": "hard",
    "tags": [
      "ipv6",
      "networking"
    ],
    "similarityGroup": "ipv6_128bit"
  },
  {
    "id": "tf_tcp_reliable_stream_true",
    "answer": "true",
    "statement": {
      "en": "TCP provides reliable ordered byte streams.",
      "ar": "TCP يوفر تدفق بايتات مرتب وموثوق."
    },
    "category": "internet",
    "difficulty": "hard",
    "tags": [
      "tcp",
      "networking"
    ],
    "similarityGroup": "tcp_reliable_stream"
  },
  {
    "id": "tf_tcp_reliable_stream_fake",
    "answer": "fake",
    "statement": {
      "en": "TCP is designed only for painting walls.",
      "ar": "TCP مصمم فقط لطلاء الجدران."
    },
    "category": "internet",
    "difficulty": "hard",
    "tags": [
      "tcp",
      "networking"
    ],
    "similarityGroup": "tcp_reliable_stream"
  },
  {
    "id": "tf_lossless_compression_true",
    "answer": "true",
    "statement": {
      "en": "Lossless compression preserves the original data exactly.",
      "ar": "الضغط بدون فقد يحافظ على البيانات الأصلية بدقة."
    },
    "category": "internet",
    "difficulty": "hard",
    "tags": [
      "compression",
      "data"
    ],
    "similarityGroup": "lossless_compression"
  },
  {
    "id": "tf_lossless_compression_fake",
    "answer": "fake",
    "statement": {
      "en": "Lossless compression always destroys half the data permanently.",
      "ar": "الضغط بدون فقد يدمر دائمًا نصف البيانات نهائيًا."
    },
    "category": "internet",
    "difficulty": "hard",
    "tags": [
      "compression",
      "data"
    ],
    "similarityGroup": "lossless_compression"
  },
  {
    "id": "tf_cricket_wicket_true",
    "answer": "true",
    "statement": {
      "en": "In cricket, a wicket can refer to the stumps and bails.",
      "ar": "في الكريكيت، يمكن أن تعني wicket الأعمدة والقطع فوقها."
    },
    "category": "sports",
    "difficulty": "hard",
    "tags": [
      "cricket",
      "rules"
    ],
    "similarityGroup": "cricket_wicket"
  },
  {
    "id": "tf_cricket_wicket_fake",
    "answer": "fake",
    "statement": {
      "en": "في الكريكيت، wicket تعني دائمًا حذاء سباحة.",
      "ar": "In cricket, a wicket always means a swimming shoe."
    },
    "category": "sports",
    "difficulty": "hard",
    "tags": [
      "cricket",
      "rules"
    ],
    "similarityGroup": "cricket_wicket"
  },
  {
    "id": "tf_badminton_shuttlecock_true",
    "answer": "true",
    "statement": {
      "en": "Badminton uses a shuttlecock.",
      "ar": "تستخدم الريشة الطائرة shuttlecock."
    },
    "category": "sports",
    "difficulty": "hard",
    "tags": [
      "badminton",
      "equipment"
    ],
    "similarityGroup": "badminton_shuttlecock"
  },
  {
    "id": "tf_badminton_shuttlecock_fake",
    "answer": "fake",
    "statement": {
      "en": "تستخدم الريشة الطائرة كرة بولينغ حديدية.",
      "ar": "Badminton uses an iron bowling ball."
    },
    "category": "sports",
    "difficulty": "hard",
    "tags": [
      "badminton",
      "equipment"
    ],
    "similarityGroup": "badminton_shuttlecock"
  },
  {
    "id": "tf_fencing_three_weapons_true",
    "answer": "true",
    "statement": {
      "en": "Olympic fencing uses foil, épée, and sabre.",
      "ar": "المبارزة الأولمبية تستخدم الفلوريه والإيبيه والسابر."
    },
    "category": "sports",
    "difficulty": "hard",
    "tags": [
      "fencing",
      "weapons"
    ],
    "similarityGroup": "fencing_three_weapons"
  },
  {
    "id": "tf_fencing_three_weapons_fake",
    "answer": "fake",
    "statement": {
      "en": "المبارزة الأولمبية تستخدم الملعقة والشوكة والطبق فقط.",
      "ar": "Olympic fencing uses only spoon, fork, and plate."
    },
    "category": "sports",
    "difficulty": "hard",
    "tags": [
      "fencing",
      "weapons"
    ],
    "similarityGroup": "fencing_three_weapons"
  },
  {
    "id": "tf_sumo_japan_true",
    "answer": "true",
    "statement": {
      "en": "Sumo wrestling is strongly associated with Japan.",
      "ar": "مصارعة السومو مرتبطة بقوة باليابان."
    },
    "category": "sports",
    "difficulty": "hard",
    "tags": [
      "sumo",
      "japan"
    ],
    "similarityGroup": "sumo_japan"
  },
  {
    "id": "tf_sumo_japan_fake",
    "answer": "fake",
    "statement": {
      "en": "مصارعة السومو مرتبطة بقوة بالمريخ فقط.",
      "ar": "Sumo wrestling is strongly associated only with Mars."
    },
    "category": "sports",
    "difficulty": "hard",
    "tags": [
      "sumo",
      "japan"
    ],
    "similarityGroup": "sumo_japan"
  },
  {
    "id": "tf_triathlon_three_sports_true",
    "answer": "true",
    "statement": {
      "en": "A triathlon typically combines swimming, cycling, and running.",
      "ar": "الترايثلون يجمع عادة بين السباحة وركوب الدراجات والجري."
    },
    "category": "sports",
    "difficulty": "hard",
    "tags": [
      "triathlon",
      "sports"
    ],
    "similarityGroup": "triathlon_three_sports"
  },
  {
    "id": "tf_triathlon_three_sports_fake",
    "answer": "fake",
    "statement": {
      "en": "الترايثلون يجمع عادة بين النوم والأكل والرسم فقط.",
      "ar": "A triathlon typically combines sleeping, eating, and drawing only."
    },
    "category": "sports",
    "difficulty": "hard",
    "tags": [
      "triathlon",
      "sports"
    ],
    "similarityGroup": "triathlon_three_sports"
  },
  {
    "id": "tf_cthulhu_lovecraft_true",
    "answer": "true",
    "statement": {
      "en": "Cthulhu is associated with H. P. Lovecraft’s fiction.",
      "ar": "كثولو مرتبط بخيال إتش. بي. لافكرافت."
    },
    "category": "horror",
    "difficulty": "hard",
    "tags": [
      "cthulhu",
      "lovecraft"
    ],
    "similarityGroup": "cthulhu_lovecraft"
  },
  {
    "id": "tf_cthulhu_lovecraft_fake",
    "answer": "fake",
    "statement": {
      "en": "Cthulhu is mainly known as a brand of breakfast cereal.",
      "ar": "كثولو معروف أساسًا كعلامة لحبوب الإفطار."
    },
    "category": "horror",
    "difficulty": "hard",
    "tags": [
      "cthulhu",
      "lovecraft"
    ],
    "similarityGroup": "cthulhu_lovecraft"
  },
  {
    "id": "tf_nosferatu_1922_true",
    "answer": "true",
    "statement": {
      "en": "Nosferatu is a famous silent vampire film from 1922.",
      "ar": "نوسفيراتو فيلم مصاص دماء صامت مشهور من عام 1922."
    },
    "category": "horror",
    "difficulty": "hard",
    "tags": [
      "nosferatu",
      "film"
    ],
    "similarityGroup": "nosferatu_1922"
  },
  {
    "id": "tf_nosferatu_1922_fake",
    "answer": "fake",
    "statement": {
      "en": "نوسفيراتو تطبيق دردشة صدر عام 2022 فقط.",
      "ar": "Nosferatu is only a chat app released in 2022."
    },
    "category": "horror",
    "difficulty": "hard",
    "tags": [
      "nosferatu",
      "film"
    ],
    "similarityGroup": "nosferatu_1922"
  },
  {
    "id": "tf_the_exorcist_novel_film_true",
    "answer": "true",
    "statement": {
      "en": "The Exorcist began as a novel before the famous film adaptation.",
      "ar": "بدأ The Exorcist كرواية قبل اقتباسه السينمائي الشهير."
    },
    "category": "horror",
    "difficulty": "hard",
    "tags": [
      "exorcist",
      "horror"
    ],
    "similarityGroup": "the_exorcist_novel_film"
  },
  {
    "id": "tf_the_exorcist_novel_film_fake",
    "answer": "fake",
    "statement": {
      "en": "The Exorcist began as a brand of toothpaste.",
      "ar": "The Exorcist بدأ كعلامة لمعجون أسنان."
    },
    "category": "horror",
    "difficulty": "hard",
    "tags": [
      "exorcist",
      "horror"
    ],
    "similarityGroup": "the_exorcist_novel_film"
  },
  {
    "id": "tf_halloween_samhain_links_true",
    "answer": "true",
    "statement": {
      "en": "Halloween has historical links to Samhain traditions.",
      "ar": "للهالوين روابط تاريخية بتقاليد سامهاين."
    },
    "category": "horror",
    "difficulty": "hard",
    "tags": [
      "halloween",
      "samhain"
    ],
    "similarityGroup": "halloween_samhain_links"
  },
  {
    "id": "tf_halloween_samhain_links_fake",
    "answer": "fake",
    "statement": {
      "en": "Halloween began as a rule in professional chess.",
      "ar": "الهالوين بدأ كقاعدة في الشطرنج المحترف."
    },
    "category": "horror",
    "difficulty": "hard",
    "tags": [
      "halloween",
      "samhain"
    ],
    "similarityGroup": "halloween_samhain_links"
  },
  {
    "id": "tf_banshee_irish_folklore_true",
    "answer": "true",
    "statement": {
      "en": "The banshee is a figure from Irish folklore.",
      "ar": "البانشي شخصية من الفلكلور الأيرلندي."
    },
    "category": "horror",
    "difficulty": "hard",
    "tags": [
      "banshee",
      "folklore"
    ],
    "similarityGroup": "banshee_irish_folklore"
  },
  {
    "id": "tf_banshee_irish_folklore_fake",
    "answer": "fake",
    "statement": {
      "en": "البانشي نوع من كابلات USB.",
      "ar": "The banshee is a type of USB cable."
    },
    "category": "horror",
    "difficulty": "hard",
    "tags": [
      "banshee",
      "folklore"
    ],
    "similarityGroup": "banshee_irish_folklore"
  }
] satisfies TrueFakeQuestion[];
