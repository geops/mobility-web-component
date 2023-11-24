import type { PreactDOMAttributes, JSX } from "preact";
import { useEffect, useRef } from "preact/hooks";
import { memo } from "preact/compat";
import type { RealtimeStop } from "mobility-toolbox-js/types";
import useMapContext from "../utils/hooks/useMapContext";
import RouteScheduleHeader from "../RouteScheduleHeader";
import RouteScheduleFooter from "../RouteScheduleFooter";
import RouteScheduleStop from "../RouteScheduleStop";

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
        {stopSequence.stations.map((stop: RealtimeStop, idx: number) => {
          const { stationId, arrivalTime, departureTime, stationName } = stop;
          return (
            <RouteScheduleStop
              // Train line can go in circle so begin and end have the same id,
              // using the time in the key should fix the issue.
              key={
                (`${stationId}` || stationName) + arrivalTime + departureTime
              }
              stop={stop}
              idx={idx}
            />
          );
        })}
        <RouteScheduleFooter />
      </div>
    </>
  );
}

export default memo(RouteSchedule);
