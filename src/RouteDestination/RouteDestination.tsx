import { memo } from "preact/compat";

import type { RealtimeStopSequence } from "mobility-toolbox-js/types";
import type { JSX, PreactDOMAttributes } from "preact";

export type RouteDestinationProps = {
  stopSequence?: RealtimeStopSequence;
} & JSX.HTMLAttributes<HTMLSpanElement> &
  PreactDOMAttributes;

function RouteDestination({ stopSequence, ...props }: RouteDestinationProps) {
  const { destination } = stopSequence || {};
  return <span {...props}>{destination}</span>;
}
export default memo(RouteDestination);
