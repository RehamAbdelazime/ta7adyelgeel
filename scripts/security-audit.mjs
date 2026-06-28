#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const skipDirs = new Set(['node_modules', '.git', 'release', 'dist', 'dist-electron']);
const textExtensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.json', '.html', '.css', '.svg']);
const findings = [];

function fail(id, message, file = null) {
  findings.push({ severity: 'fail', id, message, file });
}

function pass(id, message) {
  findings.push({ severity: 'pass', id, message });
}

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (skipDirs.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await walk(full));
    else out.push(full);
  }
  return out;
}

function rel(file) {
  return path.relative(root, file).replaceAll('\\\\', '/');
}

function read(file) {
  return readFileSync(file, 'utf8');
}

function assertContains(file, id, pattern, message) {
  const content = read(path.join(root, file));
  if (pattern.test(content)) pass(id, message);
  else fail(id, message, file);
}

const files = await walk(root);
const textFiles = files.filter((file) => textExtensions.has(path.extname(file).toLowerCase()));

assertContains('src/desktop-electron/main.ts', 'electron-context-isolation', /contextIsolation:\s*true/, 'Electron renderer context isolation is enabled.');
assertContains('src/desktop-electron/main.ts', 'electron-node-disabled', /nodeIntegration:\s*false/, 'Electron nodeIntegration is disabled.');
assertContains('src/desktop-electron/main.ts', 'electron-sandbox', /sandbox:\s*true/, 'Electron renderer sandbox is enabled.');
assertContains('src/desktop-electron/main.ts', 'electron-websecurity', /webSecurity:\s*true/, 'Electron webSecurity is enabled.');
assertContains('src/desktop-electron/main.ts', 'electron-window-open-deny', /setWindowOpenHandler\(\(\)\s*=>\s*\(\{\s*action:\s*'deny'\s*\}\)\)/, 'Renderer-created windows are blocked.');
assertContains('src/desktop-electron/main.ts', 'electron-navigation-guard', /will-navigate/, 'Unexpected renderer navigation is blocked.');
assertContains('src/desktop-electron/main.ts', 'electron-permissions-deny', /setPermissionRequestHandler[\s\S]*callback\(false\)/, 'Runtime permission requests are denied by default.');
assertContains('src/desktop-electron/main.ts', 'ipc-sender-validation', /assertTrustedIpcSender/, 'IPC requests validate the renderer sender.');
assertContains('src/desktop-electron/main.ts', 'storage-allowlist', /SAFE_STORAGE_FILES/, 'Persistent JSON storage uses an allowlist.');
assertContains('src/desktop-electron/twitch/TwitchAuthService.ts', 'twitch-safe-storage', /safeStorage\.encryptString/, 'Twitch OAuth tokens are encrypted before being written to disk.');
assertContains('src/desktop-electron/twitch/TwitchAuthService.ts', 'twitch-token-validation', /oauth2\/validate|VALIDATE_ENDPOINT/, 'Twitch tokens are validated before use.');
assertContains('src/desktop-electron/twitch/twitch-app-config.ts', 'twitch-no-client-secret', /Do NOT place a client secret|client secret/i, 'Twitch config documents that no client secret belongs in the desktop app.');
assertContains('src/desktop-electron/twitch/TwitchIrcClient.ts', 'twitch-irc-tls', /tls\.connect/, 'Twitch IRC uses TLS.');
assertContains('src/desktop-electron/twitch/TwitchIrcClient.ts', 'chat-message-limit', /MAX_CHAT_MESSAGE_CHARS/, 'Incoming Twitch chat messages are bounded before renderer delivery.');
assertContains('index.html', 'csp-present', /Content-Security-Policy/, 'Renderer has a Content Security Policy.');

const dangerousPatterns = [
  ['dangerous-inner-html', /dangerouslySetInnerHTML\s*=/],
  ['direct-inner-html', /\.innerHTML\s*=/],
  ['eval', /\beval\s*\(/],
  ['new-function', /new\s+Function\s*\(/],
  ['remote-module', /@electron\/remote|remote\s+from\s+['\"]electron/],
  ['renderer-node-import', /from\s+['\"](?:node:)?(?:fs|child_process|net|tls|http|https|path)['\"]/],
  ['client-secret', /client_secret\s*[:=]/i],
];

for (const [id, pattern] of dangerousPatterns) {
  const matches = [];
  for (const file of textFiles) {
    const relative = rel(file);
    if (relative.startsWith('src/desktop-electron/') || relative.startsWith('scripts/')) continue;
    const content = read(file);
    if (pattern.test(content)) matches.push(relative);
  }
  if (matches.length > 0) fail(id, `Dangerous pattern found: ${id}`, matches.slice(0, 8).join(', '));
  else pass(id, `No ${id} pattern found in renderer/shared code.`);
}

const secretLikePattern = /(access[_-]?token|refresh[_-]?token|oauth:[a-z0-9]{10,}|client_secret|password)\s*[:=]\s*['\"][^'\"]{6,}['\"]/i;
const secretMatches = [];
for (const file of textFiles) {
  const relative = rel(file);
  if (relative === 'scripts/security-audit.mjs') continue;
  const content = read(file);
  if (secretLikePattern.test(content)) secretMatches.push(relative);
}
if (secretMatches.length) fail('secret-scan', 'Potential hard-coded secret/token found.', secretMatches.slice(0, 10).join(', '));
else pass('secret-scan', 'No hard-coded access tokens, refresh tokens, passwords, or client secrets detected.');

const publicDir = path.join(root, 'public');
const sourceText = textFiles.map((file) => read(file)).join('\n');
const assetRefs = [...sourceText.matchAll(/[.\/]assets\/game\/runtime\/[^'\")\s`,]+/g)]
  .map((match) => match[0].replace(/^\.\//, '').replace(/^\//, ''));
const missingAssets = [];
for (const assetRef of new Set(assetRefs)) {
  const normalized = assetRef.replace(/\$\{[^}]+\}/g, '*');
  if (normalized.includes('*')) continue;
  if (!existsSync(path.join(publicDir, normalized))) missingAssets.push(assetRef);
}
if (missingAssets.length) fail('asset-reference-scan', 'Static asset references are missing.', missingAssets.slice(0, 12).join(', '));
else pass('asset-reference-scan', 'Static asset references resolve to files.');

const staleArtifacts = ['.env', '.env.local', 'npm-debug.log', 'yarn-error.log', 'pnpm-debug.log'];
for (const artifact of staleArtifacts) {
  if (existsSync(path.join(root, artifact))) fail('stale-artifact', `Stale/sensitive artifact exists: ${artifact}`, artifact);
}

const result = {
  generatedAt: new Date().toISOString(),
  summary: {
    passed: findings.filter((item) => item.severity === 'pass').length,
    failed: findings.filter((item) => item.severity === 'fail').length,
  },
  findings,
};

writeFileSync(path.join(root, 'SECURITY_AUDIT.json'), `${JSON.stringify(result, null, 2)}\n`);

if (result.summary.failed > 0) {
  console.error(JSON.stringify(result.summary, null, 2));
  for (const finding of findings.filter((item) => item.severity === 'fail')) {
    console.error(`[FAIL] ${finding.id}: ${finding.message}${finding.file ? ` (${finding.file})` : ''}`);
  }
  process.exit(1);
}

console.log(JSON.stringify(result.summary, null, 2));
