import { CommandCooldownService } from './command-cooldown-service';
import { CommandParser } from './command-parser';
import type { ParsedTwitchCommand, TwitchChatMessage } from './twitch-message-types';

type RouterResult = {
  ok: boolean;
  command: ParsedTwitchCommand;
  message: string;
};

type TwitchCommandRouterHandlers = {
  join: (message: TwitchChatMessage) => RouterResult;
  help: (message: TwitchChatMessage) => RouterResult;
  profile: (message: TwitchChatMessage) => RouterResult;
  answerPreview: (message: TwitchChatMessage, command: ParsedTwitchCommand) => RouterResult;
  unlockedCommand: (message: TwitchChatMessage, command: ParsedTwitchCommand) => RouterResult;
  unknown: (message: TwitchChatMessage, command: ParsedTwitchCommand) => RouterResult;
  cooldown: (message: TwitchChatMessage, command: ParsedTwitchCommand) => RouterResult;
};

export class TwitchCommandRouter {
  private readonly parser = new CommandParser();
  private readonly cooldowns = new CommandCooldownService();

  constructor(private readonly handlers: TwitchCommandRouterHandlers) {}

  handle(message: TwitchChatMessage): RouterResult {
    const command = this.parser.parse(message.message);

    if (command.kind === 'unknown') {
      return this.handlers.unknown(message, command);
    }

    if (!this.cooldowns.canRun(message.twitchUserId, command.kind)) {
      return this.handlers.cooldown(message, command);
    }

    switch (command.kind) {
      case 'join':
        return this.handlers.join(message);
      case 'help':
        return this.handlers.help(message);
      case 'profile':
        return this.handlers.profile(message);
      case 'answer':
        return this.handlers.answerPreview(message, command);
      case 'wave':
      case 'dance':
      case 'emote':
      case 'cheer':
      case 'challenge':
      case 'spotlight':
        return this.handlers.unlockedCommand(message, command);
      default:
        return this.handlers.unknown(message, command);
    }
  }
}
