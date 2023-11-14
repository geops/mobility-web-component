import getTextFontForVehicle from "./getTextFontForVehicle";

describe("getTextFontForVehicle", () => {
  it("returns font that inherit", () => {
    expect(getTextFontForVehicle(12)).toBe("bold 12px arial");
  });
});
