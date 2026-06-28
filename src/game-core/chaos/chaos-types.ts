import type { LocaleCode } from '../localization/locale-types';

export type ChaosEventCategory = 'score' | 'time' | 'answer' | 'role' | 'instant';
export type ChaosEventRarity = 'common' | 'rare' | 'legendary';
export type ChaosEventAppliesTo = 'all' | 'official' | 'spectator' | 'bottomPlayers' | 'topPlayers';

export type ChaosLocalizedText = Record<LocaleCode, string>;

export type ChaosEventDefinition = {
  id: string;
  title: ChaosLocalizedText;
  description: ChaosLocalizedText;
  category: ChaosEventCategory;
  rarity: ChaosEventRarity;
  appliesTo: ChaosEventAppliesTo;
  scoreMultiplier?: number;
  flatScoreDelta?: number;
  wrongAnswerPenalty?: number;
  answerWindowMultiplier?: number;
  correctOnly?: boolean;
};

export type ChaosEventSnapshot = {
  active: boolean;
  id: string | null;
  title: string;
  description: string;
  category: ChaosEventCategory | null;
  rarity: ChaosEventRarity | null;
  badge: string;
  scoreMultiplier: number | null;
  flatScoreDelta: number | null;
  wrongAnswerPenalty: number | null;
  answerWindowMultiplier: number | null;
};
