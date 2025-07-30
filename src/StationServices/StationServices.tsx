import { memo } from "preact/compat";

import Airport from "../icons/Airport";
import BarAndRestaurants from "../icons/BarAndRestaurants";
import Bathroom from "../icons/Bathroom";
import BikeStorage from "../icons/BikeStorage";
import Elevator from "../icons/Elevator";
import Police from "../icons/Police";
import WaitingAreas from "../icons/WaitingAreas";
import WheelChair from "../icons/WheelChair";

import type { RealtimeStation } from "mobility-toolbox-js/types";
import type { JSX, PreactDOMAttributes } from "preact";

export type StationServicesProps = {
  accessibility?: boolean;
  airport?: boolean;
  barAndRestaurants?: boolean;
  bathroom?: boolean;
  bikeStorage?: boolean;
  elevator?: boolean;
  iconProps?: JSX.HTMLAttributes<SVGElement> & PreactDOMAttributes;
  police?: boolean;
  station: RealtimeStation;
  waitingAreas?: boolean;
} & JSX.HTMLAttributes<HTMLDivElement> &
  PreactDOMAttributes;

function StationServices({
  accessibility = false,
  airport = false,
  barAndRestaurants = false,
  bathroom = false,
  bikeStorage = false,
  elevator = false,
  iconProps = {},
  police = false,
  station,
  waitingAreas = false,
  ...props
}: StationServicesProps) {
  if (!station) {
    return null;
  }

  const {
    hasAccessibility,
    hasAirport,
    // @ts-expect-error bad type definition
    hasBarAndRestaurants,
    // @ts-expect-error bad type definition
    hasBathroom,
    // @ts-expect-error bad type definition
    hasBikeStorage,
    hasElevator,
    // @ts-expect-error bad type definition
    hasPolice,
    // @ts-expect-error bad type definition
    hasWaitingAreas,
    // hasZOB,
    // isRailReplacement,
  } = station.properties;

  return (
    <div {...props}>
      {accessibility && hasAccessibility && <WheelChair {...iconProps} />}
      {airport && hasAirport && <Airport {...iconProps} />}
      {barAndRestaurants && hasBarAndRestaurants && (
        <BarAndRestaurants {...iconProps} />
      )}
      {bathroom && hasBathroom && <Bathroom {...iconProps} />}
      {bikeStorage && hasBikeStorage && <BikeStorage {...iconProps} />}
      {elevator && hasElevator && <Elevator {...iconProps} />}
      {police && hasPolice && <Police {...iconProps} />}
      {waitingAreas && hasWaitingAreas && <WaitingAreas {...iconProps} />}
    </div>
  );
}

export default memo(StationServices);
