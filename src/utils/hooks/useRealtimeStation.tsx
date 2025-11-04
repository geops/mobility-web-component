import { useEffect, useMemo, useState } from "preact/hooks";

import useMapContext from "./useMapContext";

import type { RealtimeStation } from "mobility-toolbox-js/types";

function useRealtimeStation(stationId: number | string) {
  const { realtimeLayer } = useMapContext();
  const [station, setStation] = useState<RealtimeStation>();
  const api = useMemo(() => {
    return realtimeLayer?.api;
  }, [realtimeLayer?.api]);

  useEffect(() => {
    if (!stationId || !api) {
      return;
    }

    if (!api.wsApi.open) {
      api.wsApi.connect(api.url);
    }

    api.subscribe(`station ${stationId}`, ({ content }) => {
      if (content) {
        console.log("Received station update", content);
        setStation(content as RealtimeStation);
      }
    });

    return () => {
      setStation(undefined);
      if (stationId) {
        api?.unsubscribe(`station ${stationId}`);
      }
    };
  }, [stationId, api]);
  return station;
}

export default useRealtimeStation;
