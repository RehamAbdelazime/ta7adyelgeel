import type { GameQuestionBase, LocalizedText, QuestionCategory, QuestionDifficulty } from '../../questions/question-types';

export type FoodOriginQuestion = GameQuestionBase<string> & {
  dishName: LocalizedText;
  imageLabel: string;
  imageUrl?: string | null;
  imageAlt?: string | null;
  sourceName?: string | null;
  sourceUrl?: string | null;
  /** Editorially reviewed plausible cuisine-neighbor wrong countries. */
  distractorNearCodes?: string[];
  /** Famous, food-type plausible countries for easier rounds. */
  distractorFarCodes?: string[];
  choices: Array<{
    countryCode: string;
    label: LocalizedText;
  }>;
};

function text(en: string, ar: string): LocalizedText {
  return { en, ar };
}

function q(params: {
  id: string;
  dishEn: string;
  dishAr: string;
  answer: string;
  choices: Array<[string, string, string]>;
  difficulty: QuestionDifficulty;
  tags: string[];
  similarityGroup: string;
  imageFile: string;
}): FoodOriginQuestion {
  return {
    id: params.id,
    answer: params.answer,
    statement: text('Which country is this dish associated with?', 'الطبق ده مشهور في مطبخ أنهي بلد؟'),
    dishName: text(params.dishEn, params.dishAr),
    imageLabel: '🍽️',
    imageUrl: `/assets/game/runtime/minigames/food-origin/photos/${params.imageFile}`,
    imageAlt: `${params.dishEn} food photo.`,
    sourceName: 'Local DISHES Pack',
    sourceUrl: null,
    choices: params.choices.map(([countryCode, en, ar]) => ({ countryCode, label: text(en, ar) })),
    category: 'food' as QuestionCategory,
    difficulty: params.id === 'food_origin_brigadeiros_brazil' ? 'easy' : params.difficulty,
    tags: params.tags,
    similarityGroup: params.similarityGroup,
  };
}

