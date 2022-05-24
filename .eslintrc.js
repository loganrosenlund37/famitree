module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    'import/no-named-as-default-member': 0,
    'import/no-named-as-default': 0,
    'react/forbid-prop-types': 0,
    'react/jsx-one-expression-per-line': 0,
    'react/jsx-props-no-spreading': 0,
    'no-console': 0,
    'no-underscore-dangle': 0,
    'react/prop-types': 0,
    'no-plusplus': 0,
    eqeqeq: 0,
    'react/function-component-definition': [2, {
      namedComponents: ['arrow-function', 'function-declaration'],
    }],
  },
};
