import attributes from "./MobilityMapAttributes";

describe("MobilityMapAttributes", () => {
  Object.entries(attributes).forEach(([key, value]) => {
    test(`${key} has a description`, () => {
      expect(value.description).toBeDefined();
    });

    if (value.type === "boolean") {
      test(`${key} has a defaultValue for boolean`, () => {
        expect(value.defaultValue).toMatch(/^(true|false)$/);
      });
    }

    if (value.defaultValue === "true" || value.defaultValue === "false") {
      test(`${key} is boolean when defaultValue is true or false`, () => {
        expect(value.type).toBe("boolean");
      });
    }
  });
});
