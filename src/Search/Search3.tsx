import { memo } from "preact/compat";

import type { IconButtonProps } from "../ui/IconButton/IconButton";
import type { InputProps } from "../ui/Input/Input";
import type { InputSearchProps } from "../ui/InputSearch/InputSearch";

export type SearchProps = {
  cancelButtonProps?: IconButtonProps;
  inputProps?: InputProps;
  resultClassName?: string;
  resultsClassName?: string;
  resultsContainerClassName?: string;
  withResultsClassName?: string;
} & InputSearchProps;

import SearchLinesResults from "../SearchLinesResults";
import SearchStopsResults from "../SearchStopsResults";

import Search2 from "./Search2";

function Search({
  resultClassName,
  resultsClassName,
  resultsContainerClassName,
  ...props
}: SearchProps) {
  return (
    <Search2 {...props}>
      <SearchStopsResults
        resultClassName={resultClassName}
        resultsClassName={resultsClassName}
        resultsContainerClassName={resultsContainerClassName}
      />
      <SearchLinesResults
        resultClassName={resultClassName}
        resultsClassName={resultsClassName}
        resultsContainerClassName={resultsContainerClassName}
      />
    </Search2>
  );
}
export default memo(Search);
