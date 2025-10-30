import { memo } from "preact/compat";

import StationName from "../StationName";
import StationServices from "../StationServices";

import type { RealtimeStation } from "mobility-toolbox-js/types";

function StationHeader({ station }: { station: RealtimeStation }) {
  return (
    <div className="flex items-center gap-x-4 bg-slate-100 p-4">
      <div className="flex grow flex-col">
        <span className="font-bold">
          <StationName station={station} />
        </span>
        <StationServices
          accessibility
          airport
          barAndRestaurants
          bathroom
          bikeStorage
          className="flex gap-2"
          elevator
          police
          station={station}
          waitingAreas
        />
      </div>
    </div>
  );
}

export default memo(StationHeader);
