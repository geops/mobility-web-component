import type { RealtimeDepartureExtended } from "mobility-toolbox-js/types";
import { memo } from "preact/compat";
import RouteIcon from "../RouteIcon";
import getHoursAndMinutes from "../utils/getHoursAndMinutes";
import useMapContext from "../utils/hooks/useMapContext";

export type DepartureProps = {
  departure: RealtimeDepartureExtended;
  index: number;
};

function Departure({ departure, index, ...props }: DepartureProps) {
  const { setTrainId, setStationId } = useMapContext();

  return (
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
          <RouteIcon {...departure} />
        </div>
        <div className="flex-grow text-left">
          {[...new Set(departure.to)].join("/")}
        </div>
        <div className="pr-4">{getHoursAndMinutes(departure.time)}</div>
      </div>

      {/* <DepartureDebugInfo departure={departure} />
                    <DepartureInfo
                      incidentProgram={this.simulateIncident || incidentProgram}
                      departure={departure}
                    /> */}
    </button>
  );
}
export default memo(Departure);
