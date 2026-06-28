import type { CitizenRuntime } from '../citizens/citizen-types';
import type { LocaleCode, TextDirection } from '../localization/locale-types';
import type { TourSnapshot } from '../tours/tour-types';
import type { MiniGameId, MiniGameScoreAward, MiniGameSnapshot } from '../minigames/minigame-types';
import type { ChaosEventSnapshot } from '../chaos/chaos-types';
import type { CommandFeedback } from '../twitch/twitch-message-types';
import type { ProgressionSnapshot } from '../progression/progression-types';
import type { PersistenceSnapshot } from '../persistence/persistence-types';
import type { TourAwardsSnapshot, TourScoreboardRow } from '../awards/tour-awards';


export type HostChaosMode = 'off' | 'normal' | 'high' | 'madness';
export type ActiveSessionMode = 'tour' | 'mini-game' | null;

export type HostProductionSettingsSnapshot = {
  tourRoundCount: number;
  enabledMiniGameIds: MiniGameId[];
  forcedNextMiniGameId: MiniGameId | null;
  chaosMode: HostChaosMode;
};

export type FeedEntry = {
  id: string;
  message: string;
  createdAt: number;
};

export type ChampionCelebrationSnapshot = {
  twitchUserId: string | null;
  startedAt: number | null;
};

export type GameSnapshot = {
  locale: LocaleCode;
  direction: TextDirection;
  tourActive: boolean;
  activeSessionMode: ActiveSessionMode;
  chaosPercent: number;
  chaosEvent: ChaosEventSnapshot;
  citizens: CitizenRuntime[];
  feed: FeedEntry[];
  tour: TourSnapshot;
  commandFeedback: CommandFeedback | null;
  miniGame: MiniGameSnapshot;
  nextMiniGameId: MiniGameId | null;
  lastRoundAwards: MiniGameScoreAward[];
  progression: ProgressionSnapshot;
  persistence: PersistenceSnapshot;
  tourAwards: TourAwardsSnapshot;
  tourScoreboardRows: TourScoreboardRow[];
  hostSettings: HostProductionSettingsSnapshot;
  championCelebration: ChampionCelebrationSnapshot;
};
