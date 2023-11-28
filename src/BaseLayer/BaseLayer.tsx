import { MaplibreLayer } from "mobility-toolbox-js/ol";
import { useEffect } from "preact/hooks";
import { memo } from "preact/compat";
import { MapGlLayerOptions } from "mobility-toolbox-js/ol/layers/MapGlLayer";
import useMapContext from "../utils/hooks/useMapContext";

function BaseLayer(props: MapGlLayerOptions) {
  const { baselayer, apikey, map, setBaseLayer } = useMapContext();
  useEffect(() => {
    if (!map || !baselayer || !apikey) {
      return () => {};
    }
    const layer = new MaplibreLayer({
      apiKey: apikey,
      url: `https://maps.geops.io/styles/${baselayer}/style.json`,
      ...(props || {}),
    });
    layer.attachToMap(map);
    setBaseLayer(layer);

    return () => {
      layer.detachFromMap();
    };
  }, [map, baselayer, apikey, setBaseLayer, props]);

  return null;
}

export default memo(BaseLayer);