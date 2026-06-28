import type { CitizenRuntime } from '../../citizens/citizen-types';
import type { LocaleCode } from '../../localization/locale-types';
import type { QuestionCategory, QuestionDifficulty } from '../../questions/question-types';
import type {
  GuessLogoAnswer,
  GuessLogoChoice,
  MiniGameAnswerRecord,
  MiniGameScoreAward,
  MiniGameSnapshot,
  MiniGameStatus,
  SubmitMiniGameAnswerResult,
} from '../minigame-types';

const PARTICIPATION_POINTS = 10;
const OPTION_COUNT = 4;

const DIFFICULTY_SCORE: Record<QuestionDifficulty, number> = {
  easy: 60,
  medium: 110,
  hard: 160,
};

type GuessLogoQuestion = {
  id: string;
  prompt: { en: string; ar: string };
  logoMark: string;
  correct: { en: string; ar: string; value: string };
  choices: Array<{ en: string; ar: string; value: string }>;
  difficulty: QuestionDifficulty;
  category: QuestionCategory;
  similarityGroup: string;
};

type GuessLogoRound = GuessLogoQuestion & {
  shuffledChoices: GuessLogoChoice[];
  correctOptionNumber: number;
};

const GUESS_LOGO_QUESTIONS: GuessLogoQuestion[] = [
  {
    id: 'guess-logo-video-play-red',
    prompt: { en: 'Which logo is famous for a red play button?', ar: 'أي لوجو مشهور بزرار تشغيل أحمر؟' },
    logoMark: '▶',
    correct: { en: 'YouTube', ar: 'يوتيوب', value: 'youtube' },
    choices: [
      { en: 'YouTube', ar: 'يوتيوب', value: 'youtube' },
      { en: 'Netflix', ar: 'نتفلكس', value: 'netflix' },
      { en: 'Twitch', ar: 'تويتش', value: 'twitch' },
      { en: 'Spotify', ar: 'سبوتيفاي', value: 'spotify' },
    ],
    difficulty: 'easy',
    category: 'games',
    similarityGroup: 'video-platforms',
  },
  {
    id: 'guess-logo-purple-chat',
    prompt: { en: 'Which platform has the purple chat-bubble gaming logo?', ar: 'أي منصة عندها لوجو شات بنفسجي للألعاب؟' },
    logoMark: '▱',
    correct: { en: 'Twitch', ar: 'تويتش', value: 'twitch' },
    choices: [
      { en: 'Twitch', ar: 'تويتش', value: 'twitch' },
      { en: 'Discord', ar: 'ديسكورد', value: 'discord' },
      { en: 'TikTok', ar: 'تيك توك', value: 'tiktok' },
      { en: 'YouTube', ar: 'يوتيوب', value: 'youtube' },
    ],
    difficulty: 'easy',
    category: 'games',
    similarityGroup: 'streaming-platforms',
  },
  {
    id: 'guess-logo-red-n',
    prompt: { en: 'Which streaming service is known for a red N?', ar: 'أي خدمة مشاهدة مشهورة بحرف N أحمر؟' },
    logoMark: 'N',
    correct: { en: 'Netflix', ar: 'نتفلكس', value: 'netflix' },
    choices: [
      { en: 'Netflix', ar: 'نتفلكس', value: 'netflix' },
      { en: 'Nintendo', ar: 'نينتندو', value: 'nintendo' },
      { en: 'Nike', ar: 'نايكي', value: 'nike' },
      { en: 'Nvidia', ar: 'إنفيديا', value: 'nvidia' },
    ],
    difficulty: 'medium',
    category: 'internet',
    similarityGroup: 'letter-logos',
  },
  {
    id: 'guess-logo-camera-gradient',
    prompt: { en: 'Which app logo is a rounded camera with gradient colors?', ar: 'أي تطبيق لوجوه كاميرا بألوان متدرجة؟' },
    logoMark: '◉',
    correct: { en: 'Instagram', ar: 'إنستجرام', value: 'instagram' },
    choices: [
      { en: 'Instagram', ar: 'إنستجرام', value: 'instagram' },
      { en: 'Snapchat', ar: 'سناب شات', value: 'snapchat' },
      { en: 'Pinterest', ar: 'بنترست', value: 'pinterest' },
      { en: 'TikTok', ar: 'تيك توك', value: 'tiktok' },
    ],
    difficulty: 'easy',
    category: 'internet',
    similarityGroup: 'social-apps',
  },
  {
    id: 'guess-logo-music-note',
    prompt: { en: 'Which app logo uses a music-note style mark?', ar: 'أي تطبيق لوجوه علامة موسيقية؟' },
    logoMark: '♪',
    correct: { en: 'TikTok', ar: 'تيك توك', value: 'tiktok' },
    choices: [
      { en: 'TikTok', ar: 'تيك توك', value: 'tiktok' },
      { en: 'Spotify', ar: 'سبوتيفاي', value: 'spotify' },
      { en: 'SoundCloud', ar: 'ساوند كلاود', value: 'soundcloud' },
      { en: 'Shazam', ar: 'شازام', value: 'shazam' },
    ],
    difficulty: 'medium',
    category: 'internet',
    similarityGroup: 'music-apps',
  },
  {
    id: 'guess-logo-golden-arches',
    prompt: { en: 'Which restaurant logo is known for golden arches?', ar: 'أي مطعم مشهور بالأقواس الذهبية؟' },
    logoMark: 'M',
    correct: { en: "McDonald's", ar: 'ماكدونالدز', value: 'mcdonalds' },
    choices: [
      { en: "McDonald's", ar: 'ماكدونالدز', value: 'mcdonalds' },
      { en: 'Burger King', ar: 'برجر كينج', value: 'burger-king' },
      { en: 'KFC', ar: 'كي إف سي', value: 'kfc' },
      { en: 'Pizza Hut', ar: 'بيتزا هت', value: 'pizza-hut' },
    ],
    difficulty: 'easy',
    category: 'food',
    similarityGroup: 'fast-food',
  },
  {
    id: 'guess-logo-swoosh',
    prompt: { en: 'Which sports brand is known for a swoosh?', ar: 'أي براند رياضي مشهور بعلامة السووش؟' },
    logoMark: '✓',
    correct: { en: 'Nike', ar: 'نايكي', value: 'nike' },
    choices: [
      { en: 'Nike', ar: 'نايكي', value: 'nike' },
      { en: 'Adidas', ar: 'أديداس', value: 'adidas' },
      { en: 'Puma', ar: 'بوما', value: 'puma' },
      { en: 'Reebok', ar: 'ريبوك', value: 'reebok' },
    ],
    difficulty: 'medium',
    category: 'sports',
    similarityGroup: 'sports-brands',
  },
  {
    id: 'guess-logo-three-stripes',
    prompt: { en: 'Which sports brand is famous for three stripes?', ar: 'أي براند رياضي مشهور بالتلات خطوط؟' },
    logoMark: '≡',
    correct: { en: 'Adidas', ar: 'أديداس', value: 'adidas' },
    choices: [
      { en: 'Adidas', ar: 'أديداس', value: 'adidas' },
      { en: 'Nike', ar: 'نايكي', value: 'nike' },
      { en: 'Puma', ar: 'بوما', value: 'puma' },
      { en: 'Fila', ar: 'فيلا', value: 'fila' },
    ],
    difficulty: 'hard',
    category: 'sports',
    similarityGroup: 'sports-brands',
  },
];

