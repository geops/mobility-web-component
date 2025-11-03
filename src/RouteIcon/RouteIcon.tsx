import { twMerge } from "tailwind-merge";

import NoRealtime from "../icons/NoRealtime";
import getMainColorForVehicle from "../utils/getMainColorForVehicle";
import getTextColor from "../utils/getTextColor";
import getTextFontForVehicle from "../utils/getTextFontForVehicle";
import getTextForVehicle from "../utils/getTextForVehicle";
import useMapContext from "../utils/hooks/useMapContext";

import type {
  RealtimeDeparture,
  RealtimeLine,
  RealtimeStopSequence,
  RealtimeTrajectory,
} from "mobility-toolbox-js/types";
import type { HTMLAttributes, PreactDOMAttributes } from "preact";

import type { LnpLineInfo } from "../utils/hooks/useLnp";

export type RouteIconProps = {
  className?: string;
  departure?: RealtimeDeparture;
  displayNoRealtimeIcon?: boolean;
  line?: RealtimeLine;
  lineInfo?: LnpLineInfo;
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
  lineInfo,
  stopSequence,
  trajectory,
  ...props
}: RouteIconProps) {
  const { realtimeLayer } = useMapContext();
  const lineToUse =
    line ||
    lineInfo ||
    departure?.line ||
    stopSequence?.line ||
    trajectory?.properties?.line;
  const trainId = stopSequence?.id || departure?.train_id;
  const trajectoryToUse = trajectory || realtimeLayer?.trajectories[trainId];

  const type = lineToUse?.type || stopSequence?.type || trajectory?.type;
  const backgroundColor = getMainColorForVehicle(
    line || lineInfo || departure || stopSequence || trajectory,
  );
  const color = lineToUse?.text_color || getTextColor(type);
  let borderColor = lineToUse?.stroke || "black";
  const text = getTextForVehicle(
    line || lineInfo || departure || stopSequence || trajectory,
  );

  const fontSize = fontSizesByNbLetters[text.length] || 12;
  const font = getTextFontForVehicle(fontSize, text);

  // RealtimeIcon only for stopsequence for now
  const hasRealtime =
    stopSequence?.has_realtime_journey ||
    departure?.has_realtime_journey ||
    trajectoryToUse?.properties?.has_realtime_journey ||
    (stopSequence?.stations?.[0]?.state &&
      stopSequence?.stations?.[0]?.state !== "TIME_BASED");
  const showNoRealtimeIcon = !!stopSequence || !!departure || !!trajectoryToUse;
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
        !hasRealtime && <NoRealtime className={"absolute -top-3 -right-3"} />}
    </span>
  );
}
export default RouteIcon;
