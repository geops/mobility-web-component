import { render } from "@testing-library/preact";

import RouteDestination from "./RouteDestination";

describe("RouteDestination", () => {
  test("should display destination", () => {
    const { container } = render(
      // @ts-expect-error bad type definition
      <RouteDestination stopSequence={{ destination: "foo" }} />,
    );
    expect(container.textContent).toMatch("foo");
  });
});
