/** @type {import("eslint").Linter.Config} */
module.exports = {
  env: {
    browser: true,
    node: true,
    es2022: true
  },
  extends: ['custom/base', 'plugin:react/recommended', 'plugin:react/jsx-runtime', 'plugin:react-hooks/recommended'],
  settings: {
    react: {
      version: '18.0'
    }
  },
  rules: {
    'react-hooks/exhaustive-deps': 'off',
    'react-hooks/rules-of-hooks': 'off',
    'react/display-name': 'off',
    'react/prop-types': 'off'
  }
};
