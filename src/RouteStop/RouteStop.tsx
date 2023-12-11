import { useEffect, useState } from "preact/hooks";
import type { RealtimeStation, RealtimeStop } from "mobility-toolbox-js/types";
import { memo } from "preact/compat";
import { PreactDOMAttributes, JSX } from "preact";
import useMapContext from "../utils/hooks/useMapContext";
import getBgColor from "../utils/getBgColor";
import DebugStop from "../DebugStop/DebugStop";
import getStopStatus from "../utils/getStopStatus";
import RouteStopProgress from "../RouteStopProgress";
import RouteStopTime from "../RouteStopTime";
import RouteStopDelay from "../RouteStopDelay";
import RouteStopStation from "../RouteStopStation";

export type RouteScheduleStopProps = PreactDOMAttributes &
  JSX.HTMLAttributes<HTMLButtonElement> & {
    stop: RealtimeStop & {
      platform?: string;
    };
    idx: number;
    invertColor: boolean;
  };

function RouteStop({
  stop,
  idx,
  invertColor = false,
  ...props
}: RouteScheduleStopProps) {
  const { stopSequence, map, realtimeLayer } = useMapContext();
  const {
    // @ts-ignore
    stopUID,
    stationName,
  } = stop;
  const { type, stroke, vehicleType } = stopSequence;
  const [station, setStation] = useState<RealtimeStation>();
  const color = stroke || getBgColor(type || vehicleType);
  const [status, setStatus] = useState(getStopStatus(stopSequence, idx));

  useEffect(() => {
    let interval = null;
    setStatus(getStopStatus(stopSequence, idx));

    // To see the progress bar we have to update the status of the  vehicle until we get the new stopSeqeunce.
    if (status.isInBetween) {
      interval = setInterval(() => {
        setStatus(getStopStatus(stopSequence, idx));
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [idx, status.isInBetween, stationName, station, stopSequence]);

  useEffect(() => {
    if (!stopUID || !realtimeLayer?.api) {
      return () => {};
    }
    const subscribe = async () => {
      realtimeLayer?.api?.subscribe(`station ${stopUID}`, ({ content }) => {
        if (content) {
          setStation(content);
        }
      });
    };
    subscribe();

    return () => {
      setStation(null);
      if (stopUID) {
        realtimeLayer?.api?.unsubscribe(`station ${stopUID}`);
      }
    };
  }, [stopUID, realtimeLayer?.api]);

  const hideDelay =
    status.isNotRealtime ||
    status.isFirst ||
    status.isCancelled ||
    status.isNotStop ||
    status.isPassed;

  const colorSchemeGreyOut = {
    textColor: "text-gray-500",
    svgClassName: "text-gray-400",
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

  let colorScheme = status.isPassed ? colorSchemeGreyOut : colorSchemeNormal;

  if (invertColor) {
    colorScheme = status.isPassed ? colorSchemeNormal : colorSchemeGreyOut;
  }

  return (
    <div>
      <button
        type="button"
        // max-h-[58px] because the svg showing the progress is 58px height.
        className={`w-full max-h-[58px] flex items-stretch hover:bg-slate-100 rounded scroll-mt-[50px] text-left ${colorScheme.textColor}`}
        data-station-passed={status.isPassed} // Use for auto scroll
        onClick={() => {
          if (stop.coordinate) {
            map.getView().animate({
              zoom: map.getView().getZoom(),
              center: [stop.coordinate[0], stop.coordinate[1]],
            });
          }
        }}
        {...props}
      >
        <div className="flex flex-col flex-shrink-0 justify-center w-10 text-xs ml-4">
          <RouteStopTime stop={stop} status={status} />
        </div>
        <div className="flex flex-col flex-shrink-0 justify-center w-8 text-[0.6rem]">
          {!hideDelay && <RouteStopDelay stop={stop} status={status} />}
        </div>
        <div className="flex flex-shrink-0 item-center w-8 relative">
          <RouteStopProgress
            status={status}
            className={colorScheme.svgClassName}
            style={{ color: colorScheme.svgStroke }}
          />
        </div>
        <div
          className={`flex flex-col items-start justify-center text-sm flex-grow  font-medium pr-2 ${
            status.isCancelled ? "text-red-600 line-through" : ""
          } ${colorScheme.nameTextColor}`}
        >
          <RouteStopStation
            stop={stop}
            station={station}
            className="flex items-center gap-2"
          />
        </div>
      </button>
      <DebugStop stop={stop} isPassed={status.isPassed} />
    </div>
  );
}
export default memo(RouteStop);
