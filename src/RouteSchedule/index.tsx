import type { PreactDOMAttributes, JSX } from "preact";
import { RealtimeLayer, realtimeConfig } from "mobility-toolbox-js/ol";
import { useContext, useEffect, useRef, useState } from "preact/hooks";
import { I18nContext } from "../MobilityMap";
import type {
  RealtimeStation,
  RealtimeStop,
  RealtimeStopSequence,
} from "mobility-toolbox-js/types";

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
export const getDelayString = (delayInMs) => {
  let timeInMs = delayInMs;
  if (timeInMs < 0) {
    timeInMs = 0;
  }
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
 * Returns if the station has already been passed by the vehicle.
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

const RouteStop = ({
  lineInfos,
  onStationClick,
  trackerLayer,
  stop,
  idx,
  t,
}) => {
  const {
    arrivalDelay,
    departureDelay,
    platform,
    state,
    stationName,
    aimedArrivalTime,
    aimedDepartureTime,
  } = stop;
  const { stations, type, stroke, vehicleType } = lineInfos;
  const [isStationPassed, setIsStationPassed] = useState(false);
  const cancelled = state === "JOURNEY_CANCELLED" || state === "STOP_CANCELLED";
  const color = stroke || getBgColor(type || vehicleType);
  const isFirstStation = idx === 0;
  const isLastStation = idx === stations.length - 1;
  const isInTransit =
    (stations[idx - 1] &&
      isPassed(stations[idx - 1], trackerLayer.time, stations, idx - 1) !==
        isStationPassed) ||
    (stations[idx + 1] &&
      isPassed(stations[idx + 1], trackerLayer.time, stations, idx + 1) !==
        isStationPassed)
      ? true
      : false;
  const isNotRealtime = arrivalDelay === null;
  const hideDelay =
    isNotRealtime ||
    isFirstStation ||
    cancelled ||
    isNotStop(stop) ||
    isStationPassed;

  useEffect(() => {
    let timeout = null;

    const isStopPassed = isPassed(stop, trackerLayer.time, stations, idx);
    setIsStationPassed(isStopPassed);

    // We have to refresh the stop when the state it's time_based
    if (stop.state === "TIME_BASED" && !isStopPassed) {
      timeout = setInterval(() => {
        setIsStationPassed(isPassed(stop, trackerLayer.time, stations, idx));
      }, 20000);
    }
    return () => {
      clearInterval(timeout);
    };
  }, [stop, trackerLayer, stations, idx]);

  console.log(lineInfos);

  return (
    <button
      className={`w-full flex items-center hover:bg-slate-100 rounded scroll-mt-[50px] text-left ${
        isStationPassed ? "text-gray-500" : "text-gray-600"
      }`}
      data-station-passed={isStationPassed} // Use for auto scroll
      onClick={(e) => onStationClick(stop, e)}
    >
      <div className="flex flex-col w-10 flex-shrink-0 items-start justify-center text-xs ml-4">
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
      <div className="flex flex-col w-7 flex-shrink-0 justify-center text-xs">
        {arrivalDelay === null || hideDelay || isFirstStation ? (
          ""
        ) : (
          <span className={getDelayColor(arrivalDelay)}>
            {`+${getDelayString(arrivalDelay)}`}
          </span>
        )}
        {departureDelay === null || hideDelay || isLastStation ? (
          ""
        ) : (
          <span className={getDelayColor(departureDelay)}>
            {`+${getDelayString(departureDelay)}`}
          </span>
        )}
      </div>
      <div className="flex flex-shrink-0 items-center justify-center w-8">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="58"
          viewBox="0 0 14 58"
          fill="none"
          className={isStationPassed ? "stroke-gray-400" : null}
          // The tailwind css class stroke-[${color}] does not work
          stroke={isStationPassed ? undefined : color}
        >
          <circle
            cx="7"
            cy="29"
            r="5"
            fill="white"
            stroke-width="6"
            stroke="black"
          />
          <line
            x1="7"
            y1={
              isFirstStation
                ? "29"
                : isInTransit && !isStationPassed
                ? "0"
                : "0"
            }
            x2="7"
            y2={
              isLastStation
                ? "29"
                : isInTransit && isStationPassed
                ? "58"
                : "58"
            }
            stroke-width="6"
            stroke="black"
          />
          <line
            x1="7"
            y1={
              isFirstStation
                ? "29"
                : isInTransit && !isStationPassed
                ? "0"
                : "0"
            }
            x2="7"
            y2={
              isLastStation
                ? "29"
                : isInTransit && isStationPassed
                ? "58"
                : "58"
            }
            stroke-width="4"
          />
          <circle cx="7" cy="29" r="5" fill="white" stroke-width="4" />
          <circle
            cx="7"
            cy="29"
            r="3"
            fill="white"
            stroke-width="1"
            stroke="black"
          />
        </svg>
      </div>
      <div
        className={`flex text-sm font-medium pr-2 justify-between flex-grow ${
          cancelled ? "text-red-600 line-through" : ""
        } ${isStationPassed ? "" : "text-black"}`}
      >
        <div className="">
          <div>{stationName}</div>
          {platform ? (
            <span
              className={`${
                isStationPassed ? "bg-slate-100" : "bg-slate-200"
              } rounded-sm text-xs py-px px-0.5 group-hover:bg-slate-50`}
            >
              {t(`depature_${type}`)} {platform}
            </span>
          ) : null}
        </div>
        {/* {isInTransit && (
          <a
            href="#"
            className="bg-slate-200 hover:bg-slate-300 rounded-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <SEVIcon />
          </a>
        )} */}
      </div>
    </button>
  );
};

const renderStation = (props) => {
  const { stationId, arrivalTime, departureTime, stationName } = props.stop;
  // eslint-disable-next-line react/jsx-props-no-spreading
  return (
    <RouteStop
      // Train line can go in circle so begin and end have the same id,
      // using the time in the key should fix the issue.
      key={(stationId || stationName) + arrivalTime + departureTime}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    />
  );
};

const renderRouteIdentifier = ({ routeIdentifier, longName }) => {
  if (routeIdentifier) {
    // first part of the id, without leading zeros.
    console.log(routeIdentifier, longName);
    let id = routeIdentifier;

    if (/\./.test(routeIdentifier)) {
      id = routeIdentifier.split(".")[0];
    } else if (/\_/.test(routeIdentifier)) {
      id = routeIdentifier.split("_")[0];
    } else if (/\:/.test(routeIdentifier)) {
      id = routeIdentifier.split(":")[0];
    }

    if (/^\d*$/.test(id)) {
      id = parseInt(id, 10) + "";
    }

    if (!longName.includes(id)) {
      return ` (${id})`;
    }
  }
  return null;
};

const renderHeader = (props) => {
  const { lineInfos, isFollowing, onFollowButtonClick } = props;
  const {
    type,
    vehicleType,
    shortName,
    longName,
    stroke,
    destination,
    text_color: textColor,
  } = lineInfos;
  const backgroundColor = stroke || getBgColor(type || vehicleType);
  const color = textColor || "black";
  return (
    <div className="bg-slate-100 p-4 flex gap-x-4 items-center">
      <span
        className="border-2 border-black rounded-full font-bold text-sm h-9 min-w-[2.25rem] px-1 flex items-center justify-center"
        style={{
          backgroundColor,
          color,
        }}
      >
        {shortName}
      </span>
      <div className="flex-grow flex flex-col">
        <span className="font-bold">{destination}</span>
        <span className="text-sm">
          {longName}
          {renderRouteIdentifier(lineInfos)}
        </span>
      </div>
      <button
        className={`flex flex-none bg-white shadow-lg rounded-full w-[38px] h-[38px] items-center justify-center p-1.5 ${
          isFollowing ? "animate-pulse" : ""
        }`}
        style={{
          /* stylelint-disable-next-line value-keyword-case */
          backgroundColor: isFollowing ? backgroundColor : "white",
          color: isFollowing ? color : "black",
        }}
        onClick={onFollowButtonClick}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          part="svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            fill="currentColor"
            d="M7 0.333344C7.375 0.333344 7.66667 0.62501 7.66667 0.97921V2.35414C9.7292 2.66668 11.3333 4.27081 11.625 6.33334H13C13.375 6.33334 13.6667 6.62501 13.6667 7.00001C13.6667 7.37501 13.375 7.66668 13 7.66668H11.625C11.3333 9.70834 9.70833 11.3333 7.66667 11.625V13C7.66667 13.375 7.375 13.6667 7 13.6667C6.64587 13.6667 6.33333 13.375 6.33333 13V11.625C4.29167 11.3333 2.68747 9.70834 2.39587 7.66668H1C0.625 7.66668 0.333333 7.37501 0.333333 7.00001C0.333333 6.62501 0.625 6.33334 1 6.33334H2.39587C2.68747 4.27081 4.29167 2.66668 6.33333 2.35414V0.97921C6.33333 0.62501 6.64587 0.333344 7 0.333344ZM7 3.66668C5.16667 3.66668 3.66667 5.16668 3.66667 7.00001C3.66667 8.79168 5.08333 10.3125 7 10.3125C8.89587 10.3125 10.3333 8.81254 10.3333 7.00001C10.3333 5.16668 8.83333 3.66668 7 3.66668Z"
          />
          <path
            part="circle"
            fill-rule="evenodd"
            clip-rule="evenodd"
            fill="currentColor"
            d="M5.66667 7.00001C5.66667 6.27081 6.2708 5.66668 7 5.66668C7.7292 5.66668 8.33333 6.27081 8.33333 7.00001C8.33333 7.72921 7.7292 8.33334 7 8.33334C6.2708 8.33334 5.66667 7.72921 5.66667 7.00001Z"
          ></path>
        </svg>
      </button>
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
      <div className="m-4 mb-0 text-sm text-gray-500  flex flex-wrap ">
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
      <div className="bg-gradient-to-b from-transparent to-white h-8 sticky bottom-0 w-full pointer-events-none" />
    </>
  );
};

const defaultRenderLink = (text, url) => {
  return url ? (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="underline whitespace-normal"
    >
      {text}
    </a>
  ) : (
    <>{text}</>
  );
};

export type RouteScheduleProps = PreactDOMAttributes &
  JSX.HTMLAttributes<HTMLDivElement> & {
    isFollowing: boolean;
    lineInfos: RealtimeStopSequence;
    onFollowButtonClick: (event: MouseEvent) => void;
    onStationClick: (station: RealtimeStop, event: MouseEvent) => void;
    trackerLayer: RealtimeLayer;
  };

export default function RouteSchedule(props: RouteScheduleProps) {
  const { t } = useContext(I18nContext);
  const ref = useRef();

  if (!props.lineInfos) {
    return null;
  }

  useEffect(() => {
    let timeout = null;
    const interval = window.setInterval(() => {
      const elt = ref.current as HTMLDivElement;
      if (!elt) {
        return;
      }

      const nextStation = elt.querySelector("[data-station-passed=false]");
      if (nextStation) {
        nextStation.scrollIntoView({
          behavior: "smooth",
        });
      }
      clearInterval(interval);
    }, 300);
    return () => {
      clearTimeout(interval);
    };
    // Scroll automatically when a new scroll infos is set.
  }, [props.lineInfos]);

  return (
    <>
      {renderHeader({ ...props })}
      <div ref={ref} className={props.className}>
        {props.lineInfos.stations.map((stop: RealtimeStop, idx) => {
          return renderStation({ ...props, stop, idx, t });
        })}
        {renderFooter({ ...props })}
      </div>
    </>
  );
}
