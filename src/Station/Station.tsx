import { debounceDeparturesMessages } from "mobility-toolbox-js/ol";
import { memo } from "preact/compat";
import { useEffect, useRef, useState } from "preact/hooks";
import { twMerge } from "tailwind-merge";

import Departure from "../Departure";
import StationHeader from "../StationHeader";
import useMapContext from "../utils/hooks/useMapContext";

import type { RealtimeDeparture } from "mobility-toolbox-js/types";
import type { HTMLAttributes, PreactDOMAttributes } from "preact";

export type StationProps = {
  className?: string;
} & HTMLAttributes<HTMLDivElement> &
  PreactDOMAttributes;

function Station(props: StationProps) {
  const { realtimeLayer, station } = useMapContext();
  const [departures, setDepartures] = useState<RealtimeDeparture[]>();
  const ref = useRef();
  const { className } = props;

  useEffect(() => {
    if (!station || !realtimeLayer?.api) {
      return;
    }

    const onMessage = debounceDeparturesMessages(
      (newDepartures: RealtimeDeparture[]) => {
        setDepartures(newDepartures);
        return null;
      },
      false,
      180,
    );
    // @ts-expect-error bad type definition
    realtimeLayer.api.subscribeDepartures(station?.properties?.uid, onMessage);

    return () => {
      setDepartures(null);
      // @ts-expect-error bad type definition
      realtimeLayer?.api?.unsubscribeDepartures(station?.properties.uid);
    };
  }, [station, realtimeLayer?.api]);

  if (!station) {
    return null;
  }

  return (
    <>
      <StationHeader />
      <div
        className={twMerge("flex flex-col p-2", className)}
        ref={ref}
        {...props}
      >
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
    </>
  );
}

export default memo(Station);
