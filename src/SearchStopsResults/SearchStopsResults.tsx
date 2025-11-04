import { memo } from "preact/compat";
import { useCallback, useContext, useMemo } from "preact/hooks";

import { SearchContext } from "../Search/Search2";
import SearchResult from "../SearchResult";
import SearchResults from "../SearchResults";
import SearchResultsHeader from "../SearchResultsHeader";
import SearchStopsResult from "../SearchStopsResult";
import useI18n from "../utils/hooks/useI18n";
import useSearchStops from "../utils/hooks/useSearchStops";

import type { SearchResultsProps } from "../SearchResults/SearchResults";
import type { StopsFeature } from "../utils/hooks/useSearchStops";

function SearchStopsResults({
  filter,
  onSelect,
  resultClassName,
  resultsClassName,
  resultsContainerClassName,
  sort,
}: SearchResultsProps) {
  const { open, query, setOpen, setSelectedQuery } = useContext(SearchContext);
  const searchResponse = useSearchStops(query);

  const { t } = useI18n();

  const onSelectStop = useCallback(
    (stop: StopsFeature) => {
      console.log("ici");
      setSelectedQuery(stop.properties.name);
      setOpen(false);
      onSelect?.(stop);
    },
    [onSelect, setOpen, setSelectedQuery],
  );

  const results = useMemo(() => {
    let rs = [...(searchResponse?.results || [])];

    if (filter) {
      rs = rs.filter(filter);
    }

    if (sort) {
      rs = rs.sort(sort);
    }
    return rs;
  }, [searchResponse, filter, sort]);

  const searchResponseFiltered = useMemo(() => {
    return {
      ...searchResponse,
      results,
    };
  }, [results, searchResponse]);

  const showResults = useMemo(() => {
    return open && !!results?.length;
  }, [open, results]);

  if (!showResults) {
    return null;
  }

  return (
    <>
      <SearchResultsHeader>{t("search_stops_results")}</SearchResultsHeader>
      <SearchResults
        className={resultsContainerClassName}
        resultsClassName={resultsClassName}
        searchResponse={searchResponseFiltered}
      >
        {results.map((item: StopsFeature) => {
          return (
            <SearchResult className={resultClassName} key={item.properties.uid}>
              <SearchStopsResult onSelect={onSelectStop} stop={item} />
            </SearchResult>
          );
        })}
      </SearchResults>
    </>
  );
}
export default memo(SearchStopsResults);
