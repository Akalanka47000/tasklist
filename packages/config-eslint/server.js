/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ['@sliit-foss/eslint-config-internal', 'custom/base'],
  rules: {
    'no-confusing-arrow': 'off'
  }
};
