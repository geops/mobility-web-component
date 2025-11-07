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
        "bg-zinc-100 px-2 py-1 text-xs font-semibold",
        className,
      )}
    >
      {children}
    </div>
  );
}

export default memo(SearchResultsHeader);
