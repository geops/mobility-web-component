import type { RealtimeStopSequence } from "mobility-toolbox-js/types";
import { memo } from "preact/compat";

function RouteDestination({ destination }: RealtimeStopSequence) {
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{destination}</>;
}
export default memo(RouteDestination);
