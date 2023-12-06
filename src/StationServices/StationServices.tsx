import { memo } from "preact/compat";
import useMapContext from "../utils/hooks/useMapContext";
import WheelChair from "../icons/WheelChair";
import Airport from "../icons/Airport";
import BarAndRestaurants from "../icons/BarAndRestaurants";
import BikeStorage from "../icons/BikeStorage";
import WaitingAreas from "../icons/WaitingAreas";
import Police from "../icons/Police";
import Elevator from "../icons/Elevator";
import Bathroom from "../icons/Bathroom";

function StationServices({ ...props }) {
  const { station } = useMapContext();
  if (!station) {
    return null;
  }

  const {
    hasAccessibility,
    hasAirport,
    // @ts-ignore
    hasBarAndRestaurants,
    // @ts-ignore
    hasBathroom,
    // @ts-ignore
    hasBikeStorage,
    hasElevator,
    // @ts-ignore
    hasPolice,
    // @ts-ignore
    hasWaitingAreas,
    // hasZOB,
    // isRailReplacement,
  } = station.properties;

  return (
    <div {...props}>
      {hasAccessibility && <WheelChair />}
      {hasAirport && <Airport />}
      {hasBarAndRestaurants && <BarAndRestaurants />}
      {hasBathroom && <Bathroom />}
      {hasBikeStorage && <BikeStorage />}
      {hasElevator && <Elevator />}
      {hasPolice && <Police />}
      {hasWaitingAreas && <WaitingAreas />}
    </div>
  );
}

export default memo(StationServices);
