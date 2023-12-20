import { memo } from "preact/compat";
import { PreactDOMAttributes, JSX } from "preact";
import getHoursAndMinutes from "../utils/getHoursAndMinutes";
import useRouteStop from "../utils/hooks/useRouteStop";

export type RouteStopTimeProps = PreactDOMAttributes &
  JSX.HTMLAttributes<HTMLDivElement>;

function RouteStopTime(props: RouteStopTimeProps) {
  const { status, stop } = useRouteStop();
  const { isCancelled, isFirst, isLast } = status;
  const { aimedArrivalTime, aimedDepartureTime } = stop;

  return (
    <div {...props}>
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
    </div>
  );
}
export default memo(RouteStopTime);
