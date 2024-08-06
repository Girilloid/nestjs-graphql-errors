import type { Config } from 'jest';

import jestConfig from '../jest.config';

const config: Config = {
  ...jestConfig,
  setupFilesAfterEnv: ['<rootDir>/setup.ts'],
  testRegex: '.*\\.e2e-spec\\.ts$',
};

export default config;
