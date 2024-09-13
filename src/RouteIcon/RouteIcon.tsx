import {
  RealtimeDeparture,
  RealtimeLine,
  RealtimeStopSequence,
  RealtimeTrajectory,
} from "mobility-toolbox-js/types";
import { PreactDOMAttributes, JSX } from "preact";

import getMainColorForVehicle from "../utils/getMainColorForVehicle";
import getTextFontForVehicle from "../utils/getTextFontForVehicle";
import getTextForVehicle from "../utils/getTextForVehicle";

export type RouteIconProps = PreactDOMAttributes &
  JSX.HTMLAttributes<HTMLSpanElement> & {
    departure?: RealtimeDeparture;
    line?: RealtimeLine;
    stopSequence?: RealtimeStopSequence;
    trajectory?: RealtimeTrajectory;
  };
const fontSizesByNbLetters = [16, 16, 16, 14, 12];

function RouteIcon({
  children,
  departure,
  line,
  stopSequence,
  trajectory,
  ...props
}: RouteIconProps) {
  const lineToUse =
    line ||
    departure?.line ||
    stopSequence?.line ||
    trajectory?.properties?.line;
  const backgroundColor = getMainColorForVehicle(
    line || departure || stopSequence || trajectory,
  );
  const color = lineToUse?.text_color || "black";
  let borderColor = lineToUse?.stroke || "black";
  const text = getTextForVehicle(
    line || departure || stopSequence || trajectory,
  );

  const fontSize = fontSizesByNbLetters[text.length] || 12;
  const font = getTextFontForVehicle(fontSize, text);

  if (borderColor === backgroundColor) {
    borderColor = "black";
  }

  return (
    <span
      className="flex h-[40px] min-w-[40px] items-center justify-center rounded-full border-2 px-1"
      style={{
        font,
        backgroundColor,
        color,
        borderColor,
      }}
      {...props}
    >
      {children || text}
    </span>
  );
}
export default RouteIcon;
