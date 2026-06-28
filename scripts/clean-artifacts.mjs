#!/usr/bin/env node
import { rm } from 'node:fs/promises';

const targets = [
  'dist',
  'dist-electron',
  'release',
  'npm-debug.log',
  'yarn-error.log',
  'pnpm-debug.log',
  '.vite',
];

for (const target of targets) {
  await rm(target, { recursive: true, force: true });
}

console.log('Cleaned generated build artifacts.');
