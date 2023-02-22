module.exports = {
  testMatch: ['<rootDir>/tests/**/*.{spec,test}.{js,jsx,ts,tsx}'],
  transform: {
    '^.+\\.(js|jsx|mjs|cjs|ts|tsx)$': '@swc/jest',
  },
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|cjs|ts|tsx)$'],
};
