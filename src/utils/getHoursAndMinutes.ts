/**
 * Returns a string representation of a number, with a zero if the number is lower than 10.
 * @ignore
 */
const pad = (integer: number) => {
  return integer < 10 ? `0${integer}` : integer;
};

/**
 * Returns a 'hh:mm' string from a time in ms.
 * @param {Number} timeInMs Time in milliseconds.
 * @ignore
 */
const getHoursAndMinutes = (timeInMs: number) => {
  if (!timeInMs || timeInMs <= 0) {
    return "";
  }
  const date = new Date(timeInMs);
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export default getHoursAndMinutes;
