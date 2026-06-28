import type { CitizenRuntime } from '../../citizens/citizen-types';
import type { LocaleCode } from '../../localization/locale-types';
import type { QuestionCategory, QuestionDifficulty } from '../../questions/question-types';
import type {
  HangmanAnswer,
  MiniGameAnswerRecord,
  MiniGameScoreAward,
  MiniGameSnapshot,
  MiniGameStatus,
  SubmitMiniGameAnswerResult,
} from '../minigame-types';

const WRONG_GUESS_POINTS = 5;
const CORRECT_LETTER_POINTS = 25;
const WORD_WINNER_BONUS: Record<QuestionDifficulty, number> = {
  easy: 150,
  medium: 220,
  hard: 320,
};

const MAX_WRONG_GUESSES: Record<QuestionDifficulty, number> = {
  easy: 9,
  medium: 8,
  hard: 7,
};

type LocalizedText = Record<LocaleCode, string>;

type HangmanQuestion = {
  id: string;
  word: LocalizedText;
  hint: LocalizedText;
  category: QuestionCategory;
  difficulty: QuestionDifficulty;
  similarityGroup: string;
};

type PlayerScoreAccumulator = {
  twitchUserId: string;
  displayName: string;
  role: CitizenRuntime['role'];
  points: number;
  isCorrect: boolean;
};

