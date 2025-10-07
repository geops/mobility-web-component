import { MaplibreStyleLayer } from "mobility-toolbox-js/ol";
import { memo } from "preact/compat";
import { useEffect, useMemo } from "preact/hooks";

import { LAYERS_NAMES } from "../utils/constants";
import useMapContext from "../utils/hooks/useMapContext";

import type { MaplibreStyleLayerOptions } from "mobility-toolbox-js/ol/layers/MaplibreStyleLayer";

function LinesNetworkPlanLayer(props: MaplibreStyleLayerOptions) {
  const { baseLayer, map, setLinesNetworkPlanLayer } = useMapContext();

  const layer = useMemo(() => {
    if (!baseLayer) {
      return null;
    }
    return new MaplibreStyleLayer({
      layersFilter: ({ metadata, source }) => {
        return (
          metadata?.["geops.filter"]?.startsWith("netzplan") ||
          source === "network_plans"
        );
      },
      maplibreLayer: baseLayer,
      name: LAYERS_NAMES.linesnetworkplan,
      queryRenderedLayersFilter: ({ metadata }) => {
        return metadata?.["geops.filter"] === "netzplan_trips_info";
      },
      ...(props || {}),
    });
  }, [baseLayer, props]);

  useEffect(() => {
    setLinesNetworkPlanLayer?.(layer);
  }, [layer, setLinesNetworkPlanLayer]);

  useEffect(() => {
    if (!map || !layer) {
      return;
    }

    map.addLayer(layer);
    return () => {
      map.removeLayer(layer);
    };
  }, [map, layer]);

  return null; // <RegisterForSelectFeaturesOnClick />;
}

export default memo(LinesNetworkPlanLayer);
