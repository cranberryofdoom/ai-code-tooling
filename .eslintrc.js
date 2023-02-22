module.exports = {
  env: { node: true },
  extends: [
    './.eslint/base',
    './.eslint/typescript',
    './.eslint/jest',
    './.eslint/prettier', // The prettier config goes last to avoid format <> lint conflicts
  ].map(require.resolve),
  ignorePatterns: ['build/*', 'dist/*'],
  plugins: ['sort-destructure-keys'],
  root: true,
  rules: {
    '@typescript-eslint/sort-type-union-intersection-members': 'error',
    'sort-destructure-keys/sort-destructure-keys': 'error',
    'typescript-sort-keys/interface': 'error',
    'typescript-sort-keys/string-enum': 'error',
  },
};
