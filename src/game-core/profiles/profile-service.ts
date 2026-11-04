import type { PlayerProfile } from './profile-types';

function isValidProfile(profile: PlayerProfile): boolean {
  return Boolean(
    profile &&
      typeof profile.twitchUserId === 'string' &&
      profile.twitchUserId.length > 0 &&
      typeof profile.displayName === 'string' &&
      typeof profile.level === 'number' &&
      typeof profile.xp === 'number' &&
      typeof profile.totalOfficialWins === 'number' &&
      typeof profile.createdAt === 'string' &&
      typeof profile.lastSeenAt === 'string',
  );
}

export class ProfileService {
  private readonly profiles = new Map<string, PlayerProfile>();

  // Legacy profiles.json may contain `coins`. Keep XP, levels and wins,
  // but never load or write a currency property again.
  private sanitizeProfile(profile: PlayerProfile): PlayerProfile {
    const { twitchUserId, displayName, level, xp, totalOfficialWins, createdAt, lastSeenAt } = profile;
    return { twitchUserId, displayName, level, xp, totalOfficialWins, createdAt, lastSeenAt };
  }

  loadProfiles(profiles: PlayerProfile[]): number {
    let loaded = 0;

    for (const profile of profiles) {
      if (!isValidProfile(profile)) {
        continue;
      }

      const existing = this.profiles.get(profile.twitchUserId);

      if (!existing) {
        this.profiles.set(profile.twitchUserId, this.sanitizeProfile(profile));
        loaded += 1;
        continue;
      }

      const merged: PlayerProfile = {
        ...this.sanitizeProfile(profile),
        ...this.sanitizeProfile(existing),
        xp: Math.max(profile.xp, existing.xp),
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
    return [...this.profiles.values()].map(profile => this.sanitizeProfile(profile)).sort((a, b) => a.displayName.localeCompare(b.displayName));
  }

  removeQaBotProfiles(): void {
    for (const id of this.profiles.keys()) {
      if (id.startsWith('__ta7ady_qa_bot__')) this.profiles.delete(id);
    }
  }

  getProfileCount(): number {
    return this.profiles.size;
  }

  getOrCreateProfile(twitchUserId: string, displayName: string): PlayerProfile {
    const existing = this.profiles.get(twitchUserId);
    const now = new Date().toISOString();

    if (existing) {
      const updated: PlayerProfile = {
        ...this.sanitizeProfile(existing),
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

  updateProgress(twitchUserId: string, params: { xp: number; level: number }): PlayerProfile | null {
    const profile = this.profiles.get(twitchUserId);

    if (!profile) {
      return null;
    }

    const updated: PlayerProfile = {
      ...profile,
      xp: params.xp,
      level: params.level,
      lastSeenAt: new Date().toISOString(),
    };

    this.profiles.set(twitchUserId, updated);
    return updated;
  }
}
