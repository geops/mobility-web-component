import { MapboxStyleLayer } from "mobility-toolbox-js/ol";
import { useEffect, useMemo } from "preact/hooks";
import { memo } from "preact/compat";
import { MapGlLayerOptions } from "mobility-toolbox-js/ol/layers/MapGlLayer";
import useMapContext from "../utils/hooks/useMapContext";

function StationsLayer(props: MapGlLayerOptions) {
  const { baseLayer, map, setStationsLayer } = useMapContext();

  const layer = useMemo(() => {
    if (!baseLayer) {
      return null;
    }
    return new MapboxStyleLayer({
      mapboxLayer: baseLayer,
      styleLayersFilter: ({ metadata }) => {
        return metadata?.["tralis.variable"] === "station";
      },
      ...(props || {}),
    });
  }, [baseLayer, props]);

  useEffect(() => {
    if (!map || !layer) {
      return () => {};
    }

    layer.attachToMap(map);
    setStationsLayer(layer);

    return () => {
      layer.detachFromMap();
    };
  }, [map, setStationsLayer, layer]);

  return null; // <RegisterForSelectFeaturesOnClick />;
}

export default memo(StationsLayer);
