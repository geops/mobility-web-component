import { RealtimeStopSequence } from "mobility-toolbox-js/types";

export interface StopStatus {
  isBoarding?: boolean;
  isCancelled?: boolean;
  isCloseToNextStop?: boolean;
  isFirst?: boolean;
  isInBetween?: boolean;
  isLast?: boolean;
  isLeft?: boolean;
  isNextStop?: boolean;
  isNotRealtime?: boolean;
  isNotStop?: boolean;
  isPassed?: boolean;
  progress?: number;
}

const getBasicStatus = (stop, currTime, previousStop, nextStop) => {
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
  const hasNoDelays =
    stop.arrivalDelay === null && stop.departureDelay === null;
  const isNotRealtime = stop.state === "TIME_BASED" || hasNoDelays;
  const isCancelled =
    stop.state === "JOURNEY_CANCELLED" || stop.state === "STOP_CANCELLED";
  const isBoarding = stop.state === "BOARDING";

  const isPassedBottom = currTime > bottomBoundary;

  const isLeft =
    stop.state === "LEAVING" ||
    (isNotRealtime && isPassedBottom) ||
    (isCancelled && isPassedBottom);

  return {
    bottomBoundary,
    isBoarding,
    isCancelled,
    isLeft,
    isNotRealtime,
    isNotStop,
    isPassedBottom,
    topBoundary,
  };
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
  const previousStopStatus =
    previousStop &&
    getBasicStatus(previousStop, currTime, stops[index - 2], stop);
  const basicStatus = getBasicStatus(stop, currTime, previousStop, nextStop);
  let { isLeft } = basicStatus;
  const {
    bottomBoundary,
    isBoarding,
    isCancelled,
    isNotRealtime,
    isNotStop,
    isPassedBottom,
    topBoundary,
  } = basicStatus;

  const isNextStop = !isLeft && (!previousStop || previousStopStatus.isLeft);

  // The future stop is the stop after a stop with state === "BOARDING"
  const isFutureStop = !isLeft && (!previousStop || !previousStopStatus.isLeft);

  let isCloseToNextStop = false;
  if (isNextStop) {
    const timeGap = (bottomBoundary - topBoundary) * 0.2; // 20% of the duration between 2 stops
    isCloseToNextStop = currTime > stop.arrivalTime - timeGap;
  }

  // Check if the stop has been passed
  // For SBAHNMW-298
  // Considerate the state ("LEAVING")
  // which is important if the data has not been updated for a long time
  let isPassed = isPassedBottom && !isNextStop && !isFutureStop;

  if (topBoundary < currTime && currTime < bottomBoundary && !isFutureStop) {
    progress = Math.round(
      ((currTime - topBoundary) * 100) / (bottomBoundary - topBoundary),
    );
  }

  // For SBAHNMW-298
  // Set the progress manually
  // if the data has not been updated for a long time.
  // These stops would have be passed if the data were up-to-date
  if (isPassedBottom && (isNextStop || isFutureStop)) {
    progress = 0;
  }

  // The first station is a special case because the top boundary starts at 50% of the div element.
  const isFirstStation = index === 0;

  if (isFirstStation) {
    progress = 50;
  }

  if (isBoarding) {
    // When the train has not left the first station the progress is 0.
    progress = 50;
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

  if (isPassed) {
    progress = 100;
  }

  return {
    isBoarding,
    isCancelled,
    isCloseToNextStop,
    isFirst: !previousStop,
    isInBetween: !isPassed && progress > 0,
    isLast: !nextStop,
    isLeft,
    isNextStop,
    isNotRealtime,
    isNotStop,
    isPassed,
    progress,
  };
};

export default getStopStatus;
