const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig');

module.exports = {
  testEnvironment: 'node',
  preset: 'ts-jest',
  globalSetup: '<rootDir>/test/integration/bootstrap.ts',
  globalTeardown: '<rootDir>/test/integration/teardown.ts',
  moduleNameMapper: {
    ...pathsToModuleNameMapper(compilerOptions.paths, { prefix: `<rootDir>/src` }),
    '@shared/constants': '<rootDir>/../packages/constants/src/index.ts'
  },
  coveragePathIgnorePatterns: ['<rootDir>/test', '<rootDir>/src/modules/users']
};
