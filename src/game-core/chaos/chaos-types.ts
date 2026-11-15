import type { LocaleCode } from '../localization/locale-types';

export type ChaosEventCategory = 'score' | 'time' | 'answer' | 'reward';
export type ChaosEventRarity = 'common' | 'rare' | 'legendary';
export type ChaosEventAppliesTo = 'all' | 'official';

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
  /** Fraction of the unmodified base score deducted for a fully wrong answer. */
  wrongAnswerPenaltyRatio?: number;
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
  wrongAnswerPenaltyRatio: number | null;
  answerWindowMultiplier: number | null;
};

/** Tour-scoped rewards; never persisted as XP or granted to spectators. */
export type ChaosPlayerReward = {
  twitchUserId: string;
  shield: number;
  boost: number;
  crown: boolean;
};
