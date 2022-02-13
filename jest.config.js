module.exports = {
  testEnvironment: 'node',
  verbose: false,

  transform: {
    '\\.ts': 'ts-jest',
  },
  testMatch: ['**/__tests__/**/*.test.ts'],
  setupFilesAfterEnv: ['./jest.setup.js'],
};
