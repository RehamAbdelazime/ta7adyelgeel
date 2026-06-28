export type TwitchChatMessage = {
  twitchUserId: string;
  displayName: string;
  message: string;
  isBroadcaster: boolean;
  isMod: boolean;
  badges: string[];
  timestamp: number;
};

export type TwitchCommandKind =
  | 'join'
  | 'help'
  | 'profile'
  | 'true'
  | 'fake'
  | 'vote'
  | 'answer'
  | 'shape'
  | 'wave'
  | 'dance'
  | 'emote'
  | 'cheer'
  | 'challenge'
  | 'spotlight'
  | 'unknown';

export type ParsedTwitchCommand = {
  kind: TwitchCommandKind;
  rawCommand: string;
  args: string[];
  normalizedMessage: string;
};

export type CommandFeedback = {
  id: string;
  ok: boolean;
  displayName: string;
  command: string;
  message: string;
  createdAt: number;
};
