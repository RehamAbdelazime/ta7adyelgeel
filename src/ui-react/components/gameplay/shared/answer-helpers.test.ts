import { describe, expect, it } from 'vitest';
import type { MiniGameSnapshot } from '../../../../game-core/minigames/minigame-types';
import {
  buildChoiceSpotlights,
  getCorrectOptionNumber,
  getOptionNumberForAnswer,
  getChoiceOptionResultState,
} from './answer-helpers';
import { getCorrectAnswerText } from './overlay-types';

function createSnapshot(
  id: MiniGameSnapshot['id'],
  overrides: Partial<MiniGameSnapshot> = {},
): MiniGameSnapshot {
  return {
    id,
    status: 'scored',
    roundNumber: 1,
    title: 'Test game',
    statement: 'Test statement',
    instruction: '',
    acceptsAnswers: false,
    officialAnswerCount: 0,
    spectatorAnswerCount: 0,
    answerRecords: [],
    correctAnswer: null,
    correctOfficialCount: 0,
    correctSpectatorCount: 0,
    hasRound: true,
    questionId: 'test-question',
    questionCategory: null,
    questionDifficulty: 'easy',
    questionBankStats: {
      totalQuestions: 1,
      tourUsedQuestions: 1,
      tourUsedSimilarityGroups: 1,
      sessionUsedQuestions: 1,
      sessionUsedSimilarityGroups: 1,
    },
    ...overrides,
  } as MiniGameSnapshot;
}

describe('shared answer helpers', () => {

  it('classifies a one-count Memory Count near-miss as partial instead of wrong', () => {
    const memory = createSnapshot('memory-count', {
      correctAnswer: 'option-2',
      memoryCount: {
        rows: 4,
        columns: 6,
        cells: [],
        targetKind: 'star',
        targetLabel: 'Stars',
        choices: [
          { optionNumber: 1, command: '!1', label: '8', value: 8 },
          { optionNumber: 2, command: '!2', label: '9', value: 9 },
          { optionNumber: 3, command: '!3', label: '12', value: 12 },
          { optionNumber: 4, command: '!4', label: '14', value: 14 },
        ],
        correctCount: 9,
        showItems: false,
        scoring: { exact: 60, partial: 15, partialTolerance: 1, incorrect: 0 },
      },
    });

    expect(getChoiceOptionResultState(memory, 2)).toBe('correct');
    expect(getChoiceOptionResultState(memory, 1)).toBe('partial');
    expect(getChoiceOptionResultState(memory, 3)).toBe('wrong');
  });

  it('resolves Lucky Cup numeric answers as cup options', () => {
    const snapshot = createSnapshot('lucky-cup', {
      correctAnswer: 3,
      luckyCup: {
        initialBallCupId: 0,
        finalBallCupId: 0,
        correctCupNumber: 3,
        cups: [
          { cupId: 0, label: '1' },
          { cupId: 1, label: '2' },
          { cupId: 2, label: '3' },
        ],
        swaps: [],
        revealMs: 1000,
      },
    });

    expect(getCorrectOptionNumber(snapshot)).toBe(3);
    expect(getCorrectAnswerText(snapshot)).toBe('!3');
    expect(getOptionNumberForAnswer(snapshot, 2)).toBe(2);
    expect(buildChoiceSpotlights(snapshot)).toHaveLength(3);
  });

  it('shows Count the Beat numeric answers without assuming a choice-based answer', () => {
    const snapshot = createSnapshot('count-the-beat', {
      correctAnswer: 12,
      countTheBeat: {
        targetIcon: 'note',
        targetLabel: 'music notes',
        targetGlyph: '♪',
        targetCount: 12,
        bpm: 108,
        items: [],
        scoring: { exact: 100, partial: 25, partialTolerance: 1, incorrect: 0 },
      },
    });

    expect(getCorrectAnswerText(snapshot)).toBe('12');
    expect(getCorrectOptionNumber(snapshot)).toBeNull();
  });

  it('resolves the public question-bank and procedural option formats', () => {
    const food = createSnapshot('food-origin', {
      correctAnswer: 'option-3',
      foodOrigin: {
        dishName: 'Pizza',
        dishImageLabel: 'Pizza',
        choices: [
          { optionNumber: 1, command: '!1', label: 'Egypt', countryCode: 'EG' },
          { optionNumber: 2, command: '!2', label: 'Greece', countryCode: 'GR' },
          { optionNumber: 3, command: '!3', label: 'Italy', countryCode: 'IT' },
          { optionNumber: 4, command: '!4', label: 'France', countryCode: 'FR' },
        ],
        correctCountry: 'Italy',
        correctCountryCode: 'IT',
      },
    });
    expect(getCorrectOptionNumber(food)).toBe(3);
    expect(getCorrectAnswerText(food)).toBe('Italy');
    expect(getOptionNumberForAnswer(food, 'option-3')).toBe(3);

    const shapes = createSnapshot('shape-count', {
      correctAnswer: 'triangle',
      shapeGrid: {
        rows: 2,
        columns: 2,
        cells: [],
        choices: [
          { optionNumber: 1, command: '!1', label: 'Circle', shape: 'circle' },
          { optionNumber: 2, command: '!2', label: 'Triangle', shape: 'triangle' },
        ],
        counts: { triangle: 4 },
        mode: 'majority',
        targetCount: null,
      },
    });
    expect(getCorrectOptionNumber(shapes)).toBe(2);
    expect(getOptionNumberForAnswer(shapes, 'triangle')).toBe(2);
    expect(getCorrectAnswerText(shapes)).toBe('!2 Triangle');

    const maze = createSnapshot('maze-gates', {
      correctAnswer: 'option-3',
      mazeGates: {
        gateCount: 3,
        choices: [
          { optionNumber: 1, command: '!1', label: 'Gate A' },
          { optionNumber: 2, command: '!2', label: 'Gate B' },
          { optionNumber: 3, command: '!3', label: 'Gate C' },
        ],
        revealPath: true,
        correctOptionNumber: 3,
        paths: [],
      },
    });
    expect(getCorrectOptionNumber(maze)).toBe(3);
    expect(getOptionNumberForAnswer(maze, 'option-3')).toBe(3);
    expect(getCorrectAnswerText(maze)).toBe('!3');

  });

});
