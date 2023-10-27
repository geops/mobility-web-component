import { MaplibreLayer } from "mobility-toolbox-js/ol";
import useMapContext from "../utils/hooks/useMapContext";
import { useEffect } from "preact/hooks";
import { memo } from "preact/compat";
import { MobilityMapProps } from "../MobilityMap";

function BaseLayer({ baselayer = "travic_v2", apikey }: MobilityMapProps) {
  const mapContext = useMapContext();
  const { map, setBaseLayer } = mapContext;
  console.log(apikey, baselayer);
  console.log("ICI");
  useEffect(() => {
    console.log("ICI");
    if (!map || !baselayer || !apikey) {
      return;
    }
    console.log("ICI");
    const layer = new MaplibreLayer({
      apiKey: apikey,
      url: `https://maps.geops.io/styles/${baselayer}/style.json`,
    });
    layer.attachToMap(map);
    setBaseLayer(layer);

    return () => {
      layer.detachFromMap();
    };
  }, [map, baselayer, apikey]);

  return null;
}

export default memo(BaseLayer);
