import { safeStorage, shell } from 'electron';
import fs from 'node:fs/promises';
import path from 'node:path';
import { TwitchIrcClient, type TwitchIrcStatus } from './TwitchIrcClient.js';
import { TWITCH_APP_CONFIG, getBundledTwitchClientId } from './twitch-app-config.js';

export type TwitchAuthState =
  | 'idle'
  | 'awaitingAuthorization'
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'disconnected'
  | 'error';

export type TwitchAuthStatus = Omit<TwitchIrcStatus, 'state'> & {
  state: TwitchAuthState;
  userCode: string | null;
  verificationUri: string | null;
  expiresAt: string | null;
  accountDisplayName: string | null;
  accountLogin: string | null;
  accountUserId: string | null;
  clientConfigured: boolean;
};

type DeviceCodeResponse = {
  device_code: string;
  expires_in: number;
  interval: number;
  user_code: string;
  verification_uri: string;
};

type DeviceTokenResponse = {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  scope: string[];
  token_type: string;
};

type TokenValidationResponse = {
  client_id: string;
  login: string;
  scopes: string[];
  user_id: string;
  expires_in: number;
};

type UsersResponse = {
  data: Array<{
    id: string;
    login: string;
    display_name: string;
  }>;
};

type StoredTwitchAuth = {
  accessToken: string;
  refreshToken: string | null;
  expiresAt: string;
  scopes: string[];
  accountLogin: string;
  accountDisplayName: string;
  accountUserId: string;
  savedAt: string;
};

type EncryptedStoredTwitchAuth = {
  version: 2;
  encrypted: true;
  encoding: 'base64';
  payload: string;
  savedAt: string;
  accountLoginHint: string;
};

type StoredTwitchAuthFile = StoredTwitchAuth | EncryptedStoredTwitchAuth;

type PendingDeviceSession = {
  deviceCode: string;
  userCode: string;
  verificationUri: string;
  expiresAtMs: number;
  intervalMs: number;
};

type TwitchAuthServiceOptions = {
  getStorageDirectory: () => string;
  ircClient: TwitchIrcClient;
  onStatus: (status: TwitchAuthStatus) => void;
};

const DEVICE_ENDPOINT = 'https://id.twitch.tv/oauth2/device';
const TOKEN_ENDPOINT = 'https://id.twitch.tv/oauth2/token';
const VALIDATE_ENDPOINT = 'https://id.twitch.tv/oauth2/validate';
const USERS_ENDPOINT = 'https://api.twitch.tv/helix/users';
const TOKEN_FILE = 'twitch-auth.json';
const REQUIRED_SCOPES = [...TWITCH_APP_CONFIG.scopes];
const MAX_TWITCH_TOKEN_LENGTH = 4096;
const MAX_TWITCH_DISPLAY_NAME_LENGTH = 60;
const TWITCH_LOGIN_PATTERN = /^[a-z0-9_]{3,25}$/i;
const TWITCH_USER_ID_PATTERN = /^\d{1,30}$/;

export class TwitchAuthService {
  private pendingSession: PendingDeviceSession | null = null;
  private pollTimer: ReturnType<typeof setTimeout> | null = null;
  private lastKnownAccount: Pick<StoredTwitchAuth, 'accountDisplayName' | 'accountLogin' | 'accountUserId'> | null = null;
  private status: TwitchAuthStatus;

  constructor(private readonly options: TwitchAuthServiceOptions) {
    this.status = this.composeStatus(options.ircClient.getStatus(), {
      state: 'idle',
      message: this.hasClientId()
        ? 'Ready. Press Login with Twitch.'
        : 'This build is not configured for Twitch login yet.',
      lastError: null,
    });
  }

  getStatus(): TwitchAuthStatus {
    return this.status;
  }

