import debounce from "lodash.debounce";
import { StopsAPI } from "mobility-toolbox-js/ol";
import { useEffect, useMemo, useState } from "preact/hooks";

import { MAX_EXTENT_4326 } from "../constants";

import useMapContext from "./useMapContext";

import type { StopsParameters, StopsResponse } from "mobility-toolbox-js/types";

export type StopsFeature = StopsResponse["features"][0];

export interface SearchResponse<T> {
  isLoading: boolean;
  results: T[] | undefined;
}

/**
 * This hook launch a request to the Stops API.
 *
 * @param query
 */
function useSearchStops(
  query: string,
  params?: Partial<StopsParameters>,
): SearchResponse<StopsFeature> {
  const { apikey, mots, stopsurl } = useMapContext();
  const [results, setResults] = useState<StopsFeature[] | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const api: StopsAPI = useMemo(() => {
    if (!apikey || !stopsurl) {
      return null;
    }
    return new StopsAPI({ apiKey: apikey, url: stopsurl });
  }, [apikey, stopsurl]);

  const debouncedSearch = useMemo(() => {
    let abortCtrl: AbortController | undefined;

    return debounce((q) => {
      abortCtrl?.abort();
      abortCtrl = new AbortController();

      const reqParams = {
        bbox: MAX_EXTENT_4326?.join(","),
        mots,
        q,
        ...(params ?? {}),
      } as StopsParameters;

      setIsLoading(true);
      api
        .search(reqParams, { signal: abortCtrl.signal })
        .then((res: StopsResponse) => {
          setResults(res.features);
          setIsLoading(false);
        })
        .catch((e) => {
          // AbortError is expected
          if (e.code !== 20) {
            // eslint-disable-next-line no-console
            console.error("Failed to fetch stations", e);
            return;
          }
          setIsLoading(false);
        });
    }, 150);
  }, [api, mots, params]);

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

export default useSearchStops;
