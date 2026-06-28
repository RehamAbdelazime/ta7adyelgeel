import type { LocaleCode } from '../localization/locale-types';

export type QuestionCategory =
  | 'science'
  | 'animals'
  | 'space'
  | 'history'
  | 'geography'
  | 'games'
  | 'food'
  | 'sports'
  | 'internet'
  | 'language'
  | 'weird'
  | 'horror';

export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

export type LocalizedText = Record<LocaleCode, string>;

export type QuestionSelectionRelaxation = 'none' | 'session' | 'category' | 'exhausted';

export type GameQuestionBase<TAnswer extends string> = {
  id: string;
  answer: TAnswer;
  statement: LocalizedText;
  category: QuestionCategory;
  difficulty: QuestionDifficulty;
  tags: string[];
  similarityGroup: string;
  explanation?: LocalizedText;
};

export type QuestionSelectionResult<TQuestion extends GameQuestionBase<string>> = {
  question: TQuestion;
  relaxation: QuestionSelectionRelaxation;
  candidateCount: number;
  strictCandidateCount: number;
};

export type QuestionBankStats = {
  totalQuestions: number;
  tourUsedQuestions: number;
  tourUsedSimilarityGroups: number;
  sessionUsedQuestions: number;
  sessionUsedSimilarityGroups: number;
};
