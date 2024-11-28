import { MaplibreLayer } from "mobility-toolbox-js/ol";
import { MaplibreLayerOptions } from "mobility-toolbox-js/ol/layers/MaplibreLayer";
import { Layer } from "ol/layer";
import { memo } from "preact/compat";
import { useEffect } from "preact/hooks";

import useMapContext from "../utils/hooks/useMapContext";

function BaseLayer(props: MaplibreLayerOptions) {
  const { apikey, baselayer, map, mapsurl, setBaseLayer } = useMapContext();
  useEffect(() => {
    if (!map || !baselayer || !apikey) {
      return;
    }
    const layer = new MaplibreLayer({
      apiKey: apikey,
      style: baselayer,
      url: mapsurl,
      ...(props || {}),
    });
    const baseLayer = layer as unknown as Layer;

    // TODO: find why the setZIndex is not found
    baseLayer.setZIndex(0);
    map.addLayer(baseLayer);
    setBaseLayer(layer);

    return () => {
      map?.removeLayer(baseLayer);
    };
  }, [map, baselayer, apikey, setBaseLayer, props, mapsurl]);

  return null;
}

export default memo(BaseLayer);
