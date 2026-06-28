import type { LocalizedText, QuestionDifficulty } from '../../questions/question-types';
import type { FoodOriginQuestion } from './food-origin-content';

type FoodOriginChoice = FoodOriginQuestion['choices'][number];

type CountryProfile = {
  countryCode: string;
  region: 'arab' | 'europe' | 'east_asia' | 'southeast_asia' | 'latin_america' | 'global';
  subregion?: string;
  neighbors?: string[];
  familiarity?: number;
};

// Small focused map for the current DISHES pack and its distractor countries.
// The chooser below is intentionally difficulty-aware:
// easy   -> far/unrelated countries, so the answer feels fair.
// medium -> closer regional countries.
// hard   -> very close regional/neighbouring countries.
const COUNTRY_PROFILES: Record<string, CountryProfile> = {
  IT: { countryCode: 'IT', region: 'europe', subregion: 'mediterranean', neighbors: ['FR', 'DE', 'CH', 'AT', 'SI', 'GR'], familiarity: 1 },
  JP: { countryCode: 'JP', region: 'east_asia', subregion: 'east_asia', neighbors: ['KR', 'CN'], familiarity: .95 },
  BR: { countryCode: 'BR', region: 'latin_america', subregion: 'south_america', neighbors: ['AR', 'UY', 'PE', 'CO', 'VE'], familiarity: .9 },
  EG: { countryCode: 'EG', region: 'arab', subregion: 'north_africa', neighbors: ['LY', 'TN', 'SA', 'YE'], familiarity: 1 },
  KR: { countryCode: 'KR', region: 'east_asia', subregion: 'east_asia', neighbors: ['JP', 'CN'], familiarity: .88 },
  MX: { countryCode: 'MX', region: 'latin_america', subregion: 'north_america_latin', neighbors: ['US', 'BR', 'PE'], familiarity: .9 },
  FR: { countryCode: 'FR', region: 'europe', subregion: 'western_europe', neighbors: ['BE', 'DE', 'IT', 'ES', 'CH'], familiarity: .98 },
  YE: { countryCode: 'YE', region: 'arab', subregion: 'gulf', neighbors: ['SA', 'OM', 'EG'], familiarity: .78 },
  VN: { countryCode: 'VN', region: 'southeast_asia', subregion: 'mainland_se_asia', neighbors: ['TH', 'CN', 'PH'], familiarity: .72 },
  LY: { countryCode: 'LY', region: 'arab', subregion: 'north_africa', neighbors: ['EG', 'TN', 'DZ'], familiarity: .72 },
  DK: { countryCode: 'DK', region: 'europe', subregion: 'nordic', neighbors: ['SE', 'DE', 'NL'], familiarity: .6 },
  PH: { countryCode: 'PH', region: 'southeast_asia', subregion: 'maritime_se_asia', neighbors: ['ID', 'MY', 'TH', 'VN'], familiarity: .66 },
  ID: { countryCode: 'ID', region: 'southeast_asia', subregion: 'maritime_se_asia', neighbors: ['PH', 'MY', 'TH'], familiarity: .78 },
  MY: { countryCode: 'MY', region: 'southeast_asia', subregion: 'maritime_se_asia', neighbors: ['ID', 'PH', 'TH'], familiarity: .72 },
  TH: { countryCode: 'TH', region: 'southeast_asia', subregion: 'mainland_se_asia', neighbors: ['VN', 'MY', 'PH'], familiarity: .86 },
  AR: { countryCode: 'AR', region: 'latin_america', subregion: 'south_america', neighbors: ['UY', 'CL', 'BR'], familiarity: .72 },
  PE: { countryCode: 'PE', region: 'latin_america', subregion: 'south_america', neighbors: ['CL', 'BR', 'CO'], familiarity: .62 },
  CO: { countryCode: 'CO', region: 'latin_america', subregion: 'south_america', neighbors: ['VE', 'PE', 'BR'], familiarity: .58 },
  CL: { countryCode: 'CL', region: 'latin_america', subregion: 'south_america', neighbors: ['PE', 'AR', 'UY'], familiarity: .56 },
  BE: { countryCode: 'BE', region: 'europe', subregion: 'western_europe', neighbors: ['FR', 'DE', 'NL'], familiarity: .62 },
  DE: { countryCode: 'DE', region: 'europe', subregion: 'western_europe', neighbors: ['FR', 'BE', 'NL', 'DK', 'AT'], familiarity: .86 },
  SE: { countryCode: 'SE', region: 'europe', subregion: 'nordic', neighbors: ['DK', 'NO', 'FI'], familiarity: .62 },
  NL: { countryCode: 'NL', region: 'europe', subregion: 'western_europe', neighbors: ['BE', 'DE', 'DK'], familiarity: .62 },
  UY: { countryCode: 'UY', region: 'latin_america', subregion: 'south_america', neighbors: ['AR', 'BR', 'CL'], familiarity: .42 },
  GE: { countryCode: 'GE', region: 'europe', subregion: 'caucasus', neighbors: ['AM', 'AZ', 'TR'], familiarity: .45 },
  AM: { countryCode: 'AM', region: 'europe', subregion: 'caucasus', neighbors: ['GE', 'AZ', 'TR'], familiarity: .4 },
  AZ: { countryCode: 'AZ', region: 'europe', subregion: 'caucasus', neighbors: ['GE', 'AM', 'TR'], familiarity: .4 },
  TR: { countryCode: 'TR', region: 'europe', subregion: 'east_mediterranean', neighbors: ['GE', 'GR', 'AM', 'AZ'], familiarity: .95 },
  MK: { countryCode: 'MK', region: 'europe', subregion: 'balkans', neighbors: ['BG', 'RS', 'AL', 'GR'], familiarity: .35 },
  BG: { countryCode: 'BG', region: 'europe', subregion: 'balkans', neighbors: ['MK', 'RS', 'GR', 'TR'], familiarity: .48 },
  RS: { countryCode: 'RS', region: 'europe', subregion: 'balkans', neighbors: ['MK', 'BG', 'AL'], familiarity: .46 },
  AL: { countryCode: 'AL', region: 'europe', subregion: 'balkans', neighbors: ['MK', 'GR', 'RS'], familiarity: .44 },
  VE: { countryCode: 'VE', region: 'latin_america', subregion: 'south_america', neighbors: ['CO', 'BR', 'PE'], familiarity: .55 },
};

