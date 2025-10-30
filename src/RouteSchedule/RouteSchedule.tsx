import { memo } from "preact/compat";
import { useEffect, useRef } from "preact/hooks";
import { twMerge } from "tailwind-merge";

import RouteScheduleFooter from "../RouteScheduleFooter";
import RouteScheduleHeader from "../RouteScheduleHeader";
import RouteStop from "../RouteStop";
import ShadowOverflow from "../ShadowOverflow";
import useMapContext from "../utils/hooks/useMapContext";
import useRealtimeStopSequences from "../utils/hooks/useRealtimeStopSequences";

import type { RealtimeStop } from "mobility-toolbox-js/types";
import type { HTMLAttributes, PreactDOMAttributes } from "preact";

export type RouteScheduleProps = {
  className?: string;
} & HTMLAttributes<HTMLDivElement> &
  PreactDOMAttributes;

function RouteSchedule({ className }: RouteScheduleProps) {
  const { trainId } = useMapContext();
  const stopSequences = useRealtimeStopSequences(trainId);
  const ref = useRef();

  useEffect(() => {
    const interval = window.setInterval(() => {
      const elt = ref.current as HTMLDivElement;
      if (!elt) {
        return;
      }
      const nextStation = elt.querySelector("[data-station-passed=false]");
      if (nextStation) {
        // We use scrollTo avoid scrolling the entire window.
        (nextStation.parentNode.parentNode as Element).scrollTo({
          behavior: "smooth",
          top: (nextStation as HTMLElement).offsetTop || 0,
        });
      }
      clearInterval(interval);
    }, 300);
    return () => {
      clearTimeout(interval);
    };
    // Scroll automatically when a new scroll infos is set.
  }, [stopSequences]);

  if (!stopSequences?.[0]) {
    return null;
  }
  const stopSequence = stopSequences[0];
  return (
    <>
      <RouteScheduleHeader stopSequence={stopSequence} />
      <ShadowOverflow>
        <div className={twMerge("text-base", className)} ref={ref}>
          {stopSequence.stations.map((stop: RealtimeStop, index: number) => {
            const { arrivalTime, departureTime, stationId, stationName } = stop;
            return (
              <RouteStop
                // Train line can go in circle so begin and end have the same id,
                index={index}
                // using the time in the key should fix the issue.
                key={
                  (`${stationId}` || stationName) + arrivalTime + departureTime
                }
                stop={stop}
                stopSequence={stopSequence}
              />
            );
          })}
          <RouteScheduleFooter stopSequence={stopSequence} />
        </div>
      </ShadowOverflow>
    </>
  );
}

export default memo(RouteSchedule);
