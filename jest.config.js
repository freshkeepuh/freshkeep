/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',       // use 'jsdom' if you need React testing
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // resolves "@/..." imports
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest',      // handles TS files
  },
  testPathIgnorePatterns: ['/node_modules/', '/.next/', '/tests/e2e/'], // ignore build folders
};
