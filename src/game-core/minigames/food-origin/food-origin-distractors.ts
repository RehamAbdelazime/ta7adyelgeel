import type { FoodOriginQuestion } from './food-origin-content';
import { FOOD_COUNTRY_PROFILES } from './food-origin-country-data.generated';

type FoodChoice = FoodOriginQuestion['choices'][number];

/**
 * V65: A player should be choosing between believable *countries*, not between
 * an Arabic dish and three arbitrarily selected countries on other continents.
 *
 * Uploaded images carry an editorial near-country list and a familiar far-country
 * list. Hard selects three neighboring/culinary-peer countries, Medium uses two,
 * Easy uses only one. Within those constraints, the V64 history rotates actual
 * identities across plays (not just the 1-4 answer positions).
 */
export function buildDynamicFoodOriginChoices(params: {
  question: FoodOriginQuestion;
  allQuestions: readonly FoodOriginQuestion[];
  seed: number;
  targetCount?: number;
}): FoodChoice[] {
  const { question, seed } = params;
  const targetCount = params.targetCount ?? 4;
  if (targetCount !== 4) throw new Error('Food Origin is designed for exactly four countries');
  const rng = seededRandom(seed);
  const correct = question.choices.find(item => item.countryCode === question.answer);
  if (!correct) throw new Error(`${question.id}: correct country is missing from the authored bank`);

  const originalWrong = unique(question.choices.filter(item => item.countryCode !== question.answer));
  // V65 expanded rows: ten individually curated near peers followed by ten
  // culturally recognisable far peers; legacy rows have just three authored peers.
  const rich = Boolean(question.distractorNearCodes?.length && question.distractorFarCodes?.length);
  const countryNames = new Map<string, FoodChoice>();
  for (const item of params.allQuestions.flatMap(q => q.choices)) countryNames.set(item.countryCode, item);
  for (const [code, profile] of Object.entries(FOOD_COUNTRY_PROFILES)) {
    if (!countryNames.has(code)) countryNames.set(code, { countryCode: code, label: { en: profile.en, ar: profile.ar } });
  }

  const currentRegion = FOOD_COUNTRY_PROFILES[question.answer]?.region;
  const sameCuisine = [...countryNames.values()].filter(item =>
    item.countryCode !== question.answer &&
    Boolean(currentRegion && FOOD_COUNTRY_PROFILES[item.countryCode]?.region === currentRegion),
  );
  const near = rich ? (question.distractorNearCodes ?? []).map(code => countryNames.get(code)).filter((item): item is FoodChoice => Boolean(item)) : unique([...originalWrong, ...sameCuisine]);
  const far = rich ? (question.distractorFarCodes ?? []).slice(0, 4).map(code => countryNames.get(code)).filter((item): item is FoodChoice => Boolean(item)) : unique(
    [...countryNames.values()].filter(item => item.countryCode !== question.answer &&
      FOOD_COUNTRY_PROFILES[item.countryCode]?.region !== currentRegion &&
      // Avoid a parade of obscure locations in an Easy question for Egyptians.
      FAMILIAR_COUNTRIES.has(item.countryCode)),
  );

  const used = new Set<string>([question.answer]);
  const chosen: FoodChoice[] = [];
  const add = (pool: readonly FoodChoice[], count: number) => {
    // Deterministic seeded shuffle with a slight preference for the editor's top
    // candidates; all peers can eventually appear in subsequent replays.
    const candidates = shuffle(pool, rng);
    for (const candidate of candidates) {
      if (chosen.length >= 3 || count <= 0) break;
      if (used.has(candidate.countryCode)) continue;
      used.add(candidate.countryCode);
      chosen.push(candidate);
      count -= 1;
    }
  };

  if (question.difficulty === 'easy') {
    // Recognisable country options, with only one lookalike to keep it fair.
    add(near, 1);
    add(far, 2);
  } else if (question.difficulty === 'medium') {
    add(near, 2);
    add(far, 1);
  } else {
    add(near, 3);
  }
  if (chosen.length < 3) add(unique([...near, ...far, ...countryNames.values()]), 3 - chosen.length);
  if (chosen.length !== 3) throw new Error(`${question.id}: cannot build 3 distinct plausible countries`);
  return shuffle([correct, ...chosen], rng);
}

const FAMILIAR_COUNTRIES = new Set([
  'EG','FR','IT','ES','GB','US','IN','CN','KR','JP','TR','MX','BR','GR','SA',
  'MA','TN','DZ','LY','JO','IQ','AE','YE','TH','VN','PH','ID','MY','PK',
  'PE','AR','DE','CH','AU','NZ','CA','RU','UA','ZA','NG','GH','SN','KE',
  'SE','DK','NL','BE','PT','PL','NO','AT','CO','CU','JM','UY','VE',
]);
function unique(choices: readonly FoodChoice[]): FoodChoice[] {
  const seen = new Set<string>();
  return choices.filter(item => !seen.has(item.countryCode) && Boolean(seen.add(item.countryCode)));
}
function seededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}
function shuffle<T>(items: readonly T[], rng: () => number): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
