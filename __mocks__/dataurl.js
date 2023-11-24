export const emptyPng =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

export default {
  process() {
    // sourceText, sourcePath, options
    return {
      code: `module.exports = "${emptyPng}";`,
    };
  },
};
