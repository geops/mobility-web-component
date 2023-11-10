import getDelayString from "./getDelayString";

/**
 * This function returns the text displays near the vehicle.
 * We use getDelayString inside it to make sure that RouteSchedule and
 * the map have the same values.
 */
const getDelayTextForVehicle = (
  delayInMs: number,
  cancelled: boolean = false,
): string => {
  if (cancelled) {
    return String.fromCodePoint(0x00d7);
  }
  const delayString = getDelayString(delayInMs);
  if (delayString === "0") {
    return "";
  }
  return `+${delayString}`;
};
export default getDelayTextForVehicle;
