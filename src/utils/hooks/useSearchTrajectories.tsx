import { useMemo } from "preact/hooks";

import useMapContext from "./useMapContext";

import type { RealtimeTrajectory } from "mobility-toolbox-js/types";

import type { SearchResponse } from "./useSearchStops";

function useSearchTrajectories(
  query: string,
): SearchResponse<RealtimeTrajectory> {
  const { hasRealtime, realtimeLayer } = useMapContext();

  const results = useMemo(() => {
    if (!query || !realtimeLayer?.trajectories || !hasRealtime) {
      return [];
    }
    return Object.values(realtimeLayer.trajectories || {}).filter(
      (trajectory) => {
        return trajectory?.properties.route_identifier
          ?.toLowerCase()
          .includes(query.toLowerCase());
      },
    );
  }, [query, realtimeLayer?.trajectories, hasRealtime]);

  return {
    isLoading: false,
    results: results || [],
  };
}

export default useSearchTrajectories;
