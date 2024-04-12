/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  importOrder: [
    '^(react/(.*)$)|^(react$)',
    '^(next/(.*)$)|^(next$)',
    '<THIRD_PARTY_MODULES>',
    '',
    '^@local/(.*)$',
    '^@/config/(.*)$',
    '^@/lib/(.*)$',
    '^@/constants/(.*)$',
    '^@/atoms/(.*)$',
    '^@/components/(.*)$',
    '^@/app/_components/(.*)$',
    '^@/hooks/(.*)$',
    '^@/app/_hooks/(.*)$',
    '^@/utils/(.*)$',
    '^@/types/(.*)$',
    '^@/styles/(.*)$',
    '^[./]',
  ],
  importOrderSeparation: false,
  importOrderSortSpecifiers: true,
  importOrderBuiltinModulesToTop: true,
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
  importOrderMergeDuplicateImports: true,
  importOrderCombineTypeAndValueImports: true,
  overrides: [
    {
      files: ['**/**'],
      options: {
        plugins: [
          '@ianvs/prettier-plugin-sort-imports',
          'prettier-plugin-tailwindcss',
        ],
      },
    },
  ],
}

export default config
