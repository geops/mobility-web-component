import { MaplibreLayer } from "mobility-toolbox-js/ol";
import { MaplibreLayerOptions } from "mobility-toolbox-js/ol/layers/MaplibreLayer";
import { memo } from "preact/compat";
import { useEffect, useMemo } from "preact/hooks";

import useMapContext from "../utils/hooks/useMapContext";

export type BaseLayerProps = MaplibreLayerOptions;

function BaseLayer(props: BaseLayerProps) {
  const { apikey, baselayer, map, mapsurl, setBaseLayer } = useMapContext();

  const layer = useMemo(() => {
    if (!baselayer || !apikey) {
      return;
    }
    return new MaplibreLayer({
      apiKey: apikey,
      style: baselayer,
      url: mapsurl,
      zIndex: 0,
      ...(props || {}),
    });
  }, [baselayer, apikey, props, mapsurl]);

  useEffect(() => {
    setBaseLayer(layer);
  }, [layer, setBaseLayer]);

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

export default memo(BaseLayer);
