import { PreactDOMAttributes, JSX } from "preact";
import type { RealtimeStopSequence } from "mobility-toolbox-js/types";
import { memo } from "preact/compat";

export type RouteDestinationProps = PreactDOMAttributes &
  JSX.HTMLAttributes<HTMLSpanElement> & {
    stopSequence?: RealtimeStopSequence;
  };

function RouteDestination({ stopSequence, ...props }: RouteDestinationProps) {
  const { destination } = stopSequence || {};
  return <span {...props}>{destination}</span>;
}
export default memo(RouteDestination);
