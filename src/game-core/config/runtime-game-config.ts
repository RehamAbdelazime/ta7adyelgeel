import type { MiniGameId, MiniGameScoreAward } from '../minigames/minigame-types';
import type { TourPhase } from '../tours/tour-types';

export type RuntimeGameConfig = {
  version: number;
  tour: {
    defaultRoundCount: number;
    minRoundCount: number;
    maxRoundCount: number;
    miniGameRotation: MiniGameId[];
    enabledMiniGames: MiniGameId[];
    phaseDurationsMs: Partial<Record<TourPhase, number>>;
    miniGamePhaseOverridesMs: Partial<Record<MiniGameId, Partial<Record<TourPhase, number>>>>;
    singleMiniGameRoundCounts: Partial<Record<MiniGameId, number>>;
  };
  scoring: {
    officialParticipationXp: number;
    officialParticipationCoins: number;
    officialCorrectRewardByDifficulty: Record<MiniGameScoreAward['difficulty'], { xp: number; coins: number }>;
  };
  persistence: {
    saveDebounceMs: number;
    maxTourHistoryEntries: number;
  };
  qa: {
    maxTestPlayers: number;
  };
};

export const MINI_GAME_IDS: MiniGameId[] = [
  'food-origin',
  'shape-count',
  'maze-gates',
  'before-after',
  'guess-logo',
  'count-the-beat',
  'lucky-cup',
];

export const DEFAULT_RUNTIME_GAME_CONFIG: RuntimeGameConfig = {
  version: 1,
  tour: {
    defaultRoundCount: 3,
    minRoundCount: 1,
    maxRoundCount: 12,
    miniGameRotation: MINI_GAME_IDS,
    enabledMiniGames: MINI_GAME_IDS,
    singleMiniGameRoundCounts: {
      'food-origin': 3,
      'shape-count': 3,
      'maze-gates': 3,
      'before-after': 3,
      'guess-logo': 3,
      'count-the-beat': 3,
      'lucky-cup': 3,
    },
    phaseDurationsMs: {
      lobby_open: 0,
      mini_game_intro: 0,
      tour_starting: 3_000,
      answer_window_open: 20_000,
      scoring: 0,
      tour_complete: 0,
      cleanup: 0,
    },
    miniGamePhaseOverridesMs: {},
  },
  scoring: {
    officialParticipationXp: 20,
    officialParticipationCoins: 2,
    officialCorrectRewardByDifficulty: {
      easy: { xp: 40, coins: 6 },
      medium: { xp: 60, coins: 10 },
      hard: { xp: 90, coins: 16 },
    },
  },
  persistence: {
    saveDebounceMs: 250,
    maxTourHistoryEntries: 50,
  },
  qa: {
    maxTestPlayers: 72,
  },
};

export function normalizeRuntimeGameConfig(rawConfig: unknown): RuntimeGameConfig {
  const input = isRecord(rawConfig) ? rawConfig : {};
  const tour = isRecord(input.tour) ? input.tour : {};
  const scoring = isRecord(input.scoring) ? input.scoring : {};
  const persistence = isRecord(input.persistence) ? input.persistence : {};
  const qa = isRecord(input.qa) ? input.qa : {};
  const phaseDurations = isRecord(tour.phaseDurationsMs) ? tour.phaseDurationsMs : {};
  const overrides = isRecord(tour.miniGamePhaseOverridesMs) ? tour.miniGamePhaseOverridesMs : {};
  const correctRewards = isRecord(scoring.officialCorrectRewardByDifficulty) ? scoring.officialCorrectRewardByDifficulty : {};

  const minRoundCount = readInteger(tour.minRoundCount, DEFAULT_RUNTIME_GAME_CONFIG.tour.minRoundCount, 1, 50);
  const maxRoundCount = Math.max(minRoundCount, readInteger(tour.maxRoundCount, DEFAULT_RUNTIME_GAME_CONFIG.tour.maxRoundCount, minRoundCount, 99));

  return {
    version: readInteger(input.version, DEFAULT_RUNTIME_GAME_CONFIG.version, 1, 99),
    tour: {
      defaultRoundCount: readInteger(tour.defaultRoundCount, DEFAULT_RUNTIME_GAME_CONFIG.tour.defaultRoundCount, minRoundCount, maxRoundCount),
      minRoundCount,
      maxRoundCount,
      miniGameRotation: readMiniGameIdArray(tour.miniGameRotation, DEFAULT_RUNTIME_GAME_CONFIG.tour.miniGameRotation),
      enabledMiniGames: readMiniGameIdArray(tour.enabledMiniGames, DEFAULT_RUNTIME_GAME_CONFIG.tour.enabledMiniGames),
      phaseDurationsMs: {
        lobby_open: readDuration(phaseDurations.lobby_open, DEFAULT_RUNTIME_GAME_CONFIG.tour.phaseDurationsMs.lobby_open ?? 0, 0, 60_000),
        mini_game_intro: readDuration(phaseDurations.mini_game_intro, DEFAULT_RUNTIME_GAME_CONFIG.tour.phaseDurationsMs.mini_game_intro ?? 0, 0, 60_000),
        tour_starting: readDuration(phaseDurations.tour_starting, DEFAULT_RUNTIME_GAME_CONFIG.tour.phaseDurationsMs.tour_starting ?? 3_000, 0, 60_000),
        answer_window_open: readDuration(phaseDurations.answer_window_open, DEFAULT_RUNTIME_GAME_CONFIG.tour.phaseDurationsMs.answer_window_open ?? 20_000, 1_000, 300_000),
        scoring: readDuration(phaseDurations.scoring, DEFAULT_RUNTIME_GAME_CONFIG.tour.phaseDurationsMs.scoring ?? 0, 0, 60_000),
        tour_complete: readDuration(phaseDurations.tour_complete, DEFAULT_RUNTIME_GAME_CONFIG.tour.phaseDurationsMs.tour_complete ?? 0, 0, 60_000),
        cleanup: readDuration(phaseDurations.cleanup, DEFAULT_RUNTIME_GAME_CONFIG.tour.phaseDurationsMs.cleanup ?? 0, 0, 60_000),
      },
      miniGamePhaseOverridesMs: normalizeMiniGamePhaseOverrides(overrides),
      singleMiniGameRoundCounts: normalizeSingleMiniGameRoundCounts(tour.singleMiniGameRoundCounts),
    },
    scoring: {
      officialParticipationXp: readInteger(scoring.officialParticipationXp, DEFAULT_RUNTIME_GAME_CONFIG.scoring.officialParticipationXp, 0, 10_000),
      officialParticipationCoins: readInteger(scoring.officialParticipationCoins, DEFAULT_RUNTIME_GAME_CONFIG.scoring.officialParticipationCoins, 0, 10_000),
      officialCorrectRewardByDifficulty: {
        easy: readReward(correctRewards.easy, DEFAULT_RUNTIME_GAME_CONFIG.scoring.officialCorrectRewardByDifficulty.easy),
        medium: readReward(correctRewards.medium, DEFAULT_RUNTIME_GAME_CONFIG.scoring.officialCorrectRewardByDifficulty.medium),
        hard: readReward(correctRewards.hard, DEFAULT_RUNTIME_GAME_CONFIG.scoring.officialCorrectRewardByDifficulty.hard),
      },
    },
    persistence: {
      saveDebounceMs: readInteger(persistence.saveDebounceMs, DEFAULT_RUNTIME_GAME_CONFIG.persistence.saveDebounceMs, 50, 10_000),
      maxTourHistoryEntries: readInteger(persistence.maxTourHistoryEntries, DEFAULT_RUNTIME_GAME_CONFIG.persistence.maxTourHistoryEntries, 0, 500),
    },
    qa: {
      maxTestPlayers: readInteger(qa.maxTestPlayers, DEFAULT_RUNTIME_GAME_CONFIG.qa.maxTestPlayers, 1, 300),
    },
  };
}


