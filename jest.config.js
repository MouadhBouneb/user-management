module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleNameMapping: {
    '^config/(.*)$': '<rootDir>/src/config/$1',
    '^domain/(.*)$': '<rootDir>/src/domain/$1',
    '^application/(.*)$': '<rootDir>/src/application/$1',
    '^infrastructure/(.*)$': '<rootDir>/src/infrastructure/$1',
    '^presentation/(.*)$': '<rootDir>/src/presentation/$1',
    '^shared/(.*)$': '<rootDir>/src/shared/$1',
    '^utils/(.*)$': '<rootDir>/src/utils/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/__tests__/**',
  ],
};