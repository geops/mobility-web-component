import { memo } from "preact/compat";
import { useMemo, useState } from "preact/hooks";

import InputSearch from "../ui/InputSearch";
import useI18n from "../utils/hooks/useI18n";

import type { TargetedInputEvent } from "preact";
import type { ReactElement } from "preact/compat";

import type { IconButtonProps } from "../ui/IconButton/IconButton";
import type { InputProps } from "../ui/Input/Input";
import type { InputSearchProps } from "../ui/InputSearch/InputSearch";

export type SearchProps = {
  cancelButtonProps?: IconButtonProps;
  inputProps?: InputProps;
  withResultsClassName?: string;
} & InputSearchProps &
  Pick<
    Partial<SearchResultsProps<unknown>>,
    "resultClassName" | "resultsClassName" | "resultsContainerClassName"
  >;

import { cloneElement, createContext, toChildArray } from "preact";

import type { SearchResultsProps } from "../SearchResults/SearchResults";

export interface SearchContextType {
  open: boolean;
  query: string;
  selectedQuery: string;
  setOpen: (open: boolean) => void;
  setQuery: (query: string) => void;
  setSelectedQuery: (query: string) => void;
}

export const SearchContext = createContext<null | SearchContextType>({
  open: false,
  query: "",
  selectedQuery: "",
  setOpen: () => {},
  setQuery: () => {},
  setSelectedQuery: () => {},
});

function Search({
  cancelButtonProps,
  children,
  inputProps,
  resultClassName,
  resultsClassName,
  resultsContainerClassName,
  withResultsClassName,
  ...props
}: SearchProps) {
  const { t } = useI18n();
  // We use a selectedQuery state to avoid making a new request when we select a result.
  const [selectedQuery, setSelectedQuery] = useState("");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const value = useMemo(() => {
    return {
      open,
      query,
      selectedQuery,
      setOpen,
      setQuery,
      setSelectedQuery,
    };
  }, [open, query, selectedQuery]);

  const inputPropss: InputProps = useMemo(() => {
    return {
      placeholder: t("search_placeholder"),
      ...(inputProps || {}),
      onChange: (evt: TargetedInputEvent<HTMLInputElement>) => {
        setQuery((evt.target as HTMLInputElement).value);
        setSelectedQuery("");
        setOpen(true);
      },
      onFocus: () => {
        setOpen(true);
      },
      value: selectedQuery || query,
    };
  }, [query, selectedQuery, t, inputProps]);

  const cancelButtonPropss: IconButtonProps = useMemo(() => {
    return {
      ...(cancelButtonProps || {}),
      onClick: () => {
        setSelectedQuery("");
        setQuery("");
        setOpen(false);
      },
    };
  }, [cancelButtonProps]);

  const showResults = useMemo(() => {
    return open;
  }, [open]);

  return (
    <SearchContext.Provider value={value}>
      <InputSearch
        {...props}
        cancelButtonProps={cancelButtonPropss}
        inputProps={inputPropss}
        withResultsClassName={showResults ? withResultsClassName : ""}
      >
        <div className={"flex max-h-[300px] flex-col"}>
          {toChildArray(children)?.map((child: ReactElement) => {
            return cloneElement(child, {
              resultClassName,
              resultsClassName,
              resultsContainerClassName,
            });
          })}
          {/*}          {showTrajectoriesResults && (
            <>
              <SearchResultsHeader>
                {t("search_trajectories_results")}
              </SearchResultsHeader>
              <SearchResults
                className={resultsContainerClassName}
                resultsClassName={resultsClassName}
                resultsContainerClassName={"grow"}
                searchResponse={trajectories}
              >
                {trajectories.results.map((trajectory: RealtimeTrajectory) => {
                  return (
                    <SearchResult
                      className={resultClassName}
                      key={trajectory.properties.route_identifier}
                    >
                      <SearchTrajectoriesResult
                        onSelect={onSelectTrajectory}
                        trajectory={trajectory}
                      />
                    </SearchResult>
                  );
                })}
              </SearchResults>
            </>
          )} */}
        </div>
      </InputSearch>
    </SearchContext.Provider>
  );
}
export default memo(Search);
