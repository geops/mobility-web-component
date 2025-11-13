import debounce from "lodash.debounce";
import { RealtimeRestAPI } from "mobility-toolbox-js/ol";
import { useEffect, useMemo, useState } from "preact/hooks";

import useMapContext from "./useMapContext";

import type { RealtimeRouteIdentifierMatch } from "mobility-toolbox-js/types";

import type { SearchResponse } from "./useSearchStops";

function useSearchTrains(
  query: string,
): SearchResponse<RealtimeRouteIdentifierMatch> {
  const { apikey, hasRealtime, realtimeresturl, realtimetenant } =
    useMapContext();

  const [results, setResults] = useState<
    RealtimeRouteIdentifierMatch[] | undefined
  >();
  const [isLoading, setIsLoading] = useState(false);

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

  const debouncedSearch = useMemo(() => {
    let abortCtrl: AbortController | undefined;

    return debounce((q?: string) => {
      abortCtrl?.abort();
      abortCtrl = new AbortController();

      setIsLoading(true);
      api
        .trainsByRouteIdentifier(
          {
            exact_match: false,
            query: q,
          },
          { signal: abortCtrl.signal },
        )
        .then((res) => {
          setResults(res.matches);
          setIsLoading(false);
        })
        .catch((e) => {
          // AbortError is expected
          if (e.code !== 20) {
            // eslint-disable-next-line no-console
            console.error("Failed to fetch trains by route identifier", e);
            return;
          }
          setIsLoading(false);
        });
    }, 150);
  }, [api]);

  useEffect(() => {
    if (!query || !api) {
      setResults([]);
      return;
    }
    debouncedSearch(query);
  }, [api, debouncedSearch, query]);

  return {
    isLoading,
    results: results || [],
  };
}

export default useSearchTrains;
