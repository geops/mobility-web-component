import { useEffect, useMemo, useState } from "preact/hooks";

import useMapContext from "./useMapContext";

import type { RealtimeStopSequence } from "mobility-toolbox-js/types";

function useRealtimeStopSequences(trainId: string) {
  const { realtimeLayer } = useMapContext();
  const [stopSequences, setStopSequences] = useState<RealtimeStopSequence[]>();

  const api = useMemo(() => {
    return realtimeLayer?.api;
  }, [realtimeLayer?.api]);

  useEffect(() => {
    let trainIdSubscribed = null;
    if (!trainId || !api) {
      return;
    }

    if (!api.wsApi.open) {
      api.open();
    }

    trainIdSubscribed = trainId;

    const onMessage = ({ content }) => {
      if (content) {
        setStopSequences([...content]);
      }
    };
    api.subscribeStopSequence(trainId, onMessage);

    return () => {
      setStopSequences([]);
      api.unsubscribeStopSequence(trainIdSubscribed);
    };
  }, [trainId, api]);

  return stopSequences;
}

export default useRealtimeStopSequences;
