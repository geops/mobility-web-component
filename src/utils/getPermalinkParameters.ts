import { getLayersAsFlatArray } from "mobility-toolbox-js/ol";

import type { Map } from "ol";

// This function return URL parameters representing a map.
const getPermalinkParameters = (
  map: Map,
  urlParams: URLSearchParams = new URLSearchParams(),
): URLSearchParams => {
  const z = map.getView().getZoom();
  const [x, y] = map.getView().getCenter() || [];
  const layers = getLayersAsFlatArray(map.getLayers().getArray())
    .filter((layer) => {
      return layer.get("name") && layer.getVisible();
    })
    .map((layer) => {
      return layer.get("name");
    });

  urlParams.set("layers", layers.join(","));
  if (x >= 0) {
    urlParams.set("x", x.toFixed(2));
  }

  if (y >= 0) {
    urlParams.set("y", y.toFixed(2));
  }

  if (z >= 0) {
    urlParams.set("z", z.toFixed(1));
  }
  return urlParams;
};

export default getPermalinkParameters;
