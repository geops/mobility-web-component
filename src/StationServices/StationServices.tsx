import type { PreactDOMAttributes, JSX } from "preact";
import { memo } from "preact/compat";
import { RealtimeStation } from "mobility-toolbox-js/types";
import WheelChair from "../icons/WheelChair";
import Airport from "../icons/Airport";
import BarAndRestaurants from "../icons/BarAndRestaurants";
import BikeStorage from "../icons/BikeStorage";
import WaitingAreas from "../icons/WaitingAreas";
import Police from "../icons/Police";
import Elevator from "../icons/Elevator";
import Bathroom from "../icons/Bathroom";

export type StationServicesProps = PreactDOMAttributes &
  JSX.HTMLAttributes<HTMLDivElement> & {
    station: RealtimeStation;
    accessibility?: boolean;
    airport?: boolean;
    barAndRestaurants?: boolean;
    bathroom?: boolean;
    bikeStorage?: boolean;
    elevator?: boolean;
    police?: boolean;
    waitingAreas?: boolean;
  };

function StationServices({
  station,
  accessibility = false,
  airport = false,
  barAndRestaurants = false,
  bathroom = false,
  bikeStorage = false,
  elevator = false,
  police = false,
  waitingAreas = false,
  ...props
}: StationServicesProps) {
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
      {accessibility && hasAccessibility && <WheelChair />}
      {airport && hasAirport && <Airport />}
      {barAndRestaurants && hasBarAndRestaurants && <BarAndRestaurants />}
      {bathroom && hasBathroom && <Bathroom />}
      {bikeStorage && hasBikeStorage && <BikeStorage />}
      {elevator && hasElevator && <Elevator />}
      {police && hasPolice && <Police />}
      {waitingAreas && hasWaitingAreas && <WaitingAreas />}
    </div>
  );
}

export default memo(StationServices);
