import { fromLonLat } from "ol/proj";

import type { Map } from "ol";

import type { StationFeature } from "../StopsSearch";

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
