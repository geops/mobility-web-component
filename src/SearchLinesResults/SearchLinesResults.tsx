import { memo } from "preact/compat";
import { useCallback, useContext, useMemo } from "preact/hooks";

import { SearchContext } from "../Search/Search2";
import SearchLinesResult from "../SearchLinesResult/SearchLinesResult";
import SearchResult from "../SearchResult";
import SearchResults from "../SearchResults";
import SearchResultsHeader from "../SearchResultsHeader";
import useI18n from "../utils/hooks/useI18n";
import useSearchLines from "../utils/hooks/useSearchLines";

import type { SearchResultsProps } from "../Search/Search2";
import type { LnpLineInfo } from "../utils/hooks/useLnp";

const defaultSort = (a: LnpLineInfo, b: LnpLineInfo) => {
  if (a.long_name === b.long_name) {
    return a.long_name < b.long_name ? 1 : -1;
  }
  return a.short_name < b.short_name ? 1 : -1;
};

function SearchLinesResults({
  filter,
  onSelect,
  resultClassName,
  resultsClassName,
  resultsContainerClassName,
  sort = defaultSort,
}: SearchResultsProps) {
  const { open, query, setOpen, setSelectedQuery } = useContext(SearchContext);
  const searchResponse = useSearchLines(query);

  const { t } = useI18n();

  const onSelectLine = useCallback(
    (line) => {
      setSelectedQuery(line.short_name || line.long_name);
      setOpen(false);
      onSelect?.(line);
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
      <SearchResultsHeader>{t("search_lines_results")}</SearchResultsHeader>
      <SearchResults
        className={resultsContainerClassName}
        resultsClassName={resultsClassName}
        searchResponse={searchResponseFiltered}
      >
        {results.map((item: LnpLineInfo) => {
          return (
            <SearchResult className={resultClassName} key={item.external_id}>
              <SearchLinesResult line={item} onSelect={onSelectLine} />
            </SearchResult>
          );
        })}
      </SearchResults>
    </>
  );
}
export default memo(SearchLinesResults);
