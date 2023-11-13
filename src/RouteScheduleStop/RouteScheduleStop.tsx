import { useContext, useEffect, useState } from "preact/hooks";
import type { RealtimeStop } from "mobility-toolbox-js/types";
import { memo } from "preact/compat";
import useMapContext from "../utils/hooks/useMapContext";
import getHoursAndMinutes from "../utils/getHoursAndMinutes";
import getDelayColor from "../utils/getDelayColor";
import getDelayString from "../utils/getDelayString";
import I18nContext, { UseI18NContextType } from "../I18NContext";
import getBgColor from "../utils/getBgColor";
import DebugStop from "../DebugStop/DebugStop";

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
const isPassed = (
  stop: RealtimeStop,
  time: number,
  stops: RealtimeStop[],
  idx: number,
) => {
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

export type RouteScheduleStopProps = {
  stop: RealtimeStop & {
    platform: string;
  };
  idx: number;
  invertColor: boolean;
};

function RouteScheduleStop({
  stop,
  idx,
  invertColor = false,
}: RouteScheduleStopProps) {
  const { t } = useContext(I18nContext) as unknown as UseI18NContextType;
  const { lineInfos, map, realtimeLayer: trackerLayer } = useMapContext();
  const {
    arrivalDelay,
    // eslint-disable-next-line
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

  // Keep this code may be we will need it
  // const isInTransit = !!(
  //   (stations[idx - 1] &&
  //     isPassed(stations[idx - 1], trackerLayer.time, stations, idx - 1) !==
  //       isStationPassed) ||
  //   (stations[idx + 1] &&
  //     isPassed(stations[idx + 1], trackerLayer.time, stations, idx + 1) !==
  //       isStationPassed)
  // );
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

  const y1 = isFirstStation ? "29" : "0";
  const y2 = isLastStation ? "29" : "58";

  const colorSchemeGreyOut = {
    textColor: "text-gray-500",
    svgClassName: "stroke-gray-400",
    svgStroke: undefined,
    nameTextColor: "",
    platformBgColor: "bg-slate-100",
  };

  const colorSchemeNormal = {
    textColor: "text-gray-600",
    svgClassName: null,
    svgStroke: color,
    nameTextColor: "text-black",
    platformBgColor: "bg-slate-200",
  };

  let colorScheme = isStationPassed ? colorSchemeGreyOut : colorSchemeNormal;

  if (invertColor) {
    colorScheme = isStationPassed ? colorSchemeNormal : colorSchemeGreyOut;
  }

  return (
    <div>
      <button
        type="button"
        // max-h-[58px] because the svg showing the progress is 58px height.
        className={`max-h-[58px] w-full flex items-center hover:bg-slate-100 rounded scroll-mt-[50px] text-left ${colorScheme.textColor}`}
        data-station-passed={isStationPassed} // Use for auto scroll
        onClick={() => {
          if (stop.coordinate) {
            map.getView().animate({
              zoom: map.getView().getZoom(),
              center: [stop.coordinate[0], stop.coordinate[1]],
            });
          }
        }}
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
        <div className="flex flex-col w-8 flex-shrink-0 justify-center text-[0.6rem]">
          {arrivalDelay === null || hideDelay || isFirstStation ? (
            ""
          ) : (
            <span style={{ color: getDelayColor(arrivalDelay) }}>
              {`+${getDelayString(arrivalDelay)}`}
            </span>
          )}
          {departureDelay === null || hideDelay || isLastStation ? (
            ""
          ) : (
            <span style={{ color: getDelayColor(arrivalDelay) }}>
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
            className={colorScheme.svgClassName}
            // The tailwind css class stroke-[${color}] does not work
            stroke={colorScheme.svgStroke}
          >
            <circle
              cx="7"
              cy="29"
              r="5"
              fill="white"
              strokeWidth="6"
              stroke="black"
            />
            <line
              x1="7"
              y1={y1}
              x2="7"
              y2={y2}
              strokeWidth="6"
              stroke="black"
            />
            <line x1="7" y1={y1} x2="7" y2={y2} strokeWidth="4" />
            <circle cx="7" cy="29" r="5" fill="white" strokeWidth="4" />
            <circle
              cx="7"
              cy="29"
              r="3"
              fill="white"
              strokeWidth="1"
              stroke="black"
            />
          </svg>
        </div>
        <div
          className={`flex text-sm font-medium pr-2 justify-between flex-grow ${
            cancelled ? "text-red-600 line-through" : ""
          } ${colorScheme.nameTextColor}`}
        >
          <div className="">
            <div>{stationName}</div>
            {platform ? (
              <span
                className={`${colorScheme.platformBgColor} rounded-sm text-xs py-px px-0.5 group-hover:bg-slate-50`}
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
      <DebugStop stop={stop} isPassed={isStationPassed} />
    </div>
  );
}
export default memo(RouteScheduleStop);
