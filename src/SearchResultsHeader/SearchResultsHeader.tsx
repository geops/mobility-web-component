import { memo } from "preact/compat";
import { twMerge } from "tailwind-merge";

import type { HTMLAttributes, PreactDOMAttributes } from "preact";

export type SearchResultsHeaderProps = {
  className?: string;
  resultsClassName?: string;
} & HTMLAttributes<HTMLDivElement> &
  PreactDOMAttributes;

/**
 * Header of list of search results.
 */
function SearchResultsHeader({
  children,
  className,
  ...props
}: SearchResultsHeaderProps) {
  return (
    <div
      {...props}
      className={twMerge(
        "rounded-t-md bg-zinc-100 px-3 py-2 font-semibold",
        className,
      )}
    >
      {children}
    </div>
  );
}

export default memo(SearchResultsHeader);
