import { memo } from "preact/compat";
import { twMerge } from "tailwind-merge";

import type { HTMLAttributes, PreactDOMAttributes } from "preact";

export type SearchResultProps = {
  className?: string;
} & HTMLAttributes<HTMLLIElement> &
  PreactDOMAttributes;

function SearchResult({ children, className, ...props }: SearchResultProps) {
  return (
    <li
      {...props}
      className={twMerge(
        "border-b border-dashed border-slate-300 p-3 last:border-0",
        className,
      )}
    >
      {children}
    </li>
  );
}

export default memo(SearchResult);