  async startConnect(): Promise<TwitchAuthStatus> {
    const clientId = this.getClientIdOrThrow();
    this.clearPollTimer();
    this.pendingSession = null;

    await this.options.ircClient.disconnect();

    const response = await this.requestDeviceCode(clientId);
    const expiresAtMs = Date.now() + response.expires_in * 1000;
    this.pendingSession = {
      deviceCode: response.device_code,
      userCode: response.user_code,
      verificationUri: this.sanitizeVerificationUri(response.verification_uri),
      expiresAtMs,
      intervalMs: Math.max(5, response.interval) * 1000,
    };

    this.setStatus(this.composeStatus(this.options.ircClient.getStatus(), {
      state: 'awaitingAuthorization',
      channelName: null,
      ircLogin: null,
      message: `Open Twitch and approve code ${response.user_code}.`,
      userCode: response.user_code,
      verificationUri: this.sanitizeVerificationUri(response.verification_uri),
      expiresAt: new Date(expiresAtMs).toISOString(),
      lastError: null,
    }));

    await shell.openExternal(this.sanitizeVerificationUri(response.verification_uri));
    this.schedulePoll();
    return this.status;
  }

  async reconnect(): Promise<TwitchAuthStatus> {
    const stored = await this.readStoredAuth();

    if (!stored) {
      this.setStatus(this.composeStatus(this.options.ircClient.getStatus(), {
        state: 'disconnected',
        message: 'No saved Twitch session. Press Login with Twitch first.',
        lastError: null,
      }));
      return this.status;
    }

    return this.connectWithStoredAuth(stored);
  }

  async disconnect(): Promise<TwitchAuthStatus> {
    this.clearPollTimer();
    this.pendingSession = null;
    await this.options.ircClient.disconnect();
    await this.deleteStoredAuth();
    this.lastKnownAccount = null;
    this.setStatus(this.composeStatus(this.options.ircClient.getStatus(), {
      state: 'disconnected',
      channelName: null,
      ircLogin: null,
      message: 'Twitch disconnected and saved session removed.',
      accountDisplayName: null,
      accountLogin: null,
      accountUserId: null,
      lastError: null,
    }));
    return this.status;
  }

  handleIrcStatus(status: TwitchIrcStatus): void {
    this.setStatus(this.composeStatus(status));
  }

  private async connectWithStoredAuth(stored: StoredTwitchAuth): Promise<TwitchAuthStatus> {
    this.lastKnownAccount = {
      accountDisplayName: stored.accountDisplayName,
      accountLogin: stored.accountLogin,
      accountUserId: stored.accountUserId,
    };

    this.setStatus(this.composeStatus(this.options.ircClient.getStatus(), {
      state: 'connecting',
      channelName: stored.accountLogin,
      ircLogin: stored.accountLogin,
      accountDisplayName: stored.accountDisplayName,
      accountLogin: stored.accountLogin,
      accountUserId: stored.accountUserId,
      message: `Connecting as ${stored.accountDisplayName}...`,
      lastError: null,
    }));

    let activeAuth = stored;

    try {
      await this.validateToken(stored.accessToken);
    } catch {
      if (!stored.refreshToken) {
        await this.invalidateSavedSession('Saved Twitch session expired. Please Login with Twitch again.');
        return this.status;
      }

      try {
        activeAuth = await this.refreshStoredToken(stored);
        await this.writeStoredAuth(activeAuth);
      } catch {
        await this.invalidateSavedSession('Saved Twitch session could not be refreshed. Please Login with Twitch again.');
        return this.status;
      }
    }

    this.options.ircClient.connect({
      channelName: activeAuth.accountLogin,
      ircLogin: activeAuth.accountLogin,
      oauthToken: activeAuth.accessToken,
    });

    return this.status;
  }

  private schedulePoll(): void {
    this.clearPollTimer();

    if (!this.pendingSession) {
      return;
    }

    this.pollTimer = setTimeout(() => {
      void this.pollForToken().catch((error: unknown) => {
        this.setStatus(this.composeStatus(this.options.ircClient.getStatus(), {
          state: 'error',
          message: getErrorMessage(error),
          lastError: getErrorMessage(error),
        }));
      });
    }, this.pendingSession.intervalMs);
  }

