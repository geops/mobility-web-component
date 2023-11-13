import { RealtimeStop } from "mobility-toolbox-js/types";

export type DebugStopProps = {
  stop: RealtimeStop;
  isPassed: boolean;
};

function DebugStop({ stop, isPassed }) {
  return (
    new URLSearchParams(window.location.search).get("debug") === "true" && (
      <div style={{ display: "block", fontSize: 10 }}>
        <div>
          State: <b>{stop.state}</b> (isPassed: {`${isPassed}`}) (cancelled:{" "}
          {`${stop.cancelled}`})
        </div>
        <div>
          Arrival time: {stop.arrivalTime} (delay:{" "}
          <b>{`${stop.arrivalDelay}`}</b>) (aimed: {stop.aimedArrivalTime})
        </div>
        <div>
          Departure time: {stop.arrivalTime} (delay:{" "}
          <b>{`${stop.departureDelay}`}</b>) (aimed: {stop.aimedArrivalTime})
        </div>
      </div>
    )
  );
}

export default DebugStop;
