export class CommandCooldownService {
  private readonly timestamps = new Map<string, number>();

  constructor(private readonly cooldownMs = 1_200) {}

  canRun(twitchUserId: string, commandKey: string, now = Date.now()): boolean {
    const key = this.getKey(twitchUserId, commandKey);
    const lastRunAt = this.timestamps.get(key) ?? 0;

    if (now - lastRunAt < this.cooldownMs) {
      return false;
    }

    this.timestamps.set(key, now);
    return true;
  }

  clear(): void {
    this.timestamps.clear();
  }

  private getKey(twitchUserId: string, commandKey: string): string {
    return `${twitchUserId}:${commandKey.toLowerCase()}`;
  }
}
