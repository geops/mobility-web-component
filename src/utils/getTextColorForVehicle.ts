import { realtimeConfig } from "mobility-toolbox-js/ol";

import type {
  RealtimeDeparture,
  RealtimeLine,
  RealtimeStopSequence,
  RealtimeTrajectory,
} from "mobility-toolbox-js/types";

import type { LnpLineInfo } from "./hooks/useLnp";

const getTextColorForVehicle = (object: unknown) => {
  const textColor =
    (object as LnpLineInfo | RealtimeLine).text_color ||
    (object as RealtimeDeparture | RealtimeStopSequence).line?.text_color ||
    (object as RealtimeTrajectory).properties?.line?.text_color;

  if (textColor) {
    return textColor;
  }

  const type =
    (object as RealtimeStopSequence).type ||
    (object as RealtimeTrajectory).properties?.type;

  return realtimeConfig.getTextColorForType(type);
};

export default getTextColorForVehicle;
