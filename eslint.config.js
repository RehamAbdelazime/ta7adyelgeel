/** JavaScript-only ESLint rules; the TypeScript graph is checked by `tsc`. */
export default [
  { ignores: ['node_modules/**', 'dist/**', 'dist-electron/**', 'release-v2/**'] },
  {
    files: ['scripts/**/*.{mjs,cjs}', 'eslint.config.js'],
    languageOptions: { ecmaVersion: 'latest', sourceType: 'module' },
    rules: {
      'no-debugger': 'error',
      'no-unreachable': 'error',
      'no-constant-condition': 'error',
      'valid-typeof': 'error',
    },
  },
];
