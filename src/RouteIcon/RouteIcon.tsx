import { RealtimeLine, RealtimeMot } from "mobility-toolbox-js/types";
import { PreactDOMAttributes, JSX } from "preact";
import getBgColor from "../utils/getBgColor";
import getTextFontForVehicle from "../utils/getTextFontForVehicle";
import getTextForVehicle from "../utils/getTextForVehicle";

export type RouteIconProps = PreactDOMAttributes &
  JSX.HTMLAttributes<HTMLSpanElement> & {
    type?: RealtimeMot;
    vehicleType?: RealtimeMot;
    train_type?: RealtimeMot;
    name?: string;
    shortName?: string;
    color?: string;
    text_color?: string;
    line?: RealtimeLine;
  };

function RouteIcon(props: RouteIconProps) {
  const {
    type,
    vehicleType,
    train_type: trainType,
    name,
    shortName,
    color,
    text_color: textColor,
    line,
    children,
  } = props;
  const nameToUse = name || line?.name || shortName;
  const typeToUse = type || vehicleType || trainType || "rail";
  const colorToUse = color || line?.color || getBgColor(typeToUse);
  const textColorToUse = textColor || line?.text_color || "black";
  const text = getTextForVehicle(nameToUse);

  let fontSize = 16;
  if (text.length >= 4) {
    fontSize = 12;
  }

  const font = getTextFontForVehicle(fontSize, text);
  return (
    <span
      className="border-0 rounded h-[40px] min-w-[40px] px-1 flex items-center justify-center"
      style={{
        font,
        backgroundColor: colorToUse,
        color: textColorToUse,
      }}
      {...props}
    >
      {children || text}
    </span>
  );
}
export default RouteIcon;
