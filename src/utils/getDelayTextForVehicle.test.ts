import getDelayTextForVehicle from "./getDelayTextForVehicle";

describe("getDelayTextForVehicle", () => {
  it("returns cancelled character", () => {
    expect(getDelayTextForVehicle(null, null, 7200000, true)).toBe(
      String.fromCodePoint(0x00d7),
    );
  });

  it("returns hours (floor)", () => {
    expect(getDelayTextForVehicle(null, null, 7200000)).toBe("+2h");
    expect(getDelayTextForVehicle(null, null, 7255555)).toBe("+2h1m");
  });

  it("returns minutes (round)", () => {
    expect(getDelayTextForVehicle(null, null, 120000)).toBe("+2m");
    expect(getDelayTextForVehicle(null, null, 151000)).toBe("+3m");
  });

  it("doesn't display seconds", () => {
    expect(getDelayTextForVehicle(null, null, 1000)).toBe("");
    expect(getDelayTextForVehicle(null, null, 30000)).toBe("+1m");
    expect(getDelayTextForVehicle(null, null, 7255555)).toBe("+2h1m");
  });

  it("returns empty value", () => {
    expect(getDelayTextForVehicle(null, null, 1000)).toBe("");
    expect(getDelayTextForVehicle(null, null, null)).toBe("");
    expect(getDelayTextForVehicle(null, null, undefined)).toBe("");
    expect(getDelayTextForVehicle(null, null, 0)).toBe("");
  });
});
