import getDelayColor from "./getDelayColor";

/**
 * @private
 * @param {number} delayInMs Delay in milliseconds.
 * @param {boolean} cancelled true if the journey is cancelled.
 * @param {boolean} isDelayText true if the color is used for delay text of the symbol.
 */
const getDelayColorForVehicle = (
  delayInMs: null | number,
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