const HANGMAN_QUESTIONS: HangmanQuestion[] = [
  { id: 'hang_food_koshary', word: { en: 'KOSHARY', ar: 'كشري' }, hint: { en: 'Egyptian street food', ar: 'أكلة مصرية شعبية' }, category: 'weird', difficulty: 'easy', similarityGroup: 'food_koshary' },
  { id: 'hang_food_pizza', word: { en: 'PIZZA', ar: 'بيتزا' }, hint: { en: 'Round food from Italy', ar: 'أكلة دائرية مشهورة من إيطاليا' }, category: 'food', difficulty: 'easy', similarityGroup: 'food_pizza' },
  { id: 'hang_animal_tiger', word: { en: 'TIGER', ar: 'نمر' }, hint: { en: 'Striped wild cat', ar: 'حيوان بري مخطط' }, category: 'animals', difficulty: 'easy', similarityGroup: 'animal_tiger' },
  { id: 'hang_game_minecraft', word: { en: 'MINECRAFT', ar: 'ماينكرافت' }, hint: { en: 'Blocks and survival game', ar: 'لعبة مكعبات وبقاء' }, category: 'games', difficulty: 'easy', similarityGroup: 'game_minecraft' },
  { id: 'hang_object_camera', word: { en: 'CAMERA', ar: 'كاميرا' }, hint: { en: 'Used to record video', ar: 'تستخدم للتصوير' }, category: 'internet', difficulty: 'easy', similarityGroup: 'object_camera' },
  { id: 'hang_space_moon', word: { en: 'MOON', ar: 'قمر' }, hint: { en: 'It orbits Earth', ar: 'يدور حول الأرض' }, category: 'science', difficulty: 'easy', similarityGroup: 'space_moon' },
  { id: 'hang_country_egypt', word: { en: 'EGYPT', ar: 'مصر' }, hint: { en: 'Country of the pyramids', ar: 'بلد الأهرامات' }, category: 'geography', difficulty: 'easy', similarityGroup: 'country_egypt' },
  { id: 'hang_music_guitar', word: { en: 'GUITAR', ar: 'جيتار' }, hint: { en: 'String instrument', ar: 'آلة موسيقية وترية' }, category: 'weird', difficulty: 'easy', similarityGroup: 'music_guitar' },
  { id: 'hang_food_sushi', word: { en: 'SUSHI', ar: 'سوشي' }, hint: { en: 'Japanese rice dish', ar: 'أكلة يابانية بالأرز' }, category: 'food', difficulty: 'medium', similarityGroup: 'food_sushi' },
  { id: 'hang_animal_octopus', word: { en: 'OCTOPUS', ar: 'اخطبوط' }, hint: { en: 'Sea animal with eight arms', ar: 'حيوان بحري له ثمانية أذرع' }, category: 'animals', difficulty: 'medium', similarityGroup: 'animal_octopus' },
  { id: 'hang_space_nebula', word: { en: 'NEBULA', ar: 'سديم' }, hint: { en: 'Cloud of gas in space', ar: 'سحابة غازية في الفضاء' }, category: 'science', difficulty: 'medium', similarityGroup: 'space_nebula' },
  { id: 'hang_tech_algorithm', word: { en: 'ALGORITHM', ar: 'خوارزمية' }, hint: { en: 'Step-by-step problem solving method', ar: 'طريقة منظمة لحل مشكلة' }, category: 'internet', difficulty: 'medium', similarityGroup: 'tech_algorithm' },
  { id: 'hang_history_pharaoh', word: { en: 'PHARAOH', ar: 'فرعون' }, hint: { en: 'Ancient Egyptian ruler', ar: 'حاكم مصري قديم' }, category: 'history', difficulty: 'medium', similarityGroup: 'history_pharaoh' },
  { id: 'hang_game_valorant', word: { en: 'VALORANT', ar: 'فالورانت' }, hint: { en: 'Tactical shooter game', ar: 'لعبة تصويب تكتيكية' }, category: 'games', difficulty: 'medium', similarityGroup: 'game_valorant' },
  { id: 'hang_food_croissant', word: { en: 'CROISSANT', ar: 'كرواسون' }, hint: { en: 'Flaky French pastry', ar: 'مخبوز فرنسي هش' }, category: 'food', difficulty: 'medium', similarityGroup: 'food_croissant' },
  { id: 'hang_internet_meme', word: { en: 'MEME', ar: 'ميم' }, hint: { en: 'Internet joke format', ar: 'نكتة أو قالب منتشر على الإنترنت' }, category: 'internet', difficulty: 'medium', similarityGroup: 'internet_meme' },
  { id: 'hang_science_photosynthesis', word: { en: 'PHOTOSYNTHESIS', ar: 'بناء ضوئي' }, hint: { en: 'How plants make food', ar: 'طريقة صنع النبات لغذائه' }, category: 'science', difficulty: 'hard', similarityGroup: 'science_photosynthesis' },
  { id: 'hang_space_constellation', word: { en: 'CONSTELLATION', ar: 'كوكبة' }, hint: { en: 'Pattern of stars', ar: 'نمط من النجوم' }, category: 'science', difficulty: 'hard', similarityGroup: 'space_constellation' },
  { id: 'hang_tech_cryptography', word: { en: 'CRYPTOGRAPHY', ar: 'تشفير' }, hint: { en: 'Science of secure messages', ar: 'علم حماية الرسائل' }, category: 'internet', difficulty: 'hard', similarityGroup: 'tech_cryptography' },
  { id: 'hang_history_hieroglyphs', word: { en: 'HIEROGLYPHS', ar: 'هيروغليفية' }, hint: { en: 'Ancient Egyptian writing system', ar: 'نظام كتابة مصري قديم' }, category: 'history', difficulty: 'hard', similarityGroup: 'history_hieroglyphs' },
  { id: 'hang_food_ratatouille', word: { en: 'RATATOUILLE', ar: 'راتاتوي' }, hint: { en: 'French vegetable dish', ar: 'طبق خضار فرنسي' }, category: 'food', difficulty: 'hard', similarityGroup: 'food_ratatouille' },
  { id: 'hang_animal_axolotl', word: { en: 'AXOLOTL', ar: 'اكسولوتل' }, hint: { en: 'A salamander that can regrow limbs', ar: 'سلمندر يمكنه تجديد أطرافه' }, category: 'animals', difficulty: 'hard', similarityGroup: 'animal_axolotl' },
  { id: 'hang_music_synthesizer', word: { en: 'SYNTHESIZER', ar: 'سينثسايزر' }, hint: { en: 'Electronic music instrument', ar: 'آلة موسيقية إلكترونية' }, category: 'weird', difficulty: 'hard', similarityGroup: 'music_synthesizer' },
  { id: 'hang_math_probability', word: { en: 'PROBABILITY', ar: 'احتمالات' }, hint: { en: 'Math of chance', ar: 'رياضيات الفرص' }, category: 'science', difficulty: 'hard', similarityGroup: 'math_probability' },
  { id: 'hang_food_molokhia', word: { en: 'MOLOKHIA', ar: 'ملوخيه' }, hint: { en: 'Green Egyptian soup', ar: 'شوربة خضراء مصرية' }, category: 'food', difficulty: 'easy', similarityGroup: 'food_molokhia' },
  { id: 'hang_food_falafel', word: { en: 'FALAFEL', ar: 'طعمية' }, hint: { en: 'Fried bean street food', ar: 'أكلة مقلية من الفول' }, category: 'food', difficulty: 'easy', similarityGroup: 'food_falafel' },
  { id: 'hang_food_baklava', word: { en: 'BAKLAVA', ar: 'بقلاوه' }, hint: { en: 'Sweet layered pastry', ar: 'حلوى طبقات بالعسل والمكسرات' }, category: 'food', difficulty: 'medium', similarityGroup: 'food_baklava' },
  { id: 'hang_food_biryani', word: { en: 'BIRYANI', ar: 'برياني' }, hint: { en: 'Spiced rice dish', ar: 'أرز متبل مشهور' }, category: 'food', difficulty: 'medium', similarityGroup: 'food_biryani' },
  { id: 'hang_food_samosa', word: { en: 'SAMOSA', ar: 'سمبوسه' }, hint: { en: 'Triangular fried snack', ar: 'مقبلات مقلية مثلثة' }, category: 'food', difficulty: 'easy', similarityGroup: 'food_samosa' },
  { id: 'hang_food_poutine', word: { en: 'POUTINE', ar: 'بوتين' }, hint: { en: 'Fries with gravy and cheese', ar: 'بطاطس مع صوص وجبن' }, category: 'food', difficulty: 'hard', similarityGroup: 'food_poutine' },
  { id: 'hang_animal_penguin', word: { en: 'PENGUIN', ar: 'بطريق' }, hint: { en: 'Bird that cannot fly', ar: 'طائر لا يطير' }, category: 'animals', difficulty: 'easy', similarityGroup: 'animal_penguin' },
  { id: 'hang_animal_dolphin', word: { en: 'DOLPHIN', ar: 'دلفين' }, hint: { en: 'Smart sea mammal', ar: 'حيوان بحري ذكي' }, category: 'animals', difficulty: 'easy', similarityGroup: 'animal_dolphin' },
  { id: 'hang_animal_kangaroo', word: { en: 'KANGAROO', ar: 'كنغر' }, hint: { en: 'Animal that carries a baby in a pouch', ar: 'حيوان يحمل صغيره في جراب' }, category: 'animals', difficulty: 'medium', similarityGroup: 'animal_kangaroo' },
  { id: 'hang_animal_chameleon', word: { en: 'CHAMELEON', ar: 'حرباء' }, hint: { en: 'Animal known for changing color', ar: 'حيوان معروف بتغيير اللون' }, category: 'animals', difficulty: 'medium', similarityGroup: 'animal_chameleon' },
  { id: 'hang_animal_hedgehog', word: { en: 'HEDGEHOG', ar: 'قنفذ' }, hint: { en: 'Small spiky animal', ar: 'حيوان صغير له أشواك' }, category: 'animals', difficulty: 'medium', similarityGroup: 'animal_hedgehog' },
  { id: 'hang_animal_narwhal', word: { en: 'NARWHAL', ar: 'نروال' }, hint: { en: 'Whale with a long tusk', ar: 'حوت له ناب طويل' }, category: 'animals', difficulty: 'hard', similarityGroup: 'animal_narwhal' },
  { id: 'hang_space_planet', word: { en: 'PLANET', ar: 'كوكب' }, hint: { en: 'Large object orbiting a star', ar: 'جسم كبير يدور حول نجم' }, category: 'space', difficulty: 'easy', similarityGroup: 'space_planet' },
  { id: 'hang_space_galaxy', word: { en: 'GALAXY', ar: 'مجره' }, hint: { en: 'Huge collection of stars', ar: 'مجموعة ضخمة من النجوم' }, category: 'space', difficulty: 'medium', similarityGroup: 'space_galaxy' },
  { id: 'hang_space_asteroid', word: { en: 'ASTEROID', ar: 'كويكب' }, hint: { en: 'Small rocky body in space', ar: 'جسم صخري صغير في الفضاء' }, category: 'space', difficulty: 'medium', similarityGroup: 'space_asteroid' },
  { id: 'hang_space_supernova', word: { en: 'SUPERNOVA', ar: 'مستعر' }, hint: { en: 'Exploding star event', ar: 'حدث انفجار نجم' }, category: 'space', difficulty: 'hard', similarityGroup: 'space_supernova' },
  { id: 'hang_science_gravity', word: { en: 'GRAVITY', ar: 'جاذبيه' }, hint: { en: 'Force that pulls objects together', ar: 'قوة تسحب الأجسام لبعضها' }, category: 'science', difficulty: 'easy', similarityGroup: 'science_gravity' },
  { id: 'hang_science_molecule', word: { en: 'MOLECULE', ar: 'جزيء' }, hint: { en: 'Group of atoms bonded together', ar: 'مجموعة ذرات مترابطة' }, category: 'science', difficulty: 'medium', similarityGroup: 'science_molecule' },
  { id: 'hang_science_bacteria', word: { en: 'BACTERIA', ar: 'بكتيريا' }, hint: { en: 'Tiny living organisms', ar: 'كائنات دقيقة جدًا' }, category: 'science', difficulty: 'medium', similarityGroup: 'science_bacteria' },
  { id: 'hang_science_evolution', word: { en: 'EVOLUTION', ar: 'تطور' }, hint: { en: 'Change of species over time', ar: 'تغير الكائنات عبر الزمن' }, category: 'science', difficulty: 'hard', similarityGroup: 'science_evolution' },
  { id: 'hang_game_fortnite', word: { en: 'FORTNITE', ar: 'فورتنايت' }, hint: { en: 'Battle royale building game', ar: 'لعبة باتل رويال وبناء' }, category: 'games', difficulty: 'easy', similarityGroup: 'game_fortnite' },
  { id: 'hang_game_zelda', word: { en: 'ZELDA', ar: 'زيلدا' }, hint: { en: 'Adventure game series with Link', ar: 'سلسلة مغامرات بطلها لينك' }, category: 'games', difficulty: 'medium', similarityGroup: 'game_zelda' },
  { id: 'hang_game_overwatch', word: { en: 'OVERWATCH', ar: 'اوفرواچ' }, hint: { en: 'Team hero shooter', ar: 'لعبة تصويب جماعية بالأبطال' }, category: 'games', difficulty: 'medium', similarityGroup: 'game_overwatch' },
  { id: 'hang_game_hollowknight', word: { en: 'HOLLOWKNIGHT', ar: 'هولو نايت' }, hint: { en: 'Bug kingdom metroidvania game', ar: 'لعبة ميترويدفانيا في مملكة حشرات' }, category: 'games', difficulty: 'hard', similarityGroup: 'game_hollow_knight' },
  { id: 'hang_internet_streamer', word: { en: 'STREAMER', ar: 'ستريمر' }, hint: { en: 'Person broadcasting live', ar: 'شخص يبث لايف' }, category: 'internet', difficulty: 'easy', similarityGroup: 'internet_streamer' },
  { id: 'hang_internet_hashtag', word: { en: 'HASHTAG', ar: 'هاشتاج' }, hint: { en: 'Social media keyword marker', ar: 'علامة لكلمة على السوشيال ميديا' }, category: 'internet', difficulty: 'easy', similarityGroup: 'internet_hashtag' },
  { id: 'hang_internet_emote', word: { en: 'EMOTE', ar: 'ايموت' }, hint: { en: 'Small expression used in chat', ar: 'تعبير صغير يستخدم في الشات' }, category: 'internet', difficulty: 'easy', similarityGroup: 'internet_emote' },
  { id: 'hang_internet_bandwidth', word: { en: 'BANDWIDTH', ar: 'باندويث' }, hint: { en: 'Internet capacity for data', ar: 'سعة نقل البيانات على الإنترنت' }, category: 'internet', difficulty: 'hard', similarityGroup: 'internet_bandwidth' },
  { id: 'hang_history_pyramid', word: { en: 'PYRAMID', ar: 'هرم' }, hint: { en: 'Ancient triangular monument', ar: 'بناء قديم مثلث الشكل' }, category: 'history', difficulty: 'easy', similarityGroup: 'history_pyramid' },
  { id: 'hang_history_colosseum', word: { en: 'COLOSSEUM', ar: 'كولوسيوم' }, hint: { en: 'Ancient Roman arena', ar: 'مدرج روماني قديم' }, category: 'history', difficulty: 'medium', similarityGroup: 'history_colosseum' },
  { id: 'hang_history_mummy', word: { en: 'MUMMY', ar: 'مومياء' }, hint: { en: 'Preserved ancient body', ar: 'جسد قديم محفوظ' }, category: 'history', difficulty: 'easy', similarityGroup: 'history_mummy' },
  { id: 'hang_history_papyrus', word: { en: 'PAPYRUS', ar: 'بردي' }, hint: { en: 'Ancient writing material', ar: 'مادة كتابة قديمة' }, category: 'history', difficulty: 'medium', similarityGroup: 'history_papyrus' },
  { id: 'hang_geography_desert', word: { en: 'DESERT', ar: 'صحراء' }, hint: { en: 'Very dry landscape', ar: 'منطقة جافة جدًا' }, category: 'geography', difficulty: 'easy', similarityGroup: 'geography_desert' },
  { id: 'hang_geography_volcano', word: { en: 'VOLCANO', ar: 'بركان' }, hint: { en: 'Mountain that can erupt', ar: 'جبل قد يثور بالحمم' }, category: 'geography', difficulty: 'medium', similarityGroup: 'geography_volcano' },
  { id: 'hang_geography_archipelago', word: { en: 'ARCHIPELAGO', ar: 'ارخبيل' }, hint: { en: 'Group of islands', ar: 'مجموعة جزر' }, category: 'geography', difficulty: 'hard', similarityGroup: 'geography_archipelago' },
  { id: 'hang_geography_equator', word: { en: 'EQUATOR', ar: 'خط الاستواء' }, hint: { en: 'Line around the middle of Earth', ar: 'خط يمر بمنتصف الأرض' }, category: 'geography', difficulty: 'medium', similarityGroup: 'geography_equator' },
  { id: 'hang_sports_football', word: { en: 'FOOTBALL', ar: 'كوره' }, hint: { en: 'Popular team sport', ar: 'رياضة جماعية مشهورة' }, category: 'sports', difficulty: 'easy', similarityGroup: 'sports_football' },
  { id: 'hang_sports_goalkeeper', word: { en: 'GOALKEEPER', ar: 'حارس' }, hint: { en: 'Player who protects the goal', ar: 'لاعب يحمي المرمى' }, category: 'sports', difficulty: 'medium', similarityGroup: 'sports_goalkeeper' },
  { id: 'hang_sports_marathon', word: { en: 'MARATHON', ar: 'ماراثون' }, hint: { en: 'Long distance running race', ar: 'سباق جري طويل' }, category: 'sports', difficulty: 'medium', similarityGroup: 'sports_marathon' },
  { id: 'hang_sports_badminton', word: { en: 'BADMINTON', ar: 'بادمنتون' }, hint: { en: 'Racket sport with shuttlecock', ar: 'رياضة مضرب بريشة' }, category: 'sports', difficulty: 'hard', similarityGroup: 'sports_badminton' },
  { id: 'hang_language_alphabet', word: { en: 'ALPHABET', ar: 'ابجديه' }, hint: { en: 'Set of letters', ar: 'مجموعة الحروف' }, category: 'language', difficulty: 'easy', similarityGroup: 'language_alphabet' },
  { id: 'hang_language_synonym', word: { en: 'SYNONYM', ar: 'مرادف' }, hint: { en: 'Word with similar meaning', ar: 'كلمة لها معنى مشابه' }, category: 'language', difficulty: 'medium', similarityGroup: 'language_synonym' },
  { id: 'hang_language_palindrome', word: { en: 'PALINDROME', ar: 'متناظر' }, hint: { en: 'Word read the same backward', ar: 'كلمة تقرأ بالعكس بنفس الشكل' }, category: 'language', difficulty: 'hard', similarityGroup: 'language_palindrome' },
  { id: 'hang_language_translation', word: { en: 'TRANSLATION', ar: 'ترجمه' }, hint: { en: 'Changing text to another language', ar: 'نقل النص إلى لغة أخرى' }, category: 'language', difficulty: 'medium', similarityGroup: 'language_translation' },
  { id: 'hang_weird_umbrella', word: { en: 'UMBRELLA', ar: 'شمسية' }, hint: { en: 'Used in rain or sun', ar: 'تستخدم في المطر أو الشمس' }, category: 'weird', difficulty: 'easy', similarityGroup: 'object_umbrella' },
  { id: 'hang_weird_compass', word: { en: 'COMPASS', ar: 'بوصله' }, hint: { en: 'Tool that points north', ar: 'أداة تشير للشمال' }, category: 'weird', difficulty: 'medium', similarityGroup: 'object_compass' },
  { id: 'hang_weird_kaleidoscope', word: { en: 'KALEIDOSCOPE', ar: 'مشكال' }, hint: { en: 'Toy that makes colorful patterns', ar: 'لعبة تصنع أشكالًا ملونة' }, category: 'weird', difficulty: 'hard', similarityGroup: 'object_kaleidoscope' },
  { id: 'hang_horror_vampire', word: { en: 'VAMPIRE', ar: 'مصاص دماء' }, hint: { en: 'Classic creature of the night', ar: 'كائن خيالي من الليل' }, category: 'horror', difficulty: 'easy', similarityGroup: 'horror_vampire' },
  { id: 'hang_horror_werewolf', word: { en: 'WEREWOLF', ar: 'مستذئب' }, hint: { en: 'Human that turns into a wolf', ar: 'إنسان يتحول إلى ذئب' }, category: 'horror', difficulty: 'medium', similarityGroup: 'horror_werewolf' },
  { id: 'hang_horror_poltergeist', word: { en: 'POLTERGEIST', ar: 'روح صاخبة' }, hint: { en: 'Ghost known for moving objects', ar: 'شبح معروف بتحريك الأشياء' }, category: 'horror', difficulty: 'hard', similarityGroup: 'horror_poltergeist' },
  { id: 'hang_food_tiramisu', word: { en: 'TIRAMISU', ar: 'تيراميسو' }, hint: { en: 'Coffee-flavored Italian dessert', ar: 'حلوى إيطالية بطعم القهوة' }, category: 'food', difficulty: 'medium', similarityGroup: 'food_tiramisu' },
  { id: 'hang_food_churros', word: { en: 'CHURROS', ar: 'تشوروز' }, hint: { en: 'Fried sweet dough sticks', ar: 'عجين حلو مقلي' }, category: 'food', difficulty: 'medium', similarityGroup: 'food_churros' },
  { id: 'hang_food_mansaf', word: { en: 'MANSAF', ar: 'منسف' }, hint: { en: 'Jordanian rice and meat dish', ar: 'طبق أردني بالأرز واللحم' }, category: 'food', difficulty: 'medium', similarityGroup: 'food_mansaf' },
  { id: 'hang_food_kabsa', word: { en: 'KABSA', ar: 'كبسه' }, hint: { en: 'Gulf rice dish with spices', ar: 'طبق أرز خليجي بالتوابل' }, category: 'food', difficulty: 'easy', similarityGroup: 'food_kabsa' },
  { id: 'hang_tech_firewall', word: { en: 'FIREWALL', ar: 'جدار ناري' }, hint: { en: 'Security system for networks', ar: 'نظام حماية للشبكات' }, category: 'internet', difficulty: 'hard', similarityGroup: 'tech_firewall' },
  { id: 'hang_tech_database', word: { en: 'DATABASE', ar: 'قاعده بيانات' }, hint: { en: 'Organized collection of data', ar: 'مجموعة منظمة من البيانات' }, category: 'internet', difficulty: 'medium', similarityGroup: 'tech_database' },
];

