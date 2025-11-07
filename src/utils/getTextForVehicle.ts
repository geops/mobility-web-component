import type {
  RealtimeLine,
  RealtimeStopSequence,
  RealtimeTrajectory,
} from "mobility-toolbox-js/types";

import type { LnpLineInfo } from "./hooks/useLnp";

/**
 * Return the text depending on an object representing a vehicle or a line.
 * This function is used to have the same text on the map and on other components.
 */
const getTextForVehicle = (object: unknown = ""): string => {
  const name =
    (object as RealtimeTrajectory)?.properties?.line?.name ||
    // @ts-expect-error bad type definition
    (object as RealtimeStopSequence)?.line?.name ||
    (object as RealtimeLine)?.name ||
    (object as LnpLineInfo)?.short_name ||
    (object as string) ||
    "";

  return name;
};

export default getTextForVehicle;