  private async pollForToken(): Promise<void> {
    const session = this.pendingSession;
    const clientId = this.getClientIdOrThrow();

    if (!session) {
      return;
    }

    if (Date.now() >= session.expiresAtMs) {
      this.pendingSession = null;
      this.setStatus(this.composeStatus(this.options.ircClient.getStatus(), {
        state: 'error',
        message: 'Twitch connect code expired. Press Login with Twitch again.',
        lastError: 'Twitch connect code expired.',
      }));
      return;
    }

    const form = new URLSearchParams({
      client_id: clientId,
      scopes: REQUIRED_SCOPES.join(' '),
      device_code: session.deviceCode,
      grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
    });

    const response = await fetch(TOKEN_ENDPOINT, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: form,
    });

    if (!response.ok) {
      const body = await readJsonBody<{ message?: string; error?: string }>(response);
      const message = body.message ?? body.error ?? `Twitch token polling failed (${response.status}).`;

      if (/authorization_pending/i.test(message)) {
        this.schedulePoll();
        return;
      }

      if (/slow_down/i.test(message)) {
        this.pendingSession = { ...session, intervalMs: session.intervalMs + 5_000 };
        this.schedulePoll();
        return;
      }

      throw new Error(message);
    }

    const token = (await response.json()) as DeviceTokenResponse;
    this.pendingSession = null;
    this.clearPollTimer();

