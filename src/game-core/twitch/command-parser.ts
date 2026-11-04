import type { ParsedTwitchCommand } from './twitch-message-types';

const COMMAND_ALIASES: Record<string, ParsedTwitchCommand['kind']> = {
  '!join': 'join',
  '!انضم': 'join',
  '!دخول': 'join',
  '!help': 'help',
  '!commands': 'help',
  '!اوامر': 'help',
  '!أوامر': 'help',
  '!profile': 'profile',
  '!me': 'profile',
  '!ملفي': 'profile',
  '!1': 'answer',
  '!2': 'answer',
  '!3': 'answer',
  '!4': 'answer',
  '!wave': 'wave',
  '!hi': 'wave',
  '!سلام': 'wave',
  '!dance': 'dance',
  '!رقص': 'dance',
  '!emote': 'emote',
  '!emoji': 'emote',
  '!ايموت': 'emote',
  '!cheer': 'cheer',
  '!تشجيع': 'cheer',
  '!challenge': 'challenge',
  '!تحدي': 'challenge',
  '!spotlight': 'spotlight',
  '!نجومية': 'spotlight',
};

export class CommandParser {
  parse(message: string): ParsedTwitchCommand {
    const normalizedMessage = message.trim().replace(/\s+/g, ' ');

    if (!normalizedMessage.startsWith('!')) {
      return {
        kind: 'unknown',
        rawCommand: '',
        args: [],
        normalizedMessage,
      };
    }

    const [rawCommand = '', ...args] = normalizedMessage.split(' ');
    const command = rawCommand.toLowerCase();
    const kind = COMMAND_ALIASES[command] ?? 'unknown';

    return {
      kind,
      rawCommand,
      args,
      normalizedMessage,
    };
  }
}

