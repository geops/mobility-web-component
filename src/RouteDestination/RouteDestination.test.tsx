/* eslint-disable import/no-extraneous-dependencies */
import { render } from "@testing-library/preact";

import RouteDestination from "./RouteDestination";

describe("RouteDestination", () => {
  test("should display destination", () => {
    const { container } = render(
      // @ts-ignore
      <RouteDestination stopSequence={{ destination: "foo" }} />,
    );
    expect(container.textContent).toMatch("foo");
  });
});
