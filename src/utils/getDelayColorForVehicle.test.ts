import getDelayColorForVehicle from "./getDelayColorForVehicle";

describe("getDelayColorForVehicle", () => {
  it("returns cancelled color", () => {
    expect(getDelayColorForVehicle(null, null, 0, true, true)).toBe("#dc2626");
    expect(getDelayColorForVehicle(null, null, 0, true, false)).toBe("#a0a0a0");
  });

  it("returns null delay (no realtime train) color", () => {
    expect(getDelayColorForVehicle(null, null, null)).toBe("#a0a0a0");
  });

  it("returns green", () => {
    expect(getDelayColorForVehicle(null, null, 0)).toBe("#16a34a");
    expect(getDelayColorForVehicle(null, null, 2.49 * 60 * 1000)).toBe(
      "#16a34a",
    );
  });

  it("returns yellow", () => {
    expect(getDelayColorForVehicle(null, null, 3 * 60 * 1000)).toBe("#ca8a04");
    expect(getDelayColorForVehicle(null, null, 4.49 * 60 * 1000 - 1)).toBe(
      "#ca8a04",
    );
  });

  it("returns orange", () => {
    expect(getDelayColorForVehicle(null, null, 5 * 60 * 1000)).toBe("#ea580c");
    expect(getDelayColorForVehicle(null, null, 9.49 * 60 * 1000 - 1)).toBe(
      "#ea580c",
    );
  });

  it("returns red", () => {
    expect(getDelayColorForVehicle(null, null, 10 * 60 * 1000)).toBe("#dc2626");
    expect(getDelayColorForVehicle(null, null, 180 * 60 * 1000)).toBe(
      "#dc2626",
    );
  });
});