// Food Origin is now sourced from the uploaded DISHES pack.
// Difficulty controls how close the distractors are:
// easy = obvious/far-country distractors, medium = closer regional distractors, hard = very close regional/confusion distractors.
export const FOOD_ORIGIN_LEGACY_QUESTIONS: FoodOriginQuestion[] = [
  q({ id: 'food_origin_carbonara_italy', dishEn: 'Carbonara', dishAr: 'كاربونارا', answer: 'IT', choices: [['IT','Italy','إيطاليا'], ['JP','Japan','اليابان'], ['BR','Brazil','البرازيل'], ['EG','Egypt','مصر']], difficulty: 'easy', tags: ['pasta', 'eggs', 'cheese'], similarityGroup: 'carbonara_italy', imageFile: 'carbonara_italy.jpg' }),
  q({ id: 'food_origin_bibimbap_korea', dishEn: 'Bibimbap', dishAr: 'بيبيمباب', answer: 'KR', choices: [['KR','South Korea','كوريا الجنوبية'], ['MX','Mexico','المكسيك'], ['FR','France','فرنسا'], ['YE','Yemen','اليمن']], difficulty: 'easy', tags: ['rice', 'korean', 'vegetables'], similarityGroup: 'bibimbap_korea', imageFile: 'bibimbap_korea.jpg' }),
  q({ id: 'food_origin_makboos_yemen', dishEn: 'Makboos', dishAr: 'مكبوس', answer: 'YE', choices: [['YE','Yemen','اليمن'], ['IT','Italy','إيطاليا'], ['KR','South Korea','كوريا الجنوبية'], ['BR','Brazil','البرازيل']], difficulty: 'easy', tags: ['rice', 'meat', 'spices', 'arabic'], similarityGroup: 'makboos_yemen', imageFile: 'makboos_yemen.jpeg' }),
  q({ id: 'food_origin_pho_vietnam', dishEn: 'Pho', dishAr: 'فو', answer: 'VN', choices: [['VN','Vietnam','فيتنام'], ['IT','Italy','إيطاليا'], ['BR','Brazil','البرازيل'], ['YE','Yemen','اليمن']], difficulty: 'easy', tags: ['noodles', 'soup', 'beef'], similarityGroup: 'pho_vietnam', imageFile: 'pho_vietnam.jpeg' }),
  q({ id: 'food_origin_shakshuka_libya', dishEn: 'Shakshuka', dishAr: 'شكشوكة', answer: 'LY', choices: [['LY','Libya','ليبيا'], ['JP','Japan','اليابان'], ['BR','Brazil','البرازيل'], ['DK','Denmark','الدنمارك']], difficulty: 'easy', tags: ['eggs', 'tomato', 'north_africa'], similarityGroup: 'shakshuka_libya', imageFile: 'shakshuka_libya.jpeg' }),
  q({ id: 'food_origin_adobo_philippines', dishEn: 'Adobo', dishAr: 'أدوبو', answer: 'PH', choices: [['PH','Philippines','الفلبين'], ['ID','Indonesia','إندونيسيا'], ['MY','Malaysia','ماليزيا'], ['TH','Thailand','تايلاند']], difficulty: 'medium', tags: ['meat', 'sour', 'rice', 'soy'], similarityGroup: 'adobo_philippines', imageFile: 'adobo_philippines.jpg' }),
  q({ id: 'food_origin_brigadeiros_brazil', dishEn: 'Brigadeiros', dishAr: 'بريجاديروس', answer: 'BR', choices: [['BR','Brazil','البرازيل'], ['AR','Argentina','الأرجنتين'], ['PE','Peru','بيرو'], ['CO','Colombia','كولومبيا']], difficulty: 'medium', tags: ['dessert', 'chocolate', 'latin_america'], similarityGroup: 'brigadeiros_brazil', imageFile: 'brigadeiros_brazil.jpeg' }),
  q({ id: 'food_origin_ceviche_peru', dishEn: 'Ceviche', dishAr: 'سيفيتشي', answer: 'PE', choices: [['PE','Peru','بيرو'], ['CL','Chile','تشيلي'], ['MX','Mexico','المكسيك'], ['BR','Brazil','البرازيل']], difficulty: 'medium', tags: ['seafood', 'lime', 'latin_america'], similarityGroup: 'ceviche_peru', imageFile: 'ceviche_peru_user.jpg' }),
  q({ id: 'food_origin_pot_au_feu_france', dishEn: 'Pot-au-feu', dishAr: 'بوت أو فو', answer: 'FR', choices: [['FR','France','فرنسا'], ['BE','Belgium','بلجيكا'], ['DE','Germany','ألمانيا'], ['IT','Italy','إيطاليا']], difficulty: 'medium', tags: ['stew', 'beef', 'europe'], similarityGroup: 'pot_au_feu_france', imageFile: 'pot_au_feu_france.jpg' }),
  q({ id: 'food_origin_stegt_flaesk_denmark', dishEn: 'Stegt Flæsk', dishAr: 'ستجت فلاسك', answer: 'DK', choices: [['DK','Denmark','الدنمارك'], ['DE','Germany','ألمانيا'], ['SE','Sweden','السويد'], ['NL','Netherlands','هولندا']], difficulty: 'medium', tags: ['pork', 'europe', 'fried'], similarityGroup: 'stegt_flaesk_denmark', imageFile: 'stegt_flaesk_denmark.jpeg' }),
  q({ id: 'food_origin_chivito_uruguay', dishEn: 'Chivito', dishAr: 'تشيفيتو', answer: 'UY', choices: [['UY','Uruguay','أوروغواي'], ['AR','Argentina','الأرجنتين'], ['CL','Chile','تشيلي'], ['BR','Brazil','البرازيل']], difficulty: 'hard', tags: ['sandwich', 'beef', 'latin_america'], similarityGroup: 'chivito_uruguay', imageFile: 'chivito_uruguay.jpeg' }),
  q({ id: 'food_origin_chakhokhbili_georgia', dishEn: 'Chakhokhbili', dishAr: 'تشاخوخبيلي', answer: 'GE', choices: [['GE','Georgia','جورجيا'], ['AM','Armenia','أرمينيا'], ['AZ','Azerbaijan','أذربيجان'], ['TR','Turkey','تركيا']], difficulty: 'hard', tags: ['stew', 'chicken', 'caucasus'], similarityGroup: 'chakhokhbili_georgia', imageFile: 'chakhokhbili_georgia.jpeg' }),
  q({ id: 'food_origin_zelnik_north_macedonia', dishEn: 'Zelnik', dishAr: 'زيلنيك', answer: 'MK', choices: [['MK','North Macedonia','مقدونيا الشمالية'], ['BG','Bulgaria','بلغاريا'], ['RS','Serbia','صربيا'], ['AL','Albania','ألبانيا']], difficulty: 'hard', tags: ['pastry', 'balkan', 'baked'], similarityGroup: 'zelnik_north_macedonia', imageFile: 'zelnik_north_macedonia.jpeg' }),
  q({ id: 'food_origin_pabellon_criollo_venezuela', dishEn: 'Pabellón Criollo', dishAr: 'بابيون كريولو', answer: 'VE', choices: [['VE','Venezuela','فنزويلا'], ['CO','Colombia','كولومبيا'], ['PE','Peru','بيرو'], ['BR','Brazil','البرازيل']], difficulty: 'hard', tags: ['rice', 'beans', 'beef', 'latin_america'], similarityGroup: 'pabellon_criollo_venezuela', imageFile: 'pabellon_criollo_venezuela.jpeg' }),
];

