import { memo } from "preact/compat";
import useMapContext from "../utils/hooks/useMapContext";
import StationServices from "../StationServices";
import StationName from "../StationName";

function StationHeader() {
  const { station } = useMapContext();
  return (
    <div className="flex items-center gap-x-4 bg-slate-100 p-4">
      <div className="flex grow flex-col">
        <span className="font-bold">
          <StationName station={station} />
        </span>
        <StationServices
          station={station}
          className="flex gap-2"
          accessibility
          airport
          barAndRestaurants
          bathroom
          bikeStorage
          elevator
          police
          waitingAreas
        />
      </div>
    </div>
  );
}

export default memo(StationHeader);
