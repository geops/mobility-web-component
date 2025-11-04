import { memo, useCallback } from "preact/compat";

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

import SearchLinesResult from "../SearchLinesResult";
import SearchLinesResults from "../SearchLinesResults";
import SearchStopsResult from "../SearchStopsResult";
import SearchStopsResults from "../SearchStopsResults";
import centerOnStation from "../utils/centerOnStation";
import useMapContext from "../utils/hooks/useMapContext";

import Search2 from "./Search2";

import type { LnpLineInfo } from "../utils/hooks/useLnp";
import type { StopsFeature } from "../utils/hooks/useSearchStops";

function Search({ ...props }: SearchProps) {
  const { map, setLinesIds, setStationId } = useMapContext();

  const onSelectStop = useCallback(
    (stop: StopsFeature) => {
      setStationId(stop.properties.uid);
      centerOnStation(stop, map);
    },
    [map, setStationId],
  );

  const onSelectLine = useCallback(
    (line: LnpLineInfo) => {
      setLinesIds([line.external_id]);
    },
    [setLinesIds],
  );

  return (
    <Search2 {...props}>
      <SearchStopsResults>
        <SearchStopsResult onSelectItem={onSelectStop} />
      </SearchStopsResults>
      <SearchLinesResults>
        <SearchLinesResult onSelectItem={onSelectLine} />
      </SearchLinesResults>
    </Search2>
  );
}
export default memo(Search);
