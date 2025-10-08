import { MapsetLayer as MtbMapsetLayer } from "mobility-toolbox-js/ol";
import { unByKey } from "ol/Observable";
import { transformExtent } from "ol/proj";
import { memo } from "preact/compat";
import { useEffect, useMemo } from "preact/hooks";

import { LAYER_NAME_MAPSET } from "../utils/constants";
import useMapContext from "../utils/hooks/useMapContext";

import type { MapsetLayerOptions } from "mobility-toolbox-js/ol";

let moveEndTimeout: ReturnType<typeof setTimeout>;

function MapsetLayer(props?: Partial<MapsetLayerOptions>) {
  const {
    apikey,
    baseLayer,
    map,
    mapsetbbox,
    mapsetplanid,
    mapsettenants,
    mapseturl,
    setMapsetLayer,
  } = useMapContext();

  const layer = useMemo(() => {
    if (!baseLayer || !map) {
      return null;
    }
    return new MtbMapsetLayer({
      apiKey: apikey,
      bbox:
        mapsetbbox?.split(",").map((coord) => {
          return Number(coord.trim());
        }) ||
        transformExtent(
          map.getView()?.calculateExtent(map.getSize()),
          "EPSG:3857",
          "EPSG:4326",
        ),
      mapseturl: mapseturl || undefined,
      name: LAYER_NAME_MAPSET,
      planId: mapsetplanid ?? undefined,
      tenants: mapsettenants?.split(",").map((t) => {
        return t.trim();
      }),
      zoom: map.getView().getZoom(),
      ...(props || {}),
    });
  }, [
    apikey,
    baseLayer,
    map,
    mapsetbbox,
    mapsettenants,
    mapsetplanid,
    mapseturl,
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
      if (mapsetplanid) {
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

    let listeners = [];
    if (!mapsetplanid) {
      listeners = [
        view.on("change:center", handleMoveEnd),
        view.on("change:resolution", handleMoveEnd),
      ];
    }

    return () => {
      clearTimeout(moveEndTimeout);
      unByKey(listeners);
    };
  }, [map, layer, mapsetplanid]);

  return null;
}

export default memo(MapsetLayer);
