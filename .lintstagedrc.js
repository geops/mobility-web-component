const config = {
  "(src|__mocks__)/**/*.ts": [
    "eslint --fix",
    "prettier --write",
    "git add",
    "yarn test --bail --passWithNoTests --findRelatedTests",
  ],
  "package.json": ["fixpack", "git add"],
  // "src/**/*.{css,scss}": ["stylelint --fix --allow-empty-input"],
};

export default config;
