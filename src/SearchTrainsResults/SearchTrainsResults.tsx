import { cloneElement, toChildArray } from "preact";
import { memo } from "preact/compat";
import { useCallback, useContext, useMemo } from "preact/hooks";

import { SearchContext } from "../Search/SearchBase";
import SearchResult from "../SearchResult";
import SearchResults from "../SearchResults";
import SearchResultsHeader from "../SearchResultsHeader";
import useI18n from "../utils/hooks/useI18n";
import useSearchTrains from "../utils/hooks/useSearchTrains";

import type { RealtimeRouteIdentifierMatch } from "mobility-toolbox-js/types";
import type { ReactElement } from "preact/compat";

import type {
  SearchResultsChildProps,
  SearchResultsProps,
} from "../SearchResults/SearchResults";

function SearchTrainsResults({
  children,
  filter,
  resultClassName,
  resultsClassName,
  resultsContainerClassName,
  sort,
}: SearchResultsProps<RealtimeRouteIdentifierMatch>) {
  const { open, query, setOpen, setSelectedQuery } = useContext(SearchContext);
  const searchResponse = useSearchTrains(query);

  const { t } = useI18n();

  const onSelectResult = useCallback(
    (item: RealtimeRouteIdentifierMatch) => {
      setSelectedQuery(item.route_identifier);
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
      <SearchResultsHeader>{t("search_trains_results")}</SearchResultsHeader>
      <SearchResults
        className={resultsContainerClassName}
        resultsClassName={resultsClassName}
        searchResponse={searchResponseFiltered}
      >
        {results.map((item: RealtimeRouteIdentifierMatch) => {
          return (
            <SearchResult className={resultClassName} key={item.train_id}>
              {toChildArray(children).map(
                (
                  child: ReactElement<
                    SearchResultsChildProps<RealtimeRouteIdentifierMatch>
                  >,
                ) => {
                  const onSelectItem = (
                    itemm: RealtimeRouteIdentifierMatch,
                    evt: Event,
                  ) => {
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
export default memo(SearchTrainsResults);
