import { memo } from "preact/compat";

import Tracking from "../icons/Tracking";
import RouteIcon from "../RouteIcon";
import RouteInfos from "../RouteInfos";
import IconButton from "../ui/IconButton";
import useMapContext from "../utils/hooks/useMapContext";

function RouteScheduleHeader() {
  const { isFollowing, setIsFollowing, stopSequence } = useMapContext();
  return (
    <div className="flex items-center gap-x-4 bg-slate-100 p-4">
      <RouteIcon stopSequence={stopSequence} />
      <RouteInfos className="flex grow flex-col" stopSequence={stopSequence} />
      <IconButton
        className={`${isFollowing ? "animate-pulse" : ""}`}
        onClick={() => {
          setIsFollowing(!isFollowing);
        }}
        selected={isFollowing}
      >
        <Tracking />
      </IconButton>
    </div>
  );
}

export default memo(RouteScheduleHeader);
