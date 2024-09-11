import { memo } from "preact/compat";
import { PreactDOMAttributes, JSX } from "preact";
import getDelayColor from "../utils/getDelayColor";
import getDelayString from "../utils/getDelayString";
import useRouteStop from "../utils/hooks/useRouteStop";

export type RouteStopDelayProps = PreactDOMAttributes &
  JSX.HTMLAttributes<HTMLDivElement>;

function RouteStopDelay(props: RouteStopDelayProps) {
  const { status, stop } = useRouteStop();
  const { arrivalDelay, departureDelay } = stop;

  const hideDelay =
    status.isNotRealtime ||
    status.isCancelled ||
    status.isNotStop ||
    status.isPassed;

  return (
    <div {...props}>
      {hideDelay || arrivalDelay === null || status.isFirst ? null : (
        <span style={{ color: getDelayColor(arrivalDelay) }}>
          {`+${getDelayString(arrivalDelay)}`}
        </span>
      )}
      {hideDelay || departureDelay === null || status.isLast ? null : (
        <span style={{ color: getDelayColor(arrivalDelay) }}>
          {`+${getDelayString(departureDelay)}`}
        </span>
      )}
    </div>
  );
}
export default memo(RouteStopDelay);