export class HangmanMiniGameService {
  private question: HangmanQuestion | null = null;
  private status: MiniGameStatus = 'idle';
  private roundNumber = 0;
  private readonly answers: MiniGameAnswerRecord[] = [];
  private readonly revealedLetters = new Set<string>();
  private readonly wrongLetters = new Set<string>();
  private readonly guessedWords = new Set<string>();
  private readonly scoreByUser = new Map<string, PlayerScoreAccumulator>();
  private correctOfficialCount = 0;
  private correctSpectatorCount = 0;
  private scored = false;
  private winnerId: string | null = null;
  private winnerDisplayName: string | null = null;
  private readonly tourSignatures = new Set<string>();
  private readonly sessionSignatures = new Set<string>();

  beginTour(): void {
    this.tourSignatures.clear();
    this.clearActiveRound();
  }

  startRound(roundNumber: number): void {
    this.roundNumber = roundNumber;
    this.question = this.selectQuestion(roundNumber);
    this.status = 'intro';
    this.answers.length = 0;
    this.revealedLetters.clear();
    this.wrongLetters.clear();
    this.guessedWords.clear();
    this.scoreByUser.clear();
    this.correctOfficialCount = 0;
    this.correctSpectatorCount = 0;
    this.scored = false;
    this.winnerId = null;
    this.winnerDisplayName = null;

    this.tourSignatures.add(this.question.similarityGroup);
    this.sessionSignatures.add(this.question.similarityGroup);
  }

