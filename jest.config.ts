import type { Config } from 'jest';

const config: Config = {
  collectCoverageFrom: ['**/*.ts'],
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    '.*-config.service.ts',
    '.*.config.ts',
    '.*.dto.ts',
    '.*.error.ts',
    '.*.filter.ts',
    '.*.input.ts',
    '.*.module.ts',
    '.*.result.ts',
    'dist',
    'index.ts',
    'jest.config-coverage.ts',
    'main.ts',
    'node_modules',
    'tests',
  ],
  coverageReporters: ['lcov', 'clover', 'text-summary'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  moduleFileExtensions: ['js', 'json', 'ts'],
  preset: 'ts-jest',
  roots: ['<rootDir>'],
  testEnvironment: 'node',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        ignoreCoverageForAllDecorators: true,
        isolatedModules: false,
      },
    ],
  },
};

export default config;
