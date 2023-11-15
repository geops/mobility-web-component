/* eslint-disable import/no-extraneous-dependencies */
import { render } from "@testing-library/preact";

import RouteDestination from "./RouteDestination";

describe("RouteDestination", () => {
  test("should display destination", () => {
    // @ts-ignore
    const { container } = render(<RouteDestination destination="foo" />);
    expect(container.textContent).toMatch("foo");
  });
});
