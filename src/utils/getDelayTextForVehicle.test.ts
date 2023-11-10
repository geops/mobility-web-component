import getDelayTextForVehicle from "./getDelayTextForVehicle";

describe("getDelayTextForVehicle", () => {
  it("returns cancelled character", () => {
    expect(getDelayTextForVehicle(7200000, true)).toBe(
      String.fromCodePoint(0x00d7),
    );
  });
  it("returns hours (floor)", () => {
    expect(getDelayTextForVehicle(7200000)).toBe("+2h");
    expect(getDelayTextForVehicle(7255555)).toBe("+2h1m");
  });
  it("returns minutes (round)", () => {
    expect(getDelayTextForVehicle(120000)).toBe("+2m");
    expect(getDelayTextForVehicle(151000)).toBe("+3m");
  });
  it("doesn't display seconds", () => {
    expect(getDelayTextForVehicle(1000)).toBe("");
    expect(getDelayTextForVehicle(30000)).toBe("+1m");
    expect(getDelayTextForVehicle(7255555)).toBe("+2h1m");
  });
  it("returns empty value", () => {
    expect(getDelayTextForVehicle(1000)).toBe("");
    expect(getDelayTextForVehicle(null)).toBe("");
    expect(getDelayTextForVehicle(undefined)).toBe("");
    expect(getDelayTextForVehicle(0)).toBe("");
  });
});
