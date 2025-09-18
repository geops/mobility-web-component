import { memo } from "preact/compat";

import RouteDestination from "../RouteDestination";
import RouteIdentifier from "../RouteIdentifier";

import type { RealtimeStopSequence } from "mobility-toolbox-js/types";
import type { JSX, PreactDOMAttributes } from "preact";

export type RouteInfosProps = {
  stopSequence?: RealtimeStopSequence;
} & JSX.HTMLAttributes<HTMLDivElement> &
  PreactDOMAttributes;

function RouteInfos({ stopSequence, ...props }: RouteInfosProps) {
  return (
    <div {...props}>
      <RouteDestination className="font-bold" stopSequence={stopSequence} />
      <RouteIdentifier className="text-sm" stopSequence={stopSequence} />
    </div>
  );
}

export default memo(RouteInfos);
