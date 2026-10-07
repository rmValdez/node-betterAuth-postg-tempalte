import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  // Global ignores
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**', 'tools/**'],
  },

  // Base JS recommended
  js.configs.recommended,

  // TypeScript recommended
  ...tseslint.configs.recommended,

  // Main config for all TS source files
  {
    files: ['src/**/*.ts', 'prisma/**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-namespace': 'off',
      'no-console': ['warn', { allow: ['error', 'warn', 'info', 'log'] }],
      'no-return-await': 'off',
      'no-useless-escape': 'off',
    },
  },

  // Relax console rules for seed/setup files
  {
    files: ['prisma/**/*.ts', 'src/app.ts', 'src/utils/redis.util.ts'],
    rules: {
      'no-console': 'off',
    },
  },

  // Relax any-type rules in test files
  {
    files: ['tests/**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
);
