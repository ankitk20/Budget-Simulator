import nextJest from 'next/jest';

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  testEnvironment: 'jest-environment-jsdom',
  transformIgnorePatterns: [
    '/node_modules/(?!(lucide-react)/)', // Ensure `lucide-react` is transformed
  ],
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'babel-jest', // Use Babel Jest
  },
};

export default createJestConfig(customJestConfig);
