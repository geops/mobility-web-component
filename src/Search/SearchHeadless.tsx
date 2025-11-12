import { memo, useCallback } from "preact/compat";

import SearchLinesResult from "../SearchLinesResult";
import SearchLinesResults from "../SearchLinesResults";
import SearchStopsResult from "../SearchStopsResult";
import SearchStopsResults from "../SearchStopsResults";
import useFit from "../utils/hooks/useFit";
import useMapContext from "../utils/hooks/useMapContext";

import { SearchBase } from ".";

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
  const { setLinesIds, setStationId, tenant } = useMapContext();
  const fit = useFit();

  const onSelectStop = useCallback(
    (stop: StopsFeature) => {
      setStationId(stop.properties.uid);
      if (tenant) {
        // It means that the station wil have informations
        fit.current(stop, true);
      }
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

  return (
    <SearchBase {...props}>
      <SearchStopsResults>
        <SearchStopsResult onSelectItem={onSelectStop} />
      </SearchStopsResults>
      <SearchLinesResults>
        <SearchLinesResult onSelectItem={onSelectLine} />
      </SearchLinesResults>
    </SearchBase>
  );
}
export default memo(SearchHeadless);
