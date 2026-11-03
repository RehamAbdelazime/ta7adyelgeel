import rawQuestions from './true-fake-questions.json';
import type { GameQuestionBase, QuestionCategory, QuestionDifficulty } from '../../questions/question-types';
import type { TrueFakeAnswer } from '../minigame-types';

export type TrueFakeQuestion = GameQuestionBase<TrueFakeAnswer>;

const CATEGORIES: ReadonlySet<string> = new Set<QuestionCategory>([
  'science', 'animals', 'space', 'history', 'geography', 'games',
  'food', 'sports', 'internet', 'language', 'weird', 'horror',
]);
const DIFFICULTIES: ReadonlySet<string> = new Set<QuestionDifficulty>(['easy', 'medium', 'hard']);

/**
 * The question bank is data, not 7,500 lines of executable TypeScript.
 * Keep content edits in JSON. Validate the boundary once before the bank is
 * handed to the runtime so a malformed question fails loudly and early.
 */
function isTrueFakeQuestion(value: unknown): value is TrueFakeQuestion {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false;
  const question = value as Record<string, unknown>;
  if (typeof question.id !== 'string' || !question.id.trim()) return false;
  if (question.answer !== 'true' && question.answer !== 'fake') return false;
  if (!CATEGORIES.has(question.category as string)) return false;
  if (!DIFFICULTIES.has(question.difficulty as string)) return false;
  if (typeof question.similarityGroup !== 'string' || !question.similarityGroup.trim()) return false;
  if (!Array.isArray(question.tags) || !question.tags.every(tag => typeof tag === 'string')) return false;
  const statement = question.statement;
  if (typeof statement !== 'object' || statement === null || Array.isArray(statement)) return false;
  const translated = statement as Record<string, unknown>;
  if (typeof translated.en !== 'string' || !translated.en.trim()) return false;
  if (typeof translated.ar !== 'string' || !translated.ar.trim()) return false;
  const explanation = question.explanation;
  if (explanation !== undefined) {
    if (typeof explanation !== 'object' || explanation === null || Array.isArray(explanation)) return false;
    const text = explanation as Record<string, unknown>;
    if (typeof text.en !== 'string' || typeof text.ar !== 'string') return false;
  }
  return true;
}

function loadTrueFakeQuestions(value: unknown): TrueFakeQuestion[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error('True/Fake: question bank must be a non-empty array.');
  }
  const seenIds = new Set<string>();
  return value.map((question: unknown, index) => {
    if (!isTrueFakeQuestion(question)) {
      throw new Error(`True/Fake: malformed question at index ${index}.`);
    }
    if (seenIds.has(question.id)) {
      throw new Error(`True/Fake: duplicate question ID ${question.id}.`);
    }
    seenIds.add(question.id);
    return question;
  });
}

export const TRUE_FAKE_QUESTIONS: TrueFakeQuestion[] = loadTrueFakeQuestions(rawQuestions);
