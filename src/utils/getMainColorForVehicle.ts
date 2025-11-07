import { realtimeStyleUtils } from "mobility-toolbox-js/ol";

import type {
  RealtimeDeparture,
  RealtimeLine,
  RealtimeMot,
  RealtimeStopSequence,
  RealtimeTrajectory,
} from "mobility-toolbox-js/types";

/**
 * Return the color depending on an object representing a vehicle or a line.
 * This function is used to have the same color on the map and on other components.
 */
const getMainColorForVehicle = (object: unknown = null): string => {
  let color =
    (object as RealtimeTrajectory)?.properties?.line?.color ||
    // @ts-expect-error bad type definition
    (object as RealtimeStopSequence)?.line?.color ||
    (object as RealtimeLine)?.color;

  if (!color) {
    let type: RealtimeMot =
      (object as RealtimeTrajectory)?.properties?.type ||
      (object as RealtimeStopSequence)?.type;

    if (!type) {
      let typeNumber: number = (object as RealtimeStopSequence)?.vehicleType;

      if (!Number.isFinite(typeNumber)) {
        typeNumber = (object as RealtimeDeparture)?.train_type;
      }

      if (Number.isFinite(typeNumber)) {
        type = typeNumber as unknown as RealtimeMot;
      } else {
        type = "rail";
      }
    }
    color =
      realtimeStyleUtils.getColorForType(type) ||
      realtimeStyleUtils.getColorForType("rail");
  }

  if (color && !color.startsWith("#")) {
    color = `#${color}`;
  }

  return color;
};
export default getMainColorForVehicle;
