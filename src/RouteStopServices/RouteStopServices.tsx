import { memo } from "preact/compat";
import type { PreactDOMAttributes, JSX } from "preact";
import StationServices from "../StationServices";
import useRouteStop from "../utils/hooks/useRouteStop";

export type RouteStopNameProps = PreactDOMAttributes &
  JSX.HTMLAttributes<HTMLDivElement>;

function RouteStopServices(props: RouteStopNameProps) {
  const { station } = useRouteStop();
  if (!station) {
    return null;
  }
  return (
    <StationServices
      station={station}
      accessibility
      {...props}
      iconProps={{ width: 20 }}
    />
  );
}

export default memo(RouteStopServices);
