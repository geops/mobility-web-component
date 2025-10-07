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
    mapsetplanid,
    mapsettenants,
    setMapsetLayer,
  } = useMapContext();

  const layer = useMemo(() => {
    if (!baseLayer) {
      return null;
    }
    return new MtbMapsetLayer({
      apiKey: apikey,
      bbox: mapsetbbox?.split(",").map((coord) => {
        return Number(coord.trim());
      }),
      name: LAYER_NAME_MAPSET,
      planId: mapsetplanid ?? undefined,
      tenants: mapsettenants?.split(",").map((t) => {
        return t.trim();
      }),
      ...(props || {}),
    });
  }, [apikey, baseLayer, mapsetbbox, mapsettenants, mapsetplanid, props]);

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
