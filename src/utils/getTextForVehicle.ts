import {
  RealtimeLine,
  RealtimeStopSequence,
  RealtimeTrajectory,
} from "mobility-toolbox-js/types";

// @ts-ignore
const getTextForVehicle = (object: any = ""): string => {
  const name =
    (object as RealtimeTrajectory)?.properties?.line?.name ||
    // @ts-ignore
    (object as RealtimeStopSequence)?.line?.name ||
    (object as RealtimeLine)?.name ||
    (object as string) ||
    "";

  return name;
};

export default getTextForVehicle;
