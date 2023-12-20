import {
  RealtimeDepartureExtended,
  RealtimeLine,
  RealtimeMot,
  RealtimeStopSequence,
  RealtimeTrajectory,
} from "mobility-toolbox-js/types";
import { PreactDOMAttributes, JSX } from "preact";
import getBgColor from "../utils/getBgColor";
import getTextFontForVehicle from "../utils/getTextFontForVehicle";
import getTextForVehicle from "../utils/getTextForVehicle";

export type RouteIconProps = PreactDOMAttributes &
  JSX.HTMLAttributes<HTMLSpanElement> & {
    departure?: RealtimeDepartureExtended;
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
  const typeToUse =
    stopSequence?.type ||
    stopSequence?.vehicleType ||
    departure?.train_type ||
    "rail";
  const backgroundColor =
    lineToUse?.color || getBgColor(typeToUse as RealtimeMot);
  const color = lineToUse?.text_color || "black";
  let borderColor = lineToUse?.stroke || "black";
  const text = getTextForVehicle(lineToUse?.name);

  const fontSize = fontSizesByNbLetters[text.length] || 12;
  const font = getTextFontForVehicle(fontSize, text);

  if (borderColor === backgroundColor) {
    borderColor = "black";
  }

  return (
    <span
      className="border-2 rounded-full h-[40px] min-w-[40px] px-1 flex items-center justify-center"
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
