import { memo } from "preact/compat";

import Tracking from "../icons/Tracking";
import RouteIcon from "../RouteIcon";
import RouteInfos from "../RouteInfos";
import IconButton from "../ui/IconButton";
import getBgColor from "../utils/getBgColor";
import useMapContext from "../utils/hooks/useMapContext";

function RouteScheduleHeader() {
  const { isFollowing, setIsFollowing, stopSequence } = useMapContext();
  const { stroke, text_color: textColor, type, vehicleType } = stopSequence;
  const backgroundColor = stroke || getBgColor(type || vehicleType);
  const color = textColor || "black";
  return (
    <div className="flex items-center gap-x-4 bg-slate-100 p-4">
      <RouteIcon stopSequence={stopSequence} />
      <RouteInfos className="flex grow flex-col" stopSequence={stopSequence} />
      <IconButton
        className={`${isFollowing ? "animate-pulse" : ""}`}
        onClick={() => {
          setIsFollowing(!isFollowing);
        }}
        style={{
          /* stylelint-disable-next-line value-keyword-case */
          backgroundColor: isFollowing ? backgroundColor : "white",
          color: isFollowing ? color : "black",
        }}
      >
        <Tracking />
      </IconButton>
    </div>
  );
}

export default memo(RouteScheduleHeader);