    const stored = await this.createStoredAuth(token);
    await this.writeStoredAuth(stored);
    await this.connectWithStoredAuth(stored);
  }

  private async requestDeviceCode(clientId: string): Promise<DeviceCodeResponse> {
    const form = new URLSearchParams({
      client_id: clientId,
      scopes: REQUIRED_SCOPES.join(' '),
    });

    const response = await fetch(DEVICE_ENDPOINT, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: form,
    });

    if (!response.ok) {
      const body = await readJsonBody<{ message?: string; error?: string }>(response);
      throw new Error(body.message ?? body.error ?? `Twitch device auth failed (${response.status}).`);
    }

    return (await response.json()) as DeviceCodeResponse;
  }

  private async createStoredAuth(token: DeviceTokenResponse): Promise<StoredTwitchAuth> {
    const validation = await this.validateToken(token.access_token);
    const displayName = await this.fetchDisplayName(token.access_token, validation.user_id, validation.login);

    return {
      accessToken: token.access_token,
      refreshToken: token.refresh_token ?? null,
      expiresAt: new Date(Date.now() + token.expires_in * 1000).toISOString(),
      scopes: token.scope,
      accountLogin: validation.login,
      accountDisplayName: displayName,
      accountUserId: validation.user_id,
      savedAt: new Date().toISOString(),
    };
  }


  private async invalidateSavedSession(message: string): Promise<void> {
    this.clearPollTimer();
    this.pendingSession = null;
    await this.options.ircClient.disconnect();
    await this.deleteStoredAuth();
    this.lastKnownAccount = null;
    this.setStatus(this.composeStatus(this.options.ircClient.getStatus(), {
      state: 'disconnected',
      channelName: null,
      ircLogin: null,
      accountDisplayName: null,
      accountLogin: null,
      accountUserId: null,
      userCode: null,
      verificationUri: null,
      expiresAt: null,
      message,
      lastError: null,
    }));
  }

  private async refreshStoredToken(stored: StoredTwitchAuth): Promise<StoredTwitchAuth> {
    const clientId = this.getClientIdOrThrow();

    if (!stored.refreshToken) {
      throw new Error('No refresh token saved. Press Login with Twitch again.');
    }

    const form = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: stored.refreshToken,
      client_id: clientId,
    });

    const response = await fetch(TOKEN_ENDPOINT, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: form,
    });

    if (!response.ok) {
      const body = await readJsonBody<{ message?: string; error?: string }>(response);
      throw new Error(body.message ?? body.error ?? `Twitch token refresh failed (${response.status}).`);
    }

    const token = (await response.json()) as DeviceTokenResponse;
    return this.createStoredAuth(token);
  }

  private async validateToken(accessToken: string): Promise<TokenValidationResponse> {
    const response = await fetch(VALIDATE_ENDPOINT, {
      headers: {
        Accept: 'application/json',
        Authorization: `OAuth ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Twitch token validation failed (${response.status}).`);
    }

    const validation = (await response.json()) as TokenValidationResponse;
    const missingScope = REQUIRED_SCOPES.find((scope) => !validation.scopes.includes(scope));

    if (missingScope) {
      throw new Error(`Twitch token is missing required scope: ${missingScope}.`);
    }

    return validation;
  }

  private async fetchDisplayName(accessToken: string, userId: string, login: string): Promise<string> {
    const clientId = this.getClientIdOrThrow();
    const response = await fetch(`${USERS_ENDPOINT}?id=${encodeURIComponent(userId)}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'Client-Id': clientId,
      },
    });

    if (!response.ok) {
      return login;
    }

    const users = (await response.json()) as UsersResponse;
    return users.data[0]?.display_name ?? login;
  }

  private async readStoredAuth(): Promise<StoredTwitchAuth | null> {
    const filePath = this.getTokenPath();

    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const parsed = JSON.parse(content) as StoredTwitchAuthFile;

      if (isEncryptedStoredAuth(parsed)) {
        if (!safeStorage.isEncryptionAvailable()) {
          throw new Error('Twitch session is encrypted, but OS secure storage is unavailable. Please Login with Twitch again.');
        }

        const decryptedJson = safeStorage.decryptString(Buffer.from(parsed.payload, parsed.encoding));
        return sanitizeStoredAuth(JSON.parse(decryptedJson) as Partial<StoredTwitchAuth>);
      }

      const legacyAuth = sanitizeStoredAuth(parsed as Partial<StoredTwitchAuth>);
      await this.writeStoredAuth(legacyAuth);
      return legacyAuth;
    } catch (error) {
      const nodeError = error as NodeJS.ErrnoException;

      if (nodeError.code === 'ENOENT') {
        return null;
      }

      if (error instanceof SyntaxError) {
        await this.deleteStoredAuth();
        return null;
      }

      throw error;
    }
  }

  private async writeStoredAuth(auth: StoredTwitchAuth): Promise<void> {
    await fs.mkdir(this.options.getStorageDirectory(), { recursive: true, mode: 0o700 });
    const filePath = this.getTokenPath();
    const tempPath = `${filePath}.tmp`;

    if (!safeStorage.isEncryptionAvailable()) {
      throw new Error('OS secure storage is unavailable. Twitch tokens were not saved.');
    }

    const payload = safeStorage.encryptString(JSON.stringify(sanitizeStoredAuth(auth)));
    const fileContent: EncryptedStoredTwitchAuth = {
      version: 2,
      encrypted: true,
      encoding: 'base64',
      payload: payload.toString('base64'),
      savedAt: new Date().toISOString(),
      accountLoginHint: auth.accountLogin,
    };

    await fs.writeFile(tempPath, JSON.stringify(fileContent, null, 2), { encoding: 'utf-8', mode: 0o600 });
    await fs.rename(tempPath, filePath);
  }

  private async deleteStoredAuth(): Promise<void> {
    try {
      await fs.rm(this.getTokenPath(), { force: true });
    } catch {
      // Ignore best-effort token cleanup errors.
    }
  }

  private getTokenPath(): string {
    return path.join(this.options.getStorageDirectory(), TOKEN_FILE);
  }

  private sanitizeVerificationUri(rawUri: string): string {
    const uri = new URL(rawUri);
    const allowedHosts = new Set(['twitch.tv', 'www.twitch.tv', 'id.twitch.tv']);

    if (uri.protocol !== 'https:' || !allowedHosts.has(uri.hostname)) {
      throw new Error('Twitch returned an unexpected verification URL. Login was blocked for safety.');
    }

    return uri.toString();
  }

  private clearPollTimer(): void {
    if (this.pollTimer) {
      clearTimeout(this.pollTimer);
      this.pollTimer = null;
    }
  }

  private setStatus(status: TwitchAuthStatus): void {
    this.status = status;
    this.options.onStatus(this.status);
  }

  private composeStatus(baseStatus: TwitchIrcStatus, overrides: Partial<TwitchAuthStatus> = {}): TwitchAuthStatus {
    const state = overrides.state ?? this.mapIrcState(baseStatus.state);
    const account = this.lastKnownAccount;

    return {
      ...baseStatus,
      state,
      userCode: null,
      verificationUri: null,
      expiresAt: null,
      accountDisplayName: account?.accountDisplayName ?? null,
      accountLogin: account?.accountLogin ?? null,
      accountUserId: account?.accountUserId ?? null,
      clientConfigured: this.hasClientId(),
      ...overrides,
    };
  }

  private mapIrcState(state: TwitchIrcStatus['state']): TwitchAuthState {
    return state;
  }

  private hasClientId(): boolean {
    return Boolean(this.getClientId());
  }

  private getClientIdOrThrow(): string {
    const clientId = this.getClientId();

    if (!clientId) {
      throw new Error('This build does not include the Ta7ady ElGeel Twitch Client ID yet. Add the game\'s public Client ID in twitch-app-config.ts before distributing the build.');
    }

    return clientId;
  }

  private getClientId(): string | null {
    return getBundledTwitchClientId();
  }

}

function isEncryptedStoredAuth(value: StoredTwitchAuthFile): value is EncryptedStoredTwitchAuth {
  return Boolean(
    value
    && typeof value === 'object'
    && 'encrypted' in value
    && value.encrypted === true
    && 'payload' in value
    && typeof value.payload === 'string'
    && value.encoding === 'base64',
  );
}

function sanitizeStoredAuth(value: Partial<StoredTwitchAuth>): StoredTwitchAuth {
  const accessToken = requireNonEmptyString(value.accessToken, 'accessToken', MAX_TWITCH_TOKEN_LENGTH);
  const refreshToken = value.refreshToken === null || value.refreshToken === undefined
    ? null
    : requireNonEmptyString(value.refreshToken, 'refreshToken', MAX_TWITCH_TOKEN_LENGTH);
  const accountLogin = requirePattern(value.accountLogin, 'accountLogin', TWITCH_LOGIN_PATTERN);
  const accountDisplayName = requireNonEmptyString(value.accountDisplayName, 'accountDisplayName', MAX_TWITCH_DISPLAY_NAME_LENGTH);
  const accountUserId = requirePattern(value.accountUserId, 'accountUserId', TWITCH_USER_ID_PATTERN);
  const expiresAt = requireIsoDate(value.expiresAt, 'expiresAt');
  const savedAt = requireIsoDate(value.savedAt, 'savedAt');
  const scopes = Array.isArray(value.scopes)
    ? value.scopes.map((scope) => requireNonEmptyString(scope, 'scope', 120))
    : [];

  const missingScope = REQUIRED_SCOPES.find((scope) => !scopes.includes(scope));
  if (missingScope) {
    throw new Error(`Saved Twitch session is missing required scope: ${missingScope}.`);
  }

  return {
    accessToken,
    refreshToken,
    expiresAt,
    scopes,
    accountLogin,
    accountDisplayName,
    accountUserId,
    savedAt,
  };
}

function requireNonEmptyString(value: unknown, fieldName: string, maxLength: number): string {
  if (typeof value !== 'string') {
    throw new Error(`Invalid saved Twitch session: ${fieldName} is not a string.`);
  }

  const trimmed = value.trim();
  if (!trimmed || trimmed.length > maxLength) {
    throw new Error(`Invalid saved Twitch session: ${fieldName} has an invalid length.`);
  }

  return trimmed;
}

function requirePattern(value: unknown, fieldName: string, pattern: RegExp): string {
  const stringValue = requireNonEmptyString(value, fieldName, MAX_TWITCH_DISPLAY_NAME_LENGTH);
  if (!pattern.test(stringValue)) {
    throw new Error(`Invalid saved Twitch session: ${fieldName} has an invalid format.`);
  }

  return stringValue;
}

function requireIsoDate(value: unknown, fieldName: string): string {
  const stringValue = requireNonEmptyString(value, fieldName, 80);
  const timestamp = Date.parse(stringValue);

  if (!Number.isFinite(timestamp)) {
    throw new Error(`Invalid saved Twitch session: ${fieldName} is not a valid date.`);
  }

  return new Date(timestamp).toISOString();
}

async function readJsonBody<T>(response: Response): Promise<T> {
  try {
    return (await response.json()) as T;
  } catch {
    return {} as T;
  }
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}
