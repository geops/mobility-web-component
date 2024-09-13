import ts from "typescript-eslint";
import { FlatCompat } from "@eslint/eslintrc";
import prettier from "eslint-plugin-prettier/recommended";
import eslint from "@eslint/js";
import react from "eslint-plugin-react";
import jsxA11y from "eslint-plugin-jsx-a11y";
import perfectionist from "eslint-plugin-perfectionist";
import tailwind from "eslint-plugin-tailwindcss";

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
    {
      plugins: {
        perfectionist,
      },
      rules: {
        "perfectionist/sort-imports": "error",
      },
    },
    prettier,
    ...tailwind.configs["flat/recommended"],
  ),
];
