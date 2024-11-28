import StopsSearch from "../StopsSearch";
import centerOnStation from "../utils/centerOnStation";
import useMapContext from "../utils/hooks/useMapContext";

function Search() {
  const { apikey, map, stopsurl } = useMapContext();

  return (
    <StopsSearch
      apikey={apikey}
      onselect={(selected) => {
        return centerOnStation(selected, map);
      }}
      url={stopsurl}
    />
  );
}
export default Search;
