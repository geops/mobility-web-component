import { getLayersAsFlatArray } from "mobility-toolbox-js/ol";
import { unByKey } from "ol/Observable";
import { useEffect, useRef } from "preact/hooks";

import applyInitialLayerVisibility from "../applyInitialLayerVisibility";

import type { Map } from "ol";
const layersParam = window.location.search
  ? new URLSearchParams(window.location.search).get("layers")
  : null;
const useInitialLayersVisiblity = (map: Map, layers: string) => {
  const isPermalinkAlreadyUsed = useRef(false);
  // Apply initial visibility of layers from layers attribute
  useEffect(() => {
    if (!map) {
      return;
    }
    let layersToUse = layers;

    // We use the permalink param only once, at the first render
    if (
      layersParam !== null &&
      layersParam !== undefined &&
      !isPermalinkAlreadyUsed.current
    ) {
      layersToUse = layersParam;
      isPermalinkAlreadyUsed.current = true;
    }

    getLayersAsFlatArray(map.getLayers().getArray()).forEach((layer) => {
      applyInitialLayerVisibility(layersToUse, layer);
    });

    const key = map.getLayers().on("add", (event) => {
      applyInitialLayerVisibility(layersToUse, event.element);
    });
    return () => {
      unByKey(key);
    };
  }, [map, layers]);

  return null;
};

export default useInitialLayersVisiblity;