export function buildDynamicFoodOriginChoices(params: {
  question: FoodOriginQuestion;
  allQuestions: readonly FoodOriginQuestion[];
  seed: number;
  targetCount?: number;
}): FoodOriginChoice[] {
  const { question, allQuestions, seed } = params;
  const targetCount = params.targetCount ?? 4;
  const random = createSeededRandom(seed);

  // The uploaded DISHES pack is already difficulty-sorted, so each question now carries a
  // curated difficulty-aware choice list. Use it first to avoid old/random country choices.
  const curatedChoices = dedupeChoices(question.choices);
  const curatedCorrect = curatedChoices.find((choice) => choice.countryCode === question.answer);
  const curatedDistractors = curatedChoices.filter((choice) => choice.countryCode !== question.answer);
  if (curatedCorrect && curatedDistractors.length >= targetCount - 1) {
    return shuffle([curatedCorrect, ...curatedDistractors.slice(0, targetCount - 1)], random);
  }

  // Fallback for future Food Origin packs: build choices by difficulty proximity.
  const labelsByCode = buildLabelsByCode(allQuestions);
  const correctChoice = createChoice(question.answer, labelsByCode, question);
  const candidateCodes = getAllCountryCodes(allQuestions).filter((countryCode) => countryCode !== question.answer);
  const scoredCandidates = candidateCodes
    .map((countryCode) => ({ countryCode, score: scoreDifficultyAwareDistractor(question, countryCode, random()) }))
    .sort((a, b) => b.score - a.score || a.countryCode.localeCompare(b.countryCode));

  const choices: FoodOriginChoice[] = [correctChoice];
  for (const candidate of scoredCandidates) {
    if (choices.length >= targetCount) break;
    if (choices.some((choice) => choice.countryCode === candidate.countryCode)) continue;
    choices.push(createChoice(candidate.countryCode, labelsByCode, question));
  }

  return shuffle(choices, random);
}

function scoreDifficultyAwareDistractor(question: FoodOriginQuestion, countryCode: string, jitter: number): number {
  const proximity = getCountryProximity(question.answer, countryCode);
  const familiarity = getProfile(countryCode).familiarity ?? .45;

  if (question.difficulty === 'easy') {
    // Lower proximity is better for easy rounds: avoid countries that are too close.
    return (100 - proximity) + familiarity * 16 + jitter * 8;
  }

  if (question.difficulty === 'medium') {
    // Regionally closer, but not necessarily the closest neighbor every time.
    return proximity * 1.25 + familiarity * 10 + jitter * 10;
  }

  // Hard rounds should feel like real origin-confusion: closest countries win.
  return proximity * 1.75 + familiarity * 8 + jitter * 10;
}

function getCountryProximity(correctCode: string, candidateCode: string): number {
  const correct = getProfile(correctCode);
  const candidate = getProfile(candidateCode);
  let score = 0;

  if (correct.region === candidate.region) score += 26;
  if (correct.subregion && correct.subregion === candidate.subregion) score += 34;
  if (correct.neighbors?.includes(candidateCode) || candidate.neighbors?.includes(correctCode)) score += 42;

  return score;
}

function buildLabelsByCode(allQuestions: readonly FoodOriginQuestion[]): Map<string, LocalizedText> {
  const labels = new Map<string, LocalizedText>();
  for (const question of allQuestions) {
    for (const choice of question.choices) {
      labels.set(choice.countryCode, choice.label);
    }
  }
  return labels;
}

function getAllCountryCodes(allQuestions: readonly FoodOriginQuestion[]): string[] {
  const countryCodes = new Set<string>();
  for (const question of allQuestions) {
    countryCodes.add(question.answer);
    for (const choice of question.choices) {
      countryCodes.add(choice.countryCode);
    }
  }
  return [...countryCodes];
}

function createChoice(countryCode: string, labelsByCode: Map<string, LocalizedText>, question: FoodOriginQuestion): FoodOriginChoice {
  const questionChoice = question.choices.find((choice) => choice.countryCode === countryCode);
  if (questionChoice) return questionChoice;
  const label = labelsByCode.get(countryCode) ?? { en: countryCode, ar: countryCode };
  return { countryCode, label };
}

function getProfile(countryCode: string): CountryProfile {
  return COUNTRY_PROFILES[countryCode] ?? { countryCode, region: 'global', familiarity: .35 };
}

function dedupeChoices(choices: readonly FoodOriginChoice[]): FoodOriginChoice[] {
  const used = new Set<string>();
  return choices.filter((choice) => {
    if (used.has(choice.countryCode)) return false;
    used.add(choice.countryCode);
    return true;
  });
}

function createSeededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

function shuffle<T>(items: T[], random: () => number): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}
