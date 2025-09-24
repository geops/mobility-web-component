import { twMerge } from "tailwind-merge";

import NoRealtime from "../icons/NoRealtime";
import getMainColorForVehicle from "../utils/getMainColorForVehicle";
import getTextColor from "../utils/getTextColor";
import getTextFontForVehicle from "../utils/getTextFontForVehicle";
import getTextForVehicle from "../utils/getTextForVehicle";

import type {
  RealtimeDeparture,
  RealtimeLine,
  RealtimeStopSequence,
  RealtimeTrajectory,
} from "mobility-toolbox-js/types";
import type { HTMLAttributes, PreactDOMAttributes } from "preact";

export type RouteIconProps = {
  className?: string;
  departure?: RealtimeDeparture;
  displayNoRealtimeIcon?: boolean;
  line?: RealtimeLine;
  stopSequence?: RealtimeStopSequence;
  trajectory?: RealtimeTrajectory;
} & HTMLAttributes<HTMLSpanElement> &
  PreactDOMAttributes;
const fontSizesByNbLetters = [16, 16, 16, 14, 12];

function RouteIcon({
  children,
  className,
  departure,
  displayNoRealtimeIcon = false,
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
  const type = lineToUse?.type || stopSequence?.type || trajectory?.type;
  const backgroundColor = getMainColorForVehicle(
    line || departure || stopSequence || trajectory,
  );
  const color = lineToUse?.text_color || getTextColor(type);
  let borderColor = lineToUse?.stroke || "black";
  const text = getTextForVehicle(
    line || departure || stopSequence || trajectory,
  );

  const fontSize = fontSizesByNbLetters[text.length] || 12;
  const font = getTextFontForVehicle(fontSize, text);

  // RealtimeIcon only for stopsequence for now
  const hasRealtime = stopSequence?.has_realtime_journey === true;
  const showNoRealtimeIcon = !!stopSequence;
  const isCancelled = stopSequence?.stations[0]?.state === "JOURNEY_CANCELLED";

  if (borderColor === backgroundColor) {
    borderColor = "black";
  }

  return (
    <span
      className={twMerge(
        "relative flex h-[40px] min-w-[40px] items-center justify-center rounded-full border-2 px-1",
        className,
      )}
      style={{
        backgroundColor,
        borderColor,
        color,
        font,
      }}
      {...props}
    >
      {children || text}

      {displayNoRealtimeIcon &&
        showNoRealtimeIcon &&
        !isCancelled &&
        !hasRealtime && <NoRealtime className={"absolute -top-2 -left-2"} />}
    </span>
  );
}
export default RouteIcon;
