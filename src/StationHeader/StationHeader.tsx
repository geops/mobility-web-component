import { memo } from "preact/compat";
import useMapContext from "../utils/hooks/useMapContext";
import StationServices from "../StationServices";

function StationHeader() {
  const { station } = useMapContext();
  const { name } = station.properties;
  return (
    <div className="bg-slate-100 p-4 flex gap-x-4 items-center">
      <div className="flex-grow flex flex-col">
        <span className="font-bold">{name}</span>
        <StationServices className="flex gap-2" />
      </div>
    </div>
  );
}

export default memo(StationHeader);
