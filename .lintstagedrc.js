const config = {
  "(src|__mocks__)/**/*.(tsx|ts|js|jsx|cjs)": [
    "eslint --fix",
    "prettier --write",
    "git add",
    "yarn test --bail --passWithNoTests --findRelatedTests",
  ],
  "package.json": ["fixpack"],
  "src/**/*.svg": ["svgo"],
  // "src/**/*.{css,scss}": ["stylelint --fix --allow-empty-input"],
};

export default config;