  setStatus(status: MiniGameStatus): void {
    if (!this.question && status !== 'idle') return;
    this.status = status;
  }

  submitGuess(citizen: CitizenRuntime, answer: HangmanAnswer, locale: LocaleCode): SubmitMiniGameAnswerResult {
    if (!this.question) return { ok: false, reason: 'no_round' };
    if (this.status !== 'answering') return { ok: false, reason: 'closed' };
    if (this.winnerId) return { ok: false, reason: 'closed' };

    const guess = this.parseAnswer(answer);
    if (!guess) return { ok: false, reason: 'closed' };

    const targetWord = this.getNormalizedWord(locale);
    let isCorrect = false;
    let points = 0;

    if (guess.kind === 'letter') {
      if (this.revealedLetters.has(guess.value) || this.wrongLetters.has(guess.value)) {
        return { ok: false, reason: 'already_answered' };
      }

      isCorrect = targetWord.includes(guess.value);
      if (isCorrect) {
        this.revealedLetters.add(guess.value);
        points = CORRECT_LETTER_POINTS;
      } else {
        this.wrongLetters.add(guess.value);
        points = WRONG_GUESS_POINTS;
      }
    } else {
      if (this.guessedWords.has(guess.value)) {
        return { ok: false, reason: 'already_answered' };
      }

      this.guessedWords.add(guess.value);
      isCorrect = guess.value === targetWord;
      points = isCorrect ? WORD_WINNER_BONUS[this.question.difficulty] : WRONG_GUESS_POINTS;

      if (isCorrect) {
        this.winnerId = citizen.twitchUserId;
        this.winnerDisplayName = citizen.displayName;
        for (const letter of new Set([...targetWord])) {
          this.revealedLetters.add(letter);
        }
      }
    }

    const record: MiniGameAnswerRecord = {
      twitchUserId: citizen.twitchUserId,
      displayName: citizen.displayName,
      role: citizen.role,
      answer,
      submittedAt: Date.now(),
      isCorrect,
    };

    this.answers.push(record);
    this.addPoints(citizen, points, isCorrect);

    return { ok: true, record };
  }

