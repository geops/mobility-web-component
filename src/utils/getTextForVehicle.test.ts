import getTextForVehicle from "./getTextForVehicle";

describe("getTextForVehicle", () => {
  it("returns empty", () => {
    expect(getTextForVehicle()).toBe("");
    expect(getTextForVehicle(null)).toBe("");
  });

  it("returns name", () => {
    expect(getTextForVehicle("name")).toBe("name");
    expect(getTextForVehicle({ name: "name" })).toBe("name");
    expect(getTextForVehicle({ line: { name: "name" } })).toBe("name");
    expect(getTextForVehicle({ properties: { line: { name: "name" } } })).toBe(
      "name",
    );
  });
});
