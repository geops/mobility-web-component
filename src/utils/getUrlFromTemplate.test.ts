import getUrlFromTemplate from "./getUrlFromTemplate";

describe("getUrlFromTemplate", () => {
  it("should replace parameters in the template", () => {
    const template = "?z={{z}}&x={{x}}&y={{y}}";
    const params = new URLSearchParams({ x: "512", y: "200", z: "10" });
    const url = getUrlFromTemplate(template, params);
    expect(url).toBe("http://localhost/?z=10&x=512&y=200");
  });

  it("should handle hash templates", () => {
    const template = "#/map/{{z}}/{{x}}/{{y}}";
    const params = new URLSearchParams({ x: "512", y: "200", z: "10" });
    const url = getUrlFromTemplate(template, params);
    expect(url).toBe("http://localhost/#/map/10/512/200");
  });

  it("should handle null templates returning the window location", () => {
    const params = new URLSearchParams({ x: "512", y: "200", z: "10" });
    const url = getUrlFromTemplate(null, params);
    expect(url).toBe("http://localhost/");
  });
});