  resolveRound(): void {
    if (!this.question) return;

    this.correctOfficialCount = 0;
    this.correctSpectatorCount = 0;

    for (const accumulator of this.scoreByUser.values()) {
      if (!accumulator.isCorrect) continue;
      if (accumulator.role === 'official') this.correctOfficialCount += 1;
      if (accumulator.role === 'spectator') this.correctSpectatorCount += 1;
    }

    this.status = 'resolved';
  }

  createScoreAwards(): MiniGameScoreAward[] {
    if (!this.question || this.scored) return [];

    const awards = [...this.scoreByUser.values()].map((accumulator) => ({
      twitchUserId: accumulator.twitchUserId,
      displayName: accumulator.displayName,
      role: accumulator.role,
      points: accumulator.points,
      isCorrect: accumulator.isCorrect,
      difficulty: this.question?.difficulty ?? 'medium',
    }));

    this.scored = true;
    this.status = 'scored';
    return awards;
  }

  clearActiveRound(): void {
    this.question = null;
    this.status = 'idle';
    this.roundNumber = 0;
    this.answers.length = 0;
    this.revealedLetters.clear();
    this.wrongLetters.clear();
    this.guessedWords.clear();
    this.scoreByUser.clear();
    this.correctOfficialCount = 0;
    this.correctSpectatorCount = 0;
    this.scored = false;
    this.winnerId = null;
    this.winnerDisplayName = null;
  }

