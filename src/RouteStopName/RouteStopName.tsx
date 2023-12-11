import { memo } from "preact/compat";
import type { PreactDOMAttributes, JSX } from "preact";
import { RealtimeStop } from "mobility-toolbox-js/types";
import RouteStopPlatform from "../RouteStopPlatform";

export type RouteStopNameProps = PreactDOMAttributes &
  JSX.HTMLAttributes<HTMLDivElement> & {
    stop: RealtimeStop;
  };

function RouteStopName({ stop, children, ...props }: RouteStopNameProps) {
  const { stationName } = stop || {};
  return (
    <div {...props}>
      {stationName}
      <br />
      <span className="bg-slate-100">
        <RouteStopPlatform stop={stop} />
      </span>
      {children}
    </div>
  );
}

export default memo(RouteStopName);
