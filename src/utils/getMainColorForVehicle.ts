import {
  RealtimeDeparture,
  RealtimeLine,
  RealtimeMot,
  RealtimeStopSequence,
  RealtimeTrajectory,
} from "mobility-toolbox-js/types";
import getBgColor from "./getBgColor";

// This function returns the main color of a line using a line, trajectory, stopsequence or departure object.
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
    color = getBgColor(type) || getBgColor("rail");
  }

  if (color && color[0] !== "#") {
    color = `#${color}`;
  }

  return color;
};
export default getMainColorForVehicle;
