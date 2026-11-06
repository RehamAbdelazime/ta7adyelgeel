import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// The native Node.js suites under tests/qa use node:test, NOT Vitest.
// Keep both runners separate; otherwise Vitest discovers the .cjs files
// and reports false "No test suite found" failures.
export default defineConfig({
  plugins: [react()],
  test: {
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    exclude: ['**/node_modules/**', '**/.qa-tools/**'],
  },
});
