/**
 * Consumer Twitch login configuration.
 *
 * IMPORTANT FOR RELEASE BUILDS:
 * Register ONE Twitch application for Ta7ady ElGeel and paste its public Client ID below.
 * End users / streamers never edit this file, never create a Twitch Developer app,
 * never paste OAuth tokens, and never create .env files.
 *
 * This Client ID is public by design in Twitch OAuth. Do NOT place a client secret in this app.
 */
export const TWITCH_APP_CONFIG = {
  appName: 'Ta7ady ElGeel',

  /**
   * Replace this once with the real public Client ID before distributing the game.
   * Keep it committed/embedded in the release build; it is not user-specific.
   */
  clientId: 'rpe7q3wq1ksg545jsv048gxl403pwv',

  /**
   * Start minimal. chat:read is enough for !join and game answers.
   * Add chat:edit later only if the game bot needs to write in chat.
   */
  scopes: ['chat:read'],
} as const;

export function getBundledTwitchClientId(): string | null {
  const value = TWITCH_APP_CONFIG.clientId.trim();

  if (!value || value.includes('REPLACE_WITH_')) {
    return null;
  }

  return value;
}
