import { memo, useContext, useEffect, useId } from "preact/compat";
import { twMerge } from "tailwind-merge";

import { SearchContext } from "../Search/Search2";
import useI18n from "../utils/hooks/useI18n";

import type { HTMLAttributes, PreactDOMAttributes } from "preact";

import type { SearchResponse } from "../utils/hooks/useSearchStops";

export type SearchResultsProps<T> = {
  className?: string;
  filter?: (item: T) => boolean;
  resultClassName?: string;
  resultsClassName?: string;
  resultsContainerClassName?: string;
  searchResponse?: SearchResponse<T>;
  sort?: (a: T, b: T) => number;
} & HTMLAttributes<HTMLDivElement> &
  PreactDOMAttributes;

export interface SearchResultsChildProps<T> {
  item: T;
  onSelectItem?: (item: T, evt: Event) => void;
}

/**
 * Results list of search.
 */
function SearchResults<T>({
  children,
  className,
  resultsClassName,
  searchResponse,
  ...props
}: SearchResultsProps<T>) {
  const { t } = useI18n();
  const id = useId();
  const { setResults } = useContext(SearchContext);

  // Notify parent about results change
  useEffect(() => {
    if (!searchResponse.isLoading) {
      setResults(id, searchResponse?.results || []);
    }
    return () => {
      setResults(id, []);
    };
  }, [searchResponse, id, setResults]);

  if (!(searchResponse?.results?.length >= 0)) {
    return null;
  }

  return (
    <div className={twMerge("flex grow overflow-hidden", className)} {...props}>
      {searchResponse.results.length === 0 && (
        <div
          className={twMerge(
            "flex grow gap-3 border border-solid p-3 pt-2 text-zinc-400",
            resultsClassName,
          )}
          style={{ border: 1 }}
        >
          <div className="size-6"></div>
          <div>{t("search_no_results")}</div>
        </div>
      )}
      {searchResponse.results.length > 0 && (
        <ul
          className={twMerge("grow overflow-y-auto", resultsClassName)}
          style={{ border: 1 }} // without this th ul is displayed 1 px on the right
        >
          {children}
        </ul>
      )}
    </div>
  );
}

export default memo(SearchResults);
