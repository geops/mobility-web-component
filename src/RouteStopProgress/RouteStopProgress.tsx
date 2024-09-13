import { JSX, PreactDOMAttributes } from "preact";
import { memo } from "preact/compat";

import getMainColorForVehicle from "../utils/getMainColorForVehicle";
import useMapContext from "../utils/hooks/useMapContext";
import useRouteStop from "../utils/hooks/useRouteStop";

export type RouteStopProgressProps = {
  svgProps?: JSX.HTMLAttributes<SVGElement> & PreactDOMAttributes;
} & JSX.HTMLAttributes<HTMLDivElement> &
  PreactDOMAttributes;

function RouteStopProgress({ svgProps, ...props }: RouteStopProgressProps) {
  const { stopSequence } = useMapContext();
  const { invertColor, status } = useRouteStop();
  const { isBoarding, isFirst, isLast, isLeft, isPassed, progress } = status;
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
        fill="none"
        height="100%"
        stroke={colorScheme}
        width="16"
        xmlns="http://www.w3.org/2000/svg"
        {...svgProps}
      >
        {/* Circle used to display a black border */}
        <circle cx="50%" cy="50%" r="5" stroke="black" strokeWidth="6" />

        {/* Black line used to display a black border */}
        <line
          stroke="black"
          strokeWidth="6"
          x1="50%"
          x2="50%"
          y1={y1}
          y2={y2}
        />

        {/* Colored line (grey or color) */}
        <line
          stroke={progressDoneColor}
          strokeWidth="4"
          x1="50%"
          x2="50%"
          y1={y1}
          y2={yDone}
        />
        <line
          strokeWidth="4"
          x1="50%"
          x2="50%"
          y1={`${progress - 2}%`} // we use -2 because sometimes it could be a small gap between the previousline and this one
          y2={y2}
        />

        {/* Colored circle (grey or color) */}
        <circle cx="50%" cy="50%" r="5" strokeWidth="4" />
        <circle
          className={isBoarding ? "animate-pulse" : ""}
          cx="50%"
          cy="50%"
          r="5"
          stroke={circleColor}
          strokeWidth="4"
        />

        {/* white circle with black border */}
        <circle
          cx="50%"
          cy="50%"
          fill="white"
          r="3"
          stroke="black"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}
export default memo(RouteStopProgress);
