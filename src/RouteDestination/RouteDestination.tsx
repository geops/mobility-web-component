import type { RealtimeStopSequence } from "mobility-toolbox-js/types";

import { JSX, PreactDOMAttributes } from "preact";
import { memo } from "preact/compat";

export type RouteDestinationProps = {
  stopSequence?: RealtimeStopSequence;
} & JSX.HTMLAttributes<HTMLSpanElement> &
  PreactDOMAttributes;

function RouteDestination({ stopSequence, ...props }: RouteDestinationProps) {
  const { destination } = stopSequence || {};
  return <span {...props}>{destination}</span>;
}
export default memo(RouteDestination);
