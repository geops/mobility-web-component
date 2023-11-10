import getDelayString from "./getDelayString";

describe("getDelayString", () => {
  it("returns hours (floor)", () => {
    expect(getDelayString(7200000)).toBe("2h");
    expect(getDelayString(7255555)).toBe("2h1m");
  });
  it("returns minutes (round)", () => {
    expect(getDelayString(120000)).toBe("2m");
    expect(getDelayString(151000)).toBe("3m");
  });
  it("doesn't display seconds", () => {
    expect(getDelayString(1000)).toBe("0");
    expect(getDelayString(30000)).toBe("1m");
    expect(getDelayString(7255555)).toBe("2h1m");
  });
  it("returns defsult 0 value", () => {
    expect(getDelayString(0)).toBe("0");
    expect(getDelayString(null)).toBe("0");
    expect(getDelayString(undefined)).toBe("0");
  });
});
