import { memo } from "preact/compat";
import { useCallback, useMemo, useState } from "preact/hooks";

import SearchLinesResult from "../SearchLinesResult";
import SearchResults from "../SearchResults";
import SearchResultsHeader from "../SearchResultsHeader";
import SearchStopsResult from "../SearchStopsResult";
import InputSearch from "../ui/InputSearch";
import useI18n from "../utils/hooks/useI18n";
import useSearchLines from "../utils/hooks/useSearchLines";
import useSearchStops from "../utils/hooks/useSearchStops";

import type { TargetedInputEvent } from "preact";

import type { StopsFeature } from "../SearchResults";
import type { IconButtonProps } from "../ui/IconButton/IconButton";
import type { InputProps } from "../ui/Input/Input";
import type { LineInfo } from "../utils/hooks/useLnp";

export interface SearchProps {
  cancelButtonProps?: IconButtonProps;
  inputProps?: InputProps;
  resultClassName?: string;
  resultsClassName?: string;
  resultsContainerClassName?: string;
  withResultsClassName?: string;
}

function Search({
  cancelButtonProps,
  inputProps,
  resultClassName,
  resultsClassName,
  resultsContainerClassName,
  withResultsClassName,
  ...props
}: SearchProps) {
  // We use a selectedQuery state to avoid making a new request when we select a result.
  const [selectedQuery, setSelectedQuery] = useState("");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const stops = useSearchStops(query);
  const lines = useSearchLines(query);
  const { t } = useI18n();

  const inputPropss: InputProps = useMemo(() => {
    return {
      placeholder: t("stops_search_placeholder"),
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

  const onSelectStop = useCallback((stop) => {
    setSelectedQuery(stop.properties.name);
    setOpen(false);
  }, []);

  const onSelectLine = useCallback((line) => {
    setSelectedQuery(line.short_name || line.long_name);
    setOpen(false);
  }, []);

  const showResults = useMemo(() => {
    return open && (!!stops?.results?.length || !!lines?.results?.length);
  }, [open, stops, lines]);

  const showStopsResults = useMemo(() => {
    return open && !!stops?.results?.length;
  }, [open, stops]);

  const showLinesResults = useMemo(() => {
    return open && !!lines?.results?.length;
  }, [open, lines]);

  return (
    <>
      <InputSearch
        {...props}
        cancelButtonProps={cancelButtonPropss}
        inputProps={inputPropss}
        withResultsClassName={showResults ? withResultsClassName : ""}
      >
        <div className={"flex max-h-[300px] flex-col"}>
          {showStopsResults && (
            <>
              <SearchResultsHeader>
                {t("search_stops_results") || "Stops"}
              </SearchResultsHeader>
              <SearchResults
                className={resultsContainerClassName}
                resultsClassName={resultsClassName}
                resultsContainerClassName={"grow"}
                searchResponse={stops}
              >
                {stops.results.map((stop: StopsFeature) => {
                  return (
                    <SearchStopsResult
                      className={resultClassName}
                      key={stop.properties.uid}
                      onSelect={onSelectStop}
                      stop={stop}
                    />
                  );
                })}
              </SearchResults>
            </>
          )}
          {showLinesResults && (
            <>
              <SearchResultsHeader>
                {t("search_lines_results") || "Lines"}
              </SearchResultsHeader>
              <SearchResults
                className={resultsContainerClassName}
                resultsClassName={resultsClassName}
                resultsContainerClassName={"grow"}
                searchResponse={lines}
              >
                {lines.results.map((line: LineInfo) => {
                  return (
                    <SearchLinesResult
                      key={line.external_id}
                      line={line}
                      onSelect={onSelectLine}
                    />
                  );
                })}
              </SearchResults>
            </>
          )}
        </div>
      </InputSearch>
    </>
  );
}
export default memo(Search);
