import getDelayColor from "./getDelayColor";

import type { ViewState } from "mobility-toolbox-js/types";

/**
 * Return the delay color depending on an object representing a vehicle or a line.
 * This function is used to have the same color on the map and on other components.
 */
const getDelayColorForVehicle = (
  object?: unknown,
  viewState?: ViewState,
  delayInMs?: number,
  cancelled?: boolean,
  isDelayText?: boolean,
): string => {
  if (cancelled) {
    return isDelayText
      ? "#dc2626" // "text-red-600";
      : "#a0a0a0"; // gray
  }
  if (delayInMs === null) {
    return "#a0a0a0";
  }
  return getDelayColor(delayInMs);
};

export default getDelayColorForVehicle;
