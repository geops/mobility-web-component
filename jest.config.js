/** @type {import('ts-jest').JestConfigWithTsJest} */
const config = {
  preset: "jest-preset-preact",
  testEnvironment: "jsdom",
  transform: {
    "\\.[jt]sx?$": "ts-jest",
  },
};
export default config;
