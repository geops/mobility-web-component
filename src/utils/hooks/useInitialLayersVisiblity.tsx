import { getLayersAsFlatArray } from "mobility-toolbox-js/ol";
import { unByKey } from "ol/Observable";
import { useEffect, useRef } from "preact/hooks";

import applyInitialLayerVisibility from "../applyInitialLayerVisibility";

import useInitialPermalink from "./useInitialPermalink";

import type { Map } from "ol";
import type { Group } from "ol/layer";
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

    // We reverse the array to begin by the end of the tree (so the group layers are applied last)
    const layersAsArray = getLayersAsFlatArray(map.getLayers().getArray());
    layersAsArray.forEach((layer) => {
      applyInitialLayerVisibility(layersToUse, layer);
    });

    // Hide group if there is no children visible
    layersAsArray
      .filter((l) => {
        return (l as Group).getLayers;
      })
      .forEach((layer) => {
        if (
          layer.getVisible() &&
          !(layer as Group)
            .getLayers()
            ?.getArray()
            .some((l) => {
              return l.getVisible();
            })
        ) {
          layer.setVisible(false);
        }
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
