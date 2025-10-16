import { MapsetLayer as MtbMapsetLayer } from "mobility-toolbox-js/ol";
import { unByKey } from "ol/Observable";
import { transformExtent } from "ol/proj";
import { memo } from "preact/compat";
import { useEffect, useMemo } from "preact/hooks";

import { LAYER_NAME_MAPSET } from "../utils/constants";
import useMapContext from "../utils/hooks/useMapContext";

import type { MapsetLayerOptions } from "mobility-toolbox-js/ol";

let moveEndTimeout: ReturnType<typeof setTimeout>;

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
    mapsetbbox,
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

    let bbox = undefined;
    if (mapsetbbox) {
      bbox = mapsetbbox?.split(",").map((coord) => {
        return Number(coord.trim());
      });
      if (
        bbox.length === 4 &&
        !bbox.some((coord) => {
          return Number.isNaN(coord);
        })
      ) {
        bbox = transformExtent(bbox, "EPSG:3857", "EPSG:4326");
      }
    } else {
      bbox = transformExtent(
        map.getView()?.calculateExtent(map.getSize()),
        "EPSG:3857",
        "EPSG:4326",
      );
    }
    return new MtbMapsetLayer({
      apiKey: apikey,
      bbox,
      mapseturl: mapseturl || undefined,
      name: LAYER_NAME_MAPSET,
      planId: mapsetplanid ?? undefined,
      tags: mapsettags?.split(",").map((t) => {
        return t.trim();
      }),
      tenants: mapsettenants?.split(",").map((t) => {
        return t.trim();
      }),
      timestamp: mapsettimestamp || new Date().toISOString(), // Load only standard plan
      zoom: map.getView().getZoom(),
      ...(props || {}),
    });
  }, [
    baseLayer,
    map,
    mapsetbbox,
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

  useEffect(() => {
    const view = map?.getView();
    if (!view || !layer) {
      return;
    }
    const handleMoveEnd = () => {
      if (mapsetplanid || !layer.get("visible")) {
        return;
      }
      clearTimeout(moveEndTimeout);
      moveEndTimeout = setTimeout(() => {
        const currentBbox = transformExtent(
          view.calculateExtent(map.getSize()),
          "EPSG:3857",
          "EPSG:4326",
        );
        layer.bbox = currentBbox;
        layer.zoom = view.getZoom();
      }, 100);
    };

    const listeners = [
      layer.on("change:visible", () => {
        if (layer.get("visible")) {
          handleMoveEnd();
        }
      }),
      view.on("change:center", handleMoveEnd),
      view.on("change:resolution", handleMoveEnd),
    ];

    return () => {
      clearTimeout(moveEndTimeout);
      unByKey(listeners);
    };
  }, [map, layer, mapsetplanid]);

  // Apply fetaure's minzoom and maxzoom to its style
  // TODO should be done by the mapset layer itself
  useEffect(() => {
    let key = null;
    if (layer) {
      key = layer.on("updatefeatures", () => {
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
