import { FlatCompat } from "@eslint/eslintrc";
import eslint from "@eslint/js";
import jsxA11y from "eslint-plugin-jsx-a11y";
import perfectionist from "eslint-plugin-perfectionist";
import prettier from "eslint-plugin-prettier/recommended";
import react from "eslint-plugin-react";
import tailwind from "eslint-plugin-tailwindcss";
import ts from "typescript-eslint";

// FlatCompat convert old definition to the new ones
const compat = new FlatCompat();

export default [
  {
    ignores: ["build/*"],
  },
  ...ts.config(
    eslint.configs.recommended,
    ...ts.configs.strict,
    ...ts.configs.stylistic,
    react.configs.flat.recommended,
    react.configs.flat["jsx-runtime"], // Avoid having the React-in-jsx-scope rule activated
    ...compat.config({
      extends: ["plugin:react-hooks/recommended"],
      rules: {
        "react-hooks/exhaustive-deps": "error",
      },
    }),
    jsxA11y.flatConfigs.recommended,
    perfectionist.configs["recommended-alphabetical"],
    prettier,
    ...tailwind.configs["flat/recommended"],
    {
      rules: {
        "arrow-body-style": ["error", "always"],
        curly: "error",
      },
    },
  ),
];
