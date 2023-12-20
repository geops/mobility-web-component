import { useEffect, useMemo, useState } from "preact/hooks";
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
import { RouteStopContext } from "../utils/hooks/useRouteStop";

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
  children,
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

  const routeStopState = useMemo(() => {
    return { stop, status };
  }, [stop, status]);

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
    <RouteStopContext.Provider value={routeStopState}>
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
          {children || (
            <>
              <RouteStopTime className="flex flex-col flex-shrink-0 justify-center w-10 text-xs ml-4" />
              <RouteStopDelay className="flex flex-col flex-shrink-0 justify-center w-8 text-[0.6rem]" />
              <RouteStopProgress
                className="flex flex-shrink-0 item-center w-8 relative"
                svgProps={{
                  className: colorScheme.svgClassName,
                  style: { color: colorScheme.svgStroke },
                }}
              />
              <RouteStopStation
                className={`flex flex-col items-start justify-center text-sm flex-grow  font-medium pr-2 ${
                  status.isCancelled ? "text-red-600 line-through" : ""
                } ${colorScheme.nameTextColor}`}
              />
            </>
          )}
        </button>
        <DebugStop />
      </div>
    </RouteStopContext.Provider>
  );
}
export default memo(RouteStop);
