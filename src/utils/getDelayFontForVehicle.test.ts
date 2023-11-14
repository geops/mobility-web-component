import getDelayFontForVehicle from "./getDelayFontForVehicle";

describe("getDelayFontForVehicle", () => {
  it("returns font that inherit", () => {
    expect(getDelayFontForVehicle(12)).toBe("bold 12px arial");
  });
});
