import { MaplibreLayer } from "mobility-toolbox-js/ol";
import { MapGlLayerOptions } from "mobility-toolbox-js/ol/layers/MapGlLayer";
import { memo } from "preact/compat";
import { useEffect } from "preact/hooks";

import useMapContext from "../utils/hooks/useMapContext";

function BaseLayer(props: MapGlLayerOptions) {
  const { baselayer, apikey, map, mapsurl, setBaseLayer } = useMapContext();
  useEffect(() => {
    if (!map || !baselayer || !apikey) {
      return;
    }
    const layer = new MaplibreLayer({
      apiKey: apikey,
      url: `${mapsurl}/styles/${baselayer}/style.json`,
      ...(props || {}),
    });
    layer.attachToMap(map);
    setBaseLayer(layer);

    return () => {
      layer.detachFromMap();
    };
  }, [map, baselayer, apikey, setBaseLayer, props, mapsurl]);

  return null;
}

export default memo(BaseLayer);
