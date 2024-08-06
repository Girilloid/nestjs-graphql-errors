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
    'main.ts',
    'node_modules',
    'tests',
  ],
  coverageReporters: ['lcov', 'clover', 'text-summary'],
  moduleFileExtensions: ['js', 'json', 'ts'],
  preset: 'ts-jest',
  roots: ['<rootDir>'],
  testEnvironment: 'node',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
};

export default config;