  clear(): void {
    this.clearActiveRound();
  }

  getSnapshot(locale: LocaleCode): MiniGameSnapshot {
    const shouldRevealAnswer = this.status === 'resolved' || this.status === 'scored' || this.status === 'leaderboard';
    const officialAnswerCount = this.answers.filter((answer) => answer.role === 'official').length;
    const spectatorAnswerCount = this.answers.filter((answer) => answer.role === 'spectator').length;

    return {
      id: 'hangman',
      status: this.status,
      roundNumber: this.roundNumber,
      title: locale === 'ar' ? 'الرجل المشنوق' : 'HANGMAN',
      statement: this.question ? (locale === 'ar' ? 'خمن الكلمة حرف بحرف أو اكتب الكلمة كاملة.' : 'Guess the word letter by letter, or guess the full word.') : '',
      instruction: this.question ? this.buildInstruction(locale) : '',
      acceptsAnswers: this.status === 'answering' && !this.winnerId,
      officialAnswerCount,
      spectatorAnswerCount,
      answerRecords: [...this.answers],
      correctAnswer: shouldRevealAnswer && this.question ? `word:${this.question.word[locale]}` as HangmanAnswer : null,
      correctOfficialCount: this.correctOfficialCount,
      correctSpectatorCount: this.correctSpectatorCount,
      hasRound: Boolean(this.question),
      questionId: this.question?.id ?? null,
      questionCategory: this.question?.category ?? null,
      questionDifficulty: this.question?.difficulty ?? null,
      questionBankStats: {
        totalQuestions: HANGMAN_QUESTIONS.length,
        tourUsedQuestions: this.tourSignatures.size,
        tourUsedSimilarityGroups: this.tourSignatures.size,
        sessionUsedQuestions: this.sessionSignatures.size,
        sessionUsedSimilarityGroups: this.sessionSignatures.size,
      },
      hangman: this.question
        ? {
            maskedWord: this.getMaskedWord(locale, shouldRevealAnswer),
            hint: this.question.hint[locale],
            guessedLetters: [...this.revealedLetters].sort(),
            wrongLetters: [...this.wrongLetters].sort(),
            maxWrongGuesses: MAX_WRONG_GUESSES[this.question.difficulty],
            remainingWrongGuesses: Math.max(0, MAX_WRONG_GUESSES[this.question.difficulty] - this.wrongLetters.size),
            correctWord: shouldRevealAnswer ? this.question.word[locale] : null,
            winnerDisplayName: this.winnerDisplayName,
            isSolved: Boolean(this.winnerId) || this.isWordFullyRevealed(locale),
          }
        : null,
    };
  }

