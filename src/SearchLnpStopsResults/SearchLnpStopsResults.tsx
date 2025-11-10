import { cloneElement, toChildArray } from "preact";
import { memo } from "preact/compat";
import { useCallback, useContext, useMemo } from "preact/hooks";

import { SearchContext } from "../Search/SearchBase";
import SearchResult from "../SearchResult";
import SearchResults from "../SearchResults";
import SearchResultsHeader from "../SearchResultsHeader";
import useI18n from "../utils/hooks/useI18n";
import useSearchLnpStops from "../utils/hooks/useSearchLnpStops";

import type { ReactElement } from "preact/compat";

import type {
  SearchResultsChildProps,
  SearchResultsProps,
} from "../SearchResults/SearchResults";
import type { LnpStopInfo } from "../utils/hooks/useLnp";

const defaultSort = (a: LnpStopInfo, b: LnpStopInfo) => {
  if (a.long_name === b.long_name) {
    return a.long_name < b.long_name ? 1 : -1;
  }
  return a.short_name < b.short_name ? 1 : -1;
};

function SearchLnpStopsResults({
  children,
  filter,
  resultClassName,
  resultsClassName,
  resultsContainerClassName,
  sort = defaultSort,
}: SearchResultsProps<LnpStopInfo>) {
  const { open, query, setOpen, setSelectedQuery } = useContext(SearchContext);
  const searchResponse = useSearchLnpStops(query);

  const { t } = useI18n();

  const onSelectResult = useCallback(
    (item: LnpStopInfo) => {
      setSelectedQuery(item.short_name || item.long_name);
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
        {results.map((item: LnpStopInfo) => {
          return (
            <SearchResult className={resultClassName} key={item.short_name}>
              {toChildArray(children).map(
                (child: ReactElement<SearchResultsChildProps<LnpStopInfo>>) => {
                  const onSelectItem = (itemm: LnpStopInfo, evt: Event) => {
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
export default memo(SearchLnpStopsResults);
