import { cloneElement, toChildArray } from "preact";
import { memo } from "preact/compat";
import { useCallback, useContext, useMemo } from "preact/hooks";

import { SearchContext } from "../Search/SearchBase";
import SearchResult from "../SearchResult";
import SearchResults from "../SearchResults";
import SearchResultsHeader from "../SearchResultsHeader";
import useI18n from "../utils/hooks/useI18n";
import useSearchStops from "../utils/hooks/useSearchStops";

import type { ReactElement } from "preact/compat";

import type {
  SearchResultsChildProps,
  SearchResultsProps,
} from "../SearchResults/SearchResults";
import type { StopsFeature } from "../utils/hooks/useSearchStops";

function SearchStopsResults({
  children,
  filter,
  resultClassName,
  resultsClassName,
  resultsContainerClassName,
  sort,
}: SearchResultsProps<StopsFeature>) {
  const { open, query, setOpen, setSelectedQuery } = useContext(SearchContext);
  const searchResponse = useSearchStops(query);

  const { t } = useI18n();

  const onSelectResult = useCallback(
    (item: StopsFeature) => {
      setSelectedQuery(item.properties.name);
      setOpen(false);
    },
    [setOpen, setSelectedQuery],
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
              {toChildArray(children).map(
                (
                  child: ReactElement<SearchResultsChildProps<StopsFeature>>,
                ) => {
                  const onSelectItem = (itemm: StopsFeature, evt: Event) => {
                    onSelectResult(itemm);
                    child.props?.onSelectItem?.(itemm, evt);
                  };
                  return cloneElement(child, {
                    item: item,
                    onSelectItem,
                  });
                },
              )}
            </SearchResult>
          );
        })}
      </SearchResults>
    </>
  );
}
export default memo(SearchStopsResults);
