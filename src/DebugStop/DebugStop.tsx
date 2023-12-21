import { PreactDOMAttributes, JSX } from "preact";
import useRouteStop from "../utils/hooks/useRouteStop";
import useDebug from "../utils/hooks/useDebug";

export type DebugStopProps = PreactDOMAttributes &
  JSX.HTMLAttributes<HTMLDivElement>;

function DebugStop(props: DebugStopProps) {
  const { stop, status } = useRouteStop();
  const debug = useDebug();

  if (!debug) {
    return null;
  }

  return (
    <div style={{ display: "block", fontSize: 10 }} {...props}>
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
    </div>
  );
}

export default DebugStop;
