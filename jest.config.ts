import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testTimeout: 20000,
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  testMatch: ['**/test/**/*.test.ts']
};

export default config;
