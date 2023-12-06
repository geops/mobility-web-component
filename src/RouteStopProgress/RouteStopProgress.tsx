import { memo } from "preact/compat";
import { PreactDOMAttributes, JSX } from "preact";
import { StopStatus } from "../utils/getStopStatus";

export type RouteStopProgressProps = PreactDOMAttributes &
  JSX.HTMLAttributes<SVGElement> & {
    status: StopStatus;
  };

function RouteStopProgress({ status, ...props }: RouteStopProgressProps) {
  const { isFirst, isLast } = status;
  const y1 = isFirst ? "50%" : "-100%";
  const y2 = isLast ? "50%" : "100%";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="100%"
      fill="none"
      stroke="currentColor"
      {...props}
    >
      {/* Circle used to display a black border */}
      <circle cx="50%" cy="50%" r="5" stroke="black" strokeWidth="6" />

      {/* Black line used to display a black border */}
      <line x1="50%" y1={y1} x2="50%" y2={y2} stroke="black" strokeWidth="6" />

      {/* Colored line (grey or color) */}
      <line x1="50%" y1={y1} x2="50%" y2={y2} strokeWidth="4" />

      {/* Colored circle (grey or color) */}
      <circle cx="50%" cy="50%" r="5" strokeWidth="4" />

      {/* white circle with black border */}
      <circle
        cx="50%"
        cy="50%"
        r="3"
        fill="white"
        stroke="black"
        strokeWidth="1"
      />
    </svg>
  );
}
export default memo(RouteStopProgress);
