import getDelayColor from "./getDelayColor";

describe("getDelayColor", () => {
  it("returns green", () => {
    expect(getDelayColor(0)).toBe("#16a34a");
    expect(getDelayColor(2.49 * 60 * 1000)).toBe("#16a34a");
  });
  it("returns yellow", () => {
    expect(getDelayColor(3 * 60 * 1000)).toBe("#ca8a04");
    expect(getDelayColor(4.49 * 60 * 1000 - 1)).toBe("#ca8a04");
  });
  it("returns orange", () => {
    expect(getDelayColor(5 * 60 * 1000)).toBe("#ea580c");
    expect(getDelayColor(9.49 * 60 * 1000 - 1)).toBe("#ea580c");
  });
  it("returns red", () => {
    expect(getDelayColor(10 * 60 * 1000)).toBe("#dc2626");
    expect(getDelayColor(180 * 60 * 1000)).toBe("#dc2626");
  });
});
