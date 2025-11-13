import { memo, useCallback } from "preact/compat";

import SearchLinesResult from "../SearchLinesResult";
import SearchLinesResults from "../SearchLinesResults";
import SearchStopsResult from "../SearchStopsResult";
import SearchStopsResults from "../SearchStopsResults";
import SearchTrainsResult from "../SearchTrainsResult";
import SearchTrainsResults from "../SearchTrainsResults";
import useFit from "../utils/hooks/useFit";
import useMapContext from "../utils/hooks/useMapContext";

import { SearchBase } from ".";

import type { RealtimeRouteIdentifierMatch } from "mobility-toolbox-js/types";

import type { IconButtonProps } from "../ui/IconButton/IconButton";
import type { InputProps } from "../ui/Input/Input";
import type { LnpLineInfo } from "../utils/hooks/useLnp";
import type { StopsFeature } from "../utils/hooks/useSearchStops";

import type { SearchBaseProps } from "./SearchBase";

export type SearchProps = {
  cancelButtonProps?: IconButtonProps;
  childrenContainerClassName?: string;
  inputProps?: InputProps;
  resultClassName?: string;
  resultsClassName?: string;
  resultsContainerClassName?: string;
  withResultsClassName?: string;
} & SearchBaseProps;

/**
 * The search logic. To modifiy default classNames look the Search class.
 */
function SearchHeadless({ ...props }: SearchProps) {
  const { setLinesIds, setStationId, setTrainId, tenant } = useMapContext();
  const fit = useFit();

  const onSelectStop = useCallback(
    (stop: StopsFeature) => {
      setStationId(stop.properties.uid);
      // It means that the station wil have informations
      fit.current(stop, !!tenant);
    },
    [fit, setStationId, tenant],
  );

  const onSelectLine = useCallback(
    (line: LnpLineInfo) => {
      setLinesIds([line.external_id]);
      fit.current(line, true);
    },
    [fit, setLinesIds],
  );

  const onSelectTrain = useCallback(
    (match: RealtimeRouteIdentifierMatch) => {
      setTrainId(match.train_id);
      fit.current(match, true);
    },
    [fit, setTrainId],
  );

  return (
    <SearchBase {...props}>
      <SearchStopsResults>
        <SearchStopsResult onSelectItem={onSelectStop} />
      </SearchStopsResults>
      <SearchLinesResults>
        <SearchLinesResult onSelectItem={onSelectLine} />
      </SearchLinesResults>
      <SearchTrainsResults>
        <SearchTrainsResult onSelectItem={onSelectTrain} />
      </SearchTrainsResults>
    </SearchBase>
  );
}
export default memo(SearchHeadless);