export class GuessLogoMiniGameService {
  private round: GuessLogoRound | null = null;
  private status: MiniGameStatus = 'idle';
  private roundNumber = 0;
  private readonly answers = new Map<string, MiniGameAnswerRecord>();
  private correctOfficialCount = 0;
  private correctSpectatorCount = 0;
  private scored = false;
  private readonly tourUsedQuestionIds = new Set<string>();
  private readonly sessionUsedQuestionIds = new Set<string>();

  beginTour(): void {
    this.tourUsedQuestionIds.clear();
    this.clearActiveRound();
  }

  startRound(roundNumber: number): void {
    this.roundNumber = roundNumber;
    this.round = this.pickRound(roundNumber);
    this.status = 'intro';
    this.answers.clear();
    this.correctOfficialCount = 0;
    this.correctSpectatorCount = 0;
    this.scored = false;
    this.tourUsedQuestionIds.add(this.round.id);
    this.sessionUsedQuestionIds.add(this.round.id);
  }

  setStatus(status: MiniGameStatus): void {
    if (!this.round && status !== 'idle') return;
    this.status = status;
  }

  submitAnswer(citizen: CitizenRuntime, answer: GuessLogoAnswer): SubmitMiniGameAnswerResult {
    if (!this.round) return { ok: false, reason: 'no_round' };
    if (this.status !== 'answering') return { ok: false, reason: 'closed' };
    if (this.answers.has(citizen.twitchUserId)) return { ok: false, reason: 'already_answered' };

    const selectedChoice = this.round.shuffledChoices.find((choice) => `option-${choice.optionNumber}` === answer);
    const isCorrect = selectedChoice?.value === this.round.correct.value;
    const record: MiniGameAnswerRecord = {
      twitchUserId: citizen.twitchUserId,
      displayName: citizen.displayName,
      role: citizen.role,
      answer,
      submittedAt: Date.now(),
      isCorrect,
    };

    this.answers.set(citizen.twitchUserId, record);
    return { ok: true, record };
  }

  resolveRound(): void {
    if (!this.round) return;

    this.correctOfficialCount = 0;
    this.correctSpectatorCount = 0;

    for (const [id, record] of this.answers.entries()) {
      const selectedChoice = this.round.shuffledChoices.find((choice) => `option-${choice.optionNumber}` === record.answer);
      const isCorrect = selectedChoice?.value === this.round.correct.value;
      const resolvedRecord = { ...record, isCorrect };
      this.answers.set(id, resolvedRecord);

      if (isCorrect && record.role === 'official') this.correctOfficialCount += 1;
      if (isCorrect && record.role === 'spectator') this.correctSpectatorCount += 1;
    }

    this.status = 'resolved';
  }