function normalizeSingleMiniGameRoundCounts(value: unknown): RuntimeGameConfig['tour']['singleMiniGameRoundCounts'] {
  const input = isRecord(value) ? value : {};
  const normalized: RuntimeGameConfig['tour']['singleMiniGameRoundCounts'] = {
    ...DEFAULT_RUNTIME_GAME_CONFIG.tour.singleMiniGameRoundCounts,
  };

  for (const miniGameId of MINI_GAME_IDS) {
    if (input[miniGameId] === undefined) {
      continue;
    }

    normalized[miniGameId] = readInteger(input[miniGameId], normalized[miniGameId] ?? 1, 1, 25);
  }

  return normalized;
}

function normalizeMiniGamePhaseOverrides(overrides: Record<string, unknown>): RuntimeGameConfig['tour']['miniGamePhaseOverridesMs'] {
  const normalized: RuntimeGameConfig['tour']['miniGamePhaseOverridesMs'] = {};

  for (const miniGameId of MINI_GAME_IDS) {
    const rawOverride = overrides[miniGameId];

    if (!isRecord(rawOverride)) {
      continue;
    }

    const phaseOverrides: Partial<Record<TourPhase, number>> = {};

    for (const [phase, value] of Object.entries(rawOverride)) {
      if (!isTourPhase(phase)) {
        continue;
      }

      phaseOverrides[phase] = readDuration(value, DEFAULT_RUNTIME_GAME_CONFIG.tour.phaseDurationsMs[phase] ?? 0, 0, 300_000);
    }

    normalized[miniGameId] = phaseOverrides;
  }

  if (!normalized.hangman?.answer_window_open) {
    normalized.hangman = {
      ...normalized.hangman,
      answer_window_open: DEFAULT_RUNTIME_GAME_CONFIG.tour.miniGamePhaseOverridesMs.hangman?.answer_window_open ?? 20_000,
    };
  }

  return normalized;
}

function readReward(value: unknown, fallback: { xp: number; coins: number }): { xp: number; coins: number } {
  const input = isRecord(value) ? value : {};

  return {
    xp: readInteger(input.xp, fallback.xp, 0, 10_000),
    coins: readInteger(input.coins, fallback.coins, 0, 10_000),
  };
}

function readMiniGameIdArray(value: unknown, fallback: MiniGameId[]): MiniGameId[] {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const ids = value.filter(isMiniGameId);
  return ids.length > 0 ? [...new Set(ids)] : fallback;
}

function readDuration(value: unknown, fallback: number, min: number, max: number): number {
  return readInteger(value, fallback, min, max);
}

function readInteger(value: unknown, fallback: number, min: number, max: number): number {
  const numeric = typeof value === 'number' ? value : Number(value);

  if (!Number.isFinite(numeric)) {
    return fallback;
  }

  return Math.max(min, Math.min(max, Math.round(numeric)));
}

function isMiniGameId(value: unknown): value is MiniGameId {
  return typeof value === 'string' && (MINI_GAME_IDS as string[]).includes(value);
}

function isTourPhase(value: string): value is TourPhase {
  return ['lobby_open', 'mini_game_intro', 'tour_starting', 'answer_window_open', 'scoring', 'tour_complete', 'cleanup'].includes(value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