  private addPoints(citizen: CitizenRuntime, points: number, isCorrect: boolean): void {
    const current = this.scoreByUser.get(citizen.twitchUserId) ?? {
      twitchUserId: citizen.twitchUserId,
      displayName: citizen.displayName,
      role: citizen.role,
      points: 0,
      isCorrect: false,
    };

    this.scoreByUser.set(citizen.twitchUserId, {
      ...current,
      displayName: citizen.displayName,
      role: citizen.role,
      points: current.points + points,
      isCorrect: current.isCorrect || isCorrect,
    });
  }

  private parseAnswer(answer: HangmanAnswer): { kind: 'letter' | 'word'; value: string } | null {
    const [kind, rawValue = ''] = answer.split(':');
    const value = normalizeGuess(rawValue);

    if (!value) return null;
    if (kind === 'letter') return { kind, value: [...value][0] };
    if (kind === 'word') return { kind, value };
    return null;
  }

  private getNormalizedWord(locale: LocaleCode): string {
    return normalizeGuess(this.question?.word[locale] ?? '');
  }

  private getMaskedWord(locale: LocaleCode, revealAll: boolean): string {
    const word = this.question?.word[locale] ?? '';
    if (revealAll) return [...word].join(' ');

    return [...word].map((char) => {
      if (char.trim() === '') return '  ';
      const normalized = normalizeGuess(char);
      return normalized && this.revealedLetters.has(normalized) ? char : '_';
    }).join(' ');
  }

