/** @type {import('ts-jest').JestConfigWithTsJest} */
const config = {
  moduleNameMapper: {
    "\\.(css|less)$": "identity-obj-proxy",
  },
  preset: "jest-preset-preact",
  setupFiles: ["./jest-setup.js"],
  testEnvironment: "jsdom",
  transform: {
    "\\.[t]sx?$": "ts-jest",
    "\\.(jpg|ico|jpeg|png|gif|webp)$": "<rootDir>/__mocks__/dataurl.js",
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(@testing-library|preact|preact-render-to-string|mobility-toolbox-js|ol|color-.*|filter-obj|split-on-first|node-fetch|query-string|decode-uri-component|fetch-blob|jstsol-mapbox-style|geotiff|quick-lru|rbush|quickselect|pbf|earcut)/).*/",
  ],
};
export default config;
