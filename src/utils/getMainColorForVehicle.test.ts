import getMainColorForVehicle from "./getMainColorForVehicle";

describe("getTextForVehicle", () => {
  it("returns default rail color", () => {
    expect(getMainColorForVehicle()).toBe("#ff8080");
    expect(getMainColorForVehicle(null)).toBe("#ff8080");
    expect(getMainColorForVehicle({ train_type: 178 })).toBe("#ff8080");
    expect(getMainColorForVehicle({ vehicleType: 178 })).toBe("#ff8080");
  });

  it("returns color", () => {
    expect(getMainColorForVehicle({ color: "foo" })).toBe("#foo");
    expect(getMainColorForVehicle({ line: { color: "#foo" } })).toBe("#foo");
    expect(
      getMainColorForVehicle({ properties: { line: { color: "foo" } } }),
    ).toBe("#foo");
  });

  it("returns type color", () => {
    expect(getMainColorForVehicle({ type: "tram" })).toBe("#ffb400");
    expect(getMainColorForVehicle({ properties: { type: "tram" } })).toBe(
      "#ffb400",
    );
    expect(getMainColorForVehicle({ vehicleType: 0 })).toBe("#ffb400");
    expect(getMainColorForVehicle({ train_type: 0 })).toBe("#ffb400");
  });
});
