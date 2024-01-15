import type { RealtimeDeparture } from "mobility-toolbox-js/types";
import { memo, useMemo } from "preact/compat";
import RouteIcon from "../RouteIcon";
import getHoursAndMinutes from "../utils/getHoursAndMinutes";
import useMapContext from "../utils/hooks/useMapContext";
import { DepartureContext } from "../utils/hooks/useDeparture";
import DebugDeparture from "../DebugDeparture";

export type DepartureProps = {
  departure: RealtimeDeparture;
  index: number;
};

function Departure({ departure, index, ...props }: DepartureProps) {
  const { setTrainId, setStationId } = useMapContext();

  const departureState = useMemo(() => {
    return { departure, index };
  }, [departure, index]);

  return (
    <DepartureContext.Provider value={departureState}>
      <button
        type="button"
        className="w-full border-b"
        onClick={() => {
          setTrainId(departure.train_id);
          setStationId();
        }}
        {...props}
      >
        <div
          className="pt-4 pb-4 gap-4"
          style={{
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div className="pl-4">
            <RouteIcon departure={departure} />
          </div>
          <div className="flex-grow text-left">
            {[...new Set(departure.to)].join("/")}
          </div>
          <div className="pr-4">{getHoursAndMinutes(departure.time)}</div>
        </div>
      </button>
      <DebugDeparture />
    </DepartureContext.Provider>
  );
}
export default memo(Departure);
