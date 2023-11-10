import getHoursAndMinutes from "./getHoursAndMinutes";

describe("getHoursAndMinutes", () => {
  it("returns hours and minutes", () => {
    expect(getHoursAndMinutes(7200000)).toBe("02:00");
    expect(getHoursAndMinutes(72999999)).toBe("20:16");
  });
  it("returns empty string", () => {
    expect(getHoursAndMinutes(null)).toBe("");
    expect(getHoursAndMinutes(undefined)).toBe("");
    expect(getHoursAndMinutes(0)).toBe("");
    expect(getHoursAndMinutes(-500000)).toBe("");
  });
});
