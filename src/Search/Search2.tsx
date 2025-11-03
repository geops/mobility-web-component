import { memo } from "preact/compat";
import { useCallback, useMemo, useState } from "preact/hooks";

import SearchLinesResult from "../SearchLinesResult";
import SearchResult from "../SearchResult";
import SearchResults from "../SearchResults";
import SearchResultsHeader from "../SearchResultsHeader";
import SearchStopsResult from "../SearchStopsResult";
import SearchTrajectoriesResult from "../SearchTrajectoriesResult";
import InputSearch from "../ui/InputSearch";
import useI18n from "../utils/hooks/useI18n";
import useSearchLines from "../utils/hooks/useSearchLines";
import useSearchStops from "../utils/hooks/useSearchStops";

import type { RealtimeTrajectory } from "mobility-toolbox-js/types";
// import useSearchTrajectories from "../utils/hooks/useSearchTrajectories";
import type { TargetedInputEvent } from "preact";

import type { StopsFeature } from "../SearchResults";
import type { IconButtonProps } from "../ui/IconButton/IconButton";
import type { InputProps } from "../ui/Input/Input";
import type { LnpLineInfo } from "../utils/hooks/useLnp";
import type { SearchResponse } from "../utils/hooks/useSearchStops";

export interface SearchProps {
  cancelButtonProps?: IconButtonProps;
  inputProps?: InputProps;
  resultClassName?: string;
  resultsClassName?: string;
  resultsContainerClassName?: string;
  withResultsClassName?: string;
}

const emptyResultsSearchResults: SearchResponse<RealtimeTrajectory> = {
  isLoading: false,
  results: [],
};

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

  // TODO: we deactivate it for now until backend allow searches on vehicle journeys using the route identifier
  const trajectories = emptyResultsSearchResults; //useSearchTrajectories(query);
  const { t } = useI18n();

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

  const onSelectStop = useCallback((stop) => {
    setSelectedQuery(stop.properties.name);
    setOpen(false);
  }, []);

  const onSelectLine = useCallback((line) => {
    setSelectedQuery(line.short_name || line.long_name);
    setOpen(false);
  }, []);

  const onSelectTrajectory = useCallback((trajectory) => {
    setSelectedQuery(trajectory.properties.route_identifier);
    setOpen(false);
  }, []);

  const showResults = useMemo(() => {
    return (
      open &&
      (!!stops?.results?.length ||
        !!lines?.results?.length ||
        !!trajectories?.results?.length)
    );
  }, [open, stops, lines, trajectories]);

  const showStopsResults = useMemo(() => {
    return open && !!stops?.results?.length;
  }, [open, stops]);

  const showLinesResults = useMemo(() => {
    return open && !!lines?.results?.length;
  }, [open, lines]);

  const showTrajectoriesResults = useMemo(() => {
    return open && !!trajectories?.results?.length;
  }, [open, trajectories]);

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
                {t("search_stops_results")}
              </SearchResultsHeader>
              <SearchResults
                className={resultsContainerClassName}
                resultsClassName={resultsClassName}
                resultsContainerClassName={"grow"}
                searchResponse={stops}
              >
                {stops.results.map((stop: StopsFeature) => {
                  return (
                    <SearchResult
                      className={resultClassName}
                      key={stop.properties.uid}
                    >
                      <SearchStopsResult onSelect={onSelectStop} stop={stop} />
                    </SearchResult>
                  );
                })}
              </SearchResults>
            </>
          )}
          {showLinesResults && (
            <>
              <SearchResultsHeader>
                {t("search_lines_results")}
              </SearchResultsHeader>
              <SearchResults
                className={resultsContainerClassName}
                resultsClassName={resultsClassName}
                resultsContainerClassName={"grow"}
                searchResponse={lines}
              >
                {[...lines.results]
                  .sort((a, b) => {
                    if (a.long_name === b.long_name) {
                      return a.long_name < b.long_name ? 1 : -1;
                    }
                    return a.short_name < b.short_name ? 1 : -1;
                  })
                  .map((line: LnpLineInfo) => {
                    return (
                      <SearchResult
                        className={resultClassName}
                        key={line.external_id}
                      >
                        <SearchLinesResult
                          line={line}
                          onSelect={onSelectLine}
                        />
                      </SearchResult>
                    );
                  })}
              </SearchResults>
            </>
          )}
          {showTrajectoriesResults && (
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
          )}
        </div>
      </InputSearch>
    </>
  );
}
export default memo(Search);
