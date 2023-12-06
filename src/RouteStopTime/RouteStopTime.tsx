import type { RealtimeStop } from "mobility-toolbox-js/types";
import { memo } from "preact/compat";
import { PreactDOMAttributes, JSX } from "preact";
import getHoursAndMinutes from "../utils/getHoursAndMinutes";
import { StopStatus } from "../utils/getStopStatus";

export type RouteStopTimeProps = PreactDOMAttributes &
  JSX.HTMLAttributes<HTMLDivElement> & {
    status: StopStatus;
    stop: RealtimeStop;
  };

function RouteStopTime({ status, stop }: RouteStopTimeProps) {
  const { isCancelled, isFirst, isLast } = status;
  const { aimedArrivalTime, aimedDepartureTime } = stop;

  return (
    <>
      <span
        className={`${isCancelled ? "text-red-600 line-through" : ""} ${
          isFirst ? "hidden" : ""
        }`}
      >
        {getHoursAndMinutes(aimedArrivalTime)}
      </span>
      <span
        className={`${status.isCancelled ? "text-red-600 line-through" : ""} ${
          isLast ? "hidden" : ""
        }`}
      >
        {getHoursAndMinutes(aimedDepartureTime)}
      </span>
    </>
  );
}
export default memo(RouteStopTime);
