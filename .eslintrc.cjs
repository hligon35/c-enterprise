/* eslint-env node */
module.exports = {
  root: true,
  env: { browser: true, es2022: true, node: true },
  extends: [
    'eslint:recommended',
  ],
  plugins: [
    'html',
    'import',
    'security',
    'no-unsanitized'
  ],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  rules: {
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'security/detect-object-injection': 'off',
    'no-unsanitized/method': 'warn',
    'no-unsanitized/property': 'warn'
  },
  settings: {
    'html/report-bad-indent': 'error'
  }
};
