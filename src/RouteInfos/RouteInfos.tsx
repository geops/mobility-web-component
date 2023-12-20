import { memo } from "preact/compat";
import { PreactDOMAttributes, JSX } from "preact";
import { RealtimeStopSequence } from "mobility-toolbox-js/types";
import RouteIdentifier from "../RouteIdentifier";
import RouteDestination from "../RouteDestination";

export type RouteInfosProps = PreactDOMAttributes &
  JSX.HTMLAttributes<HTMLDivElement> & {
    stopSequence?: RealtimeStopSequence;
  };

function RouteInfos({ stopSequence, ...props }: RouteInfosProps) {
  return (
    <div {...props}>
      <RouteDestination stopSequence={stopSequence} className="font-bold" />
      <RouteIdentifier stopSequence={stopSequence} className="text-sm" />
    </div>
  );
}

export default memo(RouteInfos);
