const path = require('path');

module.exports = {
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  plugins: [
    'react',
    '@typescript-eslint'
  ],
  parser: '@typescript-eslint/parser',
  env: {
    browser: true,
    es6: true,
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
      }
    },
  },
  rules: {
    'react/jsx-filename-extension': [2, { extensions: ['.tsx', '.jsx'] }],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'react-hooks/exhaustive-deps': 'off'
  },
};
