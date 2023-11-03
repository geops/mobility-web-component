module.exports = {
  env: {
    "cypress/globals": true,
    node: true,
    browser: true,
    es6: true,
    jest: true,
  },
  parser: "@typescript-eslint/parser",
  extends: ["airbnb", "airbnb/hooks", "airbnb-typescript", "prettier"],
  plugins: ["@typescript-eslint", "cypress", "prettier"],
  parserOptions: {
    project: "./tsconfig.json",
  },
  rules: {
    "arrow-body-style": "off",
    "react/prop-types": "off",
    "react/require-default-props": "off",
    "react/jsx-props-no-spreading": "off",
    "react/react-in-jsx-scope": "off",
    "react/jsx-one-expression-per-line": "off",
    "react/jsx-filename-extension": [
      "error",
      {
        extensions: [".js", ".jsx", ".tsx"],
      },
    ],
    "prettier/prettier": "error",
  },
};
