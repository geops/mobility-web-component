/**
 * Returns a color class to display the delay.
 * @param {Number} time Delay time in milliseconds.
 */
const getDelayColor = (timeInMs: number) => {
  // we use rounded value to fit the getDelayString method.
  const minutes = Math.round(timeInMs / 1000 / 60);
  // if (minutes >= 60) {
  // }
  if (minutes >= 10) {
    return "#dc2626"; // "text-red-600";
  }
  if (minutes >= 5) {
    return "#ea580c"; // "text-orange-600";
    // return "#d97706"; // "text-amber-600";
  }
  if (minutes >= 3) {
    return "#ca8a04"; // "text-yellow-600";
  }
  return "#16a34a"; // "text-green-600";
};

export default getDelayColor;
