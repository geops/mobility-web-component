import type {
  RealtimeLine,
  RealtimeStopSequence,
  RealtimeTrajectory,
} from "mobility-toolbox-js/types";

import type { LnpLineInfo } from "./hooks/useLnp";

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
