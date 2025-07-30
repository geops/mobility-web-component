import flat from "@geops/eslint-config-react/flat";

// Not supported for tailwind@4 yet, we use prtttier plugin instead
// import tailwind from "eslint-plugin-tailwindcss";

export default [
  ...flat,
  // Not supported for tailwind@4 yet, we use prtttier plugin instead
  // ...tailwind.configs["flat/recommended"],
  // {
  //   settings: {
  //     react: {
  //       version: "18.3.1",
  //     },
  //   },
  // },
  {
    rules: {
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/unbound-method": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "mocha/no-setup-in-describe": "off",
      "mocha/consistent-spacing-between-blocks": "off",
      "@typescript-eslint/no-redundant-type-constituents": "off",
      "mocha/no-pending-tests": "off",
      "@typescript-eslint/prefer-nullish-coalescing": "off",
      "react-compiler/react-compiler": "off",
    },
  },
];
