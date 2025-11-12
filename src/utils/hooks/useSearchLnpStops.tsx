import { useMemo } from "preact/hooks";

import { useLnpStopsInfos } from "./useLnp";
import useMapContext from "./useMapContext";

import type { LnpStopInfo } from "./useLnp";
import type { SearchResponse } from "./useSearchStops";

function useSearchLnpStops(query: string): SearchResponse<LnpStopInfo> {
  const { hasLnp } = useMapContext();
  const infos = useLnpStopsInfos();

  const results = useMemo(() => {
    if (!query || !infos || !hasLnp) {
      return [];
    }
    return Object.values(infos || {}).filter((item: LnpStopInfo) => {
      return (
        item?.short_name?.toLowerCase().includes(query.toLowerCase()) ||
        item?.long_name?.toLowerCase().includes(query.toLowerCase()) ||
        item?.external_id?.toLowerCase().includes(query.toLowerCase()) ||
        item?.codes?.find((code) => {
          return (
            code.toLowerCase() === query.toLowerCase() ||
            code.split(":")[1]?.toLowerCase() === query.toLowerCase()
          );
        })
      );
    });
  }, [hasLnp, infos, query]);

  return {
    isLoading: false,
    results: results || [],
  };
}

export default useSearchLnpStops;
