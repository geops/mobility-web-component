import { RealtimeRestAPI } from "mobility-toolbox-js/ol";
import { type RealtimeTrainDetail } from "mobility-toolbox-js/types";
import { useEffect, useMemo, useState } from "preact/hooks";

import useMapContext from "./useMapContext";

function useRealtimeTrainByRouteIdentifier(
  routeIdentifier: string,
): RealtimeTrainDetail {
  const { apikey, hasRealtime, realtimeresturl, realtimetenant } =
    useMapContext();
  const [train, setTrain] = useState<RealtimeTrainDetail>();

  const api = useMemo(() => {
    if (!apikey || !realtimetenant || !hasRealtime) {
      return null;
    }
    return new RealtimeRestAPI({
      apiKey: apikey,
      tenant: realtimetenant,
      url: realtimeresturl,
    });
  }, [apikey, realtimetenant, realtimeresturl, hasRealtime]);

  useEffect(() => {
    if (!api || !routeIdentifier) {
      return;
    }

    const abortCtrl: AbortController = new AbortController();

    api
      .trainsByRouteIdentifier(
        {
          exact_match: true,
          query: routeIdentifier,
        },
        { signal: abortCtrl.signal },
      )
      .then((res) => {
        if (res.matches.length > 0) {
          setTrain(res.matches[0].trains[0]);
        } else {
          setTrain(undefined);
        }
      })
      .catch((e) => {
        // AbortError is expected
        if (e.code !== 20) {
          // eslint-disable-next-line no-console
          console.error(
            "Failed to fetch train by route identifier",
            routeIdentifier,
            e,
          );
          return;
        }
      });

    return () => {
      abortCtrl?.abort();
    };
  }, [api, routeIdentifier]);

  return train;
}
export default useRealtimeTrainByRouteIdentifier;
