import { memo } from "preact/compat";
import type { PreactDOMAttributes, JSX } from "preact";
import { RealtimeStop } from "mobility-toolbox-js/types";

export type RouteStopNameProps = PreactDOMAttributes &
  JSX.HTMLAttributes<HTMLDivElement> & {
    stop: RealtimeStop;
  };

function RouteStopName({ stop, children, ...props }: RouteStopNameProps) {
  const { stationName } = stop || {};
  return (
    <div {...props}>
      {stationName}
      {children}
    </div>
  );
}

export default memo(RouteStopName);
