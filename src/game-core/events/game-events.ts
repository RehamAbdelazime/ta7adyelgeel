import type { CitizenRuntime } from '../citizens/citizen-types';
import type { LocaleCode } from '../localization/locale-types';
import type { MiniGameAnswer } from '../minigames/minigame-types';
import type { TourPhase, TourSnapshot } from '../tours/tour-types';
import type { CommandFeedback, TwitchChatMessage } from '../twitch/twitch-message-types';

export type GameEvent =
  | { type: 'citizen.joined'; citizen: CitizenRuntime }
  | { type: 'tour.started'; officialCount: number; tour: TourSnapshot }
  | { type: 'tour.ended'; tour: TourSnapshot }
  | { type: 'tour.completed'; tour: TourSnapshot }
  | { type: 'tour.phase.changed'; phase: TourPhase; tour: TourSnapshot }
  | { type: 'twitch.chat.message'; message: TwitchChatMessage }
  | { type: 'command.accepted'; feedback: CommandFeedback }
  | { type: 'command.rejected'; feedback: CommandFeedback }
  | { type: 'minigame.answer.accepted'; twitchUserId: string; answer: MiniGameAnswer }
  | { type: 'language.changed'; locale: LocaleCode }
  | { type: 'feed.added'; message: string }
  | { type: 'state.changed' };

export type GameEventListener = (event: GameEvent) => void;
