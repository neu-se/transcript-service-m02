import { defineConfig, globalIgnores } from 'eslint/config';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import eslintPluginImport from 'eslint-plugin-import';

export default defineConfig([
  globalIgnores([
    '**/build',
    '**/dist',
    '**/.stryker-tmp/',
    '**/coverage',
    '**/vite.config.mjs',
    'eslint.config.mjs',
  ]),
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    extends: [
      js.configs.recommended,
      eslintPluginImport.flatConfigs.recommended,
      eslintPluginImport.flatConfigs.typescript,
    ],
    settings: {
      'import/resolver': { typescript: true },
    },
    rules: {
      'eqeqeq': 'error',
      'import/no-amd': 'error',
      'import/no-commonjs': 'error',
      'import/no-empty-named-blocks': 'error',
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: ['vite.config.mjs', 'eslint.config.mjs', '**/*.spec.ts', '**/tests/*.ts'],
          includeInternal: true,
        },
      ],
      'import/no-import-module-exports': 'error',
      'import/no-named-as-default': 'error',
      'import/no-named-as-default-member': 'off',
      'no-console': 'warn',
      'no-param-reassign': 'error',
      'no-plusplus': 'error',
      'no-throw-literal': 'error',
      'no-unused-vars': ['error', { args: 'none', caughtErrors: 'none' }],
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    extends: tseslint.configs.recommendedTypeChecked,
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'variable',
          format: ['camelCase'],
          leadingUnderscore: 'allow',
        },
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
        {
          selector: 'variable',
          format: ['PascalCase'],
          filter: {
            regex: 'Model$',
            match: true,
          },
        },
        {
          selector: 'variable',
          modifiers: ['global', 'const'],
          types: ['boolean', 'number', 'string', 'array'],
          format: ['UPPER_CASE'],
        },
        {
          selector: 'memberLike',
          modifiers: ['private'],
          format: ['camelCase'],
          leadingUnderscore: 'require',
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { args: 'none', varsIgnorePattern: '^_', caughtErrors: 'none' },
      ],
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: {
            arguments: false,
            attributes: false,
          },
        },
      ],
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/no-unsafe-member-access': ['error', { allowOptionalChaining: true }],
    },
  },
  {
    files: ['{client,frontend}/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'variable',
          format: ['camelCase'],
        },
        {
          selector: 'variable',
          types: ['function'],
          format: ['camelCase', 'PascalCase'],
        },
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
        {
          selector: 'variable',
          format: ['camelCase'],
          filter: {
            regex: '^use[A-Z].*',
            match: true,
          },
        },
        {
          selector: 'variable',
          format: ['PascalCase'],
          filter: {
            regex: 'Context$',
            match: true,
          },
        },
        {
          selector: 'variable',
          modifiers: ['global', 'const'],
          types: ['boolean', 'number', 'string', 'array'],
          format: ['UPPER_CASE'],
        },
        {
          selector: 'memberLike',
          modifiers: ['private'],
          format: ['camelCase'],
          leadingUnderscore: 'require',
        },
      ],
      '@typescript-eslint/no-floating-promises': 'off',
    },
  },
  {
    files: ['**/*.spec.{ts,tsx}', '**/tests'],
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/unbound-method': 'off',
      'import/no-extraneous-dependencies': 'off',
    },
  },
  {
    extends: [eslintPluginPrettierRecommended],
    rules: { 'prettier/prettier': 'warn' },
  },
]);
