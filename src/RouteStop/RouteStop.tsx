import { memo } from "preact/compat";
import { useEffect, useMemo, useState } from "preact/hooks";

import DebugStop from "../DebugStop/DebugStop";
import RouteStopDelay from "../RouteStopDelay";
import RouteStopProgress from "../RouteStopProgress";
import RouteStopStation from "../RouteStopStation";
import RouteStopTime from "../RouteStopTime";
import getStopStatus from "../utils/getStopStatus";
import useMapContext from "../utils/hooks/useMapContext";
import useRealtimeStation from "../utils/hooks/useRealtimeStation";
import { RouteStopContext } from "../utils/hooks/useRouteStop";

import type {
  RealtimeStop,
  RealtimeStopSequence,
} from "mobility-toolbox-js/types";
import type { HTMLAttributes, PreactDOMAttributes } from "preact";

export type RouteScheduleStopProps = {
  classNameGreyOut?: string;
  index?: number;
  invertColor?: boolean;
  stop?: {
    platform?: string;
  } & RealtimeStop;
  stopSequence: RealtimeStopSequence;
} & HTMLAttributes<HTMLButtonElement> &
  PreactDOMAttributes;

function RouteStop({
  children,
  classNameGreyOut = "text-gray-600",
  index,
  invertColor = false,
  stop,
  stopSequence,
  ...props
}: RouteScheduleStopProps) {
  const { map } = useMapContext();
  const {
    // @ts-expect-error bad type definition
    stopUID,
  } = stop;
  const [status, setStatus] = useState(getStopStatus(stopSequence, index));
  const station = useRealtimeStation(stopUID);

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

  const routeStopState = useMemo(() => {
    return { index, invertColor, station, status, stop, stopSequence };
  }, [stop, status, index, invertColor, station, stopSequence]);

  let colorScheme = status.isPassed || status.isLeft ? classNameGreyOut : "";

  if (invertColor) {
    colorScheme =
      status.isPassed || status.isLeft || status.isBoarding
        ? ""
        : classNameGreyOut;
  }

  return (
    <RouteStopContext.Provider value={routeStopState}>
      <button
        // max-h-[58px] because the svg showing the progress is 58px height.
        className={`flex max-h-[58px] w-full scroll-mt-[50px] items-stretch rounded text-left hover:bg-slate-100 ${colorScheme}`}
        data-station-passed={status.isPassed} // Use for auto scroll
        onClick={() => {
          if (stop.coordinate) {
            map.getView().animate({
              center: [stop.coordinate[0], stop.coordinate[1]],
              zoom: map.getView().getZoom(),
            });
          }
        }}
        type="button"
        {...props}
      >
        {children || (
          <>
            <RouteStopTime className="ml-4 flex w-10 shrink-0 flex-col justify-center text-xs" />
            <RouteStopDelay className="flex w-8 shrink-0 flex-col justify-center text-[0.6rem]" />
            <RouteStopProgress className="relative flex w-8 shrink-0 items-center" />
            <RouteStopStation className="flex grow flex-col items-start justify-center pr-2 text-sm font-medium" />
          </>
        )}
      </button>
      <DebugStop />
    </RouteStopContext.Provider>
  );
}
export default memo(RouteStop);
