import type { CitizenRole } from '../citizens/citizen-types';

export type TourAwardId =
  | 'champion'
  | 'best_spectator'
  | 'most_correct'
  | 'biggest_comeback'
  | 'most_participating'
  | 'chaos_survivor'
  | 'most_unlucky';

export type TourAwardWinner = {
  twitchUserId: string;
  displayName: string;
  role: CitizenRole;
  score: number;
  level: number;
};

export type TourAward = {
  id: TourAwardId;
  title: string;
  description: string;
  winner: TourAwardWinner | null;
  valueLabel: string;
  reason: string;
};

export type TourScoreboardRow = {
  twitchUserId: string;
  displayName: string;
  role: CitizenRole;
  roundPoints: number[];
  total: number;
};

export type TourPlayerStats = {
  twitchUserId: string;
  displayName: string;
  role: CitizenRole;
  startScore: number;
  currentScore: number;
  totalAnswers: number;
  correctAnswers: number;
  wrongAnswers: number;
  pointsEarned: number;
  roundPoints: number[];
  chaosRounds: number;
  unluckyRounds: number;
};

export type TourAwardsSnapshot = {
  champion: TourAwardWinner | null;
  topOfficial: TourAwardWinner[];
  bestSpectator: TourAwardWinner | null;
  awards: TourAward[];
  scoreboardRows: TourScoreboardRow[];
  officialCount: number;
  spectatorCount: number;
  roundsPlayed: number;
};

export const EMPTY_TOUR_AWARDS: TourAwardsSnapshot = {
  champion: null,
  topOfficial: [],
  bestSpectator: null,
  awards: [],
  scoreboardRows: [],
  officialCount: 0,
  spectatorCount: 0,
  roundsPlayed: 0,
};
