import { memo } from "preact/compat";
import { useCallback } from "preact/hooks";

import StopsSearch from "../StopsSearch";
import centerOnStation from "../utils/centerOnStation";
import useMapContext from "../utils/hooks/useMapContext";

function Search() {
  const { apikey, map, stopsurl } = useMapContext();

  const onSelect = useCallback(
    (selected) => {
      return centerOnStation(selected, map);
    },
    [map],
  );

  return <StopsSearch apikey={apikey} onselect={onSelect} url={stopsurl} />;
}
export default memo(Search);
