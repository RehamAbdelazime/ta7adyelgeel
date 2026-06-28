import { safeStorage, shell } from 'electron';
import fs from 'node:fs/promises';
import path from 'node:path';
import { TWITCH_APP_CONFIG, getBundledTwitchClientId } from './twitch-app-config.js';
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
    options;
    pendingSession = null;
    pollTimer = null;
    lastKnownAccount = null;
    status;
    constructor(options) {
        this.options = options;
        this.status = this.composeStatus(options.ircClient.getStatus(), {
            state: 'idle',
            message: this.hasClientId()
                ? 'Ready. Press Login with Twitch.'
                : 'This build is not configured for Twitch login yet.',
            lastError: null,
        });
    }
    getStatus() {
        return this.status;
    }
    async startConnect() {
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
    async reconnect() {
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
    async disconnect() {
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
    handleIrcStatus(status) {
        this.setStatus(this.composeStatus(status));
    }
    async connectWithStoredAuth(stored) {
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
        }
        catch {
            if (!stored.refreshToken) {
                await this.invalidateSavedSession('Saved Twitch session expired. Please Login with Twitch again.');
                return this.status;
            }
            try {
                activeAuth = await this.refreshStoredToken(stored);
                await this.writeStoredAuth(activeAuth);
            }
            catch {
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
    schedulePoll() {
        this.clearPollTimer();
        if (!this.pendingSession) {
            return;
        }
        this.pollTimer = setTimeout(() => {
            void this.pollForToken().catch((error) => {
                this.setStatus(this.composeStatus(this.options.ircClient.getStatus(), {
                    state: 'error',
                    message: getErrorMessage(error),
                    lastError: getErrorMessage(error),
                }));
            });
        }, this.pendingSession.intervalMs);
    }
    async pollForToken() {
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
            const body = await readJsonBody(response);
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
        const token = (await response.json());
        this.pendingSession = null;
        this.clearPollTimer();
        const stored = await this.createStoredAuth(token);
        await this.writeStoredAuth(stored);
        await this.connectWithStoredAuth(stored);
    }
    async requestDeviceCode(clientId) {
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
            const body = await readJsonBody(response);
            throw new Error(body.message ?? body.error ?? `Twitch device auth failed (${response.status}).`);
        }
        return (await response.json());
    }
    async createStoredAuth(token) {
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
    async invalidateSavedSession(message) {
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
    async refreshStoredToken(stored) {
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
            const body = await readJsonBody(response);
            throw new Error(body.message ?? body.error ?? `Twitch token refresh failed (${response.status}).`);
        }
        const token = (await response.json());
        return this.createStoredAuth(token);
    }
    async validateToken(accessToken) {
        const response = await fetch(VALIDATE_ENDPOINT, {
            headers: {
                Accept: 'application/json',
                Authorization: `OAuth ${accessToken}`,
            },
        });
        if (!response.ok) {
            throw new Error(`Twitch token validation failed (${response.status}).`);
        }
        const validation = (await response.json());
        const missingScope = REQUIRED_SCOPES.find((scope) => !validation.scopes.includes(scope));
        if (missingScope) {
            throw new Error(`Twitch token is missing required scope: ${missingScope}.`);
        }
        return validation;
    }
    async fetchDisplayName(accessToken, userId, login) {
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
        const users = (await response.json());
        return users.data[0]?.display_name ?? login;
    }
    async readStoredAuth() {
        const filePath = this.getTokenPath();
        try {
            const content = await fs.readFile(filePath, 'utf-8');
            const parsed = JSON.parse(content);
            if (isEncryptedStoredAuth(parsed)) {
                if (!safeStorage.isEncryptionAvailable()) {
                    throw new Error('Twitch session is encrypted, but OS secure storage is unavailable. Please Login with Twitch again.');
                }
                const decryptedJson = safeStorage.decryptString(Buffer.from(parsed.payload, parsed.encoding));
                return sanitizeStoredAuth(JSON.parse(decryptedJson));
            }
            const legacyAuth = sanitizeStoredAuth(parsed);
            await this.writeStoredAuth(legacyAuth);
            return legacyAuth;
        }
        catch (error) {
            const nodeError = error;
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
    async writeStoredAuth(auth) {
        await fs.mkdir(this.options.getStorageDirectory(), { recursive: true, mode: 0o700 });
        const filePath = this.getTokenPath();
        const tempPath = `${filePath}.tmp`;
        if (!safeStorage.isEncryptionAvailable()) {
            throw new Error('OS secure storage is unavailable. Twitch tokens were not saved.');
        }
        const payload = safeStorage.encryptString(JSON.stringify(sanitizeStoredAuth(auth)));
        const fileContent = {
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
    async deleteStoredAuth() {
        try {
            await fs.rm(this.getTokenPath(), { force: true });
        }
        catch {
            // Ignore best-effort token cleanup errors.
        }
    }
    getTokenPath() {
        return path.join(this.options.getStorageDirectory(), TOKEN_FILE);
    }
    sanitizeVerificationUri(rawUri) {
        const uri = new URL(rawUri);
        const allowedHosts = new Set(['twitch.tv', 'www.twitch.tv', 'id.twitch.tv']);
        if (uri.protocol !== 'https:' || !allowedHosts.has(uri.hostname)) {
            throw new Error('Twitch returned an unexpected verification URL. Login was blocked for safety.');
        }
        return uri.toString();
    }
    clearPollTimer() {
        if (this.pollTimer) {
            clearTimeout(this.pollTimer);
            this.pollTimer = null;
        }
    }
    setStatus(status) {
        this.status = status;
        this.options.onStatus(this.status);
    }
    composeStatus(baseStatus, overrides = {}) {
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
    mapIrcState(state) {
        return state;
    }
    hasClientId() {
        return Boolean(this.getClientId());
    }
    getClientIdOrThrow() {
        const clientId = this.getClientId();
        if (!clientId) {
            throw new Error('This build does not include the Ta7ady ElGeel Twitch Client ID yet. Add the game\'s public Client ID in twitch-app-config.ts before distributing the build.');
        }
        return clientId;
    }
    getClientId() {
        return getBundledTwitchClientId();
    }
}
function isEncryptedStoredAuth(value) {
    return Boolean(value
        && typeof value === 'object'
        && 'encrypted' in value
        && value.encrypted === true
        && 'payload' in value
        && typeof value.payload === 'string'
        && value.encoding === 'base64');
}
function sanitizeStoredAuth(value) {
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
function requireNonEmptyString(value, fieldName, maxLength) {
    if (typeof value !== 'string') {
        throw new Error(`Invalid saved Twitch session: ${fieldName} is not a string.`);
    }
    const trimmed = value.trim();
    if (!trimmed || trimmed.length > maxLength) {
        throw new Error(`Invalid saved Twitch session: ${fieldName} has an invalid length.`);
    }
    return trimmed;
}
function requirePattern(value, fieldName, pattern) {
    const stringValue = requireNonEmptyString(value, fieldName, MAX_TWITCH_DISPLAY_NAME_LENGTH);
    if (!pattern.test(stringValue)) {
        throw new Error(`Invalid saved Twitch session: ${fieldName} has an invalid format.`);
    }
    return stringValue;
}
function requireIsoDate(value, fieldName) {
    const stringValue = requireNonEmptyString(value, fieldName, 80);
    const timestamp = Date.parse(stringValue);
    if (!Number.isFinite(timestamp)) {
        throw new Error(`Invalid saved Twitch session: ${fieldName} is not a valid date.`);
    }
    return new Date(timestamp).toISOString();
}
async function readJsonBody(response) {
    try {
        return (await response.json());
    }
    catch {
        return {};
    }
}
function getErrorMessage(error) {
    if (error instanceof Error) {
        return error.message;
    }
    return String(error);
}
//# sourceMappingURL=TwitchAuthService.js.map