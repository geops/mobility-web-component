import { RealtimeMot, RealtimeStopSequence } from "mobility-toolbox-js/types";
import getBgColor from "../utils/getBgColor";
import getTextFontForVehicle from "../utils/getTextFontForVehicle";

function RouteIcon({
  type,
  vehicleType,
  shortName,
  stroke,
  text_color: textColor,
}: RealtimeStopSequence) {
  const backgroundColor =
    stroke || getBgColor(type || (vehicleType as unknown as RealtimeMot));
  const color = textColor || "black";
  return (
    <span
      className="border-2 border-black rounded-full h-9 min-w-[2.25rem] px-1 flex items-center justify-center"
      style={{
        font: getTextFontForVehicle(16),
        backgroundColor,
        color,
      }}
    >
      {shortName}
    </span>
  );
}
export default RouteIcon;
