import { memo } from "preact/compat";
import type { PreactDOMAttributes, JSX } from "preact";
import { RealtimeStation, RealtimeStop } from "mobility-toolbox-js/types";
import StationServices from "../StationServices";

export type RouteStopNameProps = PreactDOMAttributes &
  JSX.HTMLAttributes<HTMLDivElement> & {
    stop: RealtimeStop;
    station: RealtimeStation;
  };

function RouteStopServices({ stop, station, ...props }: RouteStopNameProps) {
  if (!station) {
    return null;
  }
  return <StationServices station={station} accessibility {...props} />;
}

export default memo(RouteStopServices);
