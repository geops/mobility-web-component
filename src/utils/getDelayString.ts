/**
 * Returns a string representing a delay.
 * @param {Number} timeInMs Delay time in milliseconds.
 * @ignore
 */
const getDelayString = (delayInMs?: null | number) => {
  let timeInMs = delayInMs ?? 0;
  if (timeInMs < 0) {
    timeInMs = 0;
  }
  const h = Math.floor(timeInMs / 3600000);
  const m = Math.round((timeInMs % 3600000) / 60000);
  // const s = Math.floor(((timeInMs % 3600000) % 60000) / 1000);

  let str = "";
  if (h > 0) {
    str += `${h}h`;
  }
  if (m > 0) {
    str += `${m}m`;
  }
  // if (s > 0) {
  //   str += `${s}s`;
  // }
  return str || "0";
};

export default getDelayString;
