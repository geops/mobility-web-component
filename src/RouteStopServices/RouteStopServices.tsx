import type { JSX, PreactDOMAttributes } from "preact";

import { memo } from "preact/compat";

import StationServices from "../StationServices";
import useRouteStop from "../utils/hooks/useRouteStop";

export type RouteStopNameProps = JSX.HTMLAttributes<HTMLDivElement> &
  PreactDOMAttributes;

function RouteStopServices(props: RouteStopNameProps) {
  const { station } = useRouteStop();
  if (!station) {
    return null;
  }
  return (
    <StationServices
      accessibility
      station={station}
      {...props}
      iconProps={{ width: 20 }}
    />
  );
}

export default memo(RouteStopServices);
