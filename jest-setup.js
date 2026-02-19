import "jest-canvas-mock";

global.URL.createObjectURL = jest.fn(() => {
  return "fooblob";
});

class TextEncoder {
  constructor() {}
  decode() {}
  encode() {}
}

global.TextDecoder = TextEncoder;
