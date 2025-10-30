import { memo } from "preact/compat";
import { twMerge } from "tailwind-merge";

import Departure from "../Departure";
import ShadowOverflow from "../ShadowOverflow";
import StationHeader from "../StationHeader";
import useMapContext from "../utils/hooks/useMapContext";
import useRealtimeDepartures from "../utils/hooks/useRealtimeDepartures";
import useRealtimeStation from "../utils/hooks/useRealtimeStation";

import type { RealtimeDeparture } from "mobility-toolbox-js/types";
import type { HTMLAttributes, PreactDOMAttributes } from "preact";

export type StationProps = {
  className?: string;
} & HTMLAttributes<HTMLDivElement> &
  PreactDOMAttributes;

function Station({ className, ...props }: StationProps) {
  const { stationId } = useMapContext();
  const station = useRealtimeStation(stationId);
  const departures = useRealtimeDepartures(stationId);
  if (!station) {
    return null;
  }

  return (
    <>
      <StationHeader station={station} />
      <ShadowOverflow>
        <div className={twMerge("flex flex-col p-2", className)} {...props}>
          {(departures || [])
            // .filter(hideDepartures)
            .map((departure: RealtimeDeparture, index: number) => {
              return (
                <Departure
                  departure={departure}
                  index={index}
                  key={departure.call_id}
                />
              );
            })}
        </div>
      </ShadowOverflow>
    </>
  );
}

export default memo(Station);
