import { PreactDOMAttributes, JSX } from "preact";

import useDebug from "../utils/hooks/useDebug";
import useRouteStop from "../utils/hooks/useRouteStop";

export type DebugStopProps = PreactDOMAttributes &
  JSX.HTMLAttributes<HTMLDivElement>;

function DebugStop(props: DebugStopProps) {
  const { stop, status } = useRouteStop();
  const debug = useDebug();

  if (!debug) {
    return null;
  }

  return (
    <div className="p-4 text-left text-xs" {...props}>
      <div>
        State: <b>{stop.state}</b> (isPassed: {`${status.isPassed}`})
        (cancelled: {`${stop.cancelled}`})
      </div>
      <div>
        Arrival time: {stop.arrivalTime} (delay: <b>{`${stop.arrivalDelay}`}</b>
        ) (aimed: {stop.aimedArrivalTime})
      </div>
      <div>
        Departure time: {stop.arrivalTime} (delay:{" "}
        <b>{`${stop.departureDelay}`}</b>) (aimed: {stop.aimedArrivalTime})
      </div>
      <div>
        {Object.entries(status).map(([key, value]) => {
          if (value === false) {
            return null;
          }
          return (
            <div key={key}>
              {key}: {`${value}`}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DebugStop;
