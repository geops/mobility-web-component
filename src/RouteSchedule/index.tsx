import { realtimeConfig } from "mobility-toolbox-js/ol";

/**
 * Returns a string representation of a number, with a zero if the number is lower than 10.
 * @ignore
 */
const pad = (integer) => {
  return integer < 10 ? `0${integer}` : integer;
};

/**
 * Returns a 'hh:mm' string from a time in ms.
 * @param {Number} timeInMs Time in milliseconds.
 * @ignore
 */
const getHoursAndMinutes = (timeInMs) => {
  if (!timeInMs || timeInMs <= 0) {
    return "";
  }
  const date = new Date(timeInMs);
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

/**
 * Returns a string representing a delay.
 * @param {Number} timeInMs Delay time in milliseconds.
 * @ignore
 */
export const getDelayString = (timeInMs) => {
  const h = Math.floor(timeInMs / 3600000);
  const m = Math.floor((timeInMs % 3600000) / 60000);
  const s = Math.floor(((timeInMs % 3600000) % 60000) / 1000);

  if (s === 0 && h === 0 && m === 0) {
    return "0";
  }
  if (s === 0 && h === 0) {
    return `${m}m`;
  }
  if (s === 0) {
    return `${h}h${m}m`;
  }
  if (m === 0 && h === 0) {
    return `${s}s`;
  }
  if (h === 0) {
    return `${m}m${s}s`;
  }
  return `${h}h${m}m${s}s`;
};

const { getBgColor } = realtimeConfig;

/**
 * Returns a color class to display the delay.
 * @param {Number} time Delay time in milliseconds.
 */
const getDelayColor = (time) => {
  const secs = Math.round(((time / 1800 / 2) * 3600) / 1000);
  if (secs >= 3600) {
    return "text-red-600";
  }
  if (secs >= 500) {
    return "text-orange-600";
  }
  if (secs >= 300) {
    return "text-amber-600";
  }
  if (secs >= 180) {
    return "text-yellow-600";
  }
  return "text-green-600";
};

/**
 * Returns true if the train doesn't stop to the station.
 * @param {Object} stop Station information.
 */
const isNotStop = (stop) => {
  return !stop.arrivalTime && !stop.departureTime;
};

/**
 * Returns if the station has already been passed by the vehicule.
 * @param {Object} stop Station information.
 * @param {number} time The current time to test in ms.
 * @param {Array<Object>} stops the list of all stops of the train.
 * @param {idx} idx The index of the stop object in the stops array.
 */
const isPassed = (stop, time, stops, idx) => {
  // If the train doesn't stop to the stop object, we test if the stop just before has been passed or not.
  // if yes the current stop is considered as passed.
  if (isNotStop(stop)) {
    if (stops[idx - 1] && idx > 0) {
      return isPassed(stops[idx - 1], time, stops, idx);
    }
    return true;
  }

  // Sometimes stop.departureDelay is undefined.
  const timeToCompare = stop.aimedDepartureTime || stop.aimedArrivalTime || 0;
  const delayToCompare = stop.departureDelay || stop.arrivalDelay || 0;
  return timeToCompare + delayToCompare <= time;
};

const renderStation = ({
  lineInfos,
  onStationClick,
  trackerLayer,
  stop,
  idx,
}) => {
  const {
    stationId,
    arrivalDelay,
    departureDelay,
    arrivalTime,
    departureTime,
    state,
    stationName,
    aimedArrivalTime,
    aimedDepartureTime,
  } = stop;
  const cancelled = state === "JOURNEY_CANCELLED" || state === "STOP_CANCELLED";
  const { stations } = lineInfos;
  const isFirstStation = idx === 0;
  const isLastStation = idx === stations.length - 1;
  const isStationPassed = isPassed(stop, trackerLayer.time, stations, idx);
  const isInTransit =
    (stations[idx - 1] &&
      isPassed(stations[idx - 1], trackerLayer.time, stations, idx - 1) !==
        isStationPassed) ||
    (stations[idx + 1] &&
      isPassed(stations[idx + 1], trackerLayer.time, stations, idx + 1) !==
        isStationPassed)
      ? true
      : false;
  const hideDelay =
    typeof arrivalDelay === "undefined" ||
    isFirstStation ||
    cancelled ||
    isNotStop(stop) ||
    isStationPassed;

  return (
    <div
      // Train line can go in circle so begin and end have the same id,
      // using the time in the key should fix the issue.
      key={(stationId || stationName) + arrivalTime + departureTime}
      role="button"
      className={`flex hover:bg-slate-100 rounded m-1 ${
        isStationPassed ? "text-gray-500" : "text-gray-600"
      }`}
      onClick={(e) => onStationClick(stop, e)}
      tabIndex={0}
      onKeyPress={(e) => e.which === 13 && onStationClick(stop, e)}
    >
      <div className="flex flex-col w-14 items-center justify-center text-xs ml-2">
        <span
          className={`${cancelled ? "text-red-600 line-through" : ""} ${
            isFirstStation ? "hidden" : ""
          }`}
        >
          {getHoursAndMinutes(aimedArrivalTime)}
        </span>
        <span
          className={`${cancelled ? "text-red-600 line-through" : ""} ${
            isLastStation ? "hidden" : ""
          }`}
        >
          {getHoursAndMinutes(aimedDepartureTime)}
        </span>
      </div>
      <div className="flex flex-col w-7 justify-center text-xs">
        {hideDelay || isFirstStation ? (
          ""
        ) : (
          <span className={getDelayColor(arrivalDelay)}>
            {`+${getDelayString(arrivalDelay)}`}
          </span>
        )}
        {hideDelay || isLastStation ? (
          ""
        ) : (
          <span className={getDelayColor(departureDelay)}>
            {`+${getDelayString(departureDelay)}`}
          </span>
        )}
      </div>
      <div className="flex items-center justify-center w-6 -my-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="58"
          viewBox="0 0 14 58"
          fill="none"
          className={isStationPassed ? "stroke-gray-400" : "stroke-black"}
        >
          <line
            x1="7"
            y1={
              isFirstStation
                ? "29"
                : isInTransit && !isStationPassed
                ? "3"
                : "0"
            }
            x2="7"
            y2={
              isLastStation
                ? "29"
                : isInTransit && isStationPassed
                ? "55"
                : "58"
            }
            stroke-width="4"
          />
          <circle cx="7" cy="29" r="5" fill="white" stroke-width="4" />
        </svg>
      </div>
      <div
        className={`flex items-center text-sm font-medium pr-4 ${
          cancelled ? "text-red-600 line-through" : ""
        } ${isStationPassed ? "" : "text-black"}`}
      >
        <span>{stationName}</span>
      </div>
    </div>
  );
};

const renderRouteIdentifier = ({ routeIdentifier, longName }) => {
  if (routeIdentifier) {
    // first part of the id, without leading zeros.
    const id = parseInt(routeIdentifier.split(".")[0], 10);
    if (!longName.includes(id)) {
      return ` (${id})`;
    }
  }
  return null;
};

const renderHeader = ({ lineInfos }) => {
  const {
    type,
    vehicleType,
    shortName,
    longName,
    stroke,
    destination,
    text_color: textColor,
  } = lineInfos;
  return (
    <div className="bg-slate-100 p-4 flex space-x-4 items-center">
      <span
        className="p-2 border-2 border-black rounded-full font-bold text-sm"
        style={{
          /* stylelint-disable-next-line value-keyword-case */
          backgroundColor: stroke || getBgColor(type || vehicleType),
          color: textColor || "black",
        }}
      >
        {shortName}
      </span>
      <div className="flex flex-col">
        <span className="font-bold">{destination}</span>
        <span className="text-sm">
          {longName}
          {renderRouteIdentifier(lineInfos)}
        </span>
      </div>
    </div>
  );
};

const renderFooter = (props) => {
  const { lineInfos } = props;
  if (!lineInfos.operator && !lineInfos.publisher) {
    return null;
  }
  return (
    <>
      <div className="-mb-4 text-center text-sm text-gray-500 pt-2 px-2 break-all ">
        {lineInfos.operator &&
          defaultRenderLink(lineInfos.operator, lineInfos.operatorUrl)}
        {lineInfos.operator && lineInfos.publisher && (
          <span>&nbsp;-&nbsp;</span>
        )}
        {lineInfos.publisher &&
          defaultRenderLink(lineInfos.publisher, lineInfos.publisherUrl)}
        {lineInfos.license && <span>&nbsp;(</span>}
        {lineInfos.license &&
          defaultRenderLink(lineInfos.license, lineInfos.licenseUrl)}
        {lineInfos.license && ")"}
      </div>
      <div className="bg-gradient-to-b from-transparent to-white h-12 sticky bottom-0 w-full pointer-events-none" />
    </>
  );
};

const defaultRenderLink = (text, url) => {
  return url ? (
    <a href={url} target="_blank" rel="noreferrer" className="underline">
      {text}
    </a>
  ) : (
    <>{text}</>
  );
};

export default function RouteSchedule(props) {
  const { lineInfos } = props;

  if (!lineInfos) {
    return null;
  }

  return (
    <>
      <div className="absolute left-4 z-20 top-4 bottom-4 overflow-x-hidden overflow-y-scroll border-2 bg-white border-gray-800">
        {renderHeader({ ...props })}
        {lineInfos.stations.map((stop, idx) => {
          return renderStation({ ...props, stop, idx });
        })}
        {renderFooter({ ...props })}
      </div>
    </>
  );
}
