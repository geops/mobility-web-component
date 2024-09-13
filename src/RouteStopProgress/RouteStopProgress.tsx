import { PreactDOMAttributes, JSX } from "preact";
import { memo } from "preact/compat";

import getMainColorForVehicle from "../utils/getMainColorForVehicle";
import useMapContext from "../utils/hooks/useMapContext";
import useRouteStop from "../utils/hooks/useRouteStop";

export type RouteStopProgressProps = PreactDOMAttributes &
  JSX.HTMLAttributes<HTMLDivElement> & {
    svgProps?: PreactDOMAttributes & JSX.HTMLAttributes<SVGElement>;
  };

function RouteStopProgress({ svgProps, ...props }: RouteStopProgressProps) {
  const { stopSequence } = useMapContext();
  const { status, invertColor } = useRouteStop();
  const { isFirst, isLast, isPassed, isLeft, progress, isBoarding } = status;
  const y1 = isFirst ? "50%" : "-100%";
  const y2 = isLast ? "50%" : "100%";
  const yDone = `${progress}%`;

  const greyColor = "rgb(156, 163, 175)";
  const lineColor = getMainColorForVehicle(stopSequence);

  let colorScheme = isPassed ? greyColor : lineColor;
  let invertColorScheme = isPassed ? lineColor : greyColor;
  let progressDoneColor = greyColor;

  if (invertColor) {
    colorScheme = isPassed ? lineColor : greyColor;
    invertColorScheme = isPassed ? greyColor : lineColor;
    progressDoneColor = lineColor;
  }

  const circleColor =
    !isPassed && (isLeft || isBoarding) ? invertColorScheme : colorScheme;

  return (
    <div {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="100%"
        fill="none"
        stroke={colorScheme}
        {...svgProps}
      >
        {/* Circle used to display a black border */}
        <circle cx="50%" cy="50%" r="5" stroke="black" strokeWidth="6" />

        {/* Black line used to display a black border */}
        <line
          x1="50%"
          y1={y1}
          x2="50%"
          y2={y2}
          stroke="black"
          strokeWidth="6"
        />

        {/* Colored line (grey or color) */}
        <line
          x1="50%"
          y1={y1}
          x2="50%"
          y2={yDone}
          strokeWidth="4"
          stroke={progressDoneColor}
        />
        <line
          x1="50%"
          y1={`${progress - 2}%`} // we use -2 because sometimes it could be a small gap between the previousline and this one
          x2="50%"
          y2={y2}
          strokeWidth="4"
        />

        {/* Colored circle (grey or color) */}
        <circle cx="50%" cy="50%" r="5" strokeWidth="4" />
        <circle
          cx="50%"
          cy="50%"
          r="5"
          strokeWidth="4"
          stroke={circleColor}
          className={isBoarding ? "animate-pulse" : ""}
        />

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
    </div>
  );
}
export default memo(RouteStopProgress);
