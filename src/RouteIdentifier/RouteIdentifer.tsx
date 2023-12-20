import { RealtimeStopSequence } from "mobility-toolbox-js/types";
import { PreactDOMAttributes, JSX } from "preact";
import { memo } from "preact/compat";

export type RouteIdentifierProps = PreactDOMAttributes &
  JSX.HTMLAttributes<HTMLSpanElement> & {
    stopSequence?: RealtimeStopSequence;
  };

function RouteIdentifier({ stopSequence, ...props }: RouteIdentifierProps) {
  const { routeIdentifier, longName } = stopSequence || {};
  let text = longName;
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
      text = `${longName} (${id})`;
    }
  }
  return <span {...props}>{text}</span>;
}
export default memo(RouteIdentifier);
