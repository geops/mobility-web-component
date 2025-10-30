import { debounceDeparturesMessages } from "mobility-toolbox-js/ol";
import { useEffect, useMemo, useState } from "preact/hooks";

import useMapContext from "./useMapContext";

import type { RealtimeDeparture } from "mobility-toolbox-js/types";

function useRealtimeDepartures(stationId: number | string) {
  const { realtimeLayer } = useMapContext();
  const [departures, setDepartures] = useState<RealtimeDeparture[]>();

  const api = useMemo(() => {
    return realtimeLayer?.api;
  }, [realtimeLayer?.api]);

  useEffect(() => {
    if (!stationId || !api) {
      return;
    }

    if (!api.wsApi.open) {
      api.open();
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
    api.subscribeTimetable(stationId, onMessage);

    return () => {
      setDepartures(null);
      api.unsubscribeTimetable(stationId as number);
    };
  }, [stationId, api]);

  return departures;
}

export default useRealtimeDepartures;
