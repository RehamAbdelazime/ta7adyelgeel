import type { PlayerProfile } from './profile-types';

function isValidProfile(profile: PlayerProfile): boolean {
  return Boolean(
    profile &&
      typeof profile.twitchUserId === 'string' &&
      profile.twitchUserId.length > 0 &&
      typeof profile.displayName === 'string' &&
      typeof profile.level === 'number' &&
      typeof profile.xp === 'number' &&
      typeof profile.coins === 'number' &&
      typeof profile.totalOfficialWins === 'number' &&
      typeof profile.createdAt === 'string' &&
      typeof profile.lastSeenAt === 'string',
  );
}

export class ProfileService {
  private readonly profiles = new Map<string, PlayerProfile>();

  loadProfiles(profiles: PlayerProfile[]): number {
    let loaded = 0;

    for (const profile of profiles) {
      if (!isValidProfile(profile)) {
        continue;
      }

      const existing = this.profiles.get(profile.twitchUserId);

      if (!existing) {
        this.profiles.set(profile.twitchUserId, profile);
        loaded += 1;
        continue;
      }

      const merged: PlayerProfile = {
        ...profile,
        ...existing,
        xp: Math.max(profile.xp, existing.xp),
        coins: Math.max(profile.coins, existing.coins),
        level: Math.max(profile.level, existing.level),
        totalOfficialWins: Math.max(profile.totalOfficialWins, existing.totalOfficialWins),
        createdAt: profile.createdAt < existing.createdAt ? profile.createdAt : existing.createdAt,
        lastSeenAt: profile.lastSeenAt > existing.lastSeenAt ? profile.lastSeenAt : existing.lastSeenAt,
      };

      this.profiles.set(profile.twitchUserId, merged);
      loaded += 1;
    }

    return loaded;
  }

  exportProfiles(): PlayerProfile[] {
    return [...this.profiles.values()].sort((a, b) => a.displayName.localeCompare(b.displayName));
  }

  getProfileCount(): number {
    return this.profiles.size;
  }

  getOrCreateProfile(twitchUserId: string, displayName: string): PlayerProfile {
    const existing = this.profiles.get(twitchUserId);
    const now = new Date().toISOString();

    if (existing) {
      const updated: PlayerProfile = {
        ...existing,
        displayName,
        lastSeenAt: now,
      };
      this.profiles.set(twitchUserId, updated);
      return updated;
    }

    const profile: PlayerProfile = {
      twitchUserId,
      displayName,
      level: 1,
      xp: 0,
      coins: 0,
      totalOfficialWins: 0,
      createdAt: now,
      lastSeenAt: now,
    };

    this.profiles.set(twitchUserId, profile);
    return profile;
  }

  getProfile(twitchUserId: string): PlayerProfile | null {
    return this.profiles.get(twitchUserId) ?? null;
  }

  updateProgress(twitchUserId: string, params: { xp: number; coins: number; level: number }): PlayerProfile | null {
    const profile = this.profiles.get(twitchUserId);

    if (!profile) {
      return null;
    }

    const updated: PlayerProfile = {
      ...profile,
      xp: params.xp,
      coins: params.coins,
      level: params.level,
      lastSeenAt: new Date().toISOString(),
    };

    this.profiles.set(twitchUserId, updated);
    return updated;
  }
}
