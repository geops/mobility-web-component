/** @type {import('ts-jest').JestConfigWithTsJest} */
const config = {
  moduleNameMapper: {
    "@geoblocks/ol-maplibre-layer":
      "<rootDir>/node_modules/@geoblocks/ol-maplibre-layer/lib/index.js",
    "\\.(css|less)$": "identity-obj-proxy",
  },
  preset: "jest-preset-preact",
  setupFiles: ["./jest-setup.js"],
  testEnvironment: "jsdom",
  transform: {
    "\\.(jpg|ico|jpeg|png|gif|webp)$": "<rootDir>/__mocks__/dataurl.js",
    "\\.[t]sx?$": "ts-jest",
  },
  transformIgnorePatterns: [],
};
export default config;
