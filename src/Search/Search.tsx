import { memo } from "preact/compat";
import { useCallback } from "preact/hooks";

import StopsSearch from "../StopsSearch";
import centerOnStation from "../utils/centerOnStation";
import useMapContext from "../utils/hooks/useMapContext";

import type { StopsSearchProps } from "../StopsSearch/StopsSearch";

function Search(props: StopsSearchProps) {
  const { apikey, map, stopsurl } = useMapContext();

  const onSelect = useCallback(
    (selected) => {
      return centerOnStation(selected, map);
    },
    [map],
  );

  return (
    <StopsSearch
      apikey={apikey}
      onselect={onSelect}
      url={stopsurl}
      {...props}
    />
  );
}
export default memo(Search);
