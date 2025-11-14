import { memo } from "preact/compat";
import { twMerge } from "tailwind-merge";

import { SearchHeadless } from ".";

import type { SearchProps } from "./SearchHeadless";

/**
 * This compoennt only define defult classNames for the Search component.
 *
 * Since the Search component could be used in different places (with or without toolbar),
 * but the logic behind stays the same, we separate the logic and the styles in 2 components.
 */
function Search({
  childrenContainerClassName,
  className,
  inputContainerClassName,
  resultClassName,
  resultsContainerClassName,
  withResultsClassName,
  ...props
}: SearchProps) {
  return (
    <SearchHeadless
      childrenContainerClassName={twMerge(
        "max-h-[300px] rounded-b-2xl bg-white shadow overflow-hidden",
        childrenContainerClassName,
      )}
      className={twMerge(
        "border-grey @container m-0 h-[48px] rounded-2xl border text-base",
        className,
      )}
      inputContainerClassName={twMerge("border-none", inputContainerClassName)}
      resultClassName={twMerge(
        "text-base  **:hover:cursor-pointer p-2",
        resultClassName,
      )}
      resultsContainerClassName={twMerge(
        "min-h-[100px] max-h-[200px] border border-t-0",
        resultsContainerClassName,
      )}
      withResultsClassName={twMerge(
        "text-base !rounded-b-none",
        withResultsClassName,
      )}
      {...props}
    ></SearchHeadless>
  );
}
export default memo(Search);
