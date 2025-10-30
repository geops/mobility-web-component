import { MapsetLayer as MtbMapsetLayer } from "mobility-toolbox-js/ol";
import { unByKey } from "ol/Observable";
import { memo } from "preact/compat";
import { useEffect, useMemo } from "preact/hooks";

import { LAYER_NAME_MAPSET } from "../utils/constants";
import useMapContext from "../utils/hooks/useMapContext";

import type { MapsetLayerOptions } from "mobility-toolbox-js/ol";
import type { Feature } from "ol";
import type { EventTypes } from "ol/Observable";

export const isFeatureOutsideZoomLimit = (feature, map) => {
  const zoom = map?.getView()?.getZoom();
  const minZoom = feature.get("minZoom");
  const maxZoom = feature.get("maxZoom");
  return minZoom > zoom || zoom > maxZoom;
};

function MapsetLayer(props?: Partial<MapsetLayerOptions>) {
  const {
    apikey,
    baseLayer,
    map,
    mapsetplanid,
    mapsettags,
    mapsettenants,
    mapsettimestamp,
    mapseturl,
    setMapsetLayer,
  } = useMapContext();

  const layer = useMemo(() => {
    if (!baseLayer || !map) {
      return null;
    }

    return new MtbMapsetLayer({
      apiKey: apikey,
      name: LAYER_NAME_MAPSET,
      planId: mapsetplanid ?? undefined,
      tags: mapsettags?.split(",").map((t) => {
        return t.trim();
      }),
      tenants: mapsettenants?.split(",").map((t) => {
        return t.trim();
      }),
      timestamp: mapsettimestamp, // Load only standard plan
      url: mapseturl,
      ...(props || {}),
    });
  }, [
    baseLayer,
    map,
    apikey,
    mapseturl,
    mapsetplanid,
    mapsettags,
    mapsettenants,
    mapsettimestamp,
    props,
  ]);

  useEffect(() => {
    setMapsetLayer?.(layer);
  }, [layer, setMapsetLayer, map]);

  useEffect(() => {
    if (!map || !layer) {
      return;
    }
    map.addLayer(layer);

    return () => {
      map.removeLayer(layer);
    };
  }, [map, layer]);

  // Apply feature's minzoom and maxzoom to its style
  // TODO should be done by the mapset layer itself
  useEffect(() => {
    let key = null;
    if (layer) {
      key = layer.on("updatefeatures" as EventTypes, () => {
        const features = layer.getSource()?.getFeatures();
        if (!features?.length) {
          return;
        }
        features.forEach((feature) => {
          const styleFunction = feature.getStyleFunction();
          if (styleFunction) {
            (feature as Feature).setStyle((feat, resolution) => {
              if (isFeatureOutsideZoomLimit(feat, layer.getMapInternal())) {
                return null;
              }
              return styleFunction(feature, resolution);
            });
          }
        });
      });
    }

    return () => {
      unByKey(key);
    };
  }, [layer]);

  return null;
}

export default memo(MapsetLayer);
