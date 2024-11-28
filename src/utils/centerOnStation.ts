import { Map } from "ol";
import { fromLonLat } from "ol/proj";

import { StationFeature } from "../StopsSearch";

const centerOnStation = (selectedStation: StationFeature, map: Map) => {
  const center = selectedStation?.geometry?.coordinates;
  if (center) {
    map?.getView()?.animate({
      center: fromLonLat(center),
      duration: 500,
      zoom: 16,
    });
  }
};

export default centerOnStation;
