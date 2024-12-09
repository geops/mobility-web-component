import "jest-canvas-mock";

global.URL.createObjectURL = jest.fn(() => {
  return "fooblob";
});
