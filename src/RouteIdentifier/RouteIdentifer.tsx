import { RealtimeStopSequence } from "mobility-toolbox-js/types";
import { memo } from "preact/compat";

function RouteIdentifier({ routeIdentifier, longName }: RealtimeStopSequence) {
  if (routeIdentifier) {
    // first part of the id, without leading zeros.
    let id = routeIdentifier;

    if (/\./.test(routeIdentifier)) {
      [id] = routeIdentifier.split(".");
    } else if (/_/.test(routeIdentifier)) {
      [id] = routeIdentifier.split("_");
    } else if (/:/.test(routeIdentifier)) {
      [id] = routeIdentifier.split(":");
    }

    if (/^\d*$/.test(id)) {
      id = `${parseInt(id, 10)}`;
    }

    if (!longName.includes(id)) {
      return <> ({id})</>;
    }
  }
  return null;
}
export default memo(RouteIdentifier);
