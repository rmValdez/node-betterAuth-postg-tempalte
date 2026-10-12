import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  // uuid v14+ ships ESM only — transform it through ts-jest.
  // Note: pnpm nests packages under node_modules/.pnpm/<pkg>@<ver>/node_modules/<pkg>/...,
  // so a pattern anchored on "node_modules/(?!(uuid)/)" never actually excludes uuid (the
  // first "node_modules/" segment is immediately followed by ".pnpm/", not "uuid/", which
  // matches the ignore pattern and leaves the ESM file untransformed). Match "uuid"
  // appearing anywhere later in the path instead, so it works regardless of nesting depth.
  transformIgnorePatterns: [
    'node_modules/(?!.*(@better-auth|better-auth|better-call|rou3|@noble|kysely|uuid|jose))',
  ],
  transform: {
    '^.+\\.[tj]sx?$': ['ts-jest', { useESM: false, tsconfig: { allowJs: true } }],
    '^.+\\.mjs$': ['ts-jest', { useESM: false, tsconfig: { allowJs: true } }],
  },
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts', '!src/server.ts', '!src/worker.ts'],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  verbose: true,
};

export default config;
