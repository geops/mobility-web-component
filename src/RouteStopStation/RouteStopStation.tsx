import type { RealtimeStation, RealtimeStop } from "mobility-toolbox-js/types";
import { memo } from "preact/compat";
import { PreactDOMAttributes, JSX } from "preact";
import RouteStopName from "../RouteStopName";
import RouteStopServices from "../RouteStopServices";

export type RouteStopStationProps = PreactDOMAttributes &
  JSX.HTMLAttributes<HTMLDivElement> & {
    station?: RealtimeStation;
    stop: RealtimeStop & {
      platform?: string;
    };
  };

function RouteStopStation({
  children,
  station,
  stop,
  ...props
}: RouteStopStationProps) {
  return (
    <div {...props}>
      <RouteStopName stop={stop} />
      <RouteStopServices
        stop={stop}
        station={station}
        className="flex flex-wrap gap-1"
      />
      {children}
    </div>
  );
}
export default memo(RouteStopStation);