import { FOOD_ORIGIN_UPLOAD_QUESTIONS } from "./food-origin-expanded.generated";
export const FOOD_ORIGIN_QUESTIONS: FoodOriginQuestion[] = [...FOOD_ORIGIN_LEGACY_QUESTIONS, ...FOOD_ORIGIN_UPLOAD_QUESTIONS];

// V65: Older DISHES photos get the same curated breadth as the uploaded ones.
// Positions 1–10 are plausible cuisine-region neighbors, positions 11–20 are
// different-but-believable food-style countries. No more fixed three decoys.
import { FOOD_COUNTRY_PROFILES } from './food-origin-country-data.generated';
const LEGACY_CHOICE_TIERS: Record<string, { near: string[]; far: string[] }> = {
  food_origin_carbonara_italy: {
    near: ['FR','ES','GR','CH','MT','PT','AT','DE','TR','BE'],
    far: ['CN','JP','KR','TH','IN','US','GB','EG','BR','MX'],
  },
  food_origin_bibimbap_korea: {
    near: ['JP','CN','VN','TH','TW','MY','ID','PH','SG','KH'],
    far: ['IN','PK','TR','SA','EG','BR','GR','IT','FR','US'],
  },
  food_origin_pho_vietnam: {
    near: ['TH','LA','KH','MY','SG','KR','CN','JP','PH','ID'],
    far: ['IT','IN','TR','FR','EG','US','BR','MX','GR','GB'],
  },
  food_origin_adobo_philippines: {
    near: ['ID','MY','TH','VN','SG','KH','TW','KR','JP','LA'],
    far: ['MX','EG','MA','IN','IR','FR','GR','YE','PK','SA'],
  },
  food_origin_brigadeiros_brazil: {
    near: ['AR','UY','CO','PE','VE','CL','BO','EC','PY','MX'],
    far: ['FR','IT','TR','EG','BE','US','GR','IN','ES','DE'],
  },
  food_origin_ceviche_peru: {
    near: ['EC','CL','CO','MX','AR','UY','BO','VE','BR','PA'],
    far: ['JP','GR','IT','ES','TH','FR','EG','PT','KR','GB'],
  },
  food_origin_pot_au_feu_france: {
    near: ['BE','CH','DE','IT','ES','NL','GB','AT','LU','PT'],
    far: ['TR','EG','MA','IN','IR','GR','YE','PK','SA','BR'],
  },
  food_origin_stegt_flaesk_denmark: {
    near: ['SE','NO','FI','DE','NL','BE','IS','GB','CH','FR'],
    far: ['TR','GR','EG','SA','BR','US','IN','ZA','AR','MX'],
  },
  food_origin_chivito_uruguay: {
    near: ['AR','BR','PY','CL','PE','CO','VE','BO','EC','MX'],
    far: ['US','TR','DE','EG','GR','GB','IT','FR','MA','IN'],
  },
  food_origin_chakhokhbili_georgia: {
    near: ['AM','AZ','TR','RU','IR','UA','KG','UZ','GR','AL'],
    far: ['EG','MA','IN','FR','YE','PK','SA','IT','BR','DZ'],
  },
  food_origin_pabellon_criollo_venezuela: {
    near: ['CO','BR','GY','PE','EC','AR','BO','CL','UY','MX'],
    far: ['IN','PK','TR','SA','EG','ID','MY','JP','CN','TH'],
  },
};
for (const legacy of FOOD_ORIGIN_LEGACY_QUESTIONS) {
  const tiers = LEGACY_CHOICE_TIERS[legacy.id];
  if (!tiers) continue; // excluded disputed-origin questions do not need options.
  const codes = [legacy.answer, ...tiers.near, ...tiers.far];
  if (new Set(codes).size !== codes.length) throw new Error(`${legacy.id}: repeated country in editorial choice tiers`);
  legacy.distractorNearCodes = tiers.near;
  legacy.distractorFarCodes = tiers.far;
  legacy.choices = codes.map(countryCode => {
    const profile = FOOD_COUNTRY_PROFILES[countryCode];
    if (!profile) throw new Error(`${legacy.id}: no Arabic/English country label for ${countryCode}`);
    return { countryCode, label: { en: profile.en, ar: profile.ar } };
  });
}
