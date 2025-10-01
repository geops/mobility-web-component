import { memo } from "preact/compat";
import { useEffect, useRef } from "preact/hooks";

import RouteScheduleFooter from "../RouteScheduleFooter";
import RouteScheduleHeader from "../RouteScheduleHeader";
import RouteStop from "../RouteStop";
import ShadowOverflow from "../ShadowOverflow";
import useMapContext from "../utils/hooks/useMapContext";

import type { RealtimeStop } from "mobility-toolbox-js/types";
import type { JSX, PreactDOMAttributes } from "preact";

export type RouteScheduleProps = JSX.HTMLAttributes<HTMLDivElement> &
  PreactDOMAttributes;

function RouteSchedule(props: RouteScheduleProps) {
  const { stopSequence } = useMapContext();
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
  }, [stopSequence]);

  if (!stopSequence) {
    return null;
  }

  const { className } = props;

  return (
    <>
      <RouteScheduleHeader />
      <ShadowOverflow>
        <div className={className} ref={ref}>
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
              />
            );
          })}
          <RouteScheduleFooter />
        </div>
      </ShadowOverflow>
    </>
  );
}

export default memo(RouteSchedule);
