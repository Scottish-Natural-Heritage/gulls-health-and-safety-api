/** @see https://typescript-eslint.io/getting-started/ */

// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import {defineConfig} from 'eslint/config';
import stylistic from '@stylistic/eslint-plugin';

export default defineConfig(
  {
    ignores: [
      '**/*dist', // exclude all compiled files
      '**/*.d.ts', // exclude all compiled types
      '**/*.js', // exclude all pre-compiled js files
      '**/*.mjs', // exclude all module js files
    ],
  },
  eslint.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  {
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@stylistic/arrow-parens': 'error',
      '@stylistic/no-multiple-empty-lines': 'off',
      '@stylistic/member-delimiter-style': 'off', // Conflicts with auto-format. Could be tuned to play nicely.
      '@stylistic/brace-style': 'off',
      '@stylistic/object-curly-newline': 'off',
      '@stylistic/operator-linebreak': 'off',
      '@stylistic/multiline-ternary': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off' // Too many in this repo to switch this on!
    },
  }
);
