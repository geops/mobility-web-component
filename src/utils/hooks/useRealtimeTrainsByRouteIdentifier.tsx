import { RealtimeRestAPI } from "mobility-toolbox-js/ol";
import { useEffect, useMemo, useState } from "preact/hooks";

import useMapContext from "./useMapContext";

import type { RealtimeRouteIdentifierMatch } from "mobility-toolbox-js/types";

function useRealtimeTrainByRouteIdentifier(
  routeIdentifier: string,
): RealtimeRouteIdentifierMatch | undefined {
  const { apikey, hasRealtime, realtimeresturl, realtimetenant, tenant } =
    useMapContext();
  const [train, setTrain] = useState<RealtimeRouteIdentifierMatch>();

  const tenantMemo = useMemo(() => {
    return realtimetenant || tenant;
  }, [realtimetenant, tenant]);

  const api = useMemo(() => {
    if (!apikey || !tenantMemo || !hasRealtime) {
      return null;
    }
    return new RealtimeRestAPI({
      apiKey: apikey,
      tenant: tenantMemo,
      url: realtimeresturl,
    });
  }, [apikey, tenantMemo, hasRealtime, realtimeresturl]);

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
          setTrain(res.matches[0]);
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
