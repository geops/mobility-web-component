import type { RealtimeStop } from "mobility-toolbox-js/types";
import type { PreactDOMAttributes, JSX } from "preact";

import { memo } from "preact/compat";
import { useEffect, useRef } from "preact/hooks";

import RouteScheduleFooter from "../RouteScheduleFooter";
import RouteScheduleHeader from "../RouteScheduleHeader";
import RouteStop from "../RouteStop";
import useMapContext from "../utils/hooks/useMapContext";

export type RouteScheduleProps = PreactDOMAttributes &
  JSX.HTMLAttributes<HTMLDivElement>;

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
  }, [stopSequence]);

  if (!stopSequence) {
    return null;
  }

  const { className } = props;

  return (
    <>
      <RouteScheduleHeader />
      <div ref={ref} className={className}>
        {stopSequence.stations.map((stop: RealtimeStop, index: number) => {
          const { stationId, arrivalTime, departureTime, stationName } = stop;
          return (
            <RouteStop
              // Train line can go in circle so begin and end have the same id,
              // using the time in the key should fix the issue.
              key={
                (`${stationId}` || stationName) + arrivalTime + departureTime
              }
              stop={stop}
              index={index}
            />
          );
        })}
        <RouteScheduleFooter />
      </div>
    </>
  );
}

export default memo(RouteSchedule);
