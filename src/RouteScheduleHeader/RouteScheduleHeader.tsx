import { memo } from "preact/compat";

import RouteFollowingButton from "../RouteFollowingButton/RouteFollowingButton";
import RouteIcon from "../RouteIcon";
import RouteInfos from "../RouteInfos";

import type { RealtimeStopSequence } from "mobility-toolbox-js/types";

function RouteScheduleHeader({
  stopSequence,
}: {
  stopSequence: RealtimeStopSequence;
}) {
  return (
    <div className="flex items-center gap-x-4 bg-slate-100 p-4">
      <RouteIcon stopSequence={stopSequence} />
      <RouteInfos className="flex grow flex-col" stopSequence={stopSequence} />
      <RouteFollowingButton />
    </div>
  );
}

export default memo(RouteScheduleHeader);
