import type { PreactDOMAttributes, JSX } from "preact";

import { debounceDeparturesMessages } from "mobility-toolbox-js/ol";
import { RealtimeDeparture } from "mobility-toolbox-js/types";
import { memo } from "preact/compat";
import { useEffect, useRef, useState } from "preact/hooks";

import Departure from "../Departure";
import StationHeader from "../StationHeader";
import useMapContext from "../utils/hooks/useMapContext";

export type StationProps = PreactDOMAttributes &
  JSX.HTMLAttributes<HTMLDivElement>;

function Station(props: StationProps) {
  const { station, realtimeLayer } = useMapContext();
  const [departures, setDepartures] = useState<RealtimeDeparture[]>();
  const ref = useRef();
  const { className } = props;

  useEffect(() => {
    if (!station || !realtimeLayer?.api) {
      return;
    }

    const onMessage = debounceDeparturesMessages(
      (departures: RealtimeDeparture[]) => {
        setDepartures(departures);
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
      <div ref={ref} className={className}>
        {(departures || [])
          // .filter(hideDepartures)
          .map((departure: RealtimeDeparture, index: number) => {
            return (
              <Departure
                key={departure.call_id}
                departure={departure}
                index={index}
              />
            );
          })}
      </div>
    </>
  );
}

export default memo(Station);
