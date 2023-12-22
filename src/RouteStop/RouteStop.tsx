import { useEffect, useMemo, useState } from "preact/hooks";
import type { RealtimeStation, RealtimeStop } from "mobility-toolbox-js/types";
import { memo } from "preact/compat";
import { PreactDOMAttributes, JSX } from "preact";
import useMapContext from "../utils/hooks/useMapContext";
import DebugStop from "../DebugStop/DebugStop";
import getStopStatus from "../utils/getStopStatus";
import RouteStopProgress from "../RouteStopProgress";
import RouteStopTime from "../RouteStopTime";
import RouteStopDelay from "../RouteStopDelay";
import RouteStopStation from "../RouteStopStation";
import { RouteStopContext } from "../utils/hooks/useRouteStop";

export type RouteScheduleStopProps = PreactDOMAttributes &
  JSX.HTMLAttributes<HTMLButtonElement> & {
    stop?: RealtimeStop & {
      platform?: string;
    };
    index?: number;
    invertColor?: boolean;
    classNameGreyOut?: string;
  };

function RouteStop({
  classNameGreyOut = "text-gray-600",
  stop,
  index,
  invertColor = false,
  children,
  ...props
}: RouteScheduleStopProps) {
  const { stopSequence, map, realtimeLayer } = useMapContext();
  const {
    // @ts-ignore
    stopUID,
  } = stop;
  const [station, setStation] = useState<RealtimeStation>();
  const [status, setStatus] = useState(getStopStatus(stopSequence, index));

  useEffect(() => {
    let interval = null;
    setStatus(getStopStatus(stopSequence, index));

    // To see the progress bar we have to update the status of the  vehicle until we get the new stopSeqeunce.
    if (status.isInBetween) {
      interval = setInterval(() => {
        setStatus(getStopStatus(stopSequence, index));
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [index, status.isInBetween, stopSequence]);

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
    return { stop, status, index, invertColor, station };
  }, [stop, status, index, invertColor, station]);

  let colorScheme = status.isPassed || status.isLeft ? classNameGreyOut : "";

  if (invertColor) {
    colorScheme =
      status.isPassed || !status.isLeft || status.isBoarding
        ? ""
        : classNameGreyOut;
  }

  return (
    <RouteStopContext.Provider value={routeStopState}>
      <button
        type="button"
        // max-h-[58px] because the svg showing the progress is 58px height.
        className={`w-full max-h-[58px] flex items-stretch hover:bg-slate-100 rounded scroll-mt-[50px] text-left ${colorScheme}`}
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
            <RouteStopProgress className="flex flex-shrink-0 item-center w-8 relative" />
            <RouteStopStation className="flex flex-col items-start justify-center text-sm flex-grow font-medium pr-2" />
          </>
        )}
      </button>
      <DebugStop />
    </RouteStopContext.Provider>
  );
}
export default memo(RouteStop);
