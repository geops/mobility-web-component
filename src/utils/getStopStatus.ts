import { RealtimeStopSequence } from "mobility-toolbox-js/types";

export type StopStatus = {
  isInBetween?: boolean;
  isCancelled?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
  isPassed?: boolean;
  isLeft?: boolean;
  isNotRealtime?: boolean;
  isNotStop?: boolean;
  isBoarding?: boolean;
  isNextStop?: boolean;
  isCloseToNextStop?: boolean;
  progress?: number;
};

/**
 * This function provide an object with some informations about the status of the vehicle for this station.
 * If the vehicul has already passed the sattion how far is it from the station, ...
 */
const getStopStatus = (
  stopSequence: RealtimeStopSequence,
  index: number,
): StopStatus => {
  const { stations: stops } = stopSequence;
  let progress = 0;
  const previousStop = stops[index - 1];
  const stop = stops[index];
  const nextStop = stops[index + 1];

  if (!stop) {
    return {};
  }

  const currTime = Date.now();
  let topBoundary = stop.arrivalTime;
  let bottomBoundary = stop.arrivalTime;

  if (previousStop) {
    topBoundary =
      stop.arrivalTime - (stop.arrivalTime - previousStop.arrivalTime) / 2;
  }
  if (nextStop) {
    bottomBoundary =
      stop.arrivalTime + (nextStop.arrivalTime - stop.arrivalTime) / 2;
  }

  const isNotStop = !stop.arrivalTime && !stop.departureTime;
  const isNotRealtime =
    stop.arrivalDelay === null || stop.state === "TIME_BASED";
  const isCancelled =
    stop.state === "JOURNEY_CANCELLED" || stop.state === "STOP_CANCELLED";
  const isBoarding = stop.state === "STATE_BOARDING";

  let isLeft =
    stop.state === "LEAVING" ||
    (stop.state === "TIME_BASED" && currTime > bottomBoundary) ||
    (isCancelled && currTime > bottomBoundary);

  const isNextStop =
    !isLeft && (!previousStop || previousStop.state === "LEAVING");

  const isFutureStop =
    !isLeft && (!previousStop || previousStop.state !== "LEAVING");

  let isCloseToNextStop = false;
  if (isNextStop) {
    const timeGap = (bottomBoundary - topBoundary) * 0.2; // 20% of the duration between 2 stops
    isCloseToNextStop = currTime > stop.arrivalTime - timeGap;
  }

  // Check if the stop has been passed
  // For SBAHNMW-298
  // Considerate the state ("LEAVING")
  // which is important if the data has not been updated for a long time
  let isPassed = currTime > bottomBoundary && !isNextStop && !isFutureStop;

  if (topBoundary < currTime && currTime < bottomBoundary && !isFutureStop) {
    progress = Math.round(
      ((currTime - topBoundary) * 100) / (bottomBoundary - topBoundary),
    );
  }

  // For SBAHNMW-298
  // Set the progress manually
  // if the data has not been updated for a long time.
  // These stops would have be passed if the data were up-to-date
  if (currTime > bottomBoundary && (isNextStop || isFutureStop)) {
    progress = 0;
  }

  // The first station is a special case because the top boundary starts at 50% of the div element.
  const isFirstStation = index === 0;

  if (isBoarding) {
    // When the train has not left the first station the progress is 0.
    progress = isFirstStation ? 0 : 50;
  } else if (
    !isFirstStation &&
    ((isLeft && progress < 50) || (!isLeft && progress > 50))
  ) {
    // Here we ensure that isLeft and progress values are properly synced
    // It doesn't apply to the the first station.
    progress = 50;
  }

  // For SBAHNMW-210
  // If some data (arrivalTime or state) from backend are wrong, 2 stops have the progress bar.
  // So to avoid double progress display, we force the isPassed value to true.
  if (progress > 50 && getStopStatus(stopSequence, index + 1).progress > 0) {
    progress = 100;
    isLeft = true;
    isPassed = true;
  }

  return {
    isInBetween: !isPassed && progress > 0,
    isCancelled,
    isFirst: !previousStop,
    isLast: !nextStop,
    isPassed,
    isLeft,
    isNotRealtime,
    isNotStop,
    isBoarding,
    isNextStop,
    isCloseToNextStop,
    progress,
  };
};

export default getStopStatus;
