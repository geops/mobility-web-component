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
];
