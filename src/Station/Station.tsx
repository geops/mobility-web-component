import type { PreactDOMAttributes, JSX } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import { memo } from "preact/compat";
import { debounceDeparturesMessages } from "mobility-toolbox-js/ol";
import { RealtimeDepartureExtended } from "mobility-toolbox-js/types";
import useMapContext from "../utils/hooks/useMapContext";
import StationHeader from "../StationHeader";
import Departure from "../Departure";

export type StationProps = PreactDOMAttributes &
  JSX.HTMLAttributes<HTMLDivElement>;

function Station(props: StationProps) {
  const { station, realtimeLayer } = useMapContext();
  const [departures, setDepartures] = useState<RealtimeDepartureExtended[]>();
  const ref = useRef();
  const { className } = props;

  useEffect(() => {
    if (!station || !realtimeLayer?.api) {
      return () => {};
    }

    const onMessage = debounceDeparturesMessages(
      // eslint-disable-next-line @typescript-eslint/no-shadow
      (departures: RealtimeDepartureExtended[]) => {
        setDepartures(departures);
        return null;
      },
      false,
      180,
    );
    realtimeLayer.api.subscribeDepartures(station?.properties?.uid, onMessage);

    return () => {
      setDepartures(null);
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
          .map((departure: RealtimeDepartureExtended, index: number) => {
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
