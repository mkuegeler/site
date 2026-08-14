import js from '@eslint/js'
import globals from 'globals'
import next from 'eslint-config-next/core-web-vitals'
import prettierRecommended from 'eslint-plugin-prettier/recommended'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import tsPlugin from '@typescript-eslint/eslint-plugin'

// eslint-config-next 16 ships a native flat config. Loading it through
// FlatCompat (as this file used to) crashes with "Converting circular structure
// to JSON", because the eslintrc validator JSON.stringifies configs and the
// plugin objects are self-referential. Import it directly instead.
//
// `eslint-config-next/core-web-vitals` is a superset of `eslint-config-next`:
// it contributes the react, react-hooks, import, jsx-a11y, @next/next and
// @typescript-eslint plugins, both parsers, and ignores for .next/, out/ and
// build/.
//
// The shared configs below are therefore spread as *rules only*. Flat config
// rejects a second definition of an already-registered plugin name, and the
// hoisted eslint-plugin-jsx-a11y is a different instance from the one
// eslint-config-next registers, so including their `plugins` keys would fail.
const TS_FILES = ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts']

// flat/recommended is [base (plugin registration), eslint-recommended, recommended].
// The first entry is dropped for the reason above; `eslint-recommended` is the
// piece that switches off base rules TypeScript already enforces, such as
// no-undef (which misreads type-only references like `React.ReactNode`) and
// no-unused-vars (deliberately disabled for this repo further down).
const [, tsEslintRecommended, tsRecommended] = tsPlugin.configs['flat/recommended']

export default [
  {
    ignores: ['.contentlayer/**', 'public/**', '.yarn/**'],
  },
  js.configs.recommended,
  ...next,
  {
    files: TS_FILES,
    rules: {
      ...tsEslintRecommended.rules,
      ...tsRecommended.rules,
    },
  },
  {
    rules: jsxA11y.flatConfigs.recommended.rules,
  },
  // Must follow the rule sets above so eslint-config-prettier can switch off the
  // formatting rules it conflicts with.
  prettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      'prettier/prettier': 'error',
      'react/react-in-jsx-scope': 'off',

      'jsx-a11y/anchor-is-valid': [
        'error',
        {
          components: ['Link'],
          specialLink: ['hrefLeft', 'hrefRight'],
          aspects: ['invalidHref', 'preferButton'],
        },
      ],
      'react/prop-types': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'react/no-unescaped-entities': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
    },
  },
]
