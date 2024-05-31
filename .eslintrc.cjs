/** @type {import("eslint").Linter.Config} */
const config = {
  extends: ['next/core-web-vitals', '@rocketseat/eslint-config/react'],
  rules: {
    camelcase: ['error', { allow: ['unstable_'] }],
    'prettier/prettier': [
      'error',
      {
        printWidth: 100,
        tabWidth: 2,
        singleQuote: true,
        trailingComma: 'all',
        arrowParens: 'always',
        semi: false,
        endOfLine: 'auto',
      },
    ],
  },
}

module.exports = config
