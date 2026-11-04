/**
 * GENERATED FILE — DO NOT EDIT BY HAND.
 * Source: public/assets/game/runtime/config/gameplay-config.json
 * Regenerate with: node scripts/generate-runtime-game-config.mjs
 */
export const DEFAULT_RUNTIME_GAME_CONFIG_DATA = {
  "version": 1,
  "tour": {
    "defaultRoundCount": 3,
    "minRoundCount": 1,
    "maxRoundCount": 12,
    "miniGameRotation": [
      "food-origin",
      "shape-count",
      "maze-gates",
      "count-the-beat",
      "lucky-cup"
    ],
    "enabledMiniGames": [
      "food-origin",
      "shape-count",
      "maze-gates",
      "count-the-beat",
      "lucky-cup",
      "guess-movie",
      "guess-star"
    ],
    "phaseDurationsMs": {
      "mini_game_intro": 0,
      "tour_starting": 3000,
      "answer_window_open": 20000,
      "scoring": 0,
      "tour_complete": 0,
      "cleanup": 0,
      "lobby_open": 0
    },
    "miniGamePhaseOverridesMs": {},
    "singleMiniGameRoundCounts": {
      "food-origin": 3,
      "shape-count": 3,
      "maze-gates": 3,
      "count-the-beat": 3,
      "lucky-cup": 3,
      "guess-movie": 4,
      "guess-star": 4
    }
  },
  "scoring": {
    "officialParticipationXp": 20,
    "officialParticipationCoins": 2,
    "officialCorrectRewardByDifficulty": {
      "easy": {
        "xp": 40,
        "coins": 6
      },
      "medium": {
        "xp": 60,
        "coins": 10
      },
      "hard": {
        "xp": 90,
        "coins": 16
      }
    }
  },
  "persistence": {
    "saveDebounceMs": 250,
    "maxTourHistoryEntries": 50
  },
  "qa": {
    "maxTestPlayers": 72
  }
} as const;