  private isWordFullyRevealed(locale: LocaleCode): boolean {
    const normalizedWord = this.getNormalizedWord(locale);
    return [...new Set([...normalizedWord])].every((letter) => this.revealedLetters.has(letter));
  }

  private buildInstruction(locale: LocaleCode): string {
    return locale === 'ar'
      ? 'اكتب حرف مثل !س أو خمن الكلمة: !word كشري'
      : 'Type a letter like !a, or guess the word: !word pizza';
  }

  private selectQuestion(roundNumber: number): HangmanQuestion {
    for (let attempt = 0; attempt < HANGMAN_QUESTIONS.length * 2; attempt += 1) {
      const index = (roundNumber * 5 + attempt * 7 + this.sessionSignatures.size) % HANGMAN_QUESTIONS.length;
      const question = HANGMAN_QUESTIONS[index];
      if (!this.tourSignatures.has(question.similarityGroup) && !this.sessionSignatures.has(question.similarityGroup)) {
        return question;
      }
    }

    for (const question of HANGMAN_QUESTIONS) {
      if (!this.tourSignatures.has(question.similarityGroup)) return question;
    }

    return HANGMAN_QUESTIONS[roundNumber % HANGMAN_QUESTIONS.length];
  }
}

export function createHangmanAnswerFromCommand(rawCommand: string, args: string[] = []): HangmanAnswer | null {
  const commandBody = rawCommand.replace(/^!/, '').trim();
  const normalizedCommand = normalizeGuess(commandBody);

  if (!normalizedCommand) return null;

  if (normalizedCommand === 'word' || normalizedCommand === 'guess' || normalizedCommand === 'كلمه' || normalizedCommand === 'كلمة') {
    const wordGuess = normalizeGuess(args.join(' '));
    return wordGuess ? `word:${wordGuess}` : null;
  }

  if ([...normalizedCommand].length === 1) {
    return `letter:${normalizedCommand}`;
  }

  return `word:${normalizedCommand}`;
}

function normalizeGuess(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u064B-\u065F\u0670]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ئ/g, 'ي')
    .replace(/ؤ/g, 'و')
    .replace(/ة/g, 'ه')
    .replace(/[^a-z\u0621-\u064A]/g, '');
}
