import tseslint from "typescript-eslint";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import eslint from "@eslint/js";

export default [
  {
    ignores: ["build/*"],
  },
  ...tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.strict,
    ...tseslint.configs.stylistic,
    eslintPluginPrettierRecommended,
  ),
];

// export default [
//   {
//     ignores: ["build/*"],
//   },
//   {
//     plugins: {
//       "@typescript-eslint": typescriptEslint,
//       "@stylistic": stylisticJs,
//       cypress,
//       prettier,
//     },

//     ignores: ["build/*"],

//     languageOptions: {
//       globals: {
//         ...cypress.environments.globals.globals,
//         ...globals.node,
//         ...globals.browser,
//         ...globals.jest,
//       },

//       parser: tsParser,
//       ecmaVersion: 5,
//       sourceType: "commonjs",

//       parserOptions: {
//         project: "./tsconfig.json",
//       },
//     },

//     rules: {
//       "arrow-body-style": "off",
//       "react/prop-types": "off",
//       "react/require-default-props": "off",
//       "react/jsx-props-no-spreading": "off",
//       "react/react-in-jsx-scope": "off",
//       "react/jsx-one-expression-per-line": "off",

//       "react/jsx-filename-extension": [
//         "error",
//         {
//           extensions: [".js", ".jsx", ".tsx"],
//         },
//       ],

//       "prettier/prettier": "error",
//     },
//   },
//   StylisticPlugin.configs["disable-legacy"],
// ];
