import type { RealtimeStop } from "mobility-toolbox-js/types";
import { memo } from "preact/compat";
import { PreactDOMAttributes, JSX } from "preact";
import getDelayColor from "../utils/getDelayColor";
import getDelayString from "../utils/getDelayString";
import { StopStatus } from "../utils/getStopStatus";

export type RouteStopDelayProps = PreactDOMAttributes &
  JSX.HTMLAttributes<HTMLDivElement> & {
    status: StopStatus;
    stop: RealtimeStop;
  };

function RouteStopDelay({ status, stop }: RouteStopDelayProps) {
  const {
    arrivalDelay,
    // eslint-disable-next-line
    departureDelay,
  } = stop;

  return (
    <>
      {arrivalDelay === null || status.isFirst ? null : (
        <span style={{ color: getDelayColor(arrivalDelay) }}>
          {`+${getDelayString(arrivalDelay)}`}
        </span>
      )}
      {departureDelay === null || status.isLast ? null : (
        <span style={{ color: getDelayColor(arrivalDelay) }}>
          {`+${getDelayString(departureDelay)}`}
        </span>
      )}
    </>
  );
}
export default memo(RouteStopDelay);
