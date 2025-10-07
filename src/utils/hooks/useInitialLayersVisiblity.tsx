import { getLayersAsFlatArray } from "mobility-toolbox-js/ol";
import { unByKey } from "ol/Observable";
import { useEffect } from "preact/hooks";

import applyInitialLayerVisibility from "../applyInitialLayerVisibility";

import type { Map } from "ol";

const useInitialLayersVisiblity = (map: Map, layers: string) => {
  // Apply initial visibility of layers from layers attribute
  useEffect(() => {
    if (!map) {
      return;
    }
    getLayersAsFlatArray(map.getLayers().getArray()).forEach((layer) => {
      applyInitialLayerVisibility(layers, layer);
    });

    const key = map.getLayers().on("add", (event) => {
      applyInitialLayerVisibility(layers, event.element);
    });
    return () => {
      unByKey(key);
    };
  }, [map, layers]);
  return null;
};

export default useInitialLayersVisiblity;
