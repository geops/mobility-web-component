import { MocoLayer } from "mobility-toolbox-js/ol";
import { memo } from "preact/compat";
import { useEffect, useMemo } from "preact/hooks";

import useMapContext from "../utils/hooks/useMapContext";

import type { MocoLayerOptions } from "mobility-toolbox-js/ol/layers/MocoLayer";

function NotificationLayer(props: MocoLayerOptions) {
  const { apikey, baseLayer, map } = useMapContext();

  const layer = useMemo(() => {
    if (!baseLayer) {
      return null;
    }
    return new MocoLayer({
      apiKey: apikey,
      maplibreLayer: baseLayer,
      ...(props || {}),
    });
  }, [apikey, baseLayer, props]);

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

export default memo(NotificationLayer);
