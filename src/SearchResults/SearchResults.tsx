import { memo } from "preact/compat";
import { twMerge } from "tailwind-merge";

import useI18n from "../utils/hooks/useI18n";

import type { HTMLAttributes, PreactDOMAttributes } from "preact";

import type { SearchResponse } from "../utils/hooks/useSearchStops";

export type SearchResultsProps = {
  resultsClassName?: string;
  resultsContainerClassName?: string;
  searchResponse: SearchResponse<unknown>;
} & HTMLAttributes<HTMLDivElement> &
  PreactDOMAttributes;

/**
 * Results list of search.
 */
function SearchResults({
  children,
  resultsClassName,
  resultsContainerClassName,
  searchResponse,
}: SearchResultsProps) {
  const { t } = useI18n();

  if (!(searchResponse?.results?.length >= 0)) {
    return null;
  }

  return (
    <div
      className={twMerge(
        "flex grow overflow-auto rounded-md rounded-t-none bg-white shadow",
        resultsContainerClassName,
      )}
    >
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
          className={twMerge(
            "grow rounded-md rounded-t-none border border-solid bg-white p-0",
            resultsClassName,
          )}
          style={{ border: 1 }} // without this th ul is displayed 1 px on the right
        >
          {children}
        </ul>
      )}
    </div>
  );
}

export default memo(SearchResults);
