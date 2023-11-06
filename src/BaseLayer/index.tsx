import { MaplibreLayer } from "mobility-toolbox-js/ol";
import { useEffect } from "preact/hooks";
import { memo } from "preact/compat";
import useMapContext from "../utils/hooks/useMapContext";
import type { MobilityMapProps } from "../MobilityMap";

function BaseLayer({ baselayer = "travic_v2", apikey }: MobilityMapProps) {
  const mapContext = useMapContext();
  const { map, setBaseLayer } = mapContext;
  useEffect(() => {
    if (!map || !baselayer || !apikey) {
      return () => {};
    }
    const layer = new MaplibreLayer({
      apiKey: apikey,
      url: `https://maps.geops.io/styles/${baselayer}/style.json`,
    });
    layer.attachToMap(map);
    setBaseLayer(layer);

    return () => {
      layer.detachFromMap();
    };
  }, [map, baselayer, apikey, setBaseLayer]);

  return null;
}

export default memo(BaseLayer);
