import { MapsetLayer as MtbMapsetLayer } from "mobility-toolbox-js/ol";
import { memo } from "preact/compat";
import { useEffect, useMemo } from "preact/hooks";

import { LAYER_NAME_MAPSET } from "../utils/constants";
import useMapContext from "../utils/hooks/useMapContext";

import type { MapsetLayerOptions } from "mobility-toolbox-js/ol";

function MapsetLayer(props?: Partial<MapsetLayerOptions>) {
  const {
    apikey,
    baseLayer,
    map,
    mapsetbbox,
    mapsetdonotrevert32pxscaling,
    mapsettags,
    mapsettenants,
    mapsettimestamp,
    mapseturl,
    mapsetzoom,
    setMapsetLayer,
  } = useMapContext();

  const layer = useMemo(() => {
    if (!baseLayer) {
      return null;
    }
    return new MtbMapsetLayer({
      apiKey: apikey,
      bbox: mapsetbbox
        ? mapsetbbox.split(",").map((coord) => {
            return Number(coord.trim());
          })
        : undefined,
      doNotRevert32pxScaling: mapsetdonotrevert32pxscaling === "true",
      // minZoom: 16,
      name: LAYER_NAME_MAPSET,
      tags: mapsettags?.split(",").map((t) => {
        return t.trim();
      }),
      tenants: mapsettenants?.split(",").map((t) => {
        return t.trim();
      }),
      timestamp: mapsettimestamp
        ? new Date(mapsettimestamp).toISOString()
        : undefined,
      url: mapseturl,
      zoom: mapsetzoom ? Number(mapsetzoom) : null,
      ...(props || {}),
    });
  }, [
    apikey,
    baseLayer,
    mapsetbbox,
    mapsetdonotrevert32pxscaling,
    mapsettags,
    mapsettenants,
    mapsettimestamp,
    mapseturl,
    props,
    mapsetzoom,
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

  return null;
}

export default memo(MapsetLayer);
