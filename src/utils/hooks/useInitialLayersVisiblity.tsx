import { getLayersAsFlatArray } from "mobility-toolbox-js/ol";
import { unByKey } from "ol/Observable";
import { useEffect, useRef } from "preact/hooks";

import applyInitialLayerVisibility from "../applyInitialLayerVisibility";

import useInitialPermalink from "./useInitialPermalink";

import type { Map } from "ol";
const useInitialLayersVisiblity = (
  map: Map,
  layers: string,
  permalinkTemplate: string,
) => {
  const isPermalinkAlreadyUsed = useRef(false);
  const permalinkLayersRef = useRef(
    useInitialPermalink(permalinkTemplate)?.layers,
  );

  // Apply initial visibility of layers from layers attribute
  useEffect(() => {
    if (!map) {
      return;
    }
    let layersToUse = layers;

    // We use the permalink param only once, at the first render
    if (
      permalinkLayersRef.current !== null &&
      permalinkLayersRef.current !== undefined &&
      !isPermalinkAlreadyUsed.current
    ) {
      layersToUse = permalinkLayersRef.current;
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
