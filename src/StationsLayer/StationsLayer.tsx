import { MaplibreStyleLayer } from "mobility-toolbox-js/ol";
import { memo } from "preact/compat";
import { useEffect, useMemo } from "preact/hooks";

import { LAYER_NAME_STATIONS } from "../utils/constants";
import useMapContext from "../utils/hooks/useMapContext";

import type { MaplibreStyleLayerOptions } from "mobility-toolbox-js/ol";

function StationsLayer(props: Partial<MaplibreStyleLayerOptions>) {
  const { baseLayer, map, setStationsLayer } = useMapContext();

  const layer = useMemo(() => {
    if (!baseLayer) {
      return null;
    }
    return new MaplibreStyleLayer({
      layersFilter: ({ metadata }) => {
        return metadata?.["tralis.variable"] === "station";
      },
      maplibreLayer: baseLayer,
      name: LAYER_NAME_STATIONS,
      ...(props || {}),
    });
  }, [baseLayer, props]);

  useEffect(() => {
    if (!map || !layer) {
      return;
    }
    console.log("ici", layer);
    map.addLayer(layer);
    setStationsLayer(layer);

    return () => {
      map.removeLayer(layer);
      layer.detachFromMap();
    };
  }, [map, setStationsLayer, layer]);

  return null; // <RegisterForSelectFeaturesOnClick />;
}

export default memo(StationsLayer);
