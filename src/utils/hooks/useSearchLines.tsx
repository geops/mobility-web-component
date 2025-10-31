import { useMemo } from "preact/hooks";

import { useLnpLinesInfos } from "./useLnp";

import type { LnpLineInfo } from "./useLnp";
import type { SearchResponse } from "./useSearchStops";

function useSearchLines(query: string): SearchResponse<LnpLineInfo> {
  const linesInfos = useLnpLinesInfos();

  const results = useMemo(() => {
    if (!query || !linesInfos) {
      return [];
    }
    return Object.values(linesInfos || {}).filter((line: LnpLineInfo) => {
      return (
        line?.short_name?.toLowerCase().includes(query.toLowerCase()) ||
        line?.long_name?.toLowerCase().includes(query.toLowerCase()) ||
        line?.id?.toLowerCase().includes(query.toLowerCase()) ||
        line?.external_id?.toLowerCase().includes(query.toLowerCase()) ||
        line?.mot?.toLowerCase().includes(query.toLowerCase())
      );
    });
  }, [linesInfos, query]);

  return {
    isLoading: false,
    results: results || [],
  };
}

export default useSearchLines;