  createScoreAwards(): MiniGameScoreAward[] {
    if (!this.round || this.scored) return [];

    const awards: MiniGameScoreAward[] = [];
    for (const record of this.answers.values()) {
      const selectedChoice = this.round.shuffledChoices.find((choice) => `option-${choice.optionNumber}` === record.answer);
      const isCorrect = selectedChoice?.value === this.round.correct.value;
      awards.push({
        twitchUserId: record.twitchUserId,
        displayName: record.displayName,
        role: record.role,
        points: isCorrect ? DIFFICULTY_SCORE[this.round.difficulty] : PARTICIPATION_POINTS,
        isCorrect,
        difficulty: this.round.difficulty,
      });
    }

    this.scored = true;
    this.status = 'scored';
    return awards;
  }

  clearActiveRound(): void {
    this.round = null;
    this.status = 'idle';
    this.roundNumber = 0;
    this.answers.clear();
    this.correctOfficialCount = 0;
    this.correctSpectatorCount = 0;
    this.scored = false;
  }

  clear(): void {
    this.clearActiveRound();
  }

  getSnapshot(locale: LocaleCode): MiniGameSnapshot {
    const officialAnswerCount = [...this.answers.values()].filter((answer) => answer.role === 'official').length;
    const spectatorAnswerCount = [...this.answers.values()].filter((answer) => answer.role === 'spectator').length;
    const shouldRevealAnswer = this.status === 'resolved' || this.status === 'scored' || this.status === 'leaderboard';

    return {
      id: 'guess-logo',
      status: this.status,
      roundNumber: this.roundNumber,
      title: locale === 'ar' ? 'خمن اللوجو' : 'GUESS THE LOGO',
      statement: this.round ? this.round.prompt[locale] : '',
      instruction: this.round ? this.buildInstruction(locale) : '',
      acceptsAnswers: this.status === 'answering',
      officialAnswerCount,
      spectatorAnswerCount,
      answerRecords: [...this.answers.values()],
      correctAnswer: shouldRevealAnswer && this.round ? `option-${this.round.correctOptionNumber}` as GuessLogoAnswer : null,
      correctOfficialCount: this.correctOfficialCount,
      correctSpectatorCount: this.correctSpectatorCount,
      hasRound: Boolean(this.round),
      questionId: this.round?.id ?? null,
      questionCategory: this.round?.category ?? null,
      questionDifficulty: this.round?.difficulty ?? null,
      questionBankStats: {
        totalQuestions: GUESS_LOGO_QUESTIONS.length,
        tourUsedQuestions: this.tourUsedQuestionIds.size,
        tourUsedSimilarityGroups: this.tourUsedQuestionIds.size,
        sessionUsedQuestions: this.sessionUsedQuestionIds.size,
        sessionUsedSimilarityGroups: this.sessionUsedQuestionIds.size,
      },
      guessLogo: this.round
        ? {
            prompt: this.round.prompt[locale],
            logoMark: this.round.logoMark,
            choices: this.round.shuffledChoices.map((choice) => ({
              ...choice,
              label: this.getChoiceLabel(choice.value, locale),
            })),
            correctLogo: shouldRevealAnswer ? this.round.correct[locale] : null,
            correctOptionNumber: shouldRevealAnswer ? this.round.correctOptionNumber : null,
          }
        : null,
    };
  }

  getAnswerByOptionNumber(optionNumber: number): GuessLogoAnswer | null {
    if (!this.round || optionNumber < 1 || optionNumber > OPTION_COUNT) return null;
    return `option-${optionNumber}` as GuessLogoAnswer;
  }

  private buildInstruction(locale: LocaleCode): string {
    return locale === 'ar' ? 'اختار اللوجو الصح: !1 / !2 / !3 / !4' : 'Pick the correct logo: !1 / !2 / !3 / !4';
  }

  private pickRound(roundNumber: number): GuessLogoRound {
    const candidates = GUESS_LOGO_QUESTIONS.filter((question) => !this.tourUsedQuestionIds.has(question.id) && !this.sessionUsedQuestionIds.has(question.id));
    const safeCandidates = candidates.length > 0 ? candidates : GUESS_LOGO_QUESTIONS.filter((question) => !this.tourUsedQuestionIds.has(question.id));
    const pool = safeCandidates.length > 0 ? safeCandidates : GUESS_LOGO_QUESTIONS;
    const random = createSeededRandom(Date.now() + roundNumber * 1999 + this.sessionUsedQuestionIds.size * 7919);
    const question = pool[Math.floor(random() * pool.length)] ?? GUESS_LOGO_QUESTIONS[0];
    const shuffledChoices = shuffle(question.choices, random).map((choice, index) => ({
      optionNumber: index + 1,
      command: `!${index + 1}`,
      label: choice.en,
      value: choice.value,
    }));
    const correctOptionNumber = shuffledChoices.find((choice) => choice.value === question.correct.value)?.optionNumber ?? 1;

    return { ...question, shuffledChoices, correctOptionNumber };
  }

  private getChoiceLabel(value: string, locale: LocaleCode): string {
    const choice = GUESS_LOGO_QUESTIONS.flatMap((question) => question.choices).find((item) => item.value === value);
    return choice?.[locale] ?? value;
  }
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
