import { cloneElement, toChildArray } from "preact";
import { memo } from "preact/compat";
import { useCallback, useContext, useMemo } from "preact/hooks";

import { SearchContext } from "../Search/Search2";
import SearchResult from "../SearchResult";
import SearchResults from "../SearchResults";
import SearchResultsHeader from "../SearchResultsHeader";
import useI18n from "../utils/hooks/useI18n";
import useSearchLines from "../utils/hooks/useSearchLines";

import type { ReactElement } from "preact/compat";

import type {
  SearchResultsChildProps,
  SearchResultsProps,
} from "../SearchResults/SearchResults";
import type { LnpLineInfo } from "../utils/hooks/useLnp";

const defaultSort = (a: LnpLineInfo, b: LnpLineInfo) => {
  if (a.long_name === b.long_name) {
    return a.long_name < b.long_name ? 1 : -1;
  }
  return a.short_name < b.short_name ? 1 : -1;
};

function SearchLinesResults({
  children,
  filter,
  resultClassName,
  resultsClassName,
  resultsContainerClassName,
  sort = defaultSort,
}: SearchResultsProps<LnpLineInfo>) {
  const { open, query, setOpen, setSelectedQuery } = useContext(SearchContext);
  const searchResponse = useSearchLines(query);

  const { t } = useI18n();

  const onSelectResult = useCallback(
    (item: LnpLineInfo) => {
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
      <SearchResultsHeader>{t("search_lines_results")}</SearchResultsHeader>
      <SearchResults
        className={resultsContainerClassName}
        resultsClassName={resultsClassName}
        searchResponse={searchResponseFiltered}
      >
        {results.map((item: LnpLineInfo) => {
          return (
            <SearchResult className={resultClassName} key={item.short_name}>
              {toChildArray(children).map(
                (child: ReactElement<SearchResultsChildProps<LnpLineInfo>>) => {
                  const onSelectItem = (itemm: LnpLineInfo, evt: Event) => {
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
export default memo(SearchLinesResults);
